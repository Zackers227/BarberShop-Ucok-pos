# Navbar Component - Universal Header

## Overview
Navbar component yang reusable untuk semua halaman dengan **5 tombol navigasi** dan fitur responsive untuk mobile & tablet.

---

## Features

### 1. **Komponen Reusable**
- File: `components/Navbar.js`
- Digunakan di semua page utama
- Konsisten di seluruh aplikasi

### 2. **5 Tombol Quick Navigation**
1. 🏠 **Dashboard** - Ke halaman dashboard
2. 📊 **Laporan** - Ke halaman reports (jika punya permission)
3. 📜 **Riwayat** - Ke halaman transactions (jika punya permission)
4. 🛒 **Transaksi** - Ke halaman transaction (jika punya permission)
5. ⏸️ **Pending** - Ke halaman pending-transactions (jika punya permission)

### 3. **Active Page Indicator**
- Tombol page aktif: **biru** (btn-primary)
- Tombol lainnya: **hijau** (btn-success)
- Tombol Pending: **orange** (tetap orange tapi biru saat aktif)

### 4. **Green Box (3 Komponen)**
- 👤 **User Info**: Nama + Role badge
- 🟢 **Shift Status**: Active/Tutup dengan tombol Buka
- 🔴 **Logout**: Tombol logout merah

### 5. **Pending Counter Badge**
- Badge merah dengan angka
- Muncul di tombol Pending jika ada transaksi pending
- Auto refresh setiap load page

### 6. **Permission-Based Display**
- Tombol hanya muncul jika user punya permission
- Dashboard: selalu muncul
- Laporan: `reports` permission
- Riwayat: `transactions` permission
- Transaksi: `transaction_create` permission
- Pending: `transactions` permission

---

## Responsive Layout

### Desktop/Tablet (≥481px)
```
┌─────────────────────────────────────────────────────────────┐
│ [LOGO] ................ [👤 User | 🟢 Shift | 🔴 Logout]   │
│ [🏠 Dashboard][📊 Laporan][📜 Riwayat][🛒 Transaksi][⏸️ Pending] │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (≤480px)
```
┌───────────────────────┐
│ [LOGO]                │
│                       │
│ ┌───────────────────┐ │
│ │ 👤 User - Role    │ │
│ ├───────────────────┤ │
│ │ 🟢 Shift #1       │ │
│ ├───────────────────┤ │
│ │ Logout            │ │
│ └───────────────────┘ │
│                       │
│ [🏠][📊][📜][🛒][⏸️]  │ ← 5 tombol horizontal (scroll)
└───────────────────────┘
```

---

## Usage

### Implementasi di Page

```javascript
import Navbar from '../components/Navbar';

