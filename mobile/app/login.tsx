import api, { ENDPOINTS } from '@/constants/api'; // Import api instance đã cấu hình
import { Image, ImageBackground } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        setErrorMessage(''); // Xóa thông báo lỗi cũ

        try {
            const response = await api.post(ENDPOINTS.AUTH, {
                email: email,
                password: password,
                clientType: 'app', // Thêm clientType để backend biết đây là app mobile
            });

            // Backend returns token, role, and user-specific data
            const { token, role, maTaiKhoan, tenKhachHang, maNhanVien, tenNhanVien } = response.data;

            if (token) {
                await AsyncStorage.setItem('accessToken', token);

                // Cập nhật vai trò nhân viên được phép truy cập app
                const allowedRoles = ['QUAN_LY', 'THU_NGAN'];
                if (allowedRoles.includes(role) && maNhanVien && tenNhanVien) {
                    // Employee login
                    const employeeData = { maNhanVien: String(maNhanVien), tenNhanVien: tenNhanVien };
                    await AsyncStorage.setItem('employeeInfo', JSON.stringify(employeeData));
                    // Also save individual keys for compatibility if needed elsewhere
                    await AsyncStorage.setItem('maNhanVien', String(maNhanVien));
                    await AsyncStorage.setItem('tenNhanVien', tenNhanVien);


                    router.replace('/NvOrder');

                } else if (role === 'KHACH_HANG' && maTaiKhoan && tenKhachHang) {
                    // Customer login
                    const customerData = { maKhachHang: String(maTaiKhoan), tenKhachHang: tenKhachHang };
                    await AsyncStorage.setItem('customerInfo', JSON.stringify(customerData));
                    // Also save individual key for compatibility
                    await AsyncStorage.setItem('maKhachHang', String(maTaiKhoan));

                    // <<< START FIX: Add keys for Chat feature >>>
                    await AsyncStorage.setItem('userId', String(maTaiKhoan));
                    await AsyncStorage.setItem('customerName', tenKhachHang);
                    // <<< END FIX >>>

                    router.replace('/HomeScreen');
                } else {
                    setErrorMessage("Đăng nhập không thành công: Vai trò của bạn không được hỗ trợ trên ứng dụng này.");
                }
            } else {
                setErrorMessage("Đăng nhập không thành công, không nhận được token.");
            }
        } catch (error: any) {
            console.error("Login error:", error.response?.data || error.message);
            const backendError = error.response?.data?.error;
            if (backendError) {
                setErrorMessage(backendError);
            } else if (error.response && error.response.status === 401) {
                setErrorMessage("Email hoặc mật khẩu không chính xác.");
            } else {
                setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require("@/assets/images/bg_ductoan.png")}
            style={styles.bg}
            blurRadius={2}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <Image
                source={require("../../mobile/assets/images/logo_ductoan_1.png")}
                style={styles.logo}
            />

            <Text style={{ color: "#FFFFFF", fontWeight: 'bold', fontSize: 25 }}>Đức Toàn Restaurant</Text>
            <View style={{ width: '100%', alignSelf: 'center', paddingLeft: 10, marginTop: 20 }}>
                <Text style={{ color: "#FFFFFF", fontWeight: 'bold', fontSize: 45, textAlign: 'left' }}>Đăng nhập</Text>
                <Text style={{ color: "#FFFFFF" }}>Đăng nhập để tiếp tục đến với Đức Toàn Restaurant</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#A9A9A9"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#A9A9A9"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {errorMessage !== '' && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}
            </View>
            <Pressable style={{ backgroundColor: "#FFA500", paddingHorizontal: 50, paddingVertical: 10, borderRadius: 30, width: 200, margin: 15 }}
                       onPress={handleLogin} disabled={loading}
            >
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 15, textAlign: 'center' }}>Đăng nhập</Text>
            </Pressable>
        </ImageBackground>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 70,
    },
    formContainer: {
        width: '85%',
        marginTop: 20,
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 14,
        paddingHorizontal: 18,
        marginBottom: 18,
        fontSize: 16,
        color: '#222',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    logo: {
        width: 220,
        height: 220,
        marginBottom: 10,
    },
    errorText: {
        color: "#FF3333",
        fontWeight: "bold",
        marginTop: -15,
        marginBottom: 10,
        textAlign: 'center',
    }
});