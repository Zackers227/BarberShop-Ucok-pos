// Main Application
let currentView = 'pos';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
});

// Check authentication
function checkAuth() {
    const token = API.getToken();
    const user = API.getUser();

    if (token && user) {
        showMainApp(user);
    } else {
        showLoginScreen();
    }
}

// Show screens
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainApp').classList.remove('active');
}

function showMainApp(user) {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainApp').classList.add('active');
    document.getElementById('userName').textContent = user.full_name;
    
    loadPOSData();
    loadDashboard();
}

// Event Listeners
function initializeEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Menu
    document.getElementById('menuBtn').addEventListener('click', toggleSidebar);
    
    // Navigation
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });

    // Cart actions
    document.getElementById('clearCartBtn').addEventListener('click', () => {
        if (confirm('Kosongkan keranjang?')) {
            cart.clear();
        }
    });

    document.getElementById('paymentBtn').addEventListener('click', showPaymentModal);
    document.getElementById('applyDiscountBtn').addEventListener('click', showDiscountModal);

    // Customer & Kapster selection
    document.getElementById('customerSelect').addEventListener('change', (e) => {
        cart.setCustomer(e.target.value);
    });

    document.getElementById('kapsterSelect').addEventListener('change', (e) => {
        cart.setKapster(e.target.value);
    });
}

// Login handler
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await API.login(username, password);
        showMainApp(response.user);
        showNotification('Login berhasil!');
    } catch (error) {
        showNotification('Login gagal: ' + error.message, 'error');
    }
}

// Logout handler
async function handleLogout() {
    if (confirm('Yakin ingin logout?')) {
        await API.logout();
        showLoginScreen();
        cart.clear();
    }
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    
    const view = e.target.dataset.view;
    
    // Update active link
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');

    // Show view
    showView(view);
}

// Show view
function showView(view) {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });

    document.getElementById(view + 'View').classList.add('active');
    currentView = view;

    // Load view data
    switch(view) {
        case 'pos':
            loadPOSData();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'services':
            loadServicesData();
            break;
        case 'products':
            loadProductsData();
            break;
        case 'kapsters':
            loadKapsters();
            break;
        case 'reports':
            loadReports();
            break;
        case 'shift':
            loadShiftData();
            break;
    }

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

