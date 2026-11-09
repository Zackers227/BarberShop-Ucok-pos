# Panduan Penggunaan IniNotes POS Barbershop

## Alur Kerja Harian

### 1. Buka Kasir (Start Shift)

**Langkah:**
1. Login ke aplikasi
2. Tap menu **Shift Kasir**
3. Tap **Buka Shift**
4. Masukkan modal awal (uang di laci kasir)
5. Tap **Konfirmasi**

✅ Shift berhasil dibuka - siap melayani transaksi

---

### 2. Proses Transaksi Pelanggan

#### A. Pilih Pelanggan (Opsional)

**Walk-in Customer:**
- Biarkan dropdown **Pelanggan** di pilihan default "Walk-in"

**Pelanggan Terdaftar:**
1. Tap dropdown **Pelanggan**
2. Cari dan pilih nama pelanggan
3. Sistem otomatis load riwayat pelanggan

**Pelanggan Baru:**
1. Tap tombol **+ Pelanggan Baru**
2. Isi data:
   - Nama (required)
   - No. HP
   - Email (opsional)
   - Alamat (opsional)
3. Centang **Member** jika ingin jadikan member
4. Tap **Simpan**

#### B. Pilih Kapster

1. Tap dropdown **Kapster**
2. Pilih kapster yang mengerjakan
3. **WAJIB** dipilih sebelum checkout

#### C. Tambah Layanan

1. Tab **Layanan** sudah aktif secara default
2. Tap kartu layanan yang dipilih:
   - Potong Rambut Regular
   - Potong Rambut + Keramas
   - Cukur Jenggot
   - Creambath
   - Hair Color
   - Smoothing
3. Layanan otomatis masuk ke **Keranjang**

#### D. Tambah Produk (Opsional)

1. Tap tab **Produk**
2. Tap kartu produk yang dibeli:
   - Pomade
   - Shampoo
   - Hair Tonic
   - Wax
   - Gel
3. Produk otomatis masuk ke **Keranjang**

#### E. Atur Quantity

Di keranjang:
- Tap **-** untuk kurangi quantity
- Tap **+** untuk tambah quantity
- Tap **🗑️** untuk hapus item

#### F. Terapkan Diskon (Opsional)

1. Tap tombol **Diskon**
2. Masukkan kode diskon (contoh: `MEMBER10`)
3. Sistem validasi dan terapkan diskon otomatis
4. Diskon tampil di summary

#### G. Proses Pembayaran

1. Pastikan kapster sudah dipilih
2. Tap tombol **Bayar** (besar, hijau)
3. Pilih metode pembayaran:

**Tunai:**
- Pilih **Tunai**
- Masukkan jumlah diterima
- Sistem hitung kembalian otomatis
- Tap **Proses Pembayaran**

**QRIS:**
- Pilih **QRIS**
- Tampilkan QR code ke pelanggan
- Masukkan nomor referensi (opsional)
- Tap **Proses Pembayaran**

**Transfer Bank:**
- Pilih **Transfer**
- Berikan nomor rekening ke pelanggan
- Masukkan nomor referensi transfer
- Tap **Proses Pembayaran**

**Debit/Kartu:**
- Pilih **Debit/Kartu**
- Gesek kartu di mesin EDC
- Masukkan approval code
- Tap **Proses Pembayaran**

4. Struk otomatis dicetak
5. Keranjang dikosongkan
6. Siap transaksi berikutnya

---

### 3. Cetak Ulang Struk

Jika pelanggan minta struk copy:

1. Tap menu **Transaksi**
2. Cari transaksi (terurut dari terbaru)
3. Tap tombol **Print** di transaksi tersebut
4. Struk dicetak dengan label "*** COPY ***"

---

### 4. Void Transaksi (Owner Only)

Jika ada kesalahan transaksi:

1. Tap menu **Transaksi**
2. Tap tombol **Detail** pada transaksi
3. Tap tombol **Void** (merah)
4. Masukkan alasan void
5. Konfirmasi dengan password owner
6. Transaksi di-void dan stok produk dikembalikan

---

### 5. Tutup Kasir (End Shift)

**Di akhir hari/shift:**

1. Hitung uang di laci kasir
2. Tap menu **Shift Kasir**
3. Tap **Tutup Shift**
4. Masukkan saldo akhir (total uang fisik)
5. Sistem hitung otomatis:
   - Total transaksi
   - Saldo yang seharusnya
   - Selisih (lebih/kurang)
6. Tap **Konfirmasi**
7. Laporan shift otomatis tersimpan

---

## Fitur Manajemen Data

### Master Layanan

**Tambah Layanan Baru:**
1. Menu **Layanan** → **Tambah Layanan**
2. Isi data:
   - Nama layanan
   - Harga
   - Durasi (menit)
   - Deskripsi (opsional)
