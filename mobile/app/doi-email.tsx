import React, { useState, useEffect, useCallback } from 'react';
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
    red: '#E74C3C',
};

const DoiEmailScreen = () => {
    const router = useRouter();
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch current user's email on component mount
    useFocusEffect(
        useCallback(() => {
            const fetchCurrentUser = async () => {
                setPageLoading(true);
                try {
                    const customerInfoStr = await AsyncStorage.getItem('customerInfo');
                    if (!customerInfoStr) {
                        throw new Error("Không tìm thấy thông tin người dùng.");
                    }
                    const customerInfo = JSON.parse(customerInfoStr);
                    const maTaiKhoan = customerInfo.maKhachHang;

                    // Fetch the latest user data from API
                    const response = await api.get(`${ENDPOINTS.KHACH_HANG}/${maTaiKhoan}`);
                    setCurrentEmail(response.data.email || '');
                } catch (err) {
                    setError("Không thể tải thông tin email hiện tại.");
                } finally {
                    setPageLoading(false);
                }
            };
            fetchCurrentUser();
        }, [])
    );

    const handleUpdateEmail = async () => {
        // --- Client-side validation ---
        if (!newEmail) {
            setError("Vui lòng nhập email mới.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setError("Định dạng email không hợp lệ.");
            return;
        }
        if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
            setError("Email mới không được trùng với email hiện tại.");
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

            await api.put(`${ENDPOINTS.KHACH_HANG}/${maTaiKhoan}/email`, {
                email: newEmail,
            });

            // Update email in AsyncStorage
            const updatedCustomerInfo = { ...customerInfo, email: newEmail };
            await AsyncStorage.setItem('customerInfo', JSON.stringify(updatedCustomerInfo));

            Alert.alert(
                "Thành công",
                "Email của bạn đã được cập nhật.",
                [{ text: "OK", onPress: () => router.back() }]
            );

        } catch (err: any) {
            if (err.response && err.response.status === 409) {
                setError("Email này đã được sử dụng bởi một tài khoản khác.");
            } else {
                setError(err.response?.data?.error || "Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
            console.error("Failed to update email:", err);
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
                <Text style={styles.headerTitle}>Đổi Email</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {pageLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email hiện tại</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={currentEmail}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email mới</Text>
                            <TextInput
                                style={styles.input}
                                value={newEmail}
                                onChangeText={setNewEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Nhập email mới của bạn"
                            />
                        </View>

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity
                            style={[styles.confirmButton, loading && styles.disabledButton]}
                            onPress={handleUpdateEmail}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
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
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        color: COLORS.textMain,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 10,
        backgroundColor: '#FAFAFA'
    },
    disabledInput: {
        backgroundColor: '#E9ECEF',
        color: '#6C757D',
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

export default DoiEmailScreen;
