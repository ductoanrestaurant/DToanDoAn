"use client";

import React, { useState, useEffect } from 'react';
import api, { ENDPOINTS } from '@/constants/api';
import EmployeeForm from '@/components/employee-form';
import Sidebar from '@/components/Sidebar';
import ToggleSwitch from '@/components/ToggleSwitch'; // Import the new component
import { PlusCircle, Edit, User, Mail, Briefcase, Power } from 'lucide-react';
import { Employee } from '@/types';

const NhanVienPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.NHAN_VIEN);
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách nhân viên.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSuccess = () => {
    fetchEmployees();
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (employee: Employee) => {
    const newStatus = !employee.trangthai;
    // Optimistic UI update
    setEmployees(employees.map(e => e.id.maNhanVien === employee.id.maNhanVien ? { ...e, trangthai: newStatus } : e));
    try {
      await api.put(`${ENDPOINTS.NHAN_VIEN}/${employee.id.maNhanVien}/${employee.id.idRestaurant}/status`, { trangthai: newStatus });
    } catch (err) {
      setError('Cập nhật trạng thái thất bại. Đang hoàn tác...');
      console.error(err);
      // Revert on error
      setEmployees(employees.map(e => e.id.maNhanVien === employee.id.maNhanVien ? { ...e, trangthai: !newStatus } : e));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý nhân viên</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Thêm nhân viên
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><User size={14} className="inline-block mr-2" />Họ và tên</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><Mail size={14} className="inline-block mr-2" />Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><Briefcase size={14} className="inline-block mr-2" />Chức vụ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><Power size={14} className="inline-block mr-2" />Trạng thái</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Hành động</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={`${employee.id.maNhanVien}-${employee.id.idRestaurant}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.tenNhanVien}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.vaiTro?.tenVaiTro || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ToggleSwitch
                        checked={employee.trangthai}
                        onChange={() => handleToggleStatus(employee)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openEditModal(employee)} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-all">
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {editingEmployee ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
              </h3>
              <EmployeeForm onSuccess={handleSuccess} editingEmployee={editingEmployee} />
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NhanVienPage;
