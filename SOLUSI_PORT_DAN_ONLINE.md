# ✅ Solusi: Port & Database Online

## 🎯 Masalah yang Diselesaikan

1. ✅ Port 3000 sudah digunakan → **Diganti ke port 3001**
2. ✅ Database lokal → **Support PostgreSQL online**

---

## 🚀 Cara Menggunakan

### Local Development (Sekarang)

```bash
# Install dependencies (tambah PostgreSQL driver)
npm install

# Jalankan dengan port 3001
npm start

# Akses di:
http://localhost:3001
```

✅ **Port sudah diganti ke 3001**

---

## 🌐 Deploy ke Online (3 Pilihan)

### Option 1: Railway.app ⭐ RECOMMENDED

**Kenapa Railway?**
- ✅ Paling mudah & cepat
- ✅ PostgreSQL included gratis
- ✅ Auto-deploy dari GitHub
- ✅ SSL certificate otomatis
- ✅ Custom domain gratis

**Langkah Cepat:**

1. **Push ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/ininotes-pos.git
git push -u origin main
```

2. **Deploy di Railway**
   - Login: https://railway.app (pakai GitHub)
   - New Project → Deploy from GitHub
   - Pilih repo `ininotes-pos`
   - Add PostgreSQL database
   - Done! URL: `https://ininotes-pos.up.railway.app`

3. **Setup Database**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & link
railway login
railway link

# Migrate database
railway run node database/migrate-pg.js
```

**Selesai!** Aplikasi sudah online.

---

### Option 2: Render.com

**Gratis dengan PostgreSQL**

1. Push ke GitHub (sama seperti di atas)
2. Login: https://render.com
3. New → PostgreSQL (create database dulu)
4. New → Web Service (connect GitHub repo)
5. Set environment variables (copy DATABASE_URL dari PostgreSQL)
6. Deploy!

---

### Option 3: Fly.io

**Install CLI & Deploy**

```bash
# Windows
iwr https://fly.io/install.ps1 -useb | iex

# Login & launch
fly auth login
fly launch

# Deploy
fly deploy
```

---

## 📋 Environment Variables untuk Online

Saat deploy, set variables berikut:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db  # Auto dari Railway/Render
JWT_SECRET=ganti_dengan_secret_kuat_minimal_32_karakter
BUSINESS_NAME=IniNotes Barbershop
BUSINESS_ADDRESS=Jl. Raya Barbershop No. 123
BUSINESS_PHONE=+62 812-3456-7890
```

---

## 🔄 Cara Kerja Auto-Switch Database

Aplikasi **otomatis detect** database yang dipakai:

```javascript
// Jika ada DATABASE_URL → Pakai PostgreSQL (online)
// Jika tidak ada → Pakai SQLite (local)
```

**Local Development:**
- Pakai SQLite (file `database/pos.db`)
- Port 3001

**Online Production:**
- Pakai PostgreSQL (dari Railway/Render/Fly)
- Port 3000 (atau auto dari platform)

---

## 📱 Akses dari Tablet Setelah Online

### Sebelum (Local):
```
http://192.168.1.100:3000  ← Harus WiFi sama
```

### Setelah (Online):
```
https://ininotes-pos.railway.app  ← Dari mana saja!
```

**Cara Install PWA:**
1. Buka Chrome di tablet
2. Akses URL online
3. Menu → **Add to Home Screen**
4. Done! Seperti app native

---

## 💰 Biaya

### Railway.app
- **Gratis:** $5/bulan credit
- Cukup untuk POS + database
- Tidak perlu kartu kredit

### Render.com
- **Gratis:** 750 jam/bulan
- Database: 90 hari (recreate gratis lagi)

### Fly.io
- **Gratis:** 3 VMs, 3GB storage
- Cukup untuk small business

---

## 🔒 Security Checklist

Setelah deploy online:

- [ ] **Ganti password default**
  ```bash
  railway run node scripts/reset-password.js
  ```

