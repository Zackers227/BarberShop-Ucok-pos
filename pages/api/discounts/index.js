const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM discounts WHERE is_active = true ORDER BY name'
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, type, value, min_purchase, valid_from, valid_until, description } = req.body;

      if (!name || !type || !value) {
        return res.status(400).json({ error: 'Nama, tipe, dan nilai harus diisi' });
      }

      const result = await query(
        `INSERT INTO discounts (name, type, value, min_purchase, valid_from, valid_until, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, type, value, min_purchase || 0, valid_from || null, valid_until || null, description || null]
      );

      return res.status(201).json({
        message: 'Diskon berhasil ditambahkan',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Discounts API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
