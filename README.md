# 💈 Barbershop Ucok POS

Sistem Point of Sale (POS) modern untuk barbershop dengan fitur lengkap manajemen transaksi, laporan, dan administrasi.

## 🚀 Demo Live

**Production URL:** https://barber-shop-ucok-pos.vercel.app

### Login Credentials
- **Owner:** `admin` / `admin123`
- **Kasir:** `kasir1` / `kasir123`

## ✨ Fitur Utama

### 🛒 Transaksi
- Form transaksi lengkap dengan keranjang belanja
- Pilih customer (walk-in atau registered)
- Pilih kapster
- Tambah layanan (haircut, styling, dll)
- Tambah produk (pomade, shampoo, dll)
- Terapkan diskon (percentage atau fixed amount)
- Multiple payment methods: Tunai, QRIS, Transfer, Debit
- Hitung otomatis subtotal, diskon, total, dan kembalian
- Void transaksi (batalkan)

### 📊 Manajemen Shift
- Buka shift dengan modal awal
- Track transaksi per shift
- Tutup shift dengan perhitungan kas
- Deteksi selisih kas (lebih/kurang)
- Riwayat shift lengkap

### 📈 Laporan
- **Laporan Harian:** Total pendapatan, transaksi, customer
- **Laporan Bulanan:** Analisis bulanan lengkap
- Breakdown per metode pembayaran
- Top 5 layanan terlaris
- Top 5 produk terlaris
- Performa per kapster
- Export/print laporan

### 👥 Kelola Member (Owner Only)
- Tambah/edit/hapus user/kasir
- Role management (Owner/Kasir)
- Active/inactive status
- Reset password

### 💈 Kelola Kapster
- Tambah/edit/hapus kapster
- Set komisi per kapster
- Track performa kapster

### ✂️ Kelola Layanan
- Tambah/edit/hapus layanan
- Set harga dan durasi
- Deskripsi layanan

### 🧴 Kelola Produk
- Tambah/edit/hapus produk
- Manajemen stok
- Alert stok rendah
- Harga jual dan modal

### 👤 Kelola Customer
- Database customer
- Track riwayat kunjungan
- Program loyalty (coming soon)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React
- **Backend:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL (Supabase)
- **Deployment:** Vercel
- **Authentication:** JWT
- **Styling:** Custom CSS

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm atau yarn
- PostgreSQL database (Supabase recommended)

### Setup Lokal

1. **Clone repository**
```bash
git clone https://github.com/Zackers227/BarberShop-Ucok-pos.git
cd BarberShop-Ucok-pos
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
```

4. **Setup database**
```bash
# Jalankan schema PostgreSQL
node database/migrate-pg.js

# Atau manual import
psql -h host -U user -d database -f database/schema-pg.sql
```

5. **Seed data (optional)**
```bash
node database/seed.js
```

6. **Run development server**
```bash
npm run dev
```

Buka http://localhost:3000

## 🌐 Deployment ke Vercel

### Langkah Deploy

1. **Push ke GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy ke Vercel**
```bash
npm i -g vercel
vercel login
vercel --prod
```

3. **Set Environment Variables**
```bash
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
```

Atau via Vercel Dashboard:
- Buka project di https://vercel.com
- Settings → Environment Variables
- Tambahkan `DATABASE_URL` dan `JWT_SECRET`

### Database Setup (Supabase)

1. Buat project di https://supabase.com
2. Pilih region: Southeast Asia (Singapore)
3. Buka SQL Editor
4. Copy-paste isi `database/schema-pg.sql`
5. Execute
6. Copy connection string (Transaction Pooler) dari Settings → Database
7. Format: `postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

## 📱 Screenshot

### Login Page
![Login](docs/login.png)

### Dashboard
![Dashboard](docs/dashboard.png)

### Transaction Form
![Transaction](docs/transaction.png)

### Reports
![Reports](docs/reports.png)

## 🗂️ Struktur Database

### Tables (13 total)
1. **users** - User/kasir management
2. **kapsters** - Data kapster
3. **customers** - Data customer
4. **services** - Layanan barbershop
5. **products** - Produk dijual
6. **discounts** - Promo/diskon
7. **shifts** - Shift kasir
8. **transactions** - Header transaksi
9. **transaction_items** - Detail items transaksi
10. **payments** - Payment details
11. **inventory_logs** - Log perubahan stok
12. **customer_visits** - Riwayat kunjungan
13. **commissions** - Komisi kapster

## 🔒 Security Features

- JWT Authentication
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Protected API routes
- SQL injection prevention (parameterized queries)
- XSS protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List transaksi
- `POST /api/transactions` - Buat transaksi baru
- `GET /api/transactions/[id]` - Detail transaksi
- `POST /api/transactions/[id]/void` - Void transaksi

### Shifts
- `GET /api/shifts` - List shifts
- `POST /api/shifts` - Buka shift
- `POST /api/shifts/[id]/close` - Tutup shift

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` - Laporan harian
- `GET /api/reports/monthly?month=YYYY-MM` - Laporan bulanan

### Management (Owner Only)
- `GET /api/users` - List user
- `POST /api/users` - Tambah user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Hapus user

### Master Data
- CRUD endpoints untuk: `/api/kapsters`, `/api/services`, `/api/products`, `/api/customers`, `/api/discounts`

## 🎨 UI/UX Features

- Modern gradient design
- Responsive layout (mobile-friendly)
- Smooth animations
- Card-based components
- Modal dialogs
- Toast notifications
- Loading states
- Empty states
- Error handling

## 📝 Changelog

### Version 2.0.0 (Latest)
- ✅ Rewrite dari Express.js ke Next.js
- ✅ Serverless architecture
- ✅ Complete transaction flow
- ✅ Shift management
- ✅ Daily & monthly reports
- ✅ User management (Owner only)
- ✅ Master data management
- ✅ Modern UI redesign
- ✅ Responsive design

### Version 1.0.0
- Initial release dengan Express.js
- Basic POS features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Barbershop Ucok POS**
- GitHub: [@Zackers227](https://github.com/Zackers227)
- Repository: [BarberShop-Ucok-pos](https://github.com/Zackers227/BarberShop-Ucok-pos)

## 🆘 Support

Jika mengalami masalah:
1. Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) untuk dokumentasi lengkap
2. Check [INSTALL.md](INSTALL.md) untuk panduan instalasi
3. Check [API.md](API.md) untuk dokumentasi API
4. Open an issue di GitHub

## 🎯 Roadmap

### Coming Soon
- [ ] Print struk thermal 58mm
- [ ] Customer loyalty program
- [ ] Appointment booking
- [ ] WhatsApp notification
- [ ] Multi-branch support
- [ ] Advanced analytics
- [ ] Expense tracking
- [ ] Employee attendance

## 📞 Contact

Untuk pertanyaan atau kerjasama:
- Email: support@barbershopucok.com
- Website: https://barber-shop-ucok-pos.vercel.app

---

**Made with ❤️ for Barbershop Ucok**

*Last Updated: November 2026*
