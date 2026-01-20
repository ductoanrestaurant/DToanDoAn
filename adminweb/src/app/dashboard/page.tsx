'use client';

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
        Dashboard
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
      }}>
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>Doanh thu hôm nay</h3>
          <p style={styles.cardValue}>12.000.000đ</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>Đơn hàng mới</h3>
          <p style={styles.cardValue}>32</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>Khách hàng mới</h3>
          <p style={styles.cardValue}>15</p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
    statCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    cardTitle: {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '8px',
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#111827',
    },
};
