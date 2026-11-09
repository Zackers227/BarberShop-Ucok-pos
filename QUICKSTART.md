# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan IniNotes POS Barbershop dalam 5 menit!

## Prerequisites

- Node.js versi 16+ ([Download](https://nodejs.org/))
- Tablet Android dengan Chrome
- Printer thermal 58mm (opsional untuk testing)

## Instalasi dalam 5 Langkah

### 1️⃣ Install Dependencies

```bash
npm install
```

⏱️ Waktu: ~2 menit

### 2️⃣ Setup Database

```bash
npm run migrate
npm run seed
```

✅ Database dibuat dengan data contoh

### 3️⃣ Jalankan Server

```bash
npm start
```

✅ Server berjalan di http://localhost:3000

### 4️⃣ Login

Buka browser dan akses: http://localhost:3000

**Default Login:**
- Username: `admin`
- Password: `admin123`

### 5️⃣ Mulai Transaksi

1. **Buka Shift** → Masukkan modal awal
2. **Pilih Kapster** → Wajib sebelum checkout
3. **Tambah Layanan** → Tap kartu layanan
4. **Bayar** → Pilih metode pembayaran
5. **Cetak Struk** → Otomatis setelah bayar

🎉 **Selesai!** Anda siap menggunakan POS

---

## Akses dari Tablet

### Cari IP Address Server

**Windows:**
```cmd
ipconfig
```
Cari IPv4 Address (contoh: `192.168.1.100`)

**Linux/Mac:**
```bash
ifconfig | grep inet
```

### Buka di Tablet

1. Pastikan tablet dan server dalam WiFi yang sama
2. Buka Chrome di tablet
3. Akses: `http://192.168.1.100:3000`
4. Login dengan kredensial di atas

### Install sebagai App

1. Menu Chrome → **Add to Home Screen**
2. Nama: **IniNotes POS**
3. Tap **Install**

Sekarang POS bisa dibuka seperti aplikasi native! 📱

---

## Setup Printer (Opsional)

1. Pair printer Bluetooth dengan tablet
2. Di aplikasi → **Connect Printer**
3. Pilih printer dari daftar
4. Test print dari menu Setting

---

## Tips Cepat

### Keyboard Shortcuts
- `Ctrl/Cmd + K` → Fokus ke search
- `Esc` → Tutup modal
- `Enter` → Submit form

### Transaksi Cepat
1. Gunakan Walk-in untuk pelanggan umum
2. Set kapster default untuk 1-man show
3. Gunakan diskon MEMBER10 untuk member

### Offline Mode
Aplikasi tetap jalan tanpa internet:
- ✅ Transaksi tersimpan lokal
- ✅ Sync otomatis saat online
- ✅ Printer Bluetooth tetap berfungsi

---

## Troubleshooting

### Port 3000 sudah digunakan?

Edit file `.env`:
```
PORT=3001
```

### Tidak bisa akses dari tablet?

1. Cek firewall Windows/Mac
2. Pastikan IP address benar
3. Pastikan WiFi sama

**Windows Firewall:**
```cmd
netsh advfirewall firewall add rule name="IniNotes POS" dir=in action=allow protocol=TCP localport=3000
```

### Database error?

Reset database:
```bash
del database\pos.db
npm run migrate
npm run seed
```

---

## Command Cheatsheet

```bash
# Development
npm run dev          # Auto-reload on changes

# Database
npm run migrate      # Buat tabel
npm run seed         # Isi data contoh
npm run backup       # Backup database

# User Management
npm run create-admin       # Buat admin baru
npm run reset-password     # Reset password user

# Production
npm start            # Production mode
```

---

## Next Steps

✅ **Customize Business Info**
- Edit `.env` → nama, alamat, telepon barbershop

✅ **Tambah Data Master**
- Layanan barbershop Anda
- Produk yang dijual
- Data kapster
- Customer member

✅ **Setup Shift**
- Buka shift dengan modal awal
- Mulai terima transaksi
- Tutup shift di akhir hari

✅ **Ganti Password**
```bash
npm run reset-password
```

✅ **Backup Rutin**
- Manual: `npm run backup`
- Auto: Setup Windows Task Scheduler

---

## Production Checklist

Sebelum go-live:

- [ ] Ganti JWT_SECRET di `.env`
- [ ] Ganti password admin default
- [ ] Setup firewall dengan benar
- [ ] Test printer thermal
- [ ] Backup database ke cloud
- [ ] Amankan akses WiFi
- [ ] Training staff kasir

---

## Support

📧 Email: support@ininotes.com  
💬 WhatsApp: +62 812-3456-7890  
📚 Docs: Baca README.md dan USAGE.md

---

## Demo Data

Setelah seed, tersedia:

**Users:**
- admin / admin123 (Owner)
- kasir1 / kasir123 (Kasir)

**Layanan:**
- Potong Rambut Regular - Rp 35.000
- Potong Rambut + Keramas - Rp 50.000
- Cukur Jenggot - Rp 20.000
- Creambath - Rp 75.000
- Hair Color - Rp 150.000
- Smoothing - Rp 300.000

**Produk:**
- Pomade Murray's - Rp 65.000
- Pomade Suavecito - Rp 120.000
- Shampoo Anti Dandruff - Rp 40.000
- Hair Tonic - Rp 50.000

**Diskon:**
- MEMBER10 (10% untuk member)
- PROMO25K (potongan Rp 25.000)

Selamat menggunakan IniNotes POS! 💈✂️
