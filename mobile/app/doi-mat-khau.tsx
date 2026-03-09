import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
    red: '#E74C3C',
};

// Reusable Password Input Component
const PasswordInput = ({ label, value, onChangeText, secureTextEntry, onToggleVisibility }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry: boolean;
    onToggleVisibility: () => void;
}) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={onToggleVisibility} style={styles.eyeIcon}>
                <Ionicons name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} size={24} color={COLORS.textSec} />
            </TouchableOpacity>
        </View>
    </View>
);

const DoiMatKhauScreen = () => {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOld, setShowOld] = useState(true);
    const [showNew, setShowNew] = useState(true);
    const [showConfirm, setShowConfirm] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChangePassword = async () => {
        // --- Client-side validation ---
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        if (oldPassword === newPassword) {
            setError("Mật khẩu mới không được trùng với mật khẩu cũ.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const customerInfoStr = await AsyncStorage.getItem('customerInfo');
            if (!customerInfoStr) {
                throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            }
            const customerInfo = JSON.parse(customerInfoStr);
            const maTaiKhoan = customerInfo.maKhachHang;

            // API endpoint assumption: PUT /api/khach-hang/change-password
            // This endpoint should be created in the backend.
            await api.put(`${ENDPOINTS.KHACH_HANG}/change-password`, {
                maTaiKhoan: maTaiKhoan,
                oldPassword: oldPassword,
                newPassword: newPassword,
            });

            Alert.alert(
                "Thành công",
                "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
                [{
                    text: "OK", onPress: async () => {
                        await AsyncStorage.clear(); // Log out user
                        router.replace('/login');
                    }
                }]
            );

        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError("Mật khẩu hiện tại không đúng.");
            } else {
                setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
            console.error("Failed to change password:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đổi Mật Khẩu</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <PasswordInput
                        label="Mật khẩu hiện tại"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        secureTextEntry={showOld}
                        onToggleVisibility={() => setShowOld(!showOld)}
                    />
                    <PasswordInput
                        label="Mật khẩu mới"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={showNew}
                        onToggleVisibility={() => setShowNew(!showNew)}
                    />
                    <PasswordInput
                        label="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={showConfirm}
                        onToggleVisibility={() => setShowConfirm(!showConfirm)}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity
                        style={[styles.confirmButton, loading && styles.disabledButton]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSec,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 10,
        backgroundColor: '#FAFAFA'
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        color: COLORS.textMain,
    },
    eyeIcon: {
        padding: 10,
    },
    errorText: {
        color: COLORS.red,
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    confirmButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
});

export default DoiMatKhauScreen;
