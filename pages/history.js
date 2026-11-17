import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function History() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Riwayat - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <Layout activePage="history">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
            Riwayat
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Riwayat transaksi dan aktivitas barbershop
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#333' }}>
            📜 Riwayat Transaksi
          </h2>
          
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#999'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📋</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600', color: '#333' }}>Halaman Riwayat</p>
            <p style={{ fontSize: '0.9rem' }}>
              Daftar riwayat transaksi akan ditampilkan di sini.<br/>
              Sidebar (kotak biru) dan navbar tetap konsisten.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
