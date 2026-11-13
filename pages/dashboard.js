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
  const [pendingCount, setPendingCount] = useState(0);

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
    
    // Check pending transactions
    checkPendingTransactions(token);
    
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

  const checkPendingTransactions = async (token) => {
    try {
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const pending = data.filter(t => t.status === 'pending');
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Error checking pending transactions:', error);
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

      <style jsx>{`
        /* Mobile Responsive - Phone (max-width: 480px) */
        @media (max-width: 480px) {
          .navbar-row1 {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          
          .green-box {
            width: 100% !important;
            flex-direction: column !important;
            gap: 0.4rem !important;
            padding: 0.5rem !important;
          }
          
          .green-box > div {
            border-right: none !important;
            padding-right: 0 !important;
            margin-right: 0 !important;
            width: 100%;
            border-bottom: 1px solid rgba(16, 185, 129, 0.3) !important;
            padding-bottom: 0.4rem !important;
          }
          
          .green-box > div:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
          
          .user-info-mobile {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
          }
          
          .shift-status-mobile {
            flex-direction: row !important;
            justify-content: space-between !important;
            padding: 0.4rem !important;
            min-width: 100% !important;
          }
          
          .logout-btn-mobile {
            width: 100% !important;
          }
          
          .quick-nav-row {
            display: flex !important;
            flex-direction: row !important;
            gap: 0.4rem !important;
            width: 100% !important;
            overflow-x: auto !important;
          }
          
          .quick-nav-btn {
            font-size: 0.7rem !important;
            padding: 0.5rem 0.4rem !important;
            flex: 1 !important;
            min-width: fit-content !important;
            text-align: center !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            white-space: nowrap !important;
          }
        }

        /* Tablet and Desktop - Keep existing layout */
        @media (min-width: 481px) {
          .navbar-row1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
          
          .green-box {
            display: flex;
            align-items: center;
          }
          
          .quick-nav-row {
            display: flex;
            gap: 0.65rem;
            align-items: center;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Navbar - 2 Row Layout */}
        <nav className="navbar" style={{ 
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* ROW 1: Logo Left + Green Box Right */}
          <div className="navbar-row1" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            {/* LEFT: Logo */}
            <div className="navbar-brand">
              <Logo size="small" />
            </div>
            
            {/* RIGHT: Green Box with 3 Components - User, Shift, Logout */}
            <div className="green-box" style={{
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
              <div className="user-info-mobile" style={{ 
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
              <div className="shift-status-mobile" style={{ 
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
                className="btn btn-danger btn-sm logout-btn-mobile" 
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
          </div>

          {/* ROW 2: Quick Navigation Buttons */}
          <div className="quick-nav-row" style={{ 
            display: 'flex', 
            gap: '0.65rem',
            alignItems: 'center'
          }}>
            {hasPermission(user, 'reports') && (
              <button 
                className="btn btn-sm btn-success quick-nav-btn"
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
                className="btn btn-sm btn-success quick-nav-btn"
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
                className="btn btn-sm btn-success quick-nav-btn"
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
            {hasPermission(user, 'transactions') && (
              <button 
                className="btn btn-sm quick-nav-btn"
                onClick={() => router.push('/pending-transactions')}
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0.85rem',
                  whiteSpace: 'nowrap',
                  fontWeight: '600',
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  position: 'relative'
                }}
              >
                ⏸️ Pending
                {pendingCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#dc2626',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
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

          {/* Pending Transactions Alert */}
          {pendingCount > 0 && hasPermission(user, 'transactions') && (
            <div 
              onClick={() => router.push('/pending-transactions')}
              style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.2)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>⏸️</div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#ea580c' }}>
                    Ada {pendingCount} Transaksi Pending
                  </h3>
                  <p style={{ fontSize: '0.8rem', margin: 0, color: '#9a3412' }}>
                    Klik untuk melihat dan memproses pembayaran
                  </p>
                </div>
              </div>
              <div style={{
                background: '#f59e0b',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1.25rem'
              }}>
                {pendingCount}
              </div>
            </div>
          )}

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
