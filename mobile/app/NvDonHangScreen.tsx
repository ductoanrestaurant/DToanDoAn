import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    TextInput,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { ENDPOINTS } from '@/constants/api';

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

interface ChiTietYeuCauDon {
    id: {
        maDonHang: number;
        idRestaurant: number;
        maSanPham: number;
    };
    soLuong: number;
    gia: number;
    trangThai: string;
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
    maTaiKhoan?: number;
    maBan?: number;
    khachHang?: {
        hoTen: string;
        sdt: string;
    };
    chiTietYeuCauDons: ChiTietYeuCauDon[];
}

const getOrderStatus = (chiTiet: ChiTietYeuCauDon[]): string => {
    if (!chiTiet || chiTiet.length === 0) return 'Chờ xác nhận';
    const itemStatuses = chiTiet.map(item => (item.trangThai || '').trim().toLowerCase());

    if (itemStatuses.every(s => s === 'đã hủy' || s === 'từ chối')) return 'Đã hủy';
    if (itemStatuses.length > 0 && itemStatuses.every(s => s === 'hoàn thành' || s === 'đã hủy') && itemStatuses.some(s => s === 'hoàn thành')) return 'Đã hoàn thành';
    if (itemStatuses.every(s => ['đã chế biến', 'hoàn thành', 'đã hủy'].includes(s)) && itemStatuses.some(s => s === 'đã chế biến')) return 'Đã chế biến';
    if (itemStatuses.some(s => s === 'đã checkin') && itemStatuses.every(s => ['hoàn thành', 'đã checkin', 'đã hủy'].includes(s))) return 'Đã checkin';
    if (itemStatuses.some(s => s === 'đang chế biến')) return 'Đang chế biến';
    if (itemStatuses.some(s => s === 'đã chế biến')) return 'Đã chế biến';
    if (itemStatuses.every(s => s === 'chờ xác nhận')) return 'Chờ xác nhận';

    return 'Đang xử lý';
};

const StatusBadge: React.FC<{ text: string }> = ({ text }) => {
    const getStatusStyle = (status: string) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'đã thanh toán':
            case 'đã hoàn thành':
            case 'hoàn thành':
                return { backgroundColor: COLORS.green, color: COLORS.white };
            case 'chưa thanh toán':
                return { backgroundColor: COLORS.yellow, color: COLORS.textMain };
            case 'đã hủy':
                return { backgroundColor: COLORS.red, color: COLORS.white };
            case 'chờ xác nhận':
                return { backgroundColor: COLORS.yellow, color: COLORS.white };
            case 'đã checkin':
                return { backgroundColor: COLORS.purple, color: COLORS.white };
            case 'đã chế biến':
                return { backgroundColor: '#0d9488', color: COLORS.white };
            case 'đang chế biến':
            case 'đang xử lý':
                return { backgroundColor: COLORS.primary, color: COLORS.white };
            default:
                return { backgroundColor: COLORS.lightGray, color: COLORS.textMain };
        }
    };
    const style = getStatusStyle(text);
    return (
        <View style={[{ borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, minWidth: 100, alignItems: 'center' }, { backgroundColor: style.backgroundColor }]}>
            <Text style={[{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }, { color: style.color }]}>{text}</Text>
        </View>
    );
};

