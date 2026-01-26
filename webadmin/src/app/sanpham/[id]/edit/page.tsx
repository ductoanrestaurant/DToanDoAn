'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

interface SanPhamDetail {
    maSanPham: number;
    tenSanPham: string;
    moTa: string;
    gia: number;
    danhSachAnh: ListImage[];
    danhMuc: DanhMuc;
}

export default function SanPhamEditPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [sanPham, setSanPham] = useState<SanPhamDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        tenSanPham: '',
        moTa: '',
        gia: 0,
        maDanhMuc: 0,
        danhSachAnh: [] as ListImage[],
    });
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const getFullImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        return `${BASE_URL_IMG}/${imagePath}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        if (id) {
            const fetchSanPhamAndCategories = async () => {
                try {
                    const [sanPhamRes, danhMucRes] = await Promise.all([
                        api.get(`/san-pham/${id}`),
                        api.get('/danh-muc')
                    ]);

                    if (sanPhamRes.status !== 200 || danhMucRes.status !== 200) {
                        throw new Error('Không thể tải dữ liệu');
                    }

                    const fetchedSanPham: SanPhamDetail = sanPhamRes.data;
                    setSanPham(fetchedSanPham);
                    setDanhMucs(danhMucRes.data);

                    setFormData({
                        tenSanPham: fetchedSanPham.tenSanPham,
                        moTa: fetchedSanPham.moTa || '',
                        gia: fetchedSanPham.gia,
                        maDanhMuc: fetchedSanPham.danhMuc?.maDanhMuc || 0,
                        danhSachAnh: fetchedSanPham.danhSachAnh || [],
                    });

                } catch (err: unknown) {
                    setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSanPhamAndCategories();
        } else {
            setLoading(false);
            setError('Thiếu thông tin mã sản phẩm.');
        }
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'gia' || name === 'maDanhMuc' ? Number(value) : value,
        }));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            danhSachAnh: prev.danhSachAnh.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUploadImage = async () => {
        if (!selectedFile || !sanPham) {
            alert('Vui lòng chọn một file ảnh.');
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);

        try {
            const response = await api.post(`/san-pham/${sanPham.maSanPham}/upload-image`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                const newImage: ListImage = response.data;
                setFormData((prev) => ({
                    ...prev,
                    danhSachAnh: [...prev.danhSachAnh, newImage],
                }));
                setSelectedFile(null);
                alert('Tải ảnh lên thành công!');
            }
        } catch (err: unknown) {
            alert('Lỗi khi tải ảnh lên.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sanPham) return;

        try {
            const updatedSanPham = {
                maSanPham: sanPham.maSanPham,
                tenSanPham: formData.tenSanPham,
                moTa: formData.moTa,
                gia: formData.gia,
                danhMuc: danhMucs.find(dm => dm.maDanhMuc === formData.maDanhMuc) || sanPham.danhMuc,
                danhSachAnh: formData.danhSachAnh,
            };

            const response = await api.put(`/san-pham/${sanPham.maSanPham}`, updatedSanPham);

            if (response.status === 200) {
                alert('Cập nhật sản phẩm thành công!');
                router.push(`/sanpham/${sanPham.maSanPham}`);
            }
        } catch (err: unknown) {
            alert('Lỗi khi cập nhật sản phẩm.');
        }
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center font-bold text-slate-700">Đang tải dữ liệu...</div>;
    if (error || !sanPham) return <div className="flex min-h-screen items-center justify-center text-red-600 font-bold">{error}</div>;

    // Lớp CSS cho input rõ nét
    const inputClassName = "mt-1 block w-full rounded-lg border-slate-400 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-base p-3 text-slate-900 bg-white placeholder:text-slate-500 transition-all";

    return (
        <div className="flex bg-[#F1F5F9] min-h-screen font-sans">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 max-w-[1400px]">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/sanpham/${sanPham.maSanPham}`} className="p-2 rounded-full hover:bg-slate-200 transition">
                        <ChevronLeft size={28} className="text-slate-700" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chỉnh sửa Sản phẩm #{sanPham.maSanPham}</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form chi tiết */}
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
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="moTa" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Mô tả</label>
                                <textarea
                                    id="moTa"
                                    name="moTa"
                                    value={formData.moTa}
                                    onChange={handleChange}
                                    rows={5}
                                    className={inputClassName}
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
                                        value={formData.maDanhMuc}
                                        onChange={handleChange}
                                        className={inputClassName}
                                        required
                                    >
                                        <option value="0">Chọn danh mục</option>
                                        {danhMucs.map((dm) => (
                                            <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                                                {dm.tenDanhMuc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quản lý ảnh & Nút hành động */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Hình ảnh sản phẩm</h2>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {formData.danhSachAnh.map((img, index) => (
                                    <div key={index} className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                        <img src={getFullImageUrl(img.urlAnh)} alt="product" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                ))}

                                <div className="relative w-full h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer overflow-hidden">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    {selectedFile ? (
                                        <span className="text-xs text-center px-2 font-bold text-blue-600">{selectedFile.name}</span>
                                    ) : (
                                        <Plus size={30} />
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleUploadImage}
                                disabled={!selectedFile || uploading}
                                className="w-full py-2.5 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed uppercase text-sm tracking-wide"
                            >
                                {uploading ? 'Đang tải lên...' : 'Xác nhận tải ảnh'}
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Hành động</h2>
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black text-lg rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                                >
                                    <Save size={22}/> LƯU THAY ĐỔI
                                </button>
                                <Link href={`/sanpham/${sanPham.maSanPham}`} className="w-full">
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