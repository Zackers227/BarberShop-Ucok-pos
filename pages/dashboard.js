import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [router]);

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
        <link rel="stylesheet" href="/css/styles.css" />
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
          <div className="welcome-card">
            <h1>Selamat Datang, {user?.full_name || user?.username}! 👋</h1>
            <p>Sistem POS Barbershop siap digunakan</p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <button className="action-card" onClick={handleOpenShift}>
              <div className="action-icon">📂</div>
              <div className="action-title">Kelola Shift</div>
              <div className="action-desc">Buka/tutup shift kerja</div>
            </button>

            <button className="action-card" onClick={handleDailyReport}>
              <div className="action-icon">📊</div>
              <div className="action-title">Laporan Harian</div>
              <div className="action-desc">Lihat laporan hari ini</div>
            </button>

            <button className="action-card" onClick={handleHistory}>
              <div className="action-icon">📜</div>
              <div className="action-title">Riwayat Transaksi</div>
              <div className="action-desc">Cek transaksi sebelumnya</div>
            </button>
          </div>

          {/* Transaction Section */}
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

          {/* Management Section - Owner Only */}
          {user?.role === 'OWNER' && (
            <div className="card">
              <h3>⚙️ Manajemen (Owner Only)</h3>
              <div className="quick-actions-grid">
                <button className="action-card" onClick={() => router.push('/users')}>
                  <div className="action-icon">👥</div>
                  <div className="action-title">Kelola User</div>
                  <div className="action-desc">Tambah/edit kasir</div>
                </button>

                <button className="action-card" onClick={() => router.push('/kapsters')}>
                  <div className="action-icon">💈</div>
                  <div className="action-title">Kelola Kapster</div>
                  <div className="action-desc">Manajemen kapster</div>
                </button>

                <button className="action-card" onClick={() => router.push('/services')}>
                  <div className="action-icon">✂️</div>
                  <div className="action-title">Kelola Layanan</div>
                  <div className="action-desc">Atur layanan</div>
                </button>

                <button className="action-card" onClick={() => router.push('/products')}>
                  <div className="action-icon">🧴</div>
                  <div className="action-title">Kelola Produk</div>
                  <div className="action-desc">Manajemen produk</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2026 Barbershop Ucok POS | Versi 2.0 | Powered by Next.js</p>
        </footer>
      </div>
    </>
  );
}
