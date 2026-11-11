import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Transaction() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [customers, setCustomers] = useState([]);
  const [kapsters, setKapsters] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  
  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedKapster, setSelectedKapster] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TUNAI');
  const [paymentAmount, setPaymentAmount] = useState('');
  
  // Modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    gender: ''
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchData(token);
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [customersRes, kapstersRes, servicesRes, productsRes, discountsRes] = await Promise.all([
        fetch('/api/customers', { headers }),
        fetch('/api/kapsters', { headers }),
        fetch('/api/services', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/discounts', { headers })
      ]);

      setCustomers(await customersRes.json());
      setKapsters(await kapstersRes.json());
      setServices(await servicesRes.json());
      setProducts(await productsRes.json());
      setDiscounts(await discountsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Nama dan nomor HP harus diisi!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Customer berhasil ditambahkan!');
        setShowCustomerModal(false);
        setNewCustomer({ name: '', phone: '', email: '', gender: '' });
        
        // Refresh customer list and select the new one
        await fetchData(token);
        setSelectedCustomer(result.data.id);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Terjadi kesalahan');
    }
  };

  const addToCart = (item, type) => {
    const newItem = {
      id: `${type}-${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      price: item.price,
      type: type,
      quantity: 1
    };
    setCart([...cart, newItem]);
    setShowServiceModal(false);
    setShowProductModal(false);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!selectedDiscount) return 0;
    const discount = discounts.find(d => d.id === parseInt(selectedDiscount));
    if (!discount) return 0;
    
    const subtotal = calculateSubtotal();
    if (discount.type === 'PERCENTAGE') {
      return subtotal * (discount.value / 100);
    }
    return discount.value;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateChange = () => {
    const paid = parseFloat(paymentAmount) || 0;
    const total = calculateTotal();
    return paid >= total ? paid - total : 0;
  };

  const handleSubmitTransaction = async () => {
    if (!selectedKapster) {
      alert('Pilih kapster terlebih dahulu!');
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }

    if (paymentMethod === 'TUNAI' && parseFloat(paymentAmount) < calculateTotal()) {
      alert('Jumlah pembayaran kurang!');
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare payment data
      const paymentData = [];
      if (paymentMethod === 'TUNAI') {
        paymentData.push({
          payment_method: 'TUNAI',
          amount: parseFloat(paymentAmount) || calculateTotal(),
          reference_no: null
        });
      } else {
        // For non-cash, amount = total
        paymentData.push({
          payment_method: paymentMethod,
          amount: calculateTotal(),
          reference_no: null
        });
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: selectedCustomer || null,
          kapster_id: parseInt(selectedKapster),
          items: cart.map(item => ({
            item_id: item.itemId,
            item_type: item.type,
            item_name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          discount_id: selectedDiscount || null,
          discount_amount: calculateDiscount(),
          payments: paymentData,
          notes: null
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Transaksi berhasil! No: ${result.transaction.transaction_no}`);
        
        // Reset form
        setCart([]);
        setSelectedCustomer('');
        setSelectedKapster('');
        setSelectedDiscount('');
        setPaymentAmount('');
        
        // Redirect ke riwayat atau dashboard
        router.push('/transactions');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Terjadi kesalahan saat memproses transaksi');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Transaksi Baru - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/transaction.css" />
      </Head>

      <div className="page-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>💈 Barbershop Ucok POS</h2>
          </div>
          <div className="navbar-menu">
            <button className="btn btn-secondary btn-sm" onClick={() => router.push('/dashboard')}>
              ← Kembali
            </button>
            <span className="user-info">👤 {user?.full_name || user?.username}</span>
          </div>
        </nav>

        <div className="transaction-container">
          <h1 className="page-title">🛒 Transaksi Baru</h1>

          <div className="transaction-layout">
            {/* Left Panel - Form */}
            <div className="form-panel">
              <div className="card">
                <h3>📝 Data Transaksi</h3>
                
                <div className="form-group">
                  <label>Customer (Opsional)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                      value={selectedCustomer} 
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">-- Walk-in Customer --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} - {c.phone}
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      className="btn btn-primary" 
                      onClick={() => setShowCustomerModal(true)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      ➕ Baru
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Kapster *</label>
                  <select value={selectedKapster} onChange={(e) => setSelectedKapster(e.target.value)} required>
                    <option value="">-- Pilih Kapster --</option>
                    {kapsters.map(k => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card">
                <h3>🛍️ Tambah Item</h3>
                <div className="button-group">
                  <button className="btn btn-primary" onClick={() => setShowServiceModal(true)}>
                    ✂️ Tambah Layanan
                  </button>
                  <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>
                    🧴 Tambah Produk
                  </button>
                </div>
              </div>

              <div className="card">
                <h3>🎟️ Diskon</h3>
                <div className="form-group">
                  <select value={selectedDiscount} onChange={(e) => setSelectedDiscount(e.target.value)}>
                    <option value="">-- Tanpa Diskon --</option>
                    {discounts.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} - {d.type === 'PERCENTAGE' ? `${d.value}%` : `Rp ${d.value.toLocaleString()}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel - Cart & Payment */}
            <div className="cart-panel">
              <div className="card cart-card">
                <h3>🛒 Keranjang</h3>
                
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <p>Keranjang masih kosong</p>
                    <small>Tambahkan layanan atau produk</small>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <strong>{item.name}</strong>
                          <small>{item.type}</small>
                        </div>
                        <div className="cart-item-actions">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="qty-input"
                          />
                          <span className="cart-item-price">
                            Rp {(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button onClick={() => removeFromCart(item.id)} className="btn-remove">
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <strong>Rp {calculateSubtotal().toLocaleString()}</strong>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="summary-row discount">
                      <span>Diskon:</span>
                      <strong>- Rp {calculateDiscount().toLocaleString()}</strong>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>TOTAL:</span>
                    <strong>Rp {calculateTotal().toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="card payment-card">
                <h3>💳 Pembayaran</h3>
                
                <div className="form-group">
                  <label>Metode Pembayaran</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="TUNAI">Tunai</option>
                    <option value="QRIS">QRIS</option>
                    <option value="TRANSFER">Transfer Bank</option>
                    <option value="DEBIT">Kartu Debit</option>
                  </select>
                </div>

                {paymentMethod === 'TUNAI' && (
                  <>
                    <div className="form-group">
                      <label>Jumlah Bayar</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    {paymentAmount && (
                      <div className="change-display">
                        <span>Kembalian:</span>
                        <strong className={calculateChange() >= 0 ? 'text-success' : 'text-danger'}>
                          Rp {calculateChange().toLocaleString()}
                        </strong>
                      </div>
                    )}
                  </>
                )}

                <button
                  className="btn btn-success btn-block btn-lg"
                  onClick={handleSubmitTransaction}
                  disabled={processing || cart.length === 0}
                >
                  {processing ? 'Memproses...' : '✅ Proses Transaksi'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Layanan */}
        {showServiceModal && (
          <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>✂️ Pilih Layanan</h3>
              <div className="modal-items">
                {services.map(service => (
                  <div key={service.id} className="modal-item" onClick={() => addToCart(service, 'SERVICE')}>
                    <div>
                      <strong>{service.name}</strong>
                      <small>{service.description}</small>
                    </div>
                    <span className="modal-item-price">Rp {service.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-block" onClick={() => setShowServiceModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Modal Produk */}
        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>🧴 Pilih Produk</h3>
              <div className="modal-items">
                {products.map(product => (
                  <div key={product.id} className="modal-item" onClick={() => addToCart(product, 'PRODUCT')}>
                    <div>
                      <strong>{product.name}</strong>
                      <small>Stok: {product.stock}</small>
                    </div>
                    <span className="modal-item-price">Rp {product.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-block" onClick={() => setShowProductModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Modal Customer Baru */}
        {showCustomerModal && (
          <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>👤 Tambah Customer Baru</h3>
              <div className="form-group">
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Nama customer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nomor HP *</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="08xx-xxxx-xxxx"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (Opsional)</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select
                  value={newCustomer.gender}
                  onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                >
                  <option value="">-- Pilih --</option>
                  <option value="LAKI-LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
              </div>
              <div className="button-group">
                <button className="btn btn-secondary" onClick={() => setShowCustomerModal(false)}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleAddCustomer}>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
