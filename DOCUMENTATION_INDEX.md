# 📚 DOCUMENTATION INDEX

Selamat datang di dokumentasi Barbershop Ucok POS System v2.0!

## 📖 Daftar Dokumentasi

### 1. [README.md](README.md) ⭐
**Halaman utama project** dengan overview fitur lengkap, tech stack, dan panduan deployment.
- Fitur-fitur lengkap POS
- Tech stack (Next.js + Supabase)
- Installation guide
- Deployment guide (Vercel)
- API endpoints overview
- Roadmap

### 2. [QUICKSTART.md](QUICKSTART.md) 🚀
**Panduan cepat** untuk menjalankan aplikasi dalam 5 menit.
- Setup lokal cepat
- Run development server
- Login credentials
- First transaction

### 3. [INSTALL.md](INSTALL.md) 🛠️
**Panduan instalasi lengkap** step-by-step untuk development dan production.
- Prerequisites (Node.js 18+)
- Environment setup
- Database migration
- Seed data
- Troubleshooting

### 4. [API.md](API.md) 📡
**Dokumentasi lengkap API endpoints** dengan contoh request/response.
- Authentication endpoints
- Transaction endpoints
- Shift endpoints
- Report endpoints (daily/monthly)
- Management endpoints (users)
- Master data endpoints (kapsters, services, products, customers, discounts)

### 5. [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) ☁️
**Panduan deploy ke Vercel** dengan Supabase PostgreSQL.
- Setup Supabase project
- Configure connection pooler
- Vercel environment variables
- Production deployment
- SSL configuration

### 6. [DEPLOY_ONLINE.md](DEPLOY_ONLINE.md) 🌐
**Panduan deploy ke platform hosting** online lainnya.
- Alternative hosting options
- VPS deployment (DigitalOcean, AWS, etc)
- Docker deployment
- Railway/Render deployment

### 7. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) 📋
**Ringkasan teknis project**: teknologi, arsitektur, dan struktur.
- Tech stack details (Next.js 14, PostgreSQL)
- Serverless architecture
- File structure
- Database schema (13 tables)
- Migration from Express.js

### 8. [CHANGELOG.md](CHANGELOG.md) 📝
**Catatan perubahan** dan update aplikasi.
- Version history
- New features (v2.0.0 - Complete rewrite)
- Bug fixes
- Breaking changes

### 9. [REWRITE_SUMMARY.md](REWRITE_SUMMARY.md) 🔄
**Dokumentasi proses rewrite** dari Express.js ke Next.js.
- Why rewrite? (Vercel serverless compatibility)
- Migration process
- Express.js → Next.js API routes conversion
- Changes made (23 endpoints converted)
- Lessons learned

## 🎯 Panduan Berdasarkan Kebutuhan

### 🆕 Untuk Developer Baru
1. ✅ Baca [README.md](README.md) untuk overview lengkap
2. ✅ Ikuti [QUICKSTART.md](QUICKSTART.md) untuk setup cepat
3. ✅ Pelajari [API.md](API.md) untuk memahami API
4. ✅ Cek [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) untuk arsitektur

### 🚀 Untuk Deploy Production
1. ✅ Baca [INSTALL.md](INSTALL.md) untuk setup environment
2. ✅ Setup database dengan panduan di [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)
3. ✅ Deploy mengikuti [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)
4. ✅ Test semua fitur di production

### 🔧 Untuk Maintainer
1. ✅ Cek [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) untuk arsitektur
2. ✅ Update [CHANGELOG.md](CHANGELOG.md) setiap ada perubahan
3. ✅ Baca [REWRITE_SUMMARY.md](REWRITE_SUMMARY.md) untuk context historical
4. ✅ Review [API.md](API.md) saat menambah endpoint baru

### 👥 Untuk Pengguna/Owner
1. ✅ Akses https://barber-shop-ucok-pos.vercel.app
2. ✅ Login dengan credentials yang diberikan
3. ✅ Pelajari fitur-fitur di [README.md](README.md)
4. ✅ Pelajari laporan di section Reports

## 📊 Fitur Lengkap v2.0

### ✅ Transaksi (NEW!)
- Form transaksi dengan keranjang belanja
- Pilih customer & kapster
- Multiple payment methods (Tunai, QRIS, Transfer, Debit)
- Auto calculate subtotal, discount, total, change
- Void transaksi
- Transaction history

### ✅ Manajemen Shift (NEW!)
- Buka shift dengan modal awal
- Track transaksi per shift
- Tutup shift dengan perhitungan kas
- Deteksi selisih kas (lebih/kurang)
- Riwayat shift lengkap

