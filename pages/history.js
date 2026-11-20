import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function History() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    status: ''
  });

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
    // Filter by date range
    if (filter.startDate) {
      const txDate = new Date(t.created_at).toISOString().split('T')[0];
      if (txDate < filter.startDate) return false;
    }
    if (filter.endDate) {
      const txDate = new Date(t.created_at).toISOString().split('T')[0];
      if (txDate > filter.endDate) return false;
    }
    // Filter by payment method
    if (filter.paymentMethod && t.payment_method !== filter.paymentMethod) return false;
    // Filter by status
    if (filter.status && t.status?.toLowerCase() !== filter.status.toLowerCase()) return false;
    return true;
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
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">Memuat riwayat transaksi...</div>
      </div>
    );
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
            Daftar semua riwayat transaksi dengan filter pencarian
          </p>
        </div>

        {/* Filter Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#333' }}>
            🔍 Filter Pencarian
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* Start Date */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                Metode Pembayaran
              </label>
              <select
                value={filter.paymentMethod}
                onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                <option value="">Semua Metode</option>
                <option value="cash">Cash</option>
                <option value="debit">Debit</option>
                <option value="qris">QRIS</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                <option value="">Semua Status</option>
                <option value="completed">Selesai</option>
                <option value="pending">Pending</option>
                <option value="VOID">Void</option>
              </select>
            </div>
          </div>

          {/* Reset Filter Button */}
          <button
            onClick={() => setFilter({ startDate: '', endDate: '', paymentMethod: '', status: '' })}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔄 Reset Filter
          </button>
        </div>

        {/* Transaction Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Daftar Transaksi</h3>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Tanggal</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Kapster</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Bayar</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Kembalian</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Pembayaran</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      Tidak ada transaksi sesuai filter
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t, index) => {
                    try {
                      console.log(`Rendering row ${index}:`, t.id, t.customer_name);
                      return (
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
                          <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.customer_name || 'Walk-in'}</td>
                          <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.kapster_name || '-'}</td>
                          <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600' }}>
                            {formatRupiah(t.total || 0)}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right' }}>
                            {formatRupiah(t.paid_amount || 0)}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right' }}>
                            {formatRupiah(t.change_amount || 0)}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.payment_method || 'cash'}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(t.status)}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => window.open(`/print/${t.id}`, '_blank')}
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
                              title="Cetak Struk"
                              aria-label={`Cetak struk transaksi #${t.id}`}
                            >
                              🖨️ Cetak
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
