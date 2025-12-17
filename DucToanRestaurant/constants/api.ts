// Địa chỉ IP máy tính của bạn
const IP_ADDRESS = '192.168.2.30'; 
const PORT = '8080';

export const BASE_URL = `http://${IP_ADDRESS}:${PORT}/api`;

export const ENDPOINTS = {
    KHACH_HANG: `${BASE_URL}/khach-hang`,
    // Sau này bạn có thể thêm các endpoint khác tại đây
    // MON_AN: `${BASE_URL}/mon-an`,
    // DON_HANG: `${BASE_URL}/don-hang`,
};

export default {
    BASE_URL,
    ENDPOINTS
};