### ✅ Laporan (NEW!)
- **Laporan Harian**: Total pendapatan, transaksi, customer, average
- **Laporan Bulanan**: Analisis bulanan lengkap
- Breakdown per metode pembayaran
- Top 5 layanan terlaris
- Top 5 produk terlaris
- Performa per kapster
- Print/export laporan

### ✅ Kelola Member - Owner Only (NEW!)
- Tambah/edit/hapus user/kasir
- Role management (Owner/Kasir)
- Active/inactive status
- Password reset
- Security: Only owner can access

### ✅ Master Data Management
- **Kelola Kapster**: Tambah/edit/hapus, set komisi
- **Kelola Layanan**: Pricing, duration, description
- **Kelola Produk**: Stock management, low stock alert
- **Kelola Customer**: Database customer, visit tracking
- **Kelola Diskon**: Percentage or fixed amount

## 🔑 Login Credentials

**Production:** https://barber-shop-ucok-pos.vercel.app

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Owner | admin | admin123 | Full access (all features) |
| Kasir | kasir1 | kasir123 | Limited (no user management) |

## 🗄️ Database Schema

### 13 Tables (PostgreSQL)
1. **users** - User/kasir management
2. **kapsters** - Data kapster (commission rate)
3. **customers** - Customer database (phone, visit count)
4. **services** - Layanan barbershop (price, duration)
5. **products** - Produk (stock, min_stock, alert)
6. **discounts** - Promo/diskon (percentage/fixed)
7. **shifts** - Shift kasir (opening/closing)
8. **transactions** - Transaction headers
9. **transaction_items** - Transaction line items
10. **payments** - Payment details
11. **inventory_logs** - Stock change history
12. **customer_visits** - Visit tracking
13. **commissions** - Kapster commissions

## 🎨 Tech Stack v2.0

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Custom CSS (modern gradient design)
- **State:** React Hooks (useState, useEffect)
- **Routing:** Next.js Router

### Backend
- **Runtime:** Node.js (serverless)
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **Connection:** pg + connection pooling
- **Auth:** JWT + bcrypt

### Deployment
- **Platform:** Vercel (serverless)
- **Database Host:** Supabase (Singapore region)
- **CDN:** Vercel Edge Network
- **Domain:** vercel.app

### Security
- JWT Authentication
- Password hashing (bcrypt, 10 rounds)
- Role-based access control (RBAC)
- SQL injection prevention (parameterized queries)
- XSS protection

## 📁 Project Structure

```
Barbershop/
├── pages/                      # Next.js pages & API routes
│   ├── api/                   # API endpoints (serverless)
│   │   ├── auth/             # Login, logout, me
│   │   ├── transactions/     # CRUD transactions
│   │   ├── shifts/           # Shift management
│   │   ├── reports/          # Daily & monthly reports
│   │   ├── users/            # User management (owner only)
│   │   ├── kapsters/         # Kapster CRUD
│   │   ├── services/         # Service CRUD
│   │   ├── products/         # Product CRUD
│   │   ├── customers/        # Customer CRUD
│   │   └── discounts/        # Discount CRUD
│   ├── dashboard.js          # Main dashboard
│   ├── login.js              # Login page
│   ├── transaction.js        # Transaction form (NEW!)
│   ├── transactions.js       # Transaction history (NEW!)
│   ├── shifts.js             # Shift management (NEW!)
│   ├── reports.js            # Reports page (NEW!)
│   ├── users.js              # User management (NEW!)
│   ├── kapsters.js           # Kapster management (NEW!)
│   ├── services.js           # Service management (NEW!)
│   └── products.js           # Product management (NEW!)
├── lib/                       # Utility libraries
│   ├── db.js                 # Database connection pool
│   └── auth.js               # JWT middleware
├── public/                    # Static assets
│   ├── css/
│   │   ├── styles.css        # Global styles (modern theme)
│   │   ├── transaction.css   # Transaction page styles
│   │   ├── table.css         # Table & list styles
│   │   └── reports.css       # Report print styles
│   └── js/                   # (legacy, not used in v2.0)
├── database/                  # Database files
│   ├── schema-pg.sql         # PostgreSQL schema
│   └── migrate-pg.js         # Migration script
├── scripts/                   # Utility scripts
│   ├── create-admin.js       # Create admin user
│   └── reset-password.js     # Reset user password
├── .env                       # Environment variables (git-ignored)
├── .env.example              # Environment template
├── next.config.js            # Next.js configuration
├── vercel.json               # Vercel deployment config
└── package.json              # Dependencies
```

## 📞 Support & Contact

