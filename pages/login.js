import Head from 'next/head';
import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    // Load login scripts
    if (typeof window !== 'undefined') {
      // Import login functionality
      const script = document.createElement('script');
      script.src = '/js/api.js';
      script.async = true;
      document.body.appendChild(script);

      const appScript = document.createElement('script');
      appScript.src = '/js/app.js';
      appScript.async = true;
      document.body.appendChild(appScript);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login - Barbershop Ucok POS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="login-container">
        <div className="login-box">
          <div className="logo">
            <h1>💈 Barbershop Ucok</h1>
            <p>Point of Sale System</p>
          </div>

          <form id="loginForm">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                required 
                autoFocus 
                placeholder="Masukkan username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                placeholder="Masukkan password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <span id="loginBtnText">Login</span>
              <span id="loginBtnLoading" style={{ display: 'none' }}>
                Loading...
              </span>
            </button>

            <div id="errorMessage" className="error-message" style={{ display: 'none' }}></div>
          </form>

          <div className="login-info">
            <p>Default Login:</p>
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Kasir:</strong> kasir1 / kasir123</p>
          </div>
        </div>
      </div>
    </>
  );
}
