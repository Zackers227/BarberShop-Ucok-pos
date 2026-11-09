# 💈 IniNotes POS - Sistem Barbershop

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**Sistem Point of Sale (POS) modern untuk barbershop dengan printer thermal 58mm**

[Fitur](#-fitur-utama) • [Quick Start](#-quick-start) • [Dokumentasi](#-dokumentasi) • [Demo](#-demo) • [Support](#-support)

</div>

---

## 📖 Tentang Project

IniNotes POS adalah sistem Point of Sale lengkap yang dirancang khusus untuk kebutuhan barbershop modern. Dibangun sebagai Progressive Web App (PWA) yang dapat diakses dari tablet Android, sistem ini mendukung printer thermal 58mm untuk mencetak struk transaksi.

### 🎯 Kenapa IniNotes POS?

- ✅ **Gratis & Open Source** - Lisensi MIT, bebas digunakan komersial
- ✅ **Mudah Digunakan** - Interface intuitif, training minimal
- ✅ **Offline-First** - Tetap jalan tanpa internet
- ✅ **Tablet-Optimized** - Desain khusus untuk tablet Android
- ✅ **Printer Thermal** - Support printer thermal 58mm via Bluetooth
- ✅ **No Subscription** - Sekali install, pakai selamanya

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run migrate && npm run seed

# 3. Jalankan server
npm start

# 4. Buka browser
# http://localhost:3001  ← PORT 3001
# Login: admin / admin123
```

📱 **Untuk tablet:** Akses `http://[IP-SERVER]:3001` dari browser Chrome

🌐 **Untuk online:** Baca [DEPLOY_ONLINE.md](DEPLOY_ONLINE.md) atau [SOLUSI_PORT_DAN_ONLINE.md](SOLUSI_PORT_DAN_ONLINE.md)

📚 **Butuh panduan lengkap?** Baca [QUICKSTART.md](QUICKSTART.md)

---

## ✨ Fitur Utama

### Master Data
- **Layanan**: Potong rambut, cukur, creambath, dll (nama, harga, durasi)
- **Produk**: Pomade, shampoo, dll (stok, harga beli/jual)
- **Kapster**: Data kapster dengan persentase komisi
- **Pelanggan**: Database pelanggan dengan riwayat kunjungan
- **Pengguna**: Manajemen kasir dengan hak akses

### Transaksi
- Keranjang multi-item (layanan + produk)
- Diskon (nominal/persen), promo, voucher member
- Split payment (tunai + QRIS/transfer)
- Antrian/booking (opsional)
- Void/refund dengan otorisasi owner

### Pembayaran
- **Tunai**: Input uang diterima, hitung kembalian otomatis
- **QRIS**: Statis (konfirmasi manual) atau dinamis (Midtrans/Xendit)
- **Transfer/Debit**: Catat nomor referensi

### Laporan
- Penjualan harian/bulanan
- Pendapatan per kapster + komisi
- Layanan terlaris
- Stok menipis (alert otomatis)
- Rekap per metode bayar
- Laporan kas (buka/tutup shift, selisih kas)

### Cetak Struk 58mm
Format struk thermal optimized untuk lebar 58mm (~32 karakter):
- Logo/nama barbershop, alamat, telepon
- No. transaksi unik (BB-YYYYMMDD-XXX)
- Tanggal-jam, nama kasir, nama kapster
- Daftar item lengkap (qty, harga)
- Subtotal, diskon, total
- Metode bayar, tunai, kembalian
- Ucapan terima kasih + info promo
- Cetak ulang struk (tandai "COPY")

## Teknologi

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (dev), PostgreSQL (prod) |
| **Auth** | JWT (JSON Web Token) |
| **PWA** | Service Worker, IndexedDB |
| **Printer** | ESC/POS, Web Bluetooth API |

### Key Dependencies
```json
{
  "express": "Web server framework",
  "sqlite3": "Database engine",
  "jsonwebtoken": "Authentication",
  "bcryptjs": "Password hashing",
  "cors": "Cross-origin support"
}
```

---

## 📁 Struktur Project

```
ininotes-pos/
├── client/          # Frontend (PWA)
│   ├── css/         # Styles
│   ├── js/          # JavaScript
│   └── images/      # Assets
├── server/          # Backend API
│   ├── controllers/ # Business logic
│   ├── routes/      # API endpoints
│   └── middleware/  # Auth & validation
├── database/        # Database & migrations
├── scripts/         # Utility scripts
└── docs/            # Documentation
```

---

## 📚 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| [QUICKSTART.md](QUICKSTART.md) | Setup dalam 5 menit |
| [INSTALL.md](INSTALL.md) | Panduan instalasi lengkap |
| [USAGE.md](USAGE.md) | Manual pengguna |
| [API.md](API.md) | API documentation |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Project overview |

---

## 🎯 Demo & Testing

### Login Credentials (Setelah Seed)

| Role | Username | Password |
|------|----------|----------|
| Owner | `admin` | `admin123` |
| Kasir | `kasir1` | `kasir123` |

### Sample Data
- ✅ 6 Layanan (Potong, Cukur, Creambath, dll)
- ✅ 6 Produk (Pomade, Shampoo, dll)
- ✅ 3 Kapster dengan komisi
- ✅ 3 Diskon/Promo aktif

### Test Scenario
```
1. Login sebagai admin
2. Buka shift (modal Rp 500.000)
3. Buat transaksi:
   - Pilih kapster: Budi Santoso
   - Layanan: Potong Rambut (Rp 35.000)
   - Produk: Pomade (Rp 65.000)
   - Diskon: MEMBER10 (10%)
   - Total: Rp 90.000
   - Bayar tunai: Rp 100.000
4. Cetak struk
5. Lihat laporan dashboard
6. Tutup shift
```

---

## 🔧 Utility Commands

```bash
# Database
npm run migrate          # Create tables
npm run seed             # Insert sample data
npm run backup           # Backup database

# User Management  
npm run create-admin     # Create new admin
npm run reset-password   # Reset user password

# Development
npm run dev              # Dev mode with auto-reload
npm start                # Production mode
```

---

## 🚀 Deployment

### Local Network (Recommended)
1. Windows PC sebagai server
2. Tablet Android sebagai client
3. WiFi lokal yang sama

### Cloud Deployment
- Deploy ke: AWS EC2, DigitalOcean, Heroku
- Database: PostgreSQL
- Domain: Beli domain + SSL cert
- Monitoring: PM2, New Relic

---

## 🛡️ Security

### Frontend
- **HTML5 + CSS3 + Vanilla JavaScript**
- Responsive design untuk tablet Android
- Offline-first dengan Service Worker & IndexedDB
- WebUSB/Bluetooth untuk printer thermal
- Progressive Web App (PWA) - bisa di-install di tablet

### Backend
- **Node.js + Express**
- Database: SQLite (development) / PostgreSQL (production)
- API RESTful
- Autentikasi JWT

### Printer
- ESC/POS protocol
- Koneksi USB/Bluetooth
- Library: escpos-js / WebUSB API
- Fallback: CSS print @page width 58mm

## Struktur Database

- `users` - Data pengguna/kasir
- `kapsters` - Data kapster + komisi
- `services` - Master layanan
- `products` - Master produk + stok
- `customers` - Data pelanggan
- `transactions` - Header transaksi
- `transaction_details` - Detail item transaksi
- `payments` - Detail pembayaran (multi payment)
- `shifts` - Shift kasir (buka/tutup)
- `discounts` - Master diskon/promo

## Alur Penggunaan

1. **Buka Kasir** → Login → Buka shift (catat modal awal)
2. **Pelanggan Datang** → Daftarkan/pilih pelanggan (atau walk-in)
3. **Pilih Layanan** → Tambahkan ke keranjang
4. **Pilih Produk** → Tambahkan ke keranjang (opsional)
5. **Pilih Kapster** → Yang mengerjakan layanan
6. **Hitung Total** → Terapkan diskon/voucher jika ada
7. **Bayar** → Pilih metode (tunai/QRIS/transfer/debit)
8. **Cetak Struk** → Otomatis setelah pembayaran
9. **Tutup Kasir** → Rekap harian, hitung selisih kas

## Instalasi & Setup

```bash
# Clone repository
git clone [repo-url]
cd ininotes

# Install dependencies
npm install

# Setup database
npm run migrate

# Seed data (opsional)
npm run seed

# Development
npm run dev

# Production
npm start
```

## Akses dari Tablet Android

1. Pastikan tablet dan server dalam 1 jaringan WiFi
2. Akses via browser: `http://[IP-SERVER]:3000`
3. Install sebagai PWA: Menu → "Add to Home Screen"
4. Hubungkan printer thermal via Bluetooth

## Konfigurasi Printer

1. Buka Pengaturan → Printer
2. Scan perangkat Bluetooth
3. Pair dengan printer thermal 58mm
4. Test print untuk verifikasi
5. Simpan pengaturan

## Offline Mode

Sistem tetap berjalan tanpa internet:
- Transaksi tersimpan lokal (IndexedDB)
- Sync otomatis saat online kembali
- Queue printer jika koneksi terputus

## Backup & Keamanan

### Security Features
- ✅ JWT authentication dengan expiry
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ SQL injection protection
- ✅ XSS protection (helmet)
- ✅ Activity logging
- ✅ Secure session management

### Backup Strategy
```bash
# Manual backup
npm run backup

# Scheduled backup (Windows Task Scheduler)
# Run daily at 23:00
```

**Backup location:** `backup/pos_backup_YYYYMMDD_HHMMSS.db`

---

## 📊 Performance

- ⚡ Initial load: < 2 detik
- ⚡ Transaction: < 500ms
- ⚡ Print receipt: < 1 detik
- ⚡ Offline sync: < 5 detik

### Optimization
- Database indexes
- Response compression
- Static file caching
- Service worker caching
- Lazy loading

---

## 🌐 Browser Support

| Platform | Browser | Version |
|----------|---------|---------|
| Desktop | Chrome | 90+ |
| Desktop | Firefox | 88+ |
| Desktop | Edge | 90+ |
| Android | Chrome | 90+ |
| iOS | Safari | 14+ |

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2027)
- [ ] WhatsApp notification
- [ ] Dynamic QRIS (Midtrans/Xendit)
- [ ] Excel export reports
- [ ] Multi-branch support

