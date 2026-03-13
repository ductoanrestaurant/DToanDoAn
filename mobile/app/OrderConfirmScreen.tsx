import api, { BASE_URL, BASE_URL_IMG, ENDPOINTS } from '@/constants/api';
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
interface GiamGia {
    idGiamGia: number;
    code: string;
    giaTri: number; // phần trăm (%)
    moTa?: string;
    urlAnh?: string;
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
        maKhachHang?: string;
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
    const [paymentMethod, setPaymentMethod] = useState<'tiền mặt' | 'chuyển khoản' | 'ví'>('tiền mặt');
    const [userPoints, setUserPoints] = useState(0);

    // Coupon state
    const [availableCoupons, setAvailableCoupons] = useState<GiamGia[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<GiamGia | null>(null);
    const [showCouponModal, setShowCouponModal] = useState(false);

    const isStaffOrder = params.verifyUser === 'nhanvien';
    const totalAmount = parseInt(params.totalPrice || '0');

    // Tính tiền sau giảm
    const discountAmount = selectedCoupon
        ? Math.round(totalAmount * selectedCoupon.giaTri / 100)
        : 0;
    const finalAmount = totalAmount - discountAmount;

    const pointsNeeded = finalAmount;

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

                // Fetch điểm tích lũy của khách hàng
                const pointsRes = await api.get(`${ENDPOINTS.KHACH_HANG}/${khId}/diem`);
                setUserPoints(pointsRes.data.diemTichLuy || 0);
            } else {
                const customerInfoStr = await AsyncStorage.getItem('customerInfo');
                if (!customerInfoStr) throw new Error("Khách hàng chưa đăng nhập.");
                const parsedInfo = JSON.parse(customerInfoStr);
                khId = parsedInfo.maKhachHang;

                if (khId) {
                    const pointsRes = await api.get(`${ENDPOINTS.KHACH_HANG}/${khId}/diem`);
                    setUserPoints(pointsRes.data.diemTichLuy || 0);
                }
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

            // Tải danh sách mã giảm giá
            try {
                const couponRes = await api.get(ENDPOINTS.GIAM_GIA);
                setAvailableCoupons(couponRes.data || []);
            } catch {
                // Không block toàn màn hình nếu coupon load lỗi
                setAvailableCoupons([]);
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
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${finalAmount}&addInfo=${CONTENT}&accountName=${ACCOUNT_NAME}`;

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
            case 'ví': return 3;
            default: return 1;
        }
    };

    const handleSelectCoupon = (coupon: GiamGia) => {
        setSelectedCoupon(coupon);
        setShowCouponModal(false);
    };

    const handleRemoveCoupon = () => {
        setSelectedCoupon(null);
    };

    const handleConfirmOrder = async () => {
        if (isSubmitting || !customerInfo || !currentRestaurant) {
            Alert.alert("Lỗi", "Thông tin đơn hàng chưa đầy đủ.");
            return;
        }
        setIsSubmitting(true);

        const isWalletPayment = paymentMethod === 'ví';

        if (isWalletPayment && userPoints < pointsNeeded) {
            Alert.alert("Lỗi", "Điểm trong ví không đủ để thực hiện thanh toán.");
            setIsSubmitting(false);
            return;
        }

        const bookingDate = new Date(params.bookingTime || new Date());
        const localBookingDate = new Date(bookingDate.getTime() - (bookingDate.getTimezoneOffset() * 60000));
        const localBookingTimestamp = localBookingDate.toISOString().slice(0, -1);

        const yeuCauDon = {
            id: { idRestaurant: currentRestaurant.idRestaurant },
            trangThaiThanhToan: isWalletPayment ? 'đã thanh toán' : 'chưa thanh toán',
            tongTien: finalAmount,
            idThanhToan: getPaymentMethodId(paymentMethod),
            maTaiKhoan: Number(customerInfo.maTaiKhoan),
            maBan: params.tableId ? Number(params.tableId) : null,
            maNhanVien: isStaffOrder && employeeInfo ? Number(employeeInfo.maNhanVien) : null,
            gioSuDung: localBookingTimestamp,
            idGiamGia: selectedCoupon?.idGiamGia ?? null,
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

            if (isWalletPayment) {
                await api.post(`${ENDPOINTS.KHACH_HANG}/${customerInfo.maTaiKhoan}/tru-diem`, { diem: pointsNeeded });
                Alert.alert("Thành công", "Đơn hàng đã được thanh toán bằng điểm thành công!", [
                    { text: "OK", onPress: () => router.push(isStaffOrder ? '/NvOrder' : '/HomeScreen') }
                ]);
            } else if (paymentMethod === 'chuyển khoản') {
                const paymentResponse = await api.post(ENDPOINTS.CREATE_PAYOS_PAYMENT, {
                    amount: finalAmount,
                    orderId,
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
            <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
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

                {/* COUPON SECTION */}
                <Text style={styles.sectionTitle}>Mã giảm giá</Text>
                <View style={styles.couponSection}>
                    {/* Nếu đã chọn mã → hiển thị badge */}
                    {selectedCoupon ? (
                        <View style={styles.couponAppliedCard}>
                            <View style={styles.couponAppliedLeft}>
                                <View style={styles.couponBadge}>
                                    <Ionicons name="pricetag" size={16} color="#FF6600" />
                                    <Text style={styles.couponBadgeCode}>{selectedCoupon.code}</Text>
                                </View>
                                <Text style={styles.couponAppliedDesc}>
                                    {selectedCoupon.moTa || `Giảm ${selectedCoupon.giaTri}%`}
                                </Text>
                                <Text style={styles.couponAppliedValue}>
                                    Giảm {selectedCoupon.giaTri}% → -{discountAmount.toLocaleString('vi-VN')}đ
                                </Text>
                            </View>
                            <TouchableOpacity onPress={handleRemoveCoupon} style={styles.couponRemoveBtn}>
                                <Ionicons name="close-circle" size={26} color="#FF4444" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.chooseCouponBtn} onPress={() => setShowCouponModal(true)}>
                            <Ionicons name="gift-outline" size={18} color="#FF6600" />
                            <Text style={styles.chooseCouponText}>Chọn mã giảm giá</Text>
                            <Ionicons name="chevron-forward" size={16} color="#FF6600" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                <View style={styles.paymentContainer}>
                    <PaymentOption method="tiền mặt" icon="cash-outline" current={paymentMethod} onPress={setPaymentMethod} />
                    <PaymentOption method="chuyển khoản" icon="qr-code-outline" current={paymentMethod} onPress={setPaymentMethod} />
                    <PaymentOption
                            method="ví"
                            icon="wallet-outline"
                            current={paymentMethod}
                            onPress={setPaymentMethod}
                            points={userPoints}
                            disabled={userPoints < pointsNeeded}
                        />
                </View>
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    {selectedCoupon ? (
                        <View style={{ flex: 1 }}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Tổng gốc:</Text>
                                <Text style={styles.originalPrice}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.discountLabel}>Giảm {selectedCoupon.giaTri}%:</Text>
                                <Text style={styles.discountValue}>-{discountAmount.toLocaleString('vi-VN')}đ</Text>
                            </View>
                            <View style={[styles.totalRow, { marginTop: 4 }]}>
                                <Text style={styles.totalLabelFinal}>Thanh toán:</Text>
                                <Text style={styles.totalValue}>{finalAmount.toLocaleString('vi-VN')}đ</Text>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.totalLabel}>Tổng tiền thanh toán:</Text>
                            <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
                        </>
                    )}
                </View>
                <TouchableOpacity style={[styles.confirmButton, isSubmitting && styles.disabledButton]} onPress={handleConfirmOrder} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>}
                </TouchableOpacity>
            </View>

            {/* Modal QR chuyển khoản */}
            <Modal visible={showPaymentModal} transparent={true} animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Thông tin chuyển khoản</Text><TouchableOpacity onPress={() => setShowPaymentModal(false)}><Ionicons name="close-circle" size={28} color="#999" /></TouchableOpacity></View>
                        <Image source={{ uri: qrUrl }} style={styles.qrImage} resizeMode="contain" />
                        <TouchableOpacity style={styles.doneButton} onPress={() => setShowPaymentModal(false)}><Text style={styles.doneButtonText}>ĐÃ HIỂU</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal chọn mã giảm giá */}
            <Modal visible={showCouponModal} transparent={true} animationType="slide" onRequestClose={() => setShowCouponModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.couponModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
                            <TouchableOpacity onPress={() => setShowCouponModal(false)}>
                                <Ionicons name="close-circle" size={28} color="#999" />
                            </TouchableOpacity>
                        </View>
                        {availableCoupons.length === 0 ? (
                            <View style={styles.emptyCoupon}>
                                <Ionicons name="sad-outline" size={40} color="#CCC" />
                                <Text style={styles.emptyCouponText}>Hiện không có mã giảm giá nào</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={availableCoupons}
                                keyExtractor={item => item.idGiamGia.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.couponCard,
                                            selectedCoupon?.idGiamGia === item.idGiamGia && styles.couponCardSelected
                                        ]}
                                        onPress={() => handleSelectCoupon(item)}
                                    >
                                        <View style={styles.couponCardLeft}>
                                            {item.urlAnh ? (
                                                <Image
                                                    source={{ uri: `${BASE_URL_IMG}/${item.urlAnh}` }}
                                                    style={styles.couponCardImg}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={styles.couponDiscountBadge}>
                                                    <Text style={styles.couponDiscountText}>{item.giaTri}%</Text>
                                                    <Text style={styles.couponDiscountOff}>OFF</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.couponCardRight}>
                                            <Text style={styles.couponCardCode}>{item.code}</Text>
                                            <Text style={styles.couponCardDesc} numberOfLines={2}>
                                                {item.moTa || `Giảm ${item.giaTri}% tổng đơn hàng`}
                                            </Text>
                                        </View>
                                        {selectedCoupon?.idGiamGia === item.idGiamGia && (
                                            <Ionicons name="checkmark-circle" size={22} color="#FF6600" style={{ alignSelf: 'center' }} />
                                        )}
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 10 }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- SUB-COMPONENTS ---
const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.infoRow}><Ionicons name={icon} size={18} color="#FF6600" /><Text style={styles.headerText}> {label}: <Text style={styles.boldText}>{value}</Text></Text></View>
);
const ItemRow = ({ item }: { item: any }) => (
    <View style={styles.itemRow}><Image source={{ uri: `${BASE_URL_IMG}/${item.danhSachAnh?.[0]?.urlAnh}` }} style={styles.itemImage} /><View style={styles.itemInfo}><Text style={styles.itemName}>{item.tenSanPham}</Text><Text style={styles.itemDetail}>SL: {item.soluong} x {(item.gia || 0).toLocaleString('vi-VN')}đ</Text></View><Text style={styles.itemSubtotal}>{((item.gia || 0) * item.soluong).toLocaleString('vi-VN')}đ</Text></View>
);
const PaymentOption = ({ method, icon, current, onPress, points, disabled }: { method: any, icon: any, current: any, onPress: (m: any) => void, points?: number, disabled?: boolean }) => (
    <TouchableOpacity
        style={[
            styles.paymentOption,
            current === method && styles.paymentActive,
            disabled && styles.disabledPaymentOption
        ]}
        onPress={() => !disabled && onPress(method)}
        disabled={disabled}
    >
        <Ionicons name={icon} size={24} color={disabled ? '#AAA' : (current === method ? "#FFF" : "#FF6600")} />
        <Text style={[
            styles.paymentText,
            current === method && styles.paymentTextActive,
            disabled && styles.disabledPaymentText
        ]}>
            {method.charAt(0).toUpperCase() + method.slice(1)}
        </Text>
        {method === 'ví' && points !== undefined && (
            <Text style={[styles.pointsText, disabled && styles.disabledPaymentText]}>
                ({Math.floor(points).toLocaleString('vi-VN')}đ)
            </Text>
        )}
    </TouchableOpacity>
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
    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    totalLabel: { fontSize: 15, color: '#444' },
    totalLabelFinal: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: '#E44D26' },
    originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
    discountLabel: { fontSize: 13, color: '#27AE60' },
    discountValue: { fontSize: 13, fontWeight: '600', color: '#27AE60' },
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
    doneButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    disabledPaymentOption: { backgroundColor: '#F0F0F0', borderColor: '#E0E0E0' },
    disabledPaymentText: { color: '#AAA' },
    pointsText: { fontSize: 10, color: '#888', marginTop: 2 },

    // Coupon styles
    couponSection: { marginHorizontal: 15, marginBottom: 10, backgroundColor: '#FFF', borderRadius: 15, padding: 15, elevation: 2 },
    couponInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    couponInput: {
        flex: 1, borderWidth: 1.5, borderColor: '#FF6600', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 10, fontSize: 14,
        color: '#333', letterSpacing: 1, fontWeight: '600',
    },
    applyBtn: { backgroundColor: '#FF6600', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
    applyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    couponError: { color: '#E44D26', fontSize: 12, marginTop: 6, marginLeft: 2 },
    chooseCouponBtn: {
        flexDirection: 'row', alignItems: 'center', marginTop: 12,
        paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#FFF5EE',
        borderRadius: 10, borderWidth: 1, borderColor: '#FFD0B0', gap: 8,
    },
    chooseCouponText: { flex: 1, color: '#FF6600', fontWeight: '600', fontSize: 14 },
    couponAppliedCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF5EE', borderRadius: 12, padding: 12,
        borderWidth: 1.5, borderColor: '#FF6600', borderStyle: 'dashed',
    },
    couponAppliedLeft: { flex: 1 },
    couponBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    couponBadgeCode: { fontWeight: 'bold', fontSize: 15, color: '#FF6600', letterSpacing: 1 },
    couponAppliedDesc: { fontSize: 12, color: '#666', marginBottom: 3 },
    couponAppliedValue: { fontSize: 13, fontWeight: '700', color: '#27AE60' },
    couponRemoveBtn: { padding: 4 },

    // Coupon modal
    couponModalContent: {
        width: '92%', maxHeight: '75%', backgroundColor: '#FFF',
        borderRadius: 20, padding: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
    },
    couponCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA',
        borderRadius: 12, marginBottom: 10, overflow: 'hidden',
        borderWidth: 1, borderColor: '#EEE',
    },
    couponCardSelected: { borderColor: '#FF6600', backgroundColor: '#FFF5EE' },
    couponCardLeft: { backgroundColor: '#FF6600', width: 80, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    couponCardImg: { width: 80, height: 80 },
    couponDiscountBadge: { alignItems: 'center' },
    couponDiscountText: { color: '#FFF', fontWeight: 'bold', fontSize: 20, lineHeight: 24 },
    couponDiscountOff: { color: '#FFE0C0', fontSize: 11, fontWeight: '600' },
    couponCardRight: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
    couponCardCode: { fontWeight: 'bold', fontSize: 15, color: '#333', letterSpacing: 1, marginBottom: 4 },
    couponCardDesc: { fontSize: 12, color: '#888' },
    emptyCoupon: { alignItems: 'center', paddingVertical: 30 },
    emptyCouponText: { color: '#BBB', fontSize: 14, marginTop: 10 },
});

export default OrderConfirmationScreen;
