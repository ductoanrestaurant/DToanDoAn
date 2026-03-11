import api, { ENDPOINTS } from '@/constants/api';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface IBan {
    id: {
        maBan: number;
        idRestaurant: number;
    };
    tenBan: string;
    sucChua: number;
    trangThai: boolean;
}

interface CustomerInfo {
    maKhachHang: string;
    tenKhachHang: string;
}

const BookingScreen = () => {
    const [tables, setTables] = useState<IBan[]>([]);
    const [selectedTable, setSelectedTable] = useState<IBan | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [timeSelected, setTimeSelected] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [idRestaurant, setIdRestaurant] = useState<number | null>(null);


    useEffect(() => {
        const checkUser = async () => {
            const storedCustomerInfo = await AsyncStorage.getItem('customerInfo');
            if (storedCustomerInfo) {
                const parsed = JSON.parse(storedCustomerInfo);
                setCustomerInfo(parsed);

                // Lấy thêm thông tin nhà hàng của khách hàng từ backend
                try {
                    const res = await api.get(`${ENDPOINTS.KHACH_HANG}/${parsed.maKhachHang}`);
                    if (res.data && typeof res.data.idRestaurant === 'number') {
                        setIdRestaurant(res.data.idRestaurant);
                    }
                } catch (e) {
                    console.error('Không thể lấy thông tin nhà hàng của khách hàng:', e);
                }
            } else {
                Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để thực hiện chức năng này.");
                router.replace('/login');
            }
        };
        checkUser();
    }, []);

    const handlePickTable = async () => {
        setErrorMessage('');

        if (!customerInfo) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.");
            return;
        }

        if (!selectedTable) {
            setErrorMessage("Vui lòng chọn bàn!");
            return;
        }

        if (!timeSelected) {
            setErrorMessage("Vui lòng chọn giờ đến nhà hàng!");
            return;
        }

        if (!idRestaurant) {
            setErrorMessage("Không tìm thấy thông tin nhà hàng. Vui lòng thử lại sau.");
            return;
        }

        const now = new Date();
        const minBookingTime = new Date(now.getTime() + 30 * 60000);

        if (date.getTime() < minBookingTime.getTime()) {
            setErrorMessage("Vui lòng đặt bàn trước ít nhất 30 phút");
            return;
        }


        try {
            router.push({
                pathname: '/orderFood',
                params: {
                    tableId: String(selectedTable.id.maBan),
                    tableName: selectedTable?.tenBan,
                    bookingTime: date.toISOString(),
                    maKhachHang: customerInfo.maKhachHang,
                    verifyUser: 'khach',
                }

            })

        } catch (error) {
            console.error("Lỗi chuyển màn hình:", error);
            setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
        }
    }
    // Chuyển Date sang chuỗi ISO theo giờ địa phương (không phải UTC)
    const toLocalISOString = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const fetchAvailableTables = useCallback(async (isRefreshing = false) => {
        if (!idRestaurant) {
            return;
        }
        try {
            if (!isRefreshing) setLoading(true);
            const bookingISO = toLocalISOString(date);
            const response = await api.get(`${ENDPOINTS.BAN}/available`, {
                params: {
                    idRestaurant,
                    gioSuDung: bookingISO,
                },
            });
            setTables(response.data || []);
            if ((response.data || []).length === 0) {
                setErrorMessage('Không có bàn trống trong khoảng thời gian này, vui lòng chọn thời gian khác.');
            } else {
                setErrorMessage('');
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
            Alert.alert("Lỗi", "Không thể lấy danh sách bàn hợp lệ");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [idRestaurant, date]); // ← bỏ `refreshing` ra khỏi deps

    const onRefresh = useCallback(() => {
        if (!timeSelected || !idRestaurant) {
            setRefreshing(false);
            return;
        }
        setRefreshing(true);
        fetchAvailableTables(true); // truyền flag isRefreshing=true
    }, [fetchAvailableTables, timeSelected, idRestaurant]);

    const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {

        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
            setTimeSelected(true);
            setSelectedTable(null);
            setErrorMessage('');
            // Sau khi chọn thời gian đầy đủ (giờ), nếu đã có idRestaurant thì load bàn hợp lệ
            if (idRestaurant) {
                fetchAvailableTables();
            }
        }
    };
    const formatTime = (date: Date) => {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };


    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setSelectedTable(null);
            setErrorMessage('');
            // Chỉ khi đã có giờ được chọn trước đó thì mới tự động gọi API
            if (timeSelected && idRestaurant) {
                fetchAvailableTables();
            }
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#FF6B35"
                    colors={['#FF6B35']}
                />
            }
        >
            {/* ── HEADER ── */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.greeting}>🍽️ Đặt bàn</Text>
                    <Text style={styles.subGreeting}>Chọn thời gian & bàn phù hợp với bạn</Text>
                </View>
            </View>

            {/* ── CHỌN THỜI GIAN ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 Thời gian sử dụng</Text>

                <View style={styles.timeRow}>
                    <TouchableOpacity style={styles.timePill} onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                        <Text style={styles.timePillLabel}>Ngày</Text>
                        <Text style={styles.timePillValue}>{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.timePill, timeSelected && styles.timePillActive]}
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.timePillLabel, timeSelected && styles.timePillLabelActive]}>Giờ đến</Text>
                        <Text style={[styles.timePillValue, timeSelected && styles.timePillValueActive]}>
                            {timeSelected ? formatTime(date) : '-- : --'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {!timeSelected && (
                    <View style={styles.hintBox}>
                        <Text style={styles.hintText}>👆 Chọn giờ để xem danh sách bàn </Text>
                    </View>
                )}

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        minimumDate={new Date()}
                    />
                )}

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                    />
                )}
            </View>

            {/* ── THÔNG BÁO LỖI ── */}
            {errorMessage !== '' && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
                </View>
            )}

            {/* ── DANH SÁCH BÀN ── */}
            {timeSelected && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🏠 Sơ đồ bàn trống</Text>
                        {tables.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{tables.length} bàn</Text>
                            </View>
                        )}
                    </View>

                    {loading ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#FF6B35" />
                            <Text style={styles.loadingText}>Đang tải danh sách bàn...</Text>
                        </View>
                    ) : tables.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyIcon}>😔</Text>
                            <Text style={styles.emptyText}>Không có bàn trống</Text>
                            <Text style={styles.emptySubText}>Vui lòng chọn thời gian khác</Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {tables.map((table) => {
                                const isSelected = selectedTable?.id.maBan === table.id.maBan;
                                return (
                                    <TouchableOpacity
                                        key={`${table.id.idRestaurant}-${table.id.maBan}`}
                                        onPress={() => setSelectedTable(isSelected ? null : table)}
                                        style={[styles.tableCard, isSelected && styles.tableCardSelected]}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.tableIconWrap, isSelected && styles.tableIconWrapSelected]}>
                                            <Text style={styles.tableIcon}>🍽️</Text>
                                        </View>
                                        <Text style={[styles.tableName, isSelected && styles.tableNameSelected]}>
                                            {table.tenBan}
                                        </Text>
                                        <Text style={[styles.tableInfo, isSelected && styles.tableInfoSelected]}>
                                            {table.sucChua} người
                                        </Text>
                                        {isSelected && (
                                            <View style={styles.checkBadge}>
                                                <Text style={styles.checkBadgeText}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            )}



            {/* ── XÁC NHẬN ── */}
            {selectedTable && (
                <View style={styles.confirmBox}>
                    <View style={styles.confirmInfo}>
                        <Text style={styles.confirmTitle}>{selectedTable.tenBan}</Text>
                        <Text style={styles.confirmSub}>
                            {formatTime(date)} · {date.toLocaleDateString('vi-VN')}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.btnConfirm} onPress={handlePickTable} activeOpacity={0.85}>
                        <Text style={styles.btnText}>Xác nhận →</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F4F0' },

    // Header
    header: {
        backgroundColor: '#FF6B35',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 8,
    },
    headerTop: {},
    greeting: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
    subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },

    // Section
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 14,
        borderRadius: 18,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },

    badge: { backgroundColor: '#FFF0EB', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    badgeText: { color: '#FF6B35', fontWeight: '700', fontSize: 13 },

    // Time pills
    timeRow: { flexDirection: 'row', gap: 10 },
    timePill: {
        flex: 1,
        backgroundColor: '#F7F4F0',
        borderRadius: 14,
        padding: 14,
        borderWidth: 2,
        borderColor: '#F0ECE8',
    },
    timePillActive: { backgroundColor: '#FFF0EB', borderColor: '#FF6B35' },
    timePillLabel: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    timePillLabelActive: { color: '#FF6B35' },
    timePillValue: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
    timePillValueActive: { color: '#FF6B35' },

    hintBox: { marginTop: 12, backgroundColor: '#FFF8F5', borderRadius: 10, padding: 10 },
    hintText: { textAlign: 'center', color: '#FF6B35', fontSize: 13 },

    // Error
    errorBox: {
        marginHorizontal: 16, marginTop: 10,
        backgroundColor: '#FFF1F0', borderRadius: 12, padding: 12,
        borderLeftWidth: 4, borderLeftColor: '#FF4D4F',
    },
    errorText: { color: '#CF1322', fontSize: 13, fontWeight: '600' },

    // Table grid
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    tableCard: {
        width: '30%',
        backgroundColor: '#F7F4F0',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    tableCardSelected: { backgroundColor: '#FFF0EB', borderColor: '#FF6B35' },
    tableIconWrap: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#ECDDD6', justifyContent: 'center', alignItems: 'center', marginBottom: 6,
    },
    tableIconWrapSelected: { backgroundColor: '#FF6B35' },
    tableIcon: { fontSize: 20 },
    tableName: { fontSize: 13, fontWeight: '700', color: '#333', textAlign: 'center' },
    tableNameSelected: { color: '#FF6B35' },
    tableInfo: { fontSize: 11, color: '#999', marginTop: 2 },
    tableInfoSelected: { color: '#FF9265' },
    checkBadge: {
        position: 'absolute', top: 6, right: 6,
        width: 18, height: 18, borderRadius: 9,
        backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center',
    },
    checkBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },

    // Loading / Empty
    loadingBox: { alignItems: 'center', paddingVertical: 30 },
    loadingText: { marginTop: 10, color: '#999', fontSize: 14 },
    emptyBox: { alignItems: 'center', paddingVertical: 30 },
    emptyIcon: { fontSize: 40, marginBottom: 8 },
    emptyText: { fontSize: 16, fontWeight: '700', color: '#333' },
    emptySubText: { fontSize: 13, color: '#999', marginTop: 4 },

    // Number picker
    inputRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    numBtn: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: '#F7F4F0', justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: 'transparent',
    },
    numBtnActive: { backgroundColor: '#FFF0EB', borderColor: '#FF6B35' },
    numBtnText: { fontSize: 16, fontWeight: '700', color: '#555' },
    numBtnTextActive: { color: '#FF6B35' },

    // Confirm bottom bar
    confirmBox: {
        marginHorizontal: 16, marginTop: 14,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
    },
    confirmInfo: { flex: 1 },
    confirmTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
    confirmSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
    btnConfirm: {
        backgroundColor: '#FF6B35',
        paddingVertical: 12, paddingHorizontal: 20,
        borderRadius: 14,
    },
    btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default BookingScreen;
