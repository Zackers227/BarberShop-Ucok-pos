const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get all services
router.get('/', auth, async (req, res) => {
    try {
        const services = await db.query('SELECT * FROM services WHERE is_active = 1 ORDER BY name');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Get service by id
router.get('/:id', auth, async (req, res) => {
    try {
        const service = await db.get('SELECT * FROM services WHERE id = ?', [req.params.id]);
        if (!service) {
            return res.status(404).json({ error: 'Layanan tidak ditemukan' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Create service
router.post('/', auth, async (req, res) => {
    try {
        const { name, price, duration, description } = req.body;
        
        const result = await db.run(
            'INSERT INTO services (name, price, duration, description) VALUES (?, ?, ?, ?)',
            [name, price, duration || 30, description || null]
        );

        res.status(201).json({ 
            message: 'Layanan berhasil ditambahkan',
            id: result.id 
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Update service
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, price, duration, description, is_active } = req.body;
        
        await db.run(
            `UPDATE services 
             SET name = ?, price = ?, duration = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, price, duration, description, is_active !== undefined ? is_active : 1, req.params.id]
        );

        res.json({ message: 'Layanan berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Delete service (soft delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.run('UPDATE services SET is_active = 0 WHERE id = ?', [req.params.id]);
        res.json({ message: 'Layanan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
