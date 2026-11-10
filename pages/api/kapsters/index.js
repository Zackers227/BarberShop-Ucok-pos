const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM kapsters WHERE is_active = true ORDER BY name'
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, phone, commission_percentage, address } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nama harus diisi' });
      }

      const result = await query(
        'INSERT INTO kapsters (name, phone, commission_percentage, address) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, phone || null, commission_percentage || 0, address || null]
      );

      return res.status(201).json({
        message: 'Kapster berhasil ditambahkan',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Kapsters API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
