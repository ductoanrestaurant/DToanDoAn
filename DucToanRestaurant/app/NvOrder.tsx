import { ENDPOINTS } from '@/constants/api';
import axios from 'axios';
import {router, Stack} from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {numberAsInset} from "react-native-gesture-handler/src/components/Pressable/utils";
import {log} from "@expo/fingerprint/cli/build/utils/log";



interface Table {
    id: {
        maBan: number;
        idRestaurant: number;
    };
    tenBan: string;
    sucChua: number;
    trangThai: boolean;
}


interface Employee {
    id: {
        maNhanVien: number;
        idRestaurant: number;
    };
    tenNhanVien: string;
}


interface KhachHang {
    maTaiKhoan: number;
    idRestaurant: number;
    hoTen: string;
    sdt: string;
    email?: string; // Dấu ? nghĩa là trường này không bắt buộc
    diachi?: string;
    diemTichLuy?: number;
    trangThai?: boolean;
}

// const [verifyUser, setVerifyUser] = useState('');

const NvOrderScreen = () => {
    const [formData, setFormData] = useState({
        hotenNv: '',
        hotenKhachHang: '',
        sdtKhachHang: '',
        soLuongNguoi: '',
        tenBan: '',
    });

    const [loading, setLoading] = useState(true);
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [NvList, setNvList] = useState<Employee[]>([]);
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);
    const [errorTenNv, setErrorTenNv] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [tables, setTables] = useState<Table[]>([]);
    const [date, setDate] = useState(new Date());

    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    const [KHList, setKHList] = useState<KhachHang[]>([]);

    const [selectedMaNv, setSelectedMaNv] = useState<number | null>(null);

    const [selectedSoLuongNguoi, setSelectedSoLuongNguoi] = useState<number | null>(null);

    const [isNewSdt, setIsNewSdt] = useState(false);


    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [resBan, resNv, resKH] = await Promise.all([
                axios.get(ENDPOINTS.BAN),
                axios.get(ENDPOINTS.NHAN_VIEN),
                axios.get(ENDPOINTS.KHACH_HANG),
            ]);

            if (resBan.data) setAllTables(resBan.data);
            if (resNv.data) setNvList(resNv.data);
            if(resKH.data) setKHList(resKH.data);


        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request bị hủy:', error.message);
            } else {
                console.error("Lỗi khi tải dữ liệu:", error);
                Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const inputTenNv = formData.hotenNv.trim();
        const inputLower = inputTenNv.toLowerCase();

        const inputSdt = formData.sdtKhachHang.trim();



        if (inputSdt.length === 10) {
            const foundKhachHang = KHList.find(kh => kh.sdt === inputSdt);

            console.log(foundKhachHang?.hoTen);

            if (foundKhachHang) {

                setFormData(prev => ({
                    ...prev,
                    hotenKhachHang: foundKhachHang.hoTen
                }));
                setIsNewSdt(false);
            } else {

                setFormData(prev => ({ ...prev, hotenKhachHang: '' }));
                setIsNewSdt(true);
            }
        } else {

            setIsNewSdt(false);
            setFormData(prev => ({ ...prev, hotenKhachHang: '' }));
        }



        if (inputTenNv === '') {
            setErrorTenNv('Tên nhân viên không được để trống');
            setSelectedMaNv(null);
        } else {
            const foundNv = NvList.find(nv =>
                nv.tenNhanVien && nv.tenNhanVien.toLowerCase() === inputLower
            );

            if (foundNv) {
                setErrorTenNv('');
                setSelectedMaNv(foundNv.id.maNhanVien);
            } else {
                setErrorTenNv('Nhân viên không tồn tại trong hệ thống');
                setSelectedMaNv(null);
            }
        }


        const soLuong = parseInt(formData.soLuongNguoi, 10) ;
        if (!isNaN(soLuong) && soLuong > 0 && allTables.length > 0) {
            const validTables = allTables.filter(table =>
                Number(table.sucChua) >= soLuong && table.trangThai === false
            ).sort((a, b) => a.sucChua - b.sucChua); // Sắp xếp tăng dần theo sức chứa);
            setFilteredTables(validTables);
        } else {
            setFilteredTables([]);
        }
    }, [formData.soLuongNguoi, allTables, formData.hotenNv, NvList, formData.sdtKhachHang, KHList]);

    const filteredNvSuggestions = NvList.filter((nv) => {
        const query = formData.hotenNv.trim().toLowerCase();
        if (!query || formData.hotenNv === nv.tenNhanVien) return false;
        const nameToCompare = nv.tenNhanVien ? nv.tenNhanVien.toLowerCase() : '';
        return nameToCompare.includes(query);
    }).slice(0, 5);

    const handleOrder = async () => {

        const foundNv = NvList.find(nv =>
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

        const soLuong = parseInt(formData.soLuongNguoi, 10) || 0;
        let finalMaKhachHang = '';

    try {
        setLoading(true);

        if(isNewSdt){

            const autoEmail = `guest_${formData.sdtKhachHang.trim()}@restaurant.com`;
            const newKH ={
                hoTen: formData.hotenKhachHang.trim(),
                sdt: formData.sdtKhachHang.trim(),
                matKhau: null,
                email:autoEmail,
                avatar:null,
                diachi:null,
                numberLog:null,
            };

            const response = await axios.post(ENDPOINTS.KHACH_HANG, newKH);


            if (response.data && response.data.maTaiKhoan) {
                finalMaKhachHang = String(response.data.maTaiKhoan);
            }
        } else {

            const foundKhachHang = KHList.find(kh => kh.sdt === formData.sdtKhachHang.trim());
            if (foundKhachHang) {
                finalMaKhachHang = String(foundKhachHang.maTaiKhoan);
            }
        }


        if (finalMaKhachHang) {

            console.log("ma khach hang: ", finalMaKhachHang);

            router.push({
                pathname: '/orderFood',
                params: {
                    tableId: String(selectedTable.id.maBan),
                    tableName: selectedTable.tenBan,
                    bookingTime: date.toISOString(),
                    maNv: String(foundNv.id.maNhanVien),
                    soLuongNguoi: soLuong,
                    maKhachHang: finalMaKhachHang,
                    verifyUser: 'nhanvien',
                }
            });
        } else {
            Alert.alert("Lỗi", "Không thể xác định mã tài khoản khách hàng.");
        }

    } catch (error) {
            console.log(error);
    } finally {
            setLoading(false);
    }



        console.log("Table ID:", selectedTable.id.maBan);

    console.log("Dữ liệu đơn hàng:", formData, selectedMaNv );
    try {

        const foundKhachHang = KHList.find(kh => kh.sdt === formData.sdtKhachHang.trim());
        const foundNv = NvList.find(nv => nv.tenNhanVien === formData.hotenNv);

        router.push({
            pathname: '/orderFood',
            params:{
                tableId: selectedTable ? String(selectedTable.id.maBan) : '',
                tableName: selectedTable ? selectedTable.tenBan : '',
                bookingTime: date.toISOString(),
                maNv: foundNv ? String(foundNv.id.maNhanVien) : '',
                soLuongNguoi: String(soLuong),

                maKhachHang: finalMaKhachHang,
                verifyUser:'nhanvien',
            }

        })
        console.log("Dữ liệu đơn hàng:", formData, selectedMaNv, );
        console.log("makh: ", foundKhachHang?.maTaiKhoan);
        console.log("Mã Nhân Viên 12345:", foundNv? String(foundNv.id.maNhanVien):'');

    } catch (error) {
        console.error("Lỗi chuyển màn hình:", error);
        Alert.alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Thông Tin Đặt Bàn</Text>
                        <View style={styles.titleUnderline} />
                    </View>

                    <View style={styles.formContainer}>
                        <View style={[styles.inputGroup, { zIndex: 1000 }]}>
                            <Text style={styles.label}>Nhân viên thực hiện</Text>
                            <View>
                                <TextInput
                                    style={[styles.input, errorTenNv !== '' && formData.hotenNv !== '' && styles.inputError]}
                                    placeholder='Nhập tên nhân viên...'
                                    placeholderTextColor="#999"
                                    value={formData.hotenNv}
                                    onChangeText={(text) => {
                                        setFormData({...formData, hotenNv: text});
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />

                                {showSuggestions && filteredNvSuggestions.length > 0 && (
                                    <View style={styles.suggestionContainer}>
                                        {filteredNvSuggestions.map((nv) => (
                                            <TouchableOpacity
                                                key={`nv-${nv.id.maNhanVien}-${nv.id.idRestaurant}`}
                                                style={styles.suggestionItem}
                                                onPress={() => {
                                                    setFormData({ ...formData, hotenNv: nv.tenNhanVien });
                                                    setErrorTenNv('');
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <Text style={styles.suggestionText}>{nv.tenNhanVien}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            {errorTenNv !== '' && formData.hotenNv !== '' && (
                                <Text style={styles.errorTextSmall}>{errorTenNv}</Text>
                            )}
                        </View>


                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Số người</Text>
                            <TextInput
                                style={[styles.input, styles.inputHighlight]}
                                placeholder='VD: 5'
                                keyboardType="numeric"
                                value={formData.soLuongNguoi}
                                onChangeText={(text) => setFormData({...formData, soLuongNguoi: text})}
                            />
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
                        ) : (
                            filteredTables.length > 0 && (
                                <View style={styles.tableSection}>
                                    <Text style={styles.labelBadge}>
                                        Chọn bàn trống ({filteredTables.length})
                                    </Text>
                                    <View style={styles.grid}>
                                        {filteredTables.map((table) => (
                                            <TouchableOpacity
                                                key={`${table.id.idRestaurant}-${table.id.maBan}`}
                                                style={[
                                                    styles.tableCard,
                                                    formData.tenBan === table.tenBan && styles.tableCardSelected
                                                ]}
                                                onPress={() =>{
                                                    setFormData({...formData, tenBan: table.tenBan });
                                                    setSelectedTable(table);
                                                }}
                                            >
                                                <Text style={[styles.tableName, formData.tenBan === table.tenBan && styles.textWhite]}>
                                                    {table.tenBan}
                                                </Text>
                                                <Text style={[styles.tableSub, formData.tenBan === table.tenBan && styles.textWhite]}>
                                                    {table.sucChua} chỗ
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )
                        )}

                        <View style={[styles.inputGroup, { flex: 1.5, marginRight: 10 }]}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <TextInput
                                style={[styles.input, isNewSdt && styles.inputWarning]}
                                placeholder='090x...'
                                keyboardType="phone-pad"
                                value={formData.sdtKhachHang}
                                maxLength={10}
                                onChangeText={(text) => setFormData({...formData, sdtKhachHang: text})}
                            />
                            {isNewSdt && (
                                <Text style={styles.warningTextSmall}>
                                    * Số điện thoại này chưa được đăng ký thành viên
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tên khách hàng</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Tên khách hàng'
                                value={formData.hotenKhachHang}
                                onChangeText={(text) => setFormData({...formData, hotenKhachHang: text})}
                            />
                        </View>


                        <TouchableOpacity
                            style={[
                                styles.button,
                                (!formData.tenBan || errorTenNv !== '' || !formData.hotenKhachHang) && styles.buttonDisabled
                            ]}
                            onPress={handleOrder}
                            disabled={!formData.tenBan || errorTenNv !== '' || !formData.hotenKhachHang}
                        >
                            <Text style={styles.buttonText}>Xác Nhận Order</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F4F7' },
    scrollContent: { padding: 16 },
    headerSection: { marginVertical: 15, alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
    titleUnderline: { width: 40, height: 4, backgroundColor: '#007AFF', borderRadius: 2, marginTop: 4 },
    formContainer: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15 },
    inputGroup: { marginBottom: 16 },
    row: { flexDirection: 'row' },
    label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 6, textTransform: 'uppercase' },
    input: { height: 50, backgroundColor: '#F8F9FA', borderRadius: 14, paddingHorizontal: 16, fontSize: 16, color: '#222', borderWidth: 1.5, borderColor: '#E9ECEF' },
    inputHighlight: { borderColor: '#007AFF', backgroundColor: '#F0F7FF' },
    inputError: { borderColor: '#FF3333', backgroundColor: '#FFF5F5' },
    errorTextSmall: { color: "#FF3333", fontSize: 11, marginTop: 4, fontWeight: '600' },
    suggestionContainer: {
        position: 'absolute', top: 55, left: 0, right: 0,
        backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#007AFF',
        zIndex: 1000, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    },
    suggestionItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    suggestionText: { fontSize: 15, color: '#333' },
    tableSection: { marginTop: 10 },
    labelBadge: { fontSize: 12, fontWeight: '800', color: '#007AFF', backgroundColor: '#E1EFFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    tableCard: { width: '48%', paddingVertical: 18, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, alignItems: 'center', borderWidth: 2, borderColor: '#F1F3F5' },
    tableCardSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    tableName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
    tableSub: { fontSize: 12, color: '#888' },
    textWhite: { color: '#FFF' },
    button: { backgroundColor: '#007AFF', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    buttonDisabled: { backgroundColor: '#D1D1D1' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    inputWarning: {
        borderColor: '#FFA500',
    },
    warningTextSmall: {
        color: "#FFA500",
        fontSize: 11,
        marginTop: 4,
        fontStyle: 'italic',
        fontWeight: '500'
    },
});

export default NvOrderScreen;