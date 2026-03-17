import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
    Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import api, { ENDPOINTS } from '@/constants/api';


const PaymentWebView = () => {
    const params = useLocalSearchParams<{ url: string; orderId: string; idRestaurant: string; idThanhToan?: string }>();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [seconds, setSeconds] = useState(5);
    const webviewRef = useRef<WebView>(null);

    const updateOrderStatus = async (orderId: string, idRestaurant: string, idThanhToan?: string) => {
        try {
            // Dùng PATCH endpoint mới để tránh trigger check xung đột bàn/giờ (lỗi 409)
            await api.patch(`${ENDPOINTS.YEU_CAU_DON}/${orderId}/${idRestaurant}/thanh-toan`, {
                trangThaiThanhToan: 'đã thanh toán',
                idThanhToan: idThanhToan ? parseInt(idThanhToan, 10) : undefined,
            });
            console.log(`Order ${orderId} status updated to 'đã thanh toán' and payment time recorded.`);
            
            // Note: API put full order cũ có 'trangThai: chờ xác nhận' nhưng endpoint chi-tiet/trang-thai lo việc đó
            // Hoặc nếu cần, có thể gọi update trạng thái riêng nếu DB yêu cầu. 
        } catch (error) {
            console.error('Failed to update order status:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng.');
        }
    };

    const  deleteOrder = async (orderId: string, idRestaurant: string)=>{
        try {
            await api.delete(`${ENDPOINTS.YEU_CAU_DON}/${orderId}/${idRestaurant}`);
            console.log(`Order ${orderId} deleted successfully.`);
        } catch (error) {
            console.error('loi khong the xoa:', error);
            Alert.alert('Lỗi', 'Không thể xóa đơn hàng.');
        }
    }

    useEffect(() => {
        if (!showSuccess) return;

        if (params.orderId && params.idRestaurant) {
            updateOrderStatus(params.orderId, params.idRestaurant, params.idThanhToan);
        }

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.replace('/HomeScreen');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showSuccess]);

    useEffect(() => {
        if (!showCancel) return;

        if(params.orderId && params.idRestaurant){
            deleteOrder(params.orderId, params.idRestaurant);
        }

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.back();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showCancel]);



    const handleNavigationStateChange = (navState: any) => {
        const { url } = navState;
        if (!url) return;

        console.log('Current WebView URL:', url);

        if (url.includes('/success') && !showSuccess) {
            setShowSuccess(true);
        }

        if (url.includes('/cancel') && !showCancel) {
            setShowCancel(true);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'Thanh toán', headerTitleAlign: 'center' }} />

            {isLoading && !showSuccess && !showCancel && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6600" />
                </View>
            )}

            <WebView
                ref={webviewRef}
                source={{ uri: params.url }}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onNavigationStateChange={handleNavigationStateChange}
                style={{ flex: showSuccess || showCancel ? 0 : 1 }}
            />

            {showSuccess && (
                <View style={styles.overlay}>
                    <Text style={styles.successTitle}>🎉 Thanh toán thành công</Text>
                    <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={100 - (seconds / 5) * 100}
                        tintColor="#22c55e"
                        backgroundColor="#e5e7eb"
                    >
                        {() => <Text style={styles.countdown}>{seconds}s</Text>}
                    </AnimatedCircularProgress>
                    <Text style={styles.messageText}>
                        Tự động về trang chủ sau {seconds} giây
                    </Text>
                </View>
            )}

            {showCancel && (
                <View style={styles.overlay}>
                    <Text style={styles.cancelTitle}>🚫 Thanh toán đã hủy</Text>
                    <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={100 - (seconds / 5) * 100}
                        tintColor="#ef4444"
                        backgroundColor="#e5e7eb"
                    >
                        {() => <Text style={styles.countdown}>{seconds}s</Text>}
                    </AnimatedCircularProgress>
                    <Text style={styles.messageText}>
                        Tự động quay lại sau {seconds} giây
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 1,
    },
    overlay: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.98)',
    },
    successTitle: {
        fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#16a34a',
    },
    cancelTitle: {
        fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#ef4444',
    },
    countdown: {
        fontSize: 26, fontWeight: 'bold', color: '#374151',
    },
    messageText: {
        marginTop: 16, fontSize: 16, color: '#374151',
    },
});

export default PaymentWebView;
