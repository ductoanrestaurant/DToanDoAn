import { Image, ImageBackground } from 'expo-image';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';

import React, {useEffect, useState} from 'react';

import { useRouter } from 'expo-router';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import * as AuthSession from 'expo-auth-session';

// trình duyệt đóng lại sau khi xác thực
WebBrowser.maybeCompleteAuthSession();


const WelcomHome= () =>{
  const router = useRouter();

  // // Cấu hình Request với Client ID
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId: "695364794358-bu07fprgtaveo22khi03ap1rk456sjit.apps.googleusercontent.com",
  //
  //   redirectUri: AuthSession.makeRedirectUri(),
  // });


  // useEffect(() => {
  //   // Xử lý khi đăng nhập thành công
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     if (authentication?.accessToken) {
  //       getUserInfo(authentication.accessToken);
  //     }
  //   }
  //   // Xử lý khi người dùng hủy hoặc gặp lỗi
  //   else if (response?.type === 'error' || response?.type === 'cancel') {
  //     console.log("Google Login Status:", response.type);
  //   }
  // }, [response]);
  //
  //
  // // lấy thông tin chi tiết từ Google
  // const getUserInfo = async (token: string) => {
  //   try {
  //     const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const user = await res.json();
  //
  //     console.log("Dữ liệu người dùng Google:", user);
  //
  //     // Logic: Kiểm tra email này trong database của bạn qua API
  //     // Nếu chưa có thì tạo mới, nếu có rồi thì đăng nhập vào Home
  //     Alert.alert("Đăng nhập thành công", `Chào mừng ${user.name}!`);
  //     router.replace('/(tabs)'); // Chuyển hướng vào trang chính
  //   } catch (error) {
  //     console.error("Lỗi lấy thông tin:", error);
  //     Alert.alert("Lỗi", "Không thể lấy thông tin từ Google.");
  //   }
  // };

  const handleLoginPress = () => {
        // 3. GỌI router.push() ĐỂ CHUYỂN ĐẾN MÀN HÌNH /login
        // Tên 'login' phải khớp với tên file của bạn: app/login.tsx
        router.push('/login'); 
    };

  const handleRegisterPress = () =>{
    router.push('/register');
  };

  const handleNvOrder= () =>{
    router.push('/NvOrder');
  };




  return(
    <ImageBackground
      source={require("@/assets/images/bg_ductoan.png")}
      style={styles.bg}
      blurRadius={2}
      >
        <View style={{position: "absolute", top: 25, right: 5, flexDirection:"row", backgroundColor: "rgba(21, 140, 225, 0.4)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,}}>
          <Text style={{color:"#FFFFFF", fontWeight:"bold"}} onPress={handleNvOrder}>NV Order</Text>
          <Image source={require("@/assets/images/icon-next.png")}
            style={{ width: 20, height:20, marginLeft: 5,marginRight: -10}}
          />
        </View>

        <View style={styles.container}>
          <Text style={{color:"#FFFFFF", fontWeight:'bold', fontSize:30}}>Chào mừng quý khách!</Text>
          <Text style={{color:"#FFFFFF", fontWeight:'bold', fontSize:20}}>Đến với</Text>
          <Text style={{color:"#FFFFFF", fontWeight:'bold', fontSize:25}}>Đức Toàn Restaurant</Text>
        </View>
        <Image
          source={require("@/assets/images/logo_ductoan_1.png")}
          style={styles.logo}
        />
        <Pressable style={{backgroundColor:"#FFA500", paddingHorizontal: 50, paddingVertical: 10, borderRadius: 30, width:200, margin:15}}
                    onPress={handleLoginPress}
        >
          <Text style={{color:"#FFFFFF", fontWeight:"bold", fontSize:15, textAlign:'center' }}>Đăng nhập</Text>
        </Pressable>
        <Pressable style={{paddingHorizontal: 50, paddingVertical: 10, borderRadius: 30, width:200, borderColor:"#FFFFFF", borderWidth:3}}
                    onPress={handleRegisterPress}  
        >
          <Text style={{color:"#FFFFFF", fontWeight:"bold", fontSize:15, textAlign: 'center' }}>Đăng ký</Text>
        </Pressable>

      {/*<Pressable*/}
      {/*    style={[styles.btnPrimary, { backgroundColor: '#FFFFFF', flexDirection: 'row' }]}*/}
      {/*    onPress={() => promptAsync()}*/}
      {/*    disabled={!request}*/}
      {/*>*/}
      {/*  <Image*/}
      {/*      source={{ uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png" }}*/}
      {/*      style={styles.googleIcon}*/}
      {/*  />*/}
      {/*  <Text style={[styles.btnText, { color: '#000' }]}>Tiếp tục với Google</Text>*/}
      {/*</Pressable>*/}
      </ImageBackground>
  );
}

export default WelcomHome;

const styles = StyleSheet.create({
  // bg: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // container: {
  //   justifyContent: "center",
  //   alignItems: "center",
  //   paddingHorizontal: 20,
  //   marginBottom: 20
  // },
  // logo: {
  //   width: 220,
  //   height: 220,
  //   marginBottom: 10
  // },

  bg: { flex: 1, alignItems: "center", justifyContent: "center" },
  nvOrderContainer: { position: "absolute", top: 25, right: 5, flexDirection: "row", backgroundColor: "rgba(21, 140, 225, 0.4)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  nvOrderText: { color: "#FFFFFF", fontWeight: "bold" },
  iconNext: { width: 20, height: 20, marginLeft: 5, marginRight: -10 },
  container: { justifyContent: "center", alignItems: "center", paddingHorizontal: 20, marginBottom: 20 },
  title: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 30 },
  subtitle: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 20 },
  brand: { color: "#FFFFFF", fontWeight: 'bold', fontSize: 25 },
  logo: { width: 220, height: 220, marginBottom: 10 },
  btnPrimary: { backgroundColor: "#FFA500", paddingVertical: 12, borderRadius: 30, width: 220, marginVertical: 8, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { paddingVertical: 12, borderRadius: 30, width: 220, borderColor: "#FFFFFF", borderWidth: 3, marginTop: 8 },
  btnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15, textAlign: 'center' },
  googleIcon: { width: 20, height: 20, marginRight: 10 }

});


