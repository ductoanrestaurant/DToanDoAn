'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Moon, LogOut, ArrowUp, ArrowDown, ShoppingCart, TrendingUp, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '@/constants/api';

// --- Types and Helpers ---
interface TopSanPhamDTO {
    maSanPham: number;
    tenSanPham: string;
    soLuotBan: number;
    saoDanhGia: number;
}
// --- Helpers: format API revenue for charts ---
const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

function formatMonthlyRevenueFromApi(raw: { month?: string; total?: number }[]): { name: string; value: number }[] {
    const currentYear = new Date().getFullYear();
    const byMonth = new Map<number, number>();
    if (Array.isArray(raw)) {
        raw.forEach((x) => {
            const monthStr = x.month as string;
            const total = Number(x.total) || 0;
            if (!monthStr) return;
            const [y, m] = monthStr.split('-').map(Number);
            if (y === currentYear && m >= 1 && m <= 12) byMonth.set(m, total);
        });
    }
    return MONTH_NAMES.map((name, index) => ({
        name,
        value: byMonth.get(index + 1) || 0,
    }));
}

function formatDailyDataFromApi(raw: { day?: string; value?: number }[]): { name: string; value: number }[] {
    const byDay = new Map<string, number>();
    if (Array.isArray(raw)) {
        raw.forEach((x) => {
            const d = x.day as string;
            const value = Number(x.value) || 0;
            if (d) byDay.set(d, value);
        });
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday is the start of the week
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const result: { name: string; value: number }[] = [];
    const cur = new Date(startOfWeek);

    for (let i = 0; i < 7; i++) {
        const key = cur.toISOString().slice(0, 10);
        const dayIndex = cur.getDay() === 0 ? 6 : cur.getDay() - 1;
        result.push({ name: DAY_LABELS[dayIndex], value: byDay.get(key) || 0 });
        cur.setDate(cur.getDate() + 1);
    }

    return result;
}


// --- Types and Helpers ---
interface MonthlyStat {
    month: number;
    orderCount: number;
}

const formatMonthlyOrderData = (stats: MonthlyStat[]) => {
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const statsMap = new Map(stats.map(stat => [stat.month, stat.orderCount]));
    return monthNames.map((name, index) => ({
        name: name,
        value: statsMap.get(index + 1) || 0,
    }));
};

type ChartView = 'monthly' | 'daily';

export default function DoanhThuPage() {
    const router = useRouter();
    
    // State for chart views
    const [revenueChartView, setRevenueChartView] = useState<ChartView>('monthly');
    const [orderChartView, setOrderChartView] = useState<ChartView>('monthly');

    // State for chart data
    const [monthlyOrderData, setMonthlyOrderData] = useState<{name: string, value: number}[]>([]);
    const [dailyOrderData, setDailyOrderData] = useState<{name: string, value: number}[]>([]);
    const [monthlyRevenueData, setMonthlyRevenueData] = useState<{ name: string; value: number }[]>([]);
    const [dailyRevenueData, setDailyRevenueData] = useState<{ name: string; value: number }[]>([]);
    const [tongDonHomNay, setTongDonHomNay] = useState<number>(0);
    const [tongDonThangNay, setTongDonThangNay] = useState<number>(0);
    const [topProducts, setTopProducts] = useState<TopSanPhamDTO[]>([]);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchMonthlyOrderData = async () => {
            try {
                const response = await api.get('/yeu-cau-don/stats/orders-by-month');
                if (response.status === 200) {
                    const formattedData = formatMonthlyOrderData(response.data);
                    setMonthlyOrderData(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch monthly order data:", error);
            }
        };

        const fetchDailyOrderData = async () => {
            try {
                const response = await api.get('/yeu-cau-don/stats/orders-by-day');
                if (response.status === 200 && Array.isArray(response.data)) {
                    const formattedData = response.data.map(item => ({
                        day: item.day,
                        value: Number(item.ordercount) || 0
                    }));
                    setDailyOrderData(formatDailyDataFromApi(formattedData));
                }
            } catch (error) {
                console.error("Failed to fetch daily order data:", error);
            }
        };

        const fetchRevenueData = async () => {
            try {
                const [monthRes, dayRes] = await Promise.all([
                    api.get('/yeu-cau-don/doanh-thu-thang'),
                    api.get('/yeu-cau-don/doanh-thu-ngay'),
                ]);
                if (monthRes.status === 200 && Array.isArray(monthRes.data)) {
                    setMonthlyRevenueData(formatMonthlyRevenueFromApi(monthRes.data));
                }
                if (dayRes.status === 200 && Array.isArray(dayRes.data)) {
                    const formattedData = dayRes.data.map(item => ({
                        day: item.day,
                        value: Number(item.total) || 0
                    }));
                    setDailyRevenueData(formatDailyDataFromApi(formattedData));
                }
            } catch (error) {
                console.error("Failed to fetch revenue data:", error);
            }
        };

        const fetchOrderCountData = async () => {
            try {
                const [todayRes, monthRes] = await Promise.all([
                    api.get('/yeu-cau-don/tong-don-hom-nay'),
                    api.get('/yeu-cau-don/tong-don-thang-nay'),
                ]);

                if (todayRes.status === 200) {
                    setTongDonHomNay(typeof todayRes.data === 'number' ? todayRes.data : Number(todayRes.data) || 0);
                }

                if (monthRes.status === 200) {
                    setTongDonThangNay(typeof monthRes.data === 'number' ? monthRes.data : Number(monthRes.data) || 0);
                }
            } catch (error) {
                console.error("Failed to fetch order count data:", error);
            }
        };

        const fetchTopProducts = async () => {
            try {
                const response = await api.get('/yeu-cau-don/top-san-pham');
                if (response.status === 200 && Array.isArray(response.data)) {
                    setTopProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch top products:", error);
            }
        };

        fetchMonthlyOrderData();
        fetchDailyOrderData();
        fetchRevenueData();
        fetchOrderCountData();
        fetchTopProducts();
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

    // --- Chart Logic & derived revenue for cards ---
    const revenueChartData = revenueChartView === 'monthly' ? monthlyRevenueData : dailyRevenueData;
    const revenueChartTitle = revenueChartView === 'monthly' ? 'Biểu đồ doanh thu hàng tháng' : 'Biểu đồ doanh thu hàng ngày';

    const todayDayOfWeek = new Date().getDay(); // 0=CN, 1=T2,..., 6=T7
    const todayIndex = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1; // T2=0,...,CN=6
    const doanhThuHomNay = dailyRevenueData.length > todayIndex ? dailyRevenueData[todayIndex].value : 0;
    const doanhThuThangNay = monthlyRevenueData[new Date().getMonth()]?.value ?? 0;
    const formatVnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

    const orderChartData = orderChartView === 'monthly' ? monthlyOrderData : dailyOrderData;
    const orderChartTitle = orderChartView === 'monthly' ? 'Biểu đồ số lượng đơn hàng (Theo tháng)' : 'Biểu đồ số lượng đơn hàng (Theo ngày)';

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
                    <h1 className="text-3xl font-bold text-gray-800">Tổng quan thống kê nhà hàng</h1>
                    <p className="text-gray-500 mt-1">Phân tích và thống kê doanh thu của nhà hàng.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Doanh thu hôm nay</h3>
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <DollarSign size={30} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{formatVnd(doanhThuHomNay)}</p>
                        {/*<div className="flex items-center text-sm text-green-500 mt-2">*/}
                        {/*    <ArrowUp size={16} className="mr-1" />*/}
                        {/*    <span>15% so với hôm qua</span>*/}
                        {/*</div>*/}
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Tổng đơn hôm nay</h3>
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                <ShoppingCart size={30} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{tongDonHomNay}</p>
                        {/*<div className="flex items-center text-sm text-green-500 mt-2">*/}
                        {/*    <ArrowUp size={16} className="mr-1" />*/}
                        {/*    <span>5% so với hôm qua</span>*/}
                        {/*</div>*/}
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Doanh thu tháng này</h3>
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <DollarSign size={30} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{formatVnd(doanhThuThangNay)}</p>
                        {/*<div className="flex items-center text-sm text-green-500 mt-2">*/}
                        {/*    <ArrowUp size={16} className="mr-1" />*/}
                        {/*    <span>8% so với tháng trước</span>*/}
                        {/*</div>*/}
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Tổng đơn tháng này</h3>
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                                <ShoppingCart size={30}/>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{tongDonThangNay}</p>
                        {/*<div className="flex items-center text-sm text-red-500 mt-2">*/}
                        {/*    <ArrowDown size={16} className="mr-1" />*/}
                        {/*    <span>-2% so với tháng trước</span>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">{revenueChartTitle}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setRevenueChartView('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${revenueChartView === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng tháng</button>
                                <button onClick={() => setRevenueChartView('daily')} className={`px-4 py-2 rounded-lg text-sm font-medium ${revenueChartView === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng ngày</button>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `${(value as number / 1000000)}M`} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => value == null ? null : [value.toLocaleString('vi-VN') + 'đ', 'Doanh thu']} />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Best Sellers List */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="text-orange-500" size={24} />
                            <h3 className="font-bold text-lg text-gray-800">Top 5 Món Bán Chạy</h3>
                        </div>
                        <div className="space-y-4">
                            {topProducts.map((item, index) => (
                                <div key={item.maSanPham} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-gray-200 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{item.tenSanPham}</p>
                                            <p className="text-xs text-gray-500">{item.soLuotBan} đã bán</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                                        <Star size={16} />
                                        <span className="font-bold">{item.saoDanhGia.toFixed(1)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">{orderChartTitle}</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setOrderChartView('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${orderChartView === 'monthly' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng tháng</button>
                            <button onClick={() => setOrderChartView('daily')} className={`px-4 py-2 rounded-lg text-sm font-medium ${orderChartView === 'daily' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng ngày</button>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={orderChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs><linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff7b54" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff7b54" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} interval={0}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [value, 'Số đơn']} />
                                <Area type="monotone" dataKey="value" stroke="#ff7b54" strokeWidth={3} fillOpacity={1} fill="url(#colorOrder)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}
