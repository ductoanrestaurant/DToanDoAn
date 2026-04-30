import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { ENDPOINTS } from '@/constants/api';

const COLORS = {
    primary: '#FF6600',
    white: '#FFFFFF',
    background: '#F7F8FC',
    textMain: '#333333',
    textSec: '#888888',
    lightGray: '#E8E8E8',
    green: '#2ECC71',
    red: '#E74C3C',
    blue: '#3498DB',
    yellow: '#F1C40F',
    purple: '#9B59B6',
};

interface ChiTietYeuCauDon {
    id: {
        maDonHang: number;
        idRestaurant: number;
        maSanPham: number;
    };
    soLuong: number;
    gia: number;
    trangThai: string | null;
}

interface YeuCauDon {
    id: {
        maDonHang: number;
        idRestaurant: number;
    };
    trangThaiThanhToan: string;
    ngayTaoDon: string;
    tongTien: number | null;
    chiTietYeuCauDons: ChiTietYeuCauDon[];
}

interface RequestCardProps {
    request: YeuCauDon;
}


const getOrderStatus = (chiTiet: ChiTietYeuCauDon[]): string => {
    if (!chiTiet || chiTiet.length === 0) {
        return 'Chờ xác nhận';
    }

    const itemStatuses = chiTiet.map(item => (item.trangThai || '').trim().toLowerCase());

    if (itemStatuses.every(s => s === 'đã hủy' || s === 'từ chối')) {
        return 'Đã hủy';
    }
    if (itemStatuses.length > 0 && itemStatuses.every(s => s === 'hoàn thành' || s === 'đã hủy') && itemStatuses.some(s => s === 'hoàn thành')) {
        return 'Đã hoàn thành';
    }
    if (itemStatuses.every(s => ['đã chế biến', 'hoàn thành', 'đã hủy'].includes(s)) && itemStatuses.some(s => s === 'đã chế biến')) {
        return 'Đã chế biến';
    }
    if (itemStatuses.some(s => s === 'đã checkin') && itemStatuses.every(s => ['hoàn thành', 'đã checkin', 'đã hủy'].includes(s))) {
        return 'Đã checkin';
    }
    if (itemStatuses.some(s => s === 'đang chế biến')) {
        return 'Đang chế biến';
    }
    if (itemStatuses.some(s => s === 'đã chế biến')) {
        return 'Đã chế biến';
    }
    if (itemStatuses.every(s => s === 'chờ xác nhận')) {
        return 'Chờ xác nhận';
    }

    return 'Đang xử lý';
};

