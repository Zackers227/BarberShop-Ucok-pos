const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get all customers
router.get('/', auth, async (req, res) => {
    try {
        const { search } = req.query;
        
        let sql = 'SELECT * FROM customers WHERE 1=1';
        const params = [];
        
        if (search) {
            sql += ' AND (name LIKE ? OR phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        sql += ' ORDER BY name';
        
        const customers = await db.query(sql, params);
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Get customer by id with history
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await db.get('SELECT * FROM customers WHERE id = ?', [req.params.id]);
        
        if (!customer) {
            return res.status(404).json({ error: 'Pelanggan tidak ditemukan' });
        }

        // Get transaction history
        const transactions = await db.query(
            `SELECT t.*, k.name as kapster_name
             FROM transactions t
             LEFT JOIN kapsters k ON t.kapster_id = k.id
             WHERE t.customer_id = ? AND t.status = 'completed'
             ORDER BY t.created_at DESC
             LIMIT 10`,
            [req.params.id]
        );

        res.json({
            ...customer,
            transactions
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Create customer
router.post('/', auth, async (req, res) => {
    try {
        const { name, phone, email, gender, birth_date, address, notes, is_member } = req.body;
        
        const result = await db.run(
            `INSERT INTO customers (name, phone, email, gender, birth_date, address, notes, is_member, member_since) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, phone || null, email || null, gender || null, birth_date || null, 
             address || null, notes || null, is_member || 0, is_member ? new Date().toISOString().split('T')[0] : null]
        );

        res.status(201).json({ 
            message: 'Pelanggan berhasil ditambahkan',
            id: result.id 
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, phone, email, gender, birth_date, address, notes, is_member } = req.body;
        
        // Get current customer
        const current = await db.get('SELECT is_member FROM customers WHERE id = ?', [req.params.id]);
        
        let member_since = null;
        if (is_member && !current.is_member) {
            // Baru jadi member
            member_since = new Date().toISOString().split('T')[0];
        }
        
        const sql = member_since 
            ? `UPDATE customers 
               SET name = ?, phone = ?, email = ?, gender = ?, birth_date = ?, address = ?, 
                   notes = ?, is_member = ?, member_since = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`
            : `UPDATE customers 
               SET name = ?, phone = ?, email = ?, gender = ?, birth_date = ?, address = ?, 
                   notes = ?, is_member = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`;
        
        const params = member_since
            ? [name, phone, email, gender, birth_date, address, notes, is_member, member_since, req.params.id]
            : [name, phone, email, gender, birth_date, address, notes, is_member, req.params.id];
        
        await db.run(sql, params);

        res.json({ message: 'Pelanggan berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
