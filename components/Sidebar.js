import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';

export default function Sidebar({ user, pendingCount = 0, currentPage = '' }) {
  const router = useRouter();

  return (
    <aside style={{
      width: '280px',
      background: '#3a3f51',
      color: 'white',
      height: '100vh',
      overflowY: 'auto',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
    }}>
      {/* Close button for mobile */}
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('closeSidebar');
            window.dispatchEvent(event);
          }
        }}
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
              background: currentPage === 'dashboard' ? '#2563eb' : 'transparent',
              color: currentPage === 'dashboard' ? 'white' : '#ccc',
              fontWeight: currentPage === 'dashboard' ? '600' : 'normal',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'dashboard') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'dashboard') {
                e.currentTarget.style.background = 'transparent';
              }
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
              background: currentPage === 'reports' ? '#2563eb' : 'transparent',
              color: currentPage === 'reports' ? 'white' : '#ccc',
              fontWeight: currentPage === 'reports' ? '600' : 'normal',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'reports') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'reports') {
                e.currentTarget.style.background = 'transparent';
              }
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
              background: currentPage === 'history' ? '#2563eb' : 'transparent',
              color: currentPage === 'history' ? 'white' : '#ccc',
              fontWeight: currentPage === 'history' ? '600' : 'normal',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'history') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'history') {
                e.currentTarget.style.background = 'transparent';
              }
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
              background: currentPage === 'transactions' ? '#2563eb' : 'transparent',
              color: currentPage === 'transactions' ? 'white' : '#ccc',
              fontWeight: currentPage === 'transactions' ? '600' : 'normal',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'transactions') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'transactions') {
                e.currentTarget.style.background = 'transparent';
              }
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
              background: currentPage === 'pending' ? '#2563eb' : 'transparent',
              color: currentPage === 'pending' ? 'white' : '#ccc',
              fontWeight: currentPage === 'pending' ? '600' : 'normal',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'pending') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'pending') {
                e.currentTarget.style.background = 'transparent';
              }
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

          {/* Kelola Shift */}
          <div
            onClick={() => router.push('/shifts')}
            style={{
              padding: '12px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              background: currentPage === 'shifts' ? '#2563eb' : 'transparent',
              color: currentPage === 'shifts' ? 'white' : '#ccc',
              fontWeight: currentPage === 'shifts' ? '600' : 'normal',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'shifts') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'shifts') {
                e.currentTarget.style.background = 'transparent';
              }
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
              onClick={() => router.push('/users')}
              style={{
                padding: '12px 15px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                background: currentPage === 'users' ? '#2563eb' : 'transparent',
                color: currentPage === 'users' ? 'white' : '#ccc',
                fontWeight: currentPage === 'users' ? '600' : 'normal',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'users') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'users') {
                  e.currentTarget.style.background = 'transparent';
                }
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
                background: currentPage === 'customers' ? '#2563eb' : 'transparent',
                color: currentPage === 'customers' ? 'white' : '#ccc',
                fontWeight: currentPage === 'customers' ? '600' : 'normal',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'customers') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'customers') {
                  e.currentTarget.style.background = 'transparent';
                }
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
                background: currentPage === 'kapsters' ? '#2563eb' : 'transparent',
                color: currentPage === 'kapsters' ? 'white' : '#ccc',
                fontWeight: currentPage === 'kapsters' ? '600' : 'normal',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'kapsters') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'kapsters') {
                  e.currentTarget.style.background = 'transparent';
                }
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
                background: currentPage === 'services' ? '#2563eb' : 'transparent',
                color: currentPage === 'services' ? 'white' : '#ccc',
                fontWeight: currentPage === 'services' ? '600' : 'normal',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'services') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'services') {
                  e.currentTarget.style.background = 'transparent';
                }
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
                background: currentPage === 'products' ? '#2563eb' : 'transparent',
                color: currentPage === 'products' ? 'white' : '#ccc',
                fontWeight: currentPage === 'products' ? '600' : 'normal',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'products') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'products') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>🧴</span>
              <span>Produk / Barang</span>
            </div>
          )}

          {/* Logout */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }
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
  );
}
