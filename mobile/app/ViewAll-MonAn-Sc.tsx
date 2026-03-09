import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import api, { ENDPOINTS, BASE_URL_IMG } from '@/constants/api';

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

interface SanPham {
    maSanPham: number;
    tenSanPham: string;
    gia: number;
    danhSachAnh: { urlAnh: string }[];
    danhMuc: DanhMuc;
}

const ProductCard = ({ item }: { item: SanPham }) => {
    const imageUrl = item.danhSachAnh?.[0]?.urlAnh
        ? `${BASE_URL_IMG}/${item.danhSachAnh[0].urlAnh}`
        : 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.tenSanPham}</Text>
                <Text style={styles.cardCategory}>{item.danhMuc?.tenDanhMuc || 'Chưa phân loại'}</Text>
                <Text style={styles.cardPrice}>{item.gia.toLocaleString('vi-VN')}đ</Text>
            </View>
        </TouchableOpacity>
    );
};

const ViewAllMonAnScreen = () => {
    const router = useRouter();
    const [products, setProducts] = useState<SanPham[]>([]);
    const [categories, setCategories] = useState<DanhMuc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productRes, categoryRes] = await Promise.all([
                    api.get(ENDPOINTS.SAN_PHAM),
                    api.get(ENDPOINTS.DANH_MUC),
                ]);
                setProducts(productRes.data || []);
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

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tất cả món ăn</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textSec} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

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

            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard item={item} />}
                keyExtractor={(item) => item.maSanPham.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text>Không tìm thấy món ăn nào.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    listContainer: { paddingHorizontal: 10 },
    card: {
        flex: 1, margin: 5, backgroundColor: COLORS.white, borderRadius: 12,
        overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
    },
    cardImage: { width: '100%', height: 120 },
    cardContent: { padding: 10 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    cardCategory: { fontSize: 12, color: COLORS.textSec, marginBottom: 8 },
    cardPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, textAlign: 'right' },
});

export default ViewAllMonAnScreen;
