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
    alert('Fitur Buka Shift akan segera tersedia!');
  };

  const handleCloseShift = () => {
    alert('Fitur Tutup Shift akan segera tersedia!');
  };

  const handleDailyReport = () => {
    alert('Fitur Laporan Harian akan segera tersedia!');
  };

  const handleHistory = () => {
    alert('Fitur Riwayat Transaksi akan segera tersedia!');
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
              👤 {user?.name || user?.username} 
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
            <h1>Selamat Datang, {user?.name || user?.username}! 👋</h1>
            <p>Sistem POS Barbershop siap digunakan</p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <button className="action-card" onClick={handleOpenShift}>
              <div className="action-icon">📂</div>
              <div className="action-title">Buka Shift</div>
              <div className="action-desc">Mulai shift kerja baru</div>
            </button>

            <button className="action-card" onClick={handleCloseShift}>
              <div className="action-icon">📁</div>
              <div className="action-title">Tutup Shift</div>
              <div className="action-desc">Selesai shift & rekap</div>
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

          {/* Transaction Section - Coming Soon */}
          <div className="transaction-section">
            <div className="section-header">
              <h2>Transaksi Baru</h2>
              <p className="coming-soon">🚧 Fitur transaksi sedang dalam pengembangan</p>
            </div>

            <div className="placeholder-content">
              <div className="placeholder-icon">🛠️</div>
              <h3>Form Transaksi POS</h3>
              <p>Fitur ini akan memungkinkan Anda untuk:</p>
              <ul>
                <li>✅ Pilih customer & kapster</li>
                <li>✅ Tambah layanan & produk ke keranjang</li>
                <li>✅ Terapkan diskon</li>
                <li>✅ Proses pembayaran (Tunai/QRIS/Transfer)</li>
                <li>✅ Cetak struk thermal 58mm</li>
              </ul>
              <p className="note">💡 Hubungi developer untuk aktivasi fitur</p>
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
