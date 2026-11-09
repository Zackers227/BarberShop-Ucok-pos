const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL tidak ditemukan!');
    console.log('Set environment variable DATABASE_URL atau POSTGRES_URL');
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

console.log('🔄 Memulai migrasi PostgreSQL...');

const schemaPath = path.join(__dirname, 'schema-pg.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

pool.query(schema)
    .then(() => {
        console.log('✅ Migrasi PostgreSQL berhasil! Semua tabel telah dibuat.');
        return pool.end();
    })
    .then(() => {
        console.log('✅ Koneksi database ditutup.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error menjalankan migrasi:', err.message);
        pool.end();
        process.exit(1);
    });
