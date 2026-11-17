import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Navbar({ currentPage = '' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeShift, setActiveShift] = useState(null);

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      checkActiveShift(token);
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

  return (
    <>
      <nav className="navbar" style={{ 
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* LEFT: Logo */}
        <div className="navbar-brand">
          <Logo size="small" />
        </div>
        
        {/* RIGHT: Green Box with 2 Components - User & Shift */}
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
            minWidth: '85px'
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
                    opacity: 0.85'
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
        </div>
      </nav>
    </>
  );
}
