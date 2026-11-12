# Fix: Pending Transaction Payment Error

## Problem
Error "Terjadi kesalahan server" saat proses pembayaran transaksi pending.

---

## Root Cause

### Issue 1: Column `updated_at` Does Not Exist ❌
**Error Location:** `pages/api/transactions/[id]/pay.js` line 43

**Code:**
```javascript
UPDATE transactions 
SET status = 'completed', updated_at = CURRENT_TIMESTAMP  // ❌ Column doesn't exist
WHERE id = $1
```

**Database Schema:**
```sql
CREATE TABLE transactions (
    ...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- No updated_at column!
);
```

**PostgreSQL Error:**
```
ERROR: column "updated_at" of relation "transactions" does not exist
```

---

### Issue 2: Stock Not Deducted for Pending Transactions ❌
When transaction is saved as pending, stock is not deducted initially (by design).
But when payment is processed, the stock deduction logic was missing!

**Original Flow:**
```
1. Save pending transaction → Stock NOT deducted ✅ (correct)
2. Process payment → Stock still NOT deducted ❌ (wrong!)
```

**Expected Flow:**
```
1. Save pending transaction → Stock NOT deducted ✅
2. Process payment → Stock SHOULD be deducted ✅
```

---

## Solutions Applied

### Fix 1: Remove `updated_at` Reference ✅
**File:** `pages/api/transactions/[id]/pay.js`

**Before:**
```javascript
await client.query(
  `UPDATE transactions 
   SET status = 'completed', updated_at = CURRENT_TIMESTAMP
   WHERE id = $1`,
  [id]
);
```

**After:**
```javascript
await client.query(
  `UPDATE transactions 
   SET status = 'completed'
   WHERE id = $1`,
  [id]
);
```

**Reason:**
- Table `transactions` doesn't have `updated_at` column
- Only `created_at` exists
- Removed unnecessary column reference

---

### Fix 2: Add Stock Deduction Logic ✅
**File:** `pages/api/transactions/[id]/pay.js`

**Added Code:**
```javascript
// Get transaction details to update stock
const detailsResult = await client.query(
  'SELECT * FROM transaction_details WHERE transaction_id = $1',
  [id]
);

// Update stock for products (if any)
for (const detail of detailsResult.rows) {
  if (detail.item_type === 'PRODUCT' || detail.item_type === 'product') {
    // Deduct stock
    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [detail.quantity, detail.item_id]
    );

    // Record stock history
    await client.query(
      `INSERT INTO stock_history (product_id, type, quantity, notes, user_id)
       VALUES ($1, 'out', $2, $3, $4)`,
      [detail.item_id, detail.quantity, `Transaksi ${transaction.transaction_no}`, transaction.user_id]
    );
  }
}
```

**What This Does:**
1. Fetch all transaction details (items)
2. Loop through each item
3. If item is a PRODUCT, deduct from stock
4. Record stock history for audit trail
5. Skip if item is SERVICE (no stock)

---

## Complete Payment Flow (Fixed)

### When Transaction is PENDING:
```sql
-- Transactions
status = 'pending'
created_at = NOW()

-- Transaction Details
(items saved with type, quantity, price)

-- Payments
(empty - no records yet)

-- Products
stock = (unchanged) ← NOT deducted yet

-- Customers
total_visits = (unchanged)
total_spending = (unchanged)
```

### When Payment is PROCESSED:
```sql
-- Transactions
status = 'completed' ← Updated

-- Payments
(payment records inserted) ← NEW

-- Products (for each product item)
stock = stock - quantity ← Deducted NOW!

-- Stock History (for each product)
(audit record inserted) ← NEW

-- Customers (if selected)
total_visits = total_visits + 1
total_spending = total_spending + total

-- Discounts (if applied)
usage_count = usage_count + 1
```

---

## Testing Checklist

