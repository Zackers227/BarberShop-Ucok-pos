# 💈 Barbershop Ucok POS v2.0

Complete Point of Sale system for barbershop built with **Next.js 14** and **PostgreSQL (Supabase)**.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Access: `http://localhost:3001`

---

## 🔐 Login Credentials

| Role  | Username | Password  | Access Level          |
|-------|----------|-----------|-----------------------|
| Owner | admin    | admin123  | Full access (all features) |
| Kasir | kasir1   | kasir123  | Limited (no user management) |

---

## ✨ Features

- ✅ **Transaction Management** - Cart system, multiple payment methods
- ✅ **Shift Management** - Open/close shift with cash counting
- ✅ **Reports** - Daily & monthly reports with charts
- ✅ **User Management** - CRUD users (Owner only)
- ✅ **Kapster Management** - Manage barbers with commission tracking
- ✅ **Service Management** - CRUD services with pricing
- ✅ **Product Management** - Stock management with alerts
- ✅ **Customer Management** - Track customer visits and spending
- ✅ **Discount System** - Voucher codes and promotions
- ✅ **Multi-Payment** - Cash, QRIS, Transfer, Debit/Credit
- ✅ **Void Transactions** - Cancel transactions with reason
- ✅ **Modern UI** - Gradient backgrounds, glassmorphism effects

---

## �️ Database

**Provider:** Supabase PostgreSQL  
**Region:** Singapore (ap-southeast-1)  
**Port:** 6543 (Connection Pooler)  
**Tables:** 13 tables with full relational schema

### Connection String:
```
postgresql://postgres.wnwkoxkkumuqxkowdevy:Memekjeber1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, CSS3
- **Backend:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT
- **Deployment:** Vercel
- **ORM:** Raw SQL with pg driver

---

## 📦 Project Structure

```
Barbershop/
├── pages/
│   ├── api/              # API Routes (23 endpoints)
│   │   ├── auth/         # Login, logout, me
│   │   ├── customers/    # Customer CRUD
│   │   ├── discounts/    # Discount CRUD
│   │   ├── kapsters/     # Kapster CRUD
│   │   ├── products/     # Product CRUD
│   │   ├── services/     # Service CRUD
│   │   ├── shifts/       # Shift management
│   │   ├── transactions/ # Transaction processing
│   │   ├── users/        # User management
│   │   └── reports/      # Daily & monthly reports
│   ├── dashboard.js      # Main dashboard
│   ├── login.js          # Login page
│   ├── transaction.js    # POS transaction form
│   ├── transactions.js   # Transaction history
│   ├── shifts.js         # Shift management
│   ├── reports.js        # Reports page
│   ├── users.js          # User management (Owner)
│   ├── kapsters.js       # Kapster management
│   ├── services.js       # Service management
│   └── products.js       # Product management
├── lib/
│   ├── db.js            # Database connection pool
│   └── auth.js          # JWT authentication middleware
├── public/
│   └── css/             # Stylesheets
└── database/
    ├── schema-pg.sql    # PostgreSQL schema
    └── migrate-pg.js    # Migration script
```

---

## 🔧 Utility Scripts

### Debug Shifts
```bash
node test-shift-debug.js
```
Shows all shifts and identifies open/orphaned shifts.

### Fix Orphaned Shifts
```bash
node fix-orphaned-shift.js
```
Automatically closes any orphaned shifts in the database.

---

## 🌐 Deployment

**Production URL:** https://barber-shop-ucok-pos.vercel.app

### Deploy to Vercel

1. Connect GitHub repository to Vercel
2. Add environment variable:
   - `DATABASE_URL` = Your Supabase connection string
3. Deploy automatically on push to main

---

## 📊 Database Schema

### Key Tables:
- **users** - Authentication & authorization
- **shifts** - Cash management per shift
- **transactions** - Sales records
- **transaction_details** - Line items
- **payments** - Payment methods used
- **kapsters** - Barber information
- **services** - Service catalog
- **products** - Inventory management
- **customers** - Customer database
- **discounts** - Promotional codes
- **stock_history** - Inventory tracking
- **activity_logs** - Audit trail

---

## � Troubleshooting

### Cannot Open Shift
Run: `node fix-orphaned-shift.js`

### Database Connection Error
Check:
1. Connection string in `.env.local`
2. Using Connection Pooler (port 6543)
3. Supabase project is active

### Login Not Working
Verify:
1. Username: `admin`, Password: `admin123`
2. Database has users seeded
3. JWT_SECRET is set in environment

---

## 📚 Documentation

- **SHIFT_FIX_SUMMARY.md** - Details on shift management fixes
- **PROJECT_SUMMARY.md** - Complete project documentation
- **API.md** - API endpoint documentation
- **CHANGELOG.md** - Version history

---

## 🔒 Security

- ✅ JWT authentication with 24h expiration
- ✅ bcrypt password hashing
- ✅ Role-based access control
- ✅ SQL injection protection
- ✅ Secure environment variables
- ✅ Owner-only sensitive operations

---

## � Pages Overview

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Login | `/login` | Public | User authentication |
| Dashboard | `/dashboard` | All | Main landing page |
| Transaction | `/transaction` | All | POS checkout form |
| History | `/transactions` | All | Transaction list & void |
| Shifts | `/shifts` | All | Open/close shift |
| Reports | `/reports` | All | Daily & monthly reports |
| Users | `/users` | Owner | User management |
| Kapsters | `/kapsters` | All | Kapster management |
| Services | `/services` | All | Service management |
| Products | `/products` | All | Product & stock management |

---

## 🎨 UI Features

- **Animated Gradients** - 5-color gradient backgrounds
- **Glassmorphism** - Frosted glass effects
- **Live Clock** - Real-time timestamp display
- **Responsive Design** - Works on desktop & tablet
- **Loading States** - Smooth transitions
- **Modal Dialogs** - User-friendly forms
- **Data Tables** - Sortable and filterable
- **Charts** - Visual reports (coming soon)

---

## 🔄 Recent Updates

**v2.0 (Latest) - Nov 11, 2026**
- ✅ Fixed shift opening issues
- ✅ Added automatic timestamps
- ✅ Aligned field names with database schema
- ✅ Removed "Tutup Shift" from dashboard
- ✅ Fixed orphaned shift detection
- ✅ Support for both field name variants
- ✅ Fixed user display name (full_name)

**Previous:**
- Complete Next.js migration from Express
- Supabase PostgreSQL integration
- 9 feature pages with full functionality
- Modern UI redesign with gradients

---

## 📞 Support

**GitHub:** https://github.com/Zackers227/BarberShop-Ucok-pos  
**Issues:** Report bugs via GitHub Issues

---

## 📄 License

MIT License - Free to use and modify

---

**Made with ❤️ for Barbershop Ucok**

*Last Updated: November 11, 2026*
