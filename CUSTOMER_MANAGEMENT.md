# Customer Management Feature

## New Features Added

### 1. **Customer Management Page** ✅
**Location:** `/customers`  
**Access:** Owner only (visible in dashboard management section)

**Features:**
- ✅ View all customers with details
- ✅ Add new customer
- ✅ Edit customer information
- ✅ Delete customer
- ✅ See total visits and spending per customer
- ✅ Member status indicator

**Fields:**
- Name (required)
- Phone (required)
- Email (optional)
- Gender (optional)
- Address (optional)
- Notes (optional)
- Total visits (auto-calculated)
- Total spending (auto-calculated)
- Member status (manual/auto)

---

### 2. **Add Customer from Transaction Page** ✅
**Location:** Transaction form - Customer dropdown

**New UI:**
```
Customer (Opsional)
[Dropdown: Select Customer ▼] [➕ Baru]
```

**Workflow:**
1. Click "➕ Baru" button
2. Modal opens with quick customer form
3. Fill name, phone, email, gender
4. Click "Simpan"
5. Customer added to database
6. Dropdown auto-selects new customer
7. Continue transaction

**Benefits:**
- No need to navigate away from transaction
- Quick customer registration
- Immediate use in current transaction

---

### 3. **Fixed Payment Method Error** ✅

**Problem:**
```
Error: Metode pembayaran harus diisi
```

**Root Cause:**
API expected `payments` array but frontend sent single `payment_method` string.

**API Expected Format:**
```javascript
{
  payments: [
    {
      payment_method: "QRIS",
      amount: 95000,
      reference_no: null
    }
  ]
}
```

**Frontend Was Sending:**
```javascript
{
  payment_method: "QRIS",  // ❌ Wrong format
  total: 95000
}
```

**Solution:**
Updated `handleSubmitTransaction()` to format payment data correctly:

```javascript
const paymentData = [];
if (paymentMethod === 'TUNAI') {
  paymentData.push({
    payment_method: 'TUNAI',
    amount: parseFloat(paymentAmount),
    reference_no: null
  });
} else {
  // For non-cash methods, amount = total
  paymentData.push({
    payment_method: paymentMethod, // QRIS, TRANSFER, DEBIT
    amount: calculateTotal(),
    reference_no: null
  });
}
```

**Now Supports:**
- ✅ TUNAI (with change calculation)
- ✅ QRIS (exact amount)
- ✅ TRANSFER (exact amount)
- ✅ DEBIT (exact amount)

---

## Files Modified

### 1. `pages/transaction.js`
**Changes:**
- Added `showCustomerModal` state
- Added `newCustomer` form state
- Added `handleAddCustomer()` function
- Updated customer dropdown UI with "Baru" button
- Added customer modal JSX
- Fixed payment data format in `handleSubmitTransaction()`
- Added `item_name` to transaction items

### 2. `pages/dashboard.js`
**Changes:**
- Added "Kelola Customer" card in Owner management section
- Routes to `/customers` page

### 3. `pages/customers.js` (NEW)
**Features:**
- Full CRUD for customers
- Table with all customer data
- Modal form for add/edit
- Delete confirmation
- Total visits and spending display
- Member badge indicator

---

## Database Schema

### Customers Table
```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    gender VARCHAR(10),
    birth_date DATE,
    address TEXT,
    notes TEXT,
    total_visits INTEGER DEFAULT 0,           -- Auto-updated on transaction
    total_spending DECIMAL(10,2) DEFAULT 0.00, -- Auto-updated on transaction
    is_member BOOLEAN DEFAULT false,
    member_since DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Auto-Update Logic:**
When transaction is created, customer stats are updated:
```sql
UPDATE customers 
SET total_visits = total_visits + 1,
    total_spending = total_spending + {transaction_total}
