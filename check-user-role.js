const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function checkUsers() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Checking users and roles...\n');
    
    const result = await pool.query('SELECT id, username, full_name, role FROM users');
    
    console.log('Users in database:');
    result.rows.forEach(user => {
      console.log(`  ID: ${user.id}, Username: ${user.username}, Name: ${user.full_name}, Role: "${user.role}"`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsers();
