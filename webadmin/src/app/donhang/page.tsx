'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Search, PlusCircle, FileDown, CheckCircle, Truck, Clock, XCircle, HelpCircle } from 'lucide-react';
import api from '@/constants/api';

interface OrderId {
  maDonHang: number;
  idRestaurant: number;
}

interface ChiTietYeuCauDon {
  trangThai: string;
}

interface Order {
  id: OrderId;
  khachHang: {
    hoTen: string;
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

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Thành công':
      return 'bg-green-100 text-green-700';
    case 'chưa thanh toán':
      return 'bg-yellow-100 text-yellow-700';
    case 'Đã hủy':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getOrderStatusInfo = (items: ChiTietYeuCauDon[]) => {
    if (!items || items.length === 0) {
        return { text: 'N/A', color: 'bg-gray-100 text-gray-700' };
    }

    const allStatuses = items.map(item => item.trangThai);

    if (allStatuses.every(s => s === 'hoàn thành')) {
        return { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
    }
    if (allStatuses.some(s => s === 'đã hủy')) {
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-700' };
    }
    if (allStatuses.every(s => s === 'chờ xác nhận')) {
        return { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' };
};

export default function DonHangPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/yeu-cau-don');
        
        if (response.status !== 200) {
          throw new Error('Failed to fetch orders');
        }

        setOrders(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Đang tải dữ liệu đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm text-gray-600 font-medium hover:bg-gray-50 transition">
                <FileDown size={20} /> Xuất File
            </button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Mã Đơn</th>
                  <th className="p-4 font-medium">Khách hàng</th>
                  <th className="p-4 font-medium">Ngày tạo</th>
                  <th className="p-4 font-medium">Thời gian TT</th>
                  <th className="p-4 font-medium">Tổng tiền</th>
                  <th className="p-4 font-medium">Thanh toán</th>
                  <th className="p-4 font-medium text-center">Trạng thái TT</th>
                  <th className="p-4 font-medium text-center">Trạng thái đơn</th>
                  <th className="p-4 font-medium text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order) => {
                  const orderStatusInfo = getOrderStatusInfo(order.chiTietYeuCauDons);
                  return (
                    <tr key={order.id.maDonHang} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition">
                      <td className="p-4 font-medium text-blue-600">#{order.id.maDonHang}</td>
                      <td className="p-4 text-gray-800">{order.khachHang?.hoTen || 'N/A'}</td>
                      <td className="p-4 text-gray-500">{order.ngayTaoDon ? new Date(order.ngayTaoDon).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                      <td className="p-4 text-gray-500">{order.thoiGianThanhToan ? new Date(order.thoiGianThanhToan).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                      <td className="p-4 font-bold text-gray-800">{(order.tongTien || 0).toLocaleString('vi-VN')}đ</td>
                      <td className="p-4 text-gray-500">{order.thanhToan?.kieuThanhToan || 'N/A'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.trangThaiThanhToan)}`}>
                          {order.trangThaiThanhToan}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${orderStatusInfo.color}`}>
                          {orderStatusInfo.text}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link href={`/donhang/${order.id.maDonHang}?idRestaurant=${order.id.idRestaurant}`} className="text-blue-600 hover:underline">
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
           <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">Hiển thị 1 đến {orders.length} của {orders.length} kết quả</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 text-sm">Trước</button>
                    <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white text-sm">1</button>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 text-sm">2</button>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 text-sm">Sau</button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
