# 🚀 Deploy Next.js ke Vercel + Supabase

Project ini telah di-rewrite dari **Express.js** ke **Next.js** agar kompatibel dengan Vercel serverless platform.

## ✅ Yang Sudah Dilakukan

1. ✅ Convert Express.js → Next.js 14
2. ✅ Convert semua API routes (23 endpoints)
3. ✅ Setup database connection untuk serverless PostgreSQL
4. ✅ Update frontend pages (login, dashboard)
5. ✅ Build test berhasil tanpa error
6. ✅ Push ke GitHub

---

## 📋 Langkah Deploy ke Vercel

### **1. Import Project dari GitHub**

1. Buka https://vercel.com/new
2. Login dengan GitHub Anda
3. Klik **"Import Project"**
4. Pilih repository: `BarberShop-Ucok-pos`
5. Klik **"Import"**

### **2. Konfigurasi Project**

**Project Settings:**
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto)
- **Output Directory**: `.next` (auto)
- **Install Command**: `npm install` (auto)

### **3. Environment Variables**

Klik **"Environment Variables"** dan tambahkan:

```env
DATABASE_URL=postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@db.wnwkoxkkumuqxkowdevy.supabase.co:5432/postgres

JWT_SECRET=barbershop-ucok-secret-key-2024-super-secure

NODE_ENV=production

BUSINESS_NAME=Barbershop Ucok

BUSINESS_ADDRESS=Jl. Example No. 123, Jakarta

BUSINESS_PHONE=081234567890
```

**PENTING:** Pastikan **DATABASE_URL** diisi dengan connection string Supabase Anda yang lengkap!

### **4. Deploy!**

1. Klik **"Deploy"**
2. Tunggu 2-3 menit
3. Selesai! URL akan muncul: `https://barbershop-ucok-pos.vercel.app`

---

## 🧪 Test Setelah Deploy

### **Test 1: Akses Homepage**
```
https://[your-app].vercel.app/
```
Harus redirect ke `/login`

### **Test 2: Akses Login Page**
```
https://[your-app].vercel.app/login
```
Harus muncul form login

### **Test 3: Login dengan Kredensial**
**Username**: `admin`  
**Password**: `admin123`

Jika berhasil → redirect ke `/dashboard`

### **Test 4: Test API Endpoint**
```
curl https://[your-app].vercel.app/api/services
```

Harus return error 401 (karena tidak ada token) ✅

---

## 🔧 Troubleshooting

### **Error: "Internal Server Error"**

**Solusi:**
1. Buka Vercel Dashboard → Project → **Settings** → **Functions**
2. Check **Function Logs** untuk melihat error detail
3. Pastikan `DATABASE_URL` benar dan bisa diakses dari Vercel

### **Error: "Database connection failed"**

**Solusi:**
1. Test connection string di Supabase SQL Editor:
   ```sql
   SELECT 1;
   ```
2. Pastikan Supabase tidak dalam mode "paused"
3. Check apakah IP Vercel di-whitelist (biasanya tidak perlu karena Supabase public)

### **Error: "JWT_SECRET is not defined"**

**Solusi:**
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Pastikan `JWT_SECRET` sudah ditambahkan
3. Klik **"Redeploy"** setelah update environment variables

---

## 📊 Monitoring

### **Check Logs:**
```
Vercel Dashboard → Project → Deployments → [Latest] → Function Logs
```

### **Check Database:**
```
Supabase Dashboard → SQL Editor → Run:
SELECT COUNT(*) FROM users;
```

Harus return 2 (admin + kasir1)

---

## 🎯 Auto-Deploy

Setiap kali Anda push ke GitHub branch `main`, Vercel akan otomatis build dan deploy versi terbaru!

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel akan otomatis detect dan deploy dalam 2-3 menit.

---

## 🔄 Rollback

Jika ada masalah, Anda bisa rollback ke deployment sebelumnya:

1. Vercel Dashboard → Project → **Deployments**
2. Pilih deployment yang stabil
3. Klik **"Promote to Production"**

---

## 📱 PWA & Offline Mode

Setelah deploy, aplikasi bisa:
- ✅ Diinstall di tablet Android sebagai app
- ✅ Cache static assets untuk offline
- ✅ Sync data saat online kembali

---

## 🎉 Selesai!

Barbershop POS Anda sekarang sudah:
- ✅ Online 24/7 tanpa perlu komputer lokal
- ✅ Instant response (no cold start)
- ✅ Auto-deploy setiap push
- ✅ Gratis selamanya di Vercel free tier

**URL Production**: https://pos-barbershop-ucok.vercel.app

---

## 📞 Kredensial Login

### Admin:
- **Username**: `admin`
- **Password**: `admin123`

### Kasir:
- **Username**: `kasir1`
- **Password**: `kasir123`

---

**Enjoy your online Barbershop POS! 💈🚀**
