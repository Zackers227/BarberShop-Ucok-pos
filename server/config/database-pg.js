// PostgreSQL Database Configuration
const { Pool } = require('pg');

let pool = null;

function initializePool() {
    if (pool) return pool;

    // Bisa pakai environment variables atau connection string langsung
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (connectionString) {
        // Untuk deployment (Heroku, Railway, Render, dll)
        pool = new Pool({
            connectionString: connectionString,
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false
        });
    } else {
        // Manual configuration
        pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'ininotes_pos',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            ssl: process.env.DB_SSL === 'true' ? {
                rejectUnauthorized: false
            } : false,
            max: 20, // Maximum pool connections
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }

    pool.on('error', (err) => {
        console.error('❌ Unexpected database error:', err);
    });

    return pool;
}

class DatabasePG {
    constructor() {
        this.pool = initializePool();
        console.log('✅ PostgreSQL pool initialized');
    }

    // Query dengan promise (returns all rows)
    async query(sql, params = []) {
        const client = await this.pool.connect();
        try {
            // Convert SQLite placeholders (?) to PostgreSQL ($1, $2, etc)
            let pgSql = sql;
            let pgParams = params;
            
            if (sql.includes('?')) {
                let paramIndex = 1;
                pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
            }

            const result = await client.query(pgSql, pgParams);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Get single row
    async get(sql, params = []) {
        const rows = await this.query(sql, params);
        return rows[0] || null;
    }

    // Run (INSERT, UPDATE, DELETE)
    async run(sql, params = []) {
        const client = await this.pool.connect();
        try {
            // Convert SQLite placeholders to PostgreSQL
            let pgSql = sql;
            let paramIndex = 1;
            
            if (sql.includes('?')) {
                pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
            }

            // Handle RETURNING for INSERT (to get lastID)
            if (pgSql.toUpperCase().includes('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
                pgSql += ' RETURNING id';
            }

            const result = await client.query(pgSql, params);
            
            return {
                id: result.rows[0]?.id || null,
                changes: result.rowCount || 0
            };
        } finally {
            client.release();
        }
    }

    // Transaction
    async transaction(callback) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            await callback(client);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Close pool
    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('PostgreSQL pool closed');
        }
    }

    // Test connection
    async testConnection() {
        try {
            const result = await this.query('SELECT NOW() as time');
            console.log('✅ PostgreSQL connection successful:', result[0].time);
            return true;
        } catch (error) {
            console.error('❌ PostgreSQL connection failed:', error.message);
            return false;
        }
    }
}

module.exports = new DatabasePG();
