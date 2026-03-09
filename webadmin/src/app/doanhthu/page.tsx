'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Moon, LogOut, ArrowUp, ArrowDown, ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const chartData = [
    { name: 'Tháng 1', value: 4000 },
    { name: 'Tháng 2', value: 3000 },
    { name: 'Tháng 3', value: 2000 },
    { name: 'Tháng 4', value: 2780 },
    { name: 'Tháng 5', value: 1890 },
    { name: 'Tháng 6', value: 2390 },
    { name: 'Tháng 7', value: 3490 },
    { name: 'Tháng 8', value: 3600 },
    { name: 'Tháng 9', value: 3100 },
    { name: 'Tháng 10', value: 4100 },
    { name: 'Tháng 11', value: 4500 },
    { name: 'Tháng 12', value: 4800 },
];

export default function DoanhThuPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        }
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

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Tổng quan Doanh thu</h1>
                    <p className="text-gray-500 mt-1">Phân tích và thống kê doanh thu của nhà hàng.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1: Doanh thu hôm nay */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-sm font-medium">Doanh thu hôm nay</h3>
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">12.500.000đ</p>
                        <div className="flex items-center text-sm text-green-500 mt-2">
                            <ArrowUp size={16} className="mr-1" />
                            <span>15% so với hôm qua</span>
                        </div>
                    </div>

                    {/* Card 2: Doanh thu tháng này */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-sm font-medium">Doanh thu tháng này</h3>
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">189.000.000đ</p>
                        <div className="flex items-center text-sm text-green-500 mt-2">
                            <ArrowUp size={16} className="mr-1" />
                            <span>8% so với tháng trước</span>
                        </div>
                    </div>

                    {/* Card 3: Tổng đơn hàng tháng này */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-sm font-medium">Tổng đơn tháng này</h3>
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                                <ShoppingCart size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">1.250</p>
                        <div className="flex items-center text-sm text-red-500 mt-2">
                            <ArrowDown size={16} className="mr-1" />
                            <span>-2% so với tháng trước</span>
                        </div>
                    </div>

                    {/* Card 4: Doanh thu trung bình/đơn */}
                    {/*<div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">*/}
                    {/*    <div className="flex items-center justify-between">*/}
                    {/*        <h3 className="text-gray-500 text-sm font-medium">TB. Doanh thu / Đơn</h3>*/}
                    {/*         <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">*/}
                    {/*            <DollarSign size={20} />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <p className="text-3xl font-bold text-gray-800 mt-2">151.200đ</p>*/}
                    {/*     <div className="flex items-center text-sm text-gray-500 mt-2">*/}
                    {/*        <span>Tháng này</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Biểu đồ doanh thu hàng tháng</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `${(value as number / 1000)}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => value == null ? null : [value.toLocaleString('vi-VN') + 'đ', 'Doanh thu']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}
