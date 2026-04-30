'use client';
import { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import api from '@/constants/api';

// ---- Type Definitions ----
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
    trangThai: KitchenStatus;
    sanPham: SanPham;
    yeuCauDon: {
        ngayTaoDon: string;
        gioSuDung?: string;
    }
}

interface GroupedOrder {
    maDonHang: number;
    idRestaurant: number;
    trangThai: KitchenStatus;
    ngayTaoDon: string;
    gioSuDung?: string;
    items: ChiTietYeuCauDon[];
}

// Trạng thái lấy từ backend, nhưng màn hình bếp sẽ chỉ quan tâm 3 nhóm chính:
// - chờ xác nhận
// - đang chế biến
// - hoàn thành (đã nấu xong)
// 'đã checkin' là trạng thái phục vụ, sẽ không còn được dùng để hiển thị ở bếp
type KitchenStatus = 'chờ xác nhận' | 'đang chế biến' | 'đã chế biến' | 'hoàn thành' | 'đã hủy' | 'đã checkin';

const KITCHEN_STATES: Record<KitchenStatus, { label: string; color: string; bg: string; accent: string }> = {
    'chờ xác nhận': { label: "Chờ xử lý", color: "#f59e0b", bg: "#fef3c7", accent: "#d97706" },
    'đang chế biến': { label: "Đang nấu", color: "#3b82f6", bg: "#dbeafe", accent: "#2563eb" },
    'đã chế biến': { label: "Đã nấu xong", color: "#10b981", bg: "#d1fae5", accent: "#059669" },
    'hoàn thành': { label: "Hoàn thành", color: "#10b981", bg: "#d1fae5", accent: "#059669" },
    'đã checkin': { label: "Đã checkin", color: "#8b5cf6", bg: "#f3e8ff", accent: "#7c3aed" },
    'đã hủy': { label: "Đã hủy", color: "#ef4444", bg: "#fee2e2", accent: "#dc2626" },
};

// Luồng bếp: chờ xác nhận / đã checkin -> đang chế biến -> đã chế biến
const NEXT_STATE: Record<KitchenStatus, KitchenStatus | null> = {
    'chờ xác nhận': "đang chế biến",
    'đã checkin': "đang chế biến",
    'đang chế biến': "đã chế biến",
    'đã chế biến': null,
    'hoàn thành': null,
    'đã hủy': null,
};

const NEXT_LABEL: Record<KitchenStatus, string | null> = {
    'chờ xác nhận': "▶ Bắt đầu nấu",
    'đã checkin': "▶ Bắt đầu nấu",
    'đang chế biến': "✓ Đã nấu xong",
    'đã chế biến': null,
    'hoàn thành': null,
    'đã hủy': null,
};

// ---- Sub-components ----
function useElapsedTime(isoString: string) {
    const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [isoString]);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return { formatted: `${minutes}:${String(seconds).padStart(2, "0")}`, minutes };
}

function ElapsedBadge({ isoString, state }: { isoString: string, state: KitchenStatus }) {
    const { formatted: time, minutes } = useElapsedTime(isoString);
    const urgent = minutes >= 15 && state !== "hoàn thành" && state !== "đã checkin";
    return (
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: urgent ? "#ef4444" : "#94a3b8", animation: urgent ? "pulse 1s infinite" : "none" }}>
            ⏱ {time}
        </span>
    );
}

function TimeUntilBadge({ gioSuDung }: { gioSuDung: string }) {
    const [diff, setDiff] = useState(() => new Date(gioSuDung).getTime() - Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setDiff(new Date(gioSuDung).getTime() - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [gioSuDung]);

    const totalSeconds = Math.floor(Math.abs(diff) / 1000);
    const isOverdue = diff < 0;
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const isUrgent = !isOverdue && diff <= 30 * 60 * 1000;

    let label = '';
    if (hours > 0) {
        label = `${hours}h${String(mins).padStart(2, '0')}p`;
    } else {
        label = `${mins}:${String(secs).padStart(2, '0')}`;
    }

    const timeStr = new Date(gioSuDung).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
        <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 6,
            background: isOverdue ? '#fee2e2' : isUrgent ? '#fef3c7' : '#f0fdf4',
            color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#16a34a',
            animation: (isOverdue || isUrgent) ? 'pulse 1.5s infinite' : 'none',
        }}>
            🕐 {timeStr} ({isOverdue ? 'Quá ' : ''}{label}{isOverdue ? '' : ' nữa'})
        </span>
    );
}

