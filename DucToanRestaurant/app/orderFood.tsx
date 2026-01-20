import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, Dimensions, FlatList, Image, Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from 'expo-router';
import api, { BASE_URL_IMG, ENDPOINTS } from '@/constants/api'; // Use the authenticated api instance

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- INTERFACES ---
export interface DanhMuc {
    maDanhMuc: number;
    tenDanhMuc: string;
}

export interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhMuc: DanhMuc;
    danhSachAnh: { urlAnh: string }[];
    danhSachDanhGia?: DanhGia[];
}

export interface ProductInCart extends SanPham {
    soluong: number;
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

// --- HELPER FUNCTIONS ---
const getAverageRating = (reviews?: DanhGia[]): number => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, item) => acc + item.soSao, 0);
    return Number((sum / reviews.length).toFixed(1));
};

// --- COMPONENTS ---
const ReviewSection: React.FC<{ reviews?: DanhGia[] }> = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <Text style={styles.noReviewText}>Chưa có đánh giá nào cho món này.</Text>;
    }
    const averageRating = getAverageRating(reviews);

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
                        <Text style={{ fontWeight: 'bold' }}>{review.khachHang?.hoTen || 'Khách hàng'}</Text>
                        <View style={styles.starsRow}>
                            {[...Array(5)].map((_, s) => (
                                <Ionicons key={s} name={s < review.soSao ? "star" : "star-outline"} size={12} color="#FFB800" />
                            ))}
                        </View>
                        <Text style={styles.reviewDate}>{new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}</Text>
                    </View>
                    <Text style={styles.reviewContent}>{review.noiDung}</Text>
                </View>
            ))}
        </View>
    );
};

