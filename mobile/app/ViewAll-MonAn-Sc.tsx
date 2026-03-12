import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
    TextInput, ActivityIndicator, SafeAreaView, Modal, ScrollView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import api, { ENDPOINTS, BASE_URL_IMG } from '@/constants/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
    primary: '#FF6600',
    white: '#FFFFFF',
    background: '#F7F8FC',
    textMain: '#333333',
    textSec: '#888888',
    lightGray: '#E8E8E8',
};

interface DanhMuc {
    maDanhMuc: number;
    tenDanhMuc: string;
}

interface DanhGia {
    id: { maTaiKhoan: number; maSanPham: number };
    noiDung: string;
    soSao: number;
    ngayDanhGia: string;
    khachHang?: { hoTen: string };
}

interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhSachAnh: { urlAnh: string }[];
    danhMuc: DanhMuc;
    danhSachDanhGia?: DanhGia[];
    avgRating?: number;
}

// ---- Helper ----
const getRating = (reviews?: DanhGia[]): number => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.soSao, 0);
    return Number((sum / reviews.length).toFixed(1));
};

// ---- Review component ----
const ReviewFood = ({ reviews }: { reviews?: DanhGia[] }) => {
    if (!reviews || reviews.length === 0) {
        return <Text style={styles.noReviewText}>Chưa có đánh giá nào cho món này.</Text>;
    }
    const avg = getRating(reviews);
    return (
        <View style={styles.reviewContainer}>
            <View style={styles.reviewHeaderRow}>
                <Text style={styles.modalSectionTitle}>Đánh giá từ khách hàng</Text>
                <View style={styles.avgBadge}>
                    <Ionicons name="star" size={12} color="#fff" />
                    <Text style={styles.avgText}>{avg}</Text>
                </View>
            </View>
            {reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewUserRow}>
                        <Text style={{ fontWeight: 'bold' }}>{review.khachHang?.hoTen || 'Khách hàng'}</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Ionicons key={s} name={s <= review.soSao ? 'star' : 'star-outline'} size={12} color="#FFB800" />
                            ))}
                        </View>
                    </View>
                    <Text style={styles.reviewDate}>{new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}</Text>
                    <Text style={styles.reviewContent}>{review.noiDung}</Text>
                </View>
            ))}
        </View>
    );
};

// ---- Product Card ----
const ProductCard = ({ item, onPress }: { item: SanPham; onPress: () => void }) => {
    const imageUrl = item.danhSachAnh?.[0]?.urlAnh
        ? `${BASE_URL_IMG}/${item.danhSachAnh[0].urlAnh}`
        : 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.tenSanPham}</Text>
                <Text style={styles.cardCategory}>{item.danhMuc?.tenDanhMuc || 'Chưa phân loại'}</Text>
                <View style={styles.cardRatingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.cardRatingText}>
                        {item.avgRating && item.avgRating > 0 ? item.avgRating : 'Mới'}
                    </Text>
                </View>
                <Text style={styles.cardPrice}>{item.gia.toLocaleString('vi-VN')}đ</Text>
            </View>
        </TouchableOpacity>
    );
};

