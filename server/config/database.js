// Database configuration - Auto-switch between SQLite and PostgreSQL
const useSQLite = !process.env.DATABASE_URL && !process.env.POSTGRES_URL;

if (useSQLite) {
    console.log('📂 Using SQLite database (local)');
    module.exports = require('./database-sqlite');
} else {
    console.log('🐘 Using PostgreSQL database (online)');
    module.exports = require('./database-pg');
}

