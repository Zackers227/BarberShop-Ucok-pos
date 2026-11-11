const { withAuth } = require('../../../../lib/auth');
const { query } = require('../../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'POST') {
      const { closing_balance, ending_cash, notes } = req.body;
      
      console.log('Close shift request:', { id, body: req.body });
      
      const actualClosingBalance = ending_cash || closing_balance || 0; // Support both field names

      // Get shift
      const shiftResult = await query('SELECT * FROM shifts WHERE id = $1', [id]);

      if (shiftResult.rows.length === 0) {
        console.error('Shift not found:', id);
        return res.status(404).json({ error: 'Shift tidak ditemukan' });
      }

      const shift = shiftResult.rows[0];
      console.log('Shift found:', { shift_id: shift.id, user_id: shift.user_id, closed_at: shift.closed_at });

      if (shift.closed_at) {
        return res.status(400).json({ error: 'Shift sudah ditutup' });
      }

      if (shift.user_id !== req.user.id && req.user.role !== 'OWNER') {
        return res.status(403).json({ error: 'Anda tidak berhak menutup shift ini' });
      }

      // Get total transaksi dalam shift
      console.log('Calculating shift stats for shift_id:', id);
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
      console.log('Shift stats:', stats);
      
      // Safeguard: ensure all values are valid numbers
      const openingBalance = parseFloat(shift.opening_balance) || 0;
      const totalSales = parseFloat(stats.total_sales) || 0;
      const closingBalance = parseFloat(actualClosingBalance);
      
      // Validate closing balance is a valid number
      if (isNaN(closingBalance) || closingBalance < 0) {
        console.error('Invalid closing balance:', actualClosingBalance);
        return res.status(400).json({ 
          error: 'Saldo akhir tidak valid',
          details: `Nilai yang diterima: ${actualClosingBalance}`
        });
      }
      
      const expectedBalance = openingBalance + totalSales;
      const difference = closingBalance - expectedBalance;
      
      console.log('Balances:', {
        opening: openingBalance,
        closing: closingBalance,
        total_sales: totalSales,
        expected: expectedBalance,
        difference: difference
      });

      // Update shift - simplified query without complex CASE for notes
      const updateNotes = notes ? (shift.notes ? `${shift.notes} | ${notes}` : notes) : shift.notes;
      
      const result = await query(
        `UPDATE shifts
         SET closed_at = CURRENT_TIMESTAMP,
             closing_balance = $1,
             expected_balance = $2,
             difference = $3,
             notes = $4
         WHERE id = $5
         RETURNING *`,
        [
          closingBalance,
          expectedBalance,
          difference,
          updateNotes,
          id
        ]
      );

      console.log('Shift closed successfully:', result.rows[0].id);

      return res.status(200).json({
        message: 'Shift berhasil ditutup',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Close shift error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return res.status(500).json({ 
      error: 'Terjadi kesalahan server',
      details: error.message 
    });
  }
}

export default withAuth(handler);
