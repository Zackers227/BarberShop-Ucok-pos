const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT id, name, sku, selling_price as price, stock, min_stock, unit, description, is_active FROM products WHERE id = $1', 
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { name, sku, price, stock, min_stock, description, is_active } = req.body;

      const result = await query(
        `UPDATE products 
         SET name = $1, sku = $2, selling_price = $3, stock = $4, min_stock = $5, description = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING id, name, sku, selling_price as price, stock, min_stock, description, is_active`,
        [name, sku, price, stock, min_stock, description, is_active !== undefined ? is_active : true, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      return res.status(200).json({
        message: 'Produk berhasil diupdate',
        data: result.rows[0]
      });
    }

    if (req.method === 'DELETE') {
      const result = await query(
        'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Produk berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Product API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
