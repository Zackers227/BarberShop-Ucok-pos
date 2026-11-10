import Head from 'next/head';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Load scripts
      const scripts = [
        '/js/api.js',
        '/js/cart.js',
        '/js/printer.js',
        '/js/app.js'
      ];

      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - Barbershop Ucok POS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div id="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>💈 Barbershop Ucok</h2>
          </div>
          <div className="navbar-menu">
            <span id="userName">Loading...</span>
            <button className="btn btn-sm btn-danger" id="logoutBtn">Logout</button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container">
          <div className="row">
            {/* Left Column - Form */}
            <div className="col-8">
              <div className="card">
                <div className="card-header">
                  <h3>Transaksi Baru</h3>
                </div>
                <div className="card-body">
                  {/* Customer Selection */}
                  <div className="form-group">
                    <label>Customer (Optional)</label>
                    <select id="customerSelect" className="form-control">
                      <option value="">Walk-in Customer</option>
                    </select>
                  </div>

                  {/* Kapster Selection */}
                  <div className="form-group">
                    <label>Kapster</label>
                    <select id="kapsterSelect" className="form-control" required>
                      <option value="">Pilih Kapster</option>
                    </select>
                  </div>

                  {/* Services */}
                  <div className="form-group">
                    <label>Layanan</label>
                    <div id="servicesList" className="items-grid"></div>
                  </div>

                  {/* Products */}
                  <div className="form-group">
                    <label>Produk</label>
                    <div id="productsList" className="items-grid"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Cart */}
            <div className="col-4">
              <div className="card cart-card">
                <div className="card-header">
                  <h3>Keranjang</h3>
                </div>
                <div className="card-body">
                  <div id="cartItems" className="cart-items">
                    <p className="text-muted">Keranjang kosong</p>
                  </div>

                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span id="subtotal">Rp 0</span>
                    </div>
                    <div className="summary-row">
                      <span>Diskon:</span>
                      <span id="discount">Rp 0</span>
                    </div>
                    <div className="summary-row total">
                      <span><strong>Total:</strong></span>
                      <span id="total"><strong>Rp 0</strong></span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Metode Bayar</label>
                    <select id="paymentMethod" className="form-control">
                      <option value="cash">Tunai</option>
                      <option value="qris">QRIS</option>
                      <option value="transfer">Transfer</option>
                      <option value="debit">Debit</option>
                    </select>
                  </div>

                  <div className="form-group" id="cashPaymentGroup">
                    <label>Uang Diterima</label>
                    <input type="number" id="cashReceived" className="form-control" placeholder="0" />
                    <small>Kembalian: <span id="change">Rp 0</span></small>
                  </div>

                  <button id="processPaymentBtn" className="btn btn-success btn-block btn-lg">
                    Proses Pembayaran
                  </button>

                  <button id="clearCartBtn" className="btn btn-outline-danger btn-block">
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="quick-actions">
                    <button className="btn btn-outline-primary" id="openShiftBtn">
                      📂 Buka Shift
                    </button>
                    <button className="btn btn-outline-warning" id="closeShiftBtn">
                      📁 Tutup Shift
                    </button>
                    <button className="btn btn-outline-info" id="dailyReportBtn">
                      📊 Laporan Harian
                    </button>
                    <button className="btn btn-outline-secondary" id="historyBtn">
                      📜 Riwayat Transaksi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
