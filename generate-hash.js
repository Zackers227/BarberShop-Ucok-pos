const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n🔐 Password Hash Generator\n');
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
  console.log('SQL Query untuk update password:\n');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';\n`);
  
  // Test verify
  const isValid = await bcrypt.compare(password, hash);
  console.log(`✅ Verification test: ${isValid ? 'VALID' : 'INVALID'}\n`);
}

generateHash().catch(console.error);
