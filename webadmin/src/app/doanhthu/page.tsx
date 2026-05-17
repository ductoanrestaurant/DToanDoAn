'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Moon, LogOut, ShoppingCart, TrendingUp, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '@/constants/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface YeuCauDon {
    id: { maDonHang: number; idRestaurant: number };
    trangThaiThanhToan: string | null;
    thoiGianThanhToan: string | null; // ISO datetime
    ngayTaoDon: string | null;        // ISO datetime
    tongTien: number | null;
    maTaiKhoan: number | null;
}

interface TopSanPhamDTO {
    maSanPham: number;
    tenSanPham: string;
    soLuotBan: number;
    saoDanhGia: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                     'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Lấy chuỗi date "YYYY-MM-DD" theo múi giờ local */
function toLocalDateStr(isoStr: string | null): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** Trả về "YYYY-MM-DD" của hôm nay */
function todayStr(): string {
    return toLocalDateStr(new Date().toISOString());
}

/** Trả về "YYYY-MM" của tháng hiện tại */
function thisMonthStr(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Từ danh sách đơn hàng đã thanh toán → mảng 12 tháng doanh thu năm nay
 */
function buildMonthlyRevenue(orders: YeuCauDon[]): { name: string; value: number }[] {
    const currentYear = new Date().getFullYear();
    const byMonth = new Array<number>(12).fill(0);
    orders.forEach((o) => {
        const dateStr = toLocalDateStr(o.thoiGianThanhToan || o.ngayTaoDon);
        if (!dateStr) return;
        const [y, m] = dateStr.split('-').map(Number);
        if (y === currentYear && m >= 1 && m <= 12) {
            byMonth[m - 1] += o.tongTien ?? 0;
        }
    });
    return MONTH_NAMES.map((name, i) => ({ name, value: byMonth[i] }));
}

/**
 * Từ danh sách đơn hàng đã thanh toán → mảng 7 ngày trong tuần hiện tại (T2→CN)
 */
function buildWeeklyRevenue(orders: YeuCauDon[]): { name: string; value: number }[] {
    const today = new Date();
    const dow = today.getDay();
    const diff = dow === 0 ? 6 : dow - 1; // T2 = đầu tuần
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const byDay = new Map<string, number>();
    orders.forEach((o) => {
        const dateStr = toLocalDateStr(o.thoiGianThanhToan || o.ngayTaoDon);
        if (dateStr) byDay.set(dateStr, (byDay.get(dateStr) ?? 0) + (o.tongTien ?? 0));
    });

    const result: { name: string; value: number }[] = [];
    const cur = new Date(monday);
    for (let i = 0; i < 7; i++) {
        const key = toLocalDateStr(cur.toISOString());
        const dayIndex = cur.getDay() === 0 ? 6 : cur.getDay() - 1;
        result.push({ name: DAY_LABELS[dayIndex], value: byDay.get(key) ?? 0 });
        cur.setDate(cur.getDate() + 1);
    }
    return result;
}

/**
 * Từ danh sách đơn hàng → mảng 12 tháng số lượng đơn năm nay
 */
function buildMonthlyOrderCount(orders: YeuCauDon[]): { name: string; value: number }[] {
    const currentYear = new Date().getFullYear();
    const byMonth = new Array<number>(12).fill(0);
    orders.forEach((o) => {
        const dateStr = toLocalDateStr(o.ngayTaoDon || o.thoiGianThanhToan);
        if (!dateStr) return;
        const [y, m] = dateStr.split('-').map(Number);
        if (y === currentYear && m >= 1 && m <= 12) byMonth[m - 1]++;
    });
    return MONTH_NAMES.map((name, i) => ({ name, value: byMonth[i] }));
}

/**
 * Từ danh sách đơn hàng → mảng 7 ngày trong tuần hiện tại (T2→CN), đếm số đơn
 */
function buildWeeklyOrderCount(orders: YeuCauDon[]): { name: string; value: number }[] {
    const today = new Date();
    const dow = today.getDay();
    const diff = dow === 0 ? 6 : dow - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const byDay = new Map<string, number>();
    orders.forEach((o) => {
        const dateStr = toLocalDateStr(o.ngayTaoDon || o.thoiGianThanhToan);
        if (dateStr) byDay.set(dateStr, (byDay.get(dateStr) ?? 0) + 1);
    });

    const result: { name: string; value: number }[] = [];
    const cur = new Date(monday);
    for (let i = 0; i < 7; i++) {
        const key = toLocalDateStr(cur.toISOString());
        const dayIndex = cur.getDay() === 0 ? 6 : cur.getDay() - 1;
        result.push({ name: DAY_LABELS[dayIndex], value: byDay.get(key) ?? 0 });
        cur.setDate(cur.getDate() + 1);
    }
    return result;
}

type ChartView = 'monthly' | 'daily';

// ─── Component ────────────────────────────────────────────────────────────────
export default function DoanhThuPage() {
    const router = useRouter();

    const [revenueChartView, setRevenueChartView] = useState<ChartView>('monthly');
    const [orderChartView, setOrderChartView]     = useState<ChartView>('monthly');

    const [monthlyRevenueData, setMonthlyRevenueData] = useState<{ name: string; value: number }[]>([]);
    const [weeklyRevenueData,  setWeeklyRevenueData]  = useState<{ name: string; value: number }[]>([]);
    const [monthlyOrderData,   setMonthlyOrderData]   = useState<{ name: string; value: number }[]>([]);
    const [weeklyOrderData,    setWeeklyOrderData]    = useState<{ name: string; value: number }[]>([]);

    const [doanhThuHomNay,  setDoanhThuHomNay]  = useState<number>(0);
    const [doanhThuThangNay, setDoanhThuThangNay] = useState<number>(0);
    const [tongDonHomNay,   setTongDonHomNay]   = useState<number>(0);
    const [tongDonThangNay, setTongDonThangNay] = useState<number>(0);

    const [topProducts, setTopProducts] = useState<TopSanPhamDTO[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        const fetchAll = async () => {
            try {
                // Gọi 1 API lấy toàn bộ đơn hàng + API top sản phẩm (không thể tổng hợp ở FE)
                const [ordersRes, topRes] = await Promise.all([
                    api.get<YeuCauDon[]>('/yeu-cau-don'),
                    api.get<TopSanPhamDTO[]>('/yeu-cau-don/top-san-pham'),
                ]);

                if (topRes.status === 200 && Array.isArray(topRes.data)) {
                    setTopProducts(topRes.data);
                }

                if (ordersRes.status !== 200 || !Array.isArray(ordersRes.data)) return;

                const allOrders: YeuCauDon[] = ordersRes.data;

                // ── Chỉ tính doanh thu từ đơn ĐÃ THANH TOÁN ──────────────
                const paidOrders = allOrders.filter(
                    (o) => o.trangThaiThanhToan?.toLowerCase().includes('đã thanh toán')
                );

                const today   = todayStr();
                const thisMonth = thisMonthStr();

                // Doanh thu & đơn hôm nay
                const paidToday = paidOrders.filter(
                    (o) => toLocalDateStr(o.thoiGianThanhToan || o.ngayTaoDon) === today
                );
                setDoanhThuHomNay(paidToday.reduce((s, o) => s + (o.tongTien ?? 0), 0));
                setTongDonHomNay(
                    allOrders.filter((o) => toLocalDateStr(o.ngayTaoDon || o.thoiGianThanhToan) === today).length
                );

                // Doanh thu & đơn tháng này
                const paidThisMonth = paidOrders.filter((o) => {
                    const ds = toLocalDateStr(o.thoiGianThanhToan || o.ngayTaoDon);
                    return ds.startsWith(thisMonth);
                });
                setDoanhThuThangNay(paidThisMonth.reduce((s, o) => s + (o.tongTien ?? 0), 0));
                setTongDonThangNay(
                    allOrders.filter((o) => {
                        const ds = toLocalDateStr(o.ngayTaoDon || o.thoiGianThanhToan);
                        return ds.startsWith(thisMonth);
                    }).length
                );

                // Biểu đồ doanh thu (chỉ đơn đã thanh toán)
                setMonthlyRevenueData(buildMonthlyRevenue(paidOrders));
                setWeeklyRevenueData(buildWeeklyRevenue(paidOrders));

                // Biểu đồ số lượng đơn (tất cả đơn)
                setMonthlyOrderData(buildMonthlyOrderCount(allOrders));
                setWeeklyOrderData(buildWeeklyOrderCount(allOrders));

            } catch (error) {
                console.error('Lỗi khi tải dữ liệu doanh thu:', error);
            }
        };

        fetchAll();
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

    const formatVnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

    const revenueChartData  = revenueChartView === 'monthly' ? monthlyRevenueData : weeklyRevenueData;
    const revenueChartTitle = revenueChartView === 'monthly' ? 'Biểu đồ doanh thu hàng tháng' : 'Biểu đồ doanh thu hàng ngày';

    const orderChartData  = orderChartView === 'monthly' ? monthlyOrderData : weeklyOrderData;
    const orderChartTitle = orderChartView === 'monthly'
        ? 'Biểu đồ số lượng đơn hàng (Theo tháng)'
        : 'Biểu đồ số lượng đơn hàng (Theo ngày)';

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
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Tổng đơn hôm nay</h3>
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                <ShoppingCart size={30} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{tongDonHomNay}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Doanh thu tháng này</h3>
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <DollarSign size={30} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{formatVnd(doanhThuThangNay)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-base font-medium">Tổng đơn tháng này</h3>
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                                <ShoppingCart size={30} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{tongDonThangNay}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">{revenueChartTitle}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setRevenueChartView('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${revenueChartView === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng tháng</button>
                                <button onClick={() => setRevenueChartView('daily')}   className={`px-4 py-2 rounded-lg text-sm font-medium ${revenueChartView === 'daily'   ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng ngày</button>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(v) => `${(v as number / 1000000)}M`} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => value == null ? null : [Number(value).toLocaleString('vi-VN') + 'đ', 'Doanh thu']} />
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
                            <button onClick={() => setOrderChartView('daily')}   className={`px-4 py-2 rounded-lg text-sm font-medium ${orderChartView === 'daily'   ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Hàng ngày</button>
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
