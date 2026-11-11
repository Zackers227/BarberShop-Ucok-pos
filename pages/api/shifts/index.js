const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get shifts with filters
      const { user_id, date, status, limit = 50, offset = 0 } = req.query;

      let sql = `
        SELECT s.*, u.full_name as cashier_name
        FROM shifts s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (user_id) {
        sql += ` AND s.user_id = $${paramIndex}`;
        params.push(user_id);
        paramIndex++;
      }

      if (date) {
        sql += ` AND DATE(s.opened_at) = $${paramIndex}`;
        params.push(date);
        paramIndex++;
      }

      if (status === 'open') {
        sql += ` AND s.closed_at IS NULL`;
      } else if (status === 'closed') {
        sql += ` AND s.closed_at IS NOT NULL`;
      }

      sql += ` ORDER BY s.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await query(sql, params);
      
      // Calculate real-time stats for each shift
      const shiftsWithStats = await Promise.all(
        result.rows.map(async (shift) => {
          // Get transaction stats for this shift
          const statsResult = await query(
            `SELECT 
               COUNT(*) as total_transactions,
               COALESCE(SUM(total), 0) as total_sales
             FROM transactions
             WHERE shift_id = $1 AND status = 'completed'`,
            [shift.id]
          );
          
          return {
            ...shift,
            total_transactions: parseInt(statsResult.rows[0].total_transactions) || 0,
            total_sales: parseFloat(statsResult.rows[0].total_sales) || 0
          };
        })
      );
      
      return res.status(200).json(shiftsWithStats);
    }

    if (req.method === 'POST') {
      // Open shift
      const { starting_cash, opening_balance, notes } = req.body;
      const initialCash = starting_cash || opening_balance || 0; // Support both field names

      // Check if ada shift yang masih terbuka
      const openShift = await query(
        'SELECT id FROM shifts WHERE user_id = $1 AND closed_at IS NULL',
        [req.user.id]
      );

      if (openShift.rows.length > 0) {
        return res.status(400).json({ error: 'Anda masih memiliki shift yang belum ditutup' });
      }

      const result = await query(
        `INSERT INTO shifts (user_id, opening_balance, notes)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [req.user.id, initialCash, notes || null]
      );

      // Activity log removed - table schema mismatch

      return res.status(201).json({
        message: 'Shift berhasil dibuka',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Shifts API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
