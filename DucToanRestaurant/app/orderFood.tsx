import { ENDPOINTS } from '@/constants/api';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { Stack } from 'expo-router';


interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  moTa: string;
  gia: number;
  danhMuc: {
    tenDanhMuc: string;
  };
  danhSachAnh: {
    urlAnh: string;
  }[];
}

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState(true);

   const [refreshing, setRefreshing] = useState(false);


  const fetchMenu = useCallback( async () => {
    try {
        if(!refreshing) setLoading(true);
      const response = await axios.get(ENDPOINTS.SAN_PHAM);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Lỗi khi tải menu:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

    const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const renderItem = ({ item }: { item: SanPham }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ 
          uri: item.danhSachAnh?.[0]?.urlAnh || 'https://via.placeholder.com/150' 
        }}
        style={styles.foodImage}
      />
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.foodName}>{item.tenSanPham}</Text>
          <Text style={styles.categoryTag}>{item.danhMuc?.tenDanhMuc}</Text>
          <Text numberOfLines={2} style={styles.description}>{item.moTa}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.price}>{item.gia.toLocaleString('vi-VN')}đ</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: '', headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh Sách Món Ăn</Text>
      </View>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.maSanPham.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6600']} />}
                // Hiển thị thông báo nếu danh sách trống
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Hiện chưa có món ăn nào</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 10, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign:'center', marginTop:20},
  listContent: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodImage: { width: 100, height: 100, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  foodName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  categoryTag: { 
    fontSize: 12, 
    color: '#FF6600', 
    backgroundColor: '#FFF0E6', 
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 4
  },
  description: { fontSize: 13, color: '#777', marginTop: 5 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#E44D26' },
  addButton: { 
    backgroundColor: '#FF6600', 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});

export default MenuScreen;