### GitHub
- **Repository:** https://github.com/Zackers227/BarberShop-Ucok-pos
- **Issues:** https://github.com/Zackers227/BarberShop-Ucok-pos/issues
- **Pull Requests:** Welcome!

### Production
- **Live Demo:** https://barber-shop-ucok-pos.vercel.app
- **Status:** ✅ Active & Stable
- **Uptime:** Monitored by Vercel

### Contact
- **Email:** support@barbershopucok.com
- **GitHub:** [@Zackers227](https://github.com/Zackers227)

## 🚀 Quick Links

- [🌐 Live Demo](https://barber-shop-ucok-pos.vercel.app)
- [📦 GitHub Repository](https://github.com/Zackers227/BarberShop-Ucok-pos)
- [☁️ Supabase Dashboard](https://supabase.com/dashboard)
- [🚀 Vercel Dashboard](https://vercel.com/dashboard)
- [📚 Next.js Docs](https://nextjs.org/docs)
- [🐘 PostgreSQL Docs](https://www.postgresql.org/docs/)

## 📈 Project Status

- ✅ **Version:** 2.0.0 (Complete Rewrite)
- ✅ **Status:** Production Ready
- ✅ **Last Updated:** November 11, 2026
- ✅ **Active Development:** Yes
- ✅ **Test Coverage:** Manual testing complete
- ✅ **Documentation:** Complete
- ✅ **Migration:** Express.js → Next.js (Success)

## 🎯 Roadmap

### Version 2.1 (Coming Soon)
- [ ] Print struk thermal 58mm
- [ ] WhatsApp notification
- [ ] Customer loyalty program
- [ ] Appointment booking system

### Version 2.2 (Future)
- [ ] Multi-branch support
- [ ] Advanced analytics dashboard
- [ ] Expense tracking
- [ ] Employee attendance
- [ ] Mobile app (React Native)

## 🔍 Quick Search Guide

### Mencari Topik Spesifik?

| Topik | File |
|-------|------|
| Login gagal | [API.md](API.md) → Auth Endpoints |
| Database setup | [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) → Supabase Setup |
| Environment variables | [INSTALL.md](INSTALL.md) → Configuration |
| API authentication | [API.md](API.md) → Authentication |
| Deployment error | [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) → Troubleshooting |
| User management | [README.md](README.md) → Kelola Member |
| Transaction flow | [README.md](README.md) → Transaksi |
| Shift management | [README.md](README.md) → Manajemen Shift |
| Reports | [README.md](README.md) → Laporan |
| Database schema | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) → Database |
| Tech stack | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) → Tech Stack |
| Migration notes | [REWRITE_SUMMARY.md](REWRITE_SUMMARY.md) |

## 🆘 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Cannot connect to database | Check `DATABASE_URL` in `.env`, use Connection Pooler port 6543 |
| 401 Unauthorized | Check JWT token, login again |
| 403 Forbidden | Check user role, some features are owner-only |
| Build failed | Check Node.js version (18+), run `npm install` |
| Login doesn't work | Check database, verify password hash matches |
| API endpoint 404 | Check route path, ensure API file exists |
| Vercel deployment failed | Check environment variables, view build logs |

### Getting Help

1. **Check Documentation**
   - Search this index
   - Read relevant .md file
   - Check troubleshooting sections

2. **GitHub Issues**
   - Search existing issues
   - Create new issue with details
   - Include error messages & logs

3. **Contact Support**
   - Email with screenshots
   - Provide reproduction steps
   - Include environment info

---

## ✅ Documentation Checklist

**Untuk User Baru:**
- [ ] Baca README.md (overview)
- [ ] Baca QUICKSTART.md (setup)
- [ ] Login ke production
- [ ] Test transaksi

**Untuk Developer:**
- [ ] Clone repository
- [ ] Setup environment
- [ ] Read PROJECT_SUMMARY.md
- [ ] Read API.md
- [ ] Explore codebase

**Untuk Owner:**
- [ ] Understand all features
- [ ] Learn report generation
- [ ] Learn user management
- [ ] Setup backup strategy

---

<div align="center">

## 📊 Documentation Stats

| Metric | Value |
|--------|-------|
| Total Pages | 9 |
| API Endpoints | 30+ |
| Features | 8 major features |
| Database Tables | 13 |
| Code Examples | 100+ |
| Lines of Documentation | 3000+ |

---

**Made with ❤️ for Barbershop Ucok**

**Last Updated:** November 11, 2026  
**Version:** 2.0.0  
**Status:** ✅ Production Ready

[⬆ Back to Top](#-documentation-index)

</div>
