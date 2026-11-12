import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '../components/Logo';

export default function PendingTransactions() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('TUNAI');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processing, setProcessing] = useState(false);

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

    fetchPendingTransactions(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPendingTransactions = async (token) => {
    try {
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Filter only pending transactions
      const pending = data.filter(t => t.status === 'pending');
      setTransactions(pending);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (transaction) => {
    setSelectedTransaction(transaction);
    setPaymentAmount(transaction.total.toString());
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (paymentMethod === 'TUNAI' && parseFloat(paymentAmount) < parseFloat(selectedTransaction.total)) {
      alert('Jumlah pembayaran kurang!');
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare payment data
      const paymentData = [];
      if (paymentMethod === 'TUNAI') {
        paymentData.push({
          payment_method: 'TUNAI',
          amount: parseFloat(paymentAmount),
          reference_no: null
        });
      } else {
        paymentData.push({
          payment_method: paymentMethod,
          amount: parseFloat(selectedTransaction.total),
          reference_no: null
        });
      }

      const response = await fetch(`/api/transactions/${selectedTransaction.id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payments: paymentData
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Hitung kembalian untuk pembayaran tunai
        let changeAmount = 0;
        if (paymentMethod === 'TUNAI') {
          changeAmount = parseFloat(paymentAmount) - parseFloat(selectedTransaction.total);
        }
        
        // Tampilkan alert dengan kembalian
        let alertMessage = `Pembayaran berhasil!\nNo: ${result.transaction.transaction_no}\n`;
        alertMessage += `\nTOTAL: Rp ${selectedTransaction.total.toLocaleString()}`;
        
        if (paymentMethod === 'TUNAI') {
          alertMessage += `\nBayar: Rp ${parseFloat(paymentAmount).toLocaleString()}`;
          alertMessage += `\nKEMBALIAN: Rp ${changeAmount.toLocaleString()}`;
        }
        
        alertMessage += `\n\nStruk sedang dicetak...`;
        
        // Auto print struk setelah pembayaran berhasil
        window.open(
          `/print/${selectedTransaction.id}`,
          '_blank',
          'width=800,height=600'
        );
        
        alert(alertMessage);
        setShowPaymentModal(false);
        setSelectedTransaction(null);
        setPaymentAmount('');
        
        // Refresh list
        fetchPendingTransactions(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setProcessing(false);
    }
  };

  const calculateChange = () => {
    if (!selectedTransaction || paymentMethod !== 'TUNAI') return 0;
    const paid = parseFloat(paymentAmount) || 0;
    const total = parseFloat(selectedTransaction.total);
    return paid >= total ? paid - total : 0;
  };

  const handleViewDetails = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transactions/${transactionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Show details
      let detailsText = `DETAIL TRANSAKSI\n\n`;
      detailsText += `No: ${data.transaction_no}\n`;
      detailsText += `Customer: ${data.customer_name || 'Walk-in'}\n`;
      detailsText += `Kapster: ${data.kapster_name || '-'}\n`;
      detailsText += `Kasir: ${data.cashier_name}\n`;
      detailsText += `\nITEM:\n`;
      
      data.details.forEach(item => {
        detailsText += `- ${item.item_name} (${item.quantity}x) = Rp ${item.subtotal.toLocaleString()}\n`;
      });
      
      detailsText += `\nSubtotal: Rp ${data.subtotal.toLocaleString()}\n`;
      if (data.discount_amount > 0) {
        detailsText += `Diskon: -Rp ${data.discount_amount.toLocaleString()}\n`;
      }
      detailsText += `TOTAL: Rp ${data.total.toLocaleString()}`;
      
      alert(detailsText);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert('Gagal memuat detail transaksi');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Transaksi Pending - Barbershop Ucok POS</title>
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
          <h1 className="page-title">⏸️ Transaksi Pending</h1>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>📋 Daftar Transaksi Belum Dibayar</h3>
              <span className="badge badge-warning" style={{ fontSize: '18px', padding: '8px 16px' }}>
                {transactions.length} Transaksi
              </span>
            </div>

            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                <h3>Tidak ada transaksi pending</h3>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                  Semua transaksi sudah dibayar atau belum ada transaksi pending
                </p>
                <button className="btn btn-primary" onClick={() => router.push('/transaction')}>
                  🛒 Buat Transaksi Baru
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No Transaksi</th>
                      <th>Waktu</th>
                      <th>Customer</th>
                      <th>Kapster</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.transaction_no}</strong></td>
                        <td>{new Date(t.created_at).toLocaleString('id-ID')}</td>
                        <td>{t.customer_name || 'Walk-in'}</td>
                        <td>{t.kapster_name || '-'}</td>
                        <td className="text-right">
                          <strong style={{ fontSize: '16px', color: '#ff9800' }}>
                            Rp {t.total?.toLocaleString() || 0}
                          </strong>
                        </td>
                        <td>
                          <span className="badge badge-warning">⏸️ Pending</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn btn-sm btn-info" 
                              onClick={() => handleViewDetails(t.id)}
                            >
                              👁️ Detail
                            </button>
                            <button 
                              className="btn btn-sm btn-success" 
                              onClick={() => handlePayNow(t)}
                            >
                              💰 Bayar Sekarang
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedTransaction && (
          <div className="modal-overlay" onClick={() => !processing && setShowPaymentModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <h3>💰 Proses Pembayaran</h3>
              
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px' 
              }}>
                <p><strong>No Transaksi:</strong> {selectedTransaction.transaction_no}</p>
                <p><strong>Customer:</strong> {selectedTransaction.customer_name || 'Walk-in'}</p>
                <p><strong>Kapster:</strong> {selectedTransaction.kapster_name || '-'}</p>
                <p style={{ fontSize: '20px', color: '#ff9800', marginTop: '10px' }}>
                  <strong>Total: Rp {selectedTransaction.total?.toLocaleString() || 0}</strong>
                </p>
              </div>

              <div className="form-group">
                <label>Metode Pembayaran</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processing}
                >
                  <option value="TUNAI">Tunai</option>
                  <option value="QRIS">QRIS</option>
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="DEBIT">Kartu Debit</option>
                </select>
              </div>

              {paymentMethod === 'TUNAI' && (
                <>
                  <div className="form-group">
                    <label>Jumlah Bayar</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0"
                      disabled={processing}
                    />
                  </div>
                  {paymentAmount && (
                    <div className="change-display">
                      <span>Kembalian:</span>
                      <strong className={calculateChange() >= 0 ? 'text-success' : 'text-danger'}>
                        Rp {calculateChange().toLocaleString()}
                      </strong>
                    </div>
                  )}
                </>
              )}

              <div className="button-group" style={{ marginTop: '20px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowPaymentModal(false)}
                  disabled={processing}
                >
                  Batal
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={handleProcessPayment}
                  disabled={processing}
                >
                  {processing ? 'Memproses...' : '✅ Proses Pembayaran'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
