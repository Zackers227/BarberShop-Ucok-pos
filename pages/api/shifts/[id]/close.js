const { withAuth } = require('../../../../lib/auth');
const { query } = require('../../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'POST') {
      const { closing_balance, actual_cash, notes } = req.body;

      // Get shift
      const shiftResult = await query('SELECT * FROM shifts WHERE id = $1', [id]);

      if (shiftResult.rows.length === 0) {
        return res.status(404).json({ error: 'Shift tidak ditemukan' });
      }

      const shift = shiftResult.rows[0];

      if (shift.closed_at) {
        return res.status(400).json({ error: 'Shift sudah ditutup' });
      }

      if (shift.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Anda tidak berhak menutup shift ini' });
      }

      // Get total transaksi dalam shift
      const statsResult = await query(
        `SELECT 
           COUNT(*) as total_transactions,
           COALESCE(SUM(total), 0) as total_sales,
           COALESCE(SUM(discount_amount), 0) as total_discounts
         FROM transactions
         WHERE shift_id = $1 AND status = 'completed'`,
        [id]
      );

      const stats = statsResult.rows[0];
      const cash_difference = actual_cash - closing_balance;

      // Update shift
      const result = await query(
        `UPDATE shifts
         SET closed_at = CURRENT_TIMESTAMP,
             closing_balance = $1,
             actual_cash = $2,
             cash_difference = $3,
             total_transactions = $4,
             total_sales = $5,
             total_discounts = $6,
             notes = CASE WHEN $7 IS NOT NULL THEN notes || ' | ' || $7 ELSE notes END
         WHERE id = $8
         RETURNING *`,
        [
          closing_balance,
          actual_cash,
          cash_difference,
          stats.total_transactions,
          stats.total_sales,
          stats.total_discounts,
          notes,
          id
        ]
      );

      // Log activity
      await query(
        'INSERT INTO activity_logs (user_id, action, description) VALUES ($1, $2, $3)',
        [req.user.id, 'close_shift', `Shift ditutup dengan total transaksi ${stats.total_transactions} dan penjualan Rp ${stats.total_sales}`]
      );

      return res.status(200).json({
        message: 'Shift berhasil ditutup',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Close shift error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
