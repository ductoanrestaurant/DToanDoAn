'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Search, PlusCircle, Trash2, Save, ArrowLeft, UserPlus } from 'lucide-react';
import api from '@/constants/api';
import Link from 'next/link';


interface SanPham { maSanPham: number; tenSanPham: string; gia: number; danhSachAnh: { urlAnh: string }[]; }
interface KhachHang { maTaiKhoan: number; hoTen: string; soDienThoai?: string; }
interface Ban { maBan: number; tenBan: string; }
interface NhanVien { id: { maNhanVien: number }; tenNhanVien: string; }
interface ThanhToan { idThanhToan: number; kieuThanhToan: string; }
interface CartItem extends SanPham { soluong: number; }

export default function ThemDonHangPage() {
    const router = useRouter();

    // Data states
    const [products, setProducts] = useState<SanPham[]>([]);
    const [tables, setTables] = useState<Ban[]>([]);
    const [employees, setEmployees] = useState<NhanVien[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<ThanhToan[]>([]);

    // Form states
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // UI states
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, t, e, pay] = await Promise.all([
                    api.get('/san-pham'), api.get('/ban'), api.get('/nhan-vien'), api.get('/payment'),
                ]);
                setProducts(p.data); setTables(t.data); setEmployees(e.data); setPaymentMethods(pay.data);
            } catch (error) {
                console.error("Fetch error", error);
            } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setTotalPrice(cart.reduce((sum, item) => sum + item.gia * item.soluong, 0));
    }, [cart]);

    const handleCheckPhone = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            alert("Vui lòng nhập số điện thoại hợp lệ.");
            return;
        }
        setIsCheckingPhone(true);
        try {
            const response = await api.get(`/khach-hang/sdt/${phoneNumber}`);
            const customer = response.data;
            setSelectedCustomerId(customer.maTaiKhoan);
            setCustomerName(customer.hoTen);
            alert(`Đã tìm thấy khách hàng: ${customer.hoTen}`);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                if (window.confirm(`Không tìm thấy khách hàng với SĐT: ${phoneNumber}. Bạn có muốn tạo tài khoản mới không?`)) {
                    await createNewCustomer(phoneNumber);
                }
            } else {
                console.error("Lỗi khi kiểm tra SĐT:", error);
                alert("Đã có lỗi xảy ra khi kiểm tra số điện thoại.");
            }
        } finally {
            setIsCheckingPhone(false);
        }
    };

    const createNewCustomer = async (phone: string) => {
        try {
            const newCustomerName = `Khách mới - ${phone.slice(-4)}`;
            const response = await api.post('/khach-hang', {
                hoTen: newCustomerName,
                soDienThoai: phone,
                // Các trường thông tin mặc định khác nếu cần
            });
            const newCustomer = response.data;
            setSelectedCustomerId(newCustomer.maTaiKhoan);
            setCustomerName(newCustomer.hoTen);
            alert(`Đã tạo và chọn khách hàng mới: ${newCustomer.hoTen}`);
        } catch (error) {
            console.error("Lỗi khi tạo khách hàng mới:", error);
            alert("Đã có lỗi xảy ra khi tạo khách hàng mới.");
        }
    };

    const handleAddToCart = (product: SanPham) => {
        setCart((prev) => {
            const exist = prev.find((i) => i.maSanPham === product.maSanPham);
            if (exist) return prev.map((i) => i.maSanPham === product.maSanPham ? { ...i, soluong: i.soluong + 1 } : i);
            return [...prev, { ...product, soluong: 1 }];
        });
    };

    const handleUpdateQuantity = (id: number, qty: number) => {
        if (qty <= 0) {
            setCart(prev => prev.filter(i => i.maSanPham !== id));
            return;
        }
        setCart(prev => prev.map(i => i.maSanPham === id ? { ...i, soluong: qty } : i));
    };

    const handleSubmitOrder = async () => {
        if (!selectedCustomerId || !selectedTableId || !selectedPaymentMethodId || cart.length === 0) {
            alert("Vui lòng kiểm tra lại thông tin đơn hàng!");
            return;
        }
        setIsSubmitting(true);
        // ... logic submit giữ nguyên
        setIsSubmitting(false);
    };

    const filteredProducts = products.filter(p => p.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-900 font-bold">Đang tải dữ liệu...</div>;

    return (
        <div className="flex bg-[#f1f5f9] min-h-screen font-sans text-gray-900">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div className='flex items-center gap-4'>
                        <Link href="/donhang" className="p-2 rounded-full hover:bg-gray-200 text-gray-700">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">Tạo Đơn hàng mới</h1>
                    </div>
                    <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        <Save size={20} /> {isSubmitting ? 'Đang lưu...' : 'Lưu Đơn hàng'}
                    </button>
                </header>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Chi tiết Đơn hàng</h2>

                        {/* Cart items */}
                        <div className="mb-6 h-64 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50/50">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-500 mt-16 italic">Chưa có sản phẩm nào được chọn</div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.maSanPham} className="flex items-center justify-between p-3 mb-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{item.tenSanPham}</p>
                                                <p className="text-sm text-blue-600 font-semibold">{item.gia.toLocaleString('vi-VN')}đ</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={item.soluong}
                                                onChange={(e) => handleUpdateQuantity(item.maSanPham, parseInt(e.target.value))}
                                                className="w-16 text-center border-2 border-gray-300 rounded-md py-1 font-bold text-gray-900 focus:border-blue-500 outline-none bg-white"
                                            />
                                            <button onClick={() => handleUpdateQuantity(item.maSanPham, 0)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Khách hàng (SĐT)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        placeholder="Nhập SĐT khách hàng..."
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <button onClick={handleCheckPhone} disabled={isCheckingPhone} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
                                        {isCheckingPhone ? '...' : <Search size={20}/>}
                                    </button>
                                </div>
                                {customerName && <p className="text-sm text-green-600 font-bold mt-2">Đã chọn: {customerName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Bàn phục vụ</label>
                                <select
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
                                    value={selectedTableId || ''}
                                    onChange={(e) => setSelectedTableId(Number(e.target.value))}
                                >
                                    <option key="table-placeholder" value="" disabled>-- Chọn bàn --</option>
                                    {tables.map(t => <option key={t.maBan} value={t.maBan}>{t.tenBan}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Nhân viên phụ trách</label>
                                <select
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={selectedEmployeeId || ''}
                                    onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
                                >
                                    <option key="employee-placeholder" value="">Không xác định</option>
                                    {employees.map(e => <option key={e.id.maNhanVien} value={e.id.maNhanVien}>{e.tenNhanVien}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Hình thức Thanh toán</label>
                                <select
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={selectedPaymentMethodId || ''}
                                    onChange={(e) => setSelectedPaymentMethodId(Number(e.target.value))}
                                >
                                    <option key="payment-placeholder" value="" disabled>-- Chọn hình thức --</option>
                                    {paymentMethods.map(p => <option key={p.idThanhToan} value={p.idThanhToan}>{p.kieuThanhToan}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t-2 border-gray-100">
                            <div className="flex justify-between items-center text-2xl font-black text-blue-700">
                                <span>TỔNG CỘNG:</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </div>
                    </div>

                    {/* Right column for product list */}
                    <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm món ăn, đồ uống..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                            />
                        </div>
                        <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.maSanPham}
                                    onClick={() => handleAddToCart(product)}
                                    className="flex items-center gap-4 p-3 mb-2 rounded-xl hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 transition group"
                                >
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm group-hover:text-blue-700">{product.tenSanPham}</p>
                                        <p className="text-xs font-bold text-blue-600">{product.gia.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                    <PlusCircle size={20} className="text-gray-300 group-hover:text-blue-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}