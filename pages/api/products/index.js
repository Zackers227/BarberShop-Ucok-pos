const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM products WHERE is_active = true ORDER BY name'
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, sku, price, stock, min_stock, description } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: 'Nama dan harga harus diisi' });
      }

      const result = await query(
        'INSERT INTO products (name, sku, price, stock, min_stock, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, sku || null, price, stock || 0, min_stock || 5, description || null]
      );

      return res.status(201).json({
        message: 'Produk berhasil ditambahkan',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
