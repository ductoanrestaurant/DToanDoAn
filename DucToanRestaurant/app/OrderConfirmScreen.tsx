import { BASE_URL_IMG, ENDPOINTS } from '@/constants/api';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    ActivityIndicator
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
    email?: string; // Dấu ? nghĩa là trường này không bắt buộc
    diachi?: string;
    diemTichLuy?: number;
    trangThai?: boolean;
}

interface Restaurant {
    idRestaurant: number;
    ten: string;
    sdt: string;
    diaChi: string;
    bankId: string;      // Ví dụ: MB
    accountNo: string;   // Ví dụ: 686868686888
    template: string;    // Ví dụ: compact
    accountName: string; // Ví dụ: NGUYEN DUC TOAN
    content: string;     // Ví dụ: thanh toan
}


const OrderConfirmationScreen = () => {

    const [NvList, setNvList] = useState<Employee[]>([]);
    const [KHList, setKHList] = useState<KhachHang[]>([]);
    const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);

    const [loading, setLoading] = useState(true);

    const [showPaymentModal, setShowPaymentModal] = useState(false);


    const router = useRouter();


    const handleSelectBankTransfer = () => {
        setPaymentMethod('chuyển khoản');
    };


    const params = useLocalSearchParams<{
        tableId: string;
        tableName: string;
        maNv:string;
        maKhachHang:string;
        soLuongNguoi:string;
        bookingTime:string;
        selectedItems: string;
        totalPrice: string;
        verifyUser?:string;
    }>();


    const [cartItems, setCartItems] = useState<any[]>([]);
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [resNv, resKH, resRes, resSanPham] = await Promise.all([
                axios.get(ENDPOINTS.NHAN_VIEN),
                axios.get(ENDPOINTS.KHACH_HANG),
                axios.get(ENDPOINTS.RESTAURANT),
                axios.get(ENDPOINTS.SAN_PHAM),
            ]);

            if (resNv.data) setNvList(resNv.data);
            if (resKH.data) setKHList(resKH.data);
            if (resRes.data) setRestaurantList(resRes.data);

            if (resSanPham.data && params.selectedItems) {
                const allProducts = resSanPham.data;
                const paramItems = JSON.parse(params.selectedItems);

                const mergedItems = paramItems.map((pItem: any) => {
                    // Tìm sản phẩm trong danh sách gốc để lấy giá, tên, ảnh
                    const product = allProducts.find((p: any) => p.maSanPham === pItem.maSanPham);
                    if (product) {
                        return { ...product, soluong: pItem.soluong };
                    }
                    return null;
                }).filter((item: any) => item !== null);

                setCartItems(mergedItems); // Lưu vào state để hiển thị
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bổ sung:", error);
            // Bạn có thể không cần Alert ở đây để tránh làm phiền người dùng nếu params đã có thông tin cơ bản
        } finally {
            setLoading(false);
        }
    }, [params.selectedItems]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const findNV = NvList.find(nv => nv.id.maNhanVien === Number(params.maNv));
    const findKH = KHList.find(kh=> kh.maTaiKhoan === Number(params.maKhachHang));

    const finalCartItems = params.selectedItems ? JSON.parse(params.selectedItems) : [];
    const totalAmount = parseInt(params.totalPrice || '0');

    const [paymentMethod, setPaymentMethod] = useState<'tiền mặt' | 'vnpay' | 'momo' | 'chuyển khoản'>('tiền mặt');



    const isStaffOrder = params.verifyUser === 'nhanvien';  //true = nhan vien, false = khach hang

