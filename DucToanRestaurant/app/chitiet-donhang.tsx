import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api, { ENDPOINTS } from '@/constants/api'; // Use the authenticated api instance

const COLORS = {
    primary: '#FF6600',
    white: '#FFFFFF',
    background: '#F7F8FC',
    textMain: '#333333',
    textSec: '#888888',
    lightGray: '#E8E8E8',
    green: '#2ECC71',
    red: '#E74C3C',
    blue: '#3498DB',
    yellow: '#F1C40F',
    purple: '#9B59B6',
};

// --- INTERFACES ---
interface InfoRowProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: string | number;
    valueStyle?: object;
}

interface ChiTietYeuCauDon {
    id: {
        maDonHang: number;
        idRestaurant: number;
        maSanPham: number;
    };
    soLuong: number;
    gia: number;
    trangThai: string | null;
    sanPham?: {
        tenSanPham: string;
    };
}

interface YeuCauDon {
    id: {
        maDonHang: number;
        idRestaurant: number;
    };
    trangThaiThanhToan: string;
    ngayTaoDon: string;
    tongTien: number | null;
    maBan?: number;
    gioSuDung?: string;
    ghiChu?: string;
    thanhToan?: {
        kieuThanhToan: string;
    };
    chiTietYeuCauDons: ChiTietYeuCauDon[];
    khachHang?: {
        hoTen: string;
        sdt: string;
    };
}

type SearchParams = {
    maDonHang: string;
    idRestaurant: string;
};

// --- Reusable Components ---
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, valueStyle }) => (
    <View style={styles.infoRow}>
        <Ionicons name={icon} size={20} color={COLORS.textSec} style={styles.icon} />
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueStyle]} numberOfLines={1}>{value}</Text>
    </View>
);

const StatusBadge: React.FC<{ text: string }> = ({ text }) => {
    const getStatusStyle = (status: string) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'đã hoàn thành':
            case 'đã thanh toán':
                return { backgroundColor: COLORS.green, color: COLORS.white };
            case 'chưa thanh toán':
                return { backgroundColor: COLORS.yellow, color: COLORS.textMain };
            case 'đã hủy':
            case 'từ chối':
                return { backgroundColor: COLORS.red, color: COLORS.white };
            case 'chờ xác nhận':
            case 'đã xác nhận':
            case 'đã checkin':
                return { backgroundColor: COLORS.blue, color: COLORS.white };
            case 'đang chế biến':
            case 'đang chuẩn bị':
                return { backgroundColor: COLORS.primary, color: COLORS.white };
            case 'đang dùng bữa':
            case 'đang sử dụng':
                return { backgroundColor: COLORS.purple, color: COLORS.white };
            default:
                return { backgroundColor: COLORS.lightGray, color: COLORS.textMain };
        }
    };
    const style = getStatusStyle(text);
    return (
        <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
            <Text style={[styles.statusText, { color: style.color }]}>{text || 'N/A'}</Text>
        </View>
    );
};

// --- Main Component ---
const ChiTietDonHangScreen = () => {
    const router = useRouter();
    const { maDonHang, idRestaurant } = useLocalSearchParams<SearchParams>();

    const [order, setOrder] = useState<YeuCauDon | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetails = useCallback(async () => {
        if (!maDonHang || !idRestaurant) return;

        try {
            const response = await api.get(`${ENDPOINTS.YEU_CAU_DON}/${maDonHang}/${idRestaurant}`);
            setOrder(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch order details:", err);
            if (err.response?.status === 403) {
                setError("Bạn không có quyền xem đơn hàng này.");
            } else {
                setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [maDonHang, idRestaurant]);

    useEffect(() => {
        setLoading(true);
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrderDetails();
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (error || !order) {
        return (
            <SafeAreaView style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={48} color={COLORS.textSec} />
                <Text style={styles.errorText}>{error || "Không tìm thấy thông tin đơn hàng."}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCentered}>
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const orderStatus = order.chiTietYeuCauDons?.[0]?.trangThai || 'Đang cập nhật';
    const subtotal = order.chiTietYeuCauDons?.reduce((sum, item) => sum + (item.gia * item.soLuong), 0) || 0;
    const finalTotal = order.tongTien ?? subtotal;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đơn hàng #{order.id.maDonHang}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Trạng thái</Text>
                    <View style={styles.statusContainer}>
                        <StatusBadge text={orderStatus} />
                        <StatusBadge text={order.trangThaiThanhToan} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin chung</Text>
                    <InfoRow icon="calendar-outline" label="Ngày đặt:" value={new Date(order.ngayTaoDon).toLocaleDateString('vi-VN')} />
                    {order.gioSuDung && <InfoRow icon="time-outline" label="Giờ dùng:" value={`${new Date(order.gioSuDung).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(order.gioSuDung).toLocaleDateString('vi-VN')}`} />}
                    {order.maBan && <InfoRow icon="grid-outline" label="Bàn số:" value={order.maBan} />}
                    <InfoRow icon="person-outline" label="Khách hàng:" value={order.khachHang?.hoTen || 'Khách vãng lai'} />
                    <InfoRow icon="call-outline" label="SĐT:" value={order.khachHang?.sdt || 'Không có'} />
                    {order.ghiChu && <InfoRow icon="chatbubble-ellipses-outline" label="Ghi chú:" value={order.ghiChu} />}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Các món đã đặt</Text>
                    {order.chiTietYeuCauDons?.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.itemQuantity}>{item.soLuong}x</Text>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.sanPham?.tenSanPham || `Món #${item.id.maSanPham}`}</Text>
                                <Text style={styles.itemPricePerUnit}>{item.gia.toLocaleString('vi-VN')}đ</Text>
                            </View>
                            <Text style={styles.itemPriceTotal}>{(item.gia * item.soLuong).toLocaleString('vi-VN')}đ</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Tạm tính</Text>
                        <Text style={styles.paymentValue}>{subtotal.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Giảm giá</Text>
                        <Text style={styles.paymentValue}>0đ</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{finalTotal.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    {order.thanhToan && <InfoRow icon="wallet-outline" label="Phương thức:" value={order.thanhToan.kieuThanhToan} />}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 20 },
    errorText: { marginTop: 10, color: COLORS.textSec, fontSize: 16, textAlign: 'center' },
    backButtonCentered: { marginTop: 20, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    backButtonText: { color: COLORS.white, fontWeight: 'bold' },
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10,
        backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    scrollContainer: { padding: 15 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginBottom: 15,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    },
    cardTitle: {
        fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 15,
        borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, paddingBottom: 10,
    },
    statusContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statusBadge: { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, minWidth: 120, alignItems: 'center' },
    statusText: { fontSize: 13, fontWeight: 'bold', textTransform: 'capitalize' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    icon: { marginRight: 12, width: 20 },
    infoLabel: { fontSize: 14, color: COLORS.textSec, flex: 1 },
    infoValue: { fontSize: 14, color: COLORS.textMain, fontWeight: '500', textAlign: 'right', maxWidth: '60%' },
    itemContainer: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
    },
    itemQuantity: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginRight: 15 },
    itemDetails: { flex: 1, marginRight: 10 },
    itemName: { fontSize: 15, fontWeight: '500', color: COLORS.textMain, marginBottom: 2 },
    itemPricePerUnit: { fontSize: 13, color: COLORS.textSec },
    itemPriceTotal: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 5 },
    paymentLabel: { fontSize: 14, color: COLORS.textSec },
    paymentValue: { fontSize: 14, color: COLORS.textMain },
    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10,
        borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingHorizontal: 5,
    },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
});

export default ChiTietDonHangScreen;
