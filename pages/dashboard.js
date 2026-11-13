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
        {/* Navbar - Simple 3-Section Layout */}
        <nav className="navbar" style={{ 
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* LEFT: Logo */}
          <div className="navbar-brand">
            <Logo size="small" />
          </div>
          
          {/* CENTER: Quick Navigation Buttons Only */}
          <div style={{ 
            display: 'flex', 
            gap: '0.65rem',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
          }}>
            {hasPermission(user, 'reports') && (
              <button 
                className="btn btn-sm btn-success"
                onClick={() => router.push('/reports')}
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0.85rem',
                  whiteSpace: 'nowrap',
                  fontWeight: '600'
                }}
              >
                📊 Laporan
              </button>
            )}
            {hasPermission(user, 'transactions') && (
              <button 
                className="btn btn-sm btn-success"
                onClick={() => router.push('/transactions')}
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0.85rem',
                  whiteSpace: 'nowrap',
                  fontWeight: '600'
                }}
              >
                📜 Riwayat
              </button>
            )}
            {hasPermission(user, 'transaction_create') && (
              <button 
                className="btn btn-sm btn-success"
                onClick={() => router.push('/transaction')}
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0.85rem',
                  whiteSpace: 'nowrap',
                  fontWeight: '600'
                }}
              >
                🛒 Transaksi
              </button>
            )}
          </div>

          {/* RIGHT: Green Box with 3 Components - User, Shift, Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%)',
            borderRadius: '10px',
            border: '1.5px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
          }}>
            {/* 1. User Info */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              lineHeight: '1.2',
              borderRight: '1px solid rgba(16, 185, 129, 0.3)',
              paddingRight: '0.75rem'
            }}>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                👤 {user?.full_name || user?.username}
              </div>
              <div style={{ 
                fontSize: '0.7rem',
                color: 'white',
                background: '#6366f1',
                padding: '0.15rem 0.5rem',
                borderRadius: '10px',
                fontWeight: '600',
                textTransform: 'uppercase',
                marginTop: '0.2rem'
              }}>
                {user?.role}
              </div>
            </div>

            {/* 2. Shift Status */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              background: activeShift ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: activeShift ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
              minWidth: '85px',
              borderRight: '1px solid rgba(16, 185, 129, 0.3)',
              paddingRight: '0.75rem',
              marginRight: '0.25rem'
            }}>
              {activeShift ? (
                <>
                  <span style={{ fontSize: '1.1rem' }}>🟢</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    color: '#059669',
                    textAlign: 'center'
                  }}>
                    Shift #{activeShift.id}
                  </span>
                  {activeShift.total_transactions > 0 && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: '#059669',
                      opacity: 0.85
                    }}>
                      {activeShift.total_transactions} trx
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: '700',
                    color: '#D97706'
                  }}>
                    Tutup
                  </span>
                  <button 
                    onClick={() => router.push('/shifts')}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.65rem',
                      background: '#D97706',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      marginTop: '0.15rem'
                    }}
                  >
                    Buka
                  </button>
                </>
              )}
            </div>

            {/* 3. Logout Button */}
            <button 
              className="btn btn-danger btn-sm" 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
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
