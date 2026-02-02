"use client";

import React, { useState, useEffect } from 'react';
import api, { ENDPOINTS } from '@/constants/api';
import { Save, RotateCw } from 'lucide-react';
import { Employee } from '@/types'; // Import the shared type

interface EmployeeFormProps {
  onSuccess: () => void;
  editingEmployee?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSuccess, editingEmployee }) => {
  const [tenNhanVien, setTenNhanVien] = useState('');
  const [email, setEmail] = useState('');
  const [maVaiTro, setMaVaiTro] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    if (editingEmployee) {
      setTenNhanVien(editingEmployee.tenNhanVien);
      setEmail(editingEmployee.email);
      setMaVaiTro(editingEmployee.vaiTro?.maVaiTro || '');
      setPassword(''); // Clear password field for editing
      setPasswordReset(false); // Reset password reset flag
    } else {
      setTenNhanVien('');
      setEmail('');
      setMaVaiTro('');
      setPassword('');
    }
  }, [editingEmployee]);

  const handleResetPassword = () => {
    setPassword('123456');
    setPasswordReset(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingEmployee) {
        const updatedData: any = { tenNhanVien, email, maVaiTro };
        if (password) {
          updatedData.password = password;
        }
        await api.put(`${ENDPOINTS.NHAN_VIEN}/${editingEmployee.id.maNhanVien}/${editingEmployee.id.idRestaurant}`, updatedData);
      } else {
        const employeeData = { tenNhanVien, email, maVaiTro, password, idRestaurant: 1 };
        await api.post(ENDPOINTS.NHAN_VIEN, employeeData);
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
          <label htmlFor="tenNhanVien" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <input
            type="text"
            id="tenNhanVien"
            value={tenNhanVien}
            onChange={(e) => setTenNhanVien(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
            required
          />
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
      </div>
      <div>
        <label htmlFor="maVaiTro" className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
        <select
          id="maVaiTro"
          value={maVaiTro}
          onChange={(e) => setMaVaiTro(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
          required
        >
          <option value="" disabled>Chọn chức vụ</option>
          <option value={1}>Quản lý</option>
          <option value={2}>Thu ngân</option>
          <option value={3}>Bếp</option>
        </select>
      </div>

      {editingEmployee ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          >
            <RotateCw size={16} />
            Reset mật khẩu về mặc định
          </button>
          {passwordReset && <p className="text-green-600 text-sm mt-2 text-center">Mật khẩu sẽ được reset về "123456" khi bạn lưu.</p>}
        </div>
      ) : (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mặc định là 123456 nếu để trống"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50"
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
        {loading ? 'Đang lưu...' : (editingEmployee ? 'Cập nhật' : 'Thêm mới')}
      </button>
    </form>
  );
};

export default EmployeeForm;