WHERE id = {customer_id}
```

---

## API Endpoints

### Customer CRUD
- **GET** `/api/customers` - List all customers
- **POST** `/api/customers` - Create new customer
- **GET** `/api/customers/[id]` - Get customer detail
- **PUT** `/api/customers/[id]` - Update customer
- **DELETE** `/api/customers/[id]` - Soft delete customer

### Transaction with Payment
- **POST** `/api/transactions` - Create transaction
  - Required: `items[]`, `payments[]`
  - Optional: `customer_id`, `kapster_id`, `discount_id`

---

## User Interface

### Customer Management Page
```
┌─────────────────────────────────────────────┐
│ 👥 Kelola Customer    [➕ Tambah Customer] │
├─────────────────────────────────────────────┤
│ 📋 Daftar Customer                          │
│                                             │
│ ID | Nama | HP | Email | Gender | Visits   │
│ #1 | John | 081234 | john@.. | L | 5x     │
│ #2 | Jane | 089876 | jane@.. | P | 12x    │
│                                             │
│ Total Belanja | Member | Aksi              │
│ Rp 500.000    | ✓      | [Edit] [Hapus]   │
│ Rp 1.200.000  | ✓      | [Edit] [Hapus]   │
└─────────────────────────────────────────────┘
```

### Transaction Page - Customer Section
```
┌─────────────────────────────────────────────┐
│ 📝 Data Transaksi                           │
├─────────────────────────────────────────────┤
│ Customer (Opsional)                         │
│ [Walk-in Customer ▼] [➕ Baru]             │
│                                             │
│ Kapster *                                   │
│ [-- Pilih Kapster -- ▼]                    │
└─────────────────────────────────────────────┘
```

### Add Customer Modal (Quick)
```
┌──────────────────────────────────┐
│ 👤 Tambah Customer Baru          │
├──────────────────────────────────┤
│ Nama Lengkap * [_____________]   │
│ Nomor HP *     [_____________]   │
│ Email          [_____________]   │
│ Jenis Kelamin  [-- Pilih -- ▼]  │
│                                  │
│          [Batal]  [Simpan]       │
└──────────────────────────────────┘
```

---

## Testing Checklist

### Customer Management
- ✅ Access `/customers` page (Owner only)
- ✅ Add new customer with all fields
- ✅ Edit existing customer
- ✅ Delete customer (with confirmation)
- ✅ View customer statistics (visits, spending)
- ✅ Member badge display

### Transaction with Customer
- ✅ Select existing customer from dropdown
- ✅ Click "Baru" button → Modal opens
- ✅ Add customer from modal → Auto-selected
- ✅ Process transaction with customer
- ✅ Check customer stats updated

### Payment Methods
- ✅ TUNAI with change calculation
- ✅ QRIS payment (exact amount)
- ✅ TRANSFER payment
- ✅ DEBIT payment
- ✅ No more "Metode pembayaran harus diisi" error

---

## Deployment

**Commits:**
1. `fc95481` - Fix product price and discount value fields
2. `cd200c1` - Add customer management features

**Deployed to:** Vercel (auto-deploy)  
**Production URL:** https://barber-shop-ucok-pos.vercel.app

---

## Next Steps (Future Enhancements)

### Pending Transaction Feature (Requested)
To be implemented in next update:

**Concept:**
- Save transaction as "PENDING" status
- Customer can browse/wait while barber works
- When ready to pay, retrieve pending transaction
- Process payment and mark as "COMPLETED"

**Implementation Plan:**
1. Add `status` field logic: PENDING, COMPLETED, VOIDED
2. Add "Simpan Pending" button on transaction page
3. Create "Pending Transactions" list page
4. Add "Bayar Sekarang" action
5. Update transaction API to handle status updates

**Workflow:**
```
1. Create transaction → Click "Simpan Pending"
2. Transaction saved with status = PENDING
3. Navigate to "Transaksi Pending" page
4. Find customer transaction → Click "Bayar"
5. Payment modal opens → Process payment
6. Status updates to COMPLETED
```

---

## Summary

✅ Customer management page created  
✅ Add customer from transaction (quick modal)  
✅ Payment method error fixed (QRIS, TRANSFER, DEBIT work)  
✅ Customer stats auto-update on transaction  
✅ Owner can manage customer database  
✅ Seamless customer registration during checkout  

**Pending transaction feature** will be implemented in the next update as requested.
