import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function History() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  // Force cache bust
  console.log('🆕 History component loaded - Build:', Date.now());

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTransactions(token);
  }, [router]);

  const fetchTransactions = async (token) => {
    try {
      console.log('🔄 Fetching transactions for history...');
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📡 Response status:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Transactions received:', data.length, 'items');
        console.log('📊 Sample transaction:', data[0]);
        
        const txArray = Array.isArray(data) ? data : [];
        console.log('🔢 Setting transactions state with', txArray.length, 'items');
        setTransactions(txArray);
      } else {
        console.error('❌ Response not OK:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.status?.toLowerCase() === filter;
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: { bg: '#10b981', text: 'Selesai' },
      pending: { bg: '#f59e0b', text: 'Pending' },
      cancelled: { bg: '#ef4444', text: 'Batal' }
    };
    const style = styles[status?.toLowerCase()] || { bg: '#6b7280', text: status };
    return (
      <span style={{
        background: style.bg,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return null;
  }

  console.log('🎨 Rendering history page with', transactions.length, 'transactions');
  console.log('🔍 Filtered transactions:', filteredTransactions.length);

  return (
    <>
      <Head>
        <title>Riwayat Transaksi - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/table.css" />
      </Head>

      <Layout activePage="history">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
            📜 Riwayat Transaksi
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Daftar semua transaksi yang telah dilakukan
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }} role="group" aria-label="Filter transaksi">
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'all' ? '#2563eb' : '#f3f4f6',
              color: filter === 'all' ? 'white' : '#333',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            aria-pressed={filter === 'all'}
          >
            Semua ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'completed' ? '#10b981' : '#f3f4f6',
              color: filter === 'completed' ? 'white' : '#333',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            aria-pressed={filter === 'completed'}
          >
            Selesai ({transactions.filter(t => t.status?.toLowerCase() === 'completed').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'pending' ? '#f59e0b' : '#f3f4f6',
              color: filter === 'pending' ? 'white' : '#333',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            aria-pressed={filter === 'pending'}
          >
            Pending ({transactions.filter(t => t.status?.toLowerCase() === 'pending').length})
          </button>
        </div>

        <div className="card">
          <h3>Daftar Transaksi</h3>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
          </p>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Customer</th>
                  <th>Kapster</th>
                  <th>Total</th>
                  <th>Bayar</th>
                  <th>Kembalian</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      Belum ada transaksi dengan filter "{filter}"
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t, index) => {
                    try {
                      console.log(`Rendering row ${index}:`, t.id, t.customer_name);
                      return (
                        <tr key={t.id}>
                          <td>#{t.id}</td>
                          <td>{new Date(t.created_at).toLocaleString('id-ID')}</td>
                          <td>{t.customer_name || 'Walk-in'}</td>
                          <td>{t.kapster_name || '-'}</td>
                          <td className="text-right">{formatRupiah(t.total || 0)}</td>
                          <td className="text-right">{formatRupiah(t.paid_amount || 0)}</td>
                          <td className="text-right">{formatRupiah(t.change_amount || 0)}</td>
                          <td>{getStatusBadge(t.status)}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => window.open(`/print/${t.id}`, '_blank')}
                              className="btn btn-sm btn-secondary"
                              title="Cetak Struk"
                              aria-label={`Cetak struk transaksi #${t.id}`}
                            >
                              🖨️
                            </button>
                          </td>
                        </tr>
                      );
                    } catch (error) {
                      console.error(`Error rendering row ${index}:`, error, t);
                      return null;
                    }
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <strong>Total Transaksi:</strong> {filteredTransactions.length}
          </div>
          <div>
            <strong>Total Pendapatan:</strong> {formatRupiah(
              filteredTransactions
                .filter(t => t.status?.toLowerCase() === 'completed')
                .reduce((sum, t) => sum + (parseFloat(t.total) || 0), 0)
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
