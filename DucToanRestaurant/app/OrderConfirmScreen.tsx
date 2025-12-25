import { BASE_URL_IMG, ENDPOINTS } from '@/constants/api';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



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


const OrderConfirmationScreen = () => {

    const [NvList, setNvList] = useState<Employee[]>([]);
    const [KHList, setKHList] = useState<KhachHang[]>([]);

    const [loading, setLoading] = useState(true);


    const router = useRouter();
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


    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [resNv, resKH] = await Promise.all([
                axios.get(ENDPOINTS.NHAN_VIEN),
                axios.get(ENDPOINTS.KHACH_HANG),
            ]);

            if (resNv.data) setNvList(resNv.data);
            if (resKH.data) setKHList(resKH.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bổ sung:", error);
            // Bạn có thể không cần Alert ở đây để tránh làm phiền người dùng nếu params đã có thông tin cơ bản
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const findNV = NvList.find(nv => nv.id.maNhanVien === Number(params.maNv));
    const findKH = KHList.find(kh=> kh.maTaiKhoan === Number(params.maKhachHang));

    const finalCartItems = params.selectedItems ? JSON.parse(params.selectedItems) : [];
    const totalAmount = parseInt(params.totalPrice || '0');

    const [paymentMethod, setPaymentMethod] = useState<'tiền mặt' | 'vnpay' | 'momo'>('tiền mặt');

    const isStaffOrder = params.verifyUser === 'nhanvien';  //true = nhan vien, false = khach hang

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

    const handleConfirmOrder = () => {
        Alert.alert(
            "Xác nhận đơn hàng",
            "Đơn hàng của bạn sẽ được gửi trực tiếp đến bộ phận bếp. Bạn có chắc chắn không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xác nhận",
                    onPress: () => {
                        // Gọi API lưu đơn hàng ở đây
                        console.log("Gửi đơn hàng của bàn:", params.tableName);
                        console.log("ma ban: ", params.tableId);
                        Alert.alert("Thành công", "Đơn hàng đã được gửi đi!");
                        console.log("kiem tra trang thai nguoi dat:  ", isStaffOrder)
                        console.log("ten khach hang:  ", findKH?.hoTen)
                        console.log("ma khach hang 1111: ", params.maKhachHang);

                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemRow}>
            <Image
                source={{ uri: `${BASE_URL_IMG}/${item.danhSachAnh?.[0]?.urlAnh}` }}
                style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.tenSanPham}</Text>
                <Text style={styles.itemDetail}>SL: {item.soluong} x {item.gia.toLocaleString('vi-VN')}đ</Text>
            </View>
            <Text style={styles.itemSubtotal}>{(item.gia * item.soluong).toLocaleString('vi-VN')}đ</Text>
        </View>
    );


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
                    {finalCartItems.map((item: any, index: number) => (
                        <View key={index}>
                            {renderItem({ item })}
                        </View>
                    ))}
                </View>

                {/* 3. Phương thức thanh toán */}
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
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
});

export default OrderConfirmationScreen;