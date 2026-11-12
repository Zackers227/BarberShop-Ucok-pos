# Pending Transaction Feature

## Overview
Fitur ini memungkinkan kasir untuk menyimpan transaksi yang belum dibayar (pending) dan memprosesnya nanti saat customer sudah selesai dan siap membayar.

---

## Use Case / Workflow

### Scenario 1: Customer Masih Dalam Proses
```
1. Customer datang, pilih layanan
2. Kasir input transaksi (customer, kapster, items)
3. Kapster sedang kerja, customer belum bayar
4. Kasir klik "Simpan Pending" 
5. Transaksi tersimpan, kasir bisa lanjut customer lain
6. Saat customer selesai, buka "Transaksi Pending"
7. Klik "Bayar Sekarang", pilih metode pembayaran
8. Proses pembayaran selesai
```

### Scenario 2: Multiple Customers Bersamaan
```
Customer A: Potong rambut (pending)
Customer B: Cukur jenggot (pending)
Customer C: Creambath (pending)

Saat A selesai → Bayar → Selesai
Saat C selesai → Bayar → Selesai  
Saat B selesai → Bayar → Selesai
```

---

## Features

### 1. **Save Pending Transaction** ✅
**Location:** Transaction Page

**Button:**
- ✅ **Proses Transaksi** (hijau) - Langsung bayar
- ⏸️ **Simpan Pending** (orange) - Bayar nanti

**Workflow:**
1. Isi form transaksi (customer, kapster, items, diskon)
2. Klik **"Simpan Pending"**
3. Transaksi tersimpan dengan `status = 'pending'`
4. Tidak perlu input metode pembayaran
5. Redirect ke halaman "Transaksi Pending"

**Backend:**
- Status: `pending`
- No payment records created yet
- Stock NOT deducted yet
- Customer stats NOT updated yet
- Transaction saved with all items and discount

---

### 2. **View Pending Transactions** ✅
**Location:** `/pending-transactions`  
**Access:** Dashboard → Transaksi Pending

**Display:**
- Table with all pending transactions
- Columns: No, Waktu, Customer, Kapster, Total, Status, Aksi
- Badge showing total pending count
- Empty state when no pending transactions

**Actions:**
- 👁️ **Detail** - View transaction details
- 💰 **Bayar Sekarang** - Process payment

---

### 3. **Process Payment** ✅
**Location:** Pending Transactions Page → Bayar Sekarang

**Modal Features:**
- Show transaction summary (No, Customer, Kapster, Total)
- Select payment method (TUNAI, QRIS, TRANSFER, DEBIT)
- For TUNAI: Input amount and show change
- For non-TUNAI: Use exact total amount

**What Happens:**
1. Payment modal opens
2. User selects payment method
3. Input payment amount (if TUNAI)
4. Click "Proses Pembayaran"
5. Backend:
   - Updates status from `pending` to `completed`
   - Inserts payment records
   - Deducts stock (if products)
   - Updates customer stats (visits, spending)
   - Updates discount usage count
6. Transaction removed from pending list
7. Appears in transaction history as completed

---

## Database Schema

### Transactions Table
```sql
CREATE TABLE transactions (
    ...
    status VARCHAR(20) DEFAULT 'completed',  -- 'pending' or 'completed'
    ...
);
```

**Status Values:**
- `pending` - Transaction saved but not paid yet
- `completed` - Transaction paid and finalized
- `voided` - Transaction cancelled (existing feature)

---

## API Endpoints

### 1. Create Transaction (Updated)
**POST** `/api/transactions`

**Request Body:**
```json
{
  "customer_id": 1,
  "kapster_id": 2,
  "items": [
    {
      "item_type": "SERVICE",
      "item_id": 1,
      "item_name": "Potong Rambut",
      "quantity": 1,
      "price": 35000
    }
  ],
  "discount_id": null,
  "discount_amount": 0,
  "payments": [],  // Empty for pending
  "status": "pending"  // NEW: pending or completed
}
```

**Changes:**
- Added `status` parameter (default: 'completed')
- `payments` is optional for pending transactions
- Payment validation skipped for pending
- Stock deduction skipped for pending
- Customer stats update skipped for pending

---

### 2. Process Payment (NEW)
**POST** `/api/transactions/[id]/pay`

**Request Body:**
```json
{
  "payments": [
    {
      "payment_method": "TUNAI",
      "amount": 100000,
      "reference_no": null
    }
  ]
}
```

