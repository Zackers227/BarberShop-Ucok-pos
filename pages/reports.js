import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Reports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Laporan - Barbershop Ucok POS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>

      <Layout activePage="reports">
        {/* Page Content */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
            Laporan
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Laporan penjualan dan keuangan barbershop
          </p>
        </div>

        {/* Sample Content - Replace with actual reports */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#333' }}>
            📊 Laporan Penjualan
          </h2>
          
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#999'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📈</div>
            <p style={{ fontSize: '1.1rem' }}>Halaman Laporan</p>
            <p style={{ fontSize: '0.9rem' }}>
              Konten laporan akan ditampilkan di sini.<br/>
              Sidebar dan navbar tetap konsisten di setiap halaman.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
