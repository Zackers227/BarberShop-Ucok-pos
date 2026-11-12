import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PrintReceipt() {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/transactions/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setTransaction(data);
          // Auto print when loaded
          setTimeout(() => {
            window.print();
          }, 500);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading || !transaction) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        @page {
          size: 58mm auto;
          margin: 0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: white;
          width: 58mm;
          font-family: 'Courier New', 'Consolas', monospace;
          font-size: 10pt;
          line-height: 1.2;
          color: #000;
          padding: 2mm;
        }

        .receipt {
          width: 100%;
        }

        .header {
          text-align: center;
          margin-bottom: 3mm;
          padding-bottom: 2mm;
          border-bottom: 2px solid #000;
        }

        .header h1 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 0.5mm;
          letter-spacing: 0;
        }

        .header p {
          font-size: 8pt;
          line-height: 1.3;
        }

        .divider {
          border-top: 1px dashed #000;
          margin: 2mm 0;
        }

        .divider-solid {
          border-top: 1px solid #000;
          margin: 2mm 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 9pt;
          margin: 1mm 0;
        }

        .info-label {
          font-weight: normal;
        }

        .info-value {
          font-weight: bold;
          text-align: right;
        }

        .items {
          margin: 2mm 0;
        }

        .item {
          margin: 1.5mm 0;
        }

        .item-name {
          font-size: 10pt;
          font-weight: bold;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          font-size: 9pt;
          margin-top: 0.5mm;
        }

        .summary {
          margin-top: 2mm;
          padding-top: 2mm;
          border-top: 1px solid #000;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 10pt;
          margin: 1mm 0;
        }

        .summary-row.total {
          font-size: 14pt;
          font-weight: bold;
          margin-top: 2mm;
          padding-top: 2mm;
          border-top: 2px solid #000;
        }

        .footer {
          text-align: center;
          margin-top: 3mm;
          padding-top: 2mm;
          border-top: 1px dashed #000;
          font-size: 8pt;
        }

        .thank-you {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 2mm;
        }

        @media print {
          body {
            padding: 1mm;
          }
        }

        @media screen {
          body {
            background: #f0f0f0;
            padding: 20px;
          }
          
          .receipt {
            background: white;
            padding: 5mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      <div className="receipt">
        {/* Header */}
        <div className="header">
          <h1>MENSURFACE</h1>
          <p style={{ fontSize: '9pt', letterSpacing: '2px' }}>- BARBER AND SHOP -</p>
        </div>

        {/* Transaction Info */}
        <div className="info-row">
          <span className="info-label">No</span>
          <span className="info-value">#{transaction.id}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tanggal</span>
          <span className="info-value">
            {new Date(transaction.created_at).toLocaleString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Kasir</span>
          <span className="info-value">{transaction.cashier_name || '-'}</span>
        </div>
        {transaction.customer_name && (
          <div className="info-row">
            <span className="info-label">Customer</span>
            <span className="info-value">{transaction.customer_name}</span>
          </div>
        )}
        {transaction.kapster_name && (
          <div className="info-row">
            <span className="info-label">Kapster</span>
            <span className="info-value">{transaction.kapster_name}</span>
          </div>
        )}

        <div className="divider-solid"></div>

        {/* Items */}
        <div className="items">
          {transaction.details?.map((item, idx) => (
            <div key={idx} className="item">
              <div className="item-name">{item.item_name}</div>
              <div className="item-details">
                <span>{item.quantity} x Rp {item.price?.toLocaleString()}</span>
                <span>Rp {item.subtotal?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        {/* Summary */}
        <div className="summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rp {transaction.subtotal?.toLocaleString()}</span>
          </div>
          {transaction.discount_amount > 0 && (
            <div className="summary-row">
              <span>Diskon</span>
              <span>- Rp {transaction.discount_amount?.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>TOTAL</span>
            <span>Rp {transaction.total?.toLocaleString()}</span>
          </div>
        </div>

        <div className="divider"></div>

        {/* Payment */}
        {transaction.payments && transaction.payments.length > 0 && (
          <>
            {transaction.payments.map((payment, idx) => (
              <div key={idx} className="summary-row">
                <span>{payment.payment_method}</span>
                <span>Rp {payment.amount?.toLocaleString()}</span>
              </div>
            ))}
            <div className="divider"></div>
          </>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="thank-you">TERIMA KASIH</div>
          <p>Selamat Datang Kembali</p>
        </div>
      </div>
    </>
  );
}
