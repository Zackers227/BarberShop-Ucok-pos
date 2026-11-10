async function testLogin() {
  const url = 'https://barber-shop-ucok-pos.vercel.app/api/auth/login';
  
  const payload = {
    username: 'admin',
    password: 'admin123'
  };

  console.log('\n🔐 Testing Login API...\n');
  console.log(`URL: ${url}`);
  console.log(`Payload: ${JSON.stringify(payload, null, 2)}\n`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ LOGIN BERHASIL!');
      console.log(`Token: ${data.token.substring(0, 50)}...`);
      console.log(`User: ${data.user.username} (${data.user.role})`);
    } else {
      console.log('\n❌ LOGIN GAGAL!');
      console.log(`Error: ${data.error}`);
    }
  } catch (error) {
    console.log('\n❌ REQUEST ERROR!');
    console.log(`Error: ${error.message}`);
  }
}

testLogin().catch(console.error);
