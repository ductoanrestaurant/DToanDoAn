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
    const [soLuongNguoi, setSoLuongNguoi] = useState<string>('');

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
                params:{
                    tableId: String(selectedTable.id.maBan),
                    tableName: selectedTable?.tenBan,
                    bookingTime: date.toISOString(),
                    maKhachHang: customerInfo.maKhachHang,
                    soLuongNguoi:soLuongNguoi,
                    verifyUser: 'khach',
                }

            })

        } catch (error) {
            console.error("Lỗi chuyển màn hình:", error);
            setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
        }
    }
    const fetchAvailableTables = useCallback(async () => {
        if (!idRestaurant) {
            return;
        }
        try {
            if (!refreshing) setLoading(true);
            const bookingISO = date.toISOString();
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
    }, [idRestaurant, date, refreshing]);

    const onRefresh = useCallback(() => {
        if (!timeSelected || !idRestaurant) {
            setRefreshing(false);
            return;
        }
        setRefreshing(true);
        fetchAvailableTables();
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
        if (selectedDate){
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
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >

            <Text style={styles.header}>Đặt bàn</Text>

            <View style={styles.form}>
                <Text style={styles.formTitle}>Chọn thời gian sử dụng</Text>

                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={{ color: '#000' }}>
                        📅 Ngày dùng: {date.toLocaleDateString('vi-VN')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
                    <Text style={{ color: timeSelected ? '#000' : '#888' }}>
                        {timeSelected ? `⏰ Giờ đến: ${formatTime(date)}` : 'Chọn giờ đến'}
                    </Text>
                </TouchableOpacity>

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

                {errorMessage !== '' && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}
            </View>

            <Text style={[styles.header, { marginTop: 10 }]}>Sơ Đồ Bàn Trống</Text>

            <View style={styles.grid}>
                {tables.map((table) => (
                    <TouchableOpacity

                        key={table.id.maBan ? `${table.id.idRestaurant}-${table.id.maBan}` : Math.random().toString()}
                        disabled={!timeSelected}
                        onPress={() => setSelectedTable(table)}
                        style={[
                            styles.tableCard,
                            selectedTable?.id.maBan === table.id.maBan && styles.tableSelected
                        ]}
                    >
                        <Text style={styles.tableName}>
                            {table.tenBan}
                        </Text>
                        <Text style={styles.tableInfo}>Sức chứa: {table.sucChua} người</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedTable && (
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Đặt bàn: {selectedTable.tenBan}</Text>

                    <TouchableOpacity style={styles.btnConfirm} onPress={handlePickTable}>
                        <Text style={styles.btnText}>XÁC NHẬN ĐẶT BÀN</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    pickerText: { fontSize: 16, color: '#333' },
    tableCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    errorText:{
        color: "#FF3333",
        fontWeight: "bold",
        marginTop: -15,
        marginBottom: 10
    },
    pickerBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center'
    },
    tableFull: { backgroundColor: '#ffebee', borderColor: '#ffcdd2' },
    tableSelected: { borderColor: '#2196F3', borderWidth: 2, backgroundColor: '#e3f2fd' },
    tableName: { fontSize: 16, fontWeight: 'bold' },
    tableInfo: { fontSize: 13, color: '#666' },
    form: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 10, marginBottom: 40 },
    formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 10 },
    btnConfirm: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold' }
});

export default BookingScreen;