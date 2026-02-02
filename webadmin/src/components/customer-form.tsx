"use client";

import React, { useState, useEffect } from 'react';
import api, { ENDPOINTS } from '@/constants/api';
import { Save } from 'lucide-react';

interface CustomerFormProps {
  onSuccess: () => void;
  editingCustomer?: Customer | null;
}

interface Customer {
  maTaiKhoan: number;
  hoTen: string;
  sdt: string;
  email: string;
  diaChi: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess, editingCustomer }) => {
  const [hoTen, setHoTen] = useState('');
  const [sdt, setSdt] = useState('');
  const [email, setEmail] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setHoTen(editingCustomer.hoTen);
      setSdt(editingCustomer.sdt);
      setEmail(editingCustomer.email);
      setDiaChi(editingCustomer.diaChi || '');
    } else {
      setHoTen('');
      setSdt('');
      setEmail('');
      setDiaChi('');
      setPassword('');
    }
  }, [editingCustomer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const customerData = { hoTen, sdt, email, diaChi, password };

    try {
      if (editingCustomer) {
        await api.put(`${ENDPOINTS.KHACH_HANG}/${editingCustomer.maTaiKhoan}`, { hoTen, sdt, email, diaChi });
      } else {
        await api.post(ENDPOINTS.KHACH_HANG, customerData);
      }
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Lưu thông tin thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="hoTen" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <input
            type="text"
            id="hoTen"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
            required
          />
        </div>
        <div>
          <label htmlFor="sdt" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            type="tel"
            id="sdt"
            value={sdt}
            onChange={(e) => setSdt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
          required
        />
      </div>
      <div>
        <label htmlFor="diaChi" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
        <input
          type="text"
          id="diaChi"
          value={diaChi}
          onChange={(e) => setDiaChi(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
        />
      </div>
      {!editingCustomer && (
        <div>
          <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
            required={!editingCustomer}
          />
        </div>
      )}
      {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-lg">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all"
      >
        <Save size={18} />
        {loading ? 'Đang lưu...' : (editingCustomer ? 'Cập nhật' : 'Thêm mới')}
      </button>
    </form>
  );
};

export default CustomerForm;
