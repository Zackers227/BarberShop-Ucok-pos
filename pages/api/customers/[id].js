const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM customers WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Customer tidak ditemukan' });
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { name, phone, email, address, notes } = req.body;

      const result = await query(
        `UPDATE customers 
         SET name = $1, phone = $2, email = $3, address = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [name, phone, email, address, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Customer tidak ditemukan' });
      }

      return res.status(200).json({
        message: 'Customer berhasil diupdate',
        data: result.rows[0]
      });
    }

    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Customer tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Customer berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Customer API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