**Response:**
```json
{
  "message": "Pembayaran berhasil diproses",
  "transaction": {
    "id": 5,
    "transaction_no": "BB-20261111-005",
    "status": "completed",
    "total": 95000,
    "payments": [...]
  }
}
```

**Process:**
1. Validate transaction exists and status is 'pending'
2. Validate payment amount >= total
3. Update transaction status to 'completed'
4. Insert payment records
5. Update customer stats
6. Update discount usage
7. Return complete transaction data

---

### 3. Get Pending Transactions
**GET** `/api/transactions?status=pending`

Currently uses client-side filtering. Can be optimized with backend filter.

---

## Files Created/Modified

### New Files:
1. **`pages/pending-transactions.js`** (NEW)
   - Complete pending transactions page
   - Table display with actions
   - Payment modal
   - Process payment handler

2. **`pages/api/transactions/[id]/pay.js`** (NEW)
   - API endpoint for processing payment
   - Transaction validation
   - Status update logic
   - Customer stats update

### Modified Files:
3. **`pages/transaction.js`**
   - Added `isPending` parameter to submit handler
   - Added "Simpan Pending" button
   - Modified payment validation (skip for pending)
   - Modified status parameter

4. **`pages/api/transactions/index.js`**
   - Added `status` parameter support
   - Made `payments` optional for pending
   - Skip payment validation for pending
   - Skip stock/customer updates for pending

5. **`pages/dashboard.js`**
   - Added "Transaksi Pending" quick action card
   - Routes to `/pending-transactions`

---

## User Interface

### Transaction Page - Payment Section
```
┌─────────────────────────────────────────┐
│ 💳 Pembayaran                           │
├─────────────────────────────────────────┤
│ Metode Pembayaran                       │
│ [TUNAI ▼]                               │
│                                         │
│ Jumlah Bayar                            │
│ [100000]                                │
│                                         │
│ Kembalian: Rp 5,000                     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  ✅ Proses Transaksi                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  ⏸️ Simpan Pending (Bayar Nanti)   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Pending Transactions Page
```
┌──────────────────────────────────────────────────────┐
│ ⏸️ Transaksi Pending              [3 Transaksi]     │
├──────────────────────────────────────────────────────┤
│ 📋 Daftar Transaksi Belum Dibayar                    │
│                                                      │
│ No          | Waktu    | Customer | Total   | Aksi  │
│ BB-xxx-001  | 14:30    | John     | 95.000  |       │
│                              [Detail] [Bayar Sekarang]│
│ BB-xxx-002  | 14:35    | Jane     | 120.000 |       │
│                              [Detail] [Bayar Sekarang]│
└──────────────────────────────────────────────────────┘
```

### Payment Modal
```
┌───────────────────────────────────┐
│ 💰 Proses Pembayaran              │
├───────────────────────────────────┤
│ No Transaksi: BB-20261111-001     │
│ Customer: John Doe                │
│ Kapster: Budi Santoso             │
│ Total: Rp 95,000                  │
│                                   │
│ Metode Pembayaran                 │
│ [TUNAI ▼]                         │
│                                   │
│ Jumlah Bayar                      │
│ [100000]                          │
│                                   │
│ Kembalian: Rp 5,000               │
│                                   │
│     [Batal]  [✅ Proses Bayar]    │
└───────────────────────────────────┘
```

---

## Testing Checklist

### Save Pending Transaction
- ✅ Fill transaction form with items
- ✅ Click "Simpan Pending" (no payment required)
- ✅ Alert shows transaction number
- ✅ Redirects to pending transactions page
- ✅ Transaction appears in pending list

### View Pending Transactions
- ✅ Access `/pending-transactions` from dashboard
- ✅ See all pending transactions
- ✅ Badge shows correct count
- ✅ Click "Detail" → Shows transaction info
- ✅ Empty state when no pending transactions

### Process Payment
- ✅ Click "Bayar Sekarang" → Modal opens
- ✅ Select TUNAI → Can input amount, shows change
- ✅ Select QRIS → Uses exact total
- ✅ Select TRANSFER → Uses exact total
- ✅ Select DEBIT → Uses exact total
- ✅ Process payment → Success alert
- ✅ Transaction removed from pending list
- ✅ Transaction appears in transaction history
- ✅ Customer stats updated
- ✅ Stock deducted (if products)

### Edge Cases
- ✅ Insufficient payment amount → Error message
- ✅ Process already completed transaction → Error
- ✅ Multiple pending from same customer → All listed
- ✅ Close modal without paying → Transaction stays pending

---

## Benefits

### For Kasir:
- ✅ Can handle multiple customers simultaneously
- ✅ No need to wait for customer to finish
- ✅ Can save transaction and move to next customer
- ✅ Easy to find and process payment later
- ✅ Prevents forgotten unpaid transactions

### For Barbershop:
- ✅ Better customer flow management
- ✅ Faster service during busy hours
- ✅ Clear visibility of unpaid transactions
- ✅ Accurate transaction tracking
- ✅ Improved cash management

### For Customer:
- ✅ Can browse/wait comfortably while barber works
- ✅ Pay when ready (after service finished)
- ✅ No pressure to pay immediately
- ✅ Better experience during busy hours

---

## Transaction Flow Comparison

### Before (Old Flow):
```
Customer arrives
  ↓
