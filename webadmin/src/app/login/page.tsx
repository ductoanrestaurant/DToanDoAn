'use client';

import api, { ENDPOINTS } from '@/constants/api';
import { getFirstRouteForRole } from '@/lib/sidebar-menu';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();

  // Khai báo state riêng lẻ như bạn muốn
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    // Xóa token
    localStorage.removeItem('accessToken');

    // Nên xóa sạch cả các thông tin đi kèm để đảm bảo không bị lỗi dữ liệu cũ
    localStorage.removeItem('maNhanVien');
    localStorage.removeItem('tenNhanVien');
    localStorage.removeItem('userRole');

    console.log("Đã xóa token và thông tin đăng nhập cũ.");
  }, []);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 1. Bắt buộc có để không bị load lại trang

    // Validate
    if(!email || !password){
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Gọi API
      const response = await api.post(ENDPOINTS.AUTH, {
        email: email,       // Gửi email
        password: password, // Gửi password
        clientType: 'web',  // Gửi clientType
      });

      const { token, role, maNhanVien, tenNhanVien } = response.data;

      if (token) {
        // 2. Lưu vào localStorage (Không cần await)
        localStorage.setItem('accessToken', token);

        const allowedRoles = ['THU_NGAN', 'QUAN_LY','BEP'];
        if (allowedRoles.includes(role) && maNhanVien && tenNhanVien) {
          localStorage.setItem('maNhanVien', String(maNhanVien));
          localStorage.setItem('tenNhanVien', tenNhanVien);

          localStorage.setItem('userRole', role);

          // 3. Điều hướng vào trang đầu tiên mà tài khoản được phép truy cập
          router.replace(getFirstRouteForRole(role));
        } else {
          setError("quyen tai khoan chua được cấp phép xác thực.");
          localStorage.removeItem('accessToken');
        }
      } else {
        setError("Không nhận được token xác thực.");
      }
    }
    catch (err) {
      console.error("Login error:", err);
      // Xử lý lỗi an toàn hơn để tránh crash nếu err.response không tồn tại
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 401) {
          setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
        } else {
          setError(err.response.data?.message || err.message || "Lỗi kết nối máy chủ.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
       else {
        setError("Lỗi kết nối máy chủ.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex min-h-screen w-full font-sans">
        {/* --- Cột trái: Form --- */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-[#0B0F19] text-white z-10">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">ĐỨC TOÀN Restaurant</h1>
            <p className="text-gray-400 text-sm mb-10">Đăng nhập vào hệ thống</p>

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                  {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              {/* Input Email/Username */}
              <div className="relative">
                <input
                    type="text"
                    name="username"
                    value={email} // SỬA: Biến chứa dữ liệu
                    onChange={(e) => setEmail(e.target.value)} // SỬA: Hàm cập nhật dữ liệu
                    placeholder="Tên đăng nhập / Email"
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    required
                />
              </div>

              {/* Input Password */}
              <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={password} // SỬA: Biến chứa dữ liệu
                    onChange={(e) => setPassword(e.target.value)} // SỬA: Hàm cập nhật dữ liệu
                    placeholder="Mật khẩu"
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    required
                />
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full py-4 mt-4 rounded-full text-white font-semibold text-lg shadow-lg
                    bg-gradient-to-r from-[#6366f1] to-[#3b82f6] 
                    hover:opacity-90 hover:shadow-blue-500/30
                    transition-all duration-300 transform active:scale-95
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>

        {/* --- Cột phải: Ảnh nền --- */}
        <div className="hidden lg:block w-7/12 relative bg-black">
          <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                // Đảm bảo ảnh nằm trong thư mục public/assets/images/
                backgroundImage: "url('/assets/images/bg_ductoan.png')",
              }}
          >
            <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
          </div>
        </div>

      </div>
  );
}