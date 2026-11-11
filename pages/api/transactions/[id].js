const { withAuth } = require('../../../lib/auth');
const { query, getClient } = require('../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Get transaction by id
      const result = await query(
        `SELECT t.*, 
                c.name as customer_name, c.phone as customer_phone,
                k.name as kapster_name,
                u.full_name as cashier_name,
                d.name as discount_name
         FROM transactions t
         LEFT JOIN customers c ON t.customer_id = c.id
         LEFT JOIN kapsters k ON t.kapster_id = k.id
         LEFT JOIN users u ON t.user_id = u.id
         LEFT JOIN discounts d ON t.discount_id = d.id
         WHERE t.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      }

      // Get details
      const detailsResult = await query(
        'SELECT * FROM transaction_details WHERE transaction_id = $1',
        [id]
      );

      // Get payments
      const paymentsResult = await query(
        'SELECT * FROM payments WHERE transaction_id = $1',
        [id]
      );

      return res.status(200).json({
        ...result.rows[0],
        details: detailsResult.rows,
        payments: paymentsResult.rows
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Transaction API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
