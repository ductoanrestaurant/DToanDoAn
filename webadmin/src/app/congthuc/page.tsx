"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { BookText, Plus, Edit2, Trash2, Loader2, ChevronDown, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import api, { ENDPOINTS } from "@/constants/api";

// --- Interfaces ---
interface SanPham {
    maSanPham: number;
    tenSanPham: string;
}

interface NguyenLieu {
    maNguyenLieu: number;
    tenNguyenLieu: string;
    donViTinh: string;
}

interface CongThuc {
    maSanPham: number;
    maNguyenLieu: number;
    slNguyenLieu: number;
    nguyenLieu?: NguyenLieu;
}

interface CongThucRaw {
    maSanPham: number;
    maNguyenLieu: number;
    slNguyenLieu: number;
}

interface CongThucModalProps {
    // isOpen không còn cần thiết cho logic bên trong modal nữa vì parent sẽ control việc render
    // nhưng giữ lại trong interface nếu bạn muốn tái sử dụng type
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: (data: CongThuc, isEditMode: boolean) => void;
    sanPham?: SanPham;
    nguyenLieus: NguyenLieu[];
    currentCongThucs: CongThuc[];
    editingCongThuc: CongThuc | null;
}

// --- Modal Component (Đã sửa lỗi ESLint) ---
const CongThucModal = ({ onClose, onSubmit, sanPham, nguyenLieus, currentCongThucs, editingCongThuc }: CongThucModalProps) => {
    // FIX 1: Khởi tạo state trực tiếp từ props, không dùng useEffect để sync dữ liệu
    // Khi Modal được mount (nhờ conditional rendering ở parent), nó sẽ lấy giá trị này làm mặc định
    const [formData, setFormData] = useState({
        maNguyenLieu: editingCongThuc?.maNguyenLieu.toString() || '',
        slNguyenLieu: editingCongThuc?.slNguyenLieu.toString() || '',
    });

    const isEditMode = !!editingCongThuc;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.maNguyenLieu || !formData.slNguyenLieu || parseFloat(formData.slNguyenLieu) <= 0) {
            alert("Vui lòng chọn nguyên liệu và nhập số lượng hợp lệ (lớn hơn 0).");
            return;
        }
        const submissionData = {
            maSanPham: sanPham!.maSanPham,
            maNguyenLieu: parseInt(formData.maNguyenLieu, 10),
            slNguyenLieu: parseFloat(formData.slNguyenLieu),
        };
        onSubmit(submissionData, isEditMode);
    };

    if (!sanPham) return null;

    const availableNguyenLieus = nguyenLieus.filter(
        (nl: NguyenLieu) => !currentCongThucs.some((ct: CongThuc) => ct.maNguyenLieu === nl.maNguyenLieu)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in-0 zoom-in-95">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Chỉnh sửa Nguyên liệu' : 'Thêm vào Công thức'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                </div>
                <p className="mb-6 text-gray-600">
                    Sản phẩm: <span className="font-semibold text-blue-600">{sanPham.tenSanPham}</span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="nguyen-lieu-select" className="block text-sm font-medium text-gray-700 mb-2">Nguyên liệu</label>
                        {isEditMode ? (
                            <div className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-800 font-medium">
                                {editingCongThuc?.nguyenLieu?.tenNguyenLieu || '...'}
                            </div>
                        ) : (
                            <select
                                id="nguyen-lieu-select"
                                value={formData.maNguyenLieu}
                                onChange={(e) => setFormData({ ...formData, maNguyenLieu: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            >
                                <option value="">-- Chọn nguyên liệu --</option>
                                {availableNguyenLieus.map((nl: NguyenLieu) => (
                                    <option key={nl.maNguyenLieu} value={nl.maNguyenLieu}>{nl.tenNguyenLieu}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div>
                        <label htmlFor="so-luong" className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                        <input
                            type="number"
                            id="so-luong"
                            step="0.01"
                            min="0.01"
                            value={formData.slNguyenLieu}
                            onChange={(e) => setFormData({ ...formData, slNguyenLieu: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Ví dụ: 0.5"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t mt-8">
                        <button type="button" onClick={onClose} className="font-semibold px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all shadow-sm">
                            Hủy
                        </button>
                        <button type="submit" className="font-semibold px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
                            {isEditMode ? 'Lưu thay đổi' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const CongThucPage = () => {
    const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
    const [nguyenLieus, setNguyenLieus] = useState<NguyenLieu[]>([]);
    const [selectedSanPham, setSelectedSanPham] = useState<number | null>(null);
    const [rawCongThucs, setRawCongThucs] = useState<CongThucRaw[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingCongThuc, setLoadingCongThuc] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCongThuc, setEditingCongThuc] = useState<CongThuc | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [spResponse, nlResponse] = await Promise.all([
                    api.get(ENDPOINTS.SAN_PHAM),
                    api.get(ENDPOINTS.NGUYEN_LIEU)
                ]);
                setSanPhams(spResponse.data);
                setNguyenLieus(nlResponse.data);
            } catch (err) {
                setError('Không thể tải dữ liệu ban đầu.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch recipes when product selected
    const fetchCongThuc = async (maSP: number) => {
        try {
            setLoadingCongThuc(true);
            setError(null);
            const response = await api.get(`${ENDPOINTS.CONG_THUC}/san-pham/${maSP}`);
            setRawCongThucs(response.data);
        } catch (err) {
            setError(`Không thể tải công thức.`);
            setRawCongThucs([]);
        } finally {
            setLoadingCongThuc(false);
        }
    };

    useEffect(() => {
        if (selectedSanPham !== null) {
            fetchCongThuc(selectedSanPham);
        } else {
            setRawCongThucs([]);
        }
    }, [selectedSanPham]);

    // Memoize recipe list
    const congThucs = useMemo(() => {
        if (!rawCongThucs.length || !nguyenLieus.length) return [];
        return rawCongThucs.map(ct => ({
            ...ct,
            nguyenLieu: nguyenLieus.find(nl => nl.maNguyenLieu === ct.maNguyenLieu)
        }));
    }, [rawCongThucs, nguyenLieus]);


    const handleSelectSanPham = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const maSP = parseInt(e.target.value, 10);
        setSelectedSanPham(isNaN(maSP) ? null : maSP);
    };

    const handleOpenModal = (congThucToEdit: CongThuc | null = null) => {
        setEditingCongThuc(congThucToEdit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCongThuc(null);
    };

    const handleSubmit = async (data: CongThuc, isEditMode: boolean) => {
        try {
            if (isEditMode) {
                await api.put(`${ENDPOINTS.CONG_THUC}/${data.maSanPham}/${data.maNguyenLieu}`, { slNguyenLieu: data.slNguyenLieu });
            } else {
                await api.post(ENDPOINTS.CONG_THUC, data);
            }
            if(selectedSanPham) fetchCongThuc(selectedSanPham);
            handleCloseModal();
        } catch (err) {
            alert(`Lỗi: ${isEditMode ? 'Cập nhật' : 'Thêm'} công thức thất bại.`);
            console.error(err);
        }
    };

    const handleDelete = async (congThucToDelete: CongThuc) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa nguyên liệu "${congThucToDelete.nguyenLieu?.tenNguyenLieu}" khỏi công thức này?`)) {
            try {
                await api.delete(`${ENDPOINTS.CONG_THUC}/${congThucToDelete.maSanPham}/${congThucToDelete.maNguyenLieu}`);
                if(selectedSanPham) fetchCongThuc(selectedSanPham);
            } catch (err) {
                alert('Lỗi: Xóa nguyên liệu thất bại.');
                console.error(err);
            }
        }
    };

    const selectedSanPhamDetails = sanPhams.find(sp => sp.maSanPham === selectedSanPham);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                            <BookText className="text-green-600" size={32} />
                            Quản lý Công thức
                        </h1>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-green-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!selectedSanPham}
                        >
                            <Plus size={20} />
                            Thêm vào công thức
                        </button>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn sản phẩm để xem công thức:
                        </label>
                        <div className="relative">
                            <select
                                id="product-select"
                                value={selectedSanPham ?? ''}
                                onChange={handleSelectSanPham}
                                className="w-full md:w-1/2 appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="">-- Vui lòng chọn một sản phẩm --</option>
                                {sanPhams.map(sp => (
                                    <option key={sp.maSanPham} value={sp.maSanPham}>
                                        {sp.tenSanPham}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
                        {loadingCongThuc ? (
                            <div className="flex flex-col items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600 mb-2" size={40} /><p className="text-gray-500">Đang tải công thức...</p></div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
                        ) : !selectedSanPham ? (
                            <div className="flex items-center justify-center h-64 text-gray-500">Vui lòng chọn một sản phẩm để xem công thức.</div>
                        ) : congThucs.length === 0 && !loadingCongThuc ? (
                            <div className="flex items-center justify-center h-64 text-gray-500">Sản phẩm này chưa có công thức.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">STT</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tên Nguyên Liệu</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Số Lượng</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {congThucs.map((item, index) => (
                                        <tr key={`${item.maSanPham}-${item.maNguyenLieu}`} className="hover:bg-blue-50/30">
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{item.nguyenLieu?.tenNguyenLieu || 'Không rõ'}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{item.slNguyenLieu}</span>
                                                <span className="text-gray-500 text-sm ml-1">{item.nguyenLieu?.donViTinh}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>


            {isModalOpen && selectedSanPhamDetails && (
                <CongThucModal
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    sanPham={selectedSanPhamDetails}
                    nguyenLieus={nguyenLieus}
                    currentCongThucs={congThucs}
                    editingCongThuc={editingCongThuc}
                />
            )}
        </div>
    );
};

export default CongThucPage;