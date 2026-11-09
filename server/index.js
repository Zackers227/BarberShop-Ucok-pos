require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files (client)
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/kapsters', require('./routes/kapsterRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/discounts', require('./routes/discountRoutes'));
app.use('/api/shifts', require('./routes/shiftRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Catch-all route untuk PWA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Terjadi kesalahan server',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║                                               ║');
    console.log('║       🚀 IniNotes POS Barbershop 🚀          ║');
    console.log('║                                               ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server berjalan di: http://localhost:${PORT}`);
    console.log(`📱 Akses dari tablet: http://[IP-SERVER]:${PORT}`);
    console.log('');
    console.log('📌 Untuk mendapatkan IP server:');
    console.log('   Windows: ipconfig');
    console.log('   Linux/Mac: ifconfig atau ip addr');
    console.log('');
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
