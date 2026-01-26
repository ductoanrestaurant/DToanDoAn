'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Tag, DollarSign, Image as ImageIcon, Save, XCircle, Plus, Trash2 } from 'lucide-react';
import api, { BASE_URL_IMG } from '@/constants/api';
import Link from 'next/link';

// --- Types ---
interface ListImage {
    idAnh?: number;
    urlAnh: string;
}

interface DanhMuc {
    maDanhMuc: number;
    tenDanhMuc: string;
}

interface NewSanPhamData {
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhMuc: { maDanhMuc: number };
}

export default function SanPhamAddPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<NewSanPhamData & { danhSachAnh: ListImage[] }>({
        tenSanPham: '',
        moTa: '',
        gia: 0,
        danhMuc: { maDanhMuc: 0 },
        danhSachAnh: [],
    });
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchCategories = async () => {
            try {
                const response = await api.get('/danh-muc');
                if (response.status === 200) {
                    setDanhMucs(response.data);
                } else {
                    throw new Error('Failed to fetch categories');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Đã xảy ra lỗi không xác định khi tải danh mục.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'gia' ? Number(value) : value,
            danhMuc: name === 'maDanhMuc' ? { maDanhMuc: Number(value) } : prev.danhMuc,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleRemoveSelectedFile = (indexToRemove: number) => {
        setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.danhMuc.maDanhMuc === 0) {
            alert("Vui lòng chọn danh mục!");
            return;
        }

        setIsSubmitting(true);
        try {
            const productToCreate: NewSanPhamData = {
                tenSanPham: formData.tenSanPham,
                moTa: formData.moTa,
                gia: formData.gia,
                danhMuc: formData.danhMuc,
            };

            const createResponse = await api.post('/san-pham', productToCreate);
            const newSanPhamId = createResponse.data.maSanPham;

            if (selectedFiles.length > 0) {
                setUploading(true);
                const uploadPromises = selectedFiles.map(async (file) => {
                    const imageFormData = new FormData();
                    imageFormData.append('file', file);
                    return api.post(`/san-pham/${newSanPhamId}/upload-image`, imageFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                });
                await Promise.all(uploadPromises);
            }

            alert('Thêm sản phẩm mới thành công!');
            router.push('/sanpham');
        } catch (err: unknown) {
            alert('Đã xảy ra lỗi khi thêm sản phẩm.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setUploading(false);
        }
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center font-bold text-slate-700">Đang tải dữ liệu...</div>;
    if (error) return <div className="flex min-h-screen items-center justify-center text-red-600 font-bold">{error}</div>;

    // Lớp CSS dùng chung cho các ô nhập liệu để chữ cực rõ
    const inputClassName = "mt-1 block w-full rounded-lg border-slate-400 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-base p-3 text-slate-900 bg-white placeholder:text-slate-500 transition-colors";

    return (
        <div className="flex bg-[#F1F5F9] min-h-screen font-sans">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 max-w-[1400px]">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/sanpham" className="p-2 rounded-full hover:bg-slate-200 transition">
                        <ChevronLeft size={28} className="text-slate-700" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thêm Sản phẩm Mới</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Thông tin chi tiết */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="tenSanPham" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    id="tenSanPham"
                                    name="tenSanPham"
                                    value={formData.tenSanPham}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    placeholder="Nhập tên sản phẩm..."
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="moTa" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Mô tả chi tiết</label>
                                <textarea
                                    id="moTa"
                                    name="moTa"
                                    value={formData.moTa}
                                    onChange={handleChange}
                                    rows={5}
                                    className={inputClassName}
                                    placeholder="Mô tả đặc điểm nổi bật của sản phẩm..."
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="gia" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Giá bán (VNĐ)</label>
                                    <input
                                        type="number"
                                        id="gia"
                                        name="gia"
                                        value={formData.gia}
                                        onChange={handleChange}
                                        className={inputClassName}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="maDanhMuc" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Danh mục</label>
                                    <select
                                        id="maDanhMuc"
                                        name="maDanhMuc"
                                        value={formData.danhMuc.maDanhMuc}
                                        onChange={handleChange}
                                        className={inputClassName}
                                        required
                                    >
                                        <option value="0" className="text-slate-400">-- Chọn danh mục sản phẩm --</option>
                                        {danhMucs.map((dm) => (
                                            <option key={dm.maDanhMuc} value={dm.maDanhMuc} className="text-slate-900">
                                                {dm.tenDanhMuc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quản lý ảnh & Nút bấm */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Hình ảnh</h2>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                />
                            </div>
                            {selectedFiles.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSelectedFile(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                    <ImageIcon size={40} strokeWidth={1.5} />
                                    <span className="mt-2 text-sm font-medium">Chưa chọn ảnh nào</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Hành động</h2>
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploading}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black text-lg rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:bg-slate-400 active:scale-[0.98]"
                                >
                                    {isSubmitting || uploading ? 'ĐANG XỬ LÝ...' : <><Save size={22}/> LƯU SẢN PHẨM</>}
                                </button>
                                <Link href="/sanpham" className="w-full">
                                    <button type="button" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
                                        <XCircle size={22}/> HỦY BỎ
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}