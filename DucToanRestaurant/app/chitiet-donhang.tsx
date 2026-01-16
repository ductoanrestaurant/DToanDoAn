import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ENDPOINTS } from '@/constants/api';

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
};

// --- INTERFACES ---
interface InfoRowProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: string | number;
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
    sanPham?: { // Thêm ? vì có thể API lỗi không join được bảng sản phẩm
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
    tongTien: number | null; // Có thể null
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

// Định nghĩa kiểu cho params
type SearchParams = {
    maDonHang: string;
    idRestaurant: string;
};

// --- COMPONENT ---
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <Ionicons name={icon} size={20} color={COLORS.textSec} style={styles.icon} />
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
);

const ChiTietDonHangScreen = () => {
    const router = useRouter();
    // Ép kiểu params
    const { maDonHang, idRestaurant } = useLocalSearchParams<SearchParams>();

    const [order, setOrder] = useState<YeuCauDon | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // State cho pull-to-refresh

    // Tách hàm fetch ra để dùng lại khi refresh
    const fetchOrderDetails = useCallback(async () => {
        if (!maDonHang || !idRestaurant) return;

        try {
            // endpoint api: .../yeu-cau-don/maDonHang/idRestaurant
            const response = await fetch(`${ENDPOINTS.YEU_CAU_DON}/${maDonHang}/${idRestaurant}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [maDonHang, idRestaurant]);

    useEffect(() => {
        setLoading(true);
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    // Hàm xử lý khi kéo xuống
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

    if (!order) {
        return (
            <SafeAreaView style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={48} color={COLORS.textSec} />
                <Text style={{ marginTop: 10, color: COLORS.textSec }}>Không tìm thấy thông tin đơn hàng.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Xử lý logic an toàn
    const orderStatus = order.chiTietYeuCauDons?.[0]?.trangThai || 'Đang cập nhật';

    // Tính lại tổng tiền từ items để dự phòng trường hợp tongTien API trả về null
    const subtotal = order.chiTietYeuCauDons?.reduce((sum, item) => sum + (item.gia * item.soLuong), 0) || 0;

    // Ưu tiên lấy tongTien từ DB, nếu null thì lấy subtotal
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {/* 1. Trạng thái */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
                    <InfoRow icon="document-text-outline" label="Trạng thái:" value={orderStatus} />
                    <InfoRow icon="card-outline" label="Thanh toán:" value={order.trangThaiThanhToan} />
                    <InfoRow icon="calendar-outline" label="Ngày đặt:" value={new Date(order.ngayTaoDon).toLocaleDateString('vi-VN')} />
                    {order.gioSuDung && <InfoRow icon="time-outline" label="Giờ dùng:" value={new Date(order.gioSuDung).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} />}
                    {order.maBan && <InfoRow icon="grid-outline" label="Bàn số:" value={order.maBan} />}
                </View>

                {/* 2. Danh sách món */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Các món đã đặt</Text>
                    {order.chiTietYeuCauDons?.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <View style={styles.itemDetails}>
                                {/* Safe check cho tên sản phẩm */}
                                <Text style={styles.itemName}>
                                    {item.sanPham?.tenSanPham || `Món #${item.id.maSanPham}`}
                                </Text>
                                <Text style={styles.itemQuantity}>x {item.soLuong}</Text>
                            </View>
                            <Text style={styles.itemPrice}>{(item.gia * item.soLuong).toLocaleString('vi-VN')}đ</Text>
                        </View>
                    ))}
                </View>

                {/* 3. Thanh toán */}
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

                {/* 4. Khách hàng */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin khách hàng</Text>
                    <InfoRow icon="person-outline" label="Họ tên:" value={order.khachHang?.hoTen || 'Khách vãng lai'} />
                    <InfoRow icon="call-outline" label="SĐT:" value={order.khachHang?.sdt || 'Không có'} />
                    <InfoRow icon="chatbubble-ellipses-outline" label="Ghi chú:" value={order.ghiChu || 'Không có'} />
                </View>

                {/* Padding bottom để không bị cấn màn hình */}
                <View style={{height: 20}} />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    scrollContainer: { padding: 15 },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textSec,
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: COLORS.textMain,
        fontWeight: '500',
        textTransform: 'capitalize',
        textAlign: 'right', // Căn phải cho đẹp
        maxWidth: '60%' // Tránh tràn chữ nếu quá dài
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    itemDetails: {
        flex: 1,
        marginRight: 10
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.textMain,
    },
    itemQuantity: {
        fontSize: 13,
        color: COLORS.textSec,
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    paymentLabel: {
        fontSize: 14,
        color: COLORS.textSec,
    },
    paymentValue: {
        fontSize: 14,
        color: COLORS.textMain,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default ChiTietDonHangScreen;