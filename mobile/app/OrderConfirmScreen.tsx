import api, { BASE_URL, BASE_URL_IMG, ENDPOINTS } from '@/constants/api';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- INTERFACES ---
interface CustomerInfo {
    maTaiKhoan: string;
    hoTen: string;
    sdt?: string;
    idRestaurant?: number;
}
interface EmployeeInfo {
    maNhanVien: string;
    tenNhanVien: string;
}
interface Restaurant {
    idRestaurant: number;
    ten: string; sdt: string; diaChi: string; bankId: string; accountNo: string;
    template: string; accountName: string; content: string;
}

const OrderConfirmationScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{
        tableId: string;
        tableName: string;
        soLuongNguoi: string;
        bookingTime: string;
        selectedItems: string;
        totalPrice: string;
        verifyUser: 'nhanvien' | 'khach';
        maKhachHang?: string; // For staff orders
    }>();

    // --- STATE ---
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'tiền mặt' | 'chuyển khoản'>('tiền mặt');

    const isStaffOrder = params.verifyUser === 'nhanvien';
    const totalAmount = parseInt(params.totalPrice || '0');

    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let khId: string | null = null;
            let restaurantId: number | undefined;

            if (isStaffOrder) {
                const employeeInfoStr = await AsyncStorage.getItem('employeeInfo');
                if (!employeeInfoStr) throw new Error("Nhân viên chưa đăng nhập.");
                setEmployeeInfo(JSON.parse(employeeInfoStr));

                khId = params.maKhachHang ?? null;
                if (!khId) throw new Error("Không có thông tin khách hàng cho đơn hàng này.");
            } else {
                const customerInfoStr = await AsyncStorage.getItem('customerInfo');
                if (!customerInfoStr) throw new Error("Khách hàng chưa đăng nhập.");
                const parsedInfo = JSON.parse(customerInfoStr);
                khId = parsedInfo.maKhachHang;
            }

            const customerRes = await api.get(`${ENDPOINTS.KHACH_HANG}/${khId}`);
            const customerData = customerRes.data;
            setCustomerInfo({
                maTaiKhoan: customerData.maTaiKhoan,
                hoTen: customerData.hoTen,
                sdt: customerData.sdt,
                idRestaurant: customerData.idRestaurant,
            });
            restaurantId = customerData.idRestaurant;

            if (restaurantId) {
                const resRes = await api.get(`${ENDPOINTS.RESTAURANT}/${restaurantId}`);
                setCurrentRestaurant(resRes.data);
            }

            const resSanPham = await api.get(ENDPOINTS.SAN_PHAM);
            if (resSanPham.data && params.selectedItems) {
                const allProducts = resSanPham.data;
                const paramItems = JSON.parse(params.selectedItems);
                const mergedItems = paramItems.map((pItem: any) => {
                    const product = allProducts.find((p: any) => p.maSanPham === pItem.maSanPham);
                    return product ? { ...product, soluong: pItem.soluong } : null;
                }).filter(Boolean);
                setCartItems(mergedItems);
            }

        } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu.");
            if (err.message.includes("đăng nhập")) {
                setTimeout(() => router.replace('/login'), 2000);
            }
        } finally {
            setLoading(false);
        }
    }, [params.selectedItems, params.verifyUser, params.maKhachHang, isStaffOrder]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- HELPERS & HANDLERS ---
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
            if (isNaN(date.getTime())) return 'Thời gian không hợp lệ';
            return `${date.toLocaleDateString('vi-VN')} lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
        } catch (e) { return 'N/A'; }
    };

    const getPaymentMethodId = (method: string) => {
        switch (method) {
            case 'tiền mặt': return 1;
            case 'chuyển khoản': return 2;
            default: return 1;
        }
    };

    const handleConfirmOrder = async () => {
        if (isSubmitting || !customerInfo || !currentRestaurant) {
            Alert.alert("Lỗi", "Thông tin đơn hàng chưa đầy đủ.");
            return;
        }
        setIsSubmitting(true);


        const bookingDate = new Date(params.bookingTime || new Date());

        const localBookingDate = new Date(bookingDate.getTime() - (bookingDate.getTimezoneOffset() * 60000));

        const localBookingTimestamp = localBookingDate.toISOString().slice(0, -1);

        const yeuCauDon = {
            id: { idRestaurant: currentRestaurant.idRestaurant },
            trangThaiThanhToan: 'chưa thanh toán',
            tongTien: totalAmount,
            idThanhToan: getPaymentMethodId(paymentMethod),
            maTaiKhoan: Number(customerInfo.maTaiKhoan),
            maBan: params.tableId ? Number(params.tableId) : null,
            maNhanVien: isStaffOrder && employeeInfo ? Number(employeeInfo.maNhanVien) : null,
            gioSuDung: localBookingTimestamp,
        };


        const chiTietYeuCauDon = cartItems.map(item => ({
            id: { maSanPham: item.maSanPham },
            soLuong: item.soluong,
            gia: item.gia,
        }));

        try {
            const response = await api.post(ENDPOINTS.YEU_CAU_DON, { yeuCauDon, chiTietYeuCauDon });
            const orderId = response.data.id?.maDonHang;

            if (response.status !== 201 || !orderId) throw new Error("Không thể tạo đơn hàng.");

            if (paymentMethod === 'chuyển khoản') {
                const paymentResponse = await api.post(ENDPOINTS.CREATE_PAYOS_PAYMENT, {
                    amount: totalAmount,
                    orderId,
                    paymentMethod: 'payos', // Gửi thông tin phương thức thanh toán
                    returnUrl: `${BASE_URL}/payment/success`,
                    cancelUrl: `${BASE_URL}/payment/cancel`,
                });
                const paymentUrl = paymentResponse.data.checkoutUrl;
                if (paymentUrl) {
                    router.push({
                        pathname: '/PaymentWebView',
                        params: {
                            url: paymentUrl,
                            orderId: orderId.toString(),
                            idRestaurant: currentRestaurant.idRestaurant.toString(),
                        }
                    });
                } else {
                    throw new Error("Không thể tạo yêu cầu thanh toán.");
                }
            } else {
                Alert.alert("Thành công", "Đơn hàng đã được tạo thành công!", [
                    { text: "OK", onPress: () => router.push(isStaffOrder ? '/NvOrder' : '/HomeScreen') }
                ]);
            }
        } catch (err: any) {
            Alert.alert("Lỗi", `Đã có lỗi xảy ra: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER ---
    if (loading) {
        return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#FF6600" /></SafeAreaView>;
    }
    if (error) {
        return (
            <SafeAreaView style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={48} color="#999" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Text style={styles.backButtonText}>Quay lại</Text></TouchableOpacity>
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
                            {params.tableName && <InfoRow icon="restaurant-outline" label="Bàn" value={params.tableName} />}
                            {employeeInfo && <InfoRow icon="person-outline" label="Nhân viên" value={employeeInfo.tenNhanVien} />}
                        </>
                    )}

                    <InfoRow icon="people-outline" label="Khách hàng" value={customerInfo?.hoTen || "Khách vãng lai"} />

                    {!isStaffOrder && customerInfo && (
                        <>
                            {params.tableName && <InfoRow icon="restaurant-outline" label="Bàn đã đặt" value={params.tableName} />}
                            <InfoRow icon="call-outline" label="SDT" value={customerInfo.sdt || "N/A"} />
                            <InfoRow icon="time-outline" label="Thời gian dùng bữa" value={formatBookingTime(params.bookingTime)} />
                        </>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Chi tiết món ăn</Text>
                <View style={styles.listContainer}>
                    {cartItems.map((item, index) => <ItemRow key={index} item={item} />)}
                </View>

                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                <View style={styles.paymentContainer}>
                    <PaymentOption method="tiền mặt" icon="cash-outline" current={paymentMethod} onPress={setPaymentMethod} />
                    <PaymentOption method="chuyển khoản" icon="qr-code-outline" current={paymentMethod} onPress={setPaymentMethod} />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng tiền thanh toán:</Text>
                    <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
                </View>
                <TouchableOpacity style={[styles.confirmButton, isSubmitting && styles.disabledButton]} onPress={handleConfirmOrder} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>}
                </TouchableOpacity>
            </View>

            <Modal visible={showPaymentModal} transparent={true} animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Thông tin chuyển khoản</Text><TouchableOpacity onPress={() => setShowPaymentModal(false)}><Ionicons name="close-circle" size={28} color="#999" /></TouchableOpacity></View>
                        <Image source={{ uri: qrUrl }} style={styles.qrImage} resizeMode="contain" />
                        <TouchableOpacity style={styles.doneButton} onPress={() => setShowPaymentModal(false)}><Text style={styles.doneButtonText}>ĐÃ HIỂU</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- SUB-COMPONENTS FOR RENDER ---
const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.infoRow}><Ionicons name={icon} size={18} color="#FF6600" /><Text style={styles.headerText}> {label}: <Text style={styles.boldText}>{value}</Text></Text></View>
);
const ItemRow = ({ item }: { item: any }) => (
    <View style={styles.itemRow}><Image source={{ uri: `${BASE_URL_IMG}/${item.danhSachAnh?.[0]?.urlAnh}` }} style={styles.itemImage} /><View style={styles.itemInfo}><Text style={styles.itemName}>{item.tenSanPham}</Text><Text style={styles.itemDetail}>SL: {item.soluong} x {(item.gia || 0).toLocaleString('vi-VN')}đ</Text></View><Text style={styles.itemSubtotal}>{((item.gia || 0) * item.soluong).toLocaleString('vi-VN')}đ</Text></View>
);
const PaymentOption = ({ method, icon, current, onPress }: { method: any, icon: any, current: any, onPress: (m: any) => void }) => (
    <TouchableOpacity style={[styles.paymentOption, current === method && styles.paymentActive]} onPress={() => onPress(method)}><Ionicons name={icon} size={24} color={current === method ? "#FFF" : "#FF6600"} /><Text style={[styles.paymentText, current === method && styles.paymentTextActive]}>{method.charAt(0).toUpperCase() + method.slice(1)}</Text></TouchableOpacity>
);

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    errorText: { marginTop: 10, textAlign: 'center', color: '#666' },
    backButton: { marginTop: 20, padding: 10, backgroundColor: '#FF6600', borderRadius: 8 },
    backButtonText: { color: '#FFF', fontWeight: 'bold' },
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
