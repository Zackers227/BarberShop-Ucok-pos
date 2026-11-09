// Script untuk reset password user
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

async function resetPassword() {
    console.log('\n🔑 Reset Password User\n');

    const username = await prompt('Username: ');
    const newPassword = await prompt('Password Baru: ');

    if (!username || !newPassword) {
        console.log('❌ Username dan password harus diisi!');
        rl.close();
        return;
    }

    // Cek user exist
    db.get('SELECT id, full_name FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('❌ Error:', err.message);
            db.close();
            rl.close();
            return;
        }

        if (!user) {
            console.log('❌ User tidak ditemukan!');
            db.close();
            rl.close();
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.run(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?',
            [hashedPassword, username],
            function(err) {
                if (err) {
                    console.error('❌ Error:', err.message);
                } else {
                    console.log(`\n✅ Password berhasil direset!`);
                    console.log(`   User: ${user.full_name} (${username})`);
                }
                
                db.close();
                rl.close();
            }
        );
    });
}

resetPassword();
