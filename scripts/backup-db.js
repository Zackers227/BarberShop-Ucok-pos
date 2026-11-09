// Script untuk backup database
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/pos.db');
const backupDir = path.join(__dirname, '../backup');

// Buat folder backup jika belum ada
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Generate filename dengan timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                  now.toTimeString().split(' ')[0].replace(/:/g, '-');
const backupPath = path.join(backupDir, `pos_backup_${timestamp}.db`);

// Copy database
try {
    fs.copyFileSync(dbPath, backupPath);
    console.log('✅ Backup berhasil!');
    console.log(`   File: ${backupPath}`);
    
    // Tampilkan ukuran file
    const stats = fs.statSync(backupPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   Size: ${fileSizeInMB} MB`);
    
    // List semua backup
    const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.db'));
    console.log(`\n📦 Total backups: ${backups.length}`);
    
    // Hapus backup lama (simpan 10 terbaru)
    if (backups.length > 10) {
        backups.sort().slice(0, backups.length - 10).forEach(file => {
            fs.unlinkSync(path.join(backupDir, file));
            console.log(`🗑️  Hapus backup lama: ${file}`);
        });
    }
    
} catch (error) {
    console.error('❌ Backup gagal:', error.message);
    process.exit(1);
}