// Tab handler
function handleTabClick(e) {
    const tabName = e.target.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    e.target.classList.add('active');

    // Show tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Load POS data
async function loadPOSData() {
    try {
        const [services, products, kapsters, customers] = await Promise.all([
            API.getServices(),
            API.getProducts(),
            API.getKapsters(),
            API.getCustomers()
        ]);

        renderServices(services);
        renderProducts(products);
        renderKapsterSelect(kapsters);
        renderCustomerSelect(customers);
    } catch (error) {
        console.error('Error loading POS data:', error);
        showNotification('Gagal memuat data', 'error');
    }
}

// Render services
function renderServices(services) {
    const container = document.getElementById('servicesList');
    
    container.innerHTML = services.map(service => `
        <div class="item-card" onclick="addToCart(${service.id}, 'service', '${service.name}', ${service.price})">
            <h4>${service.name}</h4>
            <div class="price">${formatCurrency(service.price)}</div>
            <small>${service.duration} menit</small>
        </div>
    `).join('');
}

// Render products
function renderProducts(products) {
    const container = document.getElementById('productsList');
    
    container.innerHTML = products.map(product => `
        <div class="item-card" onclick="addToCart(${product.id}, 'product', '${product.name}', ${product.selling_price})">
            <h4>${product.name}</h4>
            <div class="price">${formatCurrency(product.selling_price)}</div>
            <div class="stock">Stok: ${product.stock}</div>
        </div>
    `).join('');
}

// Render kapster select
function renderKapsterSelect(kapsters) {
    const select = document.getElementById('kapsterSelect');
    
    select.innerHTML = '<option value="">Pilih Kapster</option>' + 
        kapsters.map(k => `<option value="${k.id}">${k.name}</option>`).join('');
}

// Render customer select
function renderCustomerSelect(customers) {
    const select = document.getElementById('customerSelect');
    
    select.innerHTML = '<option value="">Walk-in</option>' + 
        customers.map(c => `<option value="${c.id}">${c.name} - ${c.phone}</option>`).join('');
}

// Add to cart
function addToCart(id, type, name, price) {
    cart.addItem({ id, type, name, price });
}

// Show payment modal
function showPaymentModal() {
    if (!cart.kapster) {
        showNotification('Pilih kapster terlebih dahulu!', 'error');
        return;
    }

    if (cart.items.length === 0) {
        showNotification('Keranjang kosong!', 'error');
        return;
    }

    const modal = document.getElementById('paymentModal');
    const total = cart.getTotal();

    modal.querySelector('#paymentForm').innerHTML = `
        <div class="form-group">
            <label>Total Pembayaran</label>
            <h2>${formatCurrency(total)}</h2>
        </div>

        <div class="form-group">
            <label>Metode Pembayaran</label>
            <select id="paymentMethod" onchange="handlePaymentMethodChange()">
                <option value="cash">Tunai</option>
                <option value="qris">QRIS</option>
                <option value="transfer">Transfer</option>
                <option value="debit">Debit/Kartu</option>
            </select>
        </div>

        <div id="cashPayment">
            <div class="form-group">
                <label>Jumlah Diterima</label>
                <input type="number" id="cashReceived" value="${total}" min="${total}">
            </div>
            <div class="form-group">
                <label>Kembalian</label>
                <h3 id="changeAmount">${formatCurrency(0)}</h3>
            </div>
        </div>

        <div id="nonCashPayment" style="display: none;">
            <div class="form-group">
                <label>Nomor Referensi (opsional)</label>
                <input type="text" id="referenceNo" placeholder="Nomor transaksi/approval">
            </div>
        </div>

        <div class="form-group">
            <label>Catatan (opsional)</label>
            <textarea id="paymentNotes" rows="2"></textarea>
        </div>

        <button onclick="processPayment()" class="btn btn-primary btn-block btn-large">Proses Pembayaran</button>
    `;

    // Cash received change handler
    document.getElementById('cashReceived').addEventListener('input', (e) => {
        const received = parseFloat(e.target.value) || 0;
        const change = received - total;
        document.getElementById('changeAmount').textContent = formatCurrency(Math.max(0, change));
    });

    modal.classList.add('active');

    // Close modal
    modal.querySelector('.close').onclick = () => {
        modal.classList.remove('active');
    };
}

// Handle payment method change
function handlePaymentMethodChange() {
    const method = document.getElementById('paymentMethod').value;
    const cashDiv = document.getElementById('cashPayment');
    const nonCashDiv = document.getElementById('nonCashPayment');

    if (method === 'cash') {
        cashDiv.style.display = 'block';
        nonCashDiv.style.display = 'none';
    } else {
        cashDiv.style.display = 'none';
        nonCashDiv.style.display = 'block';
    }
}

// Process payment
async function processPayment() {
    try {
        const method = document.getElementById('paymentMethod').value;
        const total = cart.getTotal();
        let amount = total;
        let reference_no = null;

        if (method === 'cash') {
            amount = parseFloat(document.getElementById('cashReceived').value);
            if (amount < total) {
                showNotification('Jumlah diterima kurang dari total!', 'error');
                return;
            }
        } else {
            reference_no = document.getElementById('referenceNo').value || null;
        }

        const transactionData = {
            ...cart.getData(),
            payments: [{
                payment_method: method,
                amount: amount,
                reference_no: reference_no,
                notes: document.getElementById('paymentNotes').value || null
            }]
        };

        const result = await API.createTransaction(transactionData);
        
        // Close modal
        document.getElementById('paymentModal').classList.remove('active');

        // Print receipt
        await printer.print(result.transaction);

        // Clear cart
        cart.clear();

        showNotification('Transaksi berhasil!');

        // Ask to print copy
        if (confirm('Cetak struk copy?')) {
            await printer.print(result.transaction, true);
        }

    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Gagal memproses pembayaran: ' + error.message, 'error');
    }
}

// Show discount modal
async function showDiscountModal() {
    const code = prompt('Masukkan kode diskon:');
    if (!code) return;

    try {
        const result = await API.validateDiscount(code, cart.getSubtotal());
        cart.setDiscount({
            id: result.discount.id,
            code: result.discount.code,
            name: result.discount.name,
            type: result.discount.type,
            value: result.discount.value,
            max_discount: result.discount.max_discount
        });
        showNotification(`Diskon ${result.discount.name} berhasil diterapkan!`);
    } catch (error) {
        showNotification('Kode diskon tidak valid: ' + error.message, 'error');
    }
}

// Load transactions
async function loadTransactions() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const transactions = await API.getTransactions({ date: today });
        
        const container = document.getElementById('transactionsList');
        
        if (transactions.length === 0) {
            container.innerHTML = '<p>Belum ada transaksi hari ini</p>';
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>No. Transaksi</th>
                        <th>Waktu</th>
                        <th>Pelanggan</th>
                        <th>Kapster</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map(t => `
                        <tr>
                            <td>${t.transaction_no}</td>
                            <td>${formatDateTime(t.created_at)}</td>
                            <td>${t.customer_name || 'Walk-in'}</td>
                            <td>${t.kapster_name || '-'}</td>
                            <td>${formatCurrency(t.total)}</td>
                            <td>${t.status}</td>
                            <td>
                                <button onclick="viewTransaction(${t.id})" class="btn btn-small">Detail</button>
                                <button onclick="reprintReceipt(${t.id})" class="btn btn-small">Print</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// View transaction detail
async function viewTransaction(id) {
    try {
        const transaction = await API.getTransaction(id);
        alert('Detail transaksi:\n' + JSON.stringify(transaction, null, 2));
        // TODO: Show in modal with better formatting
    } catch (error) {
        showNotification('Gagal memuat detail transaksi', 'error');
    }
}

// Reprint receipt
async function reprintReceipt(id) {
    try {
        const transaction = await API.getTransaction(id);
        await printer.print(transaction, true);
    } catch (error) {
        showNotification('Gagal mencetak ulang struk', 'error');
    }
}

// Load dashboard
async function loadDashboard() {
    try {
        const dashboard = await API.getDashboard();
        console.log('Dashboard:', dashboard);
        // Update dashboard widgets if needed
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Placeholder loaders for other views
function loadCustomers() {
    document.getElementById('customersList').innerHTML = '<p>Loading customers...</p>';
}

function loadServicesData() {
    document.getElementById('servicesDataList').innerHTML = '<p>Loading services...</p>';
}

function loadProductsData() {
    document.getElementById('productsDataList').innerHTML = '<p>Loading products...</p>';
}

function loadKapsters() {
    document.getElementById('kapstersList').innerHTML = '<p>Loading kapsters...</p>';
}

function loadReports() {
    document.getElementById('reportsContent').innerHTML = '<p>Loading reports...</p>';
}

function loadShiftData() {
    document.getElementById('shiftContent').innerHTML = `
        <div>
            <h3>Shift Management</h3>
            <button onclick="openShift()" class="btn btn-primary">Buka Shift</button>
            <button onclick="closeShift()" class="btn btn-danger">Tutup Shift</button>
        </div>
    `;
}

// Shift functions
async function openShift() {
    const balance = prompt('Masukkan modal awal:');
    if (!balance) return;

    try {
        await API.openShift(parseFloat(balance));
        showNotification('Shift berhasil dibuka');
    } catch (error) {
        showNotification('Gagal membuka shift: ' + error.message, 'error');
    }
}

async function closeShift() {
    const balance = prompt('Masukkan saldo akhir:');
    if (!balance) return;

    try {
        const result = await API.closeShift(parseFloat(balance));
        alert('Shift ditutup:\n' + JSON.stringify(result.summary, null, 2));
        showNotification('Shift berhasil ditutup');
    } catch (error) {
        showNotification('Gagal menutup shift: ' + error.message, 'error');
    }
}

// Update clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}
