import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '../components/Logo';

export default function Transactions() {
  const router = useRouter();
  const [user, setUser] = useState(null);
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
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchTransactions(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const badges = {
      'COMPLETED': { class: 'badge-success', text: 'Selesai' },
      'VOID': { class: 'badge-danger', text: 'Void' }
    };
    const badge = badges[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Riwayat Transaksi - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/table.css" />
      </Head>

      <div className="page-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <Logo size="small" />
          </div>
          <div className="navbar-menu">
            <button className="btn btn-secondary btn-sm" onClick={() => router.push('/dashboard')}>
              ← Kembali
            </button>
            <span className="user-info">👤 {user?.full_name || user?.username}</span>
          </div>
        </nav>

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">📜 Riwayat Transaksi</h1>
            <button className="btn btn-primary" onClick={() => router.push('/transaction')}>
              + Transaksi Baru
            </button>
          </div>

          {/* Filter */}
          <div className="card filter-card">
            <h3>🔍 Filter</h3>
            <div className="filter-grid">
              <div className="form-group">
                <label>Tanggal Mulai</label>
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tanggal Akhir</label>
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Metode Pembayaran</label>
                <select value={filter.paymentMethod} onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}>
                  <option value="">Semua</option>
                  <option value="TUNAI">Tunai</option>
                  <option value="QRIS">QRIS</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="DEBIT">Debit</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                  <option value="">Semua</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="VOID">Void</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tanggal</th>
                    <th>Kasir</th>
                    <th>Customer</th>
                    <th>Kapster</th>
                    <th>Total</th>
                    <th>Pembayaran</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                        Tidak ada transaksi
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(t => (
                      <tr key={t.id}>
                        <td>#{t.id}</td>
                        <td>{new Date(t.created_at).toLocaleString('id-ID')}</td>
                        <td>{t.cashier_name || '-'}</td>
                        <td>{t.customer_name || 'Walk-in'}</td>
                        <td>{t.kapster_name || '-'}</td>
                        <td className="text-right">Rp {t.total?.toLocaleString() || 0}</td>
                        <td>{t.payment_method}</td>
                        <td>{getStatusBadge(t.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => router.push(`/transactions/${t.id}`)}
                            >
                              Detail
                            </button>
                            {t.status === 'COMPLETED' && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleVoid(t.id)}
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

            <div className="table-summary">
              <p>Total: <strong>{filteredTransactions.length}</strong> transaksi</p>
              <p>Total Pendapatan: <strong>Rp {filteredTransactions
                .filter(t => t.status === 'COMPLETED')
                .reduce((sum, t) => sum + (t.total || 0), 0)
                .toLocaleString()}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
