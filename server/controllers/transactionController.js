const db = require('../config/database');

// Generate nomor transaksi: BB-YYYYMMDD-XXX
const generateTransactionNo = async () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    const lastTransaction = await db.get(
        `SELECT transaction_no FROM transactions 
         WHERE transaction_no LIKE ? 
         ORDER BY id DESC LIMIT 1`,
        [`BB-${dateStr}-%`]
    );

    let sequence = 1;
    if (lastTransaction) {
        const lastSeq = parseInt(lastTransaction.transaction_no.split('-')[2]);
        sequence = lastSeq + 1;
    }

    return `BB-${dateStr}-${String(sequence).padStart(3, '0')}`;
};

exports.create = async (req, res) => {
    try {
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
        const shift = await db.get(
            'SELECT id FROM shifts WHERE user_id = ? AND closed_at IS NULL ORDER BY id DESC LIMIT 1',
            [req.user.id]
        );

        // Start transaction
        await db.run('BEGIN TRANSACTION');

        try {
            // Insert transaksi
            const transaction = await db.run(
                `INSERT INTO transactions (
                    transaction_no, shift_id, customer_id, kapster_id, user_id,
                    subtotal, discount_id, discount_amount, total, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    transaction_no,
                    shift?.id,
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

            const transaction_id = transaction.id;

            // Insert detail transaksi
            for (const item of items) {
                await db.run(
                    `INSERT INTO transaction_details (
                        transaction_id, item_type, item_id, item_name, quantity, price, subtotal
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
                    await db.run(
                        'UPDATE products SET stock = stock - ? WHERE id = ?',
                        [item.quantity, item.item_id]
                    );

                    // Catat riwayat stok
                    await db.run(
                        `INSERT INTO stock_history (product_id, type, quantity, notes, user_id)
                         VALUES (?, 'out', ?, ?, ?)`,
                        [item.item_id, item.quantity, `Transaksi ${transaction_no}`, req.user.id]
                    );
                }
            }

            // Insert pembayaran
            for (const payment of payments) {
                await db.run(
                    `INSERT INTO payments (transaction_id, payment_method, amount, reference_no, notes)
                     VALUES (?, ?, ?, ?, ?)`,
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
                await db.run(
                    `UPDATE customers 
                     SET total_visits = total_visits + 1,
                         total_spending = total_spending + ?,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [total, customer_id]
                );
            }

            // Update discount usage
            if (discount_id) {
                await db.run(
                    'UPDATE discounts SET usage_count = usage_count + 1 WHERE id = ?',
                    [discount_id]
                );
            }

            await db.run('COMMIT');

            // Get complete transaction data
            const completeTransaction = await db.get(
                `SELECT t.*, 
                        c.name as customer_name,
                        k.name as kapster_name,
                        u.full_name as cashier_name
                 FROM transactions t
                 LEFT JOIN customers c ON t.customer_id = c.id
                 LEFT JOIN kapsters k ON t.kapster_id = k.id
                 LEFT JOIN users u ON t.user_id = u.id
                 WHERE t.id = ?`,
                [transaction_id]
            );

            // Get details
            const details = await db.query(
                'SELECT * FROM transaction_details WHERE transaction_id = ?',
                [transaction_id]
            );

            // Get payments
            const paymentRecords = await db.query(
                'SELECT * FROM payments WHERE transaction_id = ?',
                [transaction_id]
            );

            res.status(201).json({
                message: 'Transaksi berhasil dibuat',
                transaction: {
                    ...completeTransaction,
                    details,
                    payments: paymentRecords
                }
            });

        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }

    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat transaksi' });
    }
};

exports.getAll = async (req, res) => {
    try {
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

        if (date) {
            sql += ` AND DATE(t.created_at) = ?`;
            params.push(date);
        }

        if (customer_id) {
            sql += ` AND t.customer_id = ?`;
            params.push(customer_id);
        }

        if (kapster_id) {
            sql += ` AND t.kapster_id = ?`;
            params.push(kapster_id);
        }

        sql += ` ORDER BY t.id DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const transactions = await db.query(sql, params);

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await db.get(
            `SELECT t.*, 
                    c.name as customer_name, c.phone as customer_phone,
                    k.name as kapster_name,
                    u.full_name as cashier_name,
                    d.name as discount_name, d.code as discount_code
             FROM transactions t
             LEFT JOIN customers c ON t.customer_id = c.id
             LEFT JOIN kapsters k ON t.kapster_id = k.id
             LEFT JOIN users u ON t.user_id = u.id
             LEFT JOIN discounts d ON t.discount_id = d.id
             WHERE t.id = ?`,
            [id]
        );

        if (!transaction) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
        }

        // Get details
        const details = await db.query(
            'SELECT * FROM transaction_details WHERE transaction_id = ?',
            [id]
        );

        // Get payments
        const payments = await db.query(
            'SELECT * FROM payments WHERE transaction_id = ?',
            [id]
        );

        res.json({
            ...transaction,
            details,
            payments
        });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
};

exports.void = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ error: 'Alasan void harus diisi' });
        }

        // Get transaction
        const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
        }

        if (transaction.status === 'void') {
            return res.status(400).json({ error: 'Transaksi sudah di-void' });
        }

        // Get details untuk kembalikan stok
        const details = await db.query(
            'SELECT * FROM transaction_details WHERE transaction_id = ? AND item_type = "product"',
            [id]
        );

        await db.run('BEGIN TRANSACTION');

        try {
            // Update status transaksi
            await db.run(
                `UPDATE transactions 
                 SET status = 'void', void_reason = ?, voided_by = ?, voided_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [reason, req.user.id, id]
            );

            // Kembalikan stok produk
            for (const detail of details) {
                await db.run(
                    'UPDATE products SET stock = stock + ? WHERE id = ?',
                    [detail.quantity, detail.item_id]
                );

                await db.run(
                    `INSERT INTO stock_history (product_id, type, quantity, notes, user_id)
                     VALUES (?, 'in', ?, ?, ?)`,
                    [detail.item_id, detail.quantity, `Void transaksi ${transaction.transaction_no}`, req.user.id]
                );
            }

            // Update customer stats jika ada
            if (transaction.customer_id) {
                await db.run(
                    `UPDATE customers 
                     SET total_visits = total_visits - 1,
                         total_spending = total_spending - ?
                     WHERE id = ?`,
                    [transaction.total, transaction.customer_id]
                );
            }

            await db.run('COMMIT');

            res.json({ message: 'Transaksi berhasil di-void' });

        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }

    } catch (error) {
        console.error('Void transaction error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
};
