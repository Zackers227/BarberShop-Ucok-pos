import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';
import Navbar from './Navbar';

export default function Layout({ children, activePage = '' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);

  // Debug log untuk tracking user state
  console.log('🔄 Layout render - User:', user?.username, 'Permissions:', user?.permissions);

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('✅ User loaded:', parsedUser.username, 'Role:', parsedUser.role, 'Permissions:', parsedUser.permissions);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
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
        /* Base responsive adjustments */
        * {
          box-sizing: border-box;
        }

        /* Sidebar default styles - Desktop */
        aside {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        /* Hamburger Menu Button */
        .hamburger-btn {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1001;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 15px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.hidden {
          opacity: 0;
          pointer-events: none;
        }

        /* Toggle Menu Visibility Button */
        .toggle-menu-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1002;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          font-size: 24px;
          display: none;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .toggle-menu-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.6);
        }

        .toggle-menu-btn:active {
          transform: scale(0.95);
        }

        /* Show hamburger on mobile and tablet */
        @media (max-width: 1024px) {
          .hamburger-btn {
            display: block;
          }

          .toggle-menu-btn {
            display: flex;
          }

          /* Hamburger hidden state on mobile */
          .hamburger-btn.hidden {
            display: none;
          }

          /* Show close button in sidebar on mobile */
          .sidebar-close-btn {
            display: block !important;
          }

          /* Sidebar mobile styles */
          aside {
            position: fixed !important;
            left: -280px !important;
            transition: left 0.3s ease !important;
            z-index: 1001 !important;
          }

          aside.sidebar-open {
            left: 0 !important;
          }

          /* Overlay when sidebar open */
          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
          }

          .sidebar-overlay.active {
            display: block;
          }

          .main-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }

        /* Desktop */
        @media (min-width: 1025px) {
          .hamburger-btn {
            display: none !important;
          }

          .toggle-menu-btn {
            display: none !important;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger-btn ${!menuVisible ? 'hidden' : ''}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* Toggle Menu Visibility Button */}
        <button
          className="toggle-menu-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !menuVisible;
            setMenuVisible(newState);
            // Close sidebar when hiding hamburger button
            if (!newState) {
              setSidebarOpen(false);
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={menuVisible ? 'Hide menu button' : 'Show menu button'}
          title={menuVisible ? 'Sembunyikan Tombol Menu' : 'Tampilkan Tombol Menu'}
          style={{
            display: 'flex',
            touchAction: 'manipulation'
          }}
        >
          {menuVisible ? '👁️' : '🔘'}
        </button>

        {/* Sidebar Overlay */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Menu */}
        <aside className={sidebarOpen ? 'sidebar-open' : ''} style={{
          width: '280px',
          background: '#3a3f51',
          color: 'white',
          height: '100vh',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'none',
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 1001
            }}
            className="sidebar-close-btn"
          >
            ✕
          </button>

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
              onClick={() => { setSidebarOpen(false); router.push('/settings'); }}
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
              {(() => {
                const canAccessDashboard = hasPermission(user, 'dashboard');
                console.log('🔍 Dashboard permission check:', { user: user?.username, role: user?.role, permissions: user?.permissions, canAccess: canAccessDashboard });
                return canAccessDashboard;
              })() && (
                <div
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push('/dashboard');
                  }}
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
              )}

              {/* Laporan */}
              {hasPermission(user, 'reports') && (
                <div
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push('/reports');
                  }}
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
              )}

              {/* Riwayat */}
              {(() => {
                const canAccessHistory = hasPermission(user, 'history');
                console.log('🔍 History permission check:', { user: user?.username, role: user?.role, permissions: user?.permissions, canAccess: canAccessHistory });
                return canAccessHistory;
              })() && (
                <div
                  onClick={() => { setSidebarOpen(false); router.push('/history'); }}
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
              )}

              {/* Transaksi */}
              <div
                onClick={() => { setSidebarOpen(false); router.push('/transactions'); }}
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
                onClick={() => { setSidebarOpen(false); router.push('/pending'); }}
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

              {/* Shifts */}
              <div
                onClick={() => { setSidebarOpen(false); router.push('/shifts'); }}
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  background: activePage === 'shifts' ? '#2563eb' : 'transparent',
                  color: activePage === 'shifts' ? 'white' : '#ccc',
                  fontWeight: activePage === 'shifts' ? '600' : 'normal',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== 'shifts') e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (activePage !== 'shifts') e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>🔄</span>
                <span>Kelola Shift</span>
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
                  onClick={() => { setSidebarOpen(false); router.push('/users'); }}
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
                  onClick={() => { setSidebarOpen(false); router.push('/customers'); }}
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
                  onClick={() => { setSidebarOpen(false); router.push('/kapsters'); }}
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
                  onClick={() => { setSidebarOpen(false); router.push('/services'); }}
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
                  onClick={() => { setSidebarOpen(false); router.push('/products'); }}
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

