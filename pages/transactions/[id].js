import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (id) {
      fetchTransactionDetail(token, id);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTransactionDetail = async (token, transactionId) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Transaksi tidak ditemukan');
      }

      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      alert('Error: ' + error.message);
      router.push('/transactions');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Add print class to body for better print styling
    document.body.classList.add('printing');
    
    // Trigger print
    window.print();
    
    // Remove print class after print dialog closes
    setTimeout(() => {
      document.body.classList.remove('printing');
    }, 1000);
  };

  const handleVoid = async () => {
    if (!confirm('Yakin ingin void transaksi ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transactions/${id}/void`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Transaksi berhasil di-void');
        router.push('/transactions');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error voiding transaction:', error);
      alert('Terjadi kesalahan');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!transaction) {
    return <div className="loading-screen">Transaksi tidak ditemukan</div>;
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { bg: '#10B981', text: 'Selesai' },
      'pending': { bg: '#F59E0B', text: 'Pending' },
      'voided': { bg: '#EF4444', text: 'Void' }
    };
    const s = statusMap[status?.toLowerCase()] || { bg: '#6B7280', text: status };
    return (
      <span style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: s.bg,
        color: 'white',
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        {s.text}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Detail Transaksi #{transaction.id} - Barbershop Ucok POS</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <style jsx global>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
          
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }
      `}</style>

      <style jsx>{`
        body.printing {
          background: white !important;
        }
        
        body.printing * {
          visibility: visible;
        }

        .detail-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding-bottom: 2rem;
        }

        .navbar {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          padding: 1.25rem 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .navbar-brand h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .content-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          color: white;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .detail-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .detail-card h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.25rem;
          color: #111827;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #E5E7EB;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-item {
          padding: 0.75rem;
          background: #F9FAFB;
          border-radius: 8px;
        }

        .info-label {
          font-size: 0.875rem;
          color: #6B7280;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .items-table th,
        .items-table td {
          padding: 0.875rem;
          text-align: left;
          border-bottom: 1px solid #E5E7EB;
        }

        .items-table th {
          background: #F9FAFB;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .items-table tbody tr:hover {
          background: #F9FAFB;
        }

        .text-right {
          text-align: right;
        }

        .summary-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #E5E7EB;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 1rem;
        }

        .summary-row.total {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 2px solid #667eea;
        }

        @media print {
          @page {
            margin: 1cm;
          }
          
          /* Force everything visible */
          * {
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
          }
          
          body, html {
            background: white !important;
            color: #000 !important;
          }
          
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .printable {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .detail-container {
            background: white !important;
            min-height: auto !important;
            padding: 0 !important;
          }
          
          .navbar.printable {
            background: white !important;
            box-shadow: none !important;
            border-bottom: 2px solid #000 !important;
            padding: 1rem !important;
          }
          
          .navbar-brand h2 {
            color: #000 !important;
            background: none !important;
            -webkit-text-fill-color: #000 !important;
            font-size: 18pt !important;
          }
          
          .content-wrapper.printable {
            padding: 1rem !important;
            max-width: 100% !important;
          }
          
          .detail-card.printable {
            page-break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #000 !important;
            margin-bottom: 1rem !important;
            background: white !important;
            padding: 1rem !important;
          }
          
          .detail-card h3 {
            color: #000 !important;
            font-size: 14pt !important;
            font-weight: bold !important;
          }
          
          .info-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          
          .info-item {
            background: white !important;
            border: 1px solid #000 !important;
            padding: 0.5rem !important;
          }
          
          .info-label {
            color: #666 !important;
            font-size: 9pt !important;
            display: block !important;
          }
          
          .info-value {
            color: #000 !important;
            font-size: 11pt !important;
            font-weight: bold !important;
            display: block !important;
          }
          
          .items-table {
            font-size: 10pt !important;
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 1rem !important;
          }
          
          .items-table th,
          .items-table td {
            background: white !important;
            color: #000 !important;
            border: 1px solid #000 !important;
            padding: 8px !important;
            text-align: left !important;
          }
          
          .items-table th {
            font-weight: bold !important;
            background: #f0f0f0 !important;
          }
          
          .items-table .text-right {
            text-align: right !important;
          }
          
          .summary-section {
            page-break-inside: avoid;
            margin-top: 1rem !important;
            padding-top: 1rem !important;
            border-top: 2px solid #000 !important;
          }
          
          .summary-row {
            display: flex !important;
            justify-content: space-between !important;
            color: #000 !important;
            font-size: 11pt !important;
            padding: 4px 0 !important;
          }
          
          .summary-row.total {
            color: #000 !important;
            border-top: 2px solid #000 !important;
            font-size: 14pt !important;
            font-weight: bold !important;
            margin-top: 0.5rem !important;
            padding-top: 0.5rem !important;
          }
          
          /* Force show text in spans and divs */
          span, div, p, td, th, h1, h2, h3, h4, h5, h6 {
            color: #000 !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          .action-buttons {
            flex-direction: column;
          }
          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="detail-container">
        <nav className="navbar printable">
          <div className="navbar-brand">
            <h2>💈 Barbershop Ucok POS</h2>
          </div>
          <div className="navbar-menu no-print">
            <button className="btn btn-secondary btn-sm" onClick={() => router.push('/transactions')}>
              ← Kembali
            </button>
            <span className="user-info">👤 {user?.full_name || user?.username}</span>
          </div>
        </nav>

        <div className="content-wrapper printable">
          <div className="page-header no-print">
            <h1>📄 Detail Transaksi #{transaction.id}</h1>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handlePrint}>
                🖨️ Cetak
              </button>
              {transaction.status === 'completed' && (
                <button className="btn btn-danger" onClick={handleVoid}>
                  ❌ Void
                </button>
              )}
            </div>
          </div>

          {/* Print Header - Only visible when printing */}
          <div style={{ display: 'none' }} className="print-only">
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #E5E7EB'
            }}>
              <h1 style={{ 
                fontSize: '1.75rem', 
                color: '#111827',
                marginBottom: '0.5rem',
                fontFamily: 'Poppins, sans-serif'
              }}>
                💈 Barbershop Ucok
              </h1>
              <p style={{ fontSize: '1rem', color: '#6B7280' }}>Invoice #{transaction.id}</p>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="detail-card printable">
            <h3>📋 Informasi Transaksi</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">ID Transaksi</div>
                <div className="info-value">#{transaction.id}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Tanggal & Waktu</div>
                <div className="info-value">
                  {new Date(transaction.created_at).toLocaleString('id-ID')}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Kasir</div>
                <div className="info-value">{transaction.cashier_name || '-'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Customer</div>
                <div className="info-value">{transaction.customer_name || 'Walk-in'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Kapster</div>
                <div className="info-value">{transaction.kapster_name || '-'}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="detail-card printable">
            <h3>🛒 Item Transaksi</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Jenis</th>
                  <th className="text-right">Harga</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {transaction.details?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.item_name}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: item.item_type === 'SERVICE' ? '#DBEAFE' : '#FEF3C7',
                        color: item.item_type === 'SERVICE' ? '#1E40AF' : '#92400E',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {item.item_type === 'SERVICE' ? 'Layanan' : 'Produk'}
                      </span>
                    </td>
                    <td className="text-right">Rp {item.price?.toLocaleString()}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">Rp {item.subtotal?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="summary-section">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rp {transaction.subtotal?.toLocaleString()}</span>
              </div>
              {transaction.discount_amount > 0 && (
                <div className="summary-row">
                  <span>Diskon {transaction.discount_name ? `(${transaction.discount_name})` : ''}</span>
                  <span style={{ color: '#EF4444' }}>- Rp {transaction.discount_amount?.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>Rp {transaction.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payments */}
          {transaction.payments && transaction.payments.length > 0 && (
            <div className="detail-card printable">
              <h3>💳 Pembayaran</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Metode</th>
                    <th className="text-right">Jumlah</th>
                    <th>Referensi</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.payments.map((payment, idx) => (
                    <tr key={idx}>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {payment.payment_method}
                        </span>
                      </td>
                      <td className="text-right">Rp {payment.amount?.toLocaleString()}</td>
                      <td>{payment.reference_no || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
