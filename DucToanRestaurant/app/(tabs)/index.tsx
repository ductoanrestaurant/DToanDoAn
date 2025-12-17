import { Image, ImageBackground } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import React from 'react';

import { useRouter } from 'expo-router';


const WelcomHome= () =>{
  const router = useRouter();

  const handleLoginPress = () => {
        // 3. GỌI router.push() ĐỂ CHUYỂN ĐẾN MÀN HÌNH /login
        // Tên 'login' phải khớp với tên file của bạn: app/login.tsx
        router.push('/login'); 
    };

  const handleRegisterPress = () =>{
    router.push('/register');
  }

  return(
    <ImageBackground
      source={require("@/assets/images/bg_ductoan.png")}
      style={styles.bg}
      blurRadius={2}
      >
        <View style={{position: "absolute", top: 25, right: 5, flexDirection:"row", backgroundColor: "rgba(21, 140, 225, 0.4)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,}}>
          <Text style={{color:"#FFFFFF", fontWeight:"bold"}}>NV Order</Text>
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
      </ImageBackground>
  );
}

export default WelcomHome;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 10
  },

});


