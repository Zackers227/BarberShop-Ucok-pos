const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM customers ORDER BY name'
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, phone, email, address, notes } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nama harus diisi' });
      }

      const result = await query(
        'INSERT INTO customers (name, phone, email, address, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, phone || null, email || null, address || null, notes || null]
      );

      return res.status(201).json({
        message: 'Customer berhasil ditambahkan',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Customers API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
