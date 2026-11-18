import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasPermission } from '../lib/permissions';
import Navbar from '../components/Navbar';

// Dashboard with clean sidebar navigation
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalItems: 0,
    totalTransactions: 0,
    totalIncome: 0,
    activeCustomers: 0,
    loading: true,
    error: null,
    monthlyIncome: [] // For charts
  });

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!token) {
      console.warn('⚠️ No token found, redirecting to login...');
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('✅ User loaded:', parsedUser.username || parsedUser.full_name);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
        return;
      }
    }
    
    // Check pending transactions
    checkPendingTransactions(token);
    
    // Fetch dashboard statistics
    console.log('🎯 About to fetch dashboard stats...');
    fetchDashboardStats(token);
    
    setLoading(false);
  }, [router]);

  const checkPendingTransactions = async (token) => {
    try {
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch transactions:', response.status);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.warn('Transactions response is not an array:', data);
        return;
      }
      
      const pending = data.filter(t => t.status === 'pending');
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Error checking pending transactions:', error);
    }
  };

  const fetchDashboardStats = async (token) => {
    try {
      console.log('🚀 Starting dashboard stats fetch...');
      
      // Fetch all transactions
      const transactionsRes = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!transactionsRes.ok) {
        throw new Error(`API error: ${transactionsRes.status}`);
      }
      
      const transactions = await transactionsRes.json();
      
      // Ensure transactions is an array
      if (!Array.isArray(transactions)) {
        console.warn('❌ Transactions response is not an array:', transactions);
        throw new Error('Invalid transactions data format');
      }
      
      console.log('📊 Dashboard Stats Debug:');
      console.log('Total transactions fetched:', transactions.length);
      if (transactions.length > 0) {
        console.log('Sample transaction:', transactions[0]);
      }
      
      // Filter completed transactions (case insensitive)
      const completedTransactions = transactions.filter(t => 
        t.status && t.status.toLowerCase() === 'completed'
      );
      
      console.log('Completed transactions:', completedTransactions.length);
      if (completedTransactions.length > 0) {
        console.log('Sample completed transaction:', completedTransactions[0]);
      }
      
      // Calculate total items sold (sum of all PRODUCT items in completed transactions)
      let totalItems = 0;
      let totalProducts = 0; // Debug counter
      let totalServices = 0; // Debug counter
      
      completedTransactions.forEach(t => {
        try {
          // Parse items if it's a string, or use directly if already array
          const items = typeof t.items === 'string' ? JSON.parse(t.items) : (t.items || []);
          if (Array.isArray(items)) {
            console.log(`Transaction #${t.id} items:`, items);
            
            // Count products and services separately
            items.forEach(item => {
              const qty = parseInt(item.quantity) || 0;
              const type = (item.item_type || '').toLowerCase();
              
              if (type === 'product') {
                totalProducts += qty;
                totalItems += qty;
                console.log(`  ✅ Product: ${item.item_name} x${qty}`);
              } else if (type === 'service') {
                totalServices += qty;
                console.log(`  ⚙️ Service: ${item.item_name} x${qty}`);
              } else {
                console.warn(`  ⚠️ Unknown type: ${item.item_type} - ${item.item_name}`);
              }
            });
          }
        } catch (error) {
          console.error('Error parsing items for transaction', t.id, error);
        }
      });
      
      console.log(`📦 Product items: ${totalProducts}`);
      console.log(`⚙️ Service items: ${totalServices}`);
      
      // Total income from completed transactions
      const totalIncome = completedTransactions.reduce((sum, t) => {
        const amount = parseFloat(t.total_amount || t.total || 0);
        return sum + amount;
      }, 0);
      
      console.log('✅ Calculated stats:');
      console.log('- Total items:', totalItems);
      console.log('- Total income:', totalIncome);
      
      // Fetch customers and count active ones (with at least 1 visit)
      const customersRes = await fetch('/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!customersRes.ok) {
        throw new Error(`Customers API error: ${customersRes.status}`);
      }
      
      const customers = await customersRes.json();
      
      // Ensure customers is an array
      const customersArray = Array.isArray(customers) ? customers : [];
      const activeCustomers = customersArray.filter(c => (parseInt(c.total_visits) || 0) > 0).length;
      
      console.log('- Active customers:', activeCustomers);
      console.log('- Total customers in DB:', customersArray.length);
      
      // Calculate monthly income for charts (last 12 months)
      const monthlyIncome = new Array(12).fill(0);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-11
      
      completedTransactions.forEach(t => {
        const transDate = new Date(t.created_at);
        const transYear = transDate.getFullYear();
        const transMonth = transDate.getMonth(); // 0-11
        
        // Only count transactions from current year
        if (transYear === currentYear) {
          const amount = parseFloat(t.total_amount || t.total || 0);
          monthlyIncome[transMonth] += amount;
        }
      });
      
      console.log('📅 Monthly income:', monthlyIncome);
      
      setDashboardStats({
        totalItems,
        totalTransactions: completedTransactions.length,
        totalIncome,
        activeCustomers,
        monthlyIncome,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setDashboardStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
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

  // Chart data for Income Perbulan (Line Chart) - Using real data
  const monthlyIncomeChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `Tahun Ini (${new Date().getFullYear()})`,
        data: dashboardStats.monthlyIncome || new Array(12).fill(0),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
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

  // Chart data for Income Pertahun (Bar Chart) - Using real data
  const yearlyIncomeChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `Tahun Ini (${new Date().getFullYear()})`,
        data: dashboardStats.monthlyIncome || new Array(12).fill(0),
        backgroundColor: '#2563eb',
        borderColor: '#1e40af',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };
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
                  color: '#ccc',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                  color: '#ccc',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                  color: '#ccc',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                  color: '#ccc',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>
                {dashboardStats.totalItems.toLocaleString()}
              </div>
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
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>
                {dashboardStats.totalTransactions.toLocaleString()}
              </div>
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
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>
                Rp {dashboardStats.totalIncome >= 1000000 
                  ? (dashboardStats.totalIncome / 1000000).toFixed(1) + 'M'
                  : dashboardStats.totalIncome.toLocaleString('id-ID')
                }
              </div>
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
              <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>
                {dashboardStats.activeCustomers}
              </div>
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
