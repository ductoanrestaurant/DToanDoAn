import { ENDPOINTS } from '@/constants/api';
import axios from 'axios';
import { Image, ImageBackground } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';


const LoginScreen= ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const [verifyUser, setVerifyUser] = useState('khach');


    const handleLogin = async () => {
        // 1. Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        try {
            // 2. Gọi API lấy danh sách khách hàng để kiểm tra (Logic đơn giản)
            // Lưu ý: Thực tế nên viết 1 API riêng /api/khach-hang/login ở Backend
            const response = await axios.get(ENDPOINTS.KHACH_HANG);
            const users = response.data;

            // 3. Kiểm tra xem có user nào khớp email và mật khẩu không
            const user = users.find((u: any) => u.email === email && u.matKhau === password);

            if (user) {
                router.push({
                    pathname: '/dat-ban',
                    params: {
                        maKhachHang: String(user.maTaiKhoan),  // Truyền mã khách hàng từ user đã đăng nhập
                    }
                });
            } else {
                Alert.alert("Lỗi", "Email hoặc Mật khẩu không chính xác");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi kết nối", "Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại mạng.");
        } finally {
            setLoading(false);
        }
    };


    return(
        <ImageBackground
        source={require("@/assets/images/bg_ductoan.png")}
        style={styles.bg}
        blurRadius={2}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <Image 
                source={require("@/assets/images/logo_ductoan_1.png")}
                style={styles.logo}
                />

            <Text style={{color:"#FFFFFF", fontWeight:'bold', fontSize:25}}>Đức Toàn Restaurant</Text>
            <View style={{width: '100%', alignSelf: 'center', paddingLeft: 10, marginTop:20}}>
                <Text style={{color:"#FFFFFF", fontWeight:'bold', fontSize:45, textAlign:'left'}}>Đăng nhập</Text>
                <Text style={{color:"#FFFFFF"}}>Đăng nhập để tiếp tục đến với Đức Toàn Restaurnt</Text>
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

                { errorMessage !== '' && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    )
                }
            </View>
            <Pressable style={{backgroundColor:"#FFA500", paddingHorizontal: 50, paddingVertical: 10, borderRadius: 30, width:200, margin:15}} 
                onPress={handleLogin} disabled={loading}
            >
                <Text style={{color:"#FFFFFF", fontWeight:"bold", fontSize:15, textAlign:'center' }}>Đăng nhập</Text>
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

        // Border viền nhẹ
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20
    },
    logo: {
        width: 220,
        height: 220,
        marginBottom: 10,
    },
        errorText:{
        color: "#FF3333",
        fontWeight: "bold",
        marginTop: -15,
        marginBottom: 10 
    }
});
