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
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📡 Response status:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Transactions received:', data.length, 'items');
        console.log('📊 Sample transaction:', data[0]);
        
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
          console.log('📈 Calculated stats:', stats);
          return stats;
        };
        
        const reportStats = {
          today: calculateStats(txs.filter(t => new Date(t.created_at) >= today)),
          thisMonth: calculateStats(txs.filter(t => new Date(t.created_at) >= thisMonth)),
          thisYear: calculateStats(txs.filter(t => new Date(t.created_at) >= thisYear))
        };
        
        console.log('📊 Final report data:', reportStats);
        setReportData(reportStats);
      } else {
        console.error('❌ Response not OK:', response.status);
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
    return <div>Loading...</div>;
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.9' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.9' }}>
              <span>{reportData.thisYear.transactions} Transaksi</span>
              <span>{reportData.thisYear.items} Item</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Transaksi Terbaru (10)</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Customer</th>
                  <th>Total</th>
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
                    <tr key={t.id}>
                      <td>#{t.id}</td>
                      <td>{new Date(t.created_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</td>
                      <td>{t.customer_name || 'Walk-in'}</td>
                      <td className="text-right">{formatRupiah(t.total || 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}
