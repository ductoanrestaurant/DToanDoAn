"use client"
import React, {useState, useEffect, useMemo} from 'react';
import Sidebar from '@/components/Sidebar';
import api, { ENDPOINTS } from "@/constants/api";
import { Package, Truck } from 'lucide-react';

interface NguyenLieu {
    maNguyenLieu: number;
    tenNguyenLieu: string;
    donViTinh: string;
    moTa: string;
    xuatXu: string;
    trangThai: string;
    soLuong: number;
    updatedAt: string;
}

const KhoHangPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nguyenlieus, setNguyenLieu] = useState<NguyenLieu[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isNhapHangOpen, setIsNhapHangOpen] = useState(false);
    const [selectedNguyenLieu, setSelectedNguyenLieu] = useState<NguyenLieu | null>(null);

    const [nhapHangMaNguyenLieu, setNhapHangMaNguyenLieu] = useState<number | ''>('');
    const [nhapHangSoLuong, setNhapHangSoLuong] = useState('');
    const [nhapHangGiaNhap, setNhapHangGiaNhap] = useState('');
    const [nhapHangNhaCungCap, setNhapHangNhaCungCap] = useState('');
    const [nhapHangGhiChu, setNhapHangGhiChu] = useState('');
    const [nhapHangNgayHetHan, setNhapHangNgayHetHan] = useState('');
    const [nhapHangLoading, setNhapHangLoading] = useState(false);
    const [nhapHangError, setNhapHangError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        tenNguyenLieu: "",
        donViTinh: "",
        moTa: "",
        xuatXu: "",
        trangThai: "",
        soLuong: 0
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "soLuong"
                    ? value === ""
                        ? 0
                        : parseFloat(value)
                    : value
        });
    };


    const handleAdd = async () => {
        try {
            await api.post(ENDPOINTS.NGUYEN_LIEU, formData);

            setIsOpen(false);
            setFormData({
                tenNguyenLieu: "",
                donViTinh: "",
                moTa: "",
                xuatXu: "",
                trangThai: "",
                soLuong: 0
            });

            await fetchNguyenLieu(); // reload danh sách
        } catch {
            alert("Thêm nguyên liệu thất bại!");
        }
    };

    const handleEdit = (item: NguyenLieu) => {
        setSelectedNguyenLieu(item);
        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedNguyenLieu) return;

        try {
            await api.put(`${ENDPOINTS.NGUYEN_LIEU}/${selectedNguyenLieu.maNguyenLieu}`, selectedNguyenLieu);
            setIsEditOpen(false);
            setSelectedNguyenLieu(null);
            await fetchNguyenLieu();
        } catch {
            alert("Cập nhật nguyên liệu thất bại!");
        }
    };

    useEffect(() => {
        void fetchNguyenLieu();
    }, []);

    const fetchNguyenLieu = async () => {
        try {
            setLoading(true);
            const response = await api.get(ENDPOINTS.NGUYEN_LIEU);
            setNguyenLieu(response.data);
            setError(null);
        } catch {
            setError('Không thể tải danh sách nguyên liệu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (maNguyenLieu: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nguyên liệu này không?')) {
            try {
                await api.delete(`${ENDPOINTS.NGUYEN_LIEU}/${maNguyenLieu}`);
                await fetchNguyenLieu();
            } catch {
                alert('Lỗi: Xóa nguyên liệu thất bại.');
            }
        }
    };

    const openNhapHang = (item?: NguyenLieu) => {
        setNhapHangError(null);
        setNhapHangMaNguyenLieu(item ? item.maNguyenLieu : '');
        setNhapHangSoLuong('');
        setNhapHangGiaNhap('');
        setNhapHangNhaCungCap('');
        setNhapHangGhiChu('');
        setNhapHangNgayHetHan('');
        setIsNhapHangOpen(true);
    };

    const handleNhapHangSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNhapHangError(null);
        if (!nhapHangMaNguyenLieu || !nhapHangSoLuong || !nhapHangGiaNhap) {
            setNhapHangError('Vui lòng điền đầy đủ: Nguyên liệu, Số lượng nhập, Giá nhập.');
            return;
        }
        const soLuong = parseFloat(nhapHangSoLuong);
        const gia = parseFloat(nhapHangGiaNhap);
        if (isNaN(soLuong) || soLuong <= 0 || isNaN(gia) || gia < 0) {
            setNhapHangError('Số lượng và giá nhập phải là số hợp lệ.');
            return;
        }
        setNhapHangLoading(true);
        try {
            const body: Record<string, unknown> = {
                maNguyenLieu: Number(nhapHangMaNguyenLieu),
                soLuongNhap: soLuong,
                giaNhap: gia,
                nhaCungCap: nhapHangNhaCungCap || undefined,
                ghiChu: nhapHangGhiChu || undefined,
            };
            if (nhapHangNgayHetHan) {
                body.ngayHetHan = new Date(nhapHangNgayHetHan).toISOString();
            }
            await api.post(ENDPOINTS.NHAP_HANG, body);
            setIsNhapHangOpen(false);
            await fetchNguyenLieu();
            alert('Nhập hàng thành công!');
        } catch (err: unknown) {
            let msg = 'Không thể kết nối server.';
            if (err && typeof err === 'object' && 'response' in err) {
                const res = (err as { response?: { data?: string | { message?: string } } }).response;
                const data = res?.data;
                msg = typeof data === 'string' ? data : (data?.message || 'Lỗi khi nhập hàng.');
            }
            setNhapHangError(msg);
        } finally {
            setNhapHangLoading(false);
        }
    };

    const processedNguyenLieu = useMemo(() => {
        return nguyenlieus;
    }, [nguyenlieus]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between mb-8 items-center gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Kho Nguyên Liệu</h1>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => openNhapHang()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
                            >
                                <Truck size={18} />
                                Nhập hàng
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => setIsOpen(true)}
                            >
                                <Package size={18} />
                                Thêm nguyên liệu
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p>Đang tải...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-800">Thông tin nguyên liệu</th>
                                    <th className="p-4 text-left font-semibold text-gray-800">Số lượng</th>
                                    {/*<th className="p-4 text-left font-semibold text-gray-800">Trạng thái</th>*/}
                                    <th className="p-4 text-left font-semibold text-gray-800">Mô tả</th>
                                    <th className="p-4 text-left font-semibold text-gray-800">Hành động</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {processedNguyenLieu.map((item) => (
                                    <tr key={item.maNguyenLieu} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{item.tenNguyenLieu}</td>
                                        <td className="p-4 text-gray-700">{item.soLuong} {item.donViTinh}</td>
                                        {/*<td className="p-4 text-gray-700">*/}
                                        {/*  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">*/}
                                        {/*    {item.trangThai}*/}
                                        {/*  </span>*/}
                                        {/*</td>*/}
                                        <td className="p-4 font-medium text-gray-700">{item.moTa}</td>
                                        <td className="p-4">
                                            <button
                                                type="button"
                                                onClick={() => openNhapHang(item)}
                                                className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors mr-2"
                                            >
                                                Nhập
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.maNguyenLieu)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all overflow-hidden">

                        {/* Header: Có màu sắc nhẹ để phân biệt */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-semibold text-gray-800">Thêm nguyên liệu mới</h2>
                            <p className="text-sm text-gray-500">Nhập thông tin chi tiết cho kho hàng của bạn.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Input Group: Tên & Đơn vị cùng 1 hàng để tiết kiệm diện tích */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nguyên liệu</label>
                                    <input
                                        name="tenNguyenLieu"
                                        placeholder="VD: Bột mì"
                                        value={formData.tenNguyenLieu}
                                        onChange={handleChange}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                                    <input
                                        name="donViTinh"
                                        placeholder="VD: Kg"
                                        value={formData.donViTinh}
                                        onChange={handleChange}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Input Group: Số lượng & Trạng thái */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                    <input
                                        name="soLuong"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.soLuong}
                                        onChange={handleChange}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xuất xứ</label>
                                    <input
                                        name="xuatXu"
                                        value={formData.xuatXu}
                                        onChange={handleChange}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Mô tả: Chuyển sang Textarea nếu cần nhập nhiều */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    name="moTa"
                                    rows={3}
                                    placeholder="Ghi chú thêm về nguyên liệu..."
                                    value={formData.moTa}
                                    onChange={handleChange}
                                    className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer: Nút bấm to và rõ ràng hơn */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                onClick={handleAdd}
                                className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-200 transition-all active:scale-95"
                            >
                                Lưu thông tin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditOpen && selectedNguyenLieu && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa nguyên liệu</h2>
                            <p className="text-sm text-gray-500">Cập nhật thông tin chi tiết cho nguyên liệu.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nguyên liệu</label>
                                    <input
                                        name="tenNguyenLieu"
                                        placeholder="VD: Bột mì"
                                        value={selectedNguyenLieu.tenNguyenLieu}
                                        onChange={(e) => setSelectedNguyenLieu({...selectedNguyenLieu, tenNguyenLieu: e.target.value})}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                                    <input
                                        name="donViTinh"
                                        placeholder="VD: Kg"
                                        value={selectedNguyenLieu.donViTinh}
                                        onChange={(e) => setSelectedNguyenLieu({...selectedNguyenLieu, donViTinh: e.target.value})}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                    <input
                                        name="soLuong"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={selectedNguyenLieu.soLuong}
                                        onChange={(e) =>
                                            setSelectedNguyenLieu({
                                                ...selectedNguyenLieu,
                                                soLuong:
                                                    e.target.value === ""
                                                        ? 0
                                                        : parseFloat(e.target.value)
                                            })
                                        }
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xuất xứ</label>
                                    <input
                                        name="xuatXu"
                                        value={selectedNguyenLieu.xuatXu}
                                        onChange={(e) => setSelectedNguyenLieu({...selectedNguyenLieu, xuatXu: e.target.value})}
                                        className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    name="moTa"
                                    rows={3}
                                    placeholder="Ghi chú thêm về nguyên liệu..."
                                    value={selectedNguyenLieu.moTa}
                                    onChange={(e) => setSelectedNguyenLieu({...selectedNguyenLieu, moTa: e.target.value})}
                                    className="text-gray-900 placeholder:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-200 transition-all active:scale-95"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nhập hàng */}
            {isNhapHangOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-emerald-50/50 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100">
                                <Truck size={22} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Phiếu nhập kho</h2>
                                <p className="text-sm text-gray-500">Thêm nguyên liệu vào tồn kho</p>
                            </div>
                        </div>
                        <form onSubmit={handleNhapHangSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nguyên liệu <span className="text-red-500">*</span></label>
                                <select
                                    value={nhapHangMaNguyenLieu}
                                    onChange={(e) => setNhapHangMaNguyenLieu(e.target.value ? Number(e.target.value) : '')}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base"
                                >
                                    <option value="">-- Chọn nguyên liệu --</option>
                                    {nguyenlieus.map((nl) => (
                                        <option key={nl.maNguyenLieu} value={nl.maNguyenLieu}>
                                            {nl.tenNguyenLieu} ({nl.donViTinh}) — Tồn: {nl.soLuong}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0"
                                        value={nhapHangSoLuong}
                                        onChange={(e) => setNhapHangSoLuong(e.target.value)}
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhập (VNĐ) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0"
                                        value={nhapHangGiaNhap}
                                        onChange={(e) => setNhapHangGiaNhap(e.target.value)}
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                                <input
                                    type="text"
                                    placeholder="VD: Công ty ABC..."
                                    value={nhapHangNhaCungCap}
                                    onChange={(e) => setNhapHangNhaCungCap(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                                <input
                                    type="date"
                                    value={nhapHangNgayHetHan}
                                    onChange={(e) => setNhapHangNgayHetHan(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <textarea
                                    rows={2}
                                    placeholder="Ghi chú thêm..."
                                    value={nhapHangGhiChu}
                                    onChange={(e) => setNhapHangGhiChu(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none text-base"
                                />
                            </div>
                            {nhapHangError && (
                                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                                    {nhapHangError}
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsNhapHangOpen(false)}
                                    className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={nhapHangLoading}
                                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {nhapHangLoading ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Package size={16} />
                                            Xác nhận nhập hàng
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KhoHangPage;