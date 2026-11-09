# 🌐 Panduan Deploy IniNotes POS ke Online

Panduan lengkap untuk deploy aplikasi ke cloud agar bisa diakses dari mana saja.

---

## 🎯 Pilihan Platform (Gratis)

### Rekomendasi Platform:

1. **Railway.app** ⭐ RECOMMENDED
   - ✅ Gratis $5/bulan credit
   - ✅ PostgreSQL included
   - ✅ Deploy otomatis dari GitHub
   - ✅ Custom domain gratis
   - ✅ SSL certificate otomatis

2. **Render.com**
   - ✅ Gratis dengan PostgreSQL
   - ✅ Auto-deploy
   - ✅ SSL gratis

3. **Fly.io**
   - ✅ Gratis untuk small apps
   - ✅ PostgreSQL support

---

## 🚄 Option 1: Deploy ke Railway.app (TERCEPAT)

### Step 1: Persiapan

1. **Buat akun GitHub** (jika belum punya)
   - https://github.com/signup

2. **Buat akun Railway**
   - https://railway.app/
   - Login dengan GitHub

### Step 2: Push Code ke GitHub

```bash
# Di folder project
git init
git add .
git commit -m "Initial commit"

# Buat repository baru di GitHub, lalu:
git remote add origin https://github.com/USERNAME/ininotes-pos.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy di Railway

1. **Login ke Railway.app**
2. **Klik "New Project"**
3. **Pilih "Deploy from GitHub repo"**
4. **Pilih repository** `ininotes-pos`
5. **Railway akan auto-detect** Node.js app

### Step 4: Tambah PostgreSQL Database

1. Di Railway project, **klik "New"** → **Database** → **Add PostgreSQL**
2. Railway akan create database dan set environment variables otomatis
3. Variable `DATABASE_URL` akan tersedia otomatis

### Step 5: Configure Environment Variables

Di Railway, klik tab **Variables**, tambahkan:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=ganti_dengan_secret_key_yang_kuat_minimal_32_karakter
BUSINESS_NAME=IniNotes Barbershop
BUSINESS_ADDRESS=Jl. Raya Barbershop No. 123
BUSINESS_PHONE=+62 812-3456-7890
```

**DATABASE_URL** sudah otomatis dari PostgreSQL

### Step 6: Setup Database

Railway akan auto-deploy. Setelah deploy selesai:

1. Klik **tab Deployments**
2. Klik **3 dots** → **View Logs**
3. Tunggu sampai server running

Untuk migrate database, ada 2 cara:

