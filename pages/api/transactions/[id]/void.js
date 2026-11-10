const { withAuth } = require('../../../../lib/auth');
const { query, getClient } = require('../../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'POST') {
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'Alasan void harus diisi' });
      }

      // Get transaction
      const transResult = await query('SELECT * FROM transactions WHERE id = $1', [id]);

      if (transResult.rows.length === 0) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      }

      const transaction = transResult.rows[0];

      if (transaction.status === 'void') {
        return res.status(400).json({ error: 'Transaksi sudah di-void' });
      }

      // Get details untuk kembalikan stok
      const detailsResult = await query(
        `SELECT * FROM transaction_details WHERE transaction_id = $1 AND item_type = 'product'`,
        [id]
      );

      const client = await getClient();

      try {
        await client.query('BEGIN');

        // Update status transaksi
        await client.query(
          `UPDATE transactions 
           SET status = 'void', void_reason = $1, voided_by = $2, voided_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [reason, req.user.id, id]
        );

        // Kembalikan stok produk
        for (const detail of detailsResult.rows) {
          await client.query(
            'UPDATE products SET stock = stock + $1 WHERE id = $2',
            [detail.quantity, detail.item_id]
          );

          await client.query(
            `INSERT INTO stock_history (product_id, type, quantity, notes, user_id)
             VALUES ($1, 'in', $2, $3, $4)`,
            [detail.item_id, detail.quantity, `Void transaksi ${transaction.transaction_no}`, req.user.id]
          );
        }

        // Update customer stats jika ada
        if (transaction.customer_id) {
          await client.query(
            `UPDATE customers 
             SET total_visits = total_visits - 1,
                 total_spending = total_spending - $1
             WHERE id = $2`,
            [transaction.total, transaction.customer_id]
          );
        }

        await client.query('COMMIT');
        client.release();

        return res.status(200).json({ message: 'Transaksi berhasil di-void' });

      } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        throw error;
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Void transaction error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler, { roles: ['admin', 'owner'] });
