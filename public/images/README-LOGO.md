# Logo Image Setup

## File Yang Dibutuhkan

Upload file logo PNG dengan nama: **`logo-mensurface-black.png`**

### Spesifikasi File:
- **Format:** PNG dengan background transparan
- **Warna text:** Hitam (#000000)
- **Konten:** 
  - Text utama: "MENSURFACE" (bold, besar)
  - Subtitle: "- BARBER AND SHOP -" (normal, lebih kecil)
- **Ukuran recommended:** 
  - Width: 800-1200px (untuk quality tinggi)
  - Height: auto (maintain aspect ratio)
- **Lokasi:** `public/images/logo-mensurface-black.png`

## Cara Upload Logo:

### Opsi 1: Manual Upload
1. Save logo PNG Anda dengan nama `logo-mensurface-black.png`
2. Copy file ke folder: `C:\Users\Administrator\Barbershop\public\images\`
3. Pastikan nama file exact: `logo-mensurface-black.png`

### Opsi 2: Via Command Line
```bash
# Copy file dari Downloads (sesuaikan path)
copy "C:\Users\Administrator\Downloads\logo.png" "C:\Users\Administrator\Barbershop\public\images\logo-mensurface-black.png"
```

## Verifikasi

Setelah upload, check:
1. File ada di: `public/images/logo-mensurface-black.png`
2. Test di browser: http://localhost:3001/images/logo-mensurface-black.png
3. Harus terlihat logo dengan background transparan

## Penggunaan

Logo ini sudah digunakan di:
- ✅ Login page (`pages/login.js`)

Jika logo sudah di-upload, hapus file ini (README-LOGO.md).