3. Tap **Simpan**

**Edit Layanan:**
1. Tap layanan yang ingin diedit
2. Ubah data
3. Tap **Update**

**Nonaktifkan Layanan:**
1. Tap layanan
2. Toggle **Aktif** ke off
3. Layanan tidak muncul di POS tapi data tetap ada

### Master Produk

**Tambah Produk:**
1. Menu **Produk** → **Tambah Produk**
2. Isi data:
   - Nama produk
   - SKU (opsional, auto-generate)
   - Harga beli
   - Harga jual
   - Stok awal
   - Stok minimal (untuk alert)
   - Satuan (pcs, btl, dll)
3. Tap **Simpan**

**Adjustment Stok:**
1. Tap produk
2. Tap **Sesuaikan Stok**
3. Pilih:
   - **Stok Masuk** (pembelian baru)
   - **Stok Keluar** (rusak/hilang)
4. Masukkan jumlah dan keterangan
5. Tap **Simpan**

**Alert Stok Menipis:**
- Sistem otomatis notif jika stok <= minimal
- Cek di Dashboard atau menu Produk

### Master Kapster

**Tambah Kapster:**
1. Menu **Kapster** → **Tambah Kapster**
2. Isi data:
   - Nama
   - No. HP
   - Persentase komisi (%)
3. Tap **Simpan**

**Edit Kapster:**
1. Tap kapster
2. Ubah data (termasuk komisi)
3. Tap **Update**

### Master Pelanggan

**Lihat Riwayat Pelanggan:**
1. Menu **Pelanggan**
2. Tap nama pelanggan
3. Tampil:
   - Total kunjungan
   - Total spending
   - Riwayat transaksi terakhir

**Update Status Member:**
1. Tap pelanggan
2. Toggle **Member**
3. Member otomatis dapat diskon member

---

## Laporan

### Laporan Penjualan

**Penjualan Harian:**
1. Menu **Laporan** → **Penjualan**
2. Pilih tanggal
3. Tampil:
   - Total transaksi
   - Total penjualan
   - Total diskon
   - Rata-rata transaksi

**Penjualan Bulanan:**
1. Pilih **Group by: Bulan**
2. Pilih range tanggal
3. Export ke Excel (opsional)

### Laporan Kapster

Lihat performa kapster:
1. Menu **Laporan** → **Kapster**
2. Pilih periode
3. Tampil per kapster:
   - Total transaksi
   - Total pendapatan
   - Total komisi yang harus dibayar

### Layanan Terlaris

1. Menu **Laporan** → **Top Services**
2. Pilih periode
3. Tampil layanan teratas by:
   - Jumlah terjual
   - Total pendapatan

### Laporan Metode Bayar

1. Menu **Laporan** → **Pembayaran**
2. Pilih periode
3. Tampil breakdown:
   - Tunai: Rp XXX
   - QRIS: Rp XXX
   - Transfer: Rp XXX
   - Debit: Rp XXX

---

## Tips & Trik

### Transaksi Cepat

1. **Shortcut Layanan Populer:**
   - Atur layanan populer di urutan atas
   - Tap langsung tanpa scroll

2. **Gunakan Walk-in:**
   - Untuk pelanggan jarang, pakai Walk-in
   - Lebih cepat daripada daftar baru

3. **Pre-set Kapster:**
   - Jika 1 kapster dominan, set sebagai default

### Offline Mode

Aplikasi tetap berjalan tanpa internet:
- Transaksi tersimpan lokal
- Sync otomatis saat online kembali
- Printer tetap bisa cetak via Bluetooth

### Keamanan

1. **Logout Otomatis:**
   - Aplikasi auto-logout setelah 8 jam
   - Login ulang untuk keamanan

2. **Role-based Access:**
   - Kasir: Hanya transaksi
   - Owner: Full akses termasuk void & laporan

3. **Log Aktivitas:**
   - Semua aktivitas tercatat
   - Cek di menu Log (owner only)

---

## Troubleshooting Umum

### Printer tidak cetak

1. Cek koneksi Bluetooth
2. Pastikan printer sudah pair
3. Cek kertas printer
4. Restart printer dan reconnect

### Struk tidak lengkap

1. Cek lebar kertas (harus 58mm)
2. Adjust setting printer
3. Test print dari setting

### Diskon tidak berlaku

1. Cek kode diskon benar
2. Cek tanggal berlaku
3. Cek minimal transaksi
4. Cek limit usage

### Kembalian salah hitung

1. Pastikan input jumlah diterima benar
2. Tidak ada karakter selain angka
3. Cek total transaksi sudah termasuk diskon

---

## Kontak Support

Jika ada pertanyaan atau masalah:
- Email: support@ininotes.com
- WhatsApp: +62 812-3456-7890
- Jam kerja: Senin-Jumat 09:00-17:00 WIB
