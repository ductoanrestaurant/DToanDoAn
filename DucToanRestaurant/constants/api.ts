// Địa chỉ IP máy tính của bạn
const IP_ADDRESS = '10.6.61.59';
const PORT = '8080';

export const BASE_URL = `http://${IP_ADDRESS}:${PORT}/api`;
export const BASE_URL_IMG= `http://${IP_ADDRESS}:${PORT}/uploads`;

export const ENDPOINTS = {
    KHACH_HANG: `${BASE_URL}/khach-hang`,
    BAN: `${BASE_URL}/ban`,
    // Sau này bạn có thể thêm các endpoint khác tại đây
    // MON_AN: `${BASE_URL}/mon-an`,
    // DON_HANG: `${BASE_URL}/don-hang`,
    CHECK_EMAIL: `${BASE_URL}/khach-hang/check-email`,
    SAN_PHAM: `${BASE_URL}/san-pham`,
    DANH_MUC: `${BASE_URL}/danh-muc`,
    NHAN_VIEN: `${BASE_URL}/nhan-vien`,
    DANH_GIA: `${BASE_URL}/danh-gia`,
};

export default {
    BASE_URL,
    ENDPOINTS
};