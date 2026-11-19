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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true); // Toggle visibility of hamburger
  
  const [dashboardStats, setDashboardStats] = useState({
    totalItems: 0,
    totalTransactions: 0,
    totalIncome: 0,
    activeCustomers: 0,
    loading: true,
    error: null,
    monthlyIncome: [], // Current year monthly
    previousYearMonthlyIncome: [], // Previous year monthly
    currentYearTotal: 0, // Total current year
    previousYearTotal: 0, // Total previous year
    currentYear: new Date().getFullYear(),
    previousYear: new Date().getFullYear() - 1
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

  // Initialize charts after dashboardStats is loaded
  useEffect(() => {
    if (dashboardStats.loading || !dashboardStats.monthlyIncome || typeof window === 'undefined') {
      return;
    }

    console.log('🎨 Initializing charts with data:', dashboardStats.monthlyIncome);
    console.log('🎨 Previous year data:', dashboardStats.previousYearMonthlyIncome);

    // Wait for Chart.js to be available
    const initCharts = () => {
      if (typeof window.Chart === 'undefined') {
        console.warn('⚠️ Chart.js not loaded yet, retrying...');
        setTimeout(initCharts, 100);
        return;
      }

      const currentYearData = dashboardStats.monthlyIncome || [0,0,0,0,0,0,0,0,0,0,0,0];
      const previousYearData = dashboardStats.previousYearMonthlyIncome || [0,0,0,0,0,0,0,0,0,0,0,0];
      
      // Calculate max for monthly chart
      const allMonthlyValues = [...currentYearData, ...previousYearData];
      const maxMonthlyValue = Math.max(...allMonthlyValues);
      const suggestedMaxMonthly = maxMonthlyValue > 0 ? maxMonthlyValue * 1.2 : 5000000;

      // For yearly comparison chart
      const currentYearTotal = dashboardStats.currentYearTotal || 0;
      const previousYearTotal = dashboardStats.previousYearTotal || 0;
      const maxYearlyValue = Math.max(currentYearTotal, previousYearTotal);
      const suggestedMaxYearly = maxYearlyValue > 0 ? maxYearlyValue * 1.2 : 10000000;

      console.log('📊 Monthly max value:', maxMonthlyValue);
      console.log('📊 Yearly totals:', currentYearTotal, previousYearTotal);

      // Destroy existing charts if they exist
      const existingMonthly = window.Chart.getChart('monthlyIncomeChart');
      if (existingMonthly) {
        existingMonthly.destroy();
      }
      const existingYearly = window.Chart.getChart('yearlyIncomeChart');
      if (existingYearly) {
        existingYearly.destroy();
      }

      // Monthly Income Chart (Line) - Compare 2 years
      const monthlyCtx = document.getElementById('monthlyIncomeChart');
      if (monthlyCtx) {
        console.log('✅ Creating monthly chart with 2 years comparison');
        new window.Chart(monthlyCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: dashboardStats.currentYear.toString(),
                data: currentYearData,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
              },
              {
                label: dashboardStats.previousYear.toString(),
                data: previousYearData,
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
                suggestedMax: suggestedMaxMonthly,
                ticks: {
                  callback: function(value) {
                    return 'Rp ' + value.toLocaleString('id-ID');
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

      // Yearly Income Chart (Bar) - Compare total per year
      const yearlyCtx = document.getElementById('yearlyIncomeChart');
      if (yearlyCtx) {
        console.log('✅ Creating yearly comparison chart');
        new window.Chart(yearlyCtx, {
          type: 'bar',
          data: {
            labels: [dashboardStats.previousYear.toString(), dashboardStats.currentYear.toString()],
            datasets: [{
              label: 'Total Income',
              data: [previousYearTotal, currentYearTotal],
              backgroundColor: ['#d97706', '#a855f7'],
              borderColor: ['#b45309', '#9333ea'],
              borderWidth: 1,
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: suggestedMaxYearly,
                ticks: {
                  callback: function(value) {
                    return 'Rp ' + value.toLocaleString('id-ID');
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
                  font: { size: 12, weight: 'bold' }
                }
              }
            }
          }
        });
      }
    };

    initCharts();
  }, [dashboardStats]);

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
      console.log('- Total transactions:', completedTransactions.length);
      
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
      
      // Calculate monthly income for charts (current year and previous year)
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const previousYear = currentYear - 1;
      
      const currentYearIncome = new Array(12).fill(0);
      const previousYearIncome = new Array(12).fill(0);
      
      completedTransactions.forEach(t => {
        const transDate = new Date(t.created_at);
        const transYear = transDate.getFullYear();
        const transMonth = transDate.getMonth(); // 0-11
        const amount = parseFloat(t.total_amount || t.total || 0);
        
        if (transYear === currentYear) {
          currentYearIncome[transMonth] += amount;
        } else if (transYear === previousYear) {
          previousYearIncome[transMonth] += amount;
        }
      });
      
      console.log('📅 Current year income:', currentYearIncome);
      console.log('📅 Previous year income:', previousYearIncome);
      
      // Calculate total yearly income for comparison chart
      const currentYearTotal = currentYearIncome.reduce((sum, val) => sum + val, 0);
      const previousYearTotal = previousYearIncome.reduce((sum, val) => sum + val, 0);
      
      console.log('📅 Yearly totals - Current:', currentYearTotal, 'Previous:', previousYearTotal);
      
      setDashboardStats({
        totalItems,
        totalTransactions: completedTransactions.length,
        totalIncome,
        activeCustomers,
        monthlyIncome: currentYearIncome,
        previousYearMonthlyIncome: previousYearIncome,
        currentYearTotal,
        previousYearTotal,
        currentYear,
        previousYear,
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

          /* Responsive card grid */
          @media (max-width: 768px) {
            .metric-cards {
              grid-template-columns: 1fr !important;
              gap: 15px !important;
            }
            
            .metric-card {
              min-width: 100% !important;
            }

            .main-content {
              padding: 15px !important;
              margin-top: 50px !important;
            }

            /* Stack charts vertically on mobile */
            .charts-container {
              grid-template-columns: 1fr !important;
            }
          }

          /* Tablet adjustments */
          @media (min-width: 769px) and (max-width: 1024px) {
            .metric-cards {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .charts-container {
              grid-template-columns: 1fr !important;
            }

            .main-content {
              margin-top: 50px !important;
            }
          }

          /* Desktop */
          @media (min-width: 1025px) {
            .metric-cards {
              display: flex !important;
              flex-direction: row !important;
            }

            .charts-container {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          /* Chart responsiveness */
          canvas {
            max-width: 100% !important;
            height: auto !important;
          }
        `}</style>
      </Head>

      <div className="dashboard-container">
        {/* Hamburger Menu Button - Only show when menuVisible is true */}
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
            console.log('Toggle clicked, current state:', menuVisible);
            const newState = !menuVisible;
            setMenuVisible(newState);
            // Close sidebar when hiding hamburger button
            if (!newState) {
              setSidebarOpen(false);
            }
            console.log('New state:', newState);
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
        <aside 
          className={sidebarOpen ? 'sidebar-open' : ''} 
          style={{
            width: '280px',
            background: '#3a3f51',
            color: 'white',
            height: '100vh',
            overflowY: 'auto',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
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
                onClick={() => {
                  setSidebarOpen(false);
                  router.push('/history');
                }}
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
                  color: '#ccc',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
        <div className="main-content" style={{ padding: '2rem' }}>
          {/* Title Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Dashboard</h1>
            <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>Ringkasan performa bisnis Anda</p>
          </div>

          {/* METRIC CARDS - 4 Columns in 1 Row */}
          <div className="metric-cards" style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {/* Total Item Terjual */}
            <div className="metric-card" style={{
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
                fontSize: '10px',
                opacity: 0.9,
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                {dashboardStats.totalItems === 0 ? 'Hanya produk, bukan layanan' : 'Produk terjual'}
              </div>
            </div>

            {/* Total Transaksi */}
            <div className="metric-card" style={{
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
                fontSize: '10px',
                opacity: 0.9,
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                Status: Completed
              </div>
            </div>

            {/* Total Income */}
            <div className="metric-card" style={{
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
                Rp {dashboardStats.totalIncome.toLocaleString('id-ID')}
              </div>
              <div style={{
                fontSize: '10px',
                opacity: 0.9,
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                Pendapatan tahun ini
              </div>
            </div>

            {/* Total Pelanggan Aktif */}
            <div className="metric-card" style={{
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
                fontSize: '10px',
                opacity: 0.9,
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}>
                Pelanggan dengan kunjungan {'>'}  0
              </div>
            </div>
          </div>

          {/* INCOME CHARTS */}
          <div className="charts-container" style={{
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
    </>
  );
}
