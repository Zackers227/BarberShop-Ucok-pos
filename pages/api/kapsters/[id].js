const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM kapsters WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Kapster tidak ditemukan' });
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { name, phone, commission_percentage, address, is_active } = req.body;

      const result = await query(
        `UPDATE kapsters 
         SET name = $1, phone = $2, commission_percentage = $3, address = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [name, phone, commission_percentage, address, is_active !== undefined ? is_active : true, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Kapster tidak ditemukan' });
      }

      return res.status(200).json({
        message: 'Kapster berhasil diupdate',
        data: result.rows[0]
      });
    }

    if (req.method === 'DELETE') {
      const result = await query(
        'UPDATE kapsters SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Kapster tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Kapster berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Kapster API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
