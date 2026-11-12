const { Pool } = require('pg');

// Direct connection string
const DATABASE_URL = 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixOrphanedShift() {
  try {
    console.log('🔧 Fixing orphaned shift...\n');

    // Find open shifts
    const openShifts = await pool.query(
      'SELECT id, user_id, opening_balance, opened_at FROM shifts WHERE closed_at IS NULL'
    );

    if (openShifts.rows.length === 0) {
      console.log('✅ No orphaned shifts found!');
      pool.end();
      return;
    }

    console.log(`Found ${openShifts.rows.length} open shift(s):`);
    console.table(openShifts.rows);

    // Close all orphaned shifts
    for (const shift of openShifts.rows) {
      console.log(`\n🔒 Closing shift #${shift.id}...`);
      
      // Get transaction stats for this shift
      const stats = await pool.query(
        `SELECT 
           COUNT(*) as total_transactions,
           COALESCE(SUM(total), 0) as total_sales
         FROM transactions
         WHERE shift_id = $1 AND status = 'completed'`,
        [shift.id]
      );

      const totalSales = parseFloat(stats.rows[0].total_sales) || 0;
      const openingBalance = parseFloat(shift.opening_balance) || 0;
      const expectedBalance = openingBalance + totalSales;

      // Close the shift with expected balance as closing balance (no difference)
      await pool.query(
        `UPDATE shifts
         SET closed_at = CURRENT_TIMESTAMP,
             closing_balance = $1,
             expected_balance = $2,
             difference = 0,
             notes = COALESCE(notes || ' | ', '') || 'Auto-closed by system'
         WHERE id = $3`,
        [expectedBalance, expectedBalance, shift.id]
      );

      console.log(`✅ Shift #${shift.id} closed successfully`);
      console.log(`   Opening: Rp ${openingBalance.toLocaleString()}`);
      console.log(`   Sales: Rp ${totalSales.toLocaleString()}`);
      console.log(`   Closing: Rp ${expectedBalance.toLocaleString()}`);
    }

    console.log('\n✅ All orphaned shifts have been closed!');
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
  }
}

fixOrphanedShift();
