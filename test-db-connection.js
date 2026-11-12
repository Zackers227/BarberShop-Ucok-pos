const fs = require('fs');
const path = require('path');

// Manual load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const { Pool } = require('pg');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
  
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set!');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('supabase') ? {
      rejectUnauthorized: false
    } : false,
  });

  try {
    console.log('\nConnecting to database...');
    const result = await pool.query('SELECT NOW(), current_database()');
    console.log('✅ Connection successful!');
    console.log('Current time:', result.rows[0].now);
    console.log('Database:', result.rows[0].current_database);

    console.log('\nTesting users table...');
    const userResult = await pool.query('SELECT id, username, full_name, role FROM users LIMIT 3');
    console.log('✅ Users found:', userResult.rows.length);
    userResult.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.full_name}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
