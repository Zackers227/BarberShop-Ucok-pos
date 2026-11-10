const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all services
      const result = await query(
        'SELECT * FROM services WHERE is_active = true ORDER BY name'
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      // Create service
      const { name, price, duration, description } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: 'Nama dan harga harus diisi' });
      }

      const result = await query(
        'INSERT INTO services (name, price, duration, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, price, duration || 30, description || null]
      );

      return res.status(201).json({
        message: 'Layanan berhasil ditambahkan',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Services API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
