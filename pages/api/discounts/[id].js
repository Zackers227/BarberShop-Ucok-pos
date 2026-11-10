const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM discounts WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Diskon tidak ditemukan' });
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { name, type, value, min_purchase, valid_from, valid_until, description, is_active } = req.body;

      const result = await query(
        `UPDATE discounts 
         SET name = $1, type = $2, value = $3, min_purchase = $4, valid_from = $5, valid_until = $6, description = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [name, type, value, min_purchase, valid_from, valid_until, description, is_active !== undefined ? is_active : true, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Diskon tidak ditemukan' });
      }

      return res.status(200).json({
        message: 'Diskon berhasil diupdate',
        data: result.rows[0]
      });
    }

    if (req.method === 'DELETE') {
      const result = await query(
        'UPDATE discounts SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Diskon tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Diskon berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Discount API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
