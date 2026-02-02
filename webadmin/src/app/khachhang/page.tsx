"use client";

import React, { useState, useEffect } from 'react';
import api, { ENDPOINTS } from '@/constants/api';
import CustomerForm from '@/components/customer-form';
import Sidebar from '@/components/Sidebar';
import { PlusCircle, Edit, Trash2, User, Phone, Mail, MapPin } from 'lucide-react';

interface Customer {
  maTaiKhoan: number;
  hoTen: string;
  sdt: string;
  email: string;
  diaChi: string;
}

const KhachHangPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.KHACH_HANG);
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách khách hàng.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSuccess = () => {
    fetchCustomers();
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      try {
        await api.delete(`${ENDPOINTS.KHACH_HANG}/${id}`);
        fetchCustomers();
      } catch (err) {
        setError('Xóa khách hàng thất bại.');
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Thêm khách hàng
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><Phone size={14} className="inline-block mr-2" />Số điện thoại</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><Mail size={14} className="inline-block mr-2" />Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><MapPin size={14} className="inline-block mr-2" />Địa chỉ</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Hành động</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.maTaiKhoan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.hoTen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.sdt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.diaChi || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openEditModal(customer)} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-all">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(customer.maTaiKhoan)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-all">
                        <Trash2 size={18} />
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
                {editingCustomer ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
              </h3>
              <CustomerForm onSuccess={handleSuccess} editingCustomer={editingCustomer} />
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

export default KhachHangPage;
