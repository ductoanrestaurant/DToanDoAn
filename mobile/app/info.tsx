import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
    primary: '#FF6600',
    white: '#FFFFFF',
    background: '#F7F8FC',
    textMain: '#333333',
    textSec: '#888888',
    lightGray: '#E8E8E8',
    red: '#E74C3C',
};

interface ProfileOptionProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    text: string;
    onPress: () => void;
    isLogout?: boolean;
}

interface CustomerInfo {
    maTaiKhoan: number;
    hoTen: string;
    email: string;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, text, onPress, isLogout = false }) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
        <Ionicons name={icon} size={24} color={isLogout ? COLORS.red : COLORS.primary} />
        <Text style={[styles.optionText, isLogout && styles.logoutText]}>{text}</Text>
        {!isLogout && <Ionicons name="chevron-forward-outline" size={22} color={COLORS.textSec} />}
    </TouchableOpacity>
);

const InfoScreen = () => {
    const router = useRouter();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

    useEffect(() => {
        const loadCustomerInfo = async () => {
            const info = await AsyncStorage.getItem('customer-info');
            if (info) {
                setCustomerInfo(JSON.parse(info));
            }
        };
        loadCustomerInfo();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đăng xuất",
                    onPress: async () => {
                        await AsyncStorage.removeItem('customer-info');

                        router.replace('/login');
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>


                <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>

                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: 'https://avatar.iran.liara.run/public/boy' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.profileName}>{customerInfo?.hoTen || 'Khách hàng'}</Text>
                    <Text style={styles.profileEmail}>{customerInfo?.email || ''}</Text>
                </View>

                <View style={styles.menuContainer}>
                    <ProfileOption
                        icon="receipt-outline"
                        text="Đơn hàng của tôi"
                        onPress={() => router.push('/DonHangScreen')}
                    />
                    <ProfileOption
                        icon="image-outline"
                        text="Cập nhật Avatar"
                        onPress={() => { }}
                    />
                    <ProfileOption
                        icon="mail-outline"
                        text="Cập nhật Email"
                        onPress={() => router.push('/doi-email')}
                    />
                </View>

                <View style={styles.logoutSection}>
                    <ProfileOption
                        icon="log-out-outline"
                        text="Đăng xuất"
                        onPress={handleLogout}
                        isLogout
                    />
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

    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        width: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain,
        textAlign: 'center',
        flex: 1,
    },

    scrollContainer: {
        paddingVertical: 20,
    },
    profileHeader: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    profileEmail: {
        fontSize: 16,
        color: COLORS.textSec,
        marginTop: 4,
    },
    menuContainer: {
        marginTop: 10,
        backgroundColor: COLORS.white,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    optionText: {
        flex: 1,
        marginLeft: 20,
        fontSize: 16,
        color: COLORS.textMain,
    },
    logoutSection: {
        marginTop: 30,
        marginBottom: 40,
    },
    logoutText: {
        color: COLORS.red,
        fontWeight: '500',
    },
});

export default InfoScreen;