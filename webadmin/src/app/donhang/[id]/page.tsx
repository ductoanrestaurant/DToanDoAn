'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Printer, CheckCircle, Truck, XCircle, Clock, HelpCircle } from 'lucide-react';
import api, { BASE_URL_IMG, ENDPOINTS } from '@/constants/api';
import Link from 'next/link';

// Define interfaces for the detailed order structure
interface SanPham {
  tenSanPham: string;
  hinhAnh: string;
}

interface ChiTietYeuCauDon {
  id: {
    maDonHang: number;
    maSanPham: number;
    idRestaurant: number;
  };
  soLuong: number;
  gia: number;
  sanPham: SanPham;
  trangThai: string;
}

interface OrderDetail {
  id: {
    maDonHang: number;
    idRestaurant?: number;
  };
  khachHang: {
    hoTen: string;
    sdt: string;
    email: string;
  };
  ngayTaoDon: string;
  tongTien: number | null;
  trangThaiThanhToan: string;
  thoiGianThanhToan: string | null;
  thanhToan: {
    kieuThanhToan: string;
  };
  giamGia?: {
    code: string;
    giaTri: number;
    moTa: string;
  };
  nhanVien?: {
    tenNhanVien: string;
  };
  chiTietYeuCauDons: ChiTietYeuCauDon[];
}

interface Restaurant {
  idRestaurant: number;
  bankId: string;
  accountNo: string;
  template: string;
  accountName: string;
  content: string;
}

const getPaymentStatusInfo = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'thành công':
    case 'đã thanh toán':
      return { text: 'Đã thanh toán', color: 'text-green-600', icon: <CheckCircle /> };
    case 'chưa thanh toán':
      return { text: 'Chưa thanh toán', color: 'text-yellow-600', icon: <Clock /> };
    case 'đã hủy':
      return { text: 'Thanh toán bị hủy', color: 'text-red-600', icon: <XCircle /> };
    default:
      return { text: status, color: 'text-gray-600', icon: <HelpCircle /> };
  }
};

const getOrderStatusInfo = (items: ChiTietYeuCauDon[]) => {
  if (!items || items.length === 0) {
    return { text: 'Không có sản phẩm', color: 'text-gray-600', icon: <HelpCircle /> };
  }

  const allStatuses = items.map(item => item.trangThai.toLowerCase());
  const isFinished = (s: string) => ['hoàn thành', 'đang dùng bữa', 'đã hủy'].includes(s);

  if (allStatuses.every(s => s === 'đã hủy')) {
    return { text: 'Đã hủy', color: 'text-red-600', icon: <XCircle /> };
  }

  if (allStatuses.every(s => s === 'hoàn thành' || s === 'đã hủy') && allStatuses.some(s => s === 'hoàn thành')) {
    return { text: 'Hoàn thành', color: 'text-green-600', icon: <CheckCircle /> };
  }

  if (allStatuses.every(isFinished)) {
      return { text: 'Đang dùng bữa', color: 'text-purple-600', icon: <CheckCircle /> };
  }

  if (allStatuses.some(s => s === 'đang chuẩn bị')) {
      return { text: 'Đang chuẩn bị', color: 'text-blue-600', icon: <Truck /> };
  }

  if (allStatuses.some(isFinished) && allStatuses.some(s => s === 'chờ xác nhận')) {
      return { text: 'Đang xử lý', color: 'text-blue-600', icon: <Truck /> };
  }

  if (allStatuses.every(s => s === 'chờ xác nhận')) {
    return { text: 'Chờ xác nhận', color: 'text-yellow-600', icon: <Clock /> };
  }

  return { text: 'Đang xử lý', color: 'text-blue-600', icon: <Truck /> };
};

const getItemStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'hoàn thành': return 'text-green-600';
    case 'đang dùng bữa': return 'text-purple-600';
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
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!id || !idRestaurant) return;
    try {
      const response = await api.get(`/yeu-cau-don/${id}/${idRestaurant}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch order details');
      }
      setOrder(response.data);

      try {
        const resRes = await api.get(`/restaurant/${idRestaurant}`);
        if (resRes.status === 200) {
          setRestaurant(resRes.data);
        }
      } catch (e) {
        console.error('Không thể tải thông tin nhà hàng', e);
      }
    } catch (err) {
      setError('Không tìm thấy đơn hàng hoặc có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  }, [id, idRestaurant]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    if (id && idRestaurant) {
      fetchOrderDetail();
    } else {
      setLoading(false);
      setError('Thiếu thông tin mã đơn hàng hoặc mã nhà hàng.');
    }
  }, [id, idRestaurant, router, fetchOrderDetail]);

  const handleApplyStatus = async (newStatus: 'đang dùng bữa' | 'hoàn thành') => {
    if (!order || !idRestaurant) return;

    if (
      !window.confirm(
        `Bạn chắc chắn muốn cập nhật tất cả món (trừ món đã hủy/hoàn thành) sang trạng thái "${newStatus}"?`
      )
    ) {
      return;
    }

    try {
      const updatePromises = order.chiTietYeuCauDons.map((item) => {
        if (
          item.id &&
          item.id.maSanPham &&
          item.trangThai.toLowerCase() !== 'đã hủy' &&
          item.trangThai.toLowerCase() !== newStatus
        ) {
          return api.put(
            `/yeu-cau-don/chi-tiet/trang-thai?maDonHang=${order.id.maDonHang}&idRestaurant=${idRestaurant}&maSanPham=${item.id.maSanPham}`,
            { trangThai: newStatus }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Nếu hoàn thành và thanh toán tiền mặt -> chuyển trạng thái thanh toán sang "đã thanh toán"
      if (newStatus === 'hoàn thành' && order.thanhToan?.kieuThanhToan?.toLowerCase() === 'tiền mặt') {
        try {
          await api.put(`/yeu-cau-don/${order.id.maDonHang}/${idRestaurant}`, {
            ...order,
            trangThaiThanhToan: 'đã thanh toán',
          });
        } catch (e) {
          console.error('Lỗi khi cập nhật trạng thái thanh toán:', e);
        }
      }

      alert('Cập nhật trạng thái thành công!');
      setShowStatusOptions(false);
      fetchOrderDetail();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `${BASE_URL_IMG}/${imagePath}`;
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Đang tải chi tiết đơn hàng...</p></div>;
  }

  if (error || !order) {
    return <div className="flex min-h-screen items-center justify-center"><p>{error}</p></div>;
  }

  const paymentStatusInfo = getPaymentStatusInfo(order.trangThaiThanhToan);
  const orderStatusInfo = getOrderStatusInfo(order.chiTietYeuCauDons);
  const isCompleted = order.chiTietYeuCauDons.every(item => item.trangThai.toLowerCase() === 'hoàn thành' || item.trangThai.toLowerCase() === 'đã hủy');
  
  const subtotal = order.chiTietYeuCauDons.reduce((sum, item) => sum + (item.gia * item.soLuong), 0);
  const finalTotal = order.tongTien ?? subtotal;
  const discountAmount = subtotal > finalTotal ? subtotal - finalTotal : 0;

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen font-sans relative">
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
                {order.chiTietYeuCauDons.map((item, index) => {
                  const imageUrl = item.sanPham.hinhAnh ? getFullImageUrl(item.sanPham.hinhAnh) : '';

                  return (
                    <div key={index} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
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
                  );
                })}
              </div>
              <div className="border-t my-4"></div>
              <div className="space-y-2 text-right">
                <p className="text-gray-500">Tạm tính: <span className="font-semibold text-gray-800">{subtotal.toLocaleString('vi-VN')}đ</span></p>
                {discountAmount > 0 && (
                  <p className="text-gray-500">Tổng giảm giá: <span className="font-semibold text-red-500">-{discountAmount.toLocaleString('vi-VN')}đ</span></p>
                )}
                <p className="text-xl font-bold text-gray-900">Tổng cộng: <span className="text-blue-600">{finalTotal.toLocaleString('vi-VN')}đ</span></p>
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

            {order.nhanVien && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Nhân viên order</h2>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">Tên nhân viên: {order.nhanVien.tenNhanVien}</p>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin thanh toán</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Phương thức: <span className="font-semibold text-gray-800">{order.thanhToan.kieuThanhToan}</span></p>
                {order.giamGia && (
                  <p className="text-gray-600">
                    Mã giảm giá: <span className="font-semibold text-gray-800">{order.giamGia.code} (-{order.giamGia.giaTri.toLocaleString('vi-VN')} {order.giamGia.giaTri > 100 ? 'đ' : '%'})</span>
                  </p>
                )}
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
                <button 
                  onClick={() => setShowInvoicePopup(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  <Printer size={20} /> In hóa đơn
                </button>
                <button
                    onClick={() => setShowStatusOptions((prev) => !prev)}
                    disabled={isCompleted}
                    className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition ${isCompleted ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {isCompleted ? 'Đã hoàn thành' : 'Cập nhật trạng thái'}
                </button>
                {!isCompleted && showStatusOptions && (
                  <div className="flex flex-col gap-2 mt-1">
                    <button
                      onClick={() => handleApplyStatus('đang dùng bữa')}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                    >
                      Checkin (đang dùng bữa)
                    </button>
                    <button
                      onClick={() => handleApplyStatus('hoàn thành')}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                    >
                      Hoàn thành
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invoice Popup */}
      {showInvoicePopup && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[100] p-4 print:bg-transparent print:p-0">
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #invoice-popup-content, #invoice-popup-content * {
                visibility: visible;
              }
              #invoice-popup-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
              }
            }
          `}} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col print:shadow-none print:bg-transparent print:max-h-none print:overflow-visible">
            <div className="p-6 flex-1 print:p-2 bg-white" id="invoice-popup-content">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 uppercase">HÓA ĐƠN THANH TOÁN</h2>
                <p className="text-gray-500">Mã đơn: #{order.id.maDonHang}</p>
                <p className="text-sm text-gray-500">{new Date(order.ngayTaoDon).toLocaleString('vi-VN')}</p>
                {restaurant && (
                  <p className="text-sm text-gray-800 mt-2 font-semibold">DUCTOAN RESTAURANT</p>
                )}
              </div>

              <div className="mb-6 space-y-1">
                <p className="text-gray-700"><span className="font-semibold">Khách hàng:</span> {order.khachHang.hoTen}</p>
                <p className="text-gray-700"><span className="font-semibold">SĐT:</span> {order.khachHang.sdt}</p>
                {order.nhanVien && (
                  <p className="text-gray-700"><span className="font-semibold">Nhân viên:</span> {order.nhanVien.tenNhanVien}</p>
                )}
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b-2 border-dashed border-gray-300">
                    <th className="py-2 text-left text-gray-700">Món</th>
                    <th className="py-2 text-center text-gray-700">SL</th>
                    <th className="py-2 text-right text-gray-700">Giá</th>
                    <th className="py-2 text-right text-gray-700">TT</th>
                  </tr>
                </thead>
                <tbody>
                  {order.chiTietYeuCauDons.map((item, index) => (
                    <tr key={index} className="border-b border-dashed border-gray-200">
                      <td className="py-2 text-gray-800">{item.sanPham.tenSanPham}</td>
                      <td className="py-2 text-center text-gray-800">{item.soLuong}</td>
                      <td className="py-2 text-right text-gray-800">{item.gia.toLocaleString('vi-VN')}</td>
                      <td className="py-2 text-right text-gray-800">{(item.gia * item.soLuong).toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 text-right border-t-2 border-dashed border-gray-300 pt-4">
                <p className="text-gray-700">Tạm tính: <span className="font-semibold text-gray-800">{subtotal.toLocaleString('vi-VN')} đ</span></p>
                {discountAmount > 0 && (
                  <p className="text-gray-700">Giảm giá {order.giamGia ? `(${order.giamGia.code})` : ''}: <span className="font-semibold text-gray-800">-{discountAmount.toLocaleString('vi-VN')} đ</span></p>
                )}
                <p className="text-xl font-bold text-gray-900 mt-2">Tổng cộng: {finalTotal.toLocaleString('vi-VN')} đ</p>
              </div>
              
              <div className="mt-8 text-center text-gray-500 italic text-sm">
                Cảm ơn quý khách và hẹn gặp lại!
              </div>
            </div>
            
            <div className="p-4 border-t flex gap-3 print:hidden bg-white rounded-b-xl">
              <button 
                onClick={() => setShowInvoicePopup(false)}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Đóng
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
              >
                <Printer size={18} /> In ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}