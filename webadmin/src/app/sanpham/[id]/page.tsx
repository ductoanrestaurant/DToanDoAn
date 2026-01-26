'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Tag, DollarSign, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import api, { BASE_URL_IMG } from '@/constants/api';
import Link from 'next/link';

// --- Types ---
interface ListImage {
  urlAnh: string;
}

interface SanPhamDetail {
  maSanPham: number;
  tenSanPham: string;
  moTa: string;
  gia: number;
  danhSachAnh: ListImage[];
  danhMuc: {
    maDanhMuc: number;
    tenDanhMuc: string;
  };
}

export default function SanPhamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Get product ID from URL

  const [sanPham, setSanPham] = useState<SanPhamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const fetchSanPhamDetail = async () => {
        try {
          const response = await api.get(`/san-pham/${id}`);
          if (response.status !== 200) {
            throw new Error('Failed to fetch product details');
          }
          setSanPham(response.data);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
          }
          console.error('Error fetching SanPham detail:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchSanPhamDetail();
    } else {
        setLoading(false);
        setError('Thiếu thông tin mã sản phẩm.');
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!sanPham) return;

    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${sanPham.tenSanPham}" không?`)) {
      try {
        await api.delete(`/san-pham/${sanPham.maSanPham}`);
        alert('Sản phẩm đã được xóa thành công!');
        router.push('/sanpham'); // Redirect to product list page
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(`Lỗi khi xóa sản phẩm: ${err.message}`);
        } else {
          alert('Đã xảy ra lỗi không xác định khi xóa sản phẩm.');
        }
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Đang tải chi tiết sản phẩm...</p></div>;
  }

  if (error || !sanPham) {
    return <div className="flex min-h-screen items-center justify-center"><p>{error}</p></div>;
  }

  // Determine the main image URL for display
  const mainImageUrl = sanPham.danhSachAnh && sanPham.danhSachAnh.length > 0
    ? getFullImageUrl(sanPham.danhSachAnh[0].urlAnh)
    : '';

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/sanpham" className="p-2 rounded-full hover:bg-gray-200 transition">
                <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Chi tiết Sản phẩm #{sanPham.maSanPham}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image & Info */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {mainImageUrl ? (
                        <img
                            src={mainImageUrl}
                            alt={sanPham.tenSanPham}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ImageIcon size={64} className="text-gray-400" />
                    )}
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">{sanPham.tenSanPham}</h2>
                <p className="text-slate-600 mb-4">{sanPham.moTa || 'Không có mô tả chi tiết.'}</p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                    <span className="inline-flex items-center gap-2 text-lg font-medium text-slate-600">
                        <Tag size={20} className="text-slate-400" />
                        {sanPham.danhMuc?.tenDanhMuc || 'Chưa phân loại'}
                    </span>
                    <span className="text-3xl font-bold text-blue-600">
                        {sanPham.gia.toLocaleString('vi-VN')}đ
                    </span>
                </div>
            </div>

            {/* Actions & Other Details */}
            <div className="lg:col-span-1 space-y-6">
                {/* Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Hành động</h2>
                    <div className="flex flex-col gap-3">
                        <Link href={`/sanpham/${sanPham.maSanPham}/edit`} className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                                <Edit size={20}/> Chỉnh sửa sản phẩm
                            </button>
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                        >
                            <Trash2 size={20}/> Xóa sản phẩm
                        </button>
                    </div>
                </div>

                {/* Additional Images (if any) */}
                {sanPham.danhSachAnh && sanPham.danhSachAnh.length > 1 && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Các hình ảnh khác</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {sanPham.danhSachAnh.slice(1).map((img, index) => (
                                <div key={index} className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <img src={getFullImageUrl(img.urlAnh)} alt={`Ảnh ${index + 2}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
