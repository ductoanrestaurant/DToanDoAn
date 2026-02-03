import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const PaymentWebView = () => {
    const params = useLocalSearchParams<{ url: string; orderId: string }>();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [seconds, setSeconds] = useState(5);
    const webviewRef = useRef<WebView>(null);

    /** ⏳ Đếm ngược sau khi thanh toán thành công */
    useEffect(() => {
        if (!showSuccess) return;

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

    const handleNavigationStateChange = (navState: any) => {
        const { url } = navState;
        if (!url) return;

        console.log('Current WebView URL:', url);

        if (url.includes('/success')) {
            // 👉 KHÔNG chuyển trang ngay
            setShowSuccess(true);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'Thanh toán', headerTitleAlign: 'center' }} />

            {isLoading && (
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
                style={{ flex: 1 }}
            />

            {/* ✅ Overlay thanh toán thành công */}
            {showSuccess && (
                <View style={styles.successOverlay}>
                    <Text style={styles.successTitle}>🎉 Thanh toán thành công</Text>

                    <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={(seconds / 5) * 100}
                        tintColor="#22c55e"
                        backgroundColor="#e5e7eb"
                    >
                        {() => <Text style={styles.countdown}>{seconds}s</Text>}
                    </AnimatedCircularProgress>

                    <Text style={styles.successText}>
                        Tự động về trang chủ sau {seconds} giây
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        zIndex: 1,
    },

    successOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    successTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#16a34a',
    },

    countdown: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#16a34a',
    },

    successText: {
        marginTop: 16,
        fontSize: 16,
        color: '#374151',
    },
});

export default PaymentWebView;
