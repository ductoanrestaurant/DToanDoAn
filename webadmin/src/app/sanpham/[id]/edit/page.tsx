'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Save, XCircle, Plus, Loader2 } from 'lucide-react';
import api, { BASE_URL_IMG } from '@/constants/api';
import Link from 'next/link';

// --- Types ---
interface ListImage {
    idAnh?: number;
    urlAnh: string;
    /** blob URL chỉ dùng để preview trên client, không gửi lên server */
    previewUrl?: string;
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [sanPham, setSanPham] = useState<SanPhamDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        tenSanPham: '',
        moTa: '',
        gia: 0,
        maDanhMuc: 0,
        danhSachAnh: [] as ListImage[],
    });
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
    /** Ảnh đang được upload (hiện spinner) */
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const getDisplayUrl = (img: ListImage) => {
        // Ưu tiên blob preview URL (ảnh vừa chọn chưa/đang upload)
        if (img.previewUrl) return img.previewUrl;
        if (!img.urlAnh) return '';
        return `${BASE_URL_IMG}/${img.urlAnh}`;
    };

    // ── Fetch data ──────────────────────────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }
        if (!id) { setLoading(false); setError('Thiếu thông tin mã sản phẩm.'); return; }

        const fetchAll = async () => {
            try {
                const [sanPhamRes, danhMucRes] = await Promise.all([
                    api.get(`/san-pham/${id}`),
                    api.get('/danh-muc'),
                ]);
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
            } catch (err) {
                setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id, router]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'gia' || name === 'maDanhMuc' ? Number(value) : value,
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => {
            const img = prev.danhSachAnh[index];
            // Giải phóng blob URL nếu có
            if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
            return {
                ...prev,
                danhSachAnh: prev.danhSachAnh.filter((_, i) => i !== index),
            };
        });
    };

    /**
     * Khi chọn file:
     * 1. Tạo blob URL → hiện preview ngay
     * 2. Upload lên server
     * 3. Thay thế blob URL bằng urlAnh thật từ server (tên file đúng)
     */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sanPham) return;

        // Reset input để có thể chọn lại cùng file nếu cần
        e.target.value = '';

        // Bước 1: Preview ngay
        const previewUrl = URL.createObjectURL(file);
        const placeholderIndex = formData.danhSachAnh.length;
        const placeholder: ListImage = { urlAnh: '', previewUrl };

        setFormData((prev) => ({
            ...prev,
            danhSachAnh: [...prev.danhSachAnh, placeholder],
        }));
        setUploadingIndex(placeholderIndex);

        // Bước 2: Upload
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);

            const response = await api.post(`/san-pham/${sanPham.maSanPham}/upload-image`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const savedImage: ListImage = response.data; // { idAnh, urlAnh: "tên-file.jpg" }

            // Bước 3: Thay placeholder bằng ảnh thật (giữ previewUrl để hiện luôn)
            URL.revokeObjectURL(previewUrl);
            setFormData((prev) => {
                const updated = [...prev.danhSachAnh];
                updated[placeholderIndex] = {
                    idAnh: savedImage.idAnh,
                    urlAnh: savedImage.urlAnh, // tên file đúng từ server
                };
                return { ...prev, danhSachAnh: updated };
            });
        } catch (err) {
            console.error('Upload thất bại:', err);
            // Xóa placeholder nếu upload lỗi
            URL.revokeObjectURL(previewUrl);
            setFormData((prev) => ({
                ...prev,
                danhSachAnh: prev.danhSachAnh.filter((_, i) => i !== placeholderIndex),
            }));
            alert('Tải ảnh lên thất bại. Vui lòng thử lại.');
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sanPham) return;

        // Không lưu nếu đang upload ảnh
        if (uploadingIndex !== null) {
            alert('Vui lòng chờ ảnh tải lên xong trước khi lưu.');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                maSanPham: sanPham.maSanPham,
                tenSanPham: formData.tenSanPham,
                moTa: formData.moTa,
                gia: formData.gia,
                danhMuc: danhMucs.find((dm) => dm.maDanhMuc === formData.maDanhMuc) || sanPham.danhMuc,
                // Gửi chỉ idAnh + urlAnh, bỏ previewUrl
                danhSachAnh: formData.danhSachAnh.map(({ idAnh, urlAnh }) => ({ idAnh, urlAnh })),
            };

            await api.put(`/san-pham/${sanPham.maSanPham}`, payload);
            alert('Cập nhật sản phẩm thành công!');
            router.push(`/sanpham/${sanPham.maSanPham}`);
        } catch (err) {
            console.error(err);
            alert('Lỗi khi cập nhật sản phẩm.');
        } finally {
            setSaving(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    if (loading) return <div className="flex min-h-screen items-center justify-center font-bold text-slate-700">Đang tải dữ liệu...</div>;
    if (error || !sanPham) return <div className="flex min-h-screen items-center justify-center text-red-600 font-bold">{error}</div>;

    const inputCls = "mt-1 block w-full rounded-lg border-slate-400 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-base p-3 text-slate-900 bg-white placeholder:text-slate-500 transition-all";

    return (
        <div className="flex bg-[#F1F5F9] min-h-screen font-sans">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 max-w-[1400px]">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/sanpham/${sanPham.maSanPham}`} className="p-2 rounded-full hover:bg-slate-200 transition">
                        <ChevronLeft size={28} className="text-slate-700" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Chỉnh sửa Sản phẩm #{sanPham.maSanPham}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Thông tin ── */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="tenSanPham" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Tên sản phẩm</label>
                                <input type="text" id="tenSanPham" name="tenSanPham" value={formData.tenSanPham} onChange={handleChange} className={inputCls} required />
                            </div>
                            <div>
                                <label htmlFor="moTa" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Mô tả</label>
                                <textarea id="moTa" name="moTa" value={formData.moTa} onChange={handleChange} rows={5} className={inputCls} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="gia" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Giá bán (VNĐ)</label>
                                    <input type="number" id="gia" name="gia" value={formData.gia} onChange={handleChange} className={inputCls} required min="0" />
                                </div>
                                <div>
                                    <label htmlFor="maDanhMuc" className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Danh mục</label>
                                    <select id="maDanhMuc" name="maDanhMuc" value={formData.maDanhMuc} onChange={handleChange} className={inputCls} required>
                                        <option value="0">Chọn danh mục</option>
                                        {danhMucs.map((dm) => (
                                            <option key={dm.maDanhMuc} value={dm.maDanhMuc}>{dm.tenDanhMuc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Ảnh & Hành động ── */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Hình ảnh */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Hình ảnh sản phẩm</h2>
                            <p className="text-xs text-slate-400 mb-3">Chọn file → ảnh sẽ tải lên và hiển thị ngay.</p>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Danh sách ảnh hiện tại */}
                                {formData.danhSachAnh.map((img, index) => (
                                    <div key={index} className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                        {/* Preview / ảnh thật */}
                                        <img
                                            src={getDisplayUrl(img)}
                                            alt={`Ảnh ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Spinner khi đang upload */}
                                        {uploadingIndex === index && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Loader2 size={28} className="text-white animate-spin" />
                                            </div>
                                        )}

                                        {/* Nút xóa (chỉ hiện khi không đang upload) */}
                                        {uploadingIndex !== index && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Nút thêm ảnh mới */}
                                <label className="relative w-full h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                                    <Plus size={30} />
                                    <span className="text-xs mt-1">Thêm ảnh</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        disabled={uploadingIndex !== null}
                                    />
                                </label>
                            </div>

                            {uploadingIndex !== null && (
                                <p className="mt-3 text-xs text-blue-500 flex items-center gap-1">
                                    <Loader2 size={12} className="animate-spin" /> Đang tải ảnh lên...
                                </p>
                            )}
                        </div>

                        {/* Hành động */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Hành động</h2>
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={saving || uploadingIndex !== null}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black text-lg rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
                                    {saving ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}
                                </button>
                                <Link href={`/sanpham/${sanPham.maSanPham}`} className="w-full">
                                    <button type="button" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
                                        <XCircle size={22} /> HỦY BỎ
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