import { ENDPOINTS } from '@/constants/api';
import { BASE_URL_IMG } from '@/constants/api';
import axios from 'axios';
import {router, Stack, useLocalSearchParams} from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {Dimensions, ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import {Ionicons} from "@expo/vector-icons";



const { width: SCREEN_WIDTH } = Dimensions.get('window');


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
    danhSachDanhGia?: DanhGia[];
}

export interface DanhGia {
    id: {
        maTaiKhoan: number;
        maSanPham: number;
    };
    noiDung: string;
    soSao: number;
    ngayDanhGia: string;
    khachHang?: {
        hoTen: string;
    };
}


const MenuScreen = () => {
    const [menuItems, setMenuItems] = useState<SanPham[]>([]);
    const [categories, setCategories] = useState<DanhMuc[]>([]); // Lưu danh sách danh mục
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // null = Tất cả
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedMonToView, setSelectedMonToView] = useState<SanPham | null>(null);
    const [viewMon, setViewMon] = useState(false);


    // trang thai xem chi tiet 1 mon an
    const handleOpenDetails = (product: SanPham) => {
        setSelectedMonToView(product);
        setViewMon(true);
    };

    // const BASE_URL_IMAGE = 'http://10.6.61.18:8080/uploads/';

    // const { updatedItems, ...restParams } = useLocalSearchParams<{ updatedItems?: string }>();
    //
    // const {tableId, tableName, bookingTime, maNv, maKhachHang, soLuongNguoi} = useLocalSearchParams<{
    //     tableId: string;
    //     tableName: string;
    //     bookingTime: string;
    //     maNv: string,
    //     soLuongNguoi: string,
    //     maKhachHang: string,
    // }>();


    type OrderFoodParams = {
        tableId: string;
        tableName: string;
        bookingTime: string;
        maNv: string;
        maKhachHang: string;
        soLuongNguoi: string;
        updatedItems?: string;
        verifyUser?: string;
    };

    const params = useLocalSearchParams<OrderFoodParams>();
    const { tableId, tableName, bookingTime, maNv, maKhachHang, soLuongNguoi, updatedItems, verifyUser } = params;


    const [mon, setMon] = useState<ProductInCart[]>(() => {
        if (updatedItems) {
            try {
                return JSON.parse(updatedItems) as ProductInCart[];
            } catch (e) {
                console.error('Lỗi parse updatedItems:', e);
                return [];
            }
        }
        return [];
    });




    const AddMonToCard = (product: SanPham) => {
        setMon(prev => {
            const exitItem = prev.find(item => item.maSanPham === product.maSanPham);
            if(exitItem){
                return prev.map(item =>
                    item.maSanPham == product.maSanPham ? {...item, soluong: item.soluong +1} : item
                );
            }
            return [...prev, { ...product, soluong: 1}];
        });
    };

    // so luong va tong tien tam tinh
    const totalItems = mon.reduce((sum, item) => sum + item.soluong, 0);
    const totalPrice = mon.reduce((sum, item) => sum + (item.gia * item.soluong),0);

    // Hàm lấy dữ liệu (Sản phẩm và Danh mục)
    const fetchData = useCallback(async () => {
        try {
            if (!refreshing) setLoading(true);

            const [resSanPham, resDanhMuc, resDanhGia] = await Promise.all([
                axios.get(ENDPOINTS.SAN_PHAM),
                axios.get(ENDPOINTS.DANH_MUC),
                axios.get(ENDPOINTS.DANH_GIA),
            ]);

            const allProducts: SanPham[] = resSanPham.data;
            const allReviews: DanhGia[] = resDanhGia.data;

            const menuWithReviews = allProducts.map((product) => {
                return {
                    ...product,
                    // Tìm các đánh giá có mã sản phẩm khớp với sản phẩm hiện tại
                    danhSachDanhGia: allReviews.filter(
                        (review) => review.id.maSanPham === product.maSanPham
                    )
                };
            });

            setMenuItems(menuWithReviews);
            setCategories(resDanhMuc.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Logic lọc sản phẩm dựa trên Category đang chọn
    const filteredItems = selectedCategoryId 
        ? menuItems.filter(item => item.danhMuc?.maDanhMuc === selectedCategoryId)
        : menuItems;

    // Render nút danh mục
    const renderCategoryItem = ({ item }: { item: any }) => {
        const isSelected = selectedCategoryId === item.maDanhMuc;
        return (
            <TouchableOpacity
                style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                onPress={() => setSelectedCategoryId(item.maDanhMuc)}
            >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                    {item.tenDanhMuc}
                </Text>
            </TouchableOpacity>
        );
    };



    const getAverageRating = (reviews?: DanhGia[]): number => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, item) => acc + item.soSao, 0);

        return Number((sum / reviews.length).toFixed(1));
    };

    const ReviewSection = ({ reviews }: { reviews?: DanhGia[] }) => {
        if (!reviews || reviews.length === 0) {
            return <Text style={styles.noReviewText}>Chưa có đánh giá nào cho món này.</Text>;
        }

        // Tính điểm trung bình
        const averageRating = reviews.reduce((sum, item) => sum + item.soSao, 0) / reviews.length;

        return (
            <View style={styles.reviewContainer}>
                <View style={styles.reviewHeaderRow}>
                    <Text style={styles.modalSectionTitle}>Đánh giá từ khách hàng</Text>
                    <View style={styles.avgBadge}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={styles.avgText}>{averageRating.toFixed(1)}</Text>
                    </View>
                </View>

                {reviews.map((review, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewUserRow}>
                            <Text style={{fontWeight: 'bold'}}>{review.khachHang?.hoTen || 'Khách hàng'}</Text>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Ionicons
                                        key={s}
                                        name={s <= review.soSao ? "star" : "star-outline"}
                                        size={12}
                                        color="#FFB800"
                                    />
                                ))}
                            </View>
                            <Text style={styles.reviewDate}>
                                {new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                        <Text style={styles.reviewContent}>{review.noiDung}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const [activeIndex, setActiveIndex] = useState(0);

    // const renderProductItem = ({ item }: { item: SanPham }) => (
    //     <TouchableOpacity style={styles.card}>
    //         <Image
    //             source={{ uri: item.danhSachAnh?.[0]?.urlAnh || 'https://via.placeholder.com/150' }}
    //             style={styles.foodImage}
    //         />
    //         <View style={styles.infoContainer}>
    //             <View>
    //                 <Text style={styles.foodName}>{item.tenSanPham}</Text>
    //                 <Text style={styles.categoryTag}>{item.danhMuc?.tenDanhMuc}</Text>
    //                 <Text numberOfLines={2} style={styles.description}>{item.moTa}</Text>
    //             </View>
    //             <View style={styles.footerRow}>
    //                 <Text style={styles.price}>{item.gia.toLocaleString('vi-VN')}đ</Text>
    //                 <TouchableOpacity style={styles.addButton} onPress={() => AddMonToCard(item)}>
    //                     <Text style={styles.addButtonText}>+</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     </TouchableOpacity>
    // );

    const renderProductItem = ({ item }: { item: SanPham }) => {
        // Lấy tên file ảnh từ danh sách
        const imageName = item.danhSachAnh?.[0]?.urlAnh;
        const avgRating = getAverageRating(item.danhSachDanhGia);

        // Nối chuỗi để tạo URL đầy đủ
        const fullImageUrl = imageName
            ? `${BASE_URL_IMG}/${imageName}`
            : 'https://via.placeholder.com/150';

        // console.log('url image:', fullImageUrl);

        return (
            <TouchableOpacity style={styles.card} onPress={() => handleOpenDetails(item)}>
                <Image
                    source={{ uri: fullImageUrl }}
                    style={styles.foodImage}
                    resizeMode="cover"
                />
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.foodName}>{item.tenSanPham}</Text>
                        <View style={styles.ratingRowMain}>
                            <Ionicons name="star" size={14} color="#FFB800" />
                            <Text style={styles.ratingTextMain}>{avgRating > 0 ? avgRating : "Mới"}</Text>
                            <Text style={styles.reviewCountMain}>({item.danhSachDanhGia?.length || 0})</Text>
                        </View>
                        <Text style={styles.categoryTag}>{item.danhMuc?.tenDanhMuc}</Text>
                        <Text numberOfLines={2} style={styles.description}>{item.moTa}</Text>
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.price}>{item.gia.toLocaleString('vi-VN')}đ</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => AddMonToCard(item)}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );


    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FF6600" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: '', headerShown: false }} />


            <Text style={styles.headerTitle}>Menu nhà hàng</Text>


            {/* Thanh lọc danh mục (Nằm ngang) */}
            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[{ maDanhMuc: null, tenDanhMuc: 'Tất cả' }, ...categories]}
                    keyExtractor={(item) => (item.maDanhMuc?.toString() || 'all')}
                    renderItem={renderCategoryItem}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.maSanPham.toString()}
                renderItem={renderProductItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6600']} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Không tìm thấy món ăn trong danh mục này</Text>
                }
            />

            <View style={styles.cartFooter} >
                <View>
                    <Text style={styles.cartFooterText}>{totalItems} món • {totalPrice.toLocaleString('vi-VN')}đ</Text>
                    <Text style={styles.tableNote}>Bàn: {tableName}</Text>
                </View>
                <Text style={styles.viewCartBtn}
                      onPress={() =>{
                          router.push({
                              pathname:'/CartScreen',
                              params:{
                                  tableId,
                                  tableName,
                                  bookingTime,
                                  maNv,
                                  maKhachHang,
                                  soLuongNguoi,
                                  selectedItems: JSON.stringify(mon),
                                  ...(verifyUser && { verifyUser }),
                              }
                          });}
                      }>Xem giỏ hàng</Text>
            </View>

            <Modal animationType="slide" transparent={true} visible={viewMon} onRequestClose={() => setViewMon(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={()=> {setViewMon(false); setActiveIndex(0)}}>
                            <Text style={styles.closeModalText}>X</Text>
                        </TouchableOpacity>

                        {selectedMonToView && (
                            <>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ height: 250, width: SCREEN_WIDTH }}>
                                        <FlatList
                                            data={selectedMonToView.danhSachAnh}
                                            horizontal
                                            pagingEnabled // Quan trọng: Giúp vuốt từng tấm ảnh một
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(img, index) => index.toString()}
                                            getItemLayout={(_, index) => ({
                                                length: SCREEN_WIDTH,
                                                offset: SCREEN_WIDTH * index,
                                                index,
                                            })}
                                            onMomentumScrollEnd={(event) => {
                                                const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                                                setActiveIndex(index);
                                            }}
                                            renderItem={({ item: img }) => (
                                                <Image
                                                    source={{ uri: `${BASE_URL_IMG}/${img.urlAnh}` }}
                                                    style={{
                                                        width: SCREEN_WIDTH, // Bạn có thể dùng Dimensions.get('window').width
                                                        height: 250,
                                                        borderTopLeftRadius: 25,
                                                        borderTopRightRadius: 25
                                                    }}
                                                    resizeMode="cover"
                                                />
                                            )}
                                            // Nếu không có ảnh nào, hiển thị ảnh mặc định
                                            ListEmptyComponent={
                                                <Image
                                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                                    style={styles.modalImage}
                                                />
                                            }
                                        />
                                        {selectedMonToView.danhSachAnh?.length > 1 && (
                                            <View style={styles.imageBadge}>
                                                <Text style={styles.imageBadgeText}>
                                                    {activeIndex + 1} / {selectedMonToView.danhSachAnh.length}
                                                </Text>
                                            </View>
                                        )}

                                    </View>

                                    <View style={styles.modalBody}>
                                        <View style={styles.modalHeaderTitleRow}>
                                            <Text style={styles.modalFoodName}>{selectedMonToView.tenSanPham}</Text>
                                            <Text style={styles.modalPrice}>{selectedMonToView.gia.toLocaleString('vi-VN')}đ</Text>
                                        </View>

                                        {/* Dãy sao chi tiết */}
                                        <View style={styles.modalRatingRow}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Ionicons
                                                    key={star}
                                                    name={star <= Math.round(getAverageRating(selectedMonToView.danhSachDanhGia)) ? "star" : "star-outline"}
                                                    size={18}
                                                    color="#FFB800"
                                                />
                                            ))}
                                            <Text style={styles.modalRatingText}>
                                                {getAverageRating(selectedMonToView.danhSachDanhGia)} / 5
                                            </Text>
                                        </View>

                                        <Text style={styles.modalCategory}>{selectedMonToView.danhMuc?.tenDanhMuc}</Text>


                                        <View style={styles.divider} />



                                        <Text style={styles.modalSectionTitle}>Mô tả món ăn</Text>
                                        <Text style={styles.modalDescription}>{selectedMonToView.moTa || ""}</Text>

                                        <View style={styles.divider} />

                                        <ReviewSection reviews={selectedMonToView.danhSachDanhGia} />


                                    </View>

                                </ScrollView>

                                <View>
                                <TouchableOpacity
                                    style={styles.modalAddBtn}
                                    onPress={() => { AddMonToCard(selectedMonToView);setViewMon(false);}}
                                >
                                    <Text style={styles.modalAddBtnText}>Thêm vào giỏ hàng</Text>
                                </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8'},
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 10, backgroundColor: '#fff'  , flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'},
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 20 },
    
    // Style cho thanh danh mục
    categoryContainer: { backgroundColor: '#fff', paddingBottom: 5 },
    categoryList: { paddingHorizontal: 15, paddingVertical: 10 },
    categoryBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10, borderWidth: 1, borderColor: '#eee'},

    badge: { position: 'absolute', top: 15, right: -5, backgroundColor: 'red', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center'},
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    // Thanh giỏ hàng phía dưới
    cartFooter: { backgroundColor: '#FF6600', margin: 10, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.2, shadowRadius: 4,},
    cartFooterText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    tableNote: { color: '#fff', fontSize: 12, opacity: 0.9 },
    viewCartBtn: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    categoryBtnActive: { backgroundColor: '#FF6600', borderColor: '#FF6600' },
    categoryText: { color: '#666', fontWeight: '600' },
    categoryTextActive: { color: '#fff' },

    listContent: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 15, flexDirection: 'row', marginBottom: 15, padding: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,},
    foodImage: { width: 100, height: 100, borderRadius: 10 },
    infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
    foodName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    categoryTag: { fontSize: 12, color: '#FF6600', backgroundColor: '#FFF0E6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 4},
    description: { fontSize: 13, color: '#777', marginTop: 5 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#E44D26' },
    addButton: { backgroundColor: '#FF6600', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center'},
    addButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '80%', // Chiều cao popup
        paddingBottom: 20,
    },
    closeModalBtn: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeaderTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Đẩy 2 phần tử về 2 đầu
        alignItems: 'center',            // Căn giữa theo chiều dọc
        marginBottom: 5,
    },
    closeModalText: { color: '#fff', fontWeight: 'bold' },
    modalImage: { width: '100%', height: 250, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
    modalBody: { padding: 20 },
    modalFoodName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    modalCategory: { fontSize: 14, color: '#FF6600', marginTop: 5 },
    modalPrice: { fontSize: 22, fontWeight: 'bold', color: '#E44D26', marginTop: 10 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    modalSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 8 },
    modalDescription: { fontSize: 15, color: '#666', lineHeight: 22 },
    modalAddBtn: {
        backgroundColor: '#FF6600',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    modalAddBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    // Sao ở danh sách chính
    ratingRowMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingTextMain: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 4,
    },
    reviewCountMain: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
    },

    // Sao trong Modal
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    modalRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    modalRatingText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#666',
        fontWeight: '600',
    },
    imageBadge: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageBadgeText: {
        color: '#fff',
        fontSize: 12,
    },
    reviewContainer: { marginTop: 10 },
    reviewHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    avgBadge: {
        flexDirection: 'row',
        backgroundColor: '#FF6600',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignItems: 'center'
    },
    avgText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 3 },
    reviewItem: {
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    reviewUserRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    starsRow: { flexDirection: 'row' },
    reviewDate: { fontSize: 11, color: '#999' },
    reviewContent: { fontSize: 14, color: '#444', lineHeight: 20 },
    noReviewText: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginVertical: 20 },
});

export default MenuScreen;