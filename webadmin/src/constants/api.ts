import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
export const BASE_URL_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG || 'http://localhost:8080/uploads';

/**
 * Trả về URL ảnh đúng:
 * - Nếu urlAnh là full URL (Cloudinary) → dùng trực tiếp
 * - Nếu urlAnh là tên file cũ → ghép với BASE_URL_IMG
 */
export const getImageUrl = (urlAnh: string | null | undefined): string => {
  if (!urlAnh) return '/placeholder.png';
  if (urlAnh.startsWith('http://') || urlAnh.startsWith('https://')) {
    return urlAnh; // Cloudinary URL — dùng trực tiếp
  }
  return `${BASE_URL_IMG}/${urlAnh}`; // Ảnh local cũ
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động đính kèm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  AUTH: '/auth/login',
  KHACH_HANG: '/khach-hang',
  NHAN_VIEN: '/nhan-vien',
  NGUYEN_LIEU: '/nguyen-lieu',
  SAN_PHAM: '/san-pham',
  CONG_THUC: '/cong-thuc',
  NHAP_HANG: '/nhap-hang',
};

export default api;
