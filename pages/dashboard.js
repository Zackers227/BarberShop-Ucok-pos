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

  // Chart data for Income Perbulan (Line Chart)
  const monthlyIncomeChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tahun Ini (2026)',
        data: [2500000, 2800000, 3100000, 2900000, 3400000, 3800000, 4200000, 3900000, 4500000, 4100000, 4800000, 5200000],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Tahun Lalu (2025)',
        data: [2200000, 2400000, 2700000, 2500000, 2900000, 3100000, 3400000, 3200000, 3600000, 3300000, 3800000, 4000000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  // Chart options for Income Perbulan
  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
          },
          font: { size: 10 }
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  // Chart data for Income Pertahun (Bar Chart)
  const yearlyIncomeChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tahun Ini (2026)',
        data: [2500000, 2800000, 3100000, 2900000, 3400000, 3800000, 4200000, 3900000, 4500000, 4100000, 4800000, 5200000],
        backgroundColor: '#2563eb',
        borderColor: '#1e40af',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Tahun Lalu (2025)',
        data: [2200000, 2400000, 2700000, 2500000, 2900000, 3100000, 3400000, 3200000, 3600000, 3300000, 3800000, 4000000],
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // Chart options for Income Pertahun
  const yearlyChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
          },
          font: { size: 10 }
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

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
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>{`
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
      </Head>

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
              {/* Dashboard - Active */}
              <div
                style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  background: '#2563eb',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                <span>📊</span>
                <span>Dashboard</span>
              </div>

              {/* Identitas */}
              <div
                onClick={() => router.push('/identity')}
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
                <span>🆔</span>
                <span>Identitas</span>
              </div>

              {/* Mobile Kasir */}
              <div
                onClick={() => router.push('/transaction')}
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
                <span>📱</span>
                <span>Mobile Kasir</span>
              </div>

              {/* Pembelian */}
              <div
                onClick={() => router.push('/purchases')}
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
                <span>💳</span>
                <span>Pembelian</span>
              </div>

              {/* Penjualan */}
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
                  color: '#ccc',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>🛒</span>
                <span>Penjualan</span>
              </div>

              {/* Gudang */}
              <div
                onClick={() => router.push('/warehouse')}
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
                <span>🏪</span>
                <span>Gudang</span>
              </div>

              {/* Barang */}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>📦</span>
                  <span>Barang</span>
                </div>
              )}

              {/* Supplier */}
              <div
                onClick={() => router.push('/suppliers')}
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
                <span>🚚</span>
                <span>Supplier</span>
              </div>

              {/* Customer */}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>👥</span>
                  <span>Customer</span>
                </div>
              )}

              {/* Cetak Barcode */}
              <div
                onClick={() => router.push('/barcode')}
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
                <span>📋</span>
                <span>Cetak Barcode</span>
              </div>

              {/* Setting */}
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
                <span>Setting</span>
              </div>

              {/* Referensi */}
              <div
                onClick={() => router.push('/reference')}
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
                <span>📚</span>
                <span>Referensi</span>
              </div>

              {/* User */}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>👤</span>
                  <span>User</span>
                </div>
              )}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                    color: '#ccc',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
          <Navbar currentPage="dashboard" />

        {/* Main Content */}
        <div className="main-content">
          {/* Title Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Dashboard</h1>
            <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>Ringkasan performa bisnis Anda</p>
          </div>

          {/* METRIC CARDS - 4 Columns in 1 Row */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}>
            {/* Total Item Terjual */}
            <div style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              minHeight: '140px',
              minWidth: '220px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Item Terjual</span>
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>9.787</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                opacity: 0.85,
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                <span style={{ fontWeight: '600' }}>30%</span>
                <span>2026</span>
              </div>
            </div>

            {/* Total Transaksi */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              minHeight: '140px',
              minWidth: '220px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Transaksi</span>
                <span style={{ fontSize: '24px' }}>💰</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>2.182</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                opacity: 0.85,
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                <span style={{ fontWeight: '600' }}>30%</span>
                <span>2026</span>
              </div>
            </div>

            {/* Total Income */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
              minHeight: '140px',
              minWidth: '220px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Income</span>
                <span style={{ fontSize: '24px' }}>📈</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>3.7 Miliar</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                opacity: 0.85,
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                <span style={{ fontWeight: '600' }}>30%</span>
                <span>2026</span>
              </div>
            </div>

            {/* Total Pelanggan Aktif */}
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
              minHeight: '140px',
              minWidth: '220px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Pelanggan Aktif</span>
                <span style={{ fontSize: '24px' }}>👥</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>14</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                opacity: 0.85,
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                <span style={{ fontWeight: '600' }}>8%</span>
                <span>2026</span>
              </div>
            </div>
          </div>

          {/* INCOME CHARTS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '2rem'
          }}>
            {/* Income Perbulan - Line Chart */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              minHeight: '350px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '15px' }}>📈 Income Perbulan</h3>
              <canvas id="monthlyIncomeChart"></canvas>
            </div>

            {/* Income Pertahun - Bar Chart */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              minHeight: '350px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '15px' }}>📊 Income Pertahun</h3>
              <canvas id="yearlyIncomeChart"></canvas>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2026 MENSURFACE Barber and Shop | Versi 2.1 | Powered by Next.js</p>
        </footer>
        </div> {/* End Main Content Wrapper */}
      </div>

      <script>{`
        // Initialize Chart.js charts with sample data
        if (typeof Chart !== 'undefined') {
          // Monthly Income Chart (Line)
          const monthlyCtx = document.getElementById('monthlyIncomeChart');
          if (monthlyCtx) {
            new Chart(monthlyCtx, {
              type: 'line',
              data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                  {
                    label: 'Tahun Ini (2026)',
                    data: [2500000, 2800000, 3100000, 2900000, 3400000, 3800000, 4200000, 3900000, 4500000, 4100000, 4800000, 5200000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                  },
                  {
                    label: 'Tahun Lalu (2025)',
                    data: [2200000, 2400000, 2700000, 2500000, 2900000, 3100000, 3400000, 3200000, 3600000, 3300000, 3800000, 4000000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      font: { size: 12, weight: 'bold' },
                      padding: 15,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
                      },
                      font: { size: 10 }
                    },
                    grid: {
                      drawBorder: false,
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      font: { size: 10 }
                    }
                  }
                }
              }
            });
          }

          // Yearly Income Chart (Bar)
          const yearlyCtx = document.getElementById('yearlyIncomeChart');
          if (yearlyCtx) {
            new Chart(yearlyCtx, {
              type: 'bar',
              data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                  {
                    label: 'Tahun Ini (2026)',
                    data: [2500000, 2800000, 3100000, 2900000, 3400000, 3800000, 4200000, 3900000, 4500000, 4100000, 4800000, 5200000],
                    backgroundColor: '#2563eb',
                    borderColor: '#1e40af',
                    borderWidth: 1,
                    borderRadius: 6
                  },
                  {
                    label: 'Tahun Lalu (2025)',
                    data: [2200000, 2400000, 2700000, 2500000, 2900000, 3100000, 3400000, 3200000, 3600000, 3300000, 3800000, 4000000],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 6
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      font: { size: 12, weight: 'bold' },
                      padding: 15,
                      usePointStyle: true,
                      pointStyle: 'rect'
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
                      },
                      font: { size: 10 }
                    },
                    grid: {
                      drawBorder: false,
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      font: { size: 10 }
                    }
                  }
                }
              }
            });
          }
        }
      `}</script>
    </>
  );
}
