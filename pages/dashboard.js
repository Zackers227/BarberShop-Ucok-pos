import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    
    // Check pending transactions
    checkPendingTransactions(token);
    
    setLoading(false);
  }, [router]);

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
        {/* Use Navbar Component */}
        <Navbar currentPage="dashboard" />

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
