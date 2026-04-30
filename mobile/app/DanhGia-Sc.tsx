import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, SafeAreaView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { getImageUrl } from '@/constants/api';

const COLORS = {
  primary: '#FF6600',
  white: '#FFFFFF',
  background: '#F7F8FC',
  textMain: '#333333',
  textSec: '#888888',
  lightGray: '#E8E8E8',
  green: '#27AE60',
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface SanPhamItem {
  maSanPham: number;
  tenSanPham: string;
  urlAnh?: string;
}

interface FormItem {
  soSao: number;
  noiDung: string;
  /** true nếu đã đánh giá trước đó (từ my-reviews) hoặc vừa submit */
  daDanhGia: boolean;
  soSaoCu?: number; // điểm cũ nếu đã đánh giá
  noiDungCu?: string;
}

// ─── Star picker ─────────────────────────────────────────────────────────────
const StarPicker = ({
  value, onChange, disabled,
}: { value: number; onChange: (s: number) => void; disabled: boolean }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((s) => (
      <TouchableOpacity key={s} onPress={() => !disabled && onChange(s)} disabled={disabled}>
        <Ionicons
          name={s <= value ? 'star' : 'star-outline'}
          size={30}
          color={disabled ? '#CCCCCC' : '#FFB800'}
          style={{ marginRight: 4 }}
        />
      </TouchableOpacity>
    ))}
    <Text style={[styles.starLabel, disabled && { color: '#CCC' }]}>{value}/5</Text>
  </View>
);

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function DanhGiaScreen() {
  const router = useRouter();
  const { maDonHang, idRestaurant } = useLocalSearchParams<{
    maDonHang?: string;
    idRestaurant?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [maTaiKhoan, setMaTaiKhoan] = useState<number | null>(null);
  const [sanPhams, setSanPhams] = useState<SanPhamItem[]>([]);
  const [forms, setForms] = useState<Record<number, FormItem>>({});

  // ── Fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        // Lấy maTaiKhoan
        const info = await AsyncStorage.getItem('customerInfo');
        if (!info) { router.replace('/login'); return; }
        const parsed = JSON.parse(info);
        const maTK: number = parsed.maKhachHang ?? parsed.maTaiKhoan;
        setMaTaiKhoan(maTK);

        // Fetch song song: (1) tất cả SP hoàn thành trong đơn, (2) đánh giá của tôi
        const [chiTietRes, myReviewRes] = await Promise.all([
          maDonHang && idRestaurant
            ? api.get(`/danh-gia/san-pham-hoan-thanh/${maDonHang}/${idRestaurant}`)
            : api.get('/danh-gia/can-danh-gia'),
          api.get('/danh-gia/my-reviews'),
        ]);

        const chiTiets: any[] = chiTietRes.data || [];
        const myReviews: any[] = myReviewRes.data || [];

        // Tập hợp maSanPham đã đánh giá
        const reviewedMap = new Map<number, { soSao: number; noiDung: string }>();
        myReviews.forEach((r) => {
          reviewedMap.set(r.id.maSanPham, { soSao: r.soSao, noiDung: r.noiDung || '' });
        });

        // Deduplicate theo maSanPham
        const map = new Map<number, SanPhamItem>();
        chiTiets.forEach((ct) => {
          const maSP: number = ct.id?.maSanPham ?? ct.maSanPham;
          if (!map.has(maSP)) {
            map.set(maSP, {
              maSanPham: maSP,
              tenSanPham: ct.sanPham?.tenSanPham ?? '',
              urlAnh: ct.sanPham?.danhSachAnh?.[0]?.urlAnh,
            });
          }
        });

        const list = Array.from(map.values());
        setSanPhams(list);

        // Khởi form — nếu đã đánh giá thì pre-fill và disable
        const initForms: Record<number, FormItem> = {};
        list.forEach((sp) => {
          const existing = reviewedMap.get(sp.maSanPham);
          if (existing) {
            initForms[sp.maSanPham] = {
              soSao: existing.soSao,
              noiDung: existing.noiDung,
              daDanhGia: true,
              soSaoCu: existing.soSao,
              noiDungCu: existing.noiDung,
            };
          } else {
            initForms[sp.maSanPham] = { soSao: 5, noiDung: '', daDanhGia: false };
          }
        });
        setForms(initForms);
      } catch (err) {
        console.error(err);
        Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [maDonHang, idRestaurant]);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmitAll = async () => {
    if (!maTaiKhoan) return;
    const pending = sanPhams.filter((sp) => !forms[sp.maSanPham]?.daDanhGia);

    if (pending.length === 0) {
      Alert.alert('Thông báo', 'Tất cả món đã được đánh giá rồi!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }

    setSubmitting(true);
    let success = 0;

    for (const sp of pending) {
      const form = forms[sp.maSanPham];
      try {
        await api.post('/danh-gia', {
          id: { maTaiKhoan, maSanPham: sp.maSanPham },
          soSao: form.soSao,
          noiDung: form.noiDung.trim(),
          ngayDanhGia: new Date().toISOString(),
        });
        setForms((prev) => ({
          ...prev,
          [sp.maSanPham]: { ...prev[sp.maSanPham], daDanhGia: true },
        }));
        success++;
      } catch (err: any) {
        // 409 = đã đánh giá (duplicate key) — mark done
        if (err?.response?.status === 409 || err?.response?.status === 500) {
          setForms((prev) => ({
            ...prev,
            [sp.maSanPham]: { ...prev[sp.maSanPham], daDanhGia: true },
          }));
        } else {
          console.warn('Lỗi đánh giá sp', sp.maSanPham, err);
        }
      }
    }

    setSubmitting(false);
    Alert.alert(
      'Hoàn thành!',
      `Đã gửi ${success} đánh giá. Cảm ơn bạn!`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const pendingCount = sanPhams.filter((sp) => !forms[sp.maSanPham]?.daDanhGia).length;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá món ăn</Text>
        <View style={{ width: 34 }} />
      </View>

      {sanPhams.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.green} />
          <Text style={styles.emptyText}>Chưa có món nào hoàn thành trong đơn này.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>
            {pendingCount > 0
              ? `${pendingCount} món chưa đánh giá — chọn số sao và nhận xét`
              : 'Bạn đã đánh giá tất cả món trong đơn này ✓'}
          </Text>

          <FlatList
            data={sanPhams}
            keyExtractor={(item) => item.maSanPham.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const form = forms[item.maSanPham];
              const done = form?.daDanhGia;

              return (
                <View style={[styles.card, done && styles.cardDone]}>
                  {/* Ảnh + tên */}
                  <View style={styles.cardTop}>
                    {item.urlAnh ? (
                      <Image
                        source={{ uri: getImageUrl(item.urlAnh) }}
                        style={styles.foodImg}
                      />
                    ) : (
                      <View style={[styles.foodImg, styles.imgPlaceholder]}>
                        <Ionicons name="fast-food-outline" size={28} color={COLORS.textSec} />
                      </View>
                    )}
                    <Text style={styles.foodName} numberOfLines={2}>{item.tenSanPham}</Text>
                    {done && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={COLORS.green}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                  </View>

                  {/* Stars */}
                  <StarPicker
                    value={form?.soSao ?? 5}
                    onChange={(s) =>
                      setForms((prev) => ({
                        ...prev,
                        [item.maSanPham]: { ...prev[item.maSanPham], soSao: s },
                      }))
                    }
                    disabled={!!done}
                  />

                  {/* Nhận xét */}
                  <TextInput
                    style={[styles.textarea, done && styles.textareaDisabled]}
                    placeholder="Nhận xét của bạn (không bắt buộc)..."
                    multiline
                    numberOfLines={3}
                    value={form?.noiDung ?? ''}
                    onChangeText={(t) =>
                      setForms((prev) => ({
                        ...prev,
                        [item.maSanPham]: { ...prev[item.maSanPham], noiDung: t },
                      }))
                    }
                    editable={!done}
                  />

                  {done && (
                    <Text style={styles.doneLabel}>
                      ✓ Đã đánh giá {form.soSaoCu ? `(${form.soSaoCu}⭐)` : ''}
                    </Text>
                  )}
                </View>
              );
            }}
          />

          {/* Footer */}
          {pendingCount > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                onPress={handleSubmitAll}
                disabled={submitting}
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                    <Text style={styles.submitText}>
                      Gửi đánh giá ({pendingCount} món)
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyText: { marginTop: 12, fontSize: 16, color: COLORS.textSec, textAlign: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },

  subtitle: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    fontSize: 13, color: COLORS.textSec,
  },

  listContent: { padding: 16, paddingBottom: 120 },

  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    marginBottom: 14, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  cardDone: { backgroundColor: '#F0FFF4' },

  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  foodImg: { width: 56, height: 56, borderRadius: 10, backgroundColor: COLORS.lightGray },
  imgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  foodName: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },

  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  starLabel: { marginLeft: 8, fontSize: 13, color: COLORS.textSec, fontWeight: '600' },

  textarea: {
    borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10,
    padding: 10, fontSize: 14, color: COLORS.textMain,
    minHeight: 65, textAlignVertical: 'top',
  },
  textareaDisabled: { backgroundColor: '#F5F5F5', color: COLORS.textSec },

  doneLabel: { marginTop: 8, fontSize: 13, color: COLORS.green, fontWeight: '600' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: COLORS.lightGray,
  },
  submitBtn: {
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 6,
  },
  submitBtnDisabled: { backgroundColor: '#ccc', elevation: 0 },
  submitText: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
});

