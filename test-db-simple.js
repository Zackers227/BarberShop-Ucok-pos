const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function testConnection() {
  console.log('Testing database connection to Supabase...');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
  });

  try {
    console.log('\n1. Connecting to database...');
    const result = await pool.query('SELECT NOW(), current_database()');
    console.log('✅ Connection successful!');
    console.log('   Current time:', result.rows[0].now);
    console.log('   Database:', result.rows[0].current_database);

    console.log('\n2. Testing users table...');
    const userResult = await pool.query('SELECT id, username, full_name, role FROM users LIMIT 5');
    console.log('✅ Users found:', userResult.rows.length);
    userResult.rows.forEach(user => {
      console.log(`   - ${user.username} (${user.full_name}) - ${user.role}`);
    });

    console.log('\n3. Testing admin user...');
    const adminResult = await pool.query(`SELECT id, username, full_name, role, password FROM users WHERE username = 'admin'`);
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user found!');
      console.log('   Username:', adminResult.rows[0].username);
      console.log('   Full name:', adminResult.rows[0].full_name);
      console.log('   Role:', adminResult.rows[0].role);
      console.log('   Password hash:', adminResult.rows[0].password.substring(0, 20) + '...');
    } else {
      console.log('❌ Admin user NOT found!');
    }

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
  } finally {
    await pool.end();
    console.log('\nConnection closed.');
  }
}

testConnection();
