'use client'; // Bắt buộc vì dùng biểu đồ động

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // Import Sidebar (Thanh bên)
import { Search, Bell, Moon, LogOut, ArrowUp, ArrowDown, Wallet, MoreHorizontal, ShoppingBag, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dữ liệu giả lập cho biểu đồ (Đã việt hóa tên tháng)
const chartData = [
    { name: 'Tháng 1', value: 10 },
    { name: 'Tháng 2', value: 15 },
    { name: 'Tháng 3', value: 12 },
    { name: 'Tháng 4', value: 25 },
    { name: 'Tháng 5', value: 20 },
    { name: 'Tháng 6', value: 45 }, // Đỉnh cao nhất như thiết kế
    { name: 'Tháng 7', value: 30 },
    { name: 'Tháng 8', value: 35 },
    { name: 'Tháng 9', value: 25 },
    { name: 'Tháng 10', value: 30 },
    { name: 'Tháng 11', value: 35 },
    { name: 'Tháng 12', value: 40 },
];

export default function DashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        } else {
                setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        // Render a loading state or null while checking for authentication
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    return (
        <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
            {/* 1. Sidebar (Thanh bên trái) */}
            <Sidebar />

            {/* 2. Nội dung chính bên phải */}
            <main className="flex-1 ml-64 p-8">

                {/* Đầu trang: Tìm kiếm & Các biểu tượng tiện ích */}
                <header className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition" title="Chế độ tối"><Moon size={20} /></button>
                        <button className="p-3 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition" title="Thông báo"><Bell size={20} /></button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm text-red-500 font-medium hover:bg-red-50 transition">
                            <LogOut size={20} /> Đăng xuất
                        </button>
                    </div>
                </header>

                {/* Hàng thẻ thống kê (Stats Cards) */}
                <div className="grid grid-cols-5 gap-6 mb-8">
                    {/* Thẻ 1: Tổng doanh thu */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                            <ArrowUp size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Tổng doanh thu</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">$278m</p>
                        <span className="text-xs text-green-500 font-medium">+50% so với tháng trước</span>
                    </div>
                    {/* Thẻ 2: Doanh thu ngày */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                            <ShoppingBag size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Doanh thu ngày</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">$421k</p>
                        <span className="text-xs text-red-500 font-medium">-13% so với hôm qua</span>
                    </div>
                    {/* Thẻ 3: Người dùng */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-4">
                            <Users size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Người dùng mới</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">4,215</p>
                        <span className="text-xs text-green-500 font-medium">+48% lượng truy cập</span>
                    </div>
                    {/* Thẻ 4: Sản phẩm */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mb-4">
                            <Wallet size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Sản phẩm</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">548</p>
                        <span className="text-xs text-green-500 font-medium">+25% Hàng tồn kho</span>
                    </div>
                    {/* Thẻ 5: Chi phí */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center mb-4">
                            <MoreHorizontal size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Chi phí</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">$219.0</p>
                        <span className="text-xs text-gray-400 font-medium">Chi phí dự kiến</span>
                    </div>
                </div>

                {/* Phần giữa: Biểu đồ & Thẻ số dư */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {/* Khu vực biểu đồ (Chiếm 3/4) */}
                    <div className="col-span-3 bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Biểu đồ doanh thu</h3>
                            <select className="border border-gray-300 rounded-lg text-sm px-3 py-1 outline-none focus:border-blue-500 cursor-pointer">
                                <option>Theo Tháng</option>
                                <option>Theo Tuần</option>
                            </select>
                        </div>
                        <div className="h-75 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff7b54" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ff7b54" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`${value}%`, 'Tăng trưởng']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#ff7b54" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Thẻ số dư (Chiếm 1/4 - Màu cam) */}
                    <div className="col-span-1 bg-[#ff7b54] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-1">$ 9.470</h3>
                            <p className="text-white/80 text-sm">Số dư khả dụng</p>
                        </div>

                        <div className="space-y-4 my-6">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-sm"><ArrowUp size={16} className="bg-white/20 p-0.5 rounded"/> Thu nhập</span>
                                <span className="font-semibold">$1.699,0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-sm"><ArrowDown size={16} className="bg-white/20 p-0.5 rounded"/> Chi phí</span>
                                <span className="font-semibold">-$799,0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-sm"><ArrowDown size={16} className="bg-white/20 p-0.5 rounded"/> Thuế</span>
                                <span className="font-semibold">-$199,0</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white text-[#ff7b54] font-bold rounded-xl shadow-md hover:bg-gray-50 transition active:scale-95">
                            Thêm thẻ ảo
                        </button>
                    </div>
                </div>

                {/* Phần dưới: Bảng đơn hàng & Danh sách thanh toán */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Bảng đơn hàng gần đây (Chiếm 2/3) */}
                    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Đơn hàng gần đây</h3>
                            <button className="text-sm text-gray-500 hover:text-[#ff7b54] font-medium transition">Xem tất cả</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                                    <th className="pb-3 font-medium">Khách hàng</th>
                                    <th className="pb-3 font-medium">Công ty</th>
                                    <th className="pb-3 font-medium">Giá trị</th>
                                    <th className="pb-3 font-medium">Sản phẩm</th>
                                </tr>
                                </thead>
                                <tbody className="text-sm">
                                {[1, 2, 3].map((item) => (
                                    <tr key={item} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition">
                                        <td className="py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200"></div> {/* Avatar placeholder */}
                                            <span className="font-medium text-gray-700">Paula Walker</span>
                                        </td>
                                        <td className="py-4 text-gray-500">Microsoft</td>
                                        <td className="py-4 text-[#ff7b54] font-bold">$1.476,00</td>
                                        <td className="py-4 text-gray-500">Surface Pro 7</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Danh sách thanh toán sắp tới (Chiếm 1/3) */}
                    <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg text-gray-800 mb-6">Thanh toán sắp tới</h3>
                        <div className="space-y-6">
                            {/* Mục 1: Đã dịch Easy Pay Way */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Thanh toán Dễ dàng</p>
                                        <p className="text-xs text-gray-400">Cổng thanh toán</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#ff7b54]">$822,50</span>
                            </div>

                            {/* Mục 2 */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Payoneer</p>
                                        <p className="text-xs text-gray-400">Trả lương</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#ff7b54]">$614,00</span>
                            </div>

                            {/* Mục 3 */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">FastSpring</p>
                                        <p className="text-xs text-gray-400">Gia hạn đăng ký</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#ff7b54]">$421,38</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
