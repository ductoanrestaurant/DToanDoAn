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
    sdt?: string;
  };
  gioSuDung?: string | null;
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
  switch (status?.toLowerCase()) {
    case 'thành công':
    case 'đã thanh toán':
      return 'bg-green-100 text-green-700';
    case 'chưa thanh toán':
      return 'bg-yellow-100 text-yellow-700';
    case 'đã hủy':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getOrderStatusInfo = (items: ChiTietYeuCauDon[]) => {
  if (!items || items.length === 0) {
    return { text: 'N/A', color: 'bg-gray-100 text-gray-700' };
  }

  const allStatuses = items.map(item => item.trangThai.toLowerCase());
  const isFinished = (s: string) => ['hoàn thành', 'đang dùng bữa', 'đã hủy'].includes(s);

  if (allStatuses.every(s => s === 'đã hủy')) {
    return { text: 'Đã hủy', color: 'bg-red-100 text-red-700' };
  }
  
  if (allStatuses.every(s => s === 'hoàn thành' || s === 'đã hủy') && allStatuses.some(s => s === 'hoàn thành')) {
    return { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
  }

  // If all items are finished (completed/eating/cancelled) and not all cancelled
  if (allStatuses.every(isFinished)) {
      return { text: 'Đang dùng bữa', color: 'bg-purple-100 text-purple-700' };
  }

  if (allStatuses.some(s => s === 'đang chuẩn bị')) {
      return { text: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700' };
  }

  if (allStatuses.some(isFinished) && allStatuses.some(s => s === 'chờ xác nhận')) {
      return { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' };
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
  const [filterDate, setFilterDate] = useState<'all' | 'today'>('today');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('all');
  const [searchPhone, setSearchPhone] = useState('');

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

  const filteredOrders = orders.filter(order => {
    // Filter by date
    let dateMatch = true;
    if (filterDate === 'today') {
      if (!order.ngayTaoDon) {
        dateMatch = false;
      } else {
        const orderDate = new Date(order.ngayTaoDon);
        const today = new Date();
        dateMatch = (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }
    }

    // Filter by phone number (4 số cuối, chỉ lấy chữ số)
    let phoneMatch = true;
    const keyword = searchPhone.trim();
    if (keyword !== '') {
      const phoneRaw = order.khachHang?.sdt || '';
      const phoneDigits = phoneRaw.replace(/\D/g, '');
      const last4 = phoneDigits.slice(-4);
      const keywordDigits = keyword.replace(/\D/g, '');
      phoneMatch = last4 === keywordDigits;
    }

    // Filter by payment status
    let paymentMatch = true;
    if (filterPaymentStatus !== 'all') {
      const pStatus = (order.trangThaiThanhToan || '').toLowerCase();
      paymentMatch = pStatus === filterPaymentStatus.toLowerCase();
    }

    // Filter by order status
    let orderStatusMatch = true;
    if (filterOrderStatus !== 'all') {
      const oStatus = getOrderStatusInfo(order.chiTietYeuCauDons).text.toLowerCase();
      orderStatusMatch = oStatus === filterOrderStatus.toLowerCase();
    }

    return dateMatch && phoneMatch && paymentMatch && orderStatusMatch;
  });

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
          <div className="flex flex-wrap items-center gap-4">
            <select 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value as 'all' | 'today')}
              className="px-4 py-3 bg-white rounded-xl shadow-sm text-gray-600 font-medium hover:bg-gray-50 transition border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="today">Hôm nay</option>
              <option value="all">Tất cả thời gian</option>
            </select>
            
            <select 
              value={filterPaymentStatus} 
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="px-4 py-3 bg-white rounded-xl shadow-sm text-gray-600 font-medium hover:bg-gray-50 transition border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái thanh toán</option>
              <option value="đã thanh toán">Đã thanh toán</option>
              <option value="chưa thanh toán">Chưa thanh toán</option>
            </select>

            <select 
              value={filterOrderStatus} 
              onChange={(e) => setFilterOrderStatus(e.target.value)}
              className="px-4 py-3 bg-white rounded-xl shadow-sm text-gray-600 font-medium hover:bg-gray-50 transition border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái đơn</option>
              <option value="hoàn thành">Hoàn thành</option>
              <option value="đã hủy">Đã hủy</option>
              <option value="chờ xác nhận">Chờ xác nhận</option>
              <option value="đang dùng bữa">Đang dùng bữa</option>
            </select>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nhập 4 số cuối SĐT..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400 font-medium"
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
                  <th className="p-4 font-medium">Số điện thoại</th>
                  <th className="p-4 font-medium">Giờ sử dụng</th>
                  <th className="p-4 font-medium">Ngày tạo</th>
                  {/*<th className="p-4 font-medium">Thời gian TT</th>*/}
                  <th className="p-4 font-medium">Tổng tiền</th>
                  <th className="p-4 font-medium">Thanh toán</th>
                  <th className="p-4 font-medium text-center">Trạng thái TT</th>
                  <th className="p-4 font-medium text-center">Trạng thái đơn</th>
                  <th className="p-4 font-medium text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const orderStatusInfo = getOrderStatusInfo(order.chiTietYeuCauDons);
                    return (
                      <tr key={order.id.maDonHang} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition">
                        <td className="p-4 font-medium text-blue-600">#{order.id.maDonHang}</td>
                        <td className="p-4 text-gray-800">
                          <div>{order.khachHang?.hoTen || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-gray-800">
                          {order.khachHang?.sdt || 'N/A'}
                        </td>
                        <td className="p-4 text-gray-500">
                          {order.gioSuDung
                            ? new Date(order.gioSuDung).toLocaleString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </td>
                        <td className="p-4 text-gray-500">
                          {order.ngayTaoDon
                            ? new Date(order.ngayTaoDon).toLocaleString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </td>
                        {/*<td className="p-4 text-gray-500">{order.thoiGianThanhToan ? new Date(order.thoiGianThanhToan).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>*/}
                        <td className="p-4 font-bold text-gray-800">{(order.tongTien || 0).toLocaleString('vi-VN')}đ</td>
                        <td className="p-4 text-gray-500">{order.thanhToan?.kieuThanhToan || 'N/A'}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getPaymentStatusColor(order.trangThaiThanhToan)}`}>
                            {order.trangThaiThanhToan}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${orderStatusInfo.color}`}>
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
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">Không có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">Hiển thị 1 đến {filteredOrders.length} của {filteredOrders.length} kết quả</p>
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