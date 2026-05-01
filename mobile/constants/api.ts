import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Production URL - Render deployment
export const BASE_URL = 'https://dtoandoan.onrender.com/api';
export const BASE_URL_IMG = 'https://dtoandoan.onrender.com/uploads';
export const WEBSOCKET_URL = 'wss://dtoandoan.onrender.com/ws';

/**
 * Trả về URL ảnh đúng:
 * - Nếu urlAnh là full URL (Cloudinary) → dùng trực tiếp
 * - Nếu urlAnh là tên file cũ → ghép với BASE_URL_IMG
 */
export const getImageUrl = (urlAnh: string | null | undefined): string => {
  if (!urlAnh) return '';
  if (urlAnh.startsWith('http://') || urlAnh.startsWith('https://')) {
    return urlAnh; // Cloudinary URL — dùng trực tiếp
  }
  return `${BASE_URL_IMG}/${urlAnh}`; // Ảnh local cũ
};

export const ENDPOINTS = {
    AUTH: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    KHACH_HANG: `${BASE_URL}/khach-hang`,
    BAN: `${BASE_URL}/ban`,
    CHECK_EMAIL: `${BASE_URL}/khach-hang/check-email`,
    CHECK_PHONE: `${BASE_URL}/khach-hang/check-phone`,
    SAN_PHAM: `${BASE_URL}/san-pham`,
    SAN_PHAM_MENU: `${BASE_URL}/san-pham/menu`,
    DANH_MUC: `${BASE_URL}/danh-muc`,
    NHAN_VIEN: `${BASE_URL}/nhan-vien`,
    DANH_GIA: `${BASE_URL}/danh-gia`,
    RESTAURANT: `${BASE_URL}/restaurant`,
    YEU_CAU_DON: `${BASE_URL}/yeu-cau-don`,
    KHUYEN_MAI: `${BASE_URL}/khuyen-mai`,
    GIAM_GIA: `${BASE_URL}/giam-gia`,
    // Chat endpoints
    CHAT_MESSAGES: `${BASE_URL}/chat`,
    CHAT_USERS: `${BASE_URL}/chat/users`,

    AI_CHAT: `${BASE_URL}/chat/gemini`,

    // Payment endpoints
    CREATE_PAYOS_PAYMENT: `${BASE_URL}/payment/create-payment`,
};


const api = axios.create({
    baseURL: BASE_URL,
});


api.interceptors.request.use(
    async (config) => {
        if (config.url === ENDPOINTS.AUTH) {
            return config;
        }

        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