function OrderCard({
    orderGroup,
    onUpdateState,
    onUpdateItemState
}: {
    orderGroup: GroupedOrder,
    onUpdateState: (maDonHang: number, idRestaurant: number, newState: KitchenStatus) => void,
    onUpdateItemState: (maDonHang: number, maSanPham: number, idRestaurant: number, newState: KitchenStatus) => void
}) {
    const state = orderGroup.trangThai;
    const stateInfo = KITCHEN_STATES[state] || KITCHEN_STATES['đã hủy'];
    const nextState = NEXT_STATE[state];
    const nextLabel = NEXT_LABEL[state];
    const isComplete = state === "đã chế biến" || state === "hoàn thành";
    const isCancelled = state === "đã hủy";

    return (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: `1px solid ${stateInfo.color}20`, overflow: "hidden", opacity: (isComplete || isCancelled) ? 0.7 : 1 }}>
            <div style={{ background: stateInfo.bg, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 800, fontSize: 18, color: stateInfo.accent }}>#{orderGroup.maDonHang}</span>
                {orderGroup.gioSuDung && !isComplete && !isCancelled && <TimeUntilBadge gioSuDung={orderGroup.gioSuDung} />}
            </div>

            {/* THAY ĐỔI: Hiển thị danh sách món và nút check cho từng món */}
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                {orderGroup.items.map((item) => {
                    const isItemDone = item.trangThai === 'đã chế biến' || item.trangThai === 'hoàn thành';
                    return (
                        <div key={item.id.maSanPham} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: isItemDone ? 0.5 : 1 }}>
                                <span style={{ fontWeight: 800, color: stateInfo.accent, minWidth: '20px' }}>{item.soLuong}x</span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', textDecoration: isItemDone ? 'line-through' : 'none' }}>
                                    {item.sanPham.tenSanPham}
                                </span>
                            </div>

                            {/* Nút hoàn thành từng món nhỏ (chỉ hiện ở cột Đang nấu) */}
                            {state === 'đang chế biến' && !isItemDone && item.trangThai !== 'đã hủy' && (
                                <button
                                    onClick={() => onUpdateItemState(orderGroup.maDonHang, item.id.maSanPham, orderGroup.idRestaurant, 'đã chế biến')}
                                    style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                                >
                                    ✓ Xong
                                </button>
                            )}

                            {/* Icon hiển thị trạng thái đã xong của món */}
                            {isItemDone && (
                                <span style={{ color: "#10b981", fontSize: 14, fontWeight: 800 }}>✓</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
                {nextState && !isCancelled && (
                    <button
                        onClick={() => onUpdateState(orderGroup.maDonHang, orderGroup.idRestaurant, nextState)}
                        style={{ background: stateInfo.accent, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, cursor: "pointer" }}
                    >
                        {nextLabel}
                    </button>
                )}
                {isComplete && <span style={{ color: "#10b981", fontWeight: 700 }}>✓ Đã nấu xong</span>}
                {isCancelled && <span style={{ color: "#ef4444", fontWeight: 700 }}>✗ Đã hủy</span>}
            </div>
        </div>
    );
}

function Column({
    title,
    orderGroups,
    color,
    bg,
    icon,
    onUpdateState,
    onUpdateItemState
}: {
    title: string,
    orderGroups: GroupedOrder[],
    color: string,
    bg: string,
    icon: string,
    onUpdateState: (maDonHang: number, idRestaurant: number, newState: KitchenStatus) => void,
    onUpdateItemState: (maDonHang: number, maSanPham: number, idRestaurant: number, newState: KitchenStatus) => void
}) {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: bg, padding: "12px", borderRadius: 12, border: `1px solid ${color}40`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color }}>{icon} {title}</span>
                <span style={{ background: color, color: "#fff", padding: "2px 8px", borderRadius: 20, fontSize: 12 }}>{orderGroups.length}</span>
            </div>
            {orderGroups.map((og) => (
                <OrderCard
                    key={`${og.maDonHang}-${og.idRestaurant}`}
                    orderGroup={og}
                    onUpdateState={onUpdateState}
                    onUpdateItemState={onUpdateItemState}
                />
            ))}
        </div>
    );
}

