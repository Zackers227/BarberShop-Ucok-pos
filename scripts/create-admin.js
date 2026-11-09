// Script untuk membuat admin baru
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dbPath = path.join(__dirname, '../database/pos.db');
const db = new sqlite3.Database(dbPath);

async function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function createAdmin() {
    console.log('\n🔐 Buat Admin Baru\n');

    const username = await prompt('Username: ');
    const fullName = await prompt('Nama Lengkap: ');
    const password = await prompt('Password: ');
    const role = await prompt('Role (kasir/owner) [owner]: ') || 'owner';

    if (!username || !fullName || !password) {
        console.log('❌ Semua field harus diisi!');
        rl.close();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, fullName, role],
        function(err) {
            if (err) {
                console.error('❌ Error:', err.message);
            } else {
                console.log(`\n✅ Admin berhasil dibuat!`);
                console.log(`   Username: ${username}`);
                console.log(`   Role: ${role}`);
            }
            
            db.close();
            rl.close();
        }
    );
}

createAdmin();
