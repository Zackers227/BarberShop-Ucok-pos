import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Pending() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingTransactions, setPendingTransactions] = useState([]);

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    
    loadPendingTransactions(token);
  }, [router]);

  const loadPendingTransactions = async (token) => {
    try {
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const pending = data.filter(t => t.status === 'pending');
      setPendingTransactions(pending);
      setLoading(false);
    } catch (error) {
      console.error('Error loading pending transactions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">Memuat transaksi pending...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pending - Barbershop Ucok POS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <Layout activePage="pending">
        {/* Page Content */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
            Transaksi Pending
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Daftar transaksi yang menunggu pembayaran
          </p>
        </div>

        {/* Pending Transactions */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {pendingTransactions.length === 0 ? (
            <div style={{ 
              padding: '60px',
              textAlign: 'center',
              color: '#999'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#333' }}>
                Tidak Ada Transaksi Pending
              </h3>
              <p style={{ fontSize: '0.95rem' }}>
                Semua transaksi sudah diselesaikan
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#333' }}>
                ⏳ {pendingTransactions.length} Transaksi Menunggu
              </h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Tanggal</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Customer</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Total</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTransactions.map((trx) => (
                      <tr key={trx.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>#{trx.id}</td>
                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                          {new Date(trx.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>{trx.customer_name || 'Walk-in'}</td>
                        <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600' }}>
                          Rp {Number(trx.total_amount).toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => router.push(`/transaction/${trx.id}`)}
                            style={{
                              background: '#2563eb',
                              color: 'white',
                              border: 'none',
                              padding: '6px 16px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                          >
                            Proses
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