### Version 2.0 (Q3 2027)
- [ ] Native Android app (Flutter)
- [ ] Membership card scanner
- [ ] Loyalty program
- [ ] Advanced inventory

---

## ❓ FAQ

**Q: Apakah gratis?**  
A: Ya, 100% gratis dengan lisensi MIT.

**Q: Bisa pakai di HP?**  
A: Bisa, tapi optimal di tablet (7" ke atas).

**Q: Harus punya internet?**  
A: Tidak, bisa offline. Internet hanya untuk sync data.

**Q: Support printer apa saja?**  
A: Semua thermal printer 58mm dengan ESC/POS protocol.

**Q: Bisa custom?**  
A: Ya, open source jadi bisa dimodifikasi sesuai kebutuhan.

---

## 📞 Support

Butuh bantuan? Hubungi kami:

- 📧 **Email:** support@ininotes.com
- 💬 **WhatsApp:** +62 812-3456-7890
- 🌐 **Website:** https://ininotes.com
- 📱 **Telegram:** @ininotes

**Jam Support:** Senin-Jumat, 09:00-17:00 WIB

---

## 📝 Changelog

### v1.0.0 (2026-11-09)
- 🎉 Initial release
- ✅ Complete POS functionality
- ✅ Thermal printer support
- ✅ PWA with offline mode
- ✅ Multi-user & role management
- ✅ Comprehensive reporting
- ✅ Shift management

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2026 IniNotes POS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- Built with ❤️ for Indonesian Barbershops
- Inspired by modern POS systems
- Thanks to open source community

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ininotes-pos?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ininotes-pos?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ininotes-pos)

---

<div align="center">

**[⬆ Back to Top](#-ininotes-pos---sistem-barbershop)**

Made with 💈 by [IniNotes Team](https://ininotes.com)

</div>
