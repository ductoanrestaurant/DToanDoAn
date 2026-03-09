"use client"
import React, {useState, useEffect, useMemo} from 'react';
import Sidebar from '@/components/Sidebar';
import api, { ENDPOINTS } from "@/constants/api";

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
    const [selectedNguyenLieu, setSelectedNguyenLieu] = useState<NguyenLieu | null>(null);

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

    const processedNguyenLieu = useMemo(() => {
        return nguyenlieus;
    }, [nguyenlieus]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between mb-8 items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Kho Nguyên Liệu</h1>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => setIsOpen(true)}>
                            Thêm nguyên liệu
                        </button>
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
                                                onClick={() => handleEdit(item)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                                            >
                                                Sửa
                                            </button>
                                            <button
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
        </div>
    );
};

export default KhoHangPage;