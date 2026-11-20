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
    return null; // Remove loading screen
  }

  return null;
}
