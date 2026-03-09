'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { BASE_URL_IMG } from '@/constants/api';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Search, PlusCircle, Edit, Trash2, ImageIcon } from 'lucide-react';
// import Image from 'next/image'; // Tạm thời không dùng next/image

interface GiamGia {
    idGiamGia: number;
    code: string;
    moTa: string;
    giaTri: number;
    urlAnh: string | null;
}

const GiamGiaPage = () => {
    const [giamgias, setGiamgias] = useState<GiamGia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchGiamGias = async () => {
        try {
            setLoading(true);
            const response = await api.get('/giam-gia');
            setGiamgias(response.data);
        } catch (error) {
            console.error("Failed to fetch discounts:", error);
            setError("Không thể tải danh sách mã giảm giá.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchGiamGias();
    }, [router]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) {
            try {
                await api.delete(`/giam-gia/${id}`);
                alert('Xóa mã giảm giá thành công!');
                setGiamgias(giamgias.filter(gg => gg.idGiamGia !== id));
            } catch (error) {
                console.error("Failed to delete discount:", error);
                alert('Đã có lỗi xảy ra khi xóa mã giảm giá.');
            }
        }
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-100"><p>Đang tải...</p></div>;
    }

    if (error) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-100"><p className="text-red-500">{error}</p></div>;
    }

    return (
        <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Mã Giảm Giá</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm mã giảm giá..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <Link href="/giamgia/add" className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-sm font-medium hover:bg-blue-700 transition">
                            <PlusCircle size={20} /> Thêm mới
                        </Link>
                    </div>
                </header>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                                    <th className="p-4 font-medium">Ảnh</th>
                                    <th className="p-4 font-medium">Mã Code</th>
                                    <th className="p-4 font-medium">Mô tả</th>
                                    <th className="p-4 font-medium">Giá trị</th>
                                    <th className="p-4 font-medium text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {giamgias.map((gg) => (
                                    <tr key={gg.idGiamGia} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition">
                                        <td className="p-4">
                                            {gg.urlAnh ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={`${BASE_URL_IMG}/${gg.urlAnh}`} 
                                                    alt={gg.code} 
                                                    width={96} 
                                                    height={96} 
                                                    className="object-cover rounded-md w-24 h-24"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                                                    <ImageIcon size={32} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-blue-600 font-semibold">{gg.code}</td>
                                        <td className="p-4 text-gray-800">{gg.moTa}</td>
                                        <td className="p-4 font-bold text-green-600">{gg.giaTri.toLocaleString('vi-VN')}%</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center gap-4">
                                                <button onClick={() => router.push(`/giamgia/edit/${gg.idGiamGia}`)} className="text-blue-600 hover:text-blue-800 transition">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(gg.idGiamGia)} className="text-red-600 hover:text-red-800 transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">Hiển thị 1 đến {giamgias.length} của {giamgias.length} kết quả</p>
                        {/* Pagination can be added here */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GiamGiaPage;
