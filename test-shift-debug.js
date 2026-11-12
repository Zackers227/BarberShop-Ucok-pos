const { Pool } = require('pg');

// Direct connection string
const DATABASE_URL = 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debugShifts() {
  try {
    console.log('🔍 Debugging Shifts...\n');

    // Check all shifts for user_id = 1 (admin)
    console.log('📊 All shifts for user_id = 1:');
    const allShifts = await pool.query(
      'SELECT id, user_id, opening_balance, closing_balance, opened_at, closed_at FROM shifts WHERE user_id = 1 ORDER BY id DESC LIMIT 10'
    );
    console.table(allShifts.rows);

    // Check open shifts
    console.log('\n🔓 Open shifts (closed_at IS NULL):');
    const openShifts = await pool.query(
      'SELECT id, user_id, opening_balance, opened_at, closed_at FROM shifts WHERE user_id = 1 AND closed_at IS NULL'
    );
    console.table(openShifts.rows);

    if (openShifts.rows.length > 0) {
      console.log('\n⚠️  Found open shift(s)! This is why you cannot open a new shift.');
      console.log('To fix manually, run:');
      console.log(`UPDATE shifts SET closed_at = CURRENT_TIMESTAMP WHERE id = ${openShifts.rows[0].id};`);
    } else {
      console.log('\n✅ No open shifts found. You should be able to open a new shift.');
    }

    // Check total number of shifts
    const total = await pool.query('SELECT COUNT(*) as total FROM shifts');
    console.log(`\n📈 Total shifts in database: ${total.rows[0].total}`);

    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
  }
}

debugShifts();
