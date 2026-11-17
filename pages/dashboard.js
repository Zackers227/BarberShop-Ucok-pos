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
      </Head>

      <div className="dashboard-container">
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
