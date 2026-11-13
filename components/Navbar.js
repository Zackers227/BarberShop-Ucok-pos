import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { hasPermission } from '../lib/permissions';
import Logo from './Logo';

export default function Navbar({ currentPage = '' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeShift, setActiveShift] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      checkActiveShift(token);
      checkPendingTransactions(token);
    }
  }, []);

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

  return (
    <>
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

        {/* ROW 2: Quick Navigation Buttons (5 buttons) */}
        <div className="quick-nav-row" style={{ 
          display: 'flex', 
          gap: '0.65rem',
          alignItems: 'center'
        }}>
          {/* Dashboard Button */}
          <button 
            className={`btn btn-sm quick-nav-btn ${currentPage === 'dashboard' ? 'btn-primary' : 'btn-success'}`}
            onClick={() => router.push('/dashboard')}
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.5rem 0.85rem',
              whiteSpace: 'nowrap',
              fontWeight: '600'
            }}
          >
            🏠 Dashboard
          </button>

          {hasPermission(user, 'reports') && (
            <button 
              className={`btn btn-sm quick-nav-btn ${currentPage === 'reports' ? 'btn-primary' : 'btn-success'}`}
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
              className={`btn btn-sm quick-nav-btn ${currentPage === 'transactions' ? 'btn-primary' : 'btn-success'}`}
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
              className={`btn btn-sm quick-nav-btn ${currentPage === 'transaction' ? 'btn-primary' : 'btn-success'}`}
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
              className={`btn btn-sm quick-nav-btn ${currentPage === 'pending' ? 'btn-primary' : ''}`}
              onClick={() => router.push('/pending-transactions')}
              style={{ 
                fontSize: '0.8rem', 
                padding: '0.5rem 0.85rem',
                whiteSpace: 'nowrap',
                fontWeight: '600',
                background: currentPage === 'pending' ? '#0ea5e9' : '#f59e0b',
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
    </>
  );
}
