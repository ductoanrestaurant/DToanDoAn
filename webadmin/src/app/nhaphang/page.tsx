'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import api, { ENDPOINTS } from '@/constants/api';
import { ArrowLeft, Package, Truck, List, Eye, X } from 'lucide-react';

interface NguyenLieu {
    maNguyenLieu: number;
    tenNguyenLieu: string;
    donViTinh: string;
    soLuong: number;
}

interface PhieuNhap {
    maPhieuNhap: number;
    nhaCungCap: string;
    maNhanVien: number;
    ngayNhap: string;
    tongTien: number;
    ghiChu: string;
}

interface ChiTietPhieuNhap {
    maNguyenLieu: number;
    tenNguyenLieu: string;
    donViTinh: string;
    soLuongNhap: number;
    giaNhap: number;
    ngayHetHan: string | null;
    thanhTien: number;
}

interface PhieuNhapDetail extends PhieuNhap {
    tenNhanVien?: string;
    emailNhanVien?: string;
    chiTiet: ChiTietPhieuNhap[];
}

const formatVnd = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const formatDateTime = (s: string | null) =>
    s ? new Date(s).toLocaleString('vi-VN', { hour12: false }) : '—';

const NhapHangPage = () => {
    const router = useRouter();
    const [view, setView] = useState<'form' | 'list'>('form');

    const [nguyenLieus, setNguyenLieus] = useState<NguyenLieu[]>([]);
    const [phiếuList, setPhieuList] = useState<PhieuNhap[]>([]);
    const [phiếuDetail, setPhieuDetail] = useState<PhieuNhapDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [listLoading, setListLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [maNguyenLieu, setMaNguyenLieu] = useState<number | ''>('');
    const [soLuongNhap, setSoLuongNhap] = useState('');
    const [giaNhap, setGiaNhap] = useState('');
    const [nhaCungCap, setNhaCungCap] = useState('');
    const [ghiChu, setGhiChu] = useState('');
    const [ngayHetHan, setNgayHetHan] = useState('');

    const idRestaurant = 1;

    useEffect(() => {
        fetchNguyenLieu();
    }, []);

    useEffect(() => {
        if (view === 'list') fetchPhieuList();
    }, [view]);

    const fetchNguyenLieu = async () => {
        try {
            const res = await api.get(ENDPOINTS.NGUYEN_LIEU);
            setNguyenLieus(res.data || []);
        } catch {
            setError('Không thể tải danh sách nguyên liệu.');
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchPhieuList = async () => {
        setListLoading(true);
        try {
            const res = await api.get(`${ENDPOINTS.NHAP_HANG}?idRestaurant=${idRestaurant}`);
            setPhieuList(res.data || []);
        } catch {
            setError('Không thể tải danh sách phiếu nhập.');
        } finally {
            setListLoading(false);
        }
    };

    const fetchPhieuDetail = async (maPhieuNhap: number) => {
        setDetailLoading(true);
        setPhieuDetail(null);
        try {
            const res = await api.get(`${ENDPOINTS.NHAP_HANG}/${maPhieuNhap}`);
            setPhieuDetail(res.data);
        } catch {
            setError('Không thể tải chi tiết phiếu nhập.');
        } finally {
            setDetailLoading(false);
        }
    };

    const clearForm = () => {
        setMaNguyenLieu('');
        setSoLuongNhap('');
        setGiaNhap('');
        setNhaCungCap('');
        setGhiChu('');
        setNgayHetHan('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!maNguyenLieu || !soLuongNhap || !giaNhap) {
            setError('Vui lòng điền đầy đủ: Nguyên liệu, Số lượng nhập, Giá nhập.');
            return;
        }
        const soLuong = parseFloat(soLuongNhap);
        const gia = parseFloat(giaNhap);
        if (isNaN(soLuong) || soLuong <= 0 || isNaN(gia) || gia < 0) {
            setError('Số lượng và giá nhập phải là số hợp lệ.');
            return;
        }

        setLoading(true);
        try {
            const body: Record<string, unknown> = {
                maNguyenLieu: Number(maNguyenLieu),
                soLuongNhap: soLuong,
                giaNhap: gia,
                nhaCungCap: nhaCungCap || undefined,
                ghiChu: ghiChu || undefined,
            };
            if (ngayHetHan) body.ngayHetHan = new Date(ngayHetHan).toISOString();
            await api.post(ENDPOINTS.NHAP_HANG, body);
            clearForm();
            setView('list');
            await fetchPhieuList();
            alert('Nhập hàng thành công!');
        } catch (err: unknown) {
            let msg = 'Không thể kết nối server.';
            if (err && typeof err === 'object' && 'response' in err) {
                const res = (err as { response?: { data?: string | { message?: string } } }).response;
                const data = res?.data;
                msg = typeof data === 'string' ? data : (data?.message || 'Lỗi khi nhập hàng.');
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const selectedNguyenLieu = nguyenLieus.find(n => n.maNguyenLieu === maNguyenLieu);

    return (
        <div className="flex min-h-screen bg-[#f1f5f9]">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/khohang')}
                                className="p-2 rounded-lg hover:bg-white/80 transition"
                            >
                                <ArrowLeft size={24} className="text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Nhập hàng vào kho</h1>
                                <p className="text-gray-500 text-sm mt-0.5">
                                    Tạo phiếu nhập mới hoặc xem lịch sử phiếu nhập.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('form')}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                                    view === 'form'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Package size={18} />
                                Tạo phiếu nhập
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                                    view === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <List size={18} />
                                Danh sách phiếu
                            </button>
                        </div>
                    </div>

                    {view === 'form' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <Truck size={22} className="text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">Phiếu nhập kho mới</h2>
                                    <p className="text-sm text-gray-500">Điền thông tin đợt nhập hàng</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {fetchLoading ? (
                                    <p className="text-gray-500 py-8 text-center">Đang tải danh sách nguyên liệu...</p>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nguyên liệu <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={maNguyenLieu}
                                                onChange={(e) => setMaNguyenLieu(e.target.value ? Number(e.target.value) : '')}
                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="">-- Chọn nguyên liệu --</option>
                                                {nguyenLieus.map((nl) => (
                                                    <option key={nl.maNguyenLieu} value={nl.maNguyenLieu}>
                                                        {nl.tenNguyenLieu} ({nl.donViTinh}) — Tồn: {nl.soLuong}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Số lượng nhập <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                type="number"
                                                        step="0.01"
                                                        min="0.01"
                                placeholder="0"
                                                        value={soLuongNhap}
                                                        onChange={(e) => setSoLuongNhap(e.target.value)}
                                                        required
                                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    {selectedNguyenLieu && (
                                                        <span className="text-sm text-gray-500">{selectedNguyenLieu.donViTinh}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Giá nhập (VNĐ) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                type="number"
                                                    step="0.01"
                                                    min="0"
                                placeholder="0"
                                value={giaNhap}
                                onChange={(e) => setGiaNhap(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp</label>
                                            <input
                                                type="text"
                                                placeholder="VD: Công ty ABC..."
                                                value={nhaCungCap}
                                                onChange={(e) => setNhaCungCap(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
                                            <input
                                                type="date"
                                                value={ngayHetHan}
                                                onChange={(e) => setNgayHetHan(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Ghi chú thêm về lô hàng..."
                                                value={ghiChu}
                                                onChange={(e) => setGhiChu(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            />
                                        </div>
                                        {error && (
                                            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                                                {error}
                                            </div>
                                        )}
                                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => router.push('/khohang')}
                                                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                    disabled={loading}
                                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Package size={18} />
                                                        Xác nhận nhập hàng
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    )}

                    {view === 'list' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="font-semibold text-gray-800">Danh sách phiếu nhập kho</h2>
                                <p className="text-sm text-gray-500">Click &quot;Xem&quot; để xem chi tiết phiếu</p>
                            </div>
                            <div className="overflow-x-auto">
                                {listLoading ? (
                                    <p className="text-gray-500 py-12 text-center">Đang tải...</p>
                                ) : phiếuList.length === 0 ? (
                                    <p className="text-gray-500 py-12 text-center">Chưa có phiếu nhập nào.</p>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="p-4 text-left font-semibold text-gray-700">Mã phiếu</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Ngày nhập</th>
                                                <th className="p-4 text-left font-semibold text-gray-700">Nhà cung cấp</th>
                                                <th className="p-4 text-right font-semibold text-gray-700">Tổng tiền</th>
                                                <th className="p-4 text-center font-semibold text-gray-700">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {phiếuList.map((p) => (
                                                <tr key={p.maPhieuNhap} className="hover:bg-gray-50">
                                                    <td className="p-4 font-mono font-medium text-gray-900">#{p.maPhieuNhap}</td>
                                                    <td className="p-4 text-gray-700">{formatDateTime(p.ngayNhap)}</td>
                                                    <td className="p-4 text-gray-700">{p.nhaCungCap || '—'}</td>
                                                    <td className="p-4 text-right font-medium text-gray-900">{formatVnd(p.tongTien)}</td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => fetchPhieuDetail(p.maPhieuNhap)}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                                                        >
                                                            <Eye size={16} />
                                                            Xem
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal chi tiết phiếu */}
                {(phiếuDetail !== null || detailLoading) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Chi tiết phiếu nhập #{phiếuDetail?.maPhieuNhap ?? '...'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setPhieuDetail(null)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                {detailLoading ? (
                                    <p className="text-gray-500 py-8 text-center">Đang tải chi tiết...</p>
                                ) : phiếuDetail ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/60 rounded-xl px-4 py-3 mb-2">
                                            <div className="space-y-1">
                                                <p className="text-gray-700 font-semibold">Mã phiếu</p>
                                                <p className="text-gray-900 font-mono font-semibold text-base">#{phiếuDetail.maPhieuNhap}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-700 font-semibold">Ngày nhập</p>
                                                <p className="text-gray-900">{formatDateTime(phiếuDetail.ngayNhap)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-700 font-semibold">Nhà cung cấp</p>
                                                <p className="text-gray-900">{phiếuDetail.nhaCungCap || '—'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-700 font-semibold">Tổng tiền</p>
                                                <p className="text-emerald-600 font-semibold text-base">{formatVnd(phiếuDetail.tongTien)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-700 font-semibold">Nhân viên nhập</p>
                                                <p className="text-gray-900">
                                                    {phiếuDetail.tenNhanVien || `Mã ${phiếuDetail.maNhanVien}`}
                                                </p>
                                            </div>
                                            {phiếuDetail.ghiChu && (
                                                <div className="col-span-2">
                                                    <span className="text-gray-500">Ghi chú:</span>
                                                    <p className="mt-1 text-gray-800">{phiếuDetail.ghiChu}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-3">Chi tiết món nhập</h3>
                                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Nguyên liệu</th>
                                                        <th className="p-3 text-right text-sm font-semibold text-gray-700">SL</th>
                                                        <th className="p-3 text-right text-sm font-semibold text-gray-700">Đơn giá</th>
                                                        <th className="p-3 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {phiếuDetail.chiTiet?.map((ct, i) => (
                                                        <tr key={i}>
                                                            <td className="p-3 text-gray-900">
                                                                {ct.tenNguyenLieu} <span className="text-gray-500">({ct.donViTinh})</span>
                                                            </td>
                                                            <td className="p-3 text-right text-gray-700">{ct.soLuongNhap}</td>
                                                            <td className="p-3 text-right text-gray-700">{formatVnd(ct.giaNhap)}</td>
                                                            <td className="p-3 text-right font-medium text-gray-900">{formatVnd(ct.thanhTien)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NhapHangPage;
