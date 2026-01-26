'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Tag, DollarSign, Image as ImageIcon, Save, XCircle, Plus, Trash2 } from 'lucide-react';
import api, { BASE_URL_IMG } from '@/constants/api';
import Link from 'next/link';

// --- Types ---
interface ListImage {
  idAnh?: number; // idAnh might be present for existing images
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
  const { id } = params; // Get product ID from URL

  const [sanPham, setSanPham] = useState<SanPhamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tenSanPham: '',
    moTa: '',
    gia: 0,
    maDanhMuc: 0, // Store maDanhMuc for dropdown
    danhSachAnh: [] as ListImage[], // Manage images here
  });
  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]); // For category dropdown

  // Function to construct the full image URL using BASE_URL_IMG
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
            api.get('/danh-muc') // Fetch all categories for the dropdown
          ]);

          if (sanPhamRes.status !== 200 || danhMucRes.status !== 200) {
            throw new Error('Failed to fetch data');
          }

          const fetchedSanPham: SanPhamDetail = sanPhamRes.data;
          setSanPham(fetchedSanPham);
          setDanhMucs(danhMucRes.data);

          // Initialize form data with fetched product details
          setFormData({
            tenSanPham: fetchedSanPham.tenSanPham,
            moTa: fetchedSanPham.moTa || '',
            gia: fetchedSanPham.gia,
            maDanhMuc: fetchedSanPham.danhMuc?.maDanhMuc || 0,
            danhSachAnh: fetchedSanPham.danhSachAnh || [], // Initialize with existing images
          });

        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
          }
          console.error('Error fetching SanPham detail or categories:', err);
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

  // Placeholder for adding new images (requires backend upload API)
  const handleAddImagePlaceholder = () => {
    alert('Chức năng thêm ảnh mới yêu cầu API upload file từ backend. Vui lòng liên hệ quản trị viên.');
    // In a real scenario, this would open a file input dialog
    // and then call a backend upload API.
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sanPham) return;

    try {
      // Construct the updated SanPham object
      const updatedSanPham = {
        maSanPham: sanPham.maSanPham, // Ensure maSanPham is included
        tenSanPham: formData.tenSanPham,
        moTa: formData.moTa,
        gia: formData.gia,
        // Find the full category object to send to backend
        danhMuc: danhMucs.find(dm => dm.maDanhMuc === formData.maDanhMuc) || sanPham.danhMuc,
        danhSachAnh: formData.danhSachAnh, // Send the updated image list
      };

      const response = await api.put(`/san-pham/${sanPham.maSanPham}`, updatedSanPham);

      if (response.status === 200) {
        alert('Cập nhật sản phẩm thành công!');
        router.push(`/sanpham/${sanPham.maSanPham}`); // Go back to detail page
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Lỗi khi cập nhật sản phẩm: ${err.message}`);
      } else {
        alert('Đã xảy ra lỗi không xác định khi cập nhật sản phẩm.');
      }
      console.error('Error updating product:', err);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Đang tải dữ liệu sản phẩm...</p></div>;
  }

  if (error || !sanPham) {
    return <div className="flex min-h-screen items-center justify-center"><p>{error}</p></div>;
  }

  const mainImageUrl = formData.danhSachAnh && formData.danhSachAnh.length > 0
    ? getFullImageUrl(formData.danhSachAnh[0].urlAnh)
    : '';

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Link href={`/sanpham/${sanPham.maSanPham}`} className="p-2 rounded-full hover:bg-gray-200 transition">
                <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Chỉnh sửa Sản phẩm #{sanPham.maSanPham}</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Details Form */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="tenSanPham" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                        <input
                            type="text"
                            id="tenSanPham"
                            name="tenSanPham"
                            value={formData.tenSanPham}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="moTa" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                            id="moTa"
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="gia" className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                        <input
                            type="number"
                            id="gia"
                            name="gia"
                            value={formData.gia}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="maDanhMuc" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <select
                            id="maDanhMuc"
                            name="maDanhMuc"
                            value={formData.maDanhMuc}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {danhMucs.map((dm) => (
                                <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                                    {dm.tenDanhMuc}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Image Management & Actions */}
            <div className="lg:col-span-1 space-y-6">
                {/* Image List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Hình ảnh sản phẩm</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {formData.danhSachAnh.map((img, index) => (
                            <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center group">
                                <img src={getFullImageUrl(img.urlAnh)} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    title="Xóa ảnh này"
                                >
                                    <XCircle size={16} />
                                </button>
                            </div>
                        ))}
                        {/* Placeholder for Add New Image */}
                        <button
                            type="button"
                            onClick={handleAddImagePlaceholder}
                            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
                            title="Thêm ảnh mới (cần API backend)"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        * Chức năng thêm ảnh mới yêu cầu API upload file từ backend.
                    </p>
                </div>

                {/* Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Hành động</h2>
                    <div className="flex flex-col gap-3">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                            <Save size={20}/> Lưu thay đổi
                        </button>
                        <Link href={`/sanpham/${sanPham.maSanPham}`} className="w-full">
                            <button type="button" className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition">
                                <XCircle size={20}/> Hủy bỏ
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
