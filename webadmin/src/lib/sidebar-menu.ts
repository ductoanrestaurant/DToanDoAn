export type Role = 'QUAN_LY' | 'THU_NGAN' | 'BEP';

/** Thứ tự và quyền menu - dùng cho Sidebar và redirect sau login */
export const MENU_ROUTES: { href: string; allowedRoles: Role[] }[] = [
  { href: '/doanhthu', allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
  { href: '/tin-nhan', allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
  { href: '/donhang', allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
  { href: '/sanpham', allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
  { href: '/ban', allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
  { href: '/khachhang', allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
  { href: '/nhanvien', allowedRoles: ['QUAN_LY'] },
  { href: '/khohang', allowedRoles: ['QUAN_LY', 'BEP'] },
  { href: '/congthuc', allowedRoles: ['QUAN_LY', 'BEP'] },
  { href: '/nhaphang', allowedRoles: ['QUAN_LY', 'BEP'] },
  { href: '/bep', allowedRoles: ['BEP', 'QUAN_LY'] },
  { href: '/giamgia', allowedRoles: ['QUAN_LY'] },
];

/** Trả về trang đầu tiên mà role được phép truy cập */
export function getFirstRouteForRole(role: string): string {
  const item = MENU_ROUTES.find((r) => r.allowedRoles.includes(role as Role));
  return item?.href ?? '/doanhthu';
}
