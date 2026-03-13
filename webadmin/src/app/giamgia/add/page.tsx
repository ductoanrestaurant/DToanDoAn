'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/constants/api';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft } from 'lucide-react';

const AddGiamGiaPage = () => {
    const [code, setCode] = useState('');
    const [moTa, setMoTa] = useState('');
    const [giaTri, setGiaTri] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const discountData = { code, moTa, giaTri };
            const response = await api.post('/giam-gia', discountData, {
                headers: { 'Content-Type': 'application/json' },
            });

            const newDiscount = response.data;
            const discountId = newDiscount.idGiamGia;

            if (file && discountId) {
                const imageFormData = new FormData();
                imageFormData.append('file', file);
                await api.post(`/giam-gia/${discountId}/upload-image`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            alert('Thêm mã giảm giá thành công!');
            router.push('/giamgia');
        } catch (err) {
            setError('Không thể thêm mã giảm giá. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-[#f1f5f9] min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="flex items-center mb-8">
                    <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 ml-4">Thêm Mã Giảm Giá Mới</h1>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">Mã Code</label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="moTa" className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                            <textarea
                                id="moTa"
                                value={moTa}
                                onChange={(e) => setMoTa(e.target.value)}
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="giaTri" className="block text-sm font-medium text-gray-700 mb-2">Giá trị (%)</label>
                            <input
                                type="number"
                                id="giaTri"
                                value={giaTri}
                                onChange={(e) => setGiaTri(Number(e.target.value))}
                                required
                                min={0}
                                max={100}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                            <div className="mt-2 flex items-center gap-6">
                                {preview ? (
                                    <img src={preview} alt="Xem trước" className="w-32 h-32 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Xem trước</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => router.push('/giamgia')} className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition">
                                Hủy
                            </button>
                            <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-blue-300">
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddGiamGiaPage;
