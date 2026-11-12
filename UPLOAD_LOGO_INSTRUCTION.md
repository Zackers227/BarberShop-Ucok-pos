# 📸 Instruksi Upload Logo PNG

## ⚠️ PENTING - ACTION REQUIRED

Logo PNG perlu di-upload ke project untuk mengganti text logo di halaman login.

---

## 📋 LANGKAH-LANGKAH

### 1️⃣ Simpan File Logo
Simpan file logo PNG yang Anda miliki dengan spesifikasi:
- **Background:** Transparan
- **Text color:** Hitam (#000000)
- **Content:** "MENSURFACE" + "- BARBER AND SHOP -"

### 2️⃣ Rename File
Rename file logo menjadi: **`logo-mensurface-black.png`**

### 3️⃣ Copy ke Folder Project
Copy file ke lokasi ini:
```
C:\Users\Administrator\Barbershop\public\images\logo-mensurface-black.png
```

**Cara termudah:**
1. Buka Windows Explorer
2. Navigate ke folder: `C:\Users\Administrator\Barbershop\public\images\`
3. Paste file `logo-mensurface-black.png` di sana

### 4️⃣ Verifikasi
Setelah copy, pastikan file ada di:
```
C:\Users\Administrator\Barbershop\public\images\logo-mensurface-black.png
```

---

## 🔍 ALTERNATIVE: Via Command Line

Jika logo ada di Downloads folder:
```bash
copy "C:\Users\Administrator\Downloads\logo-mensurface-black.png" "C:\Users\Administrator\Barbershop\public\images\logo-mensurface-black.png"
```

Sesuaikan path sesuai lokasi file logo Anda.

---

## ✅ SETELAH UPLOAD

1. **Test di localhost:**
   ```bash
   npm run dev
   ```
   Buka: http://localhost:3001/login
   
2. **Commit changes:**
   ```bash
   git add public/images/logo-mensurface-black.png
   git commit -m "feat: Add MENSURFACE logo PNG for login page"
   git push origin main
   ```

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## 🎯 HASIL AKHIR

Setelah upload, halaman login akan menampilkan:
- Logo PNG image (bukan text)
- Background putih dengan logo hitam
- Lebih professional dan sesuai branding

---

## ❓ TROUBLESHOOTING

**Problem:** Logo tidak muncul di halaman login
**Solution:**
1. Check nama file exact: `logo-mensurface-black.png` (lowercase)
2. Check lokasi: `public/images/` bukan `public/image/` atau folder lain
3. Refresh browser (Ctrl+F5)
4. Check browser console untuk error

**Problem:** Logo terlalu besar/kecil
**Solution:** Edit `pages/login.js` dan ubah `maxWidth: '400px'` ke ukuran yang diinginkan

---

## 📝 STATUS SAAT INI

- [x] Login page code updated (sudah siap)
- [x] Fallback text logo (jika image tidak ada)
- [ ] **Upload logo PNG** ⬅️ **PENDING - ACTION REQUIRED**
- [ ] Test localhost
- [ ] Commit & push
- [ ] Deploy production

---

## 💡 CATATAN

Code sudah disiapkan dengan **fallback**: jika logo PNG belum di-upload, akan menampilkan text "MENSURFACE" sementara. Tapi untuk hasil terbaik, upload logo PNG image.

**File yang sudah diupdate:**
- `pages/login.js` - Menggunakan logo PNG image
- Build successful ✅

**Waiting for:** Logo PNG file upload

---

Setelah logo di-upload, hapus file instruksi ini (UPLOAD_LOGO_INSTRUCTION.md).
