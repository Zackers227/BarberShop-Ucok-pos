const { withAuth } = require('../../../lib/auth');
const { query, getClient } = require('../../../lib/db');

// Generate nomor transaksi: BB-YYYYMMDD-XXX
async function generateTransactionNo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  const result = await query(
    `SELECT transaction_no FROM transactions 
     WHERE transaction_no LIKE $1 
     ORDER BY id DESC LIMIT 1`,
    [`BB-${dateStr}-%`]
  );

  let sequence = 1;
  if (result.rows.length > 0) {
    const lastSeq = parseInt(result.rows[0].transaction_no.split('-')[2]);
    sequence = lastSeq + 1;
  }

  return `BB-${dateStr}-${String(sequence).padStart(3, '0')}`;
}

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all transactions with filters
      const { date, customer_id, kapster_id, limit = 50, offset = 0 } = req.query;

      let sql = `
        SELECT t.*, 
               c.name as customer_name,
               k.name as kapster_name,
               u.full_name as cashier_name
        FROM transactions t
        LEFT JOIN customers c ON t.customer_id = c.id
        LEFT JOIN kapsters k ON t.kapster_id = k.id
        LEFT JOIN users u ON t.user_id = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (date) {
        sql += ` AND DATE(t.created_at) = $${paramIndex}`;
        params.push(date);
        paramIndex++;
      }

      if (customer_id) {
        sql += ` AND t.customer_id = $${paramIndex}`;
        params.push(customer_id);
        paramIndex++;
      }

      if (kapster_id) {
        sql += ` AND t.kapster_id = $${paramIndex}`;
        params.push(kapster_id);
        paramIndex++;
      }

      sql += ` ORDER BY t.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await query(sql, params);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      // Create transaction
      const {
        customer_id,
        kapster_id,
        items, // [{ item_type, item_id, item_name, quantity, price }]
        discount_id,
        discount_amount,
        payments, // [{ payment_method, amount, reference_no }]
        notes
      } = req.body;

      // Validasi
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Item transaksi tidak boleh kosong' });
      }

      if (!payments || payments.length === 0) {
        return res.status(400).json({ error: 'Metode pembayaran harus dipilih' });
      }

      // Hitung subtotal
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal - (discount_amount || 0);

      // Validasi total pembayaran
      const totalPayment = payments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPayment < total) {
        return res.status(400).json({ error: 'Total pembayaran kurang dari total transaksi' });
      }

      // Generate nomor transaksi
      const transaction_no = await generateTransactionNo();

      // Get current shift
      const shiftResult = await query(
        'SELECT id FROM shifts WHERE user_id = $1 AND closed_at IS NULL ORDER BY id DESC LIMIT 1',
        [req.user.id]
      );
      const shift_id = shiftResult.rows.length > 0 ? shiftResult.rows[0].id : null;

      // Start transaction
      const client = await getClient();

      try {
        await client.query('BEGIN');

        // Insert transaksi
        const transactionResult = await client.query(
          `INSERT INTO transactions (
            transaction_no, shift_id, customer_id, kapster_id, user_id,
            subtotal, discount_id, discount_amount, total, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *`,
          [
            transaction_no,
            shift_id,
            customer_id || null,
            kapster_id || null,
            req.user.id,
            subtotal,
            discount_id || null,
            discount_amount || 0,
            total,
            notes || null
          ]
        );

        const transaction_id = transactionResult.rows[0].id;

        // Insert detail transaksi
        for (const item of items) {
          await client.query(
            `INSERT INTO transaction_details (
              transaction_id, item_type, item_id, item_name, quantity, price, subtotal
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              transaction_id,
              item.item_type,
              item.item_id,
              item.item_name,
              item.quantity,
              item.price,
              item.price * item.quantity
            ]
          );

          // Update stok jika produk
          if (item.item_type === 'product') {
            await client.query(
              'UPDATE products SET stock = stock - $1 WHERE id = $2',
              [item.quantity, item.item_id]
            );

            // Catat riwayat stok
            await client.query(
              `INSERT INTO stock_history (product_id, type, quantity, notes, user_id)
               VALUES ($1, 'out', $2, $3, $4)`,
              [item.item_id, item.quantity, `Transaksi ${transaction_no}`, req.user.id]
            );
          }
        }

        // Insert pembayaran
        for (const payment of payments) {
          await client.query(
            `INSERT INTO payments (transaction_id, payment_method, amount, reference_no, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              transaction_id,
              payment.payment_method,
              payment.amount,
              payment.reference_no || null,
              payment.notes || null
            ]
          );
        }

        // Update customer stats jika ada
        if (customer_id) {
          await client.query(
            `UPDATE customers 
             SET total_visits = total_visits + 1,
                 total_spending = total_spending + $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [total, customer_id]
          );
        }

        // Update discount usage
        if (discount_id) {
          await client.query(
            'UPDATE discounts SET usage_count = usage_count + 1 WHERE id = $1',
            [discount_id]
          );
        }

        await client.query('COMMIT');

        // Get complete transaction data
        const completeResult = await query(
          `SELECT t.*, 
                  c.name as customer_name,
                  k.name as kapster_name,
                  u.full_name as cashier_name
           FROM transactions t
           LEFT JOIN customers c ON t.customer_id = c.id
           LEFT JOIN kapsters k ON t.kapster_id = k.id
           LEFT JOIN users u ON t.user_id = u.id
           WHERE t.id = $1`,
          [transaction_id]
        );

        // Get details
        const detailsResult = await query(
          'SELECT * FROM transaction_details WHERE transaction_id = $1',
          [transaction_id]
        );

        // Get payments
        const paymentsResult = await query(
          'SELECT * FROM payments WHERE transaction_id = $1',
          [transaction_id]
        );

        client.release();

        return res.status(201).json({
          message: 'Transaksi berhasil dibuat',
          transaction: {
            ...completeResult.rows[0],
            details: detailsResult.rows,
            payments: paymentsResult.rows
          }
        });

      } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        throw error;
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Transactions API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export default withAuth(handler);
