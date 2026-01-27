'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Tag, Users, Save, XCircle, Info } from 'lucide-react';
import api from '@/constants/api';
import Link from 'next/link';

export default function AddBanPage() {
    const [tenBan, setTenBan] = useState('');
    const [sucChua, setSucChua] = useState(4);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const newBan = {
                id: {
                    idRestaurant: 1, // Thay bằng ID nhà hàng thực tế của bạn
                },
                tenBan,
                sucChua,
                trangThai: false, // Thường Backend quy định false là Trống/Sẵn sàng
            };

            // Log dữ liệu để kiểm tra trước khi gửi tránh lỗi 500
            console.log("Data gửi đi:", newBan);

            const response = await api.post('/ban', newBan);
            if (response.status === 200 || response.status === 201) {
                alert('Thêm bàn mới thành công!');
                router.push('/ban');
            }
        } catch (error: any) {
            console.error('Lỗi khi thêm bàn:', error);
            // Hiển thị lỗi chi tiết để xử lý lỗi 500
            alert(`Lỗi Server (500): ${error.response?.data?.message || 'Vui lòng kiểm tra lại mã bàn hoặc kết nối'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
            {/* Sidebar cố định bên trái */}
            <Sidebar />

            {/* Nội dung chính bên phải */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Thêm Bàn Mới</h1>
                            <p className="text-slate-500 font-medium">Khởi tạo bàn ăn mới cho hệ thống</p>
                        </div>
                        <Link href="/ban" className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:text-blue-600 transition-all shadow-sm">
                            <ChevronLeft size={20} />
                            <span>Quay lại</span>
                        </Link>
                    </div>

                    {/* Form Nhập liệu */}
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100">
                        <div className="space-y-6">

                            {/* Tên Bàn */}
                            <div>
                                <label htmlFor="tenBan" className="block text-slate-700 font-black uppercase tracking-widest text-xs mb-3 ml-1">
                                    Tên Bàn / Số Bàn
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        id="tenBan"
                                        value={tenBan}
                                        onChange={(e) => setTenBan(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 font-bold text-lg shadow-inner"
                                        placeholder="VD: Bàn 01, Bàn VIP..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Sức Chứa */}
                            <div>
                                <label htmlFor="sucChua" className="block text-slate-700 font-black uppercase tracking-widest text-xs mb-3 ml-1">
                                    Sức Chứa (Người)
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="number"
                                        id="sucChua"
                                        value={sucChua}
                                        onChange={(e) => setSucChua(Number(e.target.value))}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 font-bold text-lg shadow-inner"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Info Box thay cho Checkbox trạng thái */}
                            <div className="flex items-start gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                    <Info size={18} />
                                </div>
                                <div>
                                    <h4 className="text-emerald-900 font-bold text-sm">Trạng thái: Sẵn sàng phục vụ</h4>
                                    <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                                        Mặc định bàn mới tạo sẽ có trạng thái <strong>Trống</strong> để nhân viên có thể sắp xếp khách vào ngay lập tức.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
                            <Link href="/ban" className="flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all">
                                <XCircle className="mr-2" size={20} />
                                HỦY BỎ
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center px-10 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                <Save className="mr-2" size={20} />
                                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'LƯU THÔNG TIN'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}