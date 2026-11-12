const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load .env
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

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
  console.log('🔄 Running permissions migration...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('supabase') ? {
      rejectUnauthorized: false
    } : false,
  });

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'database', 'add-permissions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📋 Executing SQL migration...');
    await pool.query(sql);
    
    console.log('✅ Permissions table created successfully!');
    console.log('✅ Default permissions granted to existing users!');
    
    // Verify
    const result = await pool.query('SELECT COUNT(*) as count FROM user_permissions');
    console.log(`\n📊 Total permissions: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Migration failed!');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
