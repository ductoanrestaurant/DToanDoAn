// src/components/Sidebar.tsx
import Link from 'next/link';
import { LayoutDashboard, PieChart, ShoppingBag, ShoppingCart, Users, Package, FileText, Settings, LogOut, MessageSquare } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-[#1e293b] text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">P</div>
                <span className="text-xl font-bold">Productly</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">Menu</p>
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-lg">
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Bảng điều khiển</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <PieChart size={20} />
                    <span>Phân tích</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <ShoppingBag size={20} />
                    <span>Doanh thu</span>
                </Link>

                <p className="px-4 text-xs font-semibold text-gray-400 uppercase mt-8 mb-2">Quản lý</p>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <ShoppingCart size={20} />
                    <span>Sản phẩm</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <Users size={20} />
                    <span>Khách hàng</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <Package size={20} />
                    <span>Kho hàng</span>
                </Link>
            </nav>

            {/* Footer User */}
            <div className="p-4 mt-auto">
                <div className="bg-[#2d3748] rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">AR</div>
                    <div>
                        <p className="text-sm font-semibold">AR Jakir</p>
                        <p className="text-xs text-gray-400">Quản lý bán lẻ</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}