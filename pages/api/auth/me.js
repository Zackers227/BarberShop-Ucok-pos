const { withAuth } = require('../../../lib/auth');
const { query } = require('../../../lib/db');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user permissions
    const permissionsResult = await query(
      'SELECT permission FROM user_permissions WHERE user_id = $1',
      [req.user.id]
    );

    // User sudah di-attach oleh middleware withAuth
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      full_name: req.user.full_name,
      role: req.user.role,
      permissions: permissionsResult.rows.map(row => row.permission)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
