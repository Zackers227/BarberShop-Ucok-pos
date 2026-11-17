# Urgent Fixes Needed - User Reported Issues

## 🔴 CRITICAL ISSUES

### 1. **Missing Sidebar & Navbar on Multiple Pages**

**Affected Pages:**
- ❌ `/transaction` (Transaksi Baru) - No sidebar/navbar
- ❌ `/users` (Kelola User/Kasir) - No sidebar/navbar
- ❌ `/customers` (Customer/Pelanggan) - No sidebar/navbar
- ❌ `/kapsters` (Kapster/Barberman) - No sidebar/navbar
- ❌ `/services` (Layanan/Service) - No sidebar/navbar
- ❌ `/products` (Produk/Barang) - No sidebar/navbar

**Status:**
- ✅ Laporan & Riwayat - SUDAH ADA sidebar (working!)
- ✅ Pending - SUDAH ADA sidebar (working!)
- ❌ Yang lain - BELUM

**Priority:** 🔴 **HIGHEST** - Ini yang paling urgent karena affect banyak page

**Solution:** 
Update semua page tersebut untuk wrap dengan `<Layout>` component

**Estimated Time:** 30-40 minutes untuk semua 6 pages

---

### 2. **Dashboard Cards - Hardcoded Data**

**Problem:** 
Cards di dashboard menampilkan data hardcoded (9.787, 3.7 Miliar, dll) bukan data real dari database

**Cards Affected:**
- Total Item Terjual: 9.787 (hardcoded)
- Total Transaksi: 2.182 (hardcoded)
- Total Income: 3.7 Miliar (hardcoded)  
- Total Pelanggan Aktif: 14 (hardcoded)

**Priority:** 🟡 **MEDIUM** - Dashboard masih berfungsi tapi data tidak akurat

**Solution:**
- Fetch real data dari API /api/transactions
- Fetch customer count dari API /api/customers
- Calculate totals dari data real
- Update state dan render dynamic data

**Estimated Time:** 15-20 minutes

---

### 3. **Printer Not Working - Cetak Struk**

**Problem:**
Saat cetak struk di halaman Transaksi Baru, printer tidak bekerja/tidak tercetak

**Details:**
- Alert "Struk sedang dicetak..." muncul
- Tapi printer tidak print
- Kemungkinan issue:
  - Printer API tidak ter-trigger
  - Print command tidak kompatibel dengan thermal printer
  - Browser print dialog tidak muncul

**Priority:** 🟡 **MEDIUM-HIGH** - Feature penting tapi tidak blocking

**Solution:**
1. Check printer.js logic
2. Verify ESC/POS command
3. Test browser print API
4. Add fallback untuk manual print

**Estimated Time:** 20-30 minutes (perlu testing dengan printer)

---

## 📋 Recommended Action Plan

### Phase 1: Fix Sidebar & Navbar (URGENT) ⏱️ 40 mins
**Impact:** 6 pages become consistent
**Order:**
1. `/pages/transaction.js` (Transaksi Baru) - Most used
2. `/pages/users.js` (User Management)
3. `/pages/customers.js` (Customer Management)
4. `/pages/kapsters.js` (Kapster Management)
5. `/pages/services.js` (Service Management)
6. `/pages/products.js` (Product Management)

### Phase 2: Fix Dashboard Data ⏱️ 20 mins
**Impact:** Dashboard shows real data
**Tasks:**
- Add API calls to fetch real transactions
- Calculate totals dynamically
- Update card values with real data
- Add loading states

### Phase 3: Fix Printer ⏱️ 30 mins
**Impact:** Receipt printing works
**Tasks:**
- Debug printer.js
- Test ESC/POS commands
- Verify browser print API
- Add error handling

---

## 🎯 Priority Decision

**Recommendation:** Start with **Phase 1** (Sidebar & Navbar)

**Reason:**
- Affects most pages (6 pages)
- User experience consistency
- Navigation is critical
- Quick wins (similar code pattern)

**After Phase 1 completed:**
User can decide: Dashboard data or Printer next?

---

## 📝 Current Status

**Pages WITH Sidebar & Navbar:** 5/11 (45%)
- ✅ Dashboard
- ✅ Laporan  
- ✅ Riwayat
- ✅ Transaksi (list)
- ✅ Pending

**Pages WITHOUT Sidebar & Navbar:** 6/11 (55%)
- ❌ Transaction (new)
- ❌ Users
- ❌ Customers
- ❌ Kapsters
- ❌ Services
- ❌ Products

**Target:** 100% pages have sidebar & navbar

---

**Last Updated:** 2026-11-17  
**Waiting for:** User decision on priority
