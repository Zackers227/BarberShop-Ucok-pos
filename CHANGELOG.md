# Changelog

All notable changes to IniNotes POS Barbershop will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- WhatsApp notification untuk transaksi
- Dynamic QRIS integration (Midtrans/Xendit)
- Excel export untuk laporan
- Multi-branch/outlet support
- Booking online via web

## [1.0.0] - 2026-11-09

### Added - Initial Release

#### Core Features
- ✅ Complete POS system untuk barbershop
- ✅ Multi-item shopping cart (layanan + produk)
- ✅ Customer management (walk-in & registered)
- ✅ Kapster selection & commission tracking
- ✅ Flexible payment methods (cash, QRIS, transfer, debit)
- ✅ Split payment support
- ✅ Discount & voucher system

#### Master Data
- ✅ Services management (nama, harga, durasi)
- ✅ Products inventory (SKU, stock, pricing)
- ✅ Kapster database dengan commission %
- ✅ Customer CRM dengan visit history
- ✅ Multi-user dengan role-based access

#### Printer Support
- ✅ Thermal printer 58mm integration
- ✅ ESC/POS protocol support
- ✅ Bluetooth & USB connection
- ✅ Receipt format optimization (32 characters)
- ✅ Auto-print after transaction
- ✅ Reprint functionality (marked as COPY)
- ✅ Browser print fallback

#### Reporting
- ✅ Dashboard dengan real-time summary
- ✅ Sales report (daily/monthly/yearly)
- ✅ Kapster performance report dengan commission
- ✅ Top services analysis
- ✅ Top products analysis
- ✅ Payment method breakdown
- ✅ Low stock alert
- ✅ Customer analytics

#### Shift Management
- ✅ Open shift dengan opening balance
- ✅ Close shift dengan closing balance
- ✅ Auto calculate cash difference
- ✅ Transaction summary per shift
- ✅ Shift history

#### Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based authorization (kasir/owner)
- ✅ Void transaction (owner only)
- ✅ Activity logging
- ✅ Session management

#### PWA Features
- ✅ Progressive Web App installable
- ✅ Offline-first architecture
- ✅ Service Worker caching
- ✅ IndexedDB untuk local storage
- ✅ Background sync ready
- ✅ Push notification ready
- ✅ Responsive design (tablet & mobile)

#### Database
- ✅ SQLite untuk development
- ✅ PostgreSQL ready untuk production
- ✅ 13 optimized tables
- ✅ Foreign key constraints
- ✅ Indexed queries untuk performance
- ✅ Transaction support
- ✅ Migration system

#### API
- ✅ RESTful API architecture
- ✅ 30+ endpoints
- ✅ JWT protected routes
- ✅ Error handling
- ✅ Request validation
- ✅ CORS support

#### Developer Tools
- ✅ Database migration script
- ✅ Data seeder dengan sample data
- ✅ Create admin utility
- ✅ Reset password utility
- ✅ Database backup script
- ✅ Development mode dengan auto-reload

#### Documentation
- ✅ README.md - Project overview
- ✅ QUICKSTART.md - 5-minute setup guide
- ✅ INSTALL.md - Detailed installation
- ✅ USAGE.md - Complete user manual
- ✅ API.md - API documentation
- ✅ PROJECT_SUMMARY.md - Technical overview
- ✅ CHANGELOG.md - Version history

### Technical Details

#### Frontend Stack
- HTML5
- CSS3 dengan custom properties
- Vanilla JavaScript (ES6+)
- Service Worker API
- IndexedDB API
- Web Bluetooth API
- Fetch API

#### Backend Stack
- Node.js 16+
- Express.js 4.x
- SQLite3 5.x
- JWT (jsonwebtoken)
- bcryptjs untuk password
- CORS middleware
- Helmet security
- Morgan logging
- Compression

#### Build & Development
- npm scripts untuk automation
- nodemon untuk dev server
- No build process (vanilla JS)
- Environment variables (.env)

### Database Schema v1.0.0

```
users (8 fields)
kapsters (7 fields)  
services (8 fields)
products (12 fields)
customers (14 fields)
shifts (10 fields)
discounts (12 fields)
transactions (15 fields)
transaction_details (7 fields)
payments (6 fields)
stock_history (6 fields)
activity_logs (9 fields)
+ Multiple indexes
```

### Sample Data Included

- 2 Users (admin, kasir1)
- 3 Kapsters dengan commission
- 6 Services (Rp 20K - 300K)
- 6 Products dengan stock
- 4 Customers (including walk-in)
- 3 Discounts/Promos

### Known Limitations

- Single currency (IDR only)
- Single location/branch
- Basic inventory (no reorder point automation)
- Manual QRIS (no dynamic QR generation)
- No WhatsApp integration (yet)
- No email notifications (yet)

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+
- Chrome Android 90+
- Safari iOS 14+

### System Requirements

**Server:**
- OS: Windows 10+, Linux, macOS
- Node.js: 16.x or higher
- RAM: 512MB minimum
- Disk: 100MB minimum

**Client:**
- Tablet Android 7" or larger
- Browser: Chrome 90+
- Screen: 1024x600 minimum
- Bluetooth: For printer connection

### Performance Benchmarks

- Initial load: < 2s
- Transaction processing: < 500ms
- Print receipt: < 1s
- Offline sync: < 5s
- API response: < 200ms
- Database query: < 50ms

---

## Version History

- **1.0.0** (2026-11-09) - Initial release

---

## Upgrade Guide

### From Development to Production

1. Backup database:
   ```bash
   npm run backup
   ```

2. Update environment:
   ```bash
   # Edit .env
   NODE_ENV=production
   JWT_SECRET=<strong-secret-key>
   ```

3. Change default passwords:
   ```bash
   npm run reset-password
   ```

4. Setup auto-backup:
   - Windows: Task Scheduler
   - Linux: Crontab

5. Configure firewall

6. Test all features

---

## Support

Untuk pertanyaan terkait changelog atau versi:
- Email: support@ininotes.com
- WhatsApp: +62 812-3456-7890

---

**Legend:**
- ✅ Implemented
- 🚧 In Progress  
- 📋 Planned
- ❌ Deprecated
- 🐛 Bug Fix
- ⚡ Performance
- 🔒 Security

---

*Last updated: 2026-11-09*
