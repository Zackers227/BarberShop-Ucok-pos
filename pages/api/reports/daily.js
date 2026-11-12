const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Parameter date harus diisi (format: YYYY-MM-DD)' });
      }

      // Summary transaksi
      const summaryResult = await query(
        `SELECT 
           COUNT(*) as total_transactions,
           COUNT(DISTINCT customer_id) FILTER (WHERE customer_id IS NOT NULL) as total_customers,
           COALESCE(SUM(subtotal), 0) as total_subtotal,
           COALESCE(SUM(discount_amount), 0) as total_discounts,
           COALESCE(SUM(total), 0) as total_revenue
         FROM transactions
         WHERE DATE(created_at) = $1 AND status = 'completed'`,
        [date]
      );

      // Per payment method
      const paymentsResult = await query(
        `SELECT 
           p.payment_method,
           COUNT(DISTINCT p.transaction_id) as transaction_count,
           COALESCE(SUM(p.amount), 0) as total_amount
         FROM payments p
         JOIN transactions t ON p.transaction_id = t.id
         WHERE DATE(t.created_at) = $1 AND t.status = 'completed'
         GROUP BY p.payment_method
         ORDER BY total_amount DESC`,
        [date]
      );

      // Per kapster
      const kapstersResult = await query(
        `SELECT 
           k.id,
           k.name,
           COUNT(t.id) as total_customers,
           COALESCE(SUM(t.total), 0) as total_revenue,
           COALESCE(SUM(t.total * k.commission_percentage / 100), 0) as total_commission
         FROM kapsters k
         LEFT JOIN transactions t ON k.id = t.kapster_id AND DATE(t.created_at) = $1 AND t.status = 'completed'
         WHERE k.is_active = true
         GROUP BY k.id, k.name, k.commission_percentage
         ORDER BY total_revenue DESC`,
        [date]
      );

      // Top services
      const servicesResult = await query(
        `SELECT 
           td.item_name as name,
           SUM(td.quantity) as quantity,
           COALESCE(SUM(td.subtotal), 0) as total_revenue
         FROM transaction_details td
         JOIN transactions t ON td.transaction_id = t.id
         WHERE UPPER(td.item_type) = 'SERVICE' AND DATE(t.created_at) = $1 AND t.status = 'completed'
         GROUP BY td.item_name
         ORDER BY quantity DESC
         LIMIT 10`,
        [date]
      );

      // Top products
      const productsResult = await query(
        `SELECT 
           td.item_name as name,
           SUM(td.quantity) as quantity,
           COALESCE(SUM(td.subtotal), 0) as total_revenue
         FROM transaction_details td
         JOIN transactions t ON td.transaction_id = t.id
         WHERE UPPER(td.item_type) = 'PRODUCT' AND DATE(t.created_at) = $1 AND t.status = 'completed'
         GROUP BY td.item_name
         ORDER BY quantity DESC
         LIMIT 10`,
        [date]
      );

      const summary = summaryResult.rows[0];
      
      return res.status(200).json({
        date,
        total_revenue: parseFloat(summary.total_revenue || 0),
        total_transactions: parseInt(summary.total_transactions || 0),
        total_customers: parseInt(summary.total_customers || 0),
        by_payment_method: paymentsResult.rows,
        kapster_performance: kapstersResult.rows,
        top_services: servicesResult.rows,
        top_products: productsResult.rows
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Daily report error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
