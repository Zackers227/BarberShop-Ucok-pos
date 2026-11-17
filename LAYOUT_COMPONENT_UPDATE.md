# Layout Component Update - Consistent UI Across All Pages

## 🎯 Objective
Membuat Layout component yang reusable agar sidebar kiri dan navbar atas muncul di **semua halaman**, dan hanya konten utama (area merah) yang berubah.

## 📦 New Component Created

### `components/Layout.js`
- **Purpose:** Wrapper component yang berisi sidebar + navbar + main content area
- **Props:**
  - `children`: Konten yang akan ditampilkan di area merah (main content)
  - `activePage`: Nama halaman aktif untuk highlight menu di sidebar

### Structure:
```
┌─────────────────────────────────────────────────────┐
│ Layout Component                                     │
│  ┌─────────────┬──────────────────────────────────┐ │
│  │             │  Navbar (Logo + User + Shift)    │ │
│  │   Sidebar   ├──────────────────────────────────┤ │
│  │   (Fixed)   │                                  │ │
│  │             │  {children}                      │ │
│  │   - Master  │  ← Area ini berubah tiap page   │ │
│  │   - Apps    │                                  │ │
│  │   - Manaj   │                                  │ │
│  │   - Logout  │                                  │ │
│  │             │                                  │ │
│  └─────────────┴──────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## ✅ Features

### 1. **Sidebar Menu dengan Active State**
- Otomatis highlight menu yang sedang aktif berdasarkan `activePage` prop
- Background biru (#2563eb) untuk menu aktif
- Hover effect untuk menu non-aktif

### 2. **Responsive Design**
- Desktop (> 768px): Sidebar visible, content shifted right
- Mobile (< 768px): Sidebar hidden, content full width

### 3. **Consistent Navigation**
- Semua menu routing sudah ter-setup
- Pending badge counter otomatis update
- Logout functionality included

## 📝 How to Use

### Example: Dashboard Page
```javascript
import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout activePage="dashboard">
      {/* Your page content here */}
      <h1>Dashboard</h1>
      <div>Metric cards...</div>
      <div>Charts...</div>
    </Layout>
  );
}
```

### Example: Reports Page (Laporan)
```javascript
import Layout from '../components/Layout';

export default function Reports() {
  return (
    <Layout activePage="reports">
      {/* Your reports content */}
      <h1>Laporan</h1>
      <div>Report tables...</div>
    </Layout>
  );
}
```

### Example: Users Management
```javascript
import Layout from '../components/Layout';

export default function Users() {
  return (
    <Layout activePage="users">
      {/* Your users management content */}
      <h1>User / Kasir</h1>
      <div>User list...</div>
    </Layout>
  );
}
```

## 🎨 Active Page Values

Use these values for `activePage` prop:

**Main Navigation:**
- `dashboard` → Dashboard
- `reports` → Laporan
- `history` → Riwayat
- `transactions` → Transaksi
- `pending` → Pending

**Management:**
- `users` → User / Kasir
- `customers` → Customer / Pelanggan
- `kapsters` → Kapster / Barberman
- `services` → Layanan / Service
- `products` → Produk / Barang

**Other:**
- `settings` → Aplikasi (Master Settings)

## 🔧 Next Steps

### 1. Update Existing Pages
Convert all existing pages to use Layout component:

**Priority Pages:**
- ✅ `/pages/dashboard.js` - Update to use Layout
- ⏳ `/pages/reports.js` - Create if not exists, use Layout
- ⏳ `/pages/history.js` - Create if not exists, use Layout
- ⏳ `/pages/transactions.js` - Update to use Layout
- ⏳ `/pages/pending.js` - Create if not exists, use Layout
- ⏳ `/pages/users.js` - Update to use Layout
- ⏳ `/pages/customers.js` - Update to use Layout
- ⏳ `/pages/kapsters.js` - Update to use Layout
- ⏳ `/pages/services.js` - Update to use Layout
- ⏳ `/pages/products.js` - Update to use Layout

### 2. Template for New Pages

```javascript
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function PageName() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Page Name - Barbershop Ucok POS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/styles.css" />
      </Head>

      <Layout activePage="pagename">
        {/* Your page content starts here */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
            Page Title
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Page description
          </p>
        </div>

        {/* Main content */}
        <div>
          {/* Your content here */}
        </div>
      </Layout>
    </>
  );
}
```

## ✨ Benefits

1. **DRY (Don't Repeat Yourself)**
   - Sidebar code only exists in one place
   - Navbar integration centralized
   - Easy to update UI globally

2. **Consistency**
   - All pages have same layout structure
   - Navigation always accessible
   - User experience consistent

3. **Maintainability**
   - Change sidebar once, affects all pages
   - Easy to add new menu items
   - Simple to update styling

4. **Developer Experience**
   - Simple API: Just wrap content with `<Layout>`
   - Clear separation of concerns
   - Less boilerplate code

## 📋 Migration Checklist

- [ ] Update `/pages/dashboard.js` to use Layout
- [ ] Create `/pages/reports.js` with Layout
- [ ] Create `/pages/history.js` with Layout
- [ ] Update `/pages/transactions.js` to use Layout
- [ ] Create `/pages/pending.js` with Layout
- [ ] Update management pages (users, customers, etc.)
- [ ] Test all pages
- [ ] Deploy to Vercel

---

**Status:** Layout component created ✅  
**Next:** Update Dashboard page to use Layout component
