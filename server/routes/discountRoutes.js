const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get all active discounts
router.get('/', auth, async (req, res) => {
    try {
        const discounts = await db.query(
            `SELECT * FROM discounts 
             WHERE is_active = 1 
             AND (valid_from IS NULL OR DATE(valid_from) <= DATE('now'))
             AND (valid_until IS NULL OR DATE(valid_until) >= DATE('now'))
             ORDER BY name`
        );
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Validate discount code
router.post('/validate', auth, async (req, res) => {
    try {
        const { code, transaction_total } = req.body;
        
        const discount = await db.get(
            `SELECT * FROM discounts 
             WHERE code = ? 
             AND is_active = 1
             AND (valid_from IS NULL OR DATE(valid_from) <= DATE('now'))
             AND (valid_until IS NULL OR DATE(valid_until) >= DATE('now'))
             AND (max_usage IS NULL OR usage_count < max_usage)`,
            [code]
        );

        if (!discount) {
            return res.status(404).json({ error: 'Kode diskon tidak valid atau sudah kadaluarsa' });
        }

        if (discount.min_transaction && transaction_total < discount.min_transaction) {
            return res.status(400).json({ 
                error: `Minimal transaksi untuk diskon ini adalah Rp ${discount.min_transaction.toLocaleString('id-ID')}` 
            });
        }

        // Calculate discount amount
        let discount_amount = 0;
        if (discount.type === 'percentage') {
            discount_amount = transaction_total * (discount.value / 100);
            if (discount.max_discount && discount_amount > discount.max_discount) {
                discount_amount = discount.max_discount;
            }
        } else {
            discount_amount = discount.value;
        }

        res.json({
            valid: true,
            discount,
            discount_amount
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Create discount
router.post('/', auth, async (req, res) => {
    try {
        const { code, name, type, value, min_transaction, max_discount, valid_from, valid_until, max_usage } = req.body;
        
        const result = await db.run(
            `INSERT INTO discounts (code, name, type, value, min_transaction, max_discount, valid_from, valid_until, max_usage) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, name, type, value, min_transaction || 0, max_discount || null, 
             valid_from || null, valid_until || null, max_usage || null]
        );

        res.status(201).json({ 
            message: 'Diskon berhasil ditambahkan',
            id: result.id 
        });
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Kode diskon sudah digunakan' });
        }
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
