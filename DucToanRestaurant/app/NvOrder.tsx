import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity, View
} from 'react-native';
import { router, Stack } from 'expo-router';
import api, { ENDPOINTS } from '@/constants/api'; // Use the authenticated api instance

// --- INTERFACES ---
interface Table {
    id: { maBan: number; idRestaurant: number; };
    tenBan: string;
    sucChua: number;
    trangThai: boolean;
}

interface Employee {
    id: { maNhanVien: number; idRestaurant: number; };
    tenNhanVien: string;
}

interface KhachHang {
    maTaiKhoan: number;
    idRestaurant: number;
    hoTen: string;
    sdt: string;
    email?: string;
    diachi?: string;
    diemTichLuy?: number;
    trangThai?: boolean;
}

// --- MAIN COMPONENT ---
const NvOrderScreen = () => {
    const [formData, setFormData] = useState({
        hotenNv: '',
        hotenKhachHang: '',
        sdtKhachHang: '',
        soLuongNguoi: '',
        tenBan: '',
    });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [nvList, setNvList] = useState<Employee[]>([]);
    const [khList, setKHList] = useState<KhachHang[]>([]);
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);
    const [errorTenNv, setErrorTenNv] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isNewSdt, setIsNewSdt] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [resBan, resNv, resKH] = await Promise.all([
                api.get(ENDPOINTS.BAN),
                api.get(ENDPOINTS.NHAN_VIEN),
                api.get(ENDPOINTS.KHACH_HANG),
            ]);
            setAllTables(resBan.data || []);
            setNvList(resNv.data || []);
            setKHList(resKH.data || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Effect for filtering tables based on number of people
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

    // Effect for validating employee name
    useEffect(() => {
        const inputTenNv = formData.hotenNv.trim().toLowerCase();
        if (inputTenNv === '') {
            setErrorTenNv('Tên nhân viên không được để trống');
        } else {
            const foundNv = nvList.find(nv => nv.tenNhanVien?.toLowerCase() === inputTenNv);
            setErrorTenNv(foundNv ? '' : 'Nhân viên không tồn tại');
        }
    }, [formData.hotenNv, nvList]);

    // Effect for handling customer phone number changes
    useEffect(() => {
        const inputSdt = formData.sdtKhachHang.trim();
        if (inputSdt.length === 10) {
            const foundKhachHang = khList.find(kh => kh.sdt === inputSdt);
            if (foundKhachHang) {
                setFormData(prev => ({ ...prev, hotenKhachHang: foundKhachHang.hoTen }));
                setIsNewSdt(false);
            } else {
                setFormData(prev => ({ ...prev, hotenKhachHang: '' }));
                setIsNewSdt(true);
            }
        } else {
            setIsNewSdt(false);
        }
    }, [formData.sdtKhachHang, khList]);

    const handleCreateNewCustomer = async () => {
        const { sdtKhachHang, hotenKhachHang } = formData;
        const autoEmail = `guest_${sdtKhachHang.trim()}@restaurant.com`;
        const newKH = { hoTen: hotenKhachHang.trim(), sdt: sdtKhachHang.trim(), email: autoEmail };
        try {
            const response = await api.post(ENDPOINTS.KHACH_HANG, newKH);
            return response.data?.maTaiKhoan;
        } catch (error) {
            console.error("Lỗi khi tạo khách hàng mới:", error);
            Alert.alert("Lỗi", "Không thể tạo khách hàng mới.");
            return null;
        }
    };

    const handleOrder = async () => {

        const foundNv = nvList.find(nv =>
            nv.tenNhanVien?.trim().toLowerCase() === formData.hotenNv?.trim().toLowerCase()
        );







        // const foundKhachHang = KHList.find(kh =>
        //     kh.sdt === formData.sdtKhachHang.trim()
        // );






        if (!selectedTable) {
            Alert.alert("Lỗi", "Vui lòng chọn lại bàn.");
            return;
        }
        if (!foundNv) {
            Alert.alert("Lỗi", "Không xác định được nhân viên. Vui lòng chọn từ danh sách gợi ý.");
            return;
        }
        setIsSubmitting(true);

        try {
            const foundNv = nvList.find(nv => nv.tenNhanVien?.toLowerCase() === formData.hotenNv.trim().toLowerCase());
            if (!foundNv) {
                Alert.alert("Lỗi", "Nhân viên không hợp lệ.");
                return;
            }

            let finalMaKhachHang: string | null = null;
            if (isNewSdt) {
                finalMaKhachHang = await handleCreateNewCustomer();
            } else {
                const foundKhachHang = khList.find(kh => kh.sdt === formData.sdtKhachHang.trim());
                finalMaKhachHang = foundKhachHang ? String(foundKhachHang.maTaiKhoan) : null;
            }

            if (!finalMaKhachHang) {
                Alert.alert("Lỗi", "Không thể xác định thông tin khách hàng.");
                return;
            }

            router.push({
                pathname: '/orderFood',
                params: {
                    tableId: String(selectedTable.id.maBan),
                    tableName: selectedTable.tenBan,
                    bookingTime: new Date().toISOString(),
                    maNv: String(foundNv.id.maNhanVien),
                    soLuongNguoi: formData.soLuongNguoi,
                    maKhachHang: finalMaKhachHang,
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

    const filteredNvSuggestions = nvList.filter(nv => {
        const query = formData.hotenNv.trim().toLowerCase();
        return query && nv.tenNhanVien && nv.tenNhanVien.toLowerCase().includes(query) && nv.tenNhanVien.toLowerCase() !== query;
    }).slice(0, 5);

    const isButtonDisabled = !selectedTable || !!errorTenNv || !formData.hotenKhachHang || isSubmitting;

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
                        {/* Employee Input */}
                        <View style={[styles.inputGroup, { zIndex: 10 }]}>
                            <Text style={styles.label}>Nhân viên thực hiện</Text>
                            <TextInput
                                style={[styles.input, errorTenNv && styles.inputError]}
                                placeholder='Nhập tên nhân viên...'
                                value={formData.hotenNv}
                                onChangeText={(text) => setFormData({ ...formData, hotenNv: text })}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setShowSuggestions(false)}
                            />
                            {showSuggestions && filteredNvSuggestions.length > 0 && (
                                <View style={styles.suggestionContainer}>
                                    {filteredNvSuggestions.map((nv) => (
                                        <TouchableOpacity
                                            key={`${nv.id.maNhanVien}-${nv.id.idRestaurant}`}
                                            style={styles.suggestionItem}
                                            onPress={() => {
                                                setFormData({ ...formData, hotenNv: nv.tenNhanVien });
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <Text style={styles.suggestionText}>{nv.tenNhanVien}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            {errorTenNv && <Text style={styles.errorTextSmall}>{errorTenNv}</Text>}
                        </View>

                        {/* Number of People */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số người</Text>
                            <TextInput
                                style={[styles.input, styles.inputHighlight]}
                                placeholder='VD: 5'
                                keyboardType="numeric"
                                value={formData.soLuongNguoi}
                                onChangeText={(text) => setFormData({ ...formData, soLuongNguoi: text })}
                            />
                        </View>

                        {/* Table Selection */}
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

                        {/* Customer Info */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <TextInput
                                style={[styles.input, isNewSdt && styles.inputWarning]}
                                placeholder='090x...'
                                keyboardType="phone-pad"
                                value={formData.sdtKhachHang}
                                maxLength={10}
                                onChangeText={(text) => setFormData({ ...formData, sdtKhachHang: text })}
                            />
                            {isNewSdt && <Text style={styles.warningTextSmall}>* SĐT này sẽ được dùng để tạo khách hàng mới</Text>}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tên khách hàng</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Nhập tên khách hàng'
                                value={formData.hotenKhachHang}
                                onChangeText={(text) => setFormData({ ...formData, hotenKhachHang: text })}
                                editable={isNewSdt || !formData.sdtKhachHang}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={[styles.button, isButtonDisabled && styles.buttonDisabled]} onPress={handleOrder} disabled={isButtonDisabled}>
                            {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Xác Nhận Order</Text>}
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
    inputHighlight: { borderColor: '#007AFF', backgroundColor: '#F0F7FF' },
    inputError: { borderColor: '#FF3333', backgroundColor: '#FFF5F5' },
    inputWarning: { borderColor: '#FFA500', backgroundColor: '#FFFBF0' },
    errorTextSmall: { color: "#FF3333", fontSize: 12, marginTop: 5, fontWeight: '600' },
    warningTextSmall: { color: "#FFA500", fontSize: 12, marginTop: 5, fontStyle: 'italic', fontWeight: '500' },
    suggestionContainer: {
        position: 'absolute', top: 55, left: 0, right: 0,
        backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
        zIndex: 10, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    },
    suggestionItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    suggestionText: { fontSize: 15, color: '#333' },
    tableSection: { marginTop: 10, marginBottom: 16 },
    labelBadge: { fontSize: 12, fontWeight: '800', color: '#007AFF', backgroundColor: '#E1EFFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Căn các bàn ra giữa
        gap: 12, // Tạo khoảng cách đều giữa các bàn (ngang và dọc)
        // Bỏ margin âm cũ đi để tránh lỗi layout
    },
    tableCard: {
        width: '30%', // Chia 3 cột (30% * 3 = 90%, còn 10% cho gap)
        // Bỏ margin ở đây vì đã dùng gap
        paddingVertical: 18,
        backgroundColor: '#FFF',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F1F3F5'
    },
    tableCardSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    tableName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
    tableSub: { fontSize: 12, color: '#888' },
    textWhite: { color: '#FFF' },
    button: { backgroundColor: '#007AFF', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    buttonDisabled: { backgroundColor: '#B0C4DE' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default NvOrderScreen;