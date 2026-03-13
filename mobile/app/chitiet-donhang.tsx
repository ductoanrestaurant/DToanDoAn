import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api, { BASE_URL, ENDPOINTS } from '@/constants/api'; // Use the authenticated api instance

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
    maTaiKhoan: number; // Added for point refund logic
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

const getOverallOrderStatus = (chiTiet: ChiTietYeuCauDon[]): string => {
    if (!chiTiet || chiTiet.length === 0) {
        return 'Chờ xác nhận';
    }
    const itemStatuses = chiTiet.map(item => (item.trangThai || '').trim().toLowerCase());

    if (itemStatuses.some(s => s === 'đã hủy' || s === 'từ chối')) {
        return 'Đã hủy';
    }
    if (itemStatuses.length > 0 && itemStatuses.every(s => s === 'hoàn thành')) {
        return 'Đã hoàn thành';
    }
    if (itemStatuses.some(s => s === 'đang dùng bữa' || s === 'đang sử dụng')) {
        return 'Đang dùng bữa';
    }
    if (itemStatuses.some(s => s === 'đang chế biến' || s === 'đang chuẩn bị')) {
        return 'Đang chế biến';
    }
    if (itemStatuses.some(s => s === 'đã xác nhận' || s === 'đã checkin')) {
        return 'Đã xác nhận';
    }
    return 'Chờ xác nhận';
};


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
            case 'hoàn thành':
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
            case 'đang xử lý':
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


const ChiTietDonHangScreen = () => {
    const router = useRouter();
    const { maDonHang, idRestaurant } = useLocalSearchParams<SearchParams>();

    const [order, setOrder] = useState<YeuCauDon | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

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

    const handleCancelOrder = async () => {
        Alert.alert(
            "Xác nhận hủy",
            "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Có, hủy",
                    style: "destructive",
                    onPress: async () => {
                        if (!order || !maDonHang || !idRestaurant) return;
                        setIsCancelling(true);
                        try {
                            // Step 1: Cancel all items in the order
                            const cancelPromises = order.chiTietYeuCauDons.map(item =>
                                api.put(
                                    `${ENDPOINTS.YEU_CAU_DON}/chi-tiet/trang-thai`,
                                    { trangThai: 'Đã hủy' },
                                    {
                                        params: {
                                            maDonHang: item.id.maDonHang,
                                            idRestaurant: item.id.idRestaurant,
                                            maSanPham: item.id.maSanPham,
                                        },
                                    }
                                )
                            );
                            await Promise.all(cancelPromises);

                            let successMessage = "Đơn hàng đã được hủy.";

                            // Step 2: If order was paid, refund points
                            if (
                                order.trangThaiThanhToan.toLowerCase() === 'đã thanh toán' &&
                                order.maTaiKhoan &&
                                order.tongTien &&
                                order.tongTien > 0
                            ) {
                                try {
                                    await api.post(`${ENDPOINTS.KHACH_HANG}/${order.maTaiKhoan}/cong-diem`, {
                                        diem: order.tongTien,
                                    });
                                    successMessage += `\n\nĐã hoàn lại ${order.tongTien.toLocaleString('vi-VN')} điểm vào ví của bạn.`;
                                } catch (refundError) {
                                    console.error("Point refund failed:", refundError);
                                    successMessage += "\n\nTuy nhiên, đã có lỗi xảy ra khi hoàn điểm.";
                                }
                            }

                            Alert.alert("Thành công", successMessage);
                            fetchOrderDetails(); // Refresh to show updated status

                        } catch (err) {
                            console.error("Order cancellation failed:", err);
                            Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
                        } finally {
                            setIsCancelling(false);
                        }
                    },
                },
            ]
        );
    };

    const handlePayment = async () => {
        if (!order || !order.tongTien) {
            Alert.alert("Lỗi", "Không có thông tin tổng tiền để thanh toán.");
            return;
        }
        setIsPaying(true);
        try {
            const paymentResponse = await api.post(ENDPOINTS.CREATE_PAYOS_PAYMENT, {
                amount: order.tongTien,
                orderId: order.id.maDonHang,
                paymentMethod: 'payos',
                returnUrl: `${BASE_URL}/payment/success`,
                cancelUrl: `${BASE_URL}/payment/cancel`,
            });

            const paymentUrl = paymentResponse.data.checkoutUrl;
            if (paymentUrl) {
                router.push({
                    pathname: '/PaymentWebView',
                    params: {
                        url: paymentUrl,
                        orderId: order.id.maDonHang.toString(),
                        idRestaurant: order.id.idRestaurant.toString(),
                    }
                });
            } else {
                throw new Error("Không thể tạo link thanh toán.");
            }
        } catch (err) {
            console.error("Payment creation failed:", err);
            Alert.alert("Lỗi thanh toán", "Không thể khởi tạo thanh toán. Vui lòng thử lại.");
        } finally {
            setIsPaying(false);
        }
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

    const overallStatus = getOverallOrderStatus(order.chiTietYeuCauDons);
    const subtotal = order.chiTietYeuCauDons?.reduce((sum, item) => sum + (item.gia * item.soLuong), 0) || 0;
    const finalTotal = order.tongTien ?? subtotal;

    const canPay = order.trangThaiThanhToan.toLowerCase() === 'chưa thanh toán' && overallStatus.toLowerCase() !== 'đã hủy';
    const canCancel = overallStatus.toLowerCase() === 'chờ xác nhận';

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
                        <StatusBadge text={overallStatus} />
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

                <View style={{ height: 80 }} />
            </ScrollView>

            {(canPay || canCancel) && (
                <View style={styles.footer}>
                    {canCancel && (
                        <TouchableOpacity
                            style={[styles.cancelButton, (isCancelling || isPaying) && styles.disabledButton]}
                            onPress={handleCancelOrder}
                            disabled={isCancelling || isPaying}
                        >
                            {isCancelling ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.paymentButtonText}>Hủy đơn</Text>
                            )}
                        </TouchableOpacity>
                    )}
                    { canPay && (
                        <TouchableOpacity
                            style={[styles.paymentButton, (isPaying || isCancelling) && styles.disabledButton]}
                            onPress={handlePayment}
                            disabled={isPaying || isCancelling}
                        >
                            {isPaying ?(
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            )}
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
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white, padding: 15,
        borderTopWidth: 1, borderTopColor: COLORS.lightGray,
        flexDirection: 'row',
        gap: 10,
    },
    paymentButton: {
        backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 15,
        alignItems: 'center', justifyContent: 'center',
        flex: 1,
    },
    cancelButton: {
        backgroundColor: COLORS.red,
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    paymentButtonText: {
        color: COLORS.white, fontSize: 16, fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
});

export default ChiTietDonHangScreen;
