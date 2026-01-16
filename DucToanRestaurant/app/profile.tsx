import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap; // Đảm bảo icon là một key hợp lệ của Ionicons
    label: string;
    onPress?: () => void;
    value?: string;
    isSwitch?: boolean;
}

const ProfileScreen = () => {
    const router = useRouter();


    const handlePress = (screen: string) => {
        console.log(`Đã chọn: ${screen}`);

        if (screen === 'Info') {
            router.push('/info');
        }
    };

    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
            { text: "Hủy", style: "cancel" },
            { text: "Đồng ý", style: "destructive", onPress: () => console.log("Logout") }
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.headerBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editText}>     </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>


                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/300' }}
                                style={styles.avatar}
                            />
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </View>
                        </View>
                        <Text style={styles.userName}>Nguyễn Văn A</Text>
                        <Text style={styles.userEmail}>nguyenvana@gmail.com</Text>
                    </View>


                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tài khoản</Text>
                        <MenuItem icon="person-outline" label="Thông tin cá nhân" onPress={() => handlePress('Info')} />
                        <MenuItem icon="lock-closed-outline" label="Đổi mật khẩu" onPress={() => handlePress('Password')} />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Khác</Text>
                        <MenuItem icon="language-outline" label="Ngôn ngữ" value="Tiếng Việt" onPress={() => handlePress('Lang')} />
                        <MenuItem icon="moon-outline" label="Giao diện tối" isSwitch={true} />
                        <MenuItem icon="help-circle-outline" label="Trợ giúp & Hỗ trợ" onPress={() => handlePress('Help')} />
                    </View>


                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, value, isSwitch }) => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7} disabled={isSwitch}>
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color="#555" />
                </View>
                <Text style={styles.menuItemText}>{label}</Text>
            </View>
            <View style={styles.menuItemRight}>
                {value && <Text style={styles.menuItemValue}>{value}</Text>}
                {isSwitch ? (
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        padding: 5,
    },
    editButton: {
        padding: 5,
    },
    editText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 40,
    },

    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
    },

    section: {
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
        marginBottom: 10,
        marginTop: 5,
        textTransform: 'uppercase',
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemValue: {
        fontSize: 14,
        color: '#888',
        marginRight: 8,
    },

    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 10,
        paddingVertical: 15,
    },
    logoutText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginTop: 20,
    },
});

export default ProfileScreen;
