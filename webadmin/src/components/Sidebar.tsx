'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

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
                {/* --- Group: Menu --- */}
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">
                    Tổng quan
                </p>

                <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                    <LayoutDashboard size={20} />
                    <span>Bảng điều khiển</span>
                </Link>
                <Link href="/doanhthu" className={getLinkClass('/doanhthu')}>
                    <CircleDollarSign size={20} />
                    <span>Doanh thu</span>
                </Link>
                <Link href="/tin-nhan" className={getLinkClass('/tin-nhan')}>
                    <MessageSquare size={20} />
                    <span>Tin nhắn</span>
                </Link>
                {/* <Link href="/thongbao" className={getLinkClass('/thongbao')}>
                    <Bell size={20} />
                    <span>Thông báo</span>
                </Link> */}

                {/* --- Group: Quản lý --- */}
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-8 mb-2">
                    Quản lý cửa hàng
                </p>

                <Link href="/donhang" className={getLinkClass('/donhang')}>
                    <ClipboardList size={20} />
                    <span>Đơn hàng</span>
                </Link>

                <Link href="/sanpham" className={getLinkClass('/sanpham')}>
                    <UtensilsCrossed size={20} />
                    <span>Sản phẩm (Menu)</span>
                </Link>

                <Link href="/ban" className={getLinkClass('/ban')}>
                    <Armchair size={20} />
                    <span>Quản lý Bàn</span>
                </Link>

                <Link href="/khachhang" className={getLinkClass('/khachhang')}>
                    <Users size={20} />
                    <span>Khách hàng</span>
                </Link>

                <Link href="/nhanvien" className={getLinkClass('/nhanvien')}>
                    <UserCog size={20} />
                    <span>Nhân viên</span>
                </Link>

                <Link href="/khohang" className={getLinkClass('/khohang')}>
                    <PackageOpen size={20} />
                    <span>Kho hàng</span>
                </Link>

                {/*<Link href="/quangcao" className={getLinkClass('/quangcao')}>*/}
                {/*    <Megaphone size={20} />*/}
                {/*    <span>Quảng cáo</span>*/}
                {/*</Link>*/}

                <Link href="/congthuc" className={getLinkClass('/congthuc')}>
                    <Utensils size={20} />
                    <span>Công thức món</span>
                </Link>

                <Link href="/nhaphang" className={getLinkClass('/nhaphang')}>
                    <Truck size={20} />
                    <span>Nhập hàng</span>
                </Link>

                <Link href="/bep" className={getLinkClass('/bep')}>
                    <Truck size={20} />
                    <span>Bếp</span>
                </Link>
            </nav>

            {/* Footer User Profile */}
            <div className="p-4 mt-auto border-t border-slate-700/50 bg-[#1e293b]">
                <div className="bg-[#2d3748] rounded-xl p-3 flex items-center gap-3 hover:bg-[#374151] transition cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:bg-blue-500 transition">
                        NV
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">Nguyễn Văn I</p>
                        <p className="text-xs text-gray-400 truncate">Quản lý chi nhánh</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}