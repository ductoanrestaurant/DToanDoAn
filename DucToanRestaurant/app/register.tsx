import { ENDPOINTS } from '@/constants/api';
import axios from 'axios';
import { Image, ImageBackground } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // --- Validation Rule Functions ---
    const isPhoneNumberValid = (phone: string) => {
        // Validates Vietnamese phone numbers (10 digits, starting with 03, 05, 07, 08, 09)
        const phoneRegex = /^(0[35789])\d{8}$/;
        return phoneRegex.test(phone);
    };

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // --- Blur Handlers for Real-time Feedback ---
    const handleEmailBlur = async () => {
        if (!email) {
            setEmailError('');
            return;
        }
        if (!isEmailValid(email)) {
            setEmailError('Email không hợp lệ.');
            return;
        }
        try {
            const response = await axios.get(ENDPOINTS.CHECK_EMAIL, { params: { email } });
            if (response.data.exists) {
                setEmailError('Email này đã được sử dụng.');
            } else {
                setEmailError('');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setEmailError(''); // 404 means not found, which is valid for a new user
            } else {
                console.error("Lỗi kiểm tra email:", error);
            }
        }
    };

    const handlePhoneBlur = async () => {
        // Clear previous errors when user starts typing again
        if (phoneError) setPhoneError('');

        // Only perform validation check when the user has entered 10 digits
        if (phonenumber.length !== 10) {
            return;
        }

        if (!isPhoneNumberValid(phonenumber)) {
            setPhoneError('Số điện thoại không hợp lệ!');
            return;
        }

        try {
            const response = await axios.get(ENDPOINTS.CHECK_PHONE, { params: { sdt: phonenumber } });
            if (response.data.exists) {
                setPhoneError('Số điện thoại này đã được sử dụng.');
            } else {
                setPhoneError('');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setPhoneError(''); // 404 means not found, which is valid
            } else {
                console.error("Lỗi kiểm tra số điện thoại:", error);
            }
        }
    };

    // --- Main Registration Handler ---
    const handleRegister = async () => {
        setErrorMessage('');
        setEmailError('');
        setPhoneError('');

        // 1. Client-side validation first
        let hasClientError = false;
        if (!email || !fullname || !phonenumber || !password || !confirmpassword) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            hasClientError = true;
        }
        if (email && !isEmailValid(email)) {
            setEmailError('Email không hợp lệ.');
            hasClientError = true;
        }
        if (phonenumber && !isPhoneNumberValid(phonenumber)) {
            setPhoneError('Số điện thoại không hợp lệ!');
            hasClientError = true;
        }
        if (password !== confirmpassword) {
            setErrorMessage('Mật khẩu không khớp');
            hasClientError = true;
        }

        if (hasClientError) {
            return;
        }

        setLoading(true);

        // 2. Server-side validation for existing data
        try {
            const emailCheck = axios.get(ENDPOINTS.CHECK_EMAIL, { params: { email } });
            const phoneCheck = axios.get(ENDPOINTS.CHECK_PHONE, { params: { sdt: phonenumber } });

            const [emailResult, phoneResult] = await Promise.allSettled([emailCheck, phoneCheck]);

            let hasApiError = false;
            if (emailResult.status === 'fulfilled' && emailResult.value.data.exists) {
                setEmailError('Email này đã được sử dụng.');
                hasApiError = true;
            }
            if (phoneResult.status === 'fulfilled' && phoneResult.value.data.exists) {
                setPhoneError('Số điện thoại này đã được sử dụng.');
                hasApiError = true;
            }

            if (hasApiError) {
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Lỗi không mong muốn khi kiểm tra:", error);
            setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.");
            setLoading(false);
            return;
        }

        // 3. Submit registration
        try {
            const newUser = { email, hoTen: fullname, sdt: phonenumber, matKhau: password };
            const response = await axios.post(ENDPOINTS.KHACH_HANG, newUser);

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
                    { text: "Đăng nhập ngay", onPress: () => router.replace('/login') }
                ]);
            }
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            const serverMessage = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            Alert.alert("Lỗi", serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require("@/assets/images/bg_ductoan.png")} style={styles.bg} blurRadius={2}>
            <Stack.Screen options={{ headerShown: false }} />
            <Image source={require("@/assets/images/logo_ductoan_1.png")} style={styles.logo} />

            <Text style={styles.headerTitle}>Đức Toàn Restaurant</Text>
            <View style={styles.headerContainer}>
                <Text style={styles.headerMainText}>Đăng ký</Text>
                <Text style={styles.headerSubText}>Đăng ký để tiếp tục đến với Đức Toàn Restaurant</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={[styles.input, emailError ? { borderColor: 'red' } : {}]}
                    placeholder="Email"
                    placeholderTextColor="#A9A9A9"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={handleEmailBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {emailError ? <Text style={styles.inlineErrorText}>{emailError}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Họ tên"
                    placeholderTextColor="#A9A9A9"
                    value={fullname}
                    onChangeText={setFullname}
                    autoCapitalize="words"
                />

                <TextInput
                    style={[styles.input, phoneError ? { borderColor: 'red' } : {}]}
                    placeholder="Số điện thoại"
                    placeholderTextColor="#A9A9A9"
                    value={phonenumber}
                    onChangeText={setPhoneNumber}
                    onBlur={handlePhoneBlur}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
                {phoneError ? <Text style={styles.inlineErrorText}>{phoneError}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#A9A9A9"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={[styles.input, errorMessage.includes('khớp') ? { borderColor: 'red' } : {}]}
                    placeholder="Xác nhận lại mật khẩu"
                    placeholderTextColor="#A9A9A9"
                    value={confirmpassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>

            <Pressable onPress={handleRegister} disabled={loading} style={styles.registerButton}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Đăng ký</Text>}
            </Pressable>

            <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
            </Pressable>
        </ImageBackground>
    );
}

export default RegisterScreen;

const styles = StyleSheet.create({
    bg: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 70 },
    logo: { width: 150, height: 150, marginTop: -40 },
    headerTitle: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 25 },
    headerContainer: { width: '100%', alignSelf: 'center', paddingLeft: 10, marginTop: 20 },
    headerMainText: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 45, textAlign: 'left' },
    headerSubText: { color: "#FFFFFF" },
    formContainer: { width: '85%', marginTop: 20 },
    input: {
        width: '100%',
        height: 45,
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
    errorText: { color: "#FF3333", fontWeight: "bold", textAlign: 'center', marginTop: -10, marginBottom: 10 },
    inlineErrorText: { color: "#FF3333", fontWeight: "bold", marginTop: -15, marginBottom: 10, marginLeft: 5 },
    registerButton: { backgroundColor: "#FFA500", paddingHorizontal: 50, paddingVertical: 10, borderRadius: 30, width: 200, margin: 15, alignItems: 'center' },
    buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15, textAlign: 'center' },
    loginText: { color: '#FFFFFF', marginTop: 10, textDecorationLine: 'underline' }
});
