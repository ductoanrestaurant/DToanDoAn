'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { ShoppingCart, DollarSign, ArrowUp, ShoppingBag, Moon, LogOut ,ArrowRight} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/constants/api';




// Define types for dashboard data
interface DashboardOrder {
  id: {
    maDonHang: number;
    idRestaurant: number;
  };
  khachHang: {
    hoTen: string;
  };
  tongTien: number | null;
  ngayTaoDon: string;
  chiTietYeuCauDons: {
    soLuong: number;
    sanPham: {
      tenSanPham: string;
    };
  }[];
}

interface MonthlyStat {
    month: number;
    orderCount: number;
}

// Helper function to format chart data
const formatChartData = (stats: MonthlyStat[]) => {
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    
    // Create a map for quick lookup
    const statsMap = new Map(stats.map(stat => [stat.month, stat.orderCount]));

    // Generate data for all 12 months
    return monthNames.map((name, index) => ({
        name: name,
        value: statsMap.get(index + 1) || 0, // Get count from map or default to 0
    }));
};


export default function DashboardPage() {
    const router = useRouter();
    const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
    const [productCount, setProductCount] = useState<number>(0);
    const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch recent orders, product count, and chart data in parallel
                const [ordersResponse, productsResponse, chartResponse] = await Promise.all([
                    api.get('/yeu-cau-don'),
                    api.get('/san-pham'),
                    api.get('/yeu-cau-don/stats/orders-by-month')
                ]);

                // Process recent orders
                if (ordersResponse.status === 200) {
                    const sortedOrders = ordersResponse.data.sort((a: DashboardOrder, b: DashboardOrder) => 
                        new Date(b.ngayTaoDon).getTime() - new Date(a.ngayTaoDon).getTime()
                    );
                    setRecentOrders(sortedOrders.slice(0, 5));
                }

                // Process product count
                if (productsResponse.status === 200) {
                    setProductCount(productsResponse.data.length);
                }

                // Process chart data
                if (chartResponse.status === 200) {
                    const formattedData = formatChartData(chartResponse.data);
                    setChartData(formattedData);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
            </div>
        );
    }

    return (
        <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-end items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition" title="Chế độ tối">
                            <Moon size={20} />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm text-red-500 font-medium hover:bg-red-50 transition">
                            <LogOut size={20} /> Đăng xuất
                        </button>
                    </div>
                </header>
                <div className="grid grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">

                    {/* Thẻ 1: Đơn hàng */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                                <ShoppingCart size={20} />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">Đơn hàng hôm nay</h3>
                            <p className="text-2xl font-bold text-gray-800 mt-1">125</p>
                        </div>

                        {/* --- NÚT XEM CHI TIẾT --- */}
                        <Link href="/donhang" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff7b54] font-medium mt-4 transition-colors group">
                            Xem chi tiết
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Thẻ 2: Doanh thu */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                <DollarSign size={20} />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">Doanh thu hôm nay</h3>
                            <p className="text-2xl font-bold text-gray-800 mt-1">421.000đ</p>
                        </div>

                        {/* --- NÚT XEM CHI TIẾT --- */}
                        <Link href="/donhang" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff7b54] font-medium mt-4 transition-colors group">
                            Xem chi tiết
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Chart */}
                    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Biểu đồ số lượng đơn hàng</h3>
                        </div>
                        <div className="h-75 w-290">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff7b54" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ff7b54" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} interval={0}/>
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        // Xóa ": number" đi
                                        formatter={(value) => [value, 'Số đơn']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#ff7b54" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/*/!* Balance Card *!/*/}
                    {/*<div className="col-span-1 bg-[#ff7b54] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">*/}
                    {/*    <div><h3 className="text-3xl font-bold mb-1">$ 9.470</h3><p className="text-white/80 text-sm">Số dư khả dụng</p></div>*/}
                    {/*    <div className="space-y-4 my-6"><div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm"><ArrowUp size={16} className="bg-white/20 p-0.5 rounded"/> Thu nhập</span><span className="font-semibold">$1.699,0</span></div><div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm"><ArrowDown size={16} className="bg-white/20 p-0.5 rounded"/> Chi phí</span><span className="font-semibold">-$799,0</span></div><div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm"><ArrowDown size={16} className="bg-white/20 p-0.5 rounded"/> Thuế</span><span className="font-semibold">-$199,0</span></div></div>*/}
                    {/*    <button className="w-full py-3 bg-white text-[#ff7b54] font-bold rounded-xl shadow-md hover:bg-gray-50 transition active:scale-95">Thêm thẻ ảo</button>*/}
                    {/*</div>*/}
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {/* Recent Orders Table */}
                    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Đơn hàng gần đây</h3>
                            <Link href="/donhang" className="text-sm text-gray-500 hover:text-[#ff7b54] font-medium transition">Xem tất cả</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                                    <th className="pb-3 font-medium">Khách hàng</th>
                                    <th className="pb-3 font-medium">Ngày tạo</th>
                                    <th className="pb-3 font-medium">Giá trị</th>
                                    <th className="pb-3 font-medium">Số lượng món</th>
                                </tr>
                                </thead>
                                <tbody className="text-sm">
                                {recentOrders.map((order) => (
                                    <tr key={order.id.maDonHang} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition cursor-pointer" onClick={() => router.push(`/donhang/${order.id.maDonHang}?idRestaurant=${order.id.idRestaurant}`)}>
                                        <td className="py-4 flex items-center gap-3">
                                            <span className="font-medium text-gray-700">{order.khachHang?.hoTen || 'N/A'}</span>
                                        </td>
                                        <td className="py-4 text-gray-500">{new Date(order.ngayTaoDon).toLocaleDateString('vi-VN')}</td>
                                        <td className="py-4 text-[#ff7b54] font-bold">{(order.tongTien || 0).toLocaleString('vi-VN')}đ</td>
                                        <td className="py-4 text-gray-500">
                                            {order.chiTietYeuCauDons.reduce((total, item) => total + item.soLuong, 0)} món
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Upcoming Payments */}
                    <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg text-gray-800 mb-6">Tháng này</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500"></div><div><p className="text-sm font-semibold text-gray-700">Tổng đơn tháng này</p></div></div><span className="text-sm font-bold text-[#ff7b54]">$822,50</span></div>
                            <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div><p className="text-sm font-semibold text-gray-700">Tổng doanh thu tháng này</p></div></div><span className="text-sm font-bold text-[#ff7b54]">$614,00</span></div>
                            <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500"></div><div><p className="text-sm font-semibold text-gray-700">Tổng đơn hủy</p></div></div><span className="text-sm font-bold text-[#ff7b54]">$421,38</span></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
