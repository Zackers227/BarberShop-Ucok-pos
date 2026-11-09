const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const { low_stock } = req.query;
        
        let sql = 'SELECT * FROM products WHERE is_active = 1';
        
        if (low_stock === 'true') {
            sql += ' AND stock <= min_stock';
        }
        
        sql += ' ORDER BY name';
        
        const products = await db.query(sql);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Get product by id
router.get('/:id', auth, async (req, res) => {
    try {
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!product) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Create product
router.post('/', auth, async (req, res) => {
    try {
        const { name, sku, purchase_price, selling_price, stock, min_stock, unit, description } = req.body;
        
        const result = await db.run(
            `INSERT INTO products (name, sku, purchase_price, selling_price, stock, min_stock, unit, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, sku || null, purchase_price || 0, selling_price, stock || 0, min_stock || 5, unit || 'pcs', description || null]
        );

        res.status(201).json({ 
            message: 'Produk berhasil ditambahkan',
            id: result.id 
        });
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'SKU sudah digunakan' });
        }
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Update product
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, sku, purchase_price, selling_price, stock, min_stock, unit, description, is_active } = req.body;
        
        await db.run(
            `UPDATE products 
             SET name = ?, sku = ?, purchase_price = ?, selling_price = ?, stock = ?, 
                 min_stock = ?, unit = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, sku, purchase_price, selling_price, stock, min_stock, unit, description, 
             is_active !== undefined ? is_active : 1, req.params.id]
        );

        res.json({ message: 'Produk berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Adjust stock
router.post('/:id/adjust-stock', auth, async (req, res) => {
    try {
        const { quantity, type, notes } = req.body; // type: 'in' or 'out'
        
        await db.run('BEGIN TRANSACTION');
        
        try {
            // Update stock
            if (type === 'in') {
                await db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, req.params.id]);
            } else {
                await db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, req.params.id]);
            }

            // Log history
            await db.run(
                `INSERT INTO stock_history (product_id, type, quantity, notes, user_id) 
                 VALUES (?, ?, ?, ?, ?)`,
                [req.params.id, type === 'in' ? 'in' : 'out', quantity, notes || null, req.user.id]
            );

            await db.run('COMMIT');
            
            res.json({ message: 'Stok berhasil disesuaikan' });
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
