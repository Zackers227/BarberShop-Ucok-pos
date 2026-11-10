const { query } = require('../../../lib/db');
const { generateToken, comparePassword } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    console.log('[LOGIN] Request received:', { username });

    // Validasi input
    if (!username || !password) {
      console.log('[LOGIN] Validation failed: missing credentials');
      return res.status(400).json({ error: 'Username dan password harus diisi' });
    }

    // Cari user
    console.log('[LOGIN] Querying user from database...');
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    console.log('[LOGIN] Query result:', { rowCount: result.rows.length });

    if (result.rows.length === 0) {
      console.log('[LOGIN] User not found');
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const user = result.rows[0];
    console.log('[LOGIN] User found:', { id: user.id, username: user.username, role: user.role, is_active: user.is_active });

    // Check status aktif
    if (!user.is_active) {
      console.log('[LOGIN] User inactive');
      return res.status(401).json({ error: 'Akun tidak aktif' });
    }

    // Verify password
    console.log('[LOGIN] Verifying password...');
    const isValidPassword = await comparePassword(password, user.password);
    console.log('[LOGIN] Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('[LOGIN] Invalid password');
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Generate token
    console.log('[LOGIN] Generating token...');
    const token = generateToken(user.id, user.username, user.role);

    // Log activity
    console.log('[LOGIN] Logging activity...');
    await query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES ($1, $2, $3)',
      [user.id, 'login', `User ${user.username} berhasil login`]
    );

    console.log('[LOGIN] Login successful!');

    // Return user data tanpa password
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    console.error('[LOGIN] Error stack:', error.stack);
    res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
  }
}
