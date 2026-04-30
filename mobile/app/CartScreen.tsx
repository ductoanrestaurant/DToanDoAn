import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {getImageUrl, ENDPOINTS} from "@/constants/api";
import axios from "axios";



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
    maxServings?: number; // Số phần tối đa (từ tồn kho)
}

interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhMuc: DanhMuc;
    danhSachAnh: { urlAnh: string }[];
    maxServings?: number;
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



    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchAndMergeData = async () => {
            try {

                let paramItems: { maSanPham: number, soluong: number }[] = [];
                if (params.selectedItems) {
                    paramItems = JSON.parse(params.selectedItems);
                }

                if (paramItems.length === 0) {
                    setLoading(false);
                    return;
                }


                const response = await axios.get(ENDPOINTS.SAN_PHAM_MENU);
                const allProducts: SanPham[] = response.data;


                const fullDetailsCart: ProductInCart[] = paramItems.map(pItem => {
                    const foundProduct = allProducts.find(prod => prod.maSanPham === pItem.maSanPham);
                    if (foundProduct) {
                        return {
                            ...foundProduct,
                            soluong: pItem.soluong
                        };
                    }
                    return null;
                }).filter((item): item is ProductInCart => item !== null); // bỏ item không tìm thấy

                setCartItems(fullDetailsCart);
            } catch (error) {
                console.error("Lỗi khi tải thông tin giỏ hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndMergeData();
    }, [params.selectedItems]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => {
            if (delta > 0) {
                const currentItem = prev.find(item => item.maSanPham === id);
                const maxForThis = currentItem?.maxServings ?? 999;
                if (currentItem && currentItem.soluong >= maxForThis) {
                    Alert.alert(
                        "Đã đạt giới hạn",
                        `Chỉ được đặt tối đa ${maxForThis} phần cho món "${currentItem.tenSanPham}" (theo tồn kho).`
                    );
                    return prev;
                }
            }
            return prev.map(item =>
                item.maSanPham === id
                    ? { ...item, soluong: Math.max(0, item.soluong + delta) }
                    : item
            ).filter(item => item.soluong > 0);
        });
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



    const renderItem = ({ item }: { item: ProductInCart }) => {
        const imageName = item.danhSachAnh?.[0]?.urlAnh;
        const fullImageUrl = imageName
            ? getImageUrl(imageName)
            : 'https://via.placeholder.com/150';
        const maxForThis = item.maxServings ?? 999;

        return (
            <View style={styles.cartCard}>
                <Image
                    source={{uri: fullImageUrl}}
                    style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.tenSanPham}</Text>
                    <Text style={styles.itemPrice}>{(item.gia || 0).toLocaleString('vi-VN')}đ</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => updateQuantity(item.maSanPham, -1)} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{item.soluong}<Text style={{ fontSize: 12, color: '#999' }}>/{maxForThis}</Text></Text>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.maSanPham, 1)}
                            style={[styles.qtyBtn, item.soluong >= maxForThis && { backgroundColor: '#ddd' }]}
                            disabled={item.soluong >= maxForThis}
                        >
                            <Text style={[styles.qtyBtnText, item.soluong >= maxForThis && { color: '#aaa' }]}>+</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <TouchableOpacity onPress={() => updateQuantity(item.maSanPham, -item.soluong)}>
                    <Ionicons name="trash-outline" size={24} color="#FF4D4D"/>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
                <ActivityIndicator size="large" color="#FF6600" />
                <Text style={{marginTop: 10, color: '#666'}}>Đang cập nhật giỏ hàng...</Text>
            </SafeAreaView>
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
                    <TouchableOpacity style={styles.checkoutBtn}
                                      onPress={()=> {
                                          const inforOrder = cartItems.map(item => ({
                                              maSanPham: item.maSanPham,
                                              soluong: item.soluong
                                          }));
                                          console.log("===check data cartscreen===");
                                          console.log("du lieu gui di: ", {tableId, tableName, maNv, maKhachHang, soLuongNguoi, bookingTime,selectedItems: JSON.stringify(inforOrder),
                                              ...(verifyUser && { verifyUser }),} );

                                          router.push({
                                              pathname: '/OrderConfirmScreen',
                                              params: {
                                                  tableId: tableId,
                                                  tableName: tableName,
                                                  maNv: maNv,
                                                  maKhachHang: maKhachHang,
                                                  bookingTime: bookingTime,
                                                  soLuongNguoi: soLuongNguoi,
                                                  selectedItems: JSON.stringify(inforOrder),
                                                  totalPrice: totalPrice.toString(),
                                                  ...(verifyUser && {verifyUser}),
                                              }

                                          });
                                          console.log("tableid: ", tableId);
                                      }}
                    >
                        <Text style={styles.checkoutText}>XÁC NHẬN</Text>

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