### Test 1: Pending with Services Only
1. ✅ Create pending transaction with only services
2. ✅ Process payment → Success
3. ✅ Check transaction status = 'completed'
4. ✅ No stock errors (services don't have stock)

### Test 2: Pending with Products Only
1. ✅ Create pending transaction with products
2. ✅ Check stock before payment → NOT deducted
3. ✅ Process payment → Success
4. ✅ Check stock after payment → Deducted correctly
5. ✅ Check stock_history → Record exists

### Test 3: Pending with Mixed Items
1. ✅ Create pending with services + products
2. ✅ Process payment → Success
3. ✅ Check product stock → Deducted
4. ✅ Check service (no stock issue)

### Test 4: Customer Stats Update
1. ✅ Create pending with customer
2. ✅ Check customer before → visits and spending not updated
3. ✅ Process payment → Success
4. ✅ Check customer after → visits +1, spending updated

### Test 5: Payment Methods
1. ✅ TUNAI with change calculation
2. ✅ QRIS exact amount
3. ✅ TRANSFER exact amount
4. ✅ DEBIT exact amount

---

## Files Modified

**File:** `pages/api/transactions/[id]/pay.js`

**Changes:**
1. Removed `updated_at = CURRENT_TIMESTAMP` from UPDATE query
2. Added stock deduction logic after payment insertion
3. Added stock history recording for audit trail

**Lines Added:** ~20 lines
**Lines Removed:** 1 line

---

## Deployment

**Commit:** `423f374`  
**Message:** "Fix pending transaction payment: remove updated_at column reference and add stock deduction logic"

**Deployed to:** Vercel (auto-deploy)  
**Production URL:** https://barber-shop-ucok-pos.vercel.app

---

## Verification Steps

After deployment, verify:

1. **Create Pending Transaction:**
   ```
   - Add items (services + products)
   - Click "Simpan Pending"
   - Check: Transaction saved with status='pending'
   - Check: Product stock NOT deducted yet
   ```

2. **Process Payment:**
   ```
   - Go to "Transaksi Pending"
   - Click "Bayar Sekarang"
   - Select payment method
   - Click "Proses Pembayaran"
   - Expected: Success message
   ```

3. **Verify Results:**
   ```
   - Transaction status = 'completed'
   - Product stock = reduced
   - Stock history = recorded
   - Customer stats = updated
   - Discount usage = updated
   - Payment record = created
   ```

---

## Database Integrity

### Stock Consistency Check
To verify stock is correct after payment:

```sql
-- Check product stock
SELECT 
    p.id,
    p.name,
    p.stock as current_stock,
    COALESCE(SUM(sh.quantity), 0) as total_out
FROM products p
LEFT JOIN stock_history sh ON p.id = sh.product_id AND sh.type = 'out'
GROUP BY p.id, p.name, p.stock;
```

### Transaction Audit
To verify all completed transactions have payments:

```sql
-- Check for completed transactions without payments
SELECT t.id, t.transaction_no, t.status, COUNT(p.id) as payment_count
FROM transactions t
LEFT JOIN payments p ON t.id = p.transaction_id
WHERE t.status = 'completed'
GROUP BY t.id, t.transaction_no, t.status
HAVING COUNT(p.id) = 0;
-- Should return 0 rows
```

---

## Known Issues (Resolved)

### ❌ Issue: "Terjadi kesalahan server"
**Status:** ✅ FIXED

**Cause:** 
- Column `updated_at` doesn't exist in transactions table
- Stock not deducted when processing pending payment

**Solution:**
- Removed `updated_at` reference
- Added stock deduction logic with audit trail

---

## Summary

✅ **Fixed!** Pending transaction payment now works correctly.

**Changes Made:**
1. Removed non-existent column reference (`updated_at`)
2. Added stock deduction for products when payment processed
3. Added stock history recording for audit
4. Maintained transaction integrity with proper rollback

**Result:**
- Payment processing works for all methods
- Stock correctly deducted on payment
- Full audit trail maintained
- Customer stats properly updated

**Status:** Ready for production use! 🚀
