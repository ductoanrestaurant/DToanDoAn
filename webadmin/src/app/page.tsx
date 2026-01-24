'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra token xác thực trong localStorage
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Nếu có token, chuyển hướng đến trang tổng quan
      router.push('/dashboard');
    } else {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      router.push('/login');
    }
  }, [router]);

  // Hiển thị trạng thái tải trong khi chuyển hướng diễn ra
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}