- [ ] **Generate JWT secret kuat**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Copy hasil dan set di environment variables

- [ ] **Test dari tablet**
  - Login berhasil?
  - Transaksi jalan?
  - Printer connect?

- [ ] **Backup database**
  ```bash
  railway run pg_dump > backup.sql
  ```

---

## 📊 Perbandingan

| Fitur | Local (Sekarang) | Online (Setelah Deploy) |
|-------|------------------|-------------------------|
| **Akses** | Hanya WiFi sama | Dari mana saja |
| **Database** | SQLite (lokal) | PostgreSQL (cloud) |
| **Port** | 3001 | 3000 (atau auto) |
| **URL** | `http://localhost:3001` | `https://app.railway.app` |
| **SSL** | Tidak | Ya (otomatis) |
| **Backup** | Manual | Cloud auto-backup |
| **Tablet** | Harus dekat PC | Bisa dari mana saja |
| **Downtime** | PC mati = mati | Always online 24/7 |

---

## 🚀 Quick Start Guide

### Untuk Local (Port 3001)

```bash
# 1. Install
npm install

# 2. Setup database SQLite
npm run migrate
npm run seed

# 3. Run
npm start

# 4. Akses
http://localhost:3001
```

### Untuk Online (Railway)

```bash
# 1. Push ke GitHub
git init && git add . && git commit -m "init"
git remote add origin [your-repo-url]
git push -u origin main

# 2. Deploy di Railway.app
# - Login dengan GitHub
# - New Project → From GitHub
# - Add PostgreSQL

# 3. Setup database
npm install -g @railway/cli
railway login
railway link
railway run node database/migrate-pg.js

# 4. Akses
https://your-app.railway.app
```

---

## 📚 Dokumentasi Lengkap

- **Setup Online:** Baca [DEPLOY_ONLINE.md](DEPLOY_ONLINE.md)
- **Quick Start:** Baca [QUICKSTART.md](QUICKSTART.md)
- **User Manual:** Baca [USAGE.md](USAGE.md)

---

## ❓ FAQ

**Q: Harus deploy online atau bisa tetap local?**  
A: Bisa keduanya! Local pakai port 3001, online nanti port 3000.

**Q: Kalau deploy online, data local hilang?**  
A: Tidak hilang. Local tetap pakai SQLite, online pakai PostgreSQL (terpisah).

**Q: Bisa akses dari 2 tablet bersamaan?**  
A: Bisa! Setelah online, unlimited devices bisa akses.

**Q: Printer Bluetooth masih jalan?**  
A: Ya, printer connect langsung ke tablet, tidak peduli server local/online.

**Q: Berapa lama setup online?**  
A: ~15 menit (jika sudah punya GitHub account).

**Q: Kalau Railway/Render tutup, data hilang?**  
A: Backup berkala dengan `pg_dump` atau export dari dashboard.

---

## 💬 Need Help?

**Stuck saat deploy?**
- 📧 Email: support@ininotes.com
- 💬 WhatsApp: +62 812-3456-7890
- 📚 Docs: [DEPLOY_ONLINE.md](DEPLOY_ONLINE.md)

---

## ✅ Checklist

### Local Development (Now)
- [x] Port diganti ke 3001
- [x] SQLite database support
- [x] PostgreSQL support ready
- [ ] Test di `http://localhost:3001`

### Deploy Online (Next)
- [ ] Push code ke GitHub
- [ ] Signup Railway/Render/Fly
- [ ] Deploy aplikasi
- [ ] Setup PostgreSQL
- [ ] Migrate database
- [ ] Test dari tablet
- [ ] Ganti password default
- [ ] Setup backup

---

**🎉 Selamat! Sekarang Anda punya pilihan:**
1. ✅ **Local:** Port 3001, akses dari WiFi sama
2. 🌐 **Online:** Deploy ke Railway, akses dari mana saja

**Rekomendasi:** Deploy ke online agar bisa akses dari tablet di mana saja, tidak tergantung PC!

---

*Last updated: 2026-11-09*
