'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Tag, Users, Save, XCircle, Info } from 'lucide-react';
import api from '@/constants/api';
import Link from 'next/link';

interface IBan {
    id: { maBan: number; idRestaurant: number; };
    tenBan: string;
    sucChua: number;
    trangThai: boolean;
}

export default function EditBanPage() {
    const router = useRouter();
    const params = useParams();
    const [ban, setBan] = useState<IBan | null>(null);
    const [tenBan, setTenBan] = useState('');
    const [sucChua, setSucChua] = useState(0);
    const [trangThai, setTrangThai] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const slug = params.slug as string[] | undefined;
    const maBan = slug ? parseInt(slug[0], 10) : null;
    const idRestaurant = slug ? parseInt(slug[1], 10) : null;

    useEffect(() => {
        if (maBan && idRestaurant) {
            const fetchBan = async () => {
                try {
                    const response = await api.get(`/ban/${maBan}/${idRestaurant}`);
                    const data: IBan = response.data;
                    setBan(data);
                    setTenBan(data.tenBan);
                    setSucChua(data.sucChua);
                    setTrangThai(data.trangThai);
                } catch (err) {
                    setError('Không thể tải thông tin bàn.');
                } finally {
                    setLoading(false);
                }
            };
            fetchBan();
        }
    }, [maBan, idRestaurant]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/ban/${maBan}/${idRestaurant}`, { tenBan, sucChua, trangThai });
            router.push('/ban');
        } catch (error) {
            setError('Cập nhật bàn thất bại.');
        }
    };

    if (loading) return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex justify-center items-center font-bold text-slate-600">Đang tải dữ liệu...</div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar cố định chiều rộng để không che main */}
            <div className="shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chỉnh Sửa Bàn</h1>
                            <p className="text-slate-500 font-medium">Cập nhật thông tin chi tiết cho {tenBan || 'bàn ăn'}</p>
                        </div>
                        <Link href="/ban" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors group">
                            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Quay lại
                        </Link>
                    </div>

                    {/* Form chính */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 space-y-8">

                            {/* Input Tên Bàn */}
                            <div className="space-y-2">
                                <label htmlFor="tenBan" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
                                    <Tag size={16} className="text-indigo-500" /> Tên Bàn
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="tenBan"
                                        value={tenBan}
                                        onChange={(e) => setTenBan(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold text-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="Nhập tên bàn..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input Sức Chứa */}
                            <div className="space-y-2">
                                <label htmlFor="sucChua" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
                                    <Users size={16} className="text-indigo-500" /> Sức Chứa (Người)
                                </label>
                                <input
                                    type="number"
                                    id="sucChua"
                                    value={sucChua}
                                    onChange={(e) => setSucChua(Number(e.target.value))}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold text-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Checkbox Trạng Thái */}
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="trangThai"
                                            checked={trangThai}
                                            onChange={(e) => setTrangThai(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-12 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </div>
                                    <span className="ml-4 text-slate-700 font-bold">
                                        Dừng hoạt động: {trangThai ? <span className="text-amber-600">Dừng hoạt động</span> : <span className="text-emerald-600">Đang hoạt động</span>}
                                    </span>
                                </label>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold">
                                    <Info size={18} /> {error}
                                </div>
                            )}
                        </div>

                        {/* Footer Form Buttons */}
                        <div className="bg-slate-50 px-8 py-6 flex items-center justify-end gap-4 border-t border-slate-200">
                            <Link href="/ban" className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 transition-colors">
                                Hủy bỏ
                            </Link>
                            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
                                <Save size={20} />
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}