export default function MyPage() {
  return (
    <>
      <Head>
        <title>My Page - POS</title>
      </Head>

      <div className="page-container">
        <Navbar currentPage="dashboard" />  {/* atau "reports", "transactions", "transaction", "pending" */}
        
        <div className="main-content">
          {/* Your page content */}
        </div>
      </div>
    </>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | string | Yes | Nama page aktif untuk highlight button |

### Current Page Values

| Value | Description | Button Highlighted |
|-------|-------------|-------------------|
| `"dashboard"` | Dashboard page | 🏠 Dashboard |
| `"reports"` | Reports page | 📊 Laporan |
| `"transactions"` | Transactions history | 📜 Riwayat |
| `"transaction"` | New transaction | 🛒 Transaksi |
| `"pending"` | Pending transactions | ⏸️ Pending |

---

## Pages Menggunakan Navbar

✅ **Sudah Menggunakan:**
1. `pages/dashboard.js` - currentPage="dashboard"
2. `pages/reports.js` - currentPage="reports"
3. `pages/transactions.js` - currentPage="transactions"
4. `pages/pending-transactions.js` - currentPage="pending"

⏳ **Belum (bisa ditambahkan):**
- `pages/transaction.js` - currentPage="transaction"
- `pages/users.js`
- `pages/customers.js`
- `pages/kapsters.js`
- `pages/services.js`
- `pages/products.js`
- `pages/shifts.js`

---

## Component Structure

### 1. **State Management**
```javascript
const [user, setUser] = useState(null);           // User data dari localStorage
const [activeShift, setActiveShift] = useState(null);  // Shift aktif
const [pendingCount, setPendingCount] = useState(0);   // Jumlah pending transactions
```

### 2. **Data Fetching**
- **checkActiveShift()** - Fetch shift aktif dari `/api/shifts`
- **checkPendingTransactions()** - Fetch pending count dari `/api/transactions`

### 3. **Navigation**
- Router dari Next.js (`useRouter`)
- `router.push('/page')` untuk navigasi
- `handleLogout()` untuk logout (clear localStorage + redirect)

---

## Styling

### CSS Classes
- `.navbar` - Container utama
- `.navbar-row1` - Row 1 (Logo + Green Box)
- `.green-box` - Container 3 komponen
- `.user-info-mobile` - User info section
- `.shift-status-mobile` - Shift status section
- `.logout-btn-mobile` - Logout button
- `.quick-nav-row` - Row 2 (5 tombol navigasi)
- `.quick-nav-btn` - Individual nav buttons

### Media Queries
```css
/* Mobile (≤480px) */
@media (max-width: 480px) {
  - Green box: vertical stack
  - Quick nav: horizontal scroll (flex-direction: row)
  - Tombol: flex: 1, min-width: fit-content
}

/* Tablet/Desktop (≥481px) */
@media (min-width: 481px) {
  - Green box: horizontal
  - Quick nav: horizontal flex
  - Tombol: fixed padding
}
```

---

## Button Colors

### Default State
| Button | Color | Background | Class |
|--------|-------|------------|-------|
| Dashboard | White | Green | btn-success |
| Laporan | White | Green | btn-success |
| Riwayat | White | Green | btn-success |
| Transaksi | White | Green | btn-success |
| Pending | White | Orange | Custom #f59e0b |

### Active State
| Button | Color | Background | Class |
|--------|-------|------------|-------|
| Dashboard | White | Blue | btn-primary |
| Laporan | White | Blue | btn-primary |
| Riwayat | White | Blue | btn-primary |
| Transaksi | White | Blue | btn-primary |
| Pending | White | Light Blue | Custom #0ea5e9 |

---

## Benefits

### ✅ Keuntungan Menggunakan Navbar Component

1. **Consistency** - Semua page punya header yang sama
2. **DRY (Don't Repeat Yourself)** - Code tidak duplikat
3. **Easy Maintenance** - Update 1 file, semua page berubah
4. **Responsive** - Otomatis responsive untuk mobile & tablet
5. **Permission-Based** - Tombol sesuai permission user
6. **Active Indicator** - User tahu posisi page sekarang
7. **Live Data** - Shift status dan pending count selalu update

---

## Code Comparison

### ❌ Before (Manual Navbar per Page)
```javascript
// pages/dashboard.js
<nav className="navbar">
  <Logo />
  <div>
    <button onClick={() => router.push('/reports')}>📊 Laporan</button>
    <button onClick={() => router.push('/transactions')}>📜 Riwayat</button>
    ...
  </div>
</nav>

// pages/reports.js
<nav className="navbar">  ← DUPLICATE CODE
  <Logo />
  <div>
    <button onClick={() => router.push('/dashboard')}>🏠 Dashboard</button>
    ...
  </div>
</nav>
```

### ✅ After (Reusable Component)
```javascript
// pages/dashboard.js
<Navbar currentPage="dashboard" />

// pages/reports.js
<Navbar currentPage="reports" />

// pages/transactions.js
<Navbar currentPage="transactions" />
```

**Result:** 432 lines deleted, 406 lines added (net: -26 lines)

---

## Future Enhancements

### Potential Improvements:
1. ✅ Navbar component - DONE
2. ⏳ Add to transaction page
3. ⏳ Add to management pages (users, customers, etc.)
4. ⏳ Dropdown menu for management pages
5. ⏳ Breadcrumb navigation
6. ⏳ Search bar in navbar
7. ⏳ Notifications dropdown
8. ⏳ Dark mode toggle
9. ⏳ Multi-language support
10. ⏳ Keyboard shortcuts (Ctrl+H for Dashboard, etc.)

---

## Deployment

- **Status:** ✅ Deployed to Production
- **URL:** https://barber-shop-ucok-pos.vercel.app
- **Commit:** `4915913` - "Add reusable Navbar component - 5 buttons with Dashboard"
- **Date:** 2026-11-13
- **Files Changed:** 5 files (406+ / 432- lines)

---

## Testing Checklist

### Desktop/Tablet (≥481px)
- ✅ Logo tampil di kiri
- ✅ Green box tampil di kanan (horizontal)
- ✅ 5 tombol tampil horizontal
- ✅ Tombol active page berwarna biru
- ✅ Pending badge muncul jika ada pending
- ✅ Shift status update otomatis
- ✅ Logout berfungsi

### Mobile (≤480px)
- ✅ Logo tampil di atas
- ✅ Green box stack vertical (full width)
- ✅ 5 tombol horizontal (bisa scroll)
- ✅ Tombol compact dan touch-friendly
- ✅ Pending badge muncul
- ✅ Semua navigasi berfungsi

### Permissions
- ✅ Owner: semua tombol muncul
- ✅ Cashier: sesuai permission
- ✅ Tombol tidak muncul jika no permission

### Navigation
- ✅ Dashboard → ke /dashboard
- ✅ Laporan → ke /reports
- ✅ Riwayat → ke /transactions
- ✅ Transaksi → ke /transaction
- ✅ Pending → ke /pending-transactions
- ✅ Logout → clear localStorage + ke /login

---

## Summary

✅ **Navbar component sekarang universal**
✅ **5 tombol navigasi (tambah Dashboard)**
✅ **Responsive untuk mobile & tablet**
✅ **Active page indicator (biru)**
✅ **Permission-based display**
✅ **Live shift status & pending count**
✅ **Deployed to production**

Semua page utama sekarang menggunakan navbar yang sama!
