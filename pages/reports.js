import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Reports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    today: { transactions: 0, income: 0, items: 0 },
    thisMonth: { transactions: 0, income: 0, items: 0 },
    thisYear: { transactions: 0, income: 0, items: 0 }
  });
  const [transactions, setTransactions] = useState([]);
  const [kapsters, setKapsters] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [kapsterMonthlyIncome, setKapsterMonthlyIncome] = useState([]);
  const [shiftMonthlyIncome, setShiftMonthlyIncome] = useState([]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchReportData(token);
  }, [router]);

  const fetchReportData = async (token) => {
    try {
      console.log('🔄 Fetching report data...');
      
      // Fetch transactions
      const txResponse = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📡 Response status:', txResponse.status, txResponse.ok);
      
      if (txResponse.ok) {
        const data = await txResponse.json();
        console.log('✅ Transactions received:', data.length, 'items');
        
        const txs = Array.isArray(data) ? data.filter(t => t.status?.toLowerCase() === 'completed') : [];
        console.log('✅ Completed transactions:', txs.length);
        setTransactions(txs);
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisYear = new Date(now.getFullYear(), 0, 1);
        
        const calculateStats = (txs) => {
          const stats = {
            transactions: txs.length,
            income: txs.reduce((sum, t) => sum + (parseFloat(t.total) || 0), 0),
            items: txs.reduce((sum, t) => {
              try {
                const items = typeof t.items === 'string' ? JSON.parse(t.items || '[]') : (t.items || []);
                return sum + items.filter(i => i.item_type?.toLowerCase() === 'product').reduce((s, i) => s + (parseInt(i.quantity) || 0), 0);
              } catch (e) {
                return sum;
              }
            }, 0)
          };
          return stats;
        };
        
        const reportStats = {
          today: calculateStats(txs.filter(t => new Date(t.created_at) >= today)),
          thisMonth: calculateStats(txs.filter(t => new Date(t.created_at) >= thisMonth)),
          thisYear: calculateStats(txs.filter(t => new Date(t.created_at) >= thisYear))
        };
        
        console.log('📊 Final report data:', reportStats);
        setReportData(reportStats);
        
        // Fetch kapsters
        const kapsterResponse = await fetch('/api/kapsters', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (kapsterResponse.ok) {
          const kapsterData = await kapsterResponse.json();
          setKapsters(kapsterData);
          
          // Calculate monthly income per kapster
          const kapsterIncome = kapsterData.map(kapster => {
            const kapsterTxs = txs.filter(t => t.kapster_id === kapster.id);
            const monthlyData = {};
            
            kapsterTxs.forEach(tx => {
              const month = new Date(tx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
              if (!monthlyData[month]) {
                monthlyData[month] = 0;
              }
              monthlyData[month] += parseFloat(tx.total) || 0;
            });
            
            return {
              id: kapster.id,
              name: kapster.name,
              monthlyData: monthlyData,
              total: Object.values(monthlyData).reduce((sum, val) => sum + val, 0)
            };
          }).filter(k => k.total > 0);
          
          setKapsterMonthlyIncome(kapsterIncome);
        }
        
        // Fetch shifts
        const shiftResponse = await fetch('/api/shifts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (shiftResponse.ok) {
          const shiftData = await shiftResponse.json();
          setShifts(shiftData);
          
          // Calculate monthly income per shift
          const shiftIncome = shiftData.map(shift => {
            const shiftTxs = txs.filter(t => t.shift_id === shift.id);
            const monthlyData = {};
            
            shiftTxs.forEach(tx => {
              const month = new Date(tx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
              if (!monthlyData[month]) {
                monthlyData[month] = 0;
              }
              monthlyData[month] += parseFloat(tx.total) || 0;
            });
            
            // Create shift name from cashier and date
            const openedDate = new Date(shift.opened_at);
            const shiftName = `Shift #${shift.id} - ${shift.cashier_name || 'Kasir'} (${openedDate.toLocaleDateString('id-ID', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })})`;
            
            return {
              id: shift.id,
              name: shiftName,
              cashier_name: shift.cashier_name,
              opened_at: shift.opened_at,
              monthlyData: monthlyData,
              total: Object.values(monthlyData).reduce((sum, val) => sum + val, 0)
            };
          }).filter(s => s.total > 0);
          
          setShiftMonthlyIncome(shiftIncome);
        }
      } else {
        console.error('❌ Response not OK:', txResponse.status);
      }
    } catch (error) {
      console.error('❌ Error fetching report data:', error);
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">Memuat laporan...</div>
      </div>
    );
  }

  console.log('🎨 Rendering reports page');
  console.log('📊 Report data:', reportData);
  console.log('📋 Transactions:', transactions.length);

  return (
    <>
      <Head>
        <title>Laporan - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <Layout activePage="reports">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
            📊 Laporan Penjualan
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Ringkasan penjualan dan keuangan barbershop
          </p>
        </div>

        {/* Report Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Hari Ini */}
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            borderRadius: '12px',
            padding: '25px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>📅 Hari Ini</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
              {formatRupiah(reportData.today.income)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.9 }}>
              <span>{reportData.today.transactions} Transaksi</span>
              <span>{reportData.today.items} Item</span>
            </div>
          </div>

          {/* Bulan Ini */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            padding: '25px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>📆 Bulan Ini</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
              {formatRupiah(reportData.thisMonth.income)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.9 }}>
              <span>{reportData.thisMonth.transactions} Transaksi</span>
              <span>{reportData.thisMonth.items} Item</span>
            </div>
          </div>

          {/* Tahun Ini */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '12px',
            padding: '25px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>📊 Tahun Ini</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
              {formatRupiah(reportData.thisYear.income)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.9 }}>
              <span>{reportData.thisYear.transactions} Transaksi</span>
              <span>{reportData.thisYear.items} Item</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Transaksi Terbaru (10)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Tanggal</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 10).map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>#{t.id}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        {new Date(t.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.customer_name || 'Walk-in'}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600' }}>
                        {formatRupiah(t.total || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pendapatan Per Kapster */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '1.2rem' }}>
            💈 Pendapatan Perbulan Per Kapster
          </h3>
          {kapsterMonthlyIncome.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
              Belum ada data pendapatan kapster
            </p>
          ) : (
            kapsterMonthlyIncome.map(kapster => (
              <div key={kapster.id} style={{
                marginBottom: '24px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ margin: 0, color: '#2563eb', fontSize: '1.1rem' }}>
                    {kapster.name}
                  </h4>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    Total: {formatRupiah(kapster.total)}
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                    <thead>
                      <tr style={{ background: '#e9ecef' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600' }}>
                          Bulan
                        </th>
                        <th style={{ padding: '10px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600' }}>
                          Pendapatan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(kapster.monthlyData).map(([month, income]) => (
                        <tr key={month} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '10px', fontSize: '0.9rem' }}>{month}</td>
                          <td style={{ padding: '10px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                            {formatRupiah(income)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pendapatan Per Shift */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '1.2rem' }}>
            🕐 Pendapatan Perbulan Per Shift
          </h3>
          {shiftMonthlyIncome.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
              Belum ada data pendapatan shift
            </p>
          ) : (
            shiftMonthlyIncome.map(shift => (
              <div key={shift.id} style={{
                marginBottom: '24px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '1.1rem' }}>
                    {shift.name}
                  </h4>
                  <div style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    Total: {formatRupiah(shift.total)}
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                    <thead>
                      <tr style={{ background: '#e9ecef' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600' }}>
                          Bulan
                        </th>
                        <th style={{ padding: '10px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600' }}>
                          Pendapatan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(shift.monthlyData).map(([month, income]) => (
                        <tr key={month} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '10px', fontSize: '0.9rem' }}>{month}</td>
                          <td style={{ padding: '10px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600', color: '#f59e0b' }}>
                            {formatRupiah(income)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </Layout>
    </>
  );
}
