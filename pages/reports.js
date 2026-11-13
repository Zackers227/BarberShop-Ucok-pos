import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '../components/Logo';

export default function Reports() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState(null);

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

    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReport = async () => {
    const token = localStorage.getItem('token');
    
    try {
      let url = '';
      if (reportType === 'daily') {
        url = `/api/reports/daily?date=${selectedDate}`;
      } else {
        // Parse selectedMonth (YYYY-MM) into year and month
        const [year, month] = selectedMonth.split('-');
        url = `/api/reports/monthly?year=${year}&month=${month}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        const error = await response.json();
        alert('Error fetching report: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchReport();
    }
  }, [reportType, selectedDate, selectedMonth, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Laporan - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/reports.css" />
      </Head>

      <div className="page-container">
        <nav className="navbar no-print">
          <div className="navbar-brand">
            <Logo size="small" />
          </div>
          <div className="navbar-menu">
            {/* Quick Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginRight: '0.5rem' }}>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => router.push('/dashboard')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                🏠 Dashboard
              </button>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => router.push('/transactions')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                📜 Riwayat
              </button>
              <button 
                className="btn btn-sm btn-success"
                onClick={() => router.push('/transaction')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                🛒 Transaksi
              </button>
            </div>
            <span className="user-info">👤 {user?.full_name || user?.username}</span>
          </div>
        </nav>
            </button>
            <span className="user-info">👤 {user?.full_name || user?.username}</span>
          </div>
        </nav>

        <div className="main-content">
          <div className="page-header no-print">
            <h1 className="page-title">📊 Laporan</h1>
            <button className="btn btn-primary" onClick={printReport}>
              🖨️ Cetak Laporan
            </button>
          </div>

          {/* Report Controls */}
          <div className="card no-print">
            <div className="report-controls">
              <div className="form-group">
                <label>Jenis Laporan</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="daily">Laporan Harian</option>
                  <option value="monthly">Laporan Bulanan</option>
                </select>
              </div>

              {reportType === 'daily' ? (
                <div className="form-group">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Bulan</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
              )}

              <button className="btn btn-primary" onClick={fetchReport}>
                🔍 Tampilkan Laporan
              </button>
            </div>
          </div>

          {/* Report Content */}
          {reportData && (
            <div className="report-content">
              {/* Header */}
              <div className="report-header">
                <h2>MENSURFACE</h2>
                <p style={{ fontSize: '0.9rem', letterSpacing: '2px', color: '#666' }}>- BARBER AND SHOP -</p>
                <p>Laporan {reportType === 'daily' ? 'Harian' : 'Bulanan'}</p>
                <p className="report-period">
                  {reportType === 'daily' 
                    ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    : new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
                  }
                </p>
              </div>

              {/* Summary Cards */}
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="summary-icon">💰</div>
                  <div className="summary-info">
                    <p className="summary-label">Total Pendapatan</p>
                    <p className="summary-value">Rp {reportData.total_revenue?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">🛒</div>
                  <div className="summary-info">
                    <p className="summary-label">Total Transaksi</p>
                    <p className="summary-value">{reportData.total_transactions || 0}</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">👥</div>
                  <div className="summary-info">
                    <p className="summary-label">Total Customer</p>
                    <p className="summary-value">{reportData.total_customers || 0}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="card report-section">
                <h3>💳 Pembayaran per Metode</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Metode</th>
                        <th className="text-right">Jumlah Transaksi</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.by_payment_method && reportData.by_payment_method.length > 0 ? (
                        reportData.by_payment_method.map((pm, idx) => (
                          <tr key={idx}>
                            <td>{pm.payment_method}</td>
                            <td className="text-right">{pm.transaction_count}</td>
                            <td className="text-right">Rp {parseFloat(pm.total_amount).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center' }}>Tidak ada data pembayaran</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Services */}
              {reportData.top_services && reportData.top_services.length > 0 && (
                <div className="card report-section">
                  <h3>✂️ Layanan Terlaris</h3>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Layanan</th>
                          <th className="text-right">Jumlah</th>
                          <th className="text-right">Total Pendapatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.top_services.map((service, idx) => (
                          <tr key={idx}>
                            <td>{service.name}</td>
                            <td className="text-right">{service.quantity}</td>
                            <td className="text-right">Rp {parseFloat(service.total_revenue).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Top Products */}
              {reportData.top_products && reportData.top_products.length > 0 && (
                <div className="card report-section">
                  <h3>🧴 Produk Terlaris</h3>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Produk</th>
                          <th className="text-right">Jumlah</th>
                          <th className="text-right">Total Pendapatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.top_products.map((product, idx) => (
                          <tr key={idx}>
                            <td>{product.name}</td>
                            <td className="text-right">{product.quantity}</td>
                            <td className="text-right">Rp {parseFloat(product.total_revenue).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Kapster Performance */}
              {reportData.kapster_performance && reportData.kapster_performance.length > 0 && (
                <div className="card report-section">
                  <h3>💈 Performa Kapster</h3>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Kapster</th>
                          <th className="text-right">Jumlah Customer</th>
                          <th className="text-right">Total Pendapatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.kapster_performance.map((kapster, idx) => (
                          <tr key={idx}>
                            <td>{kapster.name}</td>
                            <td className="text-right">{kapster.total_customers}</td>
                            <td className="text-right">Rp {parseFloat(kapster.total_revenue).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Report Footer */}
              <div className="report-footer">
                <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                <p>Dicetak oleh: {user?.full_name || user?.username}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
