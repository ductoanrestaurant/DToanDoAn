'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Email hoặc mật khẩu không chính xác' }));
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('accessToken', data.token);
        router.push('/dashboard');
      } else {
        throw new Error('Không nhận được token từ server');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã có lỗi không xác định xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>Đăng Nhập Trang Quản Trị</h1>
        <p style={styles.subtitle}>Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif',
  },
  loginBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#111827',
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    boxSizing: 'border-box',
    color: 'black'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  button: {
    backgroundColor: '#007AFF',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