// ---- Main Screen ----
const ViewAllMonAnScreen = () => {
    const router = useRouter();
    const [products, setProducts] = useState<SanPham[]>([]);
    const [categories, setCategories] = useState<DanhMuc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Modal state
    const [viewMon, setViewMon] = useState(false);
    const [selectedMon, setSelectedMon] = useState<SanPham | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productRes, categoryRes, reviewRes] = await Promise.all([
                    api.get(ENDPOINTS.SAN_PHAM),
                    api.get(ENDPOINTS.DANH_MUC),
                    api.get(ENDPOINTS.DANH_GIA),
                ]);

                const allReviews: DanhGia[] = reviewRes.data;
                const rawProducts: SanPham[] = productRes.data || [];

                const productsWithRating = rawProducts.map(sp => {
                    const reviews = allReviews.filter(r => r.id.maSanPham === sp.maSanPham);
                    return { ...sp, danhSachDanhGia: reviews, avgRating: getRating(reviews) };
                });

                setProducts(productsWithRating);
                setCategories([{ maDanhMuc: 0, tenDanhMuc: 'Tất cả' }, ...categoryRes.data]);
            } catch (err) {
                setError('Không thể tải danh sách món ăn. Vui lòng thử lại.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === null || selectedCategory === 0 || product.danhMuc?.maDanhMuc === selectedCategory;
            const matchesSearch = product.tenSanPham.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchQuery, selectedCategory]);

    const handleOpenDetails = (item: SanPham) => {
        setSelectedMon(item);
        setActiveIndex(0);
        setViewMon(true);
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tất cả món ăn</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textSec} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Category filter */}
            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item.maDanhMuc.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryChip, selectedCategory === item.maDanhMuc && styles.categoryChipActive]}
                            onPress={() => setSelectedCategory(item.maDanhMuc)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === item.maDanhMuc && styles.categoryTextActive]}>
                                {item.tenDanhMuc}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Product grid */}
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard item={item} onPress={() => handleOpenDetails(item)} />}
                keyExtractor={(item) => item.maSanPham.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text>Không tìm thấy món ăn nào.</Text>
                    </View>
                }
            />

            {/* Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={viewMon}
                onRequestClose={() => setViewMon(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeModalBtn}
                            onPress={() => { setViewMon(false); setActiveIndex(0); }}
                        >
                            <Text style={styles.closeModalText}>X</Text>
                        </TouchableOpacity>

                        {selectedMon && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Image carousel */}
                                <View style={{ height: 250, width: SCREEN_WIDTH }}>
                                    <FlatList
                                        data={selectedMon.danhSachAnh}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(_, index) => index.toString()}
                                        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
                                        onMomentumScrollEnd={(event) => {
                                            const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                                            setActiveIndex(index);
                                        }}
                                        renderItem={({ item: img }) => (
                                            <Image
                                                source={{ uri: `${BASE_URL_IMG}/${img.urlAnh}` }}
                                                style={{ width: SCREEN_WIDTH, height: 250, borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
                                                resizeMode="cover"
                                            />
                                        )}
                                        ListEmptyComponent={
                                            <Image
                                                source={{ uri: 'https://via.placeholder.com/150' }}
                                                style={styles.modalImage}
                                            />
                                        }
                                    />
                                    {selectedMon.danhSachAnh?.length > 1 && (
                                        <View style={styles.imageBadge}>
                                            <Text style={styles.imageBadgeText}>{activeIndex + 1} / {selectedMon.danhSachAnh.length}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Body */}
                                <View style={styles.modalBody}>
                                    <View style={styles.modalHeaderTitleRow}>
                                        <Text style={styles.modalFoodName}>{selectedMon.tenSanPham}</Text>
                                        <Text style={styles.modalPrice}>{selectedMon.gia.toLocaleString('vi-VN')}đ</Text>
                                    </View>

                                    <View style={styles.modalRatingRow}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons
                                                key={star}
                                                name={star <= Math.round(selectedMon.avgRating || 0) ? 'star' : 'star-outline'}
                                                size={18}
                                                color="#FFB800"
                                            />
                                        ))}
                                        <Text style={styles.modalRatingText}>{selectedMon.avgRating || 0} / 5</Text>
                                    </View>

                                    <Text style={styles.modalCategory}>{selectedMon.danhMuc?.tenDanhMuc}</Text>
                                    <View style={styles.divider} />

                                    <Text style={styles.modalSectionTitle}>Mô tả món ăn</Text>
                                    <Text style={styles.modalDescription}>{selectedMon.moTa || 'Chưa có mô tả.'}</Text>
                                    <View style={styles.divider} />

                                    <ReviewFood reviews={selectedMon.danhSachDanhGia} />
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, paddingVertical: 10, backgroundColor: COLORS.white,
        borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 12, margin: 15, paddingHorizontal: 15,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 45, fontSize: 15 },
    categoryContainer: { paddingLeft: 15, marginBottom: 10 },
    categoryChip: {
        paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
        backgroundColor: COLORS.white, marginRight: 10,
        borderWidth: 1, borderColor: COLORS.lightGray,
    },
    categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    categoryText: { color: COLORS.textMain, fontWeight: '600' },
    categoryTextActive: { color: COLORS.white },
    listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
    card: {
        flex: 1, margin: 5, backgroundColor: COLORS.white, borderRadius: 12,
        overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
    },
    cardImage: { width: '100%', height: 120 },
    cardContent: { padding: 10 },
    cardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    cardCategory: { fontSize: 12, color: COLORS.textSec, marginBottom: 5 },
    cardRatingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    cardRatingText: { fontSize: 12, color: COLORS.textMain, marginLeft: 4, fontWeight: '600' },
    cardPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, textAlign: 'right' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '85%', paddingBottom: 20 },
    closeModalBtn: { position: 'absolute', right: 20, top: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    closeModalText: { color: '#fff', fontWeight: 'bold' },
    modalImage: { width: '100%', height: 250, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
    imageBadge: { position: 'absolute', bottom: 10, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    imageBadgeText: { color: '#fff', fontSize: 12 },
    modalBody: { padding: 20 },
    modalHeaderTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    modalFoodName: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
    modalPrice: { fontSize: 22, fontWeight: 'bold', color: '#E44D26' },
    modalRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    modalRatingText: { marginLeft: 8, fontSize: 15, color: '#666', fontWeight: '600' },
    modalCategory: { fontSize: 14, color: COLORS.primary, marginTop: 5 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    modalSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 8 },
    modalDescription: { fontSize: 15, color: '#666', lineHeight: 22 },

    // Reviews
    reviewContainer: { marginTop: 10 },
    reviewHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    avgBadge: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignItems: 'center' },
    avgText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 3 },
    reviewItem: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 10 },
    reviewUserRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    starsRow: { flexDirection: 'row' },
    reviewDate: { fontSize: 11, color: '#999' },
    reviewContent: { fontSize: 14, color: '#444', lineHeight: 20 },
    noReviewText: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginVertical: 20 },
});

export default ViewAllMonAnScreen;
