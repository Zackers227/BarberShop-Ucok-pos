const { Pool } = require('pg');

// Test dengan password baru dari Supabase
// Connection Pooler (recommended for Vercel)
const connectionString3 = 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

// Transaction Pooler
const connectionString4 = 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

// Test jika user hanya "postgres" (tanpa .xxx)
const connectionString5 = 'postgresql://postgres:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const connectionString6 = 'postgresql://postgres:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function testConnection(connString, label) {
  const pool = new Pool({
    connectionString: connString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT NOW(), COUNT(*) as user_count FROM users');
    console.log(`✅ ${label} BERHASIL!`);
    console.log(`   Server time: ${result.rows[0].now}`);
    console.log(`   User count: ${result.rows[0].user_count}`);
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ ${label} GAGAL!`);
    console.log(`   Error: ${error.message}`);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('\n🔍 Testing database connections with NEW password...\n');
  
  const test3 = await testConnection(connectionString3, 'Pooler :6543 (postgres.xxx)');
  console.log('');
  const test4 = await testConnection(connectionString4, 'Pooler :5432 (postgres.xxx)');
  console.log('');
  const test5 = await testConnection(connectionString5, 'Pooler :6543 (postgres)');
  console.log('');
  const test6 = await testConnection(connectionString6, 'Pooler :5432 (postgres)');
  
  console.log('\n📊 HASIL:');
  if (test3) {
    console.log('✅ GUNAKAN INI untuk Vercel:');
    console.log(`   ${connectionString3}`);
  } else if (test4) {
    console.log('✅ GUNAKAN INI untuk Vercel:');
    console.log(`   ${connectionString4}`);
  } else if (test5) {
    console.log('✅ GUNAKAN INI untuk Vercel:');
    console.log(`   ${connectionString5}`);
  } else if (test6) {
    console.log('✅ GUNAKAN INI untuk Vercel:');
    console.log(`   ${connectionString6}`);
  } else {
    console.log('❌ Semua connection string masih gagal!');
    console.log('   Password mungkin belum tersimpan, coba refresh Supabase dashboard.');
  }
}

main().catch(console.error);
