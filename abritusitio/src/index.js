require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.ABRITUSITIO_PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Tenant Identification Middleware for Public Access
// Abritusitio se basa en subdominios o query params para saber qué tenant mostrar
app.use((req, res, next) => {
    // Ej: host: "smg.abritusitio.com", extract "smg"
    // Mock for now:
    req.tenantId = req.headers['x-tenant-id'] || 'smg';
    next();
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Abritusitio Public Portal',
        tenant: req.tenantId
    });
});

// Rutas públicas (Catálogo, carrito, contacto, etc)
app.use('/api/v1/catalogo', require('./routes/catalogo/catalogoRoutes'));

app.listen(PORT, () => {
    console.log(`🌍 Abritusitio Portal running on port ${PORT}`);
});
