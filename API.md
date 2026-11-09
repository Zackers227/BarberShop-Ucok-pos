# IniNotes POS - API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Semua endpoint (kecuali login) memerlukan JWT token di header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/login

Login dan dapatkan token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "Administrator",
    "role": "owner"
  }
}
```

### GET /auth/me

Dapatkan data user yang sedang login.

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "full_name": "Administrator",
  "role": "owner",
  "created_at": "2026-11-09T05:00:00.000Z"
}
```

### POST /auth/change-password

Ubah password user.

**Request Body:**
```json
{
  "oldPassword": "admin123",
  "newPassword": "newpassword456"
}
```

---

## Services Endpoints

### GET /services

Dapatkan semua layanan aktif.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Potong Rambut Regular",
    "price": 35000,
    "duration": 30,
    "description": "Potong rambut standar",
    "is_active": 1
  }
]
```

### GET /services/:id

Dapatkan detail layanan.

### POST /services

Tambah layanan baru.

**Request Body:**
```json
{
  "name": "Smoothing Premium",
  "price": 500000,
  "duration": 180,
  "description": "Smoothing dengan bahan premium"
}
```

### PUT /services/:id

Update layanan.

### DELETE /services/:id

Soft delete layanan (set is_active = 0).

---

## Products Endpoints

### GET /products

Dapatkan semua produk aktif.

**Query Params:**
- `low_stock=true` - Filter produk dengan stok menipis

**Response:**
```json
[
  {
    "id": 1,
    "name": "Pomade Murray's",
    "sku": "POM001",
    "purchase_price": 45000,
    "selling_price": 65000,
    "stock": 25,
    "min_stock": 5,
    "unit": "pcs",
    "is_active": 1
  }
]
```

### GET /products/:id

Dapatkan detail produk.

### POST /products

Tambah produk baru.

### PUT /products/:id

Update produk.

### POST /products/:id/adjust-stock

Sesuaikan stok produk.

**Request Body:**
```json
{
  "type": "in",
  "quantity": 10,
  "notes": "Pembelian supplier"
}
```

---

## Kapsters Endpoints

### GET /kapsters

Dapatkan semua kapster aktif.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Budi Santoso",
    "phone": "081234567890",
    "commission_percentage": 40.00,
    "is_active": 1
  }
]
```

### POST /kapsters

Tambah kapster baru.

### PUT /kapsters/:id

Update data kapster.

---

## Customers Endpoints

### GET /customers

Dapatkan semua pelanggan.

**Query Params:**
- `search=nama` - Cari pelanggan by nama atau HP

### GET /customers/:id

Dapatkan detail pelanggan dengan riwayat transaksi.

**Response:**
```json
{
  "id": 2,
  "name": "Ahmad Rizki",
  "phone": "08123456001",
  "total_visits": 12,
  "total_spending": 420000,
  "is_member": 1,
  "transactions": [...]
}
```

### POST /customers

