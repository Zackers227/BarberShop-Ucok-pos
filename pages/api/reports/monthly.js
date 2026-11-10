const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { year, month } = req.query;

      if (!year || !month) {
        return res.status(400).json({ error: 'Parameter year dan month harus diisi' });
      }

      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

      // Summary
      const summaryResult = await query(
        `SELECT 
           COUNT(*) as total_transactions,
           COALESCE(SUM(subtotal), 0) as total_subtotal,
           COALESCE(SUM(discount_amount), 0) as total_discounts,
           COALESCE(SUM(total), 0) as total_sales
         FROM transactions
         WHERE DATE(created_at) BETWEEN $1 AND $2 AND status = 'completed'`,
        [startDate, endDate]
      );

      // Per day
      const dailyResult = await query(
        `SELECT 
           DATE(created_at) as date,
           COUNT(*) as transaction_count,
           COALESCE(SUM(total), 0) as total_sales
         FROM transactions
         WHERE DATE(created_at) BETWEEN $1 AND $2 AND status = 'completed'
         GROUP BY DATE(created_at)
         ORDER BY date`,
        [startDate, endDate]
      );

      // Per kapster
      const kapstersResult = await query(
        `SELECT 
           k.id,
           k.name,
           COUNT(t.id) as transaction_count,
           COALESCE(SUM(t.total), 0) as total_sales,
           COALESCE(SUM(t.total * k.commission_percentage / 100), 0) as total_commission
         FROM kapsters k
         LEFT JOIN transactions t ON k.id = t.kapster_id 
           AND DATE(t.created_at) BETWEEN $1 AND $2 AND t.status = 'completed'
         WHERE k.is_active = true
         GROUP BY k.id, k.name, k.commission_percentage
         ORDER BY total_sales DESC`,
        [startDate, endDate]
      );

      // Top services
      const servicesResult = await query(
        `SELECT 
           td.item_name,
           COUNT(*) as quantity_sold,
           COALESCE(SUM(td.subtotal), 0) as total_revenue
         FROM transaction_details td
         JOIN transactions t ON td.transaction_id = t.id
         WHERE td.item_type = 'service' AND DATE(t.created_at) BETWEEN $1 AND $2 AND t.status = 'completed'
         GROUP BY td.item_name
         ORDER BY quantity_sold DESC
         LIMIT 10`,
        [startDate, endDate]
      );

      // Top products
      const productsResult = await query(
        `SELECT 
           td.item_name,
           COUNT(*) as quantity_sold,
           COALESCE(SUM(td.subtotal), 0) as total_revenue
         FROM transaction_details td
         JOIN transactions t ON td.transaction_id = t.id
         WHERE td.item_type = 'product' AND DATE(t.created_at) BETWEEN $1 AND $2 AND t.status = 'completed'
         GROUP BY td.item_name
         ORDER BY quantity_sold DESC
         LIMIT 10`,
        [startDate, endDate]
      );

      return res.status(200).json({
        year: parseInt(year),
        month: parseInt(month),
        summary: summaryResult.rows[0],
        daily: dailyResult.rows,
        by_kapster: kapstersResult.rows,
        top_services: servicesResult.rows,
        top_products: productsResult.rows
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Monthly report error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
