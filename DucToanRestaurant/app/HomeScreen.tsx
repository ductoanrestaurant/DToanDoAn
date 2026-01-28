import api, { ENDPOINTS, BASE_URL_IMG } from '@/constants/api';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {useRouter, useLocalSearchParams, router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
    primary: '#FF6600',
    white: '#FFFFFF',
    background: '#F7F8FC',
    textMain: '#333333',
    textSec: '#888888',
    grayBg: '#FFFFFF',
    lightGray: '#E8E8E8',
    red: '#E74C3C',
};


interface KhachHang {
    maTaiKhoan: number;
    hoTen: string;
    email: string;
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

interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhSachAnh: { urlAnh: string }[];
    danhSachDanhGia?: DanhGia[];
    avgRating?: number;
    danhMuc?: { tenDanhMuc: string };
}

interface KhuyenMai {
    maKhuyenMai: number;
    tenKhuyenMai: string;
    moTa: string;
    hinhAnh: string;
}

interface ChiNhanh {
    id: number;
    ten: string;
    diaChi: string;
    img: string;
}

const MOCK_PROMOTIONS: KhuyenMai[] = [
    {
        maKhuyenMai: 1,
        tenKhuyenMai: "Đại Tiệc Mùa Hè - Giảm 50%",
        moTa: "Giảm giá cực sốc cho hóa đơn từ 500k.",
        hinhAnh: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
    },
    {
        maKhuyenMai: 2,
        tenKhuyenMai: "Mua 1 Tặng 1 Pizza",
        moTa: "Áp dụng cho dòng Pizza hải sản.",
        hinhAnh: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
    }
];

const HomeScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const maKhachHang = params.maKhachHang;


    const [customer, setCustomer] = useState<KhachHang | null>(null);
    const [promotions, setPromotions] = useState<KhuyenMai[]>([]);
    const [mustTryFood, setMustTryFood] = useState<SanPham[]>([]);
    const [branches, setBranches] = useState<ChiNhanh[]>([]);
    const [loading, setLoading] = useState(true);


    const [viewMon, setViewMon] = useState(false);
    const [selectedMonToView, setSelectedMonToView] = useState<SanPham | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);


    const getRating = (reviews?: DanhGia[]): number => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, item) => acc + item.soSao, 0);
        return Number((sum / reviews.length).toFixed(1));
    };

    const handleOpenDetails = (product: SanPham) => {
        setSelectedMonToView(product);
        setViewMon(true);
    };


    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                const maKhachHangParam = params.maKhachHang as string;


                if (maKhachHangParam) {
                    const customerRes = await api.get(`${ENDPOINTS.KHACH_HANG}/${maKhachHangParam}`);
                    const customerData: KhachHang = customerRes.data;
                    setCustomer(customerData);
                    await AsyncStorage.setItem('customer-info', JSON.stringify(customerData));
                }

                const [foodRes, branchRes, reviewRes] = await Promise.all([
                    api.get(ENDPOINTS.SAN_PHAM),
                    api.get(ENDPOINTS.RESTAURANT),
                    api.get(ENDPOINTS.DANH_GIA)
                ]);

                const rawFoodData: SanPham[] = foodRes.data;
                const branchData: ChiNhanh[] = branchRes.data;
                const allReviews: DanhGia[] = reviewRes.data;


                const foodWithRating = rawFoodData.map(sp => {

                    const reviewsOfProduct = allReviews.filter(r => r.id.maSanPham === sp.maSanPham);

                    const avgRating = getRating(reviewsOfProduct);

                    return {
                        ...sp,
                        danhSachDanhGia: reviewsOfProduct,
                        avgRating: avgRating
                    };
                });

                setPromotions(MOCK_PROMOTIONS);

                setMustTryFood(foodWithRating.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0)).slice(0, 5));

                setBranches(branchData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [params.maKhachHang]);



    const ReviewFood = ({ reviews }: { reviews?: DanhGia[] }) => {
        if (!reviews || reviews.length === 0) {
            return <Text style={styles.noReviewText}>Chưa có đánh giá nào cho món này.</Text>;
        }
        const averageRating = getRating(reviews);

        return (
            <View style={styles.reviewContainer}>
                <View style={styles.reviewHeaderRow}>
                    <Text style={styles.modalSectionTitle}>Đánh giá từ khách hàng</Text>
                    <View style={styles.avgBadge}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={styles.avgText}>{averageRating}</Text>
                    </View>
                </View>

                {reviews.map((review, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewUserRow}>
                            <Text style={{ fontWeight: 'bold' }}>{review.khachHang?.hoTen || 'Khách hàng'}</Text>
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
                        </View>
                        <Text style={styles.reviewDate}>{new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}</Text>
                        <Text style={styles.reviewContent}>{review.noiDung}</Text>
                    </View>
                ))}
            </View>
        );
    };


    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerSubText}>Xin chào,</Text>
                <TouchableOpacity style={styles.locationContainer}>
                    <Text style={styles.headerLocationText} numberOfLines={1}>
                        {customer ? customer.hoTen : 'Khách hàng'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/qr-scanner')}>
                    <Ionicons name="qr-code-outline" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.textMain} />
                    <View style={styles.notificationBadge}><Text style={styles.notificationText}>3</Text></View>
                </TouchableOpacity>
            </View>
        </View>
    );


    const renderCardKhuyenMai = () => (
        <View>
            {promotions.length > 0 ? (
                <FlatList
                    data={promotions} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.maKhuyenMai.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.promotionCard}>
                            <Image source={{ uri: item.hinhAnh }} style={styles.promotionImage} />
                            <View style={styles.promotionTextContainer}>
                                <Text style={styles.promotionTitle}>{item.tenKhuyenMai}</Text>
                                <Text style={styles.promotionSubtitle}>{item.moTa}</Text>
                            </View>
                        </View>
                    )}
                    style={{ width }} contentContainerStyle={{ paddingLeft: 20, paddingRight: 5 }}
                />
            ) : <View style={[styles.promotionCard, styles.skeleton]} />}
        </View>
    );


    const renderMustTryFood = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Món ngon phải thử</Text>
                <TouchableOpacity onPress={() => router.push('/ViewAll-MonAn-Sc')}><Text style={styles.seeMore}>Xem tất cả</Text></TouchableOpacity>
            </View>
            {mustTryFood.map((item) => (
                <TouchableOpacity
                    key={item.maSanPham}
                    style={styles.foodCard}
                    onPress={() => handleOpenDetails(item)}
                >
                    <Image source={{ uri: `${BASE_URL_IMG}/${item.danhSachAnh[0]?.urlAnh}` }} style={styles.foodImage} />
                    <View style={styles.foodInfo}>
                        <Text style={styles.foodName}>{item.tenSanPham}</Text>


                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.foodRating}>
                                {item.avgRating && item.avgRating > 0 ? item.avgRating : "Mới"}
                            </Text>
                            <Text style={styles.reviewCount}>
                                ({item.danhSachDanhGia?.length || 0})
                            </Text>
                        </View>

                        <Text style={styles.foodPrice}>{item.gia.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    <View style={styles.forwardIcon}><Ionicons name="chevron-forward" size={20} color={COLORS.primary} /></View>
                </TouchableOpacity>
            ))}
        </View>
    );


    const renderBranches = () => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Chi nhánh nhà hàng</Text>
            <FlatList
                horizontal showsHorizontalScrollIndicator={false}
                data={branches}
                keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
                renderItem={({ item }) => {
                    const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/4287/4287725.png";
                    let imageUri = DEFAULT_IMAGE;
                    if (item.img && item.img.trim() !== "") {
                        imageUri = item.img.startsWith('http') ? item.img : `${BASE_URL_IMG}/${item.img}`;
                    }
                    return (
                        <TouchableOpacity style={styles.branchCard}>
                            <Image source={{ uri: imageUri }} style={styles.branchImage} resizeMode="cover" />
                            <View style={styles.branchInfo}>
                                <Text style={styles.branchName}>{item.ten}</Text>
                                <Text style={styles.branchAddress}>{item.diaChi}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                contentContainerStyle={{ paddingLeft: 20, paddingTop: 10 }}
            />
        </View>
    );


    const renderBottomNavBar = () => (
        <View style={styles.bottomNavWrapper}>
            <View style={styles.bottomNavContainer}>
                <TouchableOpacity style={styles.navItem}><Ionicons name="home" size={24} color={COLORS.primary} /><Text style={[styles.navLabel, { color: COLORS.primary }]}>Trang chủ</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/DonHangScreen')}><Ionicons name="receipt-outline" size={24} color={COLORS.textSec} /><Text style={styles.navLabel}>Đơn hàng</Text></TouchableOpacity>
                <View style={{ width: 80 }} />
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/chat')}><Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.textSec} /><Text style={styles.navLabel}>Chat</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}><Ionicons name="person-outline" size={24} color={COLORS.textSec} /><Text style={styles.navLabel}>Tài khoản</Text></TouchableOpacity>
            </View>
            <View style={styles.centerActionContainer}>
                <TouchableOpacity style={styles.centerButton} onPress={() => router.push({

                    pathname: '/dat-ban',
                    params: {
                        maKhachHang: maKhachHang,
                    }
                })} activeOpacity={0.9}><MaterialCommunityIcons name="table-chair" size={28} color={COLORS.white} /></TouchableOpacity>
                <Text style={styles.centerBtnText}>Đặt trước bàn</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {renderCardKhuyenMai()}
                {renderMustTryFood()}
                {renderBranches()}
            </ScrollView>


            <Modal animationType="slide" transparent={true} visible={viewMon} onRequestClose={() => setViewMon(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => { setViewMon(false); setActiveIndex(0) }}>
                            <Text style={styles.closeModalText}>X</Text>
                        </TouchableOpacity>

                        {selectedMonToView && (
                            <>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ height: 250, width: width }}>
                                        <FlatList
                                            data={selectedMonToView.danhSachAnh}
                                            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                                            keyExtractor={(img, index) => index.toString()}
                                            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                                            onMomentumScrollEnd={(event) => {
                                                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                                                setActiveIndex(index);
                                            }}
                                            renderItem={({ item: img }) => (
                                                <Image
                                                    source={{ uri: `${BASE_URL_IMG}/${img.urlAnh}` }}
                                                    style={{
                                                        width: SCREEN_WIDTH,
                                                        height: 250,
                                                        borderTopLeftRadius: 25,
                                                        borderTopRightRadius: 25
                                                    }}
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
                                        {selectedMonToView.danhSachAnh?.length > 1 && (
                                            <View style={styles.imageBadge}>
                                                <Text style={styles.imageBadgeText}>{activeIndex + 1} / {selectedMonToView.danhSachAnh.length}</Text>
                                            </View>
                                        )}
                                    </View>


                                    <View style={styles.modalBody}>
                                        <View style={styles.modalHeaderTitleRow}>
                                            <Text style={styles.modalFoodName}>{selectedMonToView.tenSanPham}</Text>
                                            <Text style={styles.modalPrice}>{selectedMonToView.gia.toLocaleString('vi-VN')}đ</Text>
                                        </View>

                                        <View style={styles.modalRatingRow}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Ionicons key={star} name={star <= Math.round(selectedMonToView.avgRating || 0) ? "star" : "star-outline"} size={18} color="#FFB800" />
                                            ))}
                                            <Text style={styles.modalRatingText}>
                                                {selectedMonToView.avgRating || 0} / 5
                                            </Text>
                                        </View>

                                        <Text style={styles.modalCategory}>{selectedMonToView.danhMuc?.tenDanhMuc}</Text>
                                        <View style={styles.divider} />

                                        <Text style={styles.modalSectionTitle}>Mô tả món ăn</Text>
                                        <Text style={styles.modalDescription}>{selectedMonToView.moTa || "Chưa có mô tả."}</Text>

                                        <View style={styles.divider} />


                                        <ReviewFood reviews={selectedMonToView.danhSachDanhGia} />
                                    </View>
                                </ScrollView>

                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={styles.chatbotButton}
                onPress={() => router.push('/chatbot')}
            >
                <Ionicons name="chatbubbles-outline" size={32} color={COLORS.white} />
            </TouchableOpacity>

            {renderBottomNavBar()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
    headerSubText: { color: COLORS.textSec, fontSize: 13 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4, maxWidth: width * 0.6 },
    headerLocationText: { fontWeight: 'bold', fontSize: 16, color: COLORS.textMain, },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { marginLeft: 15, padding: 5 },
    notificationBadge: { position: 'absolute', right: -2, top: -2, backgroundColor: COLORS.red, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
    notificationText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    sectionContainer: { marginTop: 25 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 },
    sectionTitle: { fontSize: 19, fontWeight: 'bold', color: COLORS.textMain, paddingHorizontal: 20 },
    seeMore: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
    promotionCard: { width: width - 40, height: (width - 40) * 0.5, borderRadius: 15, overflow: 'hidden', marginRight: 15, backgroundColor: COLORS.lightGray },
    promotionImage: { width: '100%', height: '100%' },
    promotionTextContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'rgba(0,0,0,0.3)' },
    promotionTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
    promotionSubtitle: { color: COLORS.white, fontSize: 14, marginTop: 4 },
    foodCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 15, backgroundColor: COLORS.white, borderRadius: 16, padding: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    foodImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.lightGray },
    foodInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    foodName: { fontWeight: 'bold', fontSize: 16, color: COLORS.textMain, marginBottom: 5 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    foodRating: { color: COLORS.textMain, fontSize: 13, marginLeft: 5, fontWeight: 'bold' },
    reviewCount: { color: COLORS.textSec, fontSize: 12, marginLeft: 3 },
    foodPrice: { fontWeight: 'bold', color: COLORS.primary, fontSize: 16 },
    forwardIcon: { padding: 10 },
    branchCard: { width: 220, marginRight: 15, backgroundColor: COLORS.white, borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
    branchImage: { width: '100%', height: 120, backgroundColor: COLORS.lightGray },
    branchInfo: { padding: 12 },
    branchName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    branchAddress: { fontSize: 13, color: COLORS.textSec, marginTop: 4 },
    bottomNavWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
    bottomNavContainer: { flexDirection: 'row', height: 80, backgroundColor: COLORS.white, width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10, paddingBottom: 10 },
    navItem: { alignItems: 'center', height: '100%', justifyContent: 'center' },
    navLabel: { fontSize: 10, color: COLORS.textSec, marginTop: 4, fontWeight: '600' },
    centerActionContainer: { position: 'absolute', top: -30, alignItems: 'center', justifyContent: 'center', zIndex: 20, elevation: 30 },
    centerButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5, borderWidth: 4, borderColor: COLORS.white },
    centerBtnText: { marginTop: 4, fontSize: 10, color: COLORS.textMain, fontWeight: '700' },
    skeleton: { backgroundColor: COLORS.lightGray },


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
    modalAddBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 15, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, marginHorizontal: 20 },
    modalAddBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },


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
    chatbotButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
});

export default HomeScreen;