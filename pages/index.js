import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#2c3e50'
    }}>
      <Head>
        <title>Barbershop Ucok - POS System</title>
      </Head>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1>🚀 Loading...</h1>
      </div>
    </div>
  );
}
