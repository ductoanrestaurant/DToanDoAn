import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, } from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {push} from "expo-router/build/global-state/routing";
import {BASE_URL_IMG} from "@/constants/api"; // Thư viện icon phổ biến


// Sử dụng chung interface với MenuScreen
interface CartItem {
    maSanPham: number;
    tenSanPham: string;
    gia: number;
    quantity: number;
    urlAnh: string;
}

export interface DanhMuc {
    maDanhMuc: number;
    tenDanhMuc: string;
}

export interface ProductInCart {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhMuc: DanhMuc;
    danhSachAnh: { urlAnh: string }[];
    soluong: number;
}

interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhMuc: DanhMuc;
    danhSachAnh: { urlAnh: string }[];
}

const CartScreen = () => {
    const router = useRouter();

    const params = useLocalSearchParams<{
        selectedItems?: string;
        tableName: string;
        tableId: string;
        maNv: string;
        maKhachHang: string;
        soLuongNguoi: string;
        bookingTime: string;
        verifyUser?: string;
    }>();

    const { tableId, tableName, maNv, maKhachHang, soLuongNguoi, bookingTime, verifyUser } = params;


    const [cartItems, setCartItems] = useState<ProductInCart[]>(() => {
        if (params.selectedItems) {
            try {
                return JSON.parse(params.selectedItems) as ProductInCart[];
            } catch (e) {
                console.error('Lỗi parse selectedItems:', e);
                return [];
            }
        }
        return [];
    });


    // Giả lập dữ liệu từ state hoặc params (Thực tế bạn nên dùng Context API hoặc Redux)
    // const [cartItems, setCartItems] = useState<CartItem[]>([
    //     { maSanPham: 1, tenSanPham: 'Phở Bò Nam Định', gia: 45000, quantity: 2, urlAnh: 'https://via.placeholder.com/150' },
    //     { maSanPham: 2, tenSanPham: 'Bún Chả Hà Nội', gia: 55000, quantity: 1, urlAnh: 'https://via.placeholder.com/150' },
    // ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.maSanPham === id
                ? { ...item, soluong: Math.max(0, item.soluong + delta) }
                : item
        ).filter(item => item.soluong > 0)); // Xóa món nếu số lượng = 0
    };

    const goBackWithData = () => {
        router.push({
            pathname: '/orderFood',
            params: {
                tableId,
                tableName,
                maNv,
                maKhachHang,
                soLuongNguoi,
                bookingTime,
                updatedItems: JSON.stringify(cartItems),
                ...(verifyUser && { verifyUser }),
            },
        });
    };



    const totalPrice = cartItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);



    const renderItem = ({ item }: { item: any }) => {

        const imageName = item.danhSachAnh?.[0]?.urlAnh;

        // Nối chuỗi để tạo URL đầy đủ
        const fullImageUrl = imageName
            ? `${BASE_URL_IMG}/${imageName}`
            : 'https://via.placeholder.com/150';
        return (
            <View style={styles.cartCard}>
                {/* Lấy ảnh đầu tiên trong mảng danhSachAnh */}
                <Image
                    source={{uri: fullImageUrl}}
                    style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.tenSanPham}</Text>
                    <Text style={styles.itemPrice}>{item.gia.toLocaleString('vi-VN')}đ</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => updateQuantity(item.maSanPham, -1)} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        {/* Dùng soluong thay vì quantity */}
                        <Text style={styles.qtyText}>{item.soluong}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.maSanPham, 1)} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Nút xóa nhanh */}
                <TouchableOpacity onPress={() => updateQuantity(item.maSanPham, -item.soluong)}>
                    <Ionicons name="trash-outline" size={24} color="#FF4D4D"/>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Giỏ hàng của bạn', headerShown: true, headerBackVisible: false, headerLeft: () => null, headerTitleAlign: 'center',}} />

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.maSanPham.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Giỏ hàng trống!</Text>
                        <TouchableOpacity onPress={goBackWithData} style={styles.backBtn}>
                            <Text style={styles.backBtnText}>Tiếp tục chọn món</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalValue}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                        <TouchableOpacity style={{backgroundColor: '#FF6600', height:45,paddingHorizontal: 5,justifyContent: 'center',shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                            padding: 15,
                            borderRadius: 10,
                            alignItems: 'center',}}>
                            <Text style={{color: '#fff', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5}}
                                onPress={goBackWithData}>THÊM MÓN</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.checkoutBtn}>
                        <Text style={styles.checkoutText}
                              onPress={()=>{
                                  router.push({
                                  pathname:'/OrderConfirmScreen',
                                  params:{
                                      tableId:tableId,
                                      tableName:tableName,
                                      maNv:maNv,
                                      maKhachHang: maKhachHang,
                                      bookingTime: bookingTime,
                                      soLuongNguoi: soLuongNguoi,
                                      selectedItems: JSON.stringify(cartItems),
                                      totalPrice:totalPrice.toString(),
                                      ...(verifyUser && { verifyUser }),
                                  }

                              })
                                  console.log("tableid: ", tableId);
                              }}>XÁC NHẬN</Text>

                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    listContent: { padding: 15 },
    cartCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 2,
    },
    itemImage: { width: 70, height: 70, borderRadius: 8 },
    itemDetails: { flex: 1, marginLeft: 12 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    itemPrice: { fontSize: 14, color: '#FF6600', marginVertical: 4 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    qtyBtn: {
        backgroundColor: '#F0F0F0',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: { fontSize: 18, fontWeight: 'bold' },
    qtyText: { marginHorizontal: 15, fontSize: 16, fontWeight: '600' },

    footer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    totalLabel: { fontSize: 18, color: '#666' },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: '#E44D26' },


    checkoutBtn: {
        backgroundColor: '#FF6600',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },



    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 18, color: '#999', marginBottom: 20 },
    backBtn: { padding: 10 },
    backBtnText: { color: '#FF6600', fontWeight: 'bold' }
});

export default CartScreen;