**Cara A: Via Railway CLI** (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migration
railway run node database/migrate-pg.js
railway run node database/seed.js
```

**Cara B: Akses via URL**
Buat endpoint di server untuk migrate (sementara):

```javascript
// Tambah di server/index.js (HAPUS setelah migrate!)
app.get('/setup-database', async (req, res) => {
    try {
        const { exec } = require('child_process');
        exec('node database/migrate-pg.js', (err, stdout) => {
            if (err) return res.status(500).send(err.message);
            res.send('Database setup complete!');
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
```

Lalu akses: `https://your-app.railway.app/setup-database`

### Step 7: Dapatkan URL

Railway akan memberikan URL seperti:
```
https://ininotes-pos.up.railway.app
```

**SELESAI!** Aplikasi sudah online dan bisa diakses dari mana saja!

---

## 🎨 Option 2: Deploy ke Render.com

### Step 1: Persiapan

1. **Push code ke GitHub** (seperti di atas)
2. **Buat akun** di https://render.com

### Step 2: Create PostgreSQL Database

1. Di Render Dashboard, klik **New** → **PostgreSQL**
2. Nama: `ininotes-db`
3. Database: `ininotes_pos`
4. User: `ininotes`
5. Region: pilih yang terdekat
6. Plan: **Free**
7. Klik **Create Database**
8. **Copy** Internal Database URL

### Step 3: Deploy Web Service

1. Klik **New** → **Web Service**
2. Connect repository GitHub
3. Pilih `ininotes-pos`
4. Configure:
   - **Name:** ininotes-pos
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 4: Environment Variables

Tambahkan di Render:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=[paste dari PostgreSQL]
JWT_SECRET=ganti_dengan_secret_key_yang_kuat
BUSINESS_NAME=IniNotes Barbershop
BUSINESS_ADDRESS=Jl. Raya Barbershop No. 123
BUSINESS_PHONE=+62 812-3456-7890
```

### Step 5: Deploy & Setup Database

1. Render akan auto-deploy
2. Buka **Shell** dari Render dashboard
3. Jalankan:
```bash
node database/migrate-pg.js
node database/seed.js
```

### Step 6: Akses URL

URL akan seperti:
```
https://ininotes-pos.onrender.com
```

---

## ✈️ Option 3: Deploy ke Fly.io

### Step 1: Install Fly CLI

**Windows:**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login & Launch

```bash
# Login
fly auth login

# Initialize
fly launch

# Follow prompts:
# - App name: ininotes-pos
# - Region: Singapore
# - PostgreSQL: Yes
```

### Step 3: Set Environment Variables

```bash
fly secrets set JWT_SECRET="your-secret-key"
fly secrets set BUSINESS_NAME="IniNotes Barbershop"
fly secrets set BUSINESS_ADDRESS="Jl. Raya Barbershop No. 123"
fly secrets set BUSINESS_PHONE="+62 812-3456-7890"
```

### Step 4: Deploy

```bash
fly deploy
```

### Step 5: Setup Database

```bash
fly ssh console
node database/migrate-pg.js
node database/seed.js
exit
```

---

## 🔧 Update Code untuk PostgreSQL

Sebelum deploy, update file berikut:

### 1. Update package.json

Tambahkan PostgreSQL dependency:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "sqlite3": "^5.1.6",
    ...existing dependencies...
  }
}
```

### 2. Update server/config/database.js

```javascript
// Gunakan PostgreSQL jika online, SQLite jika local
const usePostgres = process.env.DATABASE_URL || process.env.NODE_ENV === 'production';

if (usePostgres) {
    module.exports = require('./database-pg');
} else {
    module.exports = require('./database');
}
```

### 3. Buat Migration Script untuk PostgreSQL

File sudah dibuat: `database/migrate-pg.js`

---

## 🎯 Akses Setelah Deploy

### Dari Tablet Android

1. Buka Chrome
2. Akses URL online (contoh: `https://ininotes-pos.railway.app`)
3. Login: `admin` / `admin123`
4. Menu → **Add to Home Screen**
5. Selesai!

### Dari Mana Saja

- Desktop, laptop, tablet, HP
- Tidak perlu dalam 1 WiFi yang sama
- Akses via internet

---

## 🔒 Security untuk Production

### 1. Ganti Password Default

Setelah deploy, segera ganti password:

```bash
# Via Railway/Render/Fly console
railway run node scripts/reset-password.js
```

Atau via SQL:

```sql
UPDATE users 
SET password = 'hashed_password' 
WHERE username = 'admin';
```

### 2. Ganti JWT Secret

Generate secret key yang kuat:

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasil dan set di Railway/Render environment variables.

### 3. Backup Database

**Railway:**
```bash
railway run pg_dump > backup.sql
```

**Render:**
- Dashboard → Database → **Manual Backup**

**Fly:**
```bash
fly postgres backup create
```

---

## 💰 Biaya

### Railway.app
- **Free tier:** $5/bulan credit
- Cukup untuk: 1 app + PostgreSQL
- Upgrade: $5-20/bulan

### Render.com
- **Free tier:** 750 jam/bulan
- Database: 90 hari expired (perlu recreate)
- Upgrade: $7/bulan

### Fly.io
- **Free tier:** 3 VMs, 3GB storage
- Cukup untuk small app
- Upgrade: Pay as you go

---

## 📊 Monitoring

### Railway
- Dashboard → **Metrics**
- CPU, Memory, Network usage
- Logs real-time

### Render
- Dashboard → **Metrics**
- Logs & monitoring

### Fly
```bash
fly logs
fly status
```

---

## 🔄 Auto Deploy

Setiap kali push ke GitHub, akan auto-deploy:

```bash
git add .
git commit -m "Update feature"
git push
```

Railway/Render/Fly akan detect dan deploy otomatis.

---

## ⚠️ Troubleshooting

### App tidak mau start

1. Cek logs di dashboard
2. Pastikan `PORT` environment variable set
3. Pastikan `DATABASE_URL` tersedia

### Database connection error

1. Cek `DATABASE_URL` format
2. Test koneksi:
```bash
railway run node -e "require('./server/config/database-pg').testConnection()"
```

### Build failed

1. Pastikan `package.json` valid
2. Cek `node_modules` tidak di-commit
3. Pastikan `.gitignore` ada

---

## 📚 Resources

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Fly.io Docs: https://fly.io/docs

---

## ✅ Checklist Deploy

- [ ] Code di push ke GitHub
- [ ] Account Railway/Render/Fly dibuat
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] App deployed
- [ ] Database migrated & seeded
- [ ] Password default diganti
- [ ] JWT_SECRET diganti
- [ ] Test dari tablet
- [ ] PWA installed
- [ ] Printer test (jika ada)

---

## 🎉 Selesai!

Aplikasi sudah online dan bisa diakses dari mana saja!

**URL contoh:**
```
https://ininotes-pos.railway.app
https://ininotes-pos.onrender.com
https://ininotes-pos.fly.dev
```

**Next Steps:**
1. Share URL ke tim kasir
2. Install PWA di tablet
3. Setup printer Bluetooth
4. Mulai transaksi!

---

**Need Help?**  
📧 support@ininotes.com  
💬 WhatsApp: +62 812-3456-7890
