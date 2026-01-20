import api, { BASE_URL_IMG, ENDPOINTS } from '@/constants/api'; // Use the authenticated api instance
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


interface Employee {
    id: {
        maNhanVien: number;
        idRestaurant: number;
    };
    tenNhanVien: string;
}


interface KhachHang {
    maTaiKhoan: number;
    idRestaurant: number;
    hoTen: string;
    sdt: string;
    email?: string;
    diachi?: string;
    diemTichLuy?: number;
    trangThai?: boolean;
}

interface Restaurant {
    idRestaurant: number;
    ten: string;
    sdt: string;
    diaChi: string;
    bankId: string;
    accountNo: string;
    template: string;
    accountName: string;
    content: string;
}


const OrderConfirmationScreen = () => {

    const [NvList, setNvList] = useState<Employee[]>([]);
    const [KHList, setKHList] = useState<KhachHang[]>([]);
    const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const params = useLocalSearchParams<{
        tableId: string;
        tableName: string;
        maNv: string;
        maKhachHang: string;
        soLuongNguoi: string;
        bookingTime: string;
        selectedItems: string;
        totalPrice: string;
        verifyUser?: string;
    }>();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [resNv, resKH, resRes, resSanPham] = await Promise.all([
                api.get(ENDPOINTS.NHAN_VIEN),
                api.get(ENDPOINTS.KHACH_HANG),
                api.get(ENDPOINTS.RESTAURANT),
                api.get(ENDPOINTS.SAN_PHAM),
            ]);

            setNvList(resNv.data || []);
            setKHList(resKH.data || []);
            setRestaurantList(resRes.data || []);


            if (resSanPham.data && params.selectedItems) {
                const allProducts = resSanPham.data;
                const paramItems = JSON.parse(params.selectedItems);

                const mergedItems = paramItems.map((pItem: any) => {
                    const product = allProducts.find((p: any) => p.maSanPham === pItem.maSanPham);
                    return product ? { ...product, soluong: pItem.soluong } : null;
                }).filter((item: any) => item !== null);

                setCartItems(mergedItems);
            }
        } catch (err: any) {
            console.error("Lỗi khi tải dữ liệu:", err.response?.data || err.message);
            setError("Không thể tải dữ liệu cần thiết cho đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [params.selectedItems]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const findNV = NvList.find(nv => nv.id.maNhanVien === Number(params.maNv));
    const findKH = KHList.find(kh => kh.maTaiKhoan === Number(params.maKhachHang));

    const totalAmount = parseInt(params.totalPrice || '0');
    const [paymentMethod, setPaymentMethod] = useState<'tiền mặt' | 'vnpay' | 'momo' | 'chuyển khoản'>('tiền mặt');

    const isStaffOrder = params.verifyUser === 'nhanvien';

    // Determine currentRestaurantId more robustly
    const currentRestaurantId =
        (isStaffOrder && findNV?.id?.idRestaurant) ||
        (!isStaffOrder && findKH?.idRestaurant) ||
        restaurantList[0]?.idRestaurant;

    const currentRestaurant = restaurantList.find(r => r.idRestaurant === currentRestaurantId);

    const BANK_ID = currentRestaurant?.bankId || 'MB';
    const ACCOUNT_NO = currentRestaurant?.accountNo || '';
    const TEMPLATE = currentRestaurant?.template || 'compact';
    const ACCOUNT_NAME = currentRestaurant?.accountName || '';
    const CONTENT = `${currentRestaurant?.content || 'thanh toan'} ${params.tableName || ''}`;
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${totalAmount}&addInfo=${CONTENT}&accountName=${ACCOUNT_NAME}`;

    const formatBookingTime = (timeString: string | undefined) => {
        if (!timeString) return 'N/A';
        try {
            const date = new Date(timeString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Thời gian không hợp lệ';
            }
            return `${date.toLocaleDateString('vi-VN')} lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
        } catch (e) {
            console.error("Error formatting booking time:", e);
            return 'N/A';
        }
    };

    const getPaymentMethodId = (method: string) => {
        switch (method) {
            case 'tiền mặt':
                return 1;
            case 'chuyển khoản':
                return 2;
            case 'vnpay':
                return 3;
            case 'momo':
                return 4;
            default:
                return 1;
        }
    };

    const handleConfirmOrder = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!currentRestaurantId) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin nhà hàng. Vui lòng thử lại.");
            setIsSubmitting(false);
            return;
        }

        const yeuCauDon = {
            id: {
                idRestaurant: currentRestaurantId,
            },
            trangThaiThanhToan: 'chưa thanh toán',
            tongTien: totalAmount,
            idThanhToan: getPaymentMethodId(paymentMethod),
            maTaiKhoan: params.maKhachHang ? Number(params.maKhachHang) : null,
            maBan: params.tableId ? Number(params.tableId) : null,
            maNhanVien: isStaffOrder ? Number(params.maNv) : null,
            gioSuDung: params.bookingTime || new Date().toISOString(),
        };

        const chiTietYeuCauDon = cartItems.map(item => ({
            id: {
                maSanPham: item.maSanPham,
            },
            soLuong: item.soluong,
            gia: item.gia,
        }));

        const payload = {
            yeuCauDon,
            chiTietYeuCauDon,
        };

        try {
            const response = await api.post(ENDPOINTS.YEU_CAU_DON, payload); // Use api.post

            if (response.status === 201) {
                if (paymentMethod === 'chuyển khoản' && isStaffOrder) {
                    setShowPaymentModal(true);
                } else {
                    Alert.alert("Thành công", "Đơn hàng đã được tạo thành công!", [
                        {
                            text: "OK",
                            onPress: () => router.push(isStaffOrder ? '/NvOrder' : '/HomeScreen')
                        }
                    ]);
                }
            } else {
                Alert.alert("Lỗi", `Không thể tạo đơn hàng. Status: ${response.status}`);
            }
        } catch (err: any) {
            console.error("Lỗi khi tạo đơn hàng:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
            Alert.alert("Lỗi", `Đã có lỗi xảy ra khi tạo đơn hàng. ${err.response?.data?.error || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemRow}>
            <Image
                source={{ uri: `${BASE_URL_IMG}/${item.danhSachAnh?.[0]?.urlAnh}` }}
                style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.tenSanPham}</Text>
                <Text style={styles.itemDetail}>SL: {item.soluong} x {(item.gia || 0).toLocaleString('vi-VN')}đ</Text>
            </View>
            <Text style={styles.itemSubtotal}>{((item.gia || 0) * item.soluong).toLocaleString('vi-VN')}đ</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF6600" />
                <Text style={{ marginTop: 10 }}>Đang tải thông tin đơn hàng...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={48} color="#999" />
                <Text style={{ marginTop: 10, textAlign: 'center', color: '#666' }}>{error}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: '#FF6600', borderRadius: 8 }}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Hóa đơn tạm tính', headerShown: true, headerTitleAlign: 'center' }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                <View style={styles.headerCard}>
                    <View style={styles.orderTypeBadge}>
                        <Ionicons name={isStaffOrder ? "restaurant" : "phone-portrait"} size={16} color="#FFF" />
                        <Text style={styles.orderTypeText}>{isStaffOrder ? "Đơn tại nhà hàng" : "Đơn online"}</Text>
                    </View>

                    {isStaffOrder && (
                        <>
                            {params.tableName && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="restaurant-outline" size={18} color="#FF6600" />
                                    <Text style={styles.headerText}> Bàn: <Text style={styles.boldText}>{params.tableName}</Text></Text>
                                </View>
                            )}
                            {findNV && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="person-outline" size={18} color="#FF6600" />
                                    <Text style={styles.headerText}> Nhân viên: <Text style={styles.boldText}>{findNV.tenNhanVien}</Text></Text>
                                </View>
                            )}
                        </>
                    )}

                    <View style={styles.infoRow}>
                        <Ionicons name="people-outline" size={18} color="#FF6600" />
                        <Text style={styles.headerText}> Khách hàng: <Text style={styles.boldText}>{findKH?.hoTen || "Khách vãng lai"}</Text></Text>
                    </View>

                    {!isStaffOrder && findKH && (
                        <>
                            {params.tableName && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="restaurant-outline" size={18} color="#FF6600" />
                                    <Text style={styles.headerText}>Bàn đã đặt: <Text style={styles.boldText}>{params.tableName}</Text></Text>
                                </View>
                            )}
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={18} color="#FF6600" />
                                <Text style={styles.headerText}> SDT: <Text style={styles.boldText}>{findKH.sdt || "N/A"}</Text></Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="time-outline" size={18} color="#FF6600" />
                                <Text style={styles.headerText}> Thời gian dùng bữa: <Text style={styles.boldText}>{formatBookingTime(params.bookingTime)}</Text></Text>
                            </View>
                        </>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Chi tiết món ăn</Text>
                <View style={styles.listContainer}>
                    {cartItems.map((item: any, index: number) => (
                        <View key={index}>{renderItem({ item })}</View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                {isStaffOrder ? (
                    <View style={styles.paymentContainer}>
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'tiền mặt' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('tiền mặt')}>
                            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'tiền mặt' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'tiền mặt' && styles.paymentTextActive]}>Tiền mặt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'chuyển khoản' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('chuyển khoản')}>
                            <Ionicons name="qr-code-outline" size={24} color={paymentMethod === 'chuyển khoản' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'chuyển khoản' && styles.paymentTextActive]}>Chuyển khoản</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.paymentContainer}>
                        {/* For non-staff orders, default to cash or other online methods */}
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'tiền mặt' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('tiền mặt')}>
                            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'tiền mặt' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'tiền mặt' && styles.paymentTextActive]}>Tiền mặt</Text>
                        </TouchableOpacity>
                        {/* Add other online payment options if available for customers */}
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng tiền thanh toán:</Text>
                    <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
                </View>
                <TouchableOpacity
                    style={[styles.confirmButton, isSubmitting && styles.disabledButton]}
                    onPress={handleConfirmOrder}
                    disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>}
                </TouchableOpacity>
            </View>

            <Modal visible={showPaymentModal} transparent={true} animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Thông tin chuyển khoản</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <Ionicons name="close-circle" size={28} color="#999" />
                            </TouchableOpacity>
                        </View>
                        <Image source={{ uri: qrUrl }} style={styles.qrImage} resizeMode="contain" />
                        <TouchableOpacity style={styles.doneButton} onPress={() => setShowPaymentModal(false)}>
                            <Text style={styles.doneButtonText}>ĐÃ HIỂU</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    headerCard: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15, elevation: 3 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    headerText: { fontSize: 15, color: '#666', marginLeft: 10 },
    boldText: { fontWeight: 'bold', color: '#222' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 15, marginTop: 10, marginBottom: 10, color: '#333' },
    listContainer: { paddingHorizontal: 15 },
    itemRow: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
    itemImage: { width: 55, height: 55, borderRadius: 8 },
    itemInfo: { flex: 1, marginLeft: 15 },
    itemName: { fontSize: 15, fontWeight: '600', color: '#333' },
    itemDetail: { fontSize: 13, color: '#888', marginTop: 4 },
    itemSubtotal: { fontWeight: 'bold', color: '#FF6600', fontSize: 15 },
    paymentContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 15, marginBottom: 20 },
    paymentOption: { flex: 1, alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 5, borderWidth: 1, borderColor: '#EEE' },
    paymentActive: { backgroundColor: '#FF6600', borderColor: '#FF6600' },
    paymentText: { fontSize: 12, color: '#666', marginTop: 5, fontWeight: '500' },
    paymentTextActive: { color: '#FFF' },
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 20 },
    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    totalLabel: { fontSize: 15, color: '#444' },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: '#E44D26' },
    confirmButton: { backgroundColor: '#FF6600', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
    confirmButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#CCCCCC' },
    orderTypeBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FF6600', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
    orderTypeText: { color: '#FFF', fontSize: 13, fontWeight: '600', marginLeft: 6 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    qrImage: { width: 250, height: 250 },
    doneButton: { backgroundColor: '#FF6600', width: '100%', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    doneButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default OrderConfirmationScreen;