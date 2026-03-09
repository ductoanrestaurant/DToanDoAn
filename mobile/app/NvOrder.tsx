import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity, View
} from 'react-native';
import { router, Stack } from 'expo-router';
import api, { ENDPOINTS } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Debounce hook to delay API calls
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

interface Table {
    id: { maBan: number; idRestaurant: number; };
    tenBan: string;
    sucChua: number;
    trangThai: boolean;
}

interface EmployeeInfo {
    maNhanVien: string;
    tenNhanVien: string;
}

interface KhachHang {
    maTaiKhoan: number;
    idRestaurant: number;
    hoTen: string;
    sdt: string;
    email?: string;
    diachi?: string;
}

const NvOrderScreen = () => {
    const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
    const [formData, setFormData] = useState({
        hotenKhachHang: '',
        sdtKhachHang: '',
        soLuongNguoi: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [foundCustomer, setFoundCustomer] = useState<KhachHang | null>(null);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);

    const debouncedSdt = useDebounce(formData.sdtKhachHang, 500); // 500ms delay

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const storedEmployeeInfo = await AsyncStorage.getItem('employeeInfo');
            if (!storedEmployeeInfo) {
                Alert.alert("Yêu cầu đăng nhập", "Không tìm thấy thông tin nhân viên.");
                router.replace('/login');
                return;
            }
            setEmployeeInfo(JSON.parse(storedEmployeeInfo));

            const resBan = await api.get(ENDPOINTS.BAN);
            setAllTables(resBan.data || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu ban đầu:", error);
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const soLuong = parseInt(formData.soLuongNguoi, 10);
        if (!isNaN(soLuong) && soLuong > 0 && allTables.length > 0) {
            const validTables = allTables
                .filter(table => table.sucChua >= soLuong && !table.trangThai)
                .sort((a, b) => a.sucChua - b.sucChua);
            setFilteredTables(validTables);
        } else {
            setFilteredTables([]);
        }
    }, [formData.soLuongNguoi, allTables]);

    useEffect(() => {
        const checkPhoneNumber = async () => {
            if (debouncedSdt.length === 10) {
                setIsCheckingPhone(true);
                try {
                    const response = await api.get(`${ENDPOINTS.KHACH_HANG}/sdt/${debouncedSdt}`);
                    if (response.status === 200 && response.data) {
                        setFoundCustomer(response.data);
                        setFormData(prev => ({ ...prev, hotenKhachHang: response.data.hoTen }));
                        setIsNewCustomer(false);
                    }
                } catch (error: any) {
                    if (error.response && error.response.status === 404) {
                        setFoundCustomer(null);
                        setFormData(prev => ({ ...prev, hotenKhachHang: '' }));
                        setIsNewCustomer(true);
                    } else {
                        console.error("Lỗi khi kiểm tra SĐT:", error);
                    }
                } finally {
                    setIsCheckingPhone(false);
                }
            } else {
                setFoundCustomer(null);
                setIsNewCustomer(false);
                setFormData(prev => ({ ...prev, hotenKhachHang: '' }));
            }
        };
        checkPhoneNumber();
    }, [debouncedSdt]);

    const handleCreateNewCustomer = async (): Promise<number | null> => {
        const { sdtKhachHang, hotenKhachHang } = formData;
        if (!hotenKhachHang.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên cho khách hàng mới.");
            return null;
        }
        const newCustomerData = {
            hoTen: hotenKhachHang.trim(),
            sdt: sdtKhachHang.trim(),
        };
        try {
            const response = await api.post(ENDPOINTS.KHACH_HANG, newCustomerData);
            return response.data?.maTaiKhoan;
        } catch (error) {
            console.error("Lỗi khi tạo khách hàng mới:", error);
            Alert.alert("Lỗi", "Không thể tạo khách hàng mới. Có thể SĐT đã được sử dụng.");
            return null;
        }
    };

    const handleOrder = async () => {
        if (!employeeInfo) {
            Alert.alert("Lỗi", "Không xác định được nhân viên. Vui lòng đăng nhập lại.");
            return;
        }
        if (!selectedTable) {
            Alert.alert("Lỗi", "Vui lòng chọn một bàn.");
            return;
        }

        setIsSubmitting(true);

        try {
            let finalMaKhachHang: number | null = null;

            if (isNewCustomer) {
                finalMaKhachHang = await handleCreateNewCustomer();
            } else {
                finalMaKhachHang = foundCustomer ? foundCustomer.maTaiKhoan : null;
            }

            if (!finalMaKhachHang) {
                Alert.alert("Lỗi", "Không thể xác định thông tin khách hàng. Vui lòng kiểm tra lại SĐT và tên.");
                setIsSubmitting(false);
                return;
            }

            router.push({
                pathname: '/orderFood',
                params: {
                    tableId: String(selectedTable.id.maBan),
                    tableName: selectedTable.tenBan,
                    bookingTime: new Date().toISOString(),
                    soLuongNguoi: formData.soLuongNguoi,
                    maKhachHang: String(finalMaKhachHang),
                    verifyUser: 'nhanvien',
                }
            });
        } catch (error) {
            console.error("Lỗi khi xử lý đơn hàng:", error);
            Alert.alert("Lỗi", "Đã có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isButtonDisabled = !selectedTable || !formData.hotenKhachHang || isSubmitting || isCheckingPhone;

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Thông Tin Đặt Bàn</Text>
                        <View style={styles.titleUnderline} />
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nhân viên thực hiện</Text>
                            <TextInput style={[styles.input, styles.inputDisabled]} value={employeeInfo?.tenNhanVien || ''} editable={false} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số người</Text>
                            <TextInput
                                style={[styles.input, styles.inputHighlight]}
                                placeholder='VD: 5'
                                keyboardType="numeric"
                                value={formData.soLuongNguoi}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, soLuongNguoi: text });
                                    setSelectedTable(null);
                                }}
                            />
                        </View>

                        {filteredTables.length > 0 && (
                            <View style={styles.tableSection}>
                                <Text style={styles.labelBadge}>Chọn bàn trống ({filteredTables.length})</Text>
                                <View style={styles.grid}>
                                    {filteredTables.map((table) => (
                                        <TouchableOpacity
                                            key={`${table.id.idRestaurant}-${table.id.maBan}`}
                                            style={[styles.tableCard, selectedTable?.id.maBan === table.id.maBan && styles.tableCardSelected]}
                                            onPress={() => setSelectedTable(table)}
                                        >
                                            <Text style={[styles.tableName, selectedTable?.id.maBan === table.id.maBan && styles.textWhite]}>{table.tenBan}</Text>
                                            <Text style={[styles.tableSub, selectedTable?.id.maBan === table.id.maBan && styles.textWhite]}>{table.sucChua} chỗ</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại khách hàng</Text>
                            <View>
                                <TextInput
                                    style={[styles.input, isNewCustomer && styles.inputWarning]}
                                    placeholder='090x...'
                                    keyboardType="phone-pad"
                                    value={formData.sdtKhachHang}
                                    maxLength={10}
                                    onChangeText={(text) => setFormData({ ...formData, sdtKhachHang: text })}
                                />
                                {isCheckingPhone && <ActivityIndicator style={styles.inputIcon} />}
                            </View>
                            {isNewCustomer && <Text style={styles.warningTextSmall}>* SĐT mới. Vui lòng nhập tên khách hàng bên dưới.</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tên khách hàng</Text>
                            <TextInput
                                style={[styles.input, !isNewCustomer && foundCustomer && styles.inputDisabled]}
                                placeholder={isNewCustomer ? 'Nhập tên khách hàng mới' : 'Tên sẽ tự động điền'}
                                value={formData.hotenKhachHang}
                                onChangeText={(text) => setFormData({ ...formData, hotenKhachHang: text })}
                                editable={isNewCustomer || !debouncedSdt}
                            />
                        </View>

                        <TouchableOpacity style={[styles.button, isButtonDisabled && styles.buttonDisabled]} onPress={handleOrder} disabled={isButtonDisabled}>
                            {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Xác Nhận & Chọn Món</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F4F7' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 16, paddingBottom: 50, alignItems: 'center' },
    headerSection: { marginVertical: 15, alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
    titleUnderline: { width: 40, height: 4, backgroundColor: '#007AFF', borderRadius: 2, marginTop: 4 },
    formContainer: { width: '100%',backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 6, textTransform: 'uppercase' },
    input: { height: 50, backgroundColor: '#F8F9FA', borderRadius: 14, paddingHorizontal: 16, fontSize: 16, color: '#222', borderWidth: 1.5, borderColor: '#E9ECEF' },
    inputDisabled: { backgroundColor: '#E9ECEF', color: '#6c757d' },
    inputHighlight: { borderColor: '#007AFF', backgroundColor: '#F0F7FF' },
    inputWarning: { borderColor: '#FFA500', backgroundColor: '#FFFBF0' },
    warningTextSmall: { color: "#E67E22", fontSize: 12, marginTop: 5, fontStyle: 'italic', fontWeight: '500' },
    inputIcon: { position: 'absolute', right: 15, top: 15 },
    tableSection: { marginTop: 10, marginBottom: 16 },
    labelBadge: { fontSize: 12, fontWeight: '800', color: '#007AFF', backgroundColor: '#E1EFFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
    tableCard: { width: '30%', paddingVertical: 18, backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center', borderWidth: 2, borderColor: '#F1F3F5' },
    tableCardSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    tableName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
    tableSub: { fontSize: 12, color: '#888' },
    textWhite: { color: '#FFF' },
    button: { backgroundColor: '#007AFF', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    buttonDisabled: { backgroundColor: '#B0C4DE' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default NvOrderScreen;
