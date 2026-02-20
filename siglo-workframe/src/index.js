require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.SIGLO_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Tenant Identification Middleware (Base definition)
app.use((req, res, next) => {
    // Aquí se extraerá el tenant de un token JWT o hostname.
    // Ej: const tenantId = req.headers['x-tenant-id'];
    req.tenantId = 'smg'; // Default pilot tenant
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'SIGLO Workframe', tenant: req.tenantId });
});

// Rutas de aplicación
app.use('/api/v1/logistica/products', require('./routes/logistica/productRoutes'));
// app.use('/api/v1/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`🚀 SIGLO Workframe backend running on port ${PORT}`);
});