const StatusBadge: React.FC<{ text: string }> = ({ text }) => {
    const getStatusStyle = (status: string) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'đã thanh toán':
            case 'đã hoàn thành':
            case 'hoàn thành':
                return { backgroundColor: COLORS.green, color: COLORS.white };
            case 'chưa thanh toán':
                return { backgroundColor: COLORS.yellow, color: COLORS.textMain };
            case 'đã hủy':
            case 'từ chối':
                return { backgroundColor: COLORS.red, color: COLORS.white };
            case 'chờ xác nhận':
                return { backgroundColor: COLORS.yellow, color: COLORS.white };
            case 'đã checkin':
                return { backgroundColor: COLORS.blue, color: COLORS.white };
            case 'đã chế biến':
                return { backgroundColor: '#0d9488', color: COLORS.white };
            case 'đang chế biến':
            case 'đang xử lý':
                return { backgroundColor: COLORS.primary, color: COLORS.white };
            default:
                return { backgroundColor: COLORS.lightGray, color: COLORS.textMain };
        }
    };

    const style = getStatusStyle(text);

    return (
        <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
            <Text style={[styles.statusText, { color: style.color }]}>{text}</Text>
        </View>
    );
};

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
    const formattedDate = new Date(request.ngayTaoDon).toLocaleDateString('vi-VN');
    const orderStatus = getOrderStatus(request.chiTietYeuCauDons);
    const isCompleted = orderStatus === 'Đã hoàn thành';
    const total = request.tongTien ?? request.chiTietYeuCauDons.reduce((sum, item) => sum + item.gia * item.soLuong, 0);

    const router = useRouter();

    const handleNavigate = () => {
        router.push({
            pathname: '/chitiet-donhang',
            params: {
                maDonHang: request.id.maDonHang,
                idRestaurant: request.id.idRestaurant
            }
        });
    };

    const handleDanhGia = () => {
        router.push({
            pathname: '/DanhGia-Sc',
            params: {
                maDonHang: request.id.maDonHang.toString(),
                idRestaurant: request.id.idRestaurant.toString(),
            },
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handleNavigate} activeOpacity={0.85}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Yêu cầu #{request.id.maDonHang}</Text>
                {isCompleted && (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={COLORS.green} />
                        <Text style={styles.completedBadgeText}>Hoàn thành</Text>
                    </View>
                )}
            </View>
            <View style={styles.cardBody}>
                <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Đơn hàng:</Text>
                    <StatusBadge text={orderStatus} />
                </View>
                <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Thanh toán:</Text>
                    <StatusBadge text={request.trangThaiThanhToan} />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.textSec} />
                    <Text style={styles.itemText}>Ngày tạo: {formattedDate}</Text>
                </View>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.totalAmount}>Tổng tiền: {total.toLocaleString('vi-VN')}đ</Text>
                <View style={styles.cardActions}>
                    {isCompleted && (
                        <TouchableOpacity
                            style={styles.reviewButton}
                            onPress={(e) => { e.stopPropagation(); handleDanhGia(); }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="star" size={14} color={COLORS.white} />
                            <Text style={styles.reviewButtonText}>Đánh giá</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.reorderButton} onPress={handleNavigate}>
                        <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.reorderText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const DonHangScreen = () => {
    const [activeTab, setActiveTab] = useState('ongoing');
    const [allRequests, setAllRequests] = useState<YeuCauDon[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<YeuCauDon[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const fetchRequests = async () => {
                try {
                    setLoading(true);
                    const customerInfoStr = await AsyncStorage.getItem('customerInfo');
                    if (!customerInfoStr) {
                        Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để xem đơn hàng.");
                        router.replace('/login');
                        return;
                    }

                    const customerInfo = JSON.parse(customerInfoStr);
                    const maKhachHang = customerInfo.maKhachHang;

                    if (maKhachHang) {
                        const response = await api.get(`${ENDPOINTS.YEU_CAU_DON}/khach-hang/${maKhachHang}`);
                        const data: YeuCauDon[] = response.data;
                        setAllRequests(data.sort((a, b) => new Date(b.ngayTaoDon).getTime() - new Date(a.ngayTaoDon).getTime()));
                    }
                } catch (error) {
                    console.error("Failed to fetch requests:", error);
                    Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng.");
                } finally {
                    setLoading(false);
                }
            };

            fetchRequests().catch(console.error);
        }, [])
    );

    useEffect(() => {
        const HISTORY_STATUSES = ['đã hoàn thành', 'đã hủy'];

        const filterLogic = (req: YeuCauDon) => {
            const itemStatus = getOrderStatus(req.chiTietYeuCauDons).toLowerCase();

            const isHistory = HISTORY_STATUSES.includes(itemStatus);

            if (activeTab === 'history') {
                return isHistory;
            } else { // activeTab === 'ongoing'
                return !isHistory;
            }
        };

        setFilteredRequests(allRequests.filter(filterLogic));
    }, [activeTab, allRequests]);


    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={60} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>
                {activeTab === 'ongoing'
                    ? "Bạn không có đơn hàng nào đang diễn ra."
                    : "Bạn chưa có đơn hàng nào trong lịch sử."}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yêu cầu của tôi</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
                    onPress={() => setActiveTab('ongoing')}
                >
                    <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
                        Đang diễn ra
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                        Lịch sử
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredRequests}
                    renderItem={({ item }) => <RequestCard request={item} />}
                    keyExtractor={(item) => `${item.id.maDonHang}-${item.id.idRestaurant}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        margin: 20,
        borderRadius: 10,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: { backgroundColor: COLORS.primary },
    tabText: { color: COLORS.textSec, fontWeight: '600' },
    activeTabText: { color: COLORS.white },
    listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingBottom: 10,
        marginBottom: 10,
    },
    orderId: { fontWeight: 'bold', fontSize: 16, color: COLORS.textMain },
    cardBody: {
        paddingVertical: 5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    statusLabel: {
        fontSize: 14,
        color: COLORS.textSec,
        fontWeight: '500',
    },
    statusBadge: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        minWidth: 100,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    itemText: {
        color: COLORS.textSec,
        fontSize: 14,
        marginLeft: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingTop: 10,
        marginTop: 5,
    },
    totalAmount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textMain,
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0E6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    reorderText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    reviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    reviewButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 13,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    completedBadgeText: {
        fontSize: 12,
        color: COLORS.green,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: COLORS.textSec,
        textAlign: 'center',
    },
});

export default DonHangScreen;