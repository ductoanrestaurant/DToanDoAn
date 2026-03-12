'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Tag, Image as ImageIcon, Edit, Trash2, Star, MessageSquare } from 'lucide-react';
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

interface DanhGia {
  id: { maTaiKhoan: number; maSanPham: number };
  noiDung: string;
  soSao: number;
  ngayDanhGia: string;
  khachHang?: { hoTen: string };
}

// --- Star display component ---
function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100'}
        />
      ))}
    </span>
  );
}

export default function SanPhamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [sanPham, setSanPham] = useState<SanPhamDetail | null>(null);
  const [danhGias, setDanhGias] = useState<DanhGia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState(0);

  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return `${BASE_URL_IMG}/${imagePath}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }

    if (!id) { setLoading(false); setError('Thiếu thông tin mã sản phẩm.'); return; }

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [productRes, reviewRes] = await Promise.all([
          api.get(`/san-pham/${id}`),
          api.get('/danh-gia'),
        ]);
        setSanPham(productRes.data);
        const allReviews: DanhGia[] = reviewRes.data || [];
        setDanhGias(allReviews.filter((r) => r.id.maSanPham === Number(id)));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, router]);

  const handleDelete = async () => {
    if (!sanPham) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${sanPham.tenSanPham}" không?`)) {
      try {
        await api.delete(`/san-pham/${sanPham.maSanPham}`);
        alert('Sản phẩm đã được xóa thành công!');
        router.push('/sanpham');
      } catch (err: unknown) {
        alert(`Lỗi khi xóa sản phẩm: ${err instanceof Error ? err.message : 'Không xác định'}`);
      }
    }
  };

  // Derived stats
  const avgRating = danhGias.length > 0
    ? Number((danhGias.reduce((s, r) => s + r.soSao, 0) / danhGias.length).toFixed(1))
    : 0;
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: danhGias.filter((r) => r.soSao === star).length,
  }));

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p>Đang tải...</p></div>;
  if (error || !sanPham) return <div className="flex min-h-screen items-center justify-center"><p>{error}</p></div>;

  const images = sanPham.danhSachAnh || [];
  const mainImageUrl = images.length > 0 ? getFullImageUrl(images[selectedImg]?.urlAnh) : '';

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sanpham" className="p-2 rounded-full hover:bg-gray-200 transition">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Chi tiết Sản phẩm #{sanPham.maSanPham}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Product Info ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="relative w-full h-96 mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {mainImageUrl
                  ? <img src={mainImageUrl} alt={sanPham.tenSanPham} className="w-full h-full object-cover" />
                  : <ImageIcon size={64} className="text-gray-400" />}
              </div>

              {/* Thumbnail row */}
              {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${selectedImg === i ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img src={getFullImageUrl(img.urlAnh)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">{sanPham.tenSanPham}</h2>
              <p className="text-slate-600 mb-4">{sanPham.moTa || 'Không có mô tả chi tiết.'}</p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="inline-flex items-center gap-2 text-lg font-medium text-slate-600">
                  <Tag size={20} className="text-slate-400" />
                  {sanPham.danhMuc?.tenDanhMuc || 'Chưa phân loại'}
                </span>
                <span className="text-3xl font-bold text-blue-600">
                  {sanPham.gia.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* ── Reviews ── */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={20} className="text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">
                  Đánh giá từ khách hàng
                  <span className="ml-2 text-sm font-medium text-slate-400">({danhGias.length})</span>
                </h2>
              </div>

              {danhGias.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">Chưa có đánh giá nào cho sản phẩm này.</p>
              ) : (
                <>
                  {/* Rating summary */}
                  <div className="flex items-center gap-8 p-4 bg-slate-50 rounded-xl mb-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-slate-800">{avgRating}</p>
                      <StarRow rating={Math.round(avgRating)} size={18} />
                      <p className="text-sm text-slate-400 mt-1">{danhGias.length} đánh giá</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {starCounts.map(({ star, count }) => {
                        const pct = danhGias.length > 0 ? Math.round((count / danhGias.length) * 100) : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="w-3 text-slate-500 font-semibold">{star}</span>
                            <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-slate-400">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="space-y-4">
                    {danhGias.map((dg, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-slate-800">{dg.khachHang?.hoTen || 'Khách hàng'}</p>
                            <StarRow rating={dg.soSao} size={14} />
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(dg.ngayDanhGia).toLocaleDateString('vi-VN', {
                              day: '2-digit', month: '2-digit', year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mt-1">{dg.noiDung}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Hành động</h2>
              <div className="flex flex-col gap-3">
                <Link href={`/sanpham/${sanPham.maSanPham}/edit`} className="w-full">
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                    <Edit size={20} /> Chỉnh sửa sản phẩm
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                >
                  <Trash2 size={20} /> Xóa sản phẩm
                </button>
              </div>

              {/* Quick stats */}
              {danhGias.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <p className="text-sm font-semibold text-slate-600">Tổng quan đánh giá</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Điểm trung bình</span>
                    <span className="font-bold text-yellow-500">{avgRating} / 5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tổng đánh giá</span>
                    <span className="font-bold text-slate-700">{danhGias.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Đánh giá 5 sao</span>
                    <span className="font-bold text-green-600">{danhGias.filter(d => d.soSao === 5).length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
