const { withAuth, hashPassword } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  // Only OWNER can access this endpoint
  if (req.user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Akses ditolak. Hanya Owner yang dapat mengelola user.' });
  }

  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT id, username, full_name, role, is_active, created_at 
         FROM users 
         ORDER BY created_at DESC`
      );

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { username, password, full_name, role, is_active } = req.body;

      // Validation
      if (!username || !password || !full_name || !role) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
      }

      // Check if username already exists
      const existingUser = await query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username sudah digunakan' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Insert new user
      const result = await query(
        `INSERT INTO users (username, password, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, full_name, role, is_active, created_at`,
        [username, hashedPassword, full_name, role, is_active !== false]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = withAuth(handler, { roles: ['OWNER'] });