// ---- Main Page ----
type TimeFilter = 'today' | 'week' | 'month';

const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
    today: 'Hôm nay',
    week: 'Tuần này',
    month: 'Tháng này',
};

function filterByTime(orders: ChiTietYeuCauDon[], filter: TimeFilter): ChiTietYeuCauDon[] {
    const now = new Date();
    return orders.filter(o => {
        if (!o.yeuCauDon?.ngayTaoDon) return false;
        const orderDate = new Date(o.yeuCauDon.ngayTaoDon);
        switch (filter) {
            case 'today':
                return orderDate.toDateString() === now.toDateString();
            case 'week': {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
                startOfWeek.setHours(0, 0, 0, 0);
                return orderDate >= startOfWeek;
            }
            case 'month':
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    });
}

export default function KitchenPage() {
    const [orders, setOrders] = useState<ChiTietYeuCauDon[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
    const idRestaurant = 1;

    const fetchOrders = async () => {
        if (!idRestaurant) return;

        try {
            const [chiTietRes, donRes] = await Promise.all([
                api.get(`/yeu-cau-don/chi-tiet/restaurant/${idRestaurant}`),
                api.get(`/yeu-cau-don/restaurant/${idRestaurant}`),
            ]);

            const chiTietList: ChiTietYeuCauDon[] = chiTietRes.data || [];
            const donList: { id: { maDonHang: number }; ngayTaoDon: string; gioSuDung?: string }[] = donRes.data || [];

            // Map ngayTaoDon và gioSuDung từ YeuCauDon vào ChiTietYeuCauDon
            const donMap = new Map(donList.map(d => [d.id.maDonHang, { ngayTaoDon: d.ngayTaoDon, gioSuDung: d.gioSuDung }]));
            const merged = chiTietList.map(ct => {
                const donInfo = donMap.get(ct.id.maDonHang);
                return {
                    ...ct,
                    yeuCauDon: {
                        ngayTaoDon: ct.yeuCauDon?.ngayTaoDon || donInfo?.ngayTaoDon || '',
                        gioSuDung: donInfo?.gioSuDung || undefined,
                    },
                };
            });

            setOrders(merged);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        setCurrentTime(new Date());
        const pollInterval = setInterval(fetchOrders, 5000);
        const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(pollInterval);
            clearInterval(clockInterval);
        };
    }, [idRestaurant]);

    const updateOrderStatusOptimistic = (maDonHang: number, idRestaurant: number, maSanPham: number | null, newState: KitchenStatus) => {
        setOrders(prev => prev.map(o => {
            const isMatch = o.id.maDonHang === maDonHang && o.id.idRestaurant === idRestaurant && (maSanPham === null || o.id.maSanPham === maSanPham);
            if (isMatch && o.trangThai !== 'đã chế biến' && o.trangThai !== 'hoàn thành' && o.trangThai !== 'đã hủy') {
                return { ...o, trangThai: newState };
            }
            return o;
        }));
    };

    const handleUpdateState = async (maDonHang: number, idRestaurant: number, newState: KitchenStatus) => {
        const orderToUpdate = orders.find(o => o.id.maDonHang === maDonHang && o.id.idRestaurant === idRestaurant);
        if (!orderToUpdate) return;

        const itemsToUpdate = orders.filter(o => o.id.maDonHang === maDonHang && o.id.idRestaurant === idRestaurant && o.trangThai !== 'đã chế biến' && o.trangThai !== 'hoàn thành' && o.trangThai !== 'đã hủy');

        // Optimistic UI update
        itemsToUpdate.forEach(item => {
            updateOrderStatusOptimistic(maDonHang, idRestaurant, item.id.maSanPham, newState);
        });

        try {
            await Promise.all(itemsToUpdate.map(item =>
                api.put(
                    `/yeu-cau-don/chi-tiet/trang-thai?maDonHang=${maDonHang}&idRestaurant=${idRestaurant}&maSanPham=${item.id.maSanPham}`,
                    { trangThai: newState }
                )
            ));
        } catch (error) {
            console.error(`Failed to update state for order #${maDonHang}:`, error);
            // Revert on error
            fetchOrders();
        }
    };

    const handleUpdateItemState = async (maDonHang: number, maSanPham: number, idRestaurant: number, newState: KitchenStatus) => {
        // Optimistic UI update
        updateOrderStatusOptimistic(maDonHang, idRestaurant, maSanPham, newState);

        try {
            await api.put(
                `/yeu-cau-don/chi-tiet/trang-thai?maDonHang=${maDonHang}&idRestaurant=${idRestaurant}&maSanPham=${maSanPham}`,
                { trangThai: newState }
            );
        } catch (error) {
            console.error(`Failed to update item state for order #${maDonHang}:`, error);
            // Revert on error
            fetchOrders();
        }
    };

    const groupOrders = (ordersToGroup: ChiTietYeuCauDon[]): GroupedOrder[] => {
        const grouped = ordersToGroup.reduce((acc, order) => {
            const key = order.id.maDonHang;
            if (!acc[key]) {
                acc[key] = {
                    maDonHang: order.id.maDonHang,
                    idRestaurant: order.id.idRestaurant,
                    trangThai: 'chờ xác nhận',
                    ngayTaoDon: order.yeuCauDon?.ngayTaoDon,
                    gioSuDung: order.yeuCauDon?.gioSuDung,
                    items: []
                };
            }
            acc[key].items.push(order);
            return acc;
        }, {} as Record<number, GroupedOrder>);

        return Object.values(grouped).map(group => {
            // 'đã checkin' = khách đã đến, nhưng bếp vẫn cần nấu → xem như pending
            const hasPending = group.items.some(i => i.trangThai === 'chờ xác nhận' || i.trangThai === 'đã checkin');
            const hasCooking = group.items.some(i => i.trangThai === 'đang chế biến');

            // Normalize trạng thái từ backend để tránh lệch hoa/thường (ví dụ: 'Đã hủy' vs 'đã hủy')
            const normalize = (s: string): KitchenStatus => s.toLowerCase() as KitchenStatus;

            // Hoàn thành cho bếp = tất cả món đã ở trạng thái kết thúc (đã chế biến, hoàn thành, hoặc đã hủy)
            const isFinished = (s: string) => ['đã chế biến', 'hoàn thành', 'đã hủy'].includes(normalize(s));
            const allCompleted = group.items.length > 0 && group.items.every(i => isFinished(i.trangThai));
            const hasCancelled = group.items.some(i => normalize(i.trangThai) === 'đã hủy');
            const allCancelled = group.items.length > 0 && group.items.every(i => normalize(i.trangThai) === 'đã hủy');
            const allCheckin = group.items.length > 0 && group.items.every(i => normalize(i.trangThai) === 'đã checkin');

            let overallState: KitchenStatus = 'chờ xác nhận';
            if (allCompleted) {
                overallState = allCancelled ? 'đã hủy' : 'đã chế biến';
            } else if (hasCooking || (group.items.some(i => i.trangThai === 'đã chế biến' || i.trangThai === 'hoàn thành') && hasPending)) {
                overallState = 'đang chế biến';
            } else if (allCheckin) {
                overallState = 'đã checkin';
            } else if (hasPending) {
                overallState = 'chờ xác nhận';
            } else if (hasCancelled) {
                overallState = 'đã hủy';
            }

            return { ...group, trangThai: overallState };
        });
    };

    const filteredOrders = filterByTime(orders, timeFilter);
    const allGroupedOrders = groupOrders(filteredOrders);
    const pending = allGroupedOrders.filter(g => g.trangThai === "chờ xác nhận" || g.trangThai === "đã checkin");
    const cooking = allGroupedOrders.filter(g => g.trangThai === "đang chế biến");
    // Ở bếp, đơn đã nấu xong là khi trạng thái tổng thể = 'hoàn thành'
    const finishedAll = allGroupedOrders.filter(g => g.trangThai === "đã chế biến" || g.trangThai === "hoàn thành");
    const cancelledAll = allGroupedOrders.filter(g => g.trangThai === "đã hủy");

    // Sắp xếp theo giờ sử dụng (sắp đến giờ lên đầu), không có giờ sử dụng thì theo ngày tạo
    const sortByUrgency = (arr: GroupedOrder[]) =>
        [...arr].sort((a, b) => {
            const now = Date.now();
            const ga = a.gioSuDung ? new Date(a.gioSuDung).getTime() : null;
            const gb = b.gioSuDung ? new Date(b.gioSuDung).getTime() : null;
            // Đơn có giờ sử dụng ưu tiên hơn
            if (ga && !gb) return -1;
            if (!ga && gb) return 1;
            if (ga && gb) {
                // Gần giờ sử dụng hơn → lên đầu
                return (ga - now) - (gb - now);
            }
            // Không có giờ sử dụng → theo ngày tạo (cũ trước)
            const ta = a.ngayTaoDon ? new Date(a.ngayTaoDon).getTime() : 0;
            const tb = b.ngayTaoDon ? new Date(b.ngayTaoDon).getTime() : 0;
            return ta - tb;
        });

    const sortByNewest = (arr: GroupedOrder[]) =>
        [...arr].sort((a, b) => {
            const ta = a.ngayTaoDon ? new Date(a.ngayTaoDon).getTime() : 0;
            const tb = b.ngayTaoDon ? new Date(b.ngayTaoDon).getTime() : 0;
            return tb - ta;
        });

    const sortedPending = sortByUrgency(pending);
    const sortedCooking = sortByUrgency(cooking);
    const finished = sortByNewest(finishedAll).slice(0, 10);
    const cancelled = sortByNewest(cancelledAll).slice(0, 10);

    return (
        <div className="flex bg-[#f1f5f9] min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@500;700&display=swap');
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>

                <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", padding: "20px 32px", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1 style={{ color: "#1e293b", margin: 0, fontSize: 24, fontWeight: 800 }}>Màn hình Bếp</h1>
                        <span style={{ color: "#64748b", fontSize: 13 }}>DucToan Restaurant Management</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, gap: 4 }}>
                            {(['today', 'week', 'month'] as TimeFilter[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setTimeFilter(f)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 8,
                                        border: 'none',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: timeFilter === f ? '#3b82f6' : 'transparent',
                                        color: timeFilter === f ? '#fff' : '#64748b',
                                    }}
                                >
                                    {TIME_FILTER_LABELS[f]}
                                </button>
                            ))}
                        </div>
                        <div style={{ background: "#fff", color: "#1e293b", padding: "10px 20px", borderRadius: 12, fontFamily: "'DM Mono', monospace", fontSize: 24, border: "1px solid #e2e8f0" }}>
                            {currentTime?.toLocaleTimeString("vi-VN") || '--:--:--'}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>Đang tải đơn hàng...</div>
                ) : allGroupedOrders.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>Không có món ăn nào cần chuẩn bị.</div>
                ) : (
                    <div style={{ padding: "32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                        <Column title="Đang chờ" orderGroups={sortedPending} color="#f59e0b" bg="#fef3c7" icon="🕐" onUpdateState={handleUpdateState} onUpdateItemState={handleUpdateItemState} />
                        <Column title="Đang nấu" orderGroups={sortedCooking} color="#3b82f6" bg="#dbeafe" icon="🔥" onUpdateState={handleUpdateState} onUpdateItemState={handleUpdateItemState} />
                        <Column title="Đã nấu xong" orderGroups={finished} color="#10b981" bg="#d1fae5" icon="✅" onUpdateState={handleUpdateState} onUpdateItemState={handleUpdateItemState} />
                        <Column title="Đã hủy" orderGroups={cancelled} color="#ef4444" bg="#fee2e2" icon="❌" onUpdateState={handleUpdateState} onUpdateItemState={handleUpdateItemState} />
                    </div>
                )}
            </main>
        </div>
    );
}