Select items
  ↓
MUST process payment immediately
  ↓
Cannot save if customer not ready
  ↓
Barber waits or customer waits
```

### After (New Flow with Pending):
```
Customer arrives
  ↓
Select items
  ↓
Choose:
  ├─→ Pay now (completed) → Done
  └─→ Save pending → Barber works
                         ↓
                    Customer finishes
                         ↓
                    Process payment → Done
```

---

## Database State Changes

### When Transaction is PENDING:
```sql
-- Transactions
status = 'pending'
created_at = NOW()

-- Payments
(empty - no records)

-- Products
stock = (unchanged)

-- Customers
total_visits = (unchanged)
total_spending = (unchanged)

-- Discounts
usage_count = (unchanged)
```

### When Payment is PROCESSED:
```sql
-- Transactions
status = 'completed' (updated)

-- Payments
(records inserted with payment details)

-- Products (if any)
stock = stock - quantity (updated)

-- Stock History
(records inserted for each product)

-- Customers (if selected)
total_visits = total_visits + 1 (updated)
total_spending = total_spending + total (updated)

-- Discounts (if applied)
usage_count = usage_count + 1 (updated)
```

---

## Security & Validation

### Save Pending:
- ✅ Must have at least one item
- ✅ Must select kapster
- ✅ Customer is optional
- ✅ Payment is NOT required
- ✅ Discount is optional

### Process Payment:
- ✅ Transaction must exist
- ✅ Transaction must be 'pending' status
- ✅ Payment method is required
- ✅ Payment amount must >= total
- ✅ Only authorized user can process

---

## Deployment

**Commit:** `91a0187`  
**Message:** "Add pending transaction feature: save unpaid transactions and process payment later"

**Files Added:**
- `pages/pending-transactions.js`
- `pages/api/transactions/[id]/pay.js`

**Files Modified:**
- `pages/transaction.js`
- `pages/api/transactions/index.js`
- `pages/dashboard.js`

**Deployed to:** Vercel (auto-deploy)  
**Production URL:** https://barber-shop-ucok-pos.vercel.app

---

## Future Enhancements

### Potential Improvements:
1. **Timeout Warning** - Alert if transaction pending too long (e.g., >2 hours)
2. **Cancel Pending** - Add button to cancel/void pending transaction
3. **Backend Filter** - Add query parameter `?status=pending` to API
4. **Auto-refresh** - Auto-refresh pending list every minute
5. **Notification** - Alert kasir when new pending transaction added
6. **Search** - Search pending by customer name or transaction no
7. **Sort** - Sort by time, total, customer name
8. **Print Queue Number** - Print small receipt for customer with queue number
9. **Statistics** - Show average pending time in reports
10. **Multi-tab Sync** - Real-time sync if multiple kasir terminals

---

## Summary

✅ **Pending transaction feature implemented!**

**Main Features:**
- Save unpaid transactions with "Simpan Pending" button
- View all pending transactions in dedicated page
- Process payment later with modal payment form
- Support all payment methods (TUNAI, QRIS, TRANSFER, DEBIT)
- Automatic status update and data sync on payment
- Dashboard quick access button

**Business Value:**
- Improved customer flow during busy hours
- Better multi-customer handling
- Clear visibility of unpaid transactions
- Accurate tracking and reporting
- Enhanced customer experience

**Status:** Ready for production use! 🚀
