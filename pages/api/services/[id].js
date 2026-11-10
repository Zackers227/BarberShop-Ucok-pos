const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Get service by id
      const result = await query('SELECT * FROM services WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Layanan tidak ditemukan' });
      }

      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      // Update service
      const { name, price, duration, description, is_active } = req.body;

      const result = await query(
        `UPDATE services 
         SET name = $1, price = $2, duration = $3, description = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [name, price, duration, description, is_active !== undefined ? is_active : true, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Layanan tidak ditemukan' });
      }

      return res.status(200).json({
        message: 'Layanan berhasil diupdate',
        data: result.rows[0]
      });
    }

    if (req.method === 'DELETE') {
      // Soft delete
      const result = await query(
        'UPDATE services SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Layanan tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Layanan berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Service API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
