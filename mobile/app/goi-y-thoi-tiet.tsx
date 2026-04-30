import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, Image, StyleSheet,
    TouchableOpacity, ActivityIndicator, Dimensions,
    Modal, FlatList, ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api, { getImageUrl, ENDPOINTS } from '@/constants/api';

const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#FF6600',
    background: '#F7F8FC',
    white: '#FFFFFF',
    textMain: '#333333',
    textSec: '#888888',
    lightGray: '#E8E8E8',
    red: '#E74C3C',
};

// ── Types ────────────────────────────────────────────────────
interface ListImage { urlAnh: string; }
interface DanhMuc { tenDanhMuc: string; }

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
    gia: number;
    moTa: string;
    danhSachAnh: ListImage[];
    danhMuc?: DanhMuc;
    danhSachDanhGia?: DanhGia[];
    avgRating?: number;
}

interface WeatherResponse {
    weatherDescription: string;
    weatherType: string;
    suggestion: string;
    icon: string;
    temperature: number;
    monGoiY: SanPham[];
    total: number;
}

// ── Ảnh nền theo từng loại thời tiết ─────────────────────────
const weatherBgImage: Record<string, any> = {
    hot: { uri: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80' },  // nắng gắt
    rainy: { uri: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?w=800&q=80' },  // mưa
    cold: { uri: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&q=80' },  // lạnh/tuyết
    normal: { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },  // mây nhẹ, dễ chịu
};

// Màu overlay tint theo thời tiết (làm tối ảnh để chữ dễ đọc)
const weatherOverlayColor: Record<string, string> = {
    hot: 'rgba(200, 80, 0, 0.45)',
    rainy: 'rgba(30, 60, 120, 0.50)',
    cold: 'rgba(40, 80, 130, 0.45)',
    normal: 'rgba(30, 100, 40, 0.40)',
};

// ── Helper ───────────────────────────────────────────────────
const getRating = (reviews?: DanhGia[]): number => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.soSao, 0);
    return Number((sum / reviews.length).toFixed(1));
};

// ── ReviewFood ────────────────────────────────────────────────
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
            {reviews.map((review, i) => (
                <View key={i} style={styles.reviewItem}>
                    <View style={styles.reviewUserRow}>
                        <Text style={{ fontWeight: 'bold' }}>{review.khachHang?.hoTen || 'Khách hàng'}</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map(s => (
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

// ── Main Screen ───────────────────────────────────────────────
export default function GoiYThoiTietScreen() {
    const router = useRouter();
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedMon, setSelectedMon] = useState<SanPham | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => { fetchGoiY(); }, []);

    const fetchGoiY = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/san-pham/goi-y-thoi-tiet');
            setData(res.data);
        } catch {
            setError('Không thể tải gợi ý. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = async (mon: SanPham) => {
        setSelectedMon(mon);
        setActiveImgIndex(0);
        setShowModal(true);
        setLoadingDetail(true);
        try {
            const allReviews: DanhGia[] = (await api.get(ENDPOINTS.DANH_GIA)).data;
            const reviews = allReviews.filter(r => r.id.maSanPham === mon.maSanPham);
            const avgRating = getRating(reviews);
            setSelectedMon({ ...mon, danhSachDanhGia: reviews, avgRating });
        } catch {
            // Hiện modal không có reviews vẫn được
        } finally {
            setLoadingDetail(false);
        }
    };

    const getWeatherIcon = (type: string) => {
        switch (type) {
            case 'hot': return 'sunny';
            case 'rainy': return 'rainy';
            case 'cold': return 'partly-sunny';
            default: return 'partly-sunny';
        }
    };

    const getWeatherLabel = (type: string) => {
        switch (type) {
            case 'hot': return 'Trời nóng';
            case 'rainy': return 'Trời mưa';
            case 'cold': return 'Trời lạnh';
            default: return 'Dễ chịu';
        }
    };

    // ── Loading / Error states ─────────────────────────────────
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Đang lấy thông tin thời tiết...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.centered}>
                <Ionicons name="cloud-offline-outline" size={60} color={COLORS.textSec} />
                <Text style={styles.errorText}>{error || 'Không có dữ liệu'}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchGoiY}>
                    <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const bgImage = weatherBgImage[data.weatherType] || weatherBgImage.normal;
    const overlayColor = weatherOverlayColor[data.weatherType] || weatherOverlayColor.normal;

    return (
        <View style={styles.container}>
            {/* ── Header + Weather Card dùng chung ImageBackground ── */}
            <ImageBackground
                source={bgImage}
                style={styles.weatherBgWrapper}
                imageStyle={styles.weatherBgImage}
                resizeMode="cover"
            >
                {/* Overlay tint */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gợi ý theo thời tiết</Text>
                    <TouchableOpacity onPress={fetchGoiY} style={styles.refreshBtn}>
                        <Ionicons name="refresh" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Weather Card */}
                <View style={styles.weatherCard}>
                    <View style={styles.weatherLeft}>
                        <Text style={styles.tempText}>{data.temperature}°C</Text>
                        <Text style={styles.weatherLabel}>{getWeatherLabel(data.weatherType)}</Text>
                        <Text style={styles.weatherDesc} numberOfLines={2}>{data.weatherDescription}</Text>
                    </View>
                    <Ionicons name={getWeatherIcon(data.weatherType) as any} size={80} color="rgba(255,255,255,0.9)" />
                </View>
            </ImageBackground>

            {/* ── Suggestion Banner ─────────────────────────── */}
            <View style={styles.suggestionBanner}>
                <Text style={styles.suggestionText}>{data.suggestion}</Text>
            </View>

            {/* ── Food List ─────────────────────────────────── */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                <Text style={styles.sectionTitle}>{data.total} món được gợi ý cho bạn</Text>

                {data.monGoiY.map((mon) => (
                    <TouchableOpacity
                        key={mon.maSanPham}
                        style={styles.foodCard}
                        onPress={() => handleOpenDetail(mon)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri: mon.danhSachAnh?.[0]?.urlAnh ? getImageUrl(mon.danhSachAnh[0].urlAnh) : 'https://via.placeholder.com/80' }}
                            style={styles.foodImage}
                        />
                        <View style={styles.foodInfo}>
                            <Text style={styles.foodName} numberOfLines={1}>{mon.tenSanPham}</Text>
                            {mon.danhMuc && (
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{mon.danhMuc.tenDanhMuc}</Text>
                                </View>
                            )}
                            <Text style={styles.foodDesc} numberOfLines={2}>
                                {mon.moTa || 'Món ăn ngon, phù hợp với thời tiết hôm nay.'}
                            </Text>
                            <Text style={styles.foodPrice}>{mon.gia.toLocaleString('vi-VN')}đ</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                ))}

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* ── Modal chi tiết ─────────────────────────────── */}
            <Modal animationType="slide" transparent visible={showModal} onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => { setShowModal(false); setSelectedMon(null); }}>
                            <Text style={styles.closeModalText}>X</Text>
                        </TouchableOpacity>

                        {selectedMon && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ height: 250, width }}>
                                    <FlatList
                                        data={selectedMon.danhSachAnh?.length > 0 ? selectedMon.danhSachAnh : [{ urlAnh: '' }]}
                                        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                                        keyExtractor={(_, i) => i.toString()}
                                        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                                        onMomentumScrollEnd={(e) => setActiveImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                                        renderItem={({ item: img }) => (
                                            <Image
                                                source={{ uri: img.urlAnh ? getImageUrl(img.urlAnh) : 'https://via.placeholder.com/400x250' }}
                                                style={{ width, height: 250, borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
                                                resizeMode="cover"
                                            />
                                        )}
                                        ListEmptyComponent={
                                            <Image source={{ uri: 'https://via.placeholder.com/400x250' }} style={styles.modalImage} />
                                        }
                                    />
                                    {selectedMon.danhSachAnh?.length > 1 && (
                                        <View style={styles.imageBadge}>
                                            <Text style={styles.imageBadgeText}>{activeImgIndex + 1} / {selectedMon.danhSachAnh.length}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.modalBody}>
                                    <View style={styles.modalHeaderTitleRow}>
                                        <Text style={styles.modalFoodName}>{selectedMon.tenSanPham}</Text>
                                        <Text style={styles.modalPrice}>{selectedMon.gia.toLocaleString('vi-VN')}đ</Text>
                                    </View>

                                    <View style={styles.modalRatingRow}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Ionicons
                                                key={star}
                                                name={star <= Math.round(selectedMon.avgRating || 0) ? 'star' : 'star-outline'}
                                                size={18} color="#FFB800"
                                            />
                                        ))}
                                        <Text style={styles.modalRatingText}>{selectedMon.avgRating || 0} / 5</Text>
                                    </View>

                                    {selectedMon.danhMuc && (
                                        <Text style={styles.modalCategory}>{selectedMon.danhMuc.tenDanhMuc}</Text>
                                    )}

                                    <View style={styles.divider} />

                                    <Text style={styles.modalSectionTitle}>Mô tả món ăn</Text>
                                    <Text style={styles.modalDescription}>{selectedMon.moTa || 'Chưa có mô tả.'}</Text>

                                    <View style={styles.divider} />

                                    {loadingDetail ? (
                                        <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 12 }} />
                                    ) : (
                                        <ReviewFood reviews={selectedMon.danhSachDanhGia} />
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 20 },
    loadingText: { marginTop: 15, color: COLORS.textSec, fontSize: 15 },
    errorText: { color: COLORS.textSec, fontSize: 15, textAlign: 'center', marginTop: 12 },
    retryBtn: { marginTop: 16, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    // ── Weather background wrapper ────────────────────────────
    weatherBgWrapper: {
        width: '100%',
        paddingBottom: 30,
        overflow: 'hidden',
    },
    weatherBgImage: {
        // bo góc dưới nếu muốn
    },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12, paddingHorizontal: 16 },
    backBtn: { padding: 4 },
    refreshBtn: { padding: 4 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    weatherCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
    weatherLeft: { flex: 1 },
    tempText: { fontSize: 52, fontWeight: 'bold', color: '#fff' },
    weatherLabel: { fontSize: 18, color: 'rgba(255,255,255,0.95)', fontWeight: '600', marginBottom: 4 },
    weatherDesc: { fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 18 },

    suggestionBanner: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: -16, borderRadius: 14, padding: 14, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
    suggestionText: { fontSize: 14, color: COLORS.textMain, lineHeight: 20, textAlign: 'center' },

    listContainer: { padding: 16, paddingTop: 12 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12, marginTop: 8 },

    foodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, padding: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    foodImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: COLORS.lightGray },
    foodInfo: { flex: 1, marginLeft: 12 },
    foodName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4 },
    categoryText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
    foodDesc: { fontSize: 12, color: COLORS.textSec, lineHeight: 17, marginBottom: 6 },
    foodPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },

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