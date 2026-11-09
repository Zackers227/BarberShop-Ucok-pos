const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'pos.db');

console.log('🌱 Memulai seeding data...');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error membuka database:', err.message);
        process.exit(1);
    }
});

// Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const seedData = async () => {
    try {
        // 1. Users
        console.log('📝 Menambahkan users...');
        const adminPassword = await hashPassword('admin123');
        const kasirPassword = await hashPassword('kasir123');
        
        await db.run(`INSERT INTO users (username, password, full_name, role) VALUES 
            ('admin', '${adminPassword}', 'Administrator', 'owner'),
            ('kasir1', '${kasirPassword}', 'Kasir Satu', 'kasir')`);
        
        // 2. Kapsters
        console.log('📝 Menambahkan kapster...');
        await db.run(`INSERT INTO kapsters (name, phone, commission_percentage) VALUES 
            ('Budi Santoso', '081234567890', 40.00),
            ('Agus Wijaya', '081234567891', 40.00),
            ('Dedi Firmansyah', '081234567892', 35.00)`);
        
        // 3. Services
        console.log('📝 Menambahkan layanan...');
        await db.run(`INSERT INTO services (name, price, duration, description) VALUES 
            ('Potong Rambut Regular', 35000, 30, 'Potong rambut standar'),
            ('Potong Rambut + Keramas', 50000, 45, 'Potong rambut + keramas'),
            ('Cukur Jenggot', 20000, 20, 'Cukur jenggot dan kumis'),
            ('Creambath', 75000, 60, 'Creambath + pijat kepala'),
            ('Hair Color', 150000, 90, 'Pewarnaan rambut'),
            ('Smoothing', 300000, 120, 'Smoothing rambut')`);
        
        // 4. Products
        console.log('📝 Menambahkan produk...');
        await db.run(`INSERT INTO products (name, sku, purchase_price, selling_price, stock, min_stock, unit) VALUES 
            ('Pomade Murray\'s', 'POM001', 45000, 65000, 25, 5, 'pcs'),
            ('Pomade Suavecito', 'POM002', 85000, 120000, 15, 5, 'pcs'),
            ('Shampoo Anti Dandruff', 'SHP001', 25000, 40000, 30, 10, 'btl'),
            ('Hair Tonic', 'HRT001', 30000, 50000, 20, 5, 'btl'),
            ('Wax Johnny Pomps', 'WAX001', 50000, 75000, 18, 5, 'pcs'),
            ('Gel Gatsby', 'GEL001', 15000, 25000, 40, 10, 'pcs')`);
        
        // 5. Customers
        console.log('📝 Menambahkan pelanggan...');
        await db.run(`INSERT INTO customers (name, phone, gender, total_visits, total_spending, is_member) VALUES 
            ('Walk-in Customer', '-', 'male', 0, 0, 0),
            ('Ahmad Rizki', '08123456001', 'male', 12, 420000, 1),
            ('Eko Prasetyo', '08123456002', 'male', 8, 280000, 1),
            ('Fajar Nugroho', '08123456003', 'male', 5, 175000, 0)`);
        
        // 6. Discounts
        console.log('📝 Menambahkan diskon...');
        await db.run(`INSERT INTO discounts (code, name, type, value, min_transaction, valid_from, valid_until) VALUES 
            ('MEMBER10', 'Diskon Member 10%', 'percentage', 10.00, 50000, '2026-01-01', '2026-12-31'),
            ('PROMO25K', 'Potongan 25 Ribu', 'fixed', 25000.00, 100000, '2026-11-01', '2026-11-30'),
            ('PAKET50', 'Diskon Paket 50%', 'percentage', 50.00, 200000, '2026-11-01', '2026-11-15')`);
        
        console.log('✅ Seeding selesai!');
        console.log('\n📌 Login credentials:');
        console.log('   Owner: admin / admin123');
        console.log('   Kasir: kasir1 / kasir123');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        db.close();
    }
};

// Jalankan seeding
seedData();
