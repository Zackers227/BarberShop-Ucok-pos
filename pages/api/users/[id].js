const { withAuth, hashPassword } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  // Only OWNER can access this endpoint
  if (req.user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Akses ditolak. Hanya Owner yang dapat mengelola user.' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query(
        'SELECT id, username, full_name, role, is_active, created_at FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { password, full_name, role, is_active } = req.body;

      // Build update query dynamically
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (password) {
        const hashedPassword = await hashPassword(password);
        updates.push(`password = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      }

      if (full_name) {
        updates.push(`full_name = $${paramCount}`);
        values.push(full_name);
        paramCount++;
      }

      if (role) {
        updates.push(`role = $${paramCount}`);
        values.push(role);
        paramCount++;
      }

      if (is_active !== undefined) {
        updates.push(`is_active = $${paramCount}`);
        values.push(is_active);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Tidak ada data yang diupdate' });
      }

      values.push(id);
      const result = await query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
         RETURNING id, username, full_name, role, is_active, created_at`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Prevent deleting self
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri' });
      }

      const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      return res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = withAuth(handler, { roles: ['OWNER'] });
