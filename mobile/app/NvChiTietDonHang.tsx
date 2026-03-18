import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import api, { ENDPOINTS, BASE_URL } from '@/constants/api';

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
    id: { maDonHang: number; idRestaurant: number; maSanPham: number; };
    soLuong: number;
    gia: number;
    trangThai: string;
    sanPham?: { tenSanPham: string; };
}

interface YeuCauDon {
    id: { maDonHang: number; idRestaurant: number; };
    trangThaiThanhToan: string;
    ngayTaoDon: string;
    tongTien: number | null;
    maTaiKhoan?: number;
    maBan?: number;
    gioSuDung?: string;
    ghiChu?: string;
    khachHang?: { hoTen: string; sdt: string; };
    nhanVien?: { tenNhanVien: string; };
    thanhToan?: { kieuThanhToan: string; };
    chiTietYeuCauDons: ChiTietYeuCauDon[];
}

type SearchParams = {
    maDonHang: string;
    idRestaurant: string;
};

const getOrderStatus = (chiTiet: ChiTietYeuCauDon[]): string => {
    if (!chiTiet || chiTiet.length === 0) return 'Chờ xác nhận';
    const itemStatuses = chiTiet.map(item => (item.trangThai || '').trim().toLowerCase());

    if (itemStatuses.every(s => s === 'đã hủy' || s === 'từ chối')) return 'Đã hủy';
    if (itemStatuses.length > 0 && itemStatuses.every(s => s === 'hoàn thành' || s === 'đã hủy') && itemStatuses.some(s => s === 'hoàn thành')) return 'Đã hoàn thành';
    if (itemStatuses.every(s => ['hoàn thành', 'đang dùng bữa', 'đã hủy'].includes(s))) return 'Đang dùng bữa';
    if (itemStatuses.some(s => s === 'đang chuẩn bị' || s === 'đang chế biến')) return 'Đang chuẩn bị';
    if (itemStatuses.some(s => ['hoàn thành', 'đang dùng bữa', 'đã hủy'].includes(s)) && itemStatuses.some(s => s === 'chờ xác nhận')) return 'Đang xử lý';
    if (itemStatuses.every(s => s === 'chờ xác nhận')) return 'Chờ xác nhận';

    return 'Đang xử lý';
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

const NvChiTietDonHangScreen = () => {
    const router = useRouter();
    const { maDonHang, idRestaurant } = useLocalSearchParams<SearchParams>();

    const [order, setOrder] = useState<YeuCauDon | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Status update & Modal
    const [processingUpdate, setProcessingUpdate] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [userPoints, setUserPoints] = useState<number>(0);
    const [loadingPoints, setLoadingPoints] = useState(false);

    const fetchOrderDetails = useCallback(async () => {
        if (!maDonHang || !idRestaurant) return;

        try {
            const response = await api.get(`${ENDPOINTS.YEU_CAU_DON}/${maDonHang}/${idRestaurant}`);
            setOrder(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch order details:", err);
            setError("Không thể tải thông tin chi tiết đơn hàng.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [maDonHang, idRestaurant]);

    useFocusEffect(
        useCallback(() => {
            fetchOrderDetails();
        }, [fetchOrderDetails])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrderDetails();
    };

    const handleUpdateStatus = async (newStatus: 'đang dùng bữa' | 'hoàn thành') => {
        if (!order || !idRestaurant) return;

        Alert.alert(
            "Xác nhận cập nhật",
            `Chuyển các món đang thực hiện sang "${newStatus}"?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            setProcessingUpdate(true);
                            const updatePromises = order.chiTietYeuCauDons.map((item) => {
                                if (
                                    item.trangThai.toLowerCase() !== 'đã hủy' &&
                                    item.trangThai.toLowerCase() !== newStatus
                                ) {
                                    return api.put(
                                        `${ENDPOINTS.YEU_CAU_DON}/chi-tiet/trang-thai?maDonHang=${order.id.maDonHang}&idRestaurant=${idRestaurant}&maSanPham=${item.id.maSanPham}`,
                                        { trangThai: newStatus }
                                    );
                                }
                                return Promise.resolve();
                            });

                            await Promise.all(updatePromises);
                            Alert.alert('Thành công', 'Cập nhật trạng thái thành công!');
                            fetchOrderDetails();
                        } catch (error) {
                            console.error("Error updating status:", error);
                            Alert.alert("Lỗi", "Đã có lỗi xảy ra khi cập nhật trạng thái.");
                        } finally {
                            setProcessingUpdate(false);
                        }
                    }
                }
            ]
        );
    };

    const handleOpenPayment = async () => {
        if (!order) return;

        if (order.maTaiKhoan) {
            setLoadingPoints(true);
            try {
                const pointsRes = await api.get(`${ENDPOINTS.KHACH_HANG}/${order.maTaiKhoan}/diem`);
                setUserPoints(pointsRes.data.diemTichLuy || 0);
            } catch (err) {
                console.warn("Could not fetch user points:", err);
                setUserPoints(0);
            } finally {
                setLoadingPoints(false);
            }
        } else {
            setUserPoints(0);
        }

        setShowPaymentModal(true);
    };

    const handleProcessPayment = async (methodType: 'tien_mat' | 'chuyen_khoan' | 'vi') => {
        if (!order || !idRestaurant) return;

        const subtotal = order.chiTietYeuCauDons?.reduce((sum, item) => sum + (item.gia * item.soLuong), 0) || 0;
        const total = order.tongTien ?? subtotal;

        if (total <= 0) {
            Alert.alert("Thông báo", "Đơn hàng có tổng tiền 0đ không cần thanh toán.");
            setShowPaymentModal(false);
            return;
        }

        if (methodType === 'vi') {
            if (userPoints < total || !order.maTaiKhoan) {
                Alert.alert("Lỗi", "Ví khách hàng ẩn danh hoặc không đủ điểm để thanh toán.");
                return;
            }
        }

        if (methodType === 'chuyen_khoan') {
            setProcessingUpdate(true);
            try {
                const paymentResponse = await api.post(ENDPOINTS.CREATE_PAYOS_PAYMENT, {
                    amount: total,
                    orderId: order.id.maDonHang,
                    paymentMethod: 'payos',
                    returnUrl: `${BASE_URL}/payment/success`,
                    cancelUrl: `${BASE_URL}/payment/cancel`,
                });
                const paymentUrl = paymentResponse.data.checkoutUrl;
                if (paymentUrl) {
                    setShowPaymentModal(false);
                    router.push({
                        pathname: '/PaymentWebView',
                        params: {
                            url: paymentUrl,
                            orderId: order.id.maDonHang.toString(),
                            idRestaurant: idRestaurant.toString(),
                            idThanhToan: '2',
                        }
                    });
                } else {
                    Alert.alert("Lỗi", "Không thể tạo link thanh toán.");
                }
            } catch (err: any) {
                console.error("Payment failed:", err);
                Alert.alert("Lỗi thanh toán", `Không thể khởi tạo thanh toán: ${err.response?.data?.error || err.message}`);
            } finally {
                setProcessingUpdate(false);
            }
            return;
        }

        Alert.alert(
            "Xác nhận thanh toán",
            `Xác nhận khách đã thanh toán qua ${methodType === 'tien_mat' ? 'Tiền mặt' : 'Ví'} số tiền ${total.toLocaleString('vi-VN')}đ?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        setProcessingUpdate(true);
                        try {
                            const idThanhToan = methodType === 'tien_mat' ? 1 : 3;

                            if (methodType === 'vi' && order.maTaiKhoan) {
                                await api.post(`${ENDPOINTS.KHACH_HANG}/${order.maTaiKhoan}/tru-diem`, { diem: total });
                            }

                            await api.patch(
                                `${ENDPOINTS.YEU_CAU_DON}/${order.id.maDonHang}/${idRestaurant}/thanh-toan`,
                                {
                                    trangThaiThanhToan: 'đã thanh toán',
                                    idThanhToan: idThanhToan,
                                }
                            );

                            Alert.alert('Thành công', 'Đã cập nhật thông tin thanh toán.');
                            setShowPaymentModal(false);
                            fetchOrderDetails();
                        } catch (error) {
                            console.error("Payment error:", error);
                            Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thanh toán.");
                        } finally {
                            setProcessingUpdate(false);
                        }
                    }
                }
            ]
        );
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

    const overallStatus = getOrderStatus(order.chiTietYeuCauDons);
    const subtotal = order.chiTietYeuCauDons?.reduce((sum, item) => sum + (item.gia * item.soLuong), 0) || 0;
    const finalTotal = order.tongTien ?? subtotal;

    const isCompleted = overallStatus === 'Đã hoàn thành' || overallStatus === 'Đã hủy';
    const isUnpaid = order.trangThaiThanhToan.toLowerCase() === 'chưa thanh toán' && overallStatus !== 'Đã hủy';
    const isCheckedIn = overallStatus === 'Đang dùng bữa';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn #{order.id.maDonHang}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}>
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
                    {order.nhanVien && <InfoRow icon="id-card-outline" label="Nhân viên:" value={order.nhanVien.tenNhanVien} />}
                    {order.ghiChu && <InfoRow icon="chatbubble-ellipses-outline" label="Ghi chú:" value={order.ghiChu} />}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Các món đã đặt</Text>
                    {order.chiTietYeuCauDons?.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.itemQuantity}>{item.soLuong}x</Text>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.sanPham?.tenSanPham || `Món #${item.id.maSanPham}`}</Text>
                                <Text style={styles.itemPricePerUnit}>{item.gia.toLocaleString('vi-VN')}đ <Text style={styles.itemStatus}>({item.trangThai})</Text></Text>
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
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{finalTotal.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    {order.thanhToan && <InfoRow icon="wallet-outline" label="Phương thức:" value={order.thanhToan.kieuThanhToan} />}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                {!isCompleted && (
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: isUnpaid ? 10 : 0 }}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: isCheckedIn ? COLORS.lightGray : COLORS.purple }]} onPress={() => handleUpdateStatus('đang dùng bữa')} disabled={processingUpdate || isCheckedIn}>
                            <Text style={[styles.actionBtnText, isCheckedIn && { color: COLORS.textSec }]}>Checkin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: isUnpaid ? COLORS.lightGray : COLORS.green }]} onPress={() => handleUpdateStatus('hoàn thành')} disabled={processingUpdate || isUnpaid}>
                            <Text style={[styles.actionBtnText, isUnpaid && { color: COLORS.textSec }]}>Hoàn thành đơn</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {isUnpaid && (
                    <TouchableOpacity style={styles.paymentButton} onPress={handleOpenPayment} disabled={processingUpdate}>
                        <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Payment Modal */}
            <Modal visible={showPaymentModal} transparent={true} animationType="fade" onRequestClose={() => setShowPaymentModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Phương thức thanh toán</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)} disabled={processingUpdate}>
                                <Ionicons name="close-circle" size={28} color="#999" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ marginBottom: 15, color: COLORS.textSec }}>
                            Thanh toán cho đơn: #{order?.id.maDonHang}
                        </Text>

                        {/* Tiền mặt */}
                        <TouchableOpacity style={styles.paymentOption} onPress={() => handleProcessPayment('tien_mat')} disabled={processingUpdate}>
                            <View style={[styles.iconBox, { backgroundColor: '#E1F5FE' }]}><Ionicons name="cash-outline" size={24} color={COLORS.blue} /></View>
                            <Text style={styles.paymentOptionText}>Khách trả Tiền mặt</Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textSec} />
                        </TouchableOpacity>

                        {/* Chuyển khoản */}
                        <TouchableOpacity style={styles.paymentOption} onPress={() => handleProcessPayment('chuyen_khoan')} disabled={processingUpdate}>
                            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}><Ionicons name="qr-code-outline" size={24} color={COLORS.green} /></View>
                            <Text style={styles.paymentOptionText}>Chuyển khoản</Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textSec} />
                        </TouchableOpacity>

                        {/* Ví khách hàng */}
                        <TouchableOpacity
                            style={[styles.paymentOption, (!order?.maTaiKhoan || userPoints < (order?.tongTien ?? 0)) && { opacity: 0.5 }]}
                            onPress={() => handleProcessPayment('vi')}
                            disabled={processingUpdate || !order?.maTaiKhoan || userPoints < (order?.tongTien ?? 0)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}><Ionicons name="wallet-outline" size={24} color={COLORS.primary} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.paymentOptionText}>Dùng Ví khách hàng</Text>
                                {loadingPoints ? (
                                    <ActivityIndicator size="small" color={COLORS.primary} style={{ alignSelf: 'flex-start' }} />
                                ) : (
                                    <Text style={{ fontSize: 12, color: COLORS.textSec, marginLeft: 15 }}>Số dư: {userPoints.toLocaleString('vi-VN')}đ</Text>
                                )}
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textSec} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 20 },
    errorText: { marginTop: 10, color: COLORS.textSec, fontSize: 16, textAlign: 'center' },
    backButtonCentered: { marginTop: 20, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    backButtonText: { color: COLORS.white, fontWeight: 'bold' },
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    scrollContainer: { padding: 15 },
    card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, paddingBottom: 10 },
    statusContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statusBadge: { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, minWidth: 120, alignItems: 'center' },
    statusText: { fontSize: 13, fontWeight: 'bold', textTransform: 'capitalize' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    icon: { marginRight: 12, width: 20 },
    infoLabel: { fontSize: 14, color: COLORS.textSec, flex: 1 },
    infoValue: { fontSize: 14, color: COLORS.textMain, fontWeight: '500', textAlign: 'right', maxWidth: '60%' },
    itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    itemQuantity: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginRight: 15 },
    itemDetails: { flex: 1, marginRight: 10 },
    itemName: { fontSize: 15, fontWeight: '500', color: COLORS.textMain, marginBottom: 2 },
    itemPricePerUnit: { fontSize: 13, color: COLORS.textSec },
    itemStatus: { fontStyle: 'italic', color: '#999' },
    itemPriceTotal: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 5 },
    paymentLabel: { fontSize: 14, color: COLORS.textSec },
    paymentValue: { fontSize: 14, color: COLORS.textMain },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingHorizontal: 5 },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, padding: 15, borderTopWidth: 1, borderTopColor: COLORS.lightGray },
    actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    actionBtnText: { color: COLORS.white, fontSize: 15, fontWeight: 'bold' },
    paymentButton: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
    paymentButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', backgroundColor: COLORS.white, borderRadius: 20, padding: 20, elevation: 5 },
    modalHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    paymentOptionText: { fontSize: 16, color: COLORS.textMain, marginLeft: 15, fontWeight: '500', flex: 1 },
});

export default NvChiTietDonHangScreen;
