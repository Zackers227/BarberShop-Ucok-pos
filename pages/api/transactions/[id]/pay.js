const { withAuth } = require('../../../../lib/auth');
const { query, getClient } = require('../../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'POST') {
      const { payments } = req.body;

      // Validasi
      if (!payments || payments.length === 0) {
        return res.status(400).json({ error: 'Metode pembayaran harus dipilih' });
      }

      // Get transaction
      const transactionResult = await query(
        'SELECT * FROM transactions WHERE id = $1',
        [id]
      );

      if (transactionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      }

      const transaction = transactionResult.rows[0];

      if (transaction.status !== 'pending') {
        return res.status(400).json({ error: 'Transaksi ini bukan pending transaction' });
      }

      // Validasi total pembayaran
      const totalPayment = payments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPayment < transaction.total) {
        return res.status(400).json({ error: 'Total pembayaran kurang dari total transaksi' });
      }

      // Start transaction
      const client = await getClient();

      try {
        await client.query('BEGIN');

        // Update transaction status to completed
        await client.query(
          `UPDATE transactions 
           SET status = 'completed', updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [id]
        );

        // Insert payments
        for (const payment of payments) {
          await client.query(
            `INSERT INTO payments (transaction_id, payment_method, amount, reference_no, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              id,
              payment.payment_method,
              payment.amount,
              payment.reference_no || null,
              payment.notes || null
            ]
          );
        }

        // Update customer stats if exists
        if (transaction.customer_id) {
          await client.query(
            `UPDATE customers 
             SET total_visits = total_visits + 1,
                 total_spending = total_spending + $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [transaction.total, transaction.customer_id]
          );
        }

        // Update discount usage
        if (transaction.discount_id) {
          await client.query(
            'UPDATE discounts SET usage_count = usage_count + 1 WHERE id = $1',
            [transaction.discount_id]
          );
        }

        await client.query('COMMIT');
        client.release();

        // Get complete transaction data
        const completeResult = await query(
          `SELECT t.*, 
                  c.name as customer_name,
                  k.name as kapster_name,
                  u.full_name as cashier_name
           FROM transactions t
           LEFT JOIN customers c ON t.customer_id = c.id
           LEFT JOIN kapsters k ON t.kapster_id = k.id
           LEFT JOIN users u ON t.user_id = u.id
           WHERE t.id = $1`,
          [id]
        );

        // Get payments
        const paymentsResult = await query(
          'SELECT * FROM payments WHERE transaction_id = $1',
          [id]
        );

        return res.status(200).json({
          message: 'Pembayaran berhasil diproses',
          transaction: {
            ...completeResult.rows[0],
            payments: paymentsResult.rows
          }
        });

      } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        throw error;
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Pay transaction error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
