const { withAuth } = require('../../../../lib/auth');
const { query } = require('../../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'POST') {
      const { closing_balance, ending_cash, notes } = req.body;
      const actualClosingBalance = ending_cash || closing_balance || 0; // Support both field names

      // Get shift
      const shiftResult = await query('SELECT * FROM shifts WHERE id = $1', [id]);

      if (shiftResult.rows.length === 0) {
        return res.status(404).json({ error: 'Shift tidak ditemukan' });
      }

      const shift = shiftResult.rows[0];

      if (shift.closed_at) {
        return res.status(400).json({ error: 'Shift sudah ditutup' });
      }

      if (shift.user_id !== req.user.id && req.user.role !== 'OWNER') {
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
      const expectedBalance = parseFloat(shift.opening_balance || 0) + parseFloat(stats.total_sales || 0);
      const difference = parseFloat(actualClosingBalance) - expectedBalance;

      // Update shift
      const result = await query(
        `UPDATE shifts
         SET closed_at = CURRENT_TIMESTAMP,
             closing_balance = $1,
             expected_balance = $2,
             difference = $3,
             notes = CASE WHEN $4 IS NOT NULL THEN COALESCE(notes || ' | ', '') || $4 ELSE notes END
         WHERE id = $5
         RETURNING *`,
        [
          actualClosingBalance,
          expectedBalance,
          difference,
          notes,
          id
        ]
      );

      // Activity log removed - table schema mismatch

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
