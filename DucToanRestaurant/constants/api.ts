import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP_ADDRESS = '10.6.61.67';
const PORT = '8080';

export const BASE_URL = `http://${IP_ADDRESS}:${PORT}/api`;
export const BASE_URL_IMG= `http://${IP_ADDRESS}:${PORT}/uploads`;

export const ENDPOINTS = {
    AUTH: `${BASE_URL}/auth/login`,
    KHACH_HANG: `${BASE_URL}/khach-hang`,
    BAN: `${BASE_URL}/ban`,
    CHECK_EMAIL: `${BASE_URL}/khach-hang/check-email`,
    CHECK_PHONE: `${BASE_URL}/khach-hang/check-phone`,
    SAN_PHAM: `${BASE_URL}/san-pham`,
    DANH_MUC: `${BASE_URL}/danh-muc`,
    NHAN_VIEN: `${BASE_URL}/nhan-vien`,
    DANH_GIA: `${BASE_URL}/danh-gia`,
    RESTAURANT: `${BASE_URL}/restaurant`,
    YEU_CAU_DON: `${BASE_URL}/yeu-cau-don`,
    KHUYEN_MAI: `${BASE_URL}/khuyen-mai`,
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
