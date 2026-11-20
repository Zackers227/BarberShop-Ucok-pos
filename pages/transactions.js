import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    status: ''
  });

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
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoid = async (id) => {
    if (!confirm('Yakin ingin void transaksi ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transactions/${id}/void`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Transaksi berhasil di-void');
        fetchTransactions(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error voiding transaction:', error);
      alert('Terjadi kesalahan');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter.startDate && new Date(t.created_at) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(t.created_at) > new Date(filter.endDate)) return false;
    if (filter.paymentMethod && t.payment_method !== filter.paymentMethod) return false;
    if (filter.status && t.status !== filter.status) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      'completed': { bg: '#10b981', text: 'completed' },
      'VOID': { bg: '#ef4444', text: 'Void' },
      'pending': { bg: '#f59e0b', text: 'pending' }
    };
    const style = statusStyles[status] || { bg: '#6b7280', text: status };
    
    return (
      <span style={{
        background: style.bg,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600'
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Riwayat Transaksi - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/table.css" />
      </Head>

      <Layout activePage="transactions">
        {/* Page Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
              📜 Riwayat Transaksi
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
              Daftar semua transaksi barbershop
            </p>
          </div>
          <button 
            onClick={() => router.push('/transaction')}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Transaksi Baru
          </button>
        </div>

        {/* Filter Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#333' }}>🔍 Filter</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#555' }}>
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#555' }}>
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#555' }}>
                Metode Pembayaran
              </label>
              <select 
                value={filter.paymentMethod} 
                onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">Semua</option>
                <option value="TUNAI">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="TRANSFER">Transfer</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#555' }}>
                Status
              </label>
              <select 
                value={filter.status} 
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">Semua</option>
                <option value="completed">Selesai</option>
                <option value="VOID">Void</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Tanggal</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Kasir</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Kapster</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Pembayaran</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      Tidak ada transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>#{t.id}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        {new Date(t.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        {t.cashier_name || 'Administrator BarberShop Ucok'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.customer_name || 'Walk-in'}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.kapster_name || t.barber_name || 'Agus Wijaya'}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600' }}>
                        Rp {(t.total_amount || t.total || 0).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.payment_method || 'Rp'}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(t.status)}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => router.push(`/transactions/${t.id}`)}
                            style={{
                              background: '#2563eb',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Detail
                          </button>
                          {t.status === 'completed' && (
                            <button
                              onClick={() => handleVoid(t.id)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Void
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.95rem'
          }}>
            <p style={{ margin: 0 }}>
              Total: <strong>{filteredTransactions.length}</strong> transaksi
            </p>
            <p style={{ margin: 0 }}>
              Total Pendapatan: <strong style={{ color: '#10b981' }}>
                Rp {filteredTransactions
                  .filter(t => t.status === 'completed')
                  .reduce((sum, t) => sum + (parseFloat(t.total_amount || t.total) || 0), 0)
                  .toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </strong>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
