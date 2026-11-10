const { query } = require('../../lib/db');

export default async function handler(req, res) {
  try {
    // Test database connection
    const result = await query('SELECT NOW() as now, COUNT(*) as user_count FROM users');
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        serverTime: result.rows[0].now,
        userCount: result.rows[0].user_count
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
  }
}
