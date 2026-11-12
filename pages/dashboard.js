import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeShift, setActiveShift] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Check active shift
    checkActiveShift(token);
    
    setLoading(false);
  }, [router]);

  const checkActiveShift = async (token) => {
    try {
      const response = await fetch('/api/shifts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const active = data.find(shift => !shift.closed_at);
      setActiveShift(active);
    } catch (error) {
      console.error('Error checking shift:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleOpenShift = () => {
    router.push('/shifts');
  };

  const handleDailyReport = () => {
    router.push('/reports');
  };

  const handleHistory = () => {
    router.push('/transactions');
  };

  const handleNewTransaction = () => {
    router.push('/transaction');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Barbershop Ucok POS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <div className="dashboard-container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>💈 Barbershop Ucok POS</h2>
          </div>
          <div className="navbar-menu">
            <span className="user-info">
              👤 {user?.full_name || user?.username} 
              <span className="user-role">({user?.role})</span>
            </span>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          {/* Shift Status Warning/Info */}
          {activeShift ? (
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: '1.25rem 1.75rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  🟢 Shift #{activeShift.id} Sedang Aktif
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Dibuka: {new Date(activeShift.opened_at).toLocaleString('id-ID')}
                  {activeShift.total_transactions > 0 && (
                    <span style={{ marginLeft: '1rem' }}>
                      • {activeShift.total_transactions} transaksi • Rp {activeShift.total_sales?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <button 
                className="btn btn-danger"
                onClick={() => router.push('/shifts')}
                style={{ whiteSpace: 'nowrap' }}
              >
                Tutup Shift
              </button>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              padding: '1.25rem 1.75rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  ⚠️ Shift Belum Dibuka
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Silakan buka shift terlebih dahulu untuk memulai transaksi
                </div>
              </div>
              <button 
                className="btn btn-success"
                onClick={() => router.push('/shifts')}
                style={{ whiteSpace: 'nowrap', background: 'white', color: '#D97706' }}
              >
                Buka Shift
              </button>
            </div>
          )}

          <div className="welcome-card">
            <h1>Selamat Datang, {user?.full_name || user?.username}! 👋</h1>
            <p>Sistem POS Barbershop siap digunakan</p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            {hasPermission(user, 'shifts') && (
              <button className="action-card" onClick={handleOpenShift}>
                <div className="action-icon">📂</div>
                <div className="action-title">Kelola Shift</div>
                <div className="action-desc">Buka/tutup shift kerja</div>
              </button>
            )}

            {hasPermission(user, 'transactions') && (
              <button className="action-card" onClick={() => router.push('/pending-transactions')}>
                <div className="action-icon">⏸️</div>
                <div className="action-title">Transaksi Pending</div>
                <div className="action-desc">Belum dibayar</div>
              </button>
            )}

            {hasPermission(user, 'reports') && (
              <button className="action-card" onClick={handleDailyReport}>
                <div className="action-icon">📊</div>
                <div className="action-title">Laporan Harian</div>
                <div className="action-desc">Lihat laporan hari ini</div>
              </button>
            )}

            {hasPermission(user, 'transactions') && (
              <button className="action-card" onClick={handleHistory}>
                <div className="action-icon">📜</div>
                <div className="action-title">Riwayat Transaksi</div>
                <div className="action-desc">Cek transaksi sebelumnya</div>
              </button>
            )}
          </div>

            {/* Transaction Section */}
          {hasPermission(user, 'transaction_create') && (
            <div className="transaction-section">
              <div className="section-header">
                <h2>Transaksi Baru</h2>
              </div>

              <div className="placeholder-content">
                <div className="placeholder-icon">🛒</div>
                <h3>Form Transaksi POS</h3>
                <p>Fitur yang tersedia:</p>
                <ul>
                  <li>✅ Pilih customer & kapster</li>
                  <li>✅ Tambah layanan & produk ke keranjang</li>
                  <li>✅ Terapkan diskon</li>
                  <li>✅ Proses pembayaran (Tunai/QRIS/Transfer)</li>
                  <li>✅ Cetak struk thermal 58mm</li>
                </ul>
                <button className="btn btn-success btn-lg" onClick={handleNewTransaction}>
                  🛒 Mulai Transaksi Baru
                </button>
              </div>
            </div>
          )}

          {/* Management Section */}
          <div className="card">
            <h3>⚙️ Manajemen</h3>
            <div className="quick-actions-grid">
              {hasPermission(user, 'users') && (
                <button className="action-card" onClick={() => router.push('/users')}>
                  <div className="action-icon">👥</div>
                  <div className="action-title">Kelola User</div>
                  <div className="action-desc">Tambah/edit kasir</div>
                </button>
              )}

              {hasPermission(user, 'customers') && (
                <button className="action-card" onClick={() => router.push('/customers')}>
                  <div className="action-icon">🧑‍🤝‍🧑</div>
                  <div className="action-title">Kelola Customer</div>
                  <div className="action-desc">Database pelanggan</div>
                </button>
              )}

              {hasPermission(user, 'kapsters') && (
                <button className="action-card" onClick={() => router.push('/kapsters')}>
                  <div className="action-icon">💈</div>
                  <div className="action-title">Kelola Kapster</div>
                  <div className="action-desc">Manajemen kapster</div>
                </button>
              )}

              {hasPermission(user, 'services') && (
                <button className="action-card" onClick={() => router.push('/services')}>
                  <div className="action-icon">✂️</div>
                  <div className="action-title">Kelola Layanan</div>
                  <div className="action-desc">Atur layanan</div>
                </button>
              )}

              {hasPermission(user, 'products') && (
                <button className="action-card" onClick={() => router.push('/products')}>
                  <div className="action-icon">🧴</div>
                  <div className="action-title">Kelola Produk</div>
                  <div className="action-desc">Manajemen produk</div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2026 Barbershop Ucok POS | Versi 2.0 | Powered by Next.js</p>
        </footer>
      </div>
    </>
  );
}
