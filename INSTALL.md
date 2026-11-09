# Panduan Instalasi IniNotes POS Barbershop

## Prasyarat

- **Node.js** versi 16 atau lebih baru
- **NPM** atau **Yarn**
- Tablet Android dengan browser modern (Chrome/Edge)
- Printer thermal 58mm dengan koneksi Bluetooth

## Instalasi Server

### 1. Clone atau Extract Project

```bash
cd /path/to/project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
# Jalankan migrasi untuk membuat tabel
npm run migrate

# Isi data awal (opsional)
npm run seed
```

### 4. Konfigurasi Environment

Copy file `.env.example` ke `.env` dan sesuaikan:

```bash
copy .env.example .env
```

Edit `.env` dan ubah:
- `JWT_SECRET` - Ganti dengan kunci rahasia yang aman
- `BUSINESS_NAME`, `BUSINESS_ADDRESS`, `BUSINESS_PHONE` - Info bisnis Anda

### 5. Jalankan Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## Setup Tablet Android

### 1. Cari IP Address Server

Di komputer server, jalankan:

**Windows:**
```cmd
ipconfig
```

**Linux/Mac:**
```bash
ifconfig
```

Cari IP Address (contoh: `192.168.1.100`)

### 2. Akses dari Tablet

1. Pastikan tablet dan server dalam jaringan WiFi yang sama
2. Buka browser Chrome di tablet
3. Akses: `http://[IP-SERVER]:3000`
   - Contoh: `http://192.168.1.100:3000`

### 3. Install sebagai PWA

1. Di browser Chrome, buka menu (⋮)
2. Pilih **"Add to Home Screen"** atau **"Install App"**
3. Beri nama: **IniNotes POS**
4. Tap **Add** atau **Install**
5. Icon aplikasi akan muncul di home screen

### 4. Login

**Akun Default:**
- **Username:** `admin`
- **Password:** `admin123`

**PENTING:** Segera ganti password setelah login pertama!

## Setup Printer Thermal 58mm

### 1. Pair Printer dengan Tablet

1. Aktifkan Bluetooth di tablet
2. Nyalakan printer thermal
3. Buka **Settings → Bluetooth**
4. Scan dan pair dengan printer

### 2. Hubungkan di Aplikasi

1. Buka aplikasi IniNotes POS
2. Tap menu **Pengaturan** (jika ada)
3. Pilih **Printer**
4. Tap **Connect Bluetooth Printer**
5. Pilih printer dari daftar

### 3. Test Print

Lakukan transaksi test dan cetak struk untuk memastikan printer berfungsi.

## Konfigurasi Lanjutan

### Port Custom

Jika ingin menggunakan port lain (selain 3000):

```bash
# Edit .env
PORT=8080
```

Restart server dan akses dengan port baru.

### Database Production

Untuk production, gunakan PostgreSQL:

1. Install PostgreSQL
2. Buat database baru
3. Update konfigurasi database di `server/config/database.js`

### SSL/HTTPS (Opsional)

Untuk keamanan lebih, gunakan HTTPS dengan:
- Reverse proxy (Nginx)
- SSL certificate (Let's Encrypt)

### Auto Start Server

**Windows (PM2):**
```bash
npm install -g pm2
pm2 start server/index.js --name ininotes-pos
pm2 startup
pm2 save
```

**Linux (systemd):**
Buat file `/etc/systemd/system/ininotes-pos.service`

## Troubleshooting

### Server tidak bisa diakses dari tablet

1. Pastikan firewall tidak memblokir port 3000
2. Cek IP address server sudah benar
3. Pastikan server dan tablet dalam jaringan yang sama

**Windows Firewall:**
```cmd
netsh advfirewall firewall add rule name="IniNotes POS" dir=in action=allow protocol=TCP localport=3000
```

### Printer tidak terdeteksi

1. Pastikan Bluetooth aktif di kedua device
2. Unpair dan pair ulang printer
3. Restart aplikasi
4. Coba printer lain untuk test

### Database error

```bash
# Hapus database dan buat ulang
del database\pos.db
npm run migrate
npm run seed
```

### Port sudah digunakan

```bash
# Ganti port di .env
PORT=3001
```

## Backup Data

### Manual Backup

```bash
copy database\pos.db backup\pos_backup_YYYYMMDD.db
```

### Scheduled Backup (Windows)

Buat script `backup.bat`:
```batch
@echo off
set BACKUP_DIR=C:\path\to\backup
set DATE=%date:~-4,4%%date:~-7,2%%date:~-10,2%
copy database\pos.db "%BACKUP_DIR%\pos_%DATE%.db"
```

Tambahkan ke Task Scheduler untuk backup otomatis.

## Update Aplikasi

```bash
git pull origin main
npm install
npm run migrate
npm start
```

## Support

Untuk bantuan lebih lanjut, hubungi developer atau baca dokumentasi lengkap di README.md

## Security Checklist Production

- [ ] Ganti `JWT_SECRET` dengan nilai yang aman
- [ ] Ganti password default admin
- [ ] Aktifkan HTTPS
- [ ] Setup firewall yang benar
- [ ] Backup database secara berkala
- [ ] Update Node.js dan dependencies secara rutin
- [ ] Monitor log untuk aktivitas mencurigakan
