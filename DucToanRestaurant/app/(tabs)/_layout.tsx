import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                // Lưu ý: Nếu bạn để display: 'none', thanh tab sẽ biến mất
                tabBarStyle: { display: 'none' },
            }}>

            {/* THÊM CÁC DÒNG DƯỚI ĐÂY */}
            <Tabs.Screen
                name="index" // Tên này phải khớp với file index.tsx trong thư mục (tabs)
                options={{
                    title: 'Trang chủ',
                }}
            />

            {/* Thêm các màn hình khác nếu có */}
            {/* <Tabs.Screen name="explore" options={{ title: 'Khám phá' }} /> */}

        </Tabs>
    );
}