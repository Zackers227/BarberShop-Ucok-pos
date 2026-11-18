import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function History() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, pending

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
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
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
    return <div>Loading...</div>;
  }

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
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
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
          >
            Semua ({transactions.length})
          </button>
          <button
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
          >
            Selesai ({transactions.filter(t => t.status?.toLowerCase() === 'completed').length})
          </button>
          <button
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
          >
            Pending ({transactions.filter(t => t.status?.toLowerCase() === 'pending').length})
          </button>
        </div>

        <div className="card">
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
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(t => (
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
                          onClick={() => window.open(`/print/${t.id}`, '_blank')}
                          className="btn btn-sm btn-secondary"
                          title="Cetak Struk"
                        >
                          🖨️
                        </button>
                      </td>
                    </tr>
                  ))
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
