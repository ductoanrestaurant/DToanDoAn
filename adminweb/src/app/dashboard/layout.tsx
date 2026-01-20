'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Đang tải...</p>
        </div>
    );
  }

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin</h2>
        <nav style={styles.nav}>
          <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link href="/dashboard/products" style={styles.navLink}>Sản phẩm</Link>
          <Link href="/dashboard/orders" style={styles.navLink}>Đơn hàng</Link>
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>Đăng xuất</button>
      </aside>
      <main style={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#111827',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
    },
    sidebarTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '30px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    navLink: {
        color: '#d1d5db',
        textDecoration: 'none',
        padding: '12px 15px',
        borderRadius: '8px',
        marginBottom: '8px',
        transition: 'background-color 0.2s',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
    },
    mainContent: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#f9fafb',
    },
};
