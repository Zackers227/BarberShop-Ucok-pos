const { withAuth } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // User sudah di-attach oleh middleware withAuth
    res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
