'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Truck,
    Bell,
    ClipboardList, // Đơn hàng
    UtensilsCrossed, // Sản phẩm (Món ăn)
    Armchair, // Quản lý bàn (Ghế/Chỗ ngồi)
    Users, // Khách hàng
    UserCog, // Nhân viên (Quản trị người dùng)
    PackageOpen, // Kho hàng
    Megaphone, // Quảng cáo
    CircleDollarSign, Utensils, // Doanh thu
    ChefHat,
    TicketPercent,
    LogOut, // Icon Đăng xuất
} from 'lucide-react';
import React, { useState, useEffect } from 'react';


type Role = 'QUAN_LY' | 'THU_NGAN' | 'BEP';

type MenuItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    allowedRoles: Role[];
};


const SIDEBAR_MENU: MenuItem[] = [
    { label: 'Doanh thu', href: '/doanhthu', icon: <CircleDollarSign size={20} />, allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
    { label: 'Tin nhắn', href: '/tin-nhan', icon: <MessageSquare size={20} />, allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
    { label: 'Đơn hàng', href: '/donhang', icon: <ClipboardList size={20} />, allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
    { label: 'Sản phẩm (Menu)', href: '/sanpham', icon: <UtensilsCrossed size={20} />, allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
    { label: 'Quản lý Bàn', href: '/ban', icon: <Armchair size={20} />, allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
    { label: 'Khách hàng', href: '/khachhang', icon: <Users size={20} />, allowedRoles: ['QUAN_LY', 'THU_NGAN'] },
    { label: 'Nhân viên', href: '/nhanvien', icon: <UserCog size={20} />, allowedRoles: ['QUAN_LY'] },
    { label: 'Kho hàng', href: '/khohang', icon: <PackageOpen size={20} />, allowedRoles: ['QUAN_LY', 'BEP'] },
    { label: 'Công thức món', href: '/congthuc', icon: <Utensils size={20} />, allowedRoles: ['QUAN_LY', 'BEP'] },
    { label: 'Nhập hàng', href: '/nhaphang', icon: <Truck size={20} />, allowedRoles: ['QUAN_LY', 'BEP'] },
    { label: 'Bếp', href: '/bep', icon: <ChefHat size={20} />, allowedRoles: ['BEP', 'QUAN_LY'] },
    { label: 'Mã Giảm Giá', href: '/giamgia', icon: <TicketPercent size={20} />, allowedRoles: ['QUAN_LY'] },
];


export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [role, setRole] = useState<string | null>(null);
    const [showLogout, setShowLogout] = useState(false); // State để điều khiển hiển thị nút đăng xuất

    useEffect(() => {
        const stored = localStorage.getItem('userRole');
        const id = requestAnimationFrame(() => setRole(stored));
        return () => cancelAnimationFrame(id);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/'); // Chuyển hướng về trang đăng nhập
    };


    const visibleMenu = role ? SIDEBAR_MENU.filter(item => item.allowedRoles.includes(role as Role)) : [];

    const getLinkClass = (path: string) => {
        // Logic: Active khi pathname trùng khớp hoàn toàn hoặc là trang con
        const isActive = path !== '#' && (pathname === path || pathname.startsWith(`${path}/`));

        const baseStyles = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";

        if (isActive) {
            return `${baseStyles} bg-white/10 text-white font-medium shadow-sm border border-white/5`;
        }
        return `${baseStyles} text-gray-400 hover:text-white hover:bg-white/5`;
    };

    return (
        <aside className="w-64 bg-[#1e293b] text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col border-r border-slate-700/50 shadow-xl z-50">
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3">
                <img
                    src="/assets/images/logo_ductoan_1.png"
                    alt="Logo Đức Toàn"
                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                />
                <span className="text-lg font-bold leading-tight tracking-wide">
                    Đức Toàn<br />Restaurant
                </span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-8 mb-2">
                    Quản lý cửa hàng
                </p>

                {visibleMenu.map(item => (
                    <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer User Profile */}
            <div className="p-4 mt-auto border-t border-slate-700/50 bg-[#1e293b]">
                {/* Nút đăng xuất - hiển thị có điều kiện */}
                {showLogout && (
                    <div className="pb-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-all duration-200"
                        >
                            <LogOut size={18} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                )}

                {/* Khu vực thông tin người dùng */}
                <div
                    className="bg-[#2d3748] rounded-xl p-3 flex items-center gap-3 hover:bg-[#374151] transition cursor-pointer group"
                    onClick={() => setShowLogout(!showLogout)} // Bấm để hiển thị/ẩn nút đăng xuất
                >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:bg-blue-500 transition">
                        NV
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{localStorage.getItem('maNhanVien')}-{localStorage.getItem('tenNhanVien')}</p>
                        <p className="text-xs text-gray-400 truncate">{localStorage.getItem('userRole')}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
