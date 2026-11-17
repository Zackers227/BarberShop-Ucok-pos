import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';
import Navbar from './Navbar';

export default function Layout({ children, activePage = '' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      checkPendingTransactions(token);
    }
  }, []);

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

  return (
    <>
      <style jsx global>{`
        /* Hide sidebar on mobile */
        @media (max-width: 768px) {
          aside {
            display: none !important;
          }
          .main-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar Menu */}
        <aside style={{
          width: '280px',
          background: '#3a3f51',
          color: 'white',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
          {/* Sidebar Header */}
          <div style={{
            background: '#2c3142',
            padding: '20px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            borderBottom: '1px solid #4a5264'
          }}>
            💼 MENSURFACE
          </div>

          {/* Master Aplikasi Section */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #4a5264'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              MASTER APLIKASI
            </div>
            <div style={{
              fontSize: '12px',
              color: '#bbb',
              marginBottom: '15px'
            }}>
              Pengaturan aplikasi
            </div>
            <div
              onClick={() => router.push('/settings')}
              style={{
                padding: '12px 15px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: '#ccc',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>⚙️</span>
              <span>Aplikasi</span>
            </div>
          </div>

          {/* Aplikasi Inventory & POS Section */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #4a5264'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              APLIKASI INVENTORY & POS
            </div>
            <div style={{
              fontSize: '12px',
              color: '#bbb',
              marginBottom: '15px'
            }}>
              Menu Utama Aplikasi
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {/* Dashboard */}
              <div
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  background: activePage === 'dashboard' ? '#2563eb' : 'transparent',
                  color: activePage === 'dashboard' ? 'white' : '#ccc',
                  fontWeight: activePage === 'dashboard' ? '600' : 'normal',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== 'dashboard') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (activePage !== 'dashboard') e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>📊</span>
                <span>Dashboard</span>
              </div>

              {/* Laporan */}
              <div
                onClick={() => router.push('/reports')}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  background: activePage === 'reports' ? '#2563eb' : 'transparent',
                  color: activePage === 'reports' ? 'white' : '#ccc',
                  fontWeight: activePage === 'reports' ? '600' : 'normal',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== 'reports') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (activePage !== 'reports') e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>📈</span>
                <span>Laporan</span>
              </div>

              {/* Riwayat */}
              <div
                onClick={() => router.push('/history')}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  background: activePage === 'history' ? '#2563eb' : 'transparent',
                  color: activePage === 'history' ? 'white' : '#ccc',
                  fontWeight: activePage === 'history' ? '600' : 'normal',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== 'history') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (activePage !== 'history') e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>📜</span>
                <span>Riwayat</span>
              </div>

              {/* Transaksi */}
              <div
                onClick={() => router.push('/transactions')}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  background: activePage === 'transactions' ? '#2563eb' : 'transparent',
                  color: activePage === 'transactions' ? 'white' : '#ccc',
                  fontWeight: activePage === 'transactions' ? '600' : 'normal',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== 'transactions') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (activePage !== 'transactions') e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>💳</span>
                <span>Transaksi</span>
              </div>

              {/* Pending */}
              <div
                onClick={() => router.push('/pending')}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '14px',
                  background: activePage === 'pending' ? '#2563eb' : 'transparent',
                  color: activePage === 'pending' ? 'white' : '#ccc',
                  fontWeight: activePage === 'pending' ? '600' : 'normal',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== 'pending') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (activePage !== 'pending') e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>⏳</span>
                  <span>Pending</span>
                </div>
                {pendingCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {pendingCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Manajemen Section */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #4a5264'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              MANAJEMEN
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {/* User / Kasir */}
              {hasPermission(user, 'users') && (
                <div
                  onClick={() => router.push('/users')}
                  style={{
                    padding: '12px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    background: activePage === 'users' ? '#2563eb' : 'transparent',
                    color: activePage === 'users' ? 'white' : '#ccc',
                    fontWeight: activePage === 'users' ? '600' : 'normal',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (activePage !== 'users') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (activePage !== 'users') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>👥</span>
                  <span>User / Kasir</span>
                </div>
              )}

              {/* Customer / Pelanggan */}
              {hasPermission(user, 'customers') && (
                <div
                  onClick={() => router.push('/customers')}
                  style={{
                    padding: '12px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    background: activePage === 'customers' ? '#2563eb' : 'transparent',
                    color: activePage === 'customers' ? 'white' : '#ccc',
                    fontWeight: activePage === 'customers' ? '600' : 'normal',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (activePage !== 'customers') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (activePage !== 'customers') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>🧑‍🤝‍🧑</span>
                  <span>Customer / Pelanggan</span>
                </div>
              )}

              {/* Kapster / Barberman */}
              {hasPermission(user, 'kapsters') && (
                <div
                  onClick={() => router.push('/kapsters')}
                  style={{
                    padding: '12px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    background: activePage === 'kapsters' ? '#2563eb' : 'transparent',
                    color: activePage === 'kapsters' ? 'white' : '#ccc',
                    fontWeight: activePage === 'kapsters' ? '600' : 'normal',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (activePage !== 'kapsters') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (activePage !== 'kapsters') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>💈</span>
                  <span>Kapster / Barberman</span>
                </div>
              )}

              {/* Layanan / Service */}
              {hasPermission(user, 'services') && (
                <div
                  onClick={() => router.push('/services')}
                  style={{
                    padding: '12px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    background: activePage === 'services' ? '#2563eb' : 'transparent',
                    color: activePage === 'services' ? 'white' : '#ccc',
                    fontWeight: activePage === 'services' ? '600' : 'normal',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (activePage !== 'services') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (activePage !== 'services') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>✂️</span>
                  <span>Layanan / Service</span>
                </div>
              )}

              {/* Produk / Barang */}
              {hasPermission(user, 'products') && (
                <div
                  onClick={() => router.push('/products')}
                  style={{
                    padding: '12px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    background: activePage === 'products' ? '#2563eb' : 'transparent',
                    color: activePage === 'products' ? 'white' : '#ccc',
                    fontWeight: activePage === 'products' ? '600' : 'normal',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (activePage !== 'products') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (activePage !== 'products') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>🧴</span>
                  <span>Produk / Barang</span>
                </div>
              )}

              {/* Logout */}
              <div
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: '#ef4444',
                  transition: 'all 0.3s',
                  marginTop: '10px',
                  borderTop: '1px solid #4a5264',
                  paddingTop: '20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ff6b6b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <span>🚪</span>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Wrapper - Shifted Right */}
        <div className="main-wrapper" style={{ marginLeft: '280px', width: 'calc(100% - 280px)' }}>
          {/* Use Navbar Component */}
          <Navbar currentPage={activePage} />

          {/* Main Content */}
          <div className="main-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
