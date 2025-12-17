import { ENDPOINTS } from '@/constants/api';
import axios from 'axios';
import { Image, ImageBackground } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const RegisterScreen= ()=>{
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');


    const handleRegister = async () => {
        setErrorMessage('');

        // kiem tra du lieu trong
        if(!email || !fullname || !phonenumber || !password || !confirmpassword){
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Email không hợp lệ');
            return;
        }


        const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
        if (!phoneRegex.test(phonenumber)) {
            setErrorMessage('Số điện thoại không hợp lệ (phải có 10 số)');
            return;
        }


        // kiem tra mat khau khop nhau
        if(password !== confirmpassword){
            setErrorMessage('Mật khẩu không khớp');
            return;
        }

        setLoading(true);
        try{
            const newUser = {
                email: email,
                hoTen: fullname,
                sdt: phonenumber,
                matKhau:password,
                numberLog: 0,
                firstLog: new Date().toISOString().split('T')[0]
            };

            const response = await axios.post(ENDPOINTS.KHACH_HANG, newUser);
            if (response.status === 200 || response.status === 201) {
                Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
                    { text: "Đăng nhập ngay", onPress: () => router.replace('/login') }
                ]);
            }
        } catch(error){
            console.error(error);
            Alert.alert("Lỗi", "Đăng ký thất bại.")
        } finally{
            setLoading(false)
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
                <Text style={{color:"#FFFFFF", fontWeight:'bold', fontSize:45, textAlign:'left'}}>Đăng ký</Text>
                <Text style={{color:"#FFFFFF"}}>Đăng ký để tiếp tục đến với Đức Toàn Restaurnt</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={[styles.input, errorMessage.includes('Email') && {borderColor: 'red'}]}
                    placeholder="Email"
                    placeholderTextColor="#A9A9A9"
                    value={email}
                    onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />


                <TextInput
                    style={styles.input}
                    placeholder="Họ tên"
                    placeholderTextColor="#A9A9A9"
                    value={fullname}
                    onChangeText={(text) => { setFullname(text); setErrorMessage(''); }}
                    autoCapitalize="words"
                />


                <TextInput
                    style={[styles.input, errorMessage.includes('điện thoại') && {borderColor: 'red'}]}
                    placeholder="Số điện thoại"
                    placeholderTextColor="#A9A9A9"
                    value={phonenumber}
                    onChangeText={(text) => { setPhoneNumber(text); setErrorMessage(''); }}
                    keyboardType="phone-pad"
                    maxLength={10}
                />


                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#A9A9A9"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrorMessage(''); }}
                    secureTextEntry
                />


                <TextInput
                    style={[styles.input, errorMessage.includes('khớp') && {borderColor: 'red'}]}
                    placeholder="Xác nhận lại mật khẩu"
                    placeholderTextColor="#A9A9A9"
                    value={confirmpassword}
                    onChangeText={(text) => { setConfirmPassword(text); setErrorMessage(''); }}
                    secureTextEntry
                />

                { errorMessage !== '' && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

            </View>

            <Pressable onPress={handleRegister} disabled={loading} style={{backgroundColor:"#FFA500", paddingHorizontal: 50, paddingVertical: 10, borderRadius: 30, width:200, margin:15}}>
                {loading ? (
                    <ActivityIndicator color="#FFFFFF"/>
                ): (<Text style={{color:"#FFFFFF", fontWeight:"bold", fontSize:15, textAlign:'center' }}>Đăng ký</Text>)}      
            </Pressable>

            <Pressable onPress={() => router.push('/login')}>
                <Text style={{color: '#FFFFFF', marginTop: 10, textDecorationLine: 'underline'}}>
                    Đã có tài khoản? Đăng nhập
                </Text>
            </Pressable>
        </ImageBackground>
    );
}


export default RegisterScreen;


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
        height: 45,
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
        width: 150,
        height: 150,
        marginTop: -40,
    },
    errorText:{
        color: "#FF3333",
        fontWeight: "bold",
        marginTop: -15,
        marginBottom: 10 
    }
});