const ProductItem: React.FC<{ item: SanPham; onAddToCart: (product: SanPham) => void; onOpenDetails: (product: SanPham) => void; }> = ({ item, onAddToCart, onOpenDetails }) => {
    const imageName = item.danhSachAnh?.[0]?.urlAnh;
    const avgRating = getAverageRating(item.danhSachDanhGia);
    const fullImageUrl = imageName ? `${BASE_URL_IMG}/${imageName}` : 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity style={styles.card} onPress={() => onOpenDetails(item)}>
            <Image source={{ uri: fullImageUrl }} style={styles.foodImage} resizeMode="cover" />
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
                    <TouchableOpacity style={styles.addButton} onPress={() => onAddToCart(item)}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- MAIN SCREEN ---
const MenuScreen = () => {
    const params = useLocalSearchParams<OrderFoodParams>();
    const { tableId, tableName, bookingTime, maNv, maKhachHang, soLuongNguoi, updatedItems, verifyUser } = params;

    const [menuItems, setMenuItems] = useState<SanPham[]>([]);
    const [categories, setCategories] = useState<DanhMuc[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMonToView, setSelectedMonToView] = useState<SanPham | null>(null);
    const [viewMon, setViewMon] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const [mon, setMon] = useState<ProductInCart[]>(() => {
        try {
            return updatedItems ? JSON.parse(updatedItems) : [];
        } catch (e) {
            console.error('Lỗi parse updatedItems:', e);
            return [];
        }
    });

    const fetchData = useCallback(async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        setError(null);
        try {
            const [resSanPham, resDanhMuc, resDanhGia] = await Promise.all([
                api.get(ENDPOINTS.SAN_PHAM),
                api.get(ENDPOINTS.DANH_MUC),
                api.get(ENDPOINTS.DANH_GIA),
            ]);

            const allProducts: SanPham[] = resSanPham.data || [];
            const allReviews: DanhGia[] = resDanhGia.data || [];

            const menuWithReviews = allProducts.map(product => ({
                ...product,
                danhSachDanhGia: allReviews.filter(review => review.id.maSanPham === product.maSanPham)
            }));

            setMenuItems(menuWithReviews);
            setCategories(resDanhMuc.data || []);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu:", err);
            setError("Không thể tải menu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
            if (isRefreshing) setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData(true);
    };

    const handleAddToCart = (product: SanPham) => {
        setMon(prev => {
            const existItem = prev.find(item => item.maSanPham === product.maSanPham);
            if (existItem) {
                return prev.map(item => item.maSanPham === product.maSanPham ? { ...item, soluong: item.soluong + 1 } : item);
            }
            return [...prev, { ...product, soluong: 1 }];
        });
    };

    const handleOpenDetails = (product: SanPham) => {
        setSelectedMonToView(product);
        setViewMon(true);
    };

    const handleViewCart = () => {
        const inforItemPush = mon.map(item => ({
            maSanPham: item.maSanPham,
            soluong: item.soluong,
        }));

        router.push({
            pathname: '/CartScreen',
            params: {
                tableId, tableName, bookingTime, maNv, maKhachHang, soLuongNguoi,
                selectedItems: JSON.stringify(inforItemPush),
                ...(verifyUser && { verifyUser }),
            }
        });
    };

    const filteredItems = selectedCategoryId ? menuItems.filter(item => item.danhMuc?.maDanhMuc === selectedCategoryId) : menuItems;
    const totalItems = mon.reduce((sum, item) => sum + item.soluong, 0);
    const totalPrice = mon.reduce((sum, item) => sum + (item.gia * item.soluong), 0);

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#FF6600" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.emptyText}>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Text style={styles.headerTitle}>Menu nhà hàng</Text>

            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal showsHorizontalScrollIndicator={false}
                    data={[{ maDanhMuc: null, tenDanhMuc: 'Tất cả' }, ...categories]}
                    keyExtractor={(item) => item.maDanhMuc?.toString() || 'all'}
                    renderItem={({ item }) => {
                        const isSelected = selectedCategoryId === item.maDanhMuc;
                        return (
                            <TouchableOpacity style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]} onPress={() => setSelectedCategoryId(item.maDanhMuc)}>
                                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{item.tenDanhMuc}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.maSanPham.toString()}
                renderItem={({ item }) => <ProductItem item={item} onAddToCart={handleAddToCart} onOpenDetails={handleOpenDetails} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6600']} />}
                ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy món ăn trong danh mục này</Text>}
            />

            {totalItems > 0 && (
                <View style={styles.cartFooter}>
                    <View>
                        <Text style={styles.cartFooterText}>{totalItems} món • {totalPrice.toLocaleString('vi-VN')}đ</Text>
                        <Text style={styles.tableNote}>Bàn: {tableName}</Text>
                    </View>
                    <TouchableOpacity onPress={handleViewCart}>
                        <Text style={styles.viewCartBtn}>Xem giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal animationType="slide" transparent={true} visible={viewMon} onRequestClose={() => setViewMon(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => { setViewMon(false); setActiveIndex(0); }}>
                            <Ionicons name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                        {selectedMonToView && (
                            <>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ height: 250, width: SCREEN_WIDTH }}>
                                        <FlatList
                                            data={selectedMonToView.danhSachAnh} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                                            keyExtractor={(img, index) => index.toString()}
                                            onMomentumScrollEnd={(event) => setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
                                            renderItem={({ item: img }) => <Image source={{ uri: `${BASE_URL_IMG}/${img.urlAnh}` }} style={{ width: SCREEN_WIDTH, height: 250 }} resizeMode="cover" />}
                                            ListEmptyComponent={<Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.modalImage} />}
                                        />
                                        {selectedMonToView.danhSachAnh?.length > 1 && (
                                            <View style={styles.imageBadge}><Text style={styles.imageBadgeText}>{activeIndex + 1} / {selectedMonToView.danhSachAnh.length}</Text></View>
                                        )}
                                    </View>
                                    <View style={styles.modalBody}>
                                        <View style={styles.modalHeaderTitleRow}>
                                            <Text style={styles.modalFoodName}>{selectedMonToView.tenSanPham}</Text>
                                            <Text style={styles.modalPrice}>{selectedMonToView.gia.toLocaleString('vi-VN')}đ</Text>
                                        </View>
                                        <View style={styles.modalRatingRow}>
                                            {[...Array(5)].map((_, star) => <Ionicons key={star} name={star < Math.round(getAverageRating(selectedMonToView.danhSachDanhGia)) ? "star" : "star-outline"} size={18} color="#FFB800" />)}
                                            <Text style={styles.modalRatingText}>{getAverageRating(selectedMonToView.danhSachDanhGia)} / 5</Text>
                                        </View>
                                        <Text style={styles.modalCategory}>{selectedMonToView.danhMuc?.tenDanhMuc}</Text>
                                        <View style={styles.divider} />
                                        <Text style={styles.modalSectionTitle}>Mô tả món ăn</Text>
                                        <Text style={styles.modalDescription}>{selectedMonToView.moTa || ""}</Text>
                                        <View style={styles.divider} />
                                        <ReviewSection reviews={selectedMonToView.danhSachDanhGia} />
                                    </View>
                                </ScrollView>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity style={styles.modalAddBtn} onPress={() => { handleAddToCart(selectedMonToView); setViewMon(false); }}>
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
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 20 },
    categoryContainer: { backgroundColor: '#fff', paddingBottom: 5, borderBottomColor: '#eee', borderBottomWidth: 1 },
    categoryList: { paddingHorizontal: 15, paddingVertical: 10 },
    categoryBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
    categoryBtnActive: { backgroundColor: '#FF6600', borderColor: '#FF6600' },
    categoryText: { color: '#666', fontWeight: '600' },
    categoryTextActive: { color: '#fff' },
    listContent: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 15, flexDirection: 'row', marginBottom: 15, padding: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    foodImage: { width: 100, height: 100, borderRadius: 10 },
    infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
    foodName: { fontSize: 17, fontWeight: 'bold', color: '#222' },
    ratingRowMain: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    ratingTextMain: { fontSize: 13, fontWeight: 'bold', color: '#333', marginLeft: 4 },
    reviewCountMain: { fontSize: 12, color: '#888', marginLeft: 4 },
    categoryTag: { fontSize: 12, color: '#FF6600', backgroundColor: '#FFF0E6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, marginTop: 5, fontWeight: '600' },
    description: { fontSize: 13, color: '#777', marginTop: 5 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#E44D26' },
    addButton: { backgroundColor: '#FF6600', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', lineHeight: 32 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
    cartFooter: { backgroundColor: '#FF6600', margin: 15, padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.2, shadowRadius: 5 },
    cartFooterText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    tableNote: { color: '#fff', fontSize: 12, opacity: 0.9 },
    viewCartBtn: { color: '#fff', fontWeight: 'bold', fontSize: 15, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '85%', overflow: 'hidden' },
    closeModalBtn: { position: 'absolute', right: 15, top: 15, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    modalImage: { width: '100%', height: 250 },
    modalBody: { padding: 20 },
    modalHeaderTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    modalFoodName: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
    modalPrice: { fontSize: 22, fontWeight: 'bold', color: '#E44D26' },
    modalRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    modalRatingText: { marginLeft: 8, fontSize: 15, color: '#666', fontWeight: '600' },
    modalCategory: { fontSize: 14, color: '#FF6600', marginTop: 8, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    modalSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 10 },
    modalDescription: { fontSize: 15, color: '#666', lineHeight: 22 },
    modalFooter: { padding: 20, borderTopColor: '#eee', borderTopWidth: 1 },
    modalAddBtn: { backgroundColor: '#FF6600', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
    modalAddBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    imageBadge: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    imageBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    reviewContainer: { marginTop: 10 },
    reviewHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    avgBadge: { flexDirection: 'row', backgroundColor: '#FF6600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignItems: 'center' },
    avgText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    reviewItem: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 10 },
    reviewUserRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    starsRow: { flexDirection: 'row' },
    reviewDate: { fontSize: 11, color: '#999' },
    reviewContent: { fontSize: 14, color: '#444', lineHeight: 20 },
    noReviewText: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginVertical: 20 },
});

export default MenuScreen;