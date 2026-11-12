# 📱 Panduan Print dari HP/Tablet Android & iOS

## 🖨️ Persiapan Printer Thermal

### Jenis Printer yang Didukung:
1. **Bluetooth Thermal Printer** (Paling mudah untuk mobile)
   - Contoh: Zjiang ZJ-5802, Epson TM-P20, iMin D1
2. **WiFi/Network Thermal Printer**
   - Contoh: Epson TM-T82, Star TSP100III
3. **USB Printer** (Butuh OTG adapter untuk Android)

---

## 📱 UNTUK ANDROID

### Metode 1: Bluetooth Printer (RECOMMENDED) ⭐

#### A. Persiapan Printer:
1. **Charge** printer sampai full
2. **Nyalakan** printer
3. **Aktifkan mode pairing** (biasanya tekan tombol power 3-5 detik)
4. Lampu LED akan berkedip biru (mode pairing)

#### B. Setup di Android:
1. **Buka Settings** → **Bluetooth**
2. **Scan** device baru
3. **Pilih** printer Anda (nama biasanya: "BlueTooth Printer", "RPP02", dll)
4. **Pair** - mungkin minta PIN (coba: 0000, 1234, atau 1111)
5. Status harus "Connected"

#### C. Test Print:
1. Buka browser Chrome di HP
2. Buka: `https://barber-shop-ucok-pos.vercel.app`
3. Login dan buat transaksi test
4. Klik detail transaksi
5. Klik tombol **"🖨️ Cetak"**
6. Pilih printer Bluetooth Anda
7. Klik **"Print"**

#### D. Troubleshooting Android:
- **Printer tidak muncul?**
  - Pastikan printer dalam mode pairing
  - Restart Bluetooth HP
  - Unpair dan pair ulang
  
- **Print tapi tidak keluar?**
  - Cek kertas printer tidak habis
  - Pastikan cover printer tertutup rapat
  - Test print dari printer (biasanya tekan tombol feed)

- **Print terpotong?**
  - Ubah ukuran kertas di print dialog
  - Pilih "Paper size: 58mm" atau "80mm"

---

### Metode 2: WiFi/Network Printer

#### Setup:
1. **Hubungkan printer ke WiFi** yang sama dengan HP
2. **Cari IP printer** (biasanya tercetak di struk test print)
3. **Buka browser** di HP
4. **Akses** web app → print → pilih printer WiFi

#### Kelebihan:
- ✅ Bisa multi-device
- ✅ Jarak lebih jauh
- ✅ Lebih stabil

#### Kekurangan:
- ❌ Butuh WiFi router
- ❌ Setup lebih kompleks

---

### Metode 3: USB Printer + OTG

#### Yang Dibutuhkan:
- OTG adapter (USB-C ke USB-A)
- Kabel USB printer
- HP Android dengan USB OTG support

#### Setup:
1. **Colok** OTG adapter ke HP
2. **Hubungkan** printer via USB
3. Android akan auto-detect printer
4. Print seperti biasa

---

## 🍎 UNTUK iOS (iPhone/iPad)

### ⚠️ KETERBATASAN iOS:
iOS **sangat terbatas** untuk print ke thermal printer karena:
- Tidak support Bluetooth Serial Port Profile (SPP)
- Hanya support AirPrint protocol
- Thermal printer jarang yang support AirPrint

### Solusi untuk iOS:

#### Opsi 1: Printer dengan AirPrint Support
**Printer yang support:**
- Epson TM-m30 (with AirPrint)
- Star mC-Print3
- Harga lebih mahal (~3-5 juta)

**Setup:**
1. Hubungkan printer ke WiFi yang sama
2. iPhone auto-detect via AirPrint
3. Print langsung dari browser

#### Opsi 2: Gunakan App Khusus (Workaround)
1. **Install app** seperti:
   - "Bluetooth Printer" by Sudobility
   - "PrintHand Mobile Print"
   - "Printer Pro"
2. Print via share menu iOS
3. Pilih app printer → pilih printer

#### Opsi 3: RECOMMENDED - Gunakan Android Saja ✅
Karena kompleksitas iOS, **lebih praktis gunakan tablet Android** untuk kasir.

