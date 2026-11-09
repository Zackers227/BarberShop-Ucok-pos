const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get current shift
router.get('/current', auth, async (req, res) => {
    try {
        const shift = await db.get(
            `SELECT s.*, u.full_name as cashier_name
             FROM shifts s
             LEFT JOIN users u ON s.user_id = u.id
             WHERE s.user_id = ? AND s.closed_at IS NULL
             ORDER BY s.id DESC
             LIMIT 1`,
            [req.user.id]
        );

        res.json(shift || null);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Open shift
router.post('/open', auth, async (req, res) => {
    try {
        const { opening_balance, notes } = req.body;

        // Check if there's already an open shift
        const existingShift = await db.get(
            'SELECT id FROM shifts WHERE user_id = ? AND closed_at IS NULL',
            [req.user.id]
        );

        if (existingShift) {
            return res.status(400).json({ error: 'Anda sudah memiliki shift yang terbuka' });
        }

        const result = await db.run(
            'INSERT INTO shifts (user_id, opening_balance, notes) VALUES (?, ?, ?)',
            [req.user.id, opening_balance || 0, notes || null]
        );

        res.status(201).json({ 
            message: 'Shift berhasil dibuka',
            id: result.id 
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Close shift
router.post('/close', auth, async (req, res) => {
    try {
        const { closing_balance, notes } = req.body;

        const shift = await db.get(
            'SELECT * FROM shifts WHERE user_id = ? AND closed_at IS NULL ORDER BY id DESC LIMIT 1',
            [req.user.id]
        );

        if (!shift) {
            return res.status(404).json({ error: 'Tidak ada shift yang terbuka' });
        }

        // Calculate expected balance
        const cashPayments = await db.get(
            `SELECT COALESCE(SUM(p.amount), 0) as total
             FROM payments p
             JOIN transactions t ON p.transaction_id = t.id
             WHERE t.shift_id = ? AND t.status = 'completed' AND p.payment_method = 'cash'`,
            [shift.id]
        );

        const expected_balance = shift.opening_balance + (cashPayments?.total || 0);
        const difference = closing_balance - expected_balance;

        await db.run(
            `UPDATE shifts 
             SET closing_balance = ?, expected_balance = ?, difference = ?, 
                 closed_at = CURRENT_TIMESTAMP, notes = ?
             WHERE id = ?`,
            [closing_balance, expected_balance, difference, notes || shift.notes, shift.id]
        );

        // Get shift summary
        const summary = await db.get(
            `SELECT 
                COUNT(t.id) as total_transactions,
                COALESCE(SUM(t.total), 0) as total_sales
             FROM transactions t
             WHERE t.shift_id = ? AND t.status = 'completed'`,
            [shift.id]
        );

        res.json({ 
            message: 'Shift berhasil ditutup',
            summary: {
                opening_balance: shift.opening_balance,
                closing_balance,
                expected_balance,
                difference,
                total_transactions: summary.total_transactions,
                total_sales: summary.total_sales
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Get shift history
router.get('/history', auth, async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const shifts = await db.query(
            `SELECT s.*, u.full_name as cashier_name,
                    COUNT(t.id) as total_transactions,
                    COALESCE(SUM(t.total), 0) as total_sales
             FROM shifts s
             LEFT JOIN users u ON s.user_id = u.id
             LEFT JOIN transactions t ON s.id = t.shift_id AND t.status = 'completed'
             WHERE s.closed_at IS NOT NULL
             GROUP BY s.id
             ORDER BY s.closed_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
