const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Sales report
router.get('/sales', auth, async (req, res) => {
    try {
        const { start_date, end_date, group_by = 'day' } = req.query;
        
        let dateFormat;
        switch (group_by) {
            case 'month':
                dateFormat = '%Y-%m';
                break;
            case 'year':
                dateFormat = '%Y';
                break;
            default:
                dateFormat = '%Y-%m-%d';
        }

        let sql = `
            SELECT 
                strftime('${dateFormat}', created_at) as period,
                COUNT(id) as total_transactions,
                SUM(total) as total_sales,
                SUM(discount_amount) as total_discounts,
                AVG(total) as avg_transaction
            FROM transactions
            WHERE status = 'completed'
        `;

        const params = [];
        if (start_date) {
            sql += ' AND DATE(created_at) >= ?';
            params.push(start_date);
        }
        if (end_date) {
            sql += ' AND DATE(created_at) <= ?';
            params.push(end_date);
        }

        sql += ` GROUP BY period ORDER BY period DESC`;

        const report = await db.query(sql, params);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Kapster performance report
router.get('/kapsters', auth, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let sql = `
            SELECT 
                k.id,
                k.name,
                k.commission_percentage,
                COUNT(t.id) as total_transactions,
                SUM(t.total) as total_revenue,
                SUM(t.total * k.commission_percentage / 100) as total_commission
            FROM kapsters k
            LEFT JOIN transactions t ON k.id = t.kapster_id AND t.status = 'completed'
            WHERE k.is_active = 1
        `;

        const params = [];
        if (start_date) {
            sql += ' AND DATE(t.created_at) >= ?';
            params.push(start_date);
        }
        if (end_date) {
            sql += ' AND DATE(t.created_at) <= ?';
            params.push(end_date);
        }

        sql += ` GROUP BY k.id ORDER BY total_revenue DESC`;

        const report = await db.query(sql, params);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Top services
router.get('/services/top', auth, async (req, res) => {
    try {
        const { start_date, end_date, limit = 10 } = req.query;

        let sql = `
            SELECT 
                td.item_name,
                COUNT(*) as total_sold,
                SUM(td.subtotal) as total_revenue
            FROM transaction_details td
            JOIN transactions t ON td.transaction_id = t.id
            WHERE td.item_type = 'service' AND t.status = 'completed'
        `;

        const params = [];
        if (start_date) {
            sql += ' AND DATE(t.created_at) >= ?';
            params.push(start_date);
        }
        if (end_date) {
            sql += ' AND DATE(t.created_at) <= ?';
            params.push(end_date);
        }

        sql += ` GROUP BY td.item_name ORDER BY total_sold DESC LIMIT ?`;
        params.push(parseInt(limit));

        const report = await db.query(sql, params);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Payment methods summary
router.get('/payments', auth, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let sql = `
            SELECT 
                p.payment_method,
                COUNT(DISTINCT t.id) as total_transactions,
                SUM(p.amount) as total_amount
            FROM payments p
            JOIN transactions t ON p.transaction_id = t.id
            WHERE t.status = 'completed'
        `;

        const params = [];
        if (start_date) {
            sql += ' AND DATE(t.created_at) >= ?';
            params.push(start_date);
        }
        if (end_date) {
            sql += ' AND DATE(t.created_at) <= ?';
            params.push(end_date);
        }

        sql += ` GROUP BY p.payment_method ORDER BY total_amount DESC`;

        const report = await db.query(sql, params);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Dashboard summary
router.get('/dashboard', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Today's sales
        const todaySales = await db.get(
            `SELECT 
                COUNT(id) as total_transactions,
                COALESCE(SUM(total), 0) as total_sales
             FROM transactions
             WHERE DATE(created_at) = ? AND status = 'completed'`,
            [today]
        );

        // Low stock products
        const lowStock = await db.query(
            'SELECT name, stock, min_stock FROM products WHERE stock <= min_stock AND is_active = 1 LIMIT 5'
        );

        // Active shift
        const activeShift = await db.get(
            'SELECT id, opening_balance, opened_at FROM shifts WHERE closed_at IS NULL LIMIT 1'
        );

        // Top customers
        const topCustomers = await db.query(
            `SELECT name, phone, total_visits, total_spending 
             FROM customers 
             WHERE name != 'Walk-in Customer'
             ORDER BY total_spending DESC 
             LIMIT 5`
        );

        res.json({
            today: todaySales,
            low_stock: lowStock,
            active_shift: activeShift,
            top_customers: topCustomers
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
