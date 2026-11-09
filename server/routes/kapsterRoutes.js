const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get all kapsters
router.get('/', auth, async (req, res) => {
    try {
        const kapsters = await db.query('SELECT * FROM kapsters WHERE is_active = 1 ORDER BY name');
        res.json(kapsters);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Get kapster by id
router.get('/:id', auth, async (req, res) => {
    try {
        const kapster = await db.get('SELECT * FROM kapsters WHERE id = ?', [req.params.id]);
        if (!kapster) {
            return res.status(404).json({ error: 'Kapster tidak ditemukan' });
        }
        res.json(kapster);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Create kapster
router.post('/', auth, async (req, res) => {
    try {
        const { name, phone, commission_percentage } = req.body;
        
        const result = await db.run(
            'INSERT INTO kapsters (name, phone, commission_percentage) VALUES (?, ?, ?)',
            [name, phone || null, commission_percentage || 0]
        );

        res.status(201).json({ 
            message: 'Kapster berhasil ditambahkan',
            id: result.id 
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Update kapster
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, phone, commission_percentage, is_active } = req.body;
        
        await db.run(
            `UPDATE kapsters 
             SET name = ?, phone = ?, commission_percentage = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, phone, commission_percentage, is_active !== undefined ? is_active : 1, req.params.id]
        );

        res.json({ message: 'Kapster berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