**Keuntungan Android:**
- ✅ Support semua jenis printer
- ✅ Setup mudah
- ✅ Lebih murah
- ✅ Flexible

---

## 🎯 REKOMENDASI SETUP TERBAIK

### Untuk Barbershop Kecil-Menengah:

**Hardware:**
1. **Tablet Android** (7-10 inch)
   - Samsung Tab A8 / Lenovo Tab M10
   - Harga: 1.5-3 juta
   
2. **Bluetooth Thermal Printer 58mm**
   - iMin D1 / Zjiang ZJ-5802 / RPP02N
   - Harga: 300-800 ribu
   
3. **Stand tablet** + **Cash drawer** (optional)

**Total investasi: ±2-4 juta** (lebih murah dari iPad + AirPrint printer)

---

## 📝 LANGKAH INSTALASI DI ANDROID (LENGKAP)

### Step 1: Download & Setup
```
1. Buka Chrome di Android
2. Pergi ke: https://barber-shop-ucok-pos.vercel.app
3. Login dengan akun kasir
4. Klik menu (⋮) → "Add to Home Screen"
5. Beri nama: "Barbershop POS"
6. Sekarang ada icon di home screen (seperti app)
```

### Step 2: Pairing Printer Bluetooth
```
1. Settings → Bluetooth → ON
2. Nyalakan printer → Mode pairing
3. Tap nama printer di list
4. Pair (PIN: 0000 atau 1234)
5. Status: Connected
```

### Step 3: Test Print
```
1. Buka app Barbershop POS
2. Buat transaksi test
3. Klik "Detail" → "Cetak"
4. Pilih printer Bluetooth
5. Atur paper size: 58mm atau 80mm
6. Print!
```

### Step 4: Setting Agar Selalu Terhubung
```
1. Settings → Bluetooth
2. Tap icon ⚙️ di samping nama printer
3. Centang "Auto-reconnect"
4. Printer akan otomatis connect saat nyala
```

---

## 🔧 TROUBLESHOOTING UMUM

### 1. Print Blank (Kertas kosong keluar)
**Penyebab:**
- Kertas terpasang terbalik
- Thermal paper sudah expired

**Solusi:**
- Balik kertas (sisi thermal menghadap ke bawah)
- Ganti kertas baru

### 2. Print Terpotong/Tidak Lengkap
**Penyebab:**
- Paper size tidak sesuai
- Margin terlalu besar

**Solusi:**
- Set paper size yang benar (58mm atau 80mm)
- Buka print preview → More settings → Margins: None

### 3. Printer Tidak Terdeteksi
**Penyebab:**
- Printer belum mode pairing
- Bluetooth HP bermasalah

**Solusi:**
- Restart printer dan HP
- Unpair → Pair ulang
- Clear Bluetooth cache HP

### 4. Print Lambat
**Penyebab:**
- Koneksi Bluetooth lemah
- Printer low battery

**Solusi:**
- Dekatkan HP ke printer
- Charge printer

---

## 💡 TIPS & BEST PRACTICES

### Untuk Kasir:
1. **Charge printer setiap malam** (jangan sampai low battery)
2. **Simpan roll kertas cadangan** (minimal 2-3 roll)
3. **Test print di awal shift** untuk memastikan printer siap
4. **Bersihkan printer head** seminggu sekali (pakai alkohol swab)

### Untuk Owner:
1. **Backup data transaksi** rutin
2. **Monitor stok kertas** thermal
3. **Simpan nomor service** printer jika ada masalah
4. **Training kasir** cara ganti kertas dan basic troubleshooting

---

## 📞 SUPPORT

Jika masih ada masalah:
1. **Screenshot** error message
2. **Catat** merek & tipe printer
3. **Test** dengan device lain
4. **Contact** support teknis

---

## ✅ CHECKLIST AKHIR

Sebelum mulai operasional:
- [ ] Printer paired dengan HP/Tablet
- [ ] Test print berhasil
- [ ] Kertas thermal terisi penuh
- [ ] App sudah di home screen
- [ ] Kasir sudah training cara print
- [ ] Backup roll kertas tersedia
- [ ] Charger printer siap

**SIAP OPERASIONAL!** 🎉