// Tìm nhà hàng hiện tại để lấy thông tin ngân hàng
    // Logic: Nếu là nhân viên đặt -> lấy theo idRestaurant của nhân viên
    //        Nếu là khách đặt -> lấy theo idRestaurant của khách
    const currentRestaurantId = isStaffOrder
        ? findNV?.id?.idRestaurant
        : findKH?.idRestaurant;

    const currentRestaurant = restaurantList.find(r => r.idRestaurant === currentRestaurantId);


    const BANK_ID = currentRestaurant?.bankId || 'MB';
    const ACCOUNT_NO = currentRestaurant?.accountNo || '';
    const TEMPLATE = currentRestaurant?.template || 'compact';
    const ACCOUNT_NAME = currentRestaurant?.accountName || '';

    const CONTENT = `${currentRestaurant?.content || 'thanh toán'} ${params.tableName}`


    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${totalAmount}&addInfo=${CONTENT}&accountName=${ACCOUNT_NAME}`;


    const formatBookingTime = (timeString: string) => {
        if (!timeString) return 'N/A';
        try {
            const date = new Date(timeString);
            const dateStr = date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const timeStr = date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            return `${dateStr} lúc ${timeStr}`;
        } catch (e) {
            return timeString;
        }
    };

    // const handleConfirmOrder = () => {
    //     Alert.alert(
    //         "Xác nhận đơn hàng",
    //         "Đơn hàng của bạn sẽ được gửi trực tiếp đến bộ phận bếp. Bạn có chắc chắn không?",
    //         [
    //             { text: "Hủy", style: "cancel" },
    //             {
    //                 text: "Xác nhận",
    //                 onPress: () => {
    //                     // Gọi API lưu đơn hàng ở đây
    //                     console.log("Gửi đơn hàng của bàn:", params.tableName);
    //                     console.log("ma ban: ", params.tableId);
    //                     Alert.alert("Thành công", "Đơn hàng đã được gửi đi!");
    //                     console.log("kiem tra trang thai nguoi dat:  ", isStaffOrder)
    //                     console.log("ten khach hang:  ", findKH?.hoTen)
    //                     console.log("ma khach hang 1111: ", params.maKhachHang);
    //
    //                     handleSelectBankTransfer;
    //
    //                 }
    //             }
    //         ]
    //     );
    // };

    const handleConfirmOrder = () => {
        // 1. Log kiểm tra
        console.log("Xử lý đơn hàng cho bàn:", params.tableName);
        console.log("Phương thức thanh toán:", paymentMethod);
        console.log("ma ban: ", params.tableId);
        console.log("manhanvien: ", params.maNv);
        console.log("makhachhang: ", params.maKhachHang);
        console.log("soluongnguoi: ", params.soLuongNguoi);
        console.log("bookingtime: ", params.bookingTime);
        console.log("selectedItems: ", params.selectedItems);
        console.log("totalPrice: ", params.totalPrice);
        console.log("verifyuser: ", params.verifyUser);


        // --- GỌI API LƯU ĐƠN HÀNG (Backend) TẠI ĐÂY ---
        // await axios.post(ENDPOINTS.ORDER, payload)...

        // 2. Kiểm tra phương thức thanh toán
        if (paymentMethod === 'chuyển khoản') {
            // Nếu là Chuyển khoản -> Mở popup QR ngay
            setShowPaymentModal(true);
        } else {
            // Nếu là Tiền mặt (hoặc khác) -> Báo thành công luôn
            Alert.alert("Thành công", "Đơn hàng đã được gửi đi!", [
                {
                    text: "OK",
                    onPress: () => {
                        // Có thể điều hướng về trang chủ hoặc reset trang tại đây
                        // router.push('/home');
                    }
                }
            ]);
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
            <SafeAreaView style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
                <ActivityIndicator size="large" color="#FF6600" />
                <Text style={{marginTop: 10}}>Đang xử lý đơn hàng...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Hóa đơn tạm tính', headerShown: true, headerTitleAlign: 'center' }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                {/* 1. Thông tin chung (Header Card) */}
                {/*<View style={styles.headerCard}>*/}
                {/*    <View style={styles.infoRow}>*/}
                {/*        <Ionicons name="restaurant-outline" size={18} color="#FF6600" />*/}
                {/*        <Text style={styles.headerText}> Bàn: <Text style={styles.boldText}>{params.tableName}</Text></Text>*/}
                {/*    </View>*/}
                {/*    <View style={styles.infoRow}>*/}
                {/*        <Ionicons name="person-outline" size={18} color="#FF6600" />*/}
                {/*        <Text style={styles.headerText}> Nhân viên: <Text style={styles.boldText}>{findNV?.tenNhanVien}</Text></Text>*/}
                {/*    </View>*/}
                {/*    <View style={styles.infoRow}>*/}
                {/*        <Ionicons name="people-outline" size={18} color="#FF6600" />*/}
                {/*        <Text style={styles.headerText}> Khách hàng: <Text style={styles.boldText}>{findKH?.hoTen || "Khách vãng lai"}</Text></Text>*/}
                {/*    </View>*/}
                {/*    /!*<View style={styles.infoRow}>*!/*/}
                {/*    /!*    <Ionicons name="call-outline" size={18} color="#FF6600" />*!/*/}
                {/*    /!*    <Text style={styles.headerText}> SDT: <Text style={styles.boldText}>{params.soDienThoai || "N/A"}</Text></Text>*!/*/}
                {/*    /!*</View>*!/*/}
                {/*</View>*/}

                {/* 1. Thông tin chung (Header Card) */}
                <View style={styles.headerCard}>
                    {/* Badge hiển thị loại đơn hàng */}
                    <View style={styles.orderTypeBadge}>
                        <Ionicons
                            name={isStaffOrder ? "restaurant" : "phone-portrait"}
                            size={16}
                            color="#FFF"
                        />
                        <Text style={styles.orderTypeText}>
                            {isStaffOrder ? "Đơn tại nhà hàng" : "Đơn online"}
                        </Text>
                    </View>

                    {/* THÔNG TIN CHO ĐƠN NHÂN VIÊN */}
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
                                    <Text style={styles.headerText}> Nhân viên: <Text style={styles.boldText}>{findNV?.tenNhanVien}</Text></Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* THÔNG TIN CHUNG - LUÔN HIỂN THỊ */}
                    <View style={styles.infoRow}>
                        <Ionicons name="people-outline" size={18} color="#FF6600" />
                        <Text style={styles.headerText}> Khách hàng: <Text style={styles.boldText}>{findKH?.hoTen || "Khách vãng lai"}</Text></Text>
                    </View>

                    {/* THÔNG TIN CHO ĐƠN ONLINE */}
                    {!isStaffOrder && findKH && (
                        <>
                            {params.tableName && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="restaurant-outline" size={18} color="#FF6600"/>
                                    <Text style={styles.headerText}>Bàn đã đặt: <Text style={styles.boldText}>{params.tableName}</Text></Text>
                                </View>
                            )}
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={18} color="#FF6600" />
                                <Text style={styles.headerText}> SDT: <Text style={styles.boldText}>{findKH?.sdt || "N/A"}</Text></Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="time-outline" size={18} color="#FF6600" />
                                <Text style={styles.headerText}> Thời gian dùng bữa: <Text style={styles.boldText}>{formatBookingTime(params.bookingTime)}</Text></Text>
                            </View>
                        </>
                    )}
                </View>

                {/* 2. Danh sách món ăn */}
                <Text style={styles.sectionTitle}>Chi tiết món ăn</Text>
                <View style={styles.listContainer}>
                    {cartItems.map((item: any, index: number) => (
                        <View key={index}>
                            {renderItem({ item })}
                        </View>
                    ))}
                </View>

                {/* 3. Phương thức thanh toán */}

                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                {isStaffOrder && (
                    <View style={styles.paymentContainer}>
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'tiền mặt' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('tiền mặt')}
                        >
                            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'tiền mặt' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'tiền mặt' && styles.paymentTextActive]}>Tiền mặt</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'chuyển khoản' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('chuyển khoản')}
                        >
                            <Ionicons name="qr-code-outline" size={24} color={paymentMethod === 'chuyển khoản' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'chuyển khoản' && styles.paymentTextActive]}>Chuyển khoản</Text>
                        </TouchableOpacity>
                    </View>
                )}


                {!isStaffOrder && (
                    <View style={styles.paymentContainer}>
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'tiền mặt' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('tiền mặt')}
                        >
                            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'tiền mặt' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'tiền mặt' && styles.paymentTextActive]}>Tiền mặt</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'vnpay' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('vnpay')}
                        >
                            <Ionicons name="wallet-outline" size={24} color={paymentMethod === 'vnpay' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'vnpay' && styles.paymentTextActive]}>VN Pay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'momo' && styles.paymentActive]}
                            onPress={() => setPaymentMethod('momo')}
                        >
                            <Ionicons name="card-outline" size={24} color={paymentMethod === 'momo' ? "#FFF" : "#FF6600"} />
                            <Text style={[styles.paymentText, paymentMethod === 'momo' && styles.paymentTextActive]}>Momo</Text>
                        </TouchableOpacity>
                    </View>
                    )
                }

            </ScrollView>

            {/* 4. Footer thanh toán */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng tiền thanh toán:</Text>
                    <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
                    <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>
                </TouchableOpacity>
            </View>




            {/* --- MODAL THANH TOÁN (POPUP) --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPaymentModal}
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Thông tin chuyển khoản</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <Ionicons name="close-circle" size={28} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Nội dung QR */}
                        <View style={styles.qrContainer}>
                            <Text style={styles.qrLabel}>Quét mã để thanh toán nhanh</Text>
                            <Image
                                source={{ uri: qrUrl }}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Thông tin chi tiết text */}
                        <View style={styles.bankInfoContainer}>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Ngân hàng:</Text>
                                <Text style={styles.bankValue}>MB Bank</Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Số tài khoản:</Text>
                                <Text style={styles.bankValueCopy}>{ACCOUNT_NO}</Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Chủ tài khoản:</Text>
                                <Text style={styles.bankValue}>{ACCOUNT_NAME}</Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Số tiền:</Text>
                                <Text style={[styles.bankValue, { color: '#E44D26', fontWeight: 'bold' }]}>
                                    {totalAmount.toLocaleString('vi-VN')}đ
                                </Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Nội dung:</Text>
                                <Text style={styles.bankValue}>{CONTENT}</Text>
                            </View>
                        </View>

                        {/* Nút Đã thanh toán */}
                        <TouchableOpacity
                            style={[styles.doneButton, { backgroundColor: '#DDDDDD' }]}
                            onPress={() => {
                                setShowPaymentModal(false);
                            }}
                        >
                            <Text style={[styles.doneButtonText, { color: '#333' }]}>HỦY</Text>
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
    invoiceTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
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


    orderTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FF6600',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 15,
    },
    orderTypeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },

    // ... các styles cũ

    // Styles cho Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Màu nền mờ tối
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    qrLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    qrImage: {
        width: 250,
        height: 250, // VietQR thường trả về ảnh vuông
    },
    bankInfoContainer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    bankRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    bankLabel: {
        color: '#666',
        fontSize: 14,
    },
    bankValue: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
        maxWidth: '65%',
        textAlign: 'right'
    },
    bankValueCopy: {
        color: '#007AFF', // Màu xanh tạo cảm giác có thể copy
        fontWeight: 'bold',
        fontSize: 15,
    },
    doneButton: {
        backgroundColor: '#FF6600',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default OrderConfirmationScreen;