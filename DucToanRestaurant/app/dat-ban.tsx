import { ENDPOINTS } from '@/constants/api';
import axios from 'axios';
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


interface IBan {
  maBan: number;
  idRestaurant: number;
  tenBan: string;
  sucChua: number;
  trangThai: boolean;
}

const BookingScreen = () => {
  const [tables, setTables] = useState<IBan[]>([]);
  // Khai báo kiểu dữ liệu cho state để hết lỗi gạch đỏ 
  const [selectedTable, setSelectedTable] = useState<IBan | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Khai báo biến để sửa lỗi "Cannot find name" 
  const [refreshing, setRefreshing] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false); 
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();


  const [maNv, setMaNv] = useState<string>('');
  const [maKhachHang, setMaKhachHang] = useState<string>('');
  const [soLuongNguoi, setSoLuongNguoi] = useState<string>('');

  const handlePickTable = async () => {
    setErrorMessage('');

    if (!timeSelected) {
      setErrorMessage("Vui lòng chọn giờ đến nhà hàng!");
      return;
    }

    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 30 * 60000); // Thời điểm hiện tại + 30 phút
    // 2. So sánh thời gian
    if (date.getTime() < minBookingTime.getTime()) {
      setErrorMessage("Vui lòng đặt bàn trước ít nhất 30 phút");
      return;
    }

  // 3. Nếu hợp lệ, tiến hành gọi API đặt bàn
  try {

    console.log("=== GỬI TỪ MENU -> CART ===");
    console.log("tableId:", selectedTable?.maBan);
    console.log("tableName:", selectedTable?.tenBan);
    // console.log("maKhachHang:", maKhachHang);
    // console.log("booking time:", bookingTime);
    // console.log("manv:", maNv);
    // console.log("so luong nguoi:", soLuongNguoi);

      router.push({
      pathname: '/orderFood',
      params:{
        tableId: selectedTable?.maBan,
        tableName: selectedTable?.tenBan,
        bookingTime: date.toISOString(),
        maNv:maNv,
        maKhachHang:maKhachHang,
        soLuongNguoi:soLuongNguoi,
      }

    })
    
  } catch (error) {
    console.error("Lỗi chuyển màn hình:", error);
    setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
  }
  }

  // Hàm gọi API
  const fetchTables = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await axios.get(ENDPOINTS.BAN);
      // Đảm bảo dữ liệu từ API là một mảng
      setTables(response.data || []);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      Alert.alert("Lỗi", "Không thể lấy danh sách bàn");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Hàm xử lý khi kéo xuống để refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Với Android, khi nhấn Cancel event.type sẽ là 'set' hoặc 'dismissed'
    setShowPicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDate(selectedDate);
      setTimeSelected(true);
      setErrorMessage('');
    }
  };
  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };


  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate){
      setDate(selectedDate);
      setErrorMessage('');
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      <Text style={styles.header}>Sơ Đồ Đặt Bàn</Text>
      
      <View style={styles.grid}>
        {tables.map((table) => (
          <TouchableOpacity
    
            key={table.maBan ? `${table.idRestaurant}-${table.maBan}` : Math.random().toString()}
            disabled={table.trangThai}
            onPress={() => setSelectedTable(table)}
            style={[
              styles.tableCard,
              table.trangThai && styles.tableFull,
              selectedTable?.maBan === table.maBan && styles.tableSelected
            ]}
          >
            <Text style={[styles.tableName, table.trangThai && {color: '#ff4444'}]}>
              {table.tenBan}
            </Text>
            <Text style={styles.tableInfo}>Sức chứa: {table.sucChua} người</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTable && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Đặt bàn: {selectedTable.tenBan}</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: timeSelected ? '#000' : '#888' }}>
              {timeSelected ? `Giờ đến: ${formatTime(date)}` : "Chọn giờ đến"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.pickerText}>📅 Ngày đặt: {date.toLocaleDateString('vi-VN')}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} minimumDate={new Date()} />
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


          { errorMessage !== '' && (<Text style={styles.errorText}>{errorMessage}</Text>)}


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