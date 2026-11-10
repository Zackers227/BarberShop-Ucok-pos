import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  if (checking) {
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

  return null;
}
