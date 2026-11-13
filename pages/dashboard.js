import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';
import Logo from '../components/Logo';

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
            <Logo size="small" />
          </div>
          <div className="navbar-menu">
            {/* Quick Navigation Links */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginRight: '1rem',
              flexWrap: 'wrap'
            }}>
              {hasPermission(user, 'reports') && (
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => router.push('/reports')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  📊 Laporan
                </button>
              )}
              {hasPermission(user, 'transactions') && (
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => router.push('/transactions')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  📜 Riwayat
                </button>
              )}
              {hasPermission(user, 'transaction_create') && (
                <button 
                  className="btn btn-sm btn-success"
                  onClick={() => router.push('/transaction')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  🛒 Transaksi
                </button>
              )}
            </div>
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
          {/* Compact Shift Status */}
          {activeShift ? (
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              <div>
                <strong>🟢 Shift #{activeShift.id}</strong>
                {activeShift.total_transactions > 0 && (
                  <span style={{ marginLeft: '0.5rem', opacity: 0.9 }}>
                    • {activeShift.total_transactions} trx
                  </span>
                )}
              </div>
              <button 
                className="btn btn-sm"
                onClick={() => router.push('/shifts')}
                style={{ 
                  background: 'white', 
                  color: '#059669',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem'
                }}
              >
                Tutup
              </button>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              <div>
                <strong>⚠️ Shift Belum Dibuka</strong>
              </div>
              <button 
                className="btn btn-sm"
                onClick={() => router.push('/shifts')}
                style={{ 
                  background: 'white', 
                  color: '#D97706',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem'
                }}
              >
                Buka Shift
              </button>
            </div>
          )}

          {/* Welcome - More Compact */}
          <div className="welcome-card" style={{ 
            padding: '1rem', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              Selamat Datang, {user?.full_name || user?.username}! 👋
            </h1>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Sistem POS Barbershop siap digunakan</p>
          </div>

          {/* Compact Quick Actions Grid - 2 columns on mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            {hasPermission(user, 'shifts') && (
              <button 
                className="action-card"
                onClick={handleOpenShift}
                style={{ padding: '0.75rem', minHeight: 'auto' }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>📂</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.15rem' }}>Kelola Shift</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Buka/tutup shift</div>
              </button>
            )}

            {hasPermission(user, 'transactions') && (
              <button 
                className="action-card" 
                onClick={() => router.push('/pending-transactions')}
                style={{ padding: '0.75rem', minHeight: 'auto' }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>⏸️</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.15rem' }}>Transaksi Pending</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Belum dibayar</div>
              </button>
            )}

            {hasPermission(user, 'reports') && (
              <button 
                className="action-card" 
                onClick={handleDailyReport}
                style={{ padding: '0.75rem', minHeight: 'auto' }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>📊</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.15rem' }}>Laporan Harian</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Lihat laporan</div>
              </button>
            )}

            {hasPermission(user, 'transactions') && (
              <button 
                className="action-card" 
                onClick={handleHistory}
                style={{ padding: '0.75rem', minHeight: 'auto' }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>📜</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.15rem' }}>Riwayat Transaksi</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Cek transaksi</div>
              </button>
            )}
          </div>

          {/* Compact Transaction Section */}
          {hasPermission(user, 'transaction_create') && (
            <div className="transaction-section" style={{ marginBottom: '1rem' }}>
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Transaksi Baru</h3>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
                  Proses transaksi, tambah item, cetak struk
                </p>
                <button 
                  className="btn btn-success btn-lg" 
                  onClick={handleNewTransaction}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem'
                  }}
                >
                  🛒 Mulai Transaksi Baru
                </button>
              </div>
            </div>
          )}

          {/* Compact Management Section */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>⚙️ Manajemen</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.65rem'
            }}>
              {hasPermission(user, 'users') && (
                <button 
                  className="action-card" 
                  onClick={() => router.push('/users')}
                  style={{ padding: '0.65rem', minHeight: 'auto' }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>👥</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.1rem' }}>User</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Kasir</div>
                </button>
              )}

              {hasPermission(user, 'customers') && (
                <button 
                  className="action-card" 
                  onClick={() => router.push('/customers')}
                  style={{ padding: '0.65rem', minHeight: 'auto' }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🧑‍🤝‍🧑</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.1rem' }}>Customer</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Pelanggan</div>
                </button>
              )}

              {hasPermission(user, 'kapsters') && (
                <button 
                  className="action-card" 
                  onClick={() => router.push('/kapsters')}
                  style={{ padding: '0.65rem', minHeight: 'auto' }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>💈</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.1rem' }}>Kapster</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Barberman</div>
                </button>
              )}

              {hasPermission(user, 'services') && (
                <button 
                  className="action-card" 
                  onClick={() => router.push('/services')}
                  style={{ padding: '0.65rem', minHeight: 'auto' }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>✂️</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.1rem' }}>Layanan</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Service</div>
                </button>
              )}

              {hasPermission(user, 'products') && (
                <button 
                  className="action-card" 
                  onClick={() => router.push('/products')}
                  style={{ padding: '0.65rem', minHeight: 'auto' }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🧴</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.1rem' }}>Produk</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Barang</div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2026 MENSURFACE Barber and Shop | Versi 2.1 | Powered by Next.js</p>
        </footer>
      </div>
    </>
  );
}
