const jwt = require('jsonwebtoken');
const { query } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'barbershop-ucok-secret-key-2024';

// Middleware untuk Next.js API routes
function withAuth(handler, options = {}) {
  return async (req, res) => {
    try {
      // Get token dari header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ditemukan' });
      }

      const token = authHeader.substring(7);
      
      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Token tidak valid' });
      }

      // Get user dari database
      const result = await query(
        'SELECT id, username, name, role, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'User tidak ditemukan' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(401).json({ error: 'User tidak aktif' });
      }

      // Check role jika diperlukan
      if (options.roles && !options.roles.includes(user.role)) {
        return res.status(403).json({ error: 'Akses ditolak' });
      }

      // Attach user ke request
      req.user = user;

      // Call handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  };
}

// Helper untuk generate token
function generateToken(userId, username, role) {
  return jwt.sign(
    { userId, username, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Helper untuk hash password
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  withAuth,
  generateToken,
  hashPassword,
  comparePassword,
  JWT_SECRET
};
