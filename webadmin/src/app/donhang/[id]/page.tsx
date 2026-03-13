'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Printer, CheckCircle, Truck, XCircle, Clock, HelpCircle } from 'lucide-react';
import api from '@/constants/api';
import Link from 'next/link';

// Define interfaces for the detailed order structure
interface SanPham {
  tenSanPham: string;
  hinhAnh: string;
}

interface ChiTietYeuCauDon {
  soLuong: number;
  gia: number;
  sanPham: SanPham;
  trangThai: string; // Add status for each item
}

interface OrderDetail {
  id: {
    maDonHang: number;
  };
  khachHang: {
    hoTen: string;
    sdt: string;
    email: string;
  };
  ngayTaoDon: string;
  tongTien: number | null;
  trangThaiThanhToan: string;
  thoiGianThanhToan: string | null; // Add payment time
  thanhToan: {
    kieuThanhToan: string;
  };
  chiTietYeuCauDons: ChiTietYeuCauDon[];
}

const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case 'Thành công':
      return { text: 'Đã thanh toán', color: 'text-green-600', icon: <CheckCircle /> };
    case 'chưa thanh toán':
      return { text: 'Chờ thanh toán', color: 'text-yellow-600', icon: <Clock /> };
    case 'Đã hủy':
      return { text: 'Thanh toán bị hủy', color: 'text-red-600', icon: <XCircle /> };
    default:
      return { text: status, color: 'text-gray-600', icon: <HelpCircle /> };
  }
};

const getOrderStatusInfo = (items: ChiTietYeuCauDon[]) => {
  if (!items || items.length === 0) {
    return { text: 'Không có sản phẩm', color: 'text-gray-600', icon: <HelpCircle /> };
  }

  const allStatuses = items.map(item => item.trangThai);

  if (allStatuses.every(s => s === 'hoàn thành')) {
    return { text: 'Hoàn thành', color: 'text-green-600', icon: <CheckCircle /> };
  }
  if (allStatuses.some(s => s === 'đã hủy')) {
    return { text: 'Đã hủy', color: 'text-red-600', icon: <XCircle /> };
  }
  if (allStatuses.every(s => s === 'chờ xác nhận')) {
    return { text: 'Chờ xác nhận', color: 'text-yellow-600', icon: <Clock /> };
  }
  return { text: 'Đang xử lý', color: 'text-blue-600', icon: <Truck /> };
};

const getItemStatusColor = (status: string) => {
  switch (status) {
    case 'hoàn thành': return 'text-green-600';
    case 'chờ xác nhận': return 'text-yellow-600';
    case 'đang chuẩn bị': return 'text-blue-600';
    case 'đã hủy': return 'text-red-600';
    default: return 'text-gray-500';
  }
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;
  const idRestaurant = searchParams.get('idRestaurant');

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    if (id && idRestaurant) {
      const fetchOrderDetail = async () => {
        try {
          const response = await api.get(`/yeu-cau-don/${id}/${idRestaurant}`);
          if (response.status !== 200) {
            throw new Error('Failed to fetch order details');
          }
          setOrder(response.data);
        } catch (err) {
          setError('Không tìm thấy đơn hàng hoặc có lỗi xảy ra.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetail();
    } else {
      setLoading(false);
      setError('Thiếu thông tin mã đơn hàng hoặc mã nhà hàng.');
    }
  }, [id, idRestaurant, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Đang tải chi tiết đơn hàng...</p></div>;
  }

  if (error || !order) {
    return <div className="flex min-h-screen items-center justify-center"><p>{error}</p></div>;
  }

  const paymentStatusInfo = getPaymentStatusInfo(order.trangThaiThanhToan);
  const orderStatusInfo = getOrderStatusInfo(order.chiTietYeuCauDons);

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/donhang" className="p-2 rounded-full hover:bg-gray-200 transition">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Chi tiết Đơn hàng #{order.id.maDonHang}</h1>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Trạng thái</h2>
                  <div className="flex flex-col gap-2">
                    <p className={`flex items-center gap-2 font-semibold ${orderStatusInfo.color}`}>
                      {orderStatusInfo.icon} Trạng thái đơn: {orderStatusInfo.text}
                    </p>
                    <p className={`flex items-center gap-2 font-semibold ${paymentStatusInfo.color}`}>
                      {paymentStatusInfo.icon} Trạng thái thanh toán: {paymentStatusInfo.text}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-right">
                  Ngày tạo: <br /> {new Date(order.ngayTaoDon).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Các sản phẩm</h2>
              <div className="space-y-4">
                {order.chiTietYeuCauDons.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">{item.sanPham.tenSanPham}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.soLuong}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className="font-semibold text-gray-800">{(item.gia * item.soLuong).toLocaleString('vi-VN')}đ</p>
                      <p className={`text-sm font-bold capitalize ${getItemStatusColor(item.trangThai)}`}>{item.trangThai}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t my-4"></div>
              <div className="space-y-2 text-right">
                <p className="text-gray-500">Tổng phụ: <span className="font-semibold text-gray-800">{(order.tongTien || 0).toLocaleString('vi-VN')}đ</span></p>
                <p className="text-xl font-bold text-gray-900">Tổng cộng: <span className="text-blue-600">{(order.tongTien || 0).toLocaleString('vi-VN')}đ</span></p>
              </div>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin khách hàng</h2>
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">{order.khachHang.hoTen}</p>
                <p className="text-sm text-gray-500">{order.khachHang.email}</p>
                <p className="text-sm text-gray-500">{order.khachHang.sdt}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin thanh toán</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Phương thức: <span className="font-semibold text-gray-800">{order.thanhToan.kieuThanhToan}</span></p>
                {order.thoiGianThanhToan && (
                  <p className="text-gray-600">
                    Thời gian: <span className="font-semibold text-gray-800">{new Date(order.thoiGianThanhToan).toLocaleString('vi-VN')}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Hành động</h2>
              <div className="flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                  <Printer size={20} /> In hóa đơn
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition">
                  Cập nhật trạng thái
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
