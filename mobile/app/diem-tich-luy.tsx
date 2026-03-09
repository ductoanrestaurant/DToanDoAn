import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { ENDPOINTS } from '@/constants/api';

const COLORS = {
    primary: '#FF6600',
    primaryLight: '#FFF0E6',
    white: '#FFFFFF',
    background: '#F8F9FA',
    textMain: '#1A1A1A',
    textSec: '#7A7A7A',
    lightGray: '#F0F0F0',
    gold: '#FFD700',
    blueSubtle: '#EBF2FF',
};

const DiemTichLuyScreen = () => {
    const [points, setPoints] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const exchangeRate = 1; // 1 điểm = 1.000 VNĐ

    const fetchPoints = useCallback(async () => {
        try {
            const customerInfoStr = await AsyncStorage.getItem('customerInfo');
            if (!customerInfoStr) {
                setError("Vui lòng đăng nhập để kiểm tra điểm thưởng.");
                return;
            }

            const customerInfo = JSON.parse(customerInfoStr);
            const maKhachHang = customerInfo.maKhachHang;

            if (maKhachHang) {
                const response = await api.get(`${ENDPOINTS.KHACH_HANG}/${maKhachHang}/diem`);
                setPoints(response.data.diemTichLuy);
                setError(null);
            }
        } catch (err) {
            setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchPoints();
        }, [fetchPoints])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPoints();
    }, [fetchPoints]);

    const renderContent = () => {
        if (loading && !refreshing) {
            return <ActivityIndicator size="large" color={COLORS.primary} style={styles.centered} />;
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Ionicons name="cloud-offline-outline" size={80} color={COLORS.lightGray} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                        <Text style={styles.retryText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        const currentPoints = points || 0;
        const cashValue = currentPoints * exchangeRate;

        return (
            <View style={styles.mainContent}>
                {/* Thẻ Điểm Chính */}
                <View style={styles.mainPointsCard}>
                    <View style={styles.badgeContainer}>
                        <View style={styles.starCircle}>
                            <Ionicons name="star" size={30} color={COLORS.white} />
                        </View>
                    </View>

                    <Text style={styles.mainPointsLabel}>Tổng điểm khả dụng</Text>
                    <Text style={styles.mainPointsValue}>
                        {currentPoints.toLocaleString('vi-VN')}
                    </Text>

                    {/*<View style={styles.tagContainer}>*/}
                    {/*    <View style={styles.tag}>*/}
                    {/*        <Text style={styles.tagText}>Khách hàng thân thiết</Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}

                    <View style={styles.dashedLine} />

                    <View style={styles.valueRow}>
                        <Ionicons name="gift-outline" size={18} color={COLORS.textSec} />
                        <Text style={styles.valueNote}>
                            Dùng điểm này để thanh toán cho đơn hàng tiếp theo
                        </Text>
                    </View>
                </View>

                {/* Thẻ Quy Đổi */}
                <View style={styles.infoBox}>
                    <View style={styles.infoIconBox}>
                        <Ionicons name="wallet" size={24} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoLabel}>Quy đổi sang tiền mặt</Text>
                        <Text style={styles.infoCashValue}>
                            ≈ {cashValue.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.lightGray} />
                </View>

                {/* Thông tin chính sách */}
                <View style={styles.policyCard}>
                    <View style={styles.policyHeader}>
                        <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                        <Text style={styles.policyTitle}>Chính sách hoàn tiền</Text>
                    </View>
                    <Text style={styles.policyDescription}>
                        Mọi khoản hoàn tiền của bạn sẽ được tự động quy đổi thành điểm tích lũy. Hệ thống ưu tiên sử dụng điểm để bạn tiết kiệm chi phí cho những lần đặt món sau tại <Text style={{fontWeight: 'bold'}}>DucToan Restaurant</Text>.
                    </Text>
                </View>

                {/*/!* Nút hành động *!/*/}
                {/*<TouchableOpacity*/}
                {/*    style={styles.primaryButton}*/}
                {/*    onPress={() => router.push('/')}*/}
                {/*>*/}
                {/*    <Text style={styles.primaryButtonText}>Sử dụng ngay</Text>*/}
                {/*    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Điểm Tích Lũy</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="help-circle-outline" size={24} color={COLORS.textSec} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    mainContent: {
        padding: 20,
    },
    centered: {
        marginTop: 100,
    },
    mainPointsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 20,
    },
    starCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: COLORS.primaryLight,
    },
    badgeContainer: {
        marginBottom: 16,
    },
    mainPointsLabel: {
        fontSize: 14,
        color: COLORS.textSec,
        fontWeight: '500',
    },
    mainPointsValue: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.textMain,
        marginVertical: 8,
    },
    tagContainer: {
        marginBottom: 20,
    },
    tag: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    tagText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    dashedLine: {
        width: '100%',
        height: 1,
        borderRadius: 1,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    valueNote: {
        fontSize: 13,
        color: COLORS.textSec,
        marginLeft: 8,
        textAlign: 'center',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
    },
    infoIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textSec,
        fontWeight: '500',
    },
    infoCashValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    policyCard: {
        backgroundColor: '#E8F0FE', // Một màu xanh dương nhẹ dịu mắt
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    policyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    policyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textMain,
        marginLeft: 8,
    },
    policyDescription: {
        fontSize: 13,
        color: '#444',
        lineHeight: 20,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
    errorContainer: {
        alignItems: 'center',
        paddingTop: 60,
    },
    errorText: {
        fontSize: 15,
        color: COLORS.textSec,
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    retryText: {
        color: COLORS.textMain,
        fontWeight: '600',
    }
});

export default DiemTichLuyScreen;