const NvDonHangScreen = () => {
    const [orders, setOrders] = useState<YeuCauDon[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [idRestaurant, setIdRestaurant] = useState<number | null>(null);

    const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
    const [searchPhone, setSearchPhone] = useState<string>('');
    const filterOptions = ['Tất cả', 'Chưa thanh toán', 'Đã thanh toán', 'Chờ xác nhận', 'Đang xử lý', 'Đang chế biến', 'Đã checkin', 'Đã hoàn thành', 'Đã hủy'];

    // Payment Modal State
    const [selectedOrder, setSelectedOrder] = useState<YeuCauDon | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [userPoints, setUserPoints] = useState<number>(0);
    const [loadingPoints, setLoadingPoints] = useState(false);

    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        try {
            const employeeInfoStr = await AsyncStorage.getItem('employeeInfo');
            if (!employeeInfoStr) {
                Alert.alert("Lỗi", "Không tìm thấy thông tin nhân viên.");
                router.replace('/login');
                return;
            }

            const employeeInfo = JSON.parse(employeeInfoStr);
            const rId = employeeInfo.idRestaurant;
            setIdRestaurant(rId);

            if (rId) {
                const response = await api.get(`${ENDPOINTS.YEU_CAU_DON}/restaurant/${rId}`);
                let allOrders: YeuCauDon[] = response.data;

                // Lọc đơn hàng hôm nay
                const today = new Date();
                const todayOrders = allOrders.filter(order => {
                    if (!order.ngayTaoDon) return false;
                    const orderDate = new Date(order.ngayTaoDon);
                    return orderDate.getDate() === today.getDate() &&
                           orderDate.getMonth() === today.getMonth() &&
                           orderDate.getFullYear() === today.getFullYear();
                });

                setOrders(todayOrders.sort((a, b) => new Date(b.ngayTaoDon).getTime() - new Date(a.ngayTaoDon).getTime()));
            }
        } catch (error) {
            console.error("Failed to fetch today's orders:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng hôm nay.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchOrders();
        }, [fetchOrders])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleUpdateStatus = async (order: YeuCauDon, newStatus: 'đã checkin' | 'hoàn thành') => {
        if (!idRestaurant) return;

        Alert.alert(
            "Xác nhận cập nhật",
            `Chuyển các món đang thực hiện sang "${newStatus}"?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            setLoading(true);
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
                            
                            // Nếu đánh dấu hoàn thành đơn mà khách thanh toán bằng tiền mặt trước đó thì ta ko cần đổi gì, hoặc ta cập nhật đã thanh toán
                            // Trong yêu cầu: nhân viên chọn chức năng thanh toán => sẽ tách riêng nút thanh toán.
                            Alert.alert('Thành công', 'Cập nhật trạng thái chế biến thành công!');
                            fetchOrders();
                        } catch (error) {
                            console.error("Error updating status:", error);
                            Alert.alert("Lỗi", "Đã có lỗi xảy ra khi cập nhật trạng thái.");
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleOpenPayment = async (order: YeuCauDon) => {
        setSelectedOrder(order);
        
        // Fetch điểm khách hàng nếu có mã tài khoản
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
        if (!selectedOrder || !idRestaurant) return;
        
        const subtotal = selectedOrder.chiTietYeuCauDons?.reduce((sum, item) => sum + (item.gia * item.soLuong), 0) || 0;
        const total = selectedOrder.tongTien ?? subtotal;

        if (total <= 0) {
            Alert.alert("Thông báo", "Đơn hàng có tổng tiền 0đ không cần thanh toán.");
            setShowPaymentModal(false);
            return;
        }

        if (methodType === 'vi') {
            if (userPoints < total || !selectedOrder.maTaiKhoan) {
                Alert.alert("Lỗi", "Ví khách hàng ẩn danh hoặc không đủ điểm để thanh toán.");
                return;
            }
        }

        Alert.alert(
            "Xác nhận thanh toán",
            `Xác nhận khách đã thanh toán qua ${methodType === 'tien_mat' ? 'Tiền mặt' : methodType === 'chuyen_khoan' ? 'Chuyển khoản' : 'Ví'} số tiền ${total.toLocaleString('vi-VN')}đ?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        setProcessingPayment(true);
                        try {
                            const idThanhToan = methodType === 'tien_mat' ? 1 : methodType === 'chuyen_khoan' ? 2 : 3;
                            
                            // Nếu dùng ví, trừ điểm khách hàng trước
                            if (methodType === 'vi' && selectedOrder.maTaiKhoan) {
                                await api.post(`${ENDPOINTS.KHACH_HANG}/${selectedOrder.maTaiKhoan}/tru-diem`, { diem: total });
                            }

                            // Cập nhật đơn hàng
                            await api.patch(
                                `${ENDPOINTS.YEU_CAU_DON}/${selectedOrder.id.maDonHang}/${idRestaurant}/thanh-toan`,
                                {
                                    trangThaiThanhToan: 'đã thanh toán',
                                    idThanhToan: idThanhToan,
                                }
                            );

                            Alert.alert('Thành công', 'Đã cập nhật thông tin thanh toán.');
                            setShowPaymentModal(false);
                            fetchOrders();
                        } catch (error) {
                            console.error("Payment error:", error);
                            Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thanh toán.");
                        } finally {
                            setProcessingPayment(false);
                        }
                    }
                }
            ]
        );
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={60} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>Hôm nay không có đơn hàng nào.</Text>
        </View>
    );

    const renderOrderCard = ({ item }: { item: YeuCauDon }) => {
        const orderStatus = getOrderStatus(item.chiTietYeuCauDons);
        const subtotal = item.chiTietYeuCauDons?.reduce((sum, sp) => sum + (sp.gia * sp.soLuong), 0) || 0;
        const total = item.tongTien ?? subtotal;
        const isCompleted = orderStatus === 'Đã hoàn thành' || orderStatus === 'Đã hủy';
        const isUnpaid = item.trangThaiThanhToan.toLowerCase() === 'chưa thanh toán' && orderStatus !== 'Đã hủy';

        return (
            <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push({ 
                    pathname: '/NvChiTietDonHang', 
                    params: { maDonHang: item.id.maDonHang, idRestaurant: item.id.idRestaurant } 
                })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}># {item.id.maDonHang} {item.maBan ? `- Bàn ${item.maBan}` : ''}</Text>
                    <Text style={styles.orderTime}>{new Date(item.ngayTaoDon).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.customerName}>
                        <Ionicons name="person-outline" size={14} color={COLORS.textSec} /> {item.khachHang?.hoTen || 'Khách vãng lai'}
                    </Text>

                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Trạng thái đơn:</Text>
                        <StatusBadge text={orderStatus} />
                    </View>

                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Thanh toán:</Text>
                        <StatusBadge text={item.trangThaiThanhToan} />
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>Tổng cộng:</Text>
                        <Text style={styles.totalAmount}>{total.toLocaleString('vi-VN')}đ</Text>
                    </View>


                </View>
            </TouchableOpacity>
        );
    };

    const filteredOrders = orders.filter(order => {
        let statusMatch = true;
        if (filterStatus !== 'Tất cả') {
            const oStatus = getOrderStatus(order.chiTietYeuCauDons).toLowerCase();
            const pStatus = (order.trangThaiThanhToan || '').toLowerCase();
            
            if (filterStatus === 'Chưa thanh toán' || filterStatus === 'Đã thanh toán') {
                statusMatch = pStatus === filterStatus.toLowerCase();
            } else {
                statusMatch = oStatus === filterStatus.toLowerCase();
            }
        }

        let phoneMatch = true;
        const keyword = searchPhone.trim();
        if (keyword !== '') {
            const phoneRaw = order.khachHang?.sdt || '';
            const phoneDigits = phoneRaw.replace(/\D/g, '');
            const last4 = phoneDigits.slice(-Math.max(4, keyword.length)); // Lấy các số cuối cùng để so sánh
            phoneMatch = last4.includes(keyword);
        }

        return statusMatch && phoneMatch;
    });

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đơn hàng hôm nay</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.filterSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={COLORS.textSec} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Tìm đơn theo SĐT khách hàng..."
                        value={searchPhone}
                        onChangeText={setSearchPhone}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {filterOptions.map(option => (
                        <TouchableOpacity 
                            key={option} 
                            style={[styles.filterPill, filterStatus === option && styles.filterPillActive]}
                            onPress={() => setFilterStatus(option)}
                        >
                            <Text style={[styles.filterPillText, filterStatus === option && styles.filterPillTextActive]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading && !refreshing && !orders.length ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderCard}
                    keyExtractor={(item) => `${item.id.maDonHang}-${item.id.idRestaurant}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
                />
            )}


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10,
        backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    filterSection: { backgroundColor: COLORS.white, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, marginHorizontal: 15, paddingHorizontal: 15, borderRadius: 10, height: 40, marginBottom: 10 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.textMain },
    filterScroll: { paddingHorizontal: 10 },
    filterPill: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: COLORS.background, borderRadius: 20, marginHorizontal: 5 },
    filterPillActive: { backgroundColor: COLORS.primary },
    filterPillText: { fontSize: 13, color: COLORS.textSec, fontWeight: '600' },
    filterPillTextActive: { color: COLORS.white },
    listContainer: { padding: 15, paddingBottom: 80 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginBottom: 15,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, paddingBottom: 10, marginBottom: 10 },
    orderId: { fontWeight: 'bold', fontSize: 16, color: COLORS.textMain },
    orderTime: { color: COLORS.textSec, fontSize: 14 },
    cardBody: {},
    customerName: { fontSize: 15, color: COLORS.textMain, marginBottom: 10, fontWeight: '500' },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    statusLabel: { fontSize: 14, color: COLORS.textSec, fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: 10 },
    totalText: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    totalAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
    actionContainer: { marginTop: 15 },
    statusButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 10 },
    btn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
    btnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 13 },
    payBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, gap: 5 },
    payBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 15, fontSize: 16, color: COLORS.textSec, textAlign: 'center' },
    
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', backgroundColor: COLORS.white, borderRadius: 20, padding: 20, elevation: 5 },
    modalHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    paymentOptionText: { fontSize: 16, color: COLORS.textMain, marginLeft: 15, fontWeight: '500', flex: 1 },
});

export default NvDonHangScreen;
