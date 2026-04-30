import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, Image, StyleSheet,
    TouchableOpacity, ActivityIndicator, Dimensions
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
};

interface ListImage { urlAnh: string; }
interface DanhMuc { tenDanhMuc: string; }
interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    gia: number;
    moTa: string;
    danhSachAnh: ListImage[];
    danhMuc?: DanhMuc;
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

const weatherBgColor: Record<string, string> = {
    hot: '#FF6B35',
    rainy: '#4A90D9',
    cold: '#5BA4CF',
    normal: '#52C41A',
};

const weatherBgGradient: Record<string, [string, string]> = {
    hot: ['#FF6B35', '#FF8C00'],
    rainy: ['#4A90D9', '#2C5F8A'],
    cold: ['#5BA4CF', '#3A7BD5'],
    normal: ['#52C41A', '#389E0D'],
};

export default function GoiYThoiTietScreen() {
    const router = useRouter();
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchGoiY();
    }, []);

    const fetchGoiY = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/san-pham/goi-y-thoi-tiet');
            setData(res.data);
        } catch (e) {
            setError('Không thể tải gợi ý. Vui lòng thử lại.');
        } finally {
            setLoading(false);
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

    const bgColor = weatherBgColor[data.weatherType] || COLORS.primary;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: bgColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gợi ý theo thời tiết</Text>
                <TouchableOpacity onPress={fetchGoiY} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Weather Card */}
            <View style={[styles.weatherCard, { backgroundColor: bgColor }]}>
                <View style={styles.weatherLeft}>
                    <Text style={styles.tempText}>{data.temperature}°C</Text>
                    <Text style={styles.weatherLabel}>{getWeatherLabel(data.weatherType)}</Text>
                    <Text style={styles.weatherDesc} numberOfLines={2}>
                        {data.weatherDescription}
                    </Text>
                </View>
                <View style={styles.weatherRight}>
                    <Ionicons
                        name={getWeatherIcon(data.weatherType) as any}
                        size={80}
                        color="rgba(255,255,255,0.9)"
                    />
                </View>
            </View>

            {/* Suggestion Banner */}
            <View style={styles.suggestionBanner}>
                <Text style={styles.suggestionText}>{data.suggestion}</Text>
            </View>

            {/* Food List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                <Text style={styles.sectionTitle}>
                    {data.total} món được gợi ý cho bạn
                </Text>

                {data.monGoiY.map((mon) => (
                    <View key={mon.maSanPham} style={styles.foodCard}>
                        <Image
                            source={{
                                uri: mon.danhSachAnh?.[0]?.urlAnh
                                    ? getImageUrl(mon.danhSachAnh[0].urlAnh)
                                    : 'https://via.placeholder.com/80'
                            }}
                            style={styles.foodImage}
                        />
                        <View style={styles.foodInfo}>
                            <Text style={styles.foodName} numberOfLines={1}>
                                {mon.tenSanPham}
                            </Text>
                            {mon.danhMuc && (
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{mon.danhMuc.tenDanhMuc}</Text>
                                </View>
                            )}
                            <Text style={styles.foodDesc} numberOfLines={2}>
                                {mon.moTa || 'Món ăn ngon, phù hợp với thời tiết hôm nay.'}
                            </Text>
                            <Text style={styles.foodPrice}>
                                {mon.gia.toLocaleString('vi-VN')}đ
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                    </View>
                ))}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 20 },
    loadingText: { marginTop: 15, color: COLORS.textSec, fontSize: 15 },
    errorText: { color: COLORS.textSec, fontSize: 15, textAlign: 'center', marginTop: 12 },
    retryBtn: { marginTop: 16, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 50, paddingBottom: 12, paddingHorizontal: 16,
    },
    backBtn: { padding: 4 },
    refreshBtn: { padding: 4 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    weatherCard: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 30,
    },
    weatherLeft: { flex: 1 },
    tempText: { fontSize: 52, fontWeight: 'bold', color: '#fff' },
    weatherLabel: { fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: 4 },
    weatherDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 18 },
    weatherRight: { marginLeft: 10 },

    suggestionBanner: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: -16,
        borderRadius: 14,
        padding: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    suggestionText: { fontSize: 14, color: COLORS.textMain, lineHeight: 20, textAlign: 'center' },

    listContainer: { padding: 16, paddingTop: 12 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12, marginTop: 8 },

    foodCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.white, borderRadius: 14, padding: 12,
        marginBottom: 12, elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    foodImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: COLORS.lightGray },
    foodInfo: { flex: 1, marginLeft: 12 },
    foodName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    categoryBadge: {
        alignSelf: 'flex-start', backgroundColor: '#FFF0E6',
        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4,
    },
    categoryText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
    foodDesc: { fontSize: 12, color: COLORS.textSec, lineHeight: 17, marginBottom: 6 },
    foodPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
});
