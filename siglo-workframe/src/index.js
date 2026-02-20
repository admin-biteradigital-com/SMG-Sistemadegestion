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

// Rutas de aplicación — Fase 6: Módulos completos migrados del legacy /backend
// --- Catálogo ---
app.use('/api/v1/logistica/products', require('./routes/logistica/productRoutes'));
// --- Entidades Base ---
app.use('/api/v1/logistica/clients', require('./routes/logistica/clientRoutes'));
app.use('/api/v1/logistica/employees', require('./routes/logistica/employeeRoutes'));
app.use('/api/v1/logistica/suppliers', require('./routes/logistica/supplierRoutes'));
app.use('/api/v1/logistica/units', require('./routes/logistica/unitRoutes'));
app.use('/api/v1/logistica/vehicles', require('./routes/logistica/vehicleRoutes'));
// --- Operaciones ---
app.use('/api/v1/logistica/routes', require('./routes/logistica/routeRoutes'));
app.use('/api/v1/logistica/purchase-orders', require('./routes/logistica/purchaseOrderRoutes'));
app.use('/api/v1/logistica/receptions', require('./routes/logistica/receptionRoutes'));
app.use('/api/v1/logistica/stock', require('./routes/logistica/stockRoutes'));
app.use('/api/v1/logistica/load-orders', require('./routes/logistica/loadOrderRoutes'));
app.use('/api/v1/logistica/transport-orders', require('./routes/logistica/transportRoutes'));
app.use('/api/v1/logistica/sales', require('./routes/logistica/saleRoutes'));
// app.use('/api/v1/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`🚀 SIGLO Workframe backend running on port ${PORT}`);
});
