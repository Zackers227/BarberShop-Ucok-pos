const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'pos.db');
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('🔄 Memulai migrasi database...');

// Buat database baru
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error membuat database:', err.message);
        process.exit(1);
    }
    console.log('✅ Database terhubung:', dbPath);
});

// Baca schema SQL
const schema = fs.readFileSync(schemaPath, 'utf8');

// Eksekusi schema
db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error menjalankan migrasi:', err.message);
        db.close();
        process.exit(1);
    }
    
    console.log('✅ Migrasi berhasil! Semua tabel telah dibuat.');
    
    // Tutup koneksi
    db.close((err) => {
        if (err) {
            console.error('❌ Error menutup database:', err.message);
        } else {
            console.log('✅ Koneksi database ditutup.');
        }
    });
});
