'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Search, PlusCircle, Tag, Image as ImageIcon, MoreVertical, LayoutGrid, Edit, Trash2 } from 'lucide-react';
import api, { getImageUrl } from '@/constants/api';
import Link from 'next/link';

// --- Types ---
interface ListImage {
  urlAnh: string;
}

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
}

interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  moTa: string;
  gia: number;
  danhSachAnh: ListImage[];
  danhMuc: DanhMuc;
}

export default function SanPhamPage() {
  const router = useRouter();

  // Data States
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);


  // Fetch Data
  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/san-pham'),
        api.get('/danh-muc')
      ]);

      if (productsRes.status === 200 && categoriesRes.status === 200) {
        setSanPhams(productsRes.data);
        setDanhMucs(categoriesRes.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // Handle Delete Product
  const handleDelete = async (maSanPham: number, tenSanPham: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${tenSanPham}" không?`)) {
      try {
        await api.delete(`/san-pham/${maSanPham}`);
        alert('Sản phẩm đã được xóa thành công!');
        setOpenMenuId(null);
        fetchData();
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

  // Logic Lọc sản phẩm
  const filteredSanPhams = sanPhams.filter(sp => {
    const matchesSearch =
        sp.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sp.danhMuc.tenDanhMuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sp.moTa && sp.moTa.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || sp.danhMuc.maDanhMuc === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Skeleton Loader
  const ProductSkeleton = () => (
      <div className="animate-pulse bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
  );

  if (error) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-gray-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 hover:underline">Thử lại</button>
          </div>
        </div>
    );
  }

  return (
      <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
        <Sidebar />

        <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Quản lý Sản phẩm</h1>
              <p className="text-slate-500 mt-1 text-sm">Quản lý danh sách các món ăn và đồ uống</p>
            </div>
            <Link href="/sanpham/add">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all font-medium">
                <PlusCircle size={20} strokeWidth={2.5} />
                <span>Thêm Sản phẩm Mới</span>
              </button>
            </Link>
          </header>

          {/* Toolbar & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-10">

            {/* Category Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto border border-slate-200 max-w-[60%] no-scrollbar">
              <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                      selectedCategory === 'All'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50' // Đã sửa màu chữ đậm hơn
                  }`}
              >
                Tất cả
              </button>

              {danhMucs.map((dm) => (
                  <button
                      key={dm.maDanhMuc}
                      onClick={() => setSelectedCategory(dm.maDanhMuc)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                          selectedCategory === dm.maDanhMuc
                              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50' // Đã sửa màu chữ đậm hơn
                      }`}
                  >
                    {dm.tenDanhMuc}
                  </button>
              ))}
            </div>

            {/* Search Bar - ĐÃ CẢI THIỆN HIỂN THỊ */}
            <div className="relative w-full md:w-80 group">
              <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors"
                  size={20}
              />
              <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300
                    bg-white text-slate-900 placeholder:text-slate-600 font-medium text-base
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600
                    outline-none transition-all shadow-sm
                  "
              />
            </div>
          </div>

          {/* Product Grid Content */}
          {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
          ) : filteredSanPhams.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-slate-100 p-4 rounded-full w-fit mx-auto mb-4 text-slate-400">
                  <LayoutGrid size={40} />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">Không tìm thấy sản phẩm nào</h3>
                <p className="text-slate-500 mt-2">
                  {selectedCategory !== 'All'
                      ? 'Danh mục này chưa có sản phẩm hoặc không khớp từ khóa tìm kiếm.'
                      : 'Thử thay đổi từ khóa tìm kiếm.'}
                </p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSanPhams.map((sanPham) => {
                  const firstImage = sanPham.danhSachAnh && sanPham.danhSachAnh.length > 0 ? sanPham.danhSachAnh[0] : null;
                  const imageUrl = firstImage ? getImageUrl(firstImage.urlAnh) : '';

                  return (
                      <div
                          key={sanPham.maSanPham}
                          className="group relative bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        {/* Clickable area for product details - Updated to be relative to allow dropdown to work */}
                        <div className="relative">
                          <Link href={`/sanpham/${sanPham.maSanPham}`} className="absolute inset-0 z-10" />

                          <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-slate-100">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={sanPham.tenSanPham}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}

                            <div className={`absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300 ${imageUrl ? 'hidden' : ''}`}>
                              <ImageIcon size={48} />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-start mb-2 relative z-20">
                          <Link href={`/sanpham/${sanPham.maSanPham}`} className="flex-1">
                            <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1" title={sanPham.tenSanPham}>
                              {sanPham.tenSanPham}
                            </h2>
                          </Link>

                          {/* Action Menu Button */}
                          <div className="relative" ref={openMenuId === sanPham.maSanPham ? menuRef : null}>
                            <button
                                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors relative z-30"
                                onClick={(e) => {
                                  e.stopPropagation(); // Stop propagation to prevent Link click
                                  e.preventDefault();
                                  setOpenMenuId(openMenuId === sanPham.maSanPham ? null : sanPham.maSanPham);
                                }}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === sanPham.maSanPham && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40">
                                  <div className="py-1">
                                    <Link href={`/sanpham/${sanPham.maSanPham}/edit`}>
                                      <span
                                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => setOpenMenuId(null)}
                                      >
                                        <Edit size={16} /> Chỉnh sửa
                                      </span>
                                    </Link>
                                    <button
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(sanPham.maSanPham, sanPham.tenSanPham);
                                        }}
                                    >
                                      <Trash2 size={16} /> Xóa
                                    </button>
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2 h-10">{sanPham.moTa || 'Không có mô tả.'}</p>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                              <Tag size={12} className="text-slate-500" />
                              {sanPham.danhMuc?.tenDanhMuc || 'Khác'}
                            </span>
                          <span className="text-lg font-bold text-blue-600">
                              {sanPham.gia.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </main>
      </div>
  );
}