Tambah pelanggan baru.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "081234567890",
  "email": "john@example.com",
  "gender": "male",
  "is_member": 1
}
```

### PUT /customers/:id

Update data pelanggan.

---

## Discounts Endpoints

### GET /discounts

Dapatkan semua diskon aktif dan masih berlaku.

### POST /discounts/validate

Validasi kode diskon.

**Request Body:**
```json
{
  "code": "MEMBER10",
  "transaction_total": 100000
}
```

**Response:**
```json
{
  "valid": true,
  "discount": {
    "id": 1,
    "code": "MEMBER10",
    "name": "Diskon Member 10%",
    "type": "percentage",
    "value": 10,
    "max_discount": null
  },
  "discount_amount": 10000
}
```

### POST /discounts

Tambah diskon baru (owner only).

---

## Transactions Endpoints

### POST /transactions

Buat transaksi baru.

**Request Body:**
```json
{
  "customer_id": 2,
  "kapster_id": 1,
  "items": [
    {
      "item_type": "service",
      "item_id": 1,
      "item_name": "Potong Rambut Regular",
      "quantity": 1,
      "price": 35000
    },
    {
      "item_type": "product",
      "item_id": 1,
      "item_name": "Pomade Murray's",
      "quantity": 1,
      "price": 65000
    }
  ],
  "discount_id": 1,
  "discount_amount": 10000,
  "payments": [
    {
      "payment_method": "cash",
      "amount": 100000,
      "reference_no": null
    }
  ],
  "notes": null
}
```

**Response:**
```json
{
  "message": "Transaksi berhasil dibuat",
  "transaction": {
    "id": 1,
    "transaction_no": "BB-20261109-001",
    "customer_name": "Ahmad Rizki",
    "kapster_name": "Budi Santoso",
    "subtotal": 100000,
    "discount_amount": 10000,
    "total": 90000,
    "status": "completed",
    "details": [...],
    "payments": [...]
  }
}
```

### GET /transactions

Dapatkan daftar transaksi.

**Query Params:**
- `date=2026-11-09` - Filter by tanggal
- `customer_id=2` - Filter by customer
- `kapster_id=1` - Filter by kapster
- `limit=50` - Limit results
- `offset=0` - Pagination offset

### GET /transactions/:id

Dapatkan detail transaksi lengkap.

### POST /transactions/:id/void

Void transaksi (owner only).

**Request Body:**
```json
{
  "reason": "Input salah, customer minta refund"
}
```

---

## Shifts Endpoints

### GET /shifts/current

Dapatkan shift aktif user saat ini.

### POST /shifts/open

Buka shift baru.

**Request Body:**
```json
{
  "opening_balance": 500000,
  "notes": "Modal shift pagi"
}
```

### POST /shifts/close

Tutup shift aktif.

**Request Body:**
```json
{
  "closing_balance": 1250000,
  "notes": "Shift pagi selesai"
}
```

**Response:**
```json
{
  "message": "Shift berhasil ditutup",
  "summary": {
    "opening_balance": 500000,
    "closing_balance": 1250000,
    "expected_balance": 1230000,
    "difference": 20000,
    "total_transactions": 15,
    "total_sales": 730000
  }
}
```

### GET /shifts/history

Dapatkan riwayat shift.

**Query Params:**
- `limit=10` - Jumlah records

---

## Reports Endpoints

### GET /reports/dashboard

Dapatkan summary dashboard.

**Response:**
```json
{
  "today": {
    "total_transactions": 25,
    "total_sales": 1250000
  },
  "low_stock": [
    {
      "name": "Pomade Suavecito",
      "stock": 3,
      "min_stock": 5
    }
  ],
  "active_shift": {
    "id": 5,
    "opening_balance": 500000,
    "opened_at": "2026-11-09T08:00:00.000Z"
  },
  "top_customers": [...]
}
```

### GET /reports/sales

Laporan penjualan.

**Query Params:**
- `start_date=2026-11-01`
- `end_date=2026-11-30`
- `group_by=day|month|year`

**Response:**
```json
[
  {
    "period": "2026-11-09",
    "total_transactions": 25,
    "total_sales": 1250000,
    "total_discounts": 125000,
    "avg_transaction": 50000
  }
]
```

### GET /reports/kapsters

Laporan performa kapster.

**Query Params:**
- `start_date`, `end_date`

### GET /reports/services/top

Layanan terlaris.

**Query Params:**
- `start_date`, `end_date`, `limit=10`

### GET /reports/payments

Summary metode pembayaran.

**Query Params:**
- `start_date`, `end_date`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Token tidak valid"
}
```

### 403 Forbidden
```json
{
  "error": "Akses ditolak. Hanya owner yang dapat mengakses."
}
```

### 404 Not Found
```json
{
  "error": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "error": "Terjadi kesalahan server"
}
```

---

## Rate Limiting

Tidak ada rate limiting saat ini. Untuk production, pertimbangkan menambahkan rate limiting middleware.

## Webhooks (Future)

Planned webhooks untuk:
- Transaksi berhasil
- Stok menipis
- Shift ditutup

## Changelog

### v1.0.0 (2026-11-09)
- Initial release
- Basic POS functionality
- Authentication & authorization
- Reporting endpoints
