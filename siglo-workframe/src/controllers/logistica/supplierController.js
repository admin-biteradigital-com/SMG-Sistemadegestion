const SupplierService = require('@smg/service-layer/src/logistica/supplierService');

const getAllSuppliers = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Inyectado por middleware global
        const suppliers = await SupplierService.getAllSuppliers(tenantId);
        res.json(suppliers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getSupplierById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const supplier = await SupplierService.getSupplierById(tenantId, id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createSupplier = async (req, res) => {
    const tenantId = req.tenantId;
    try {
        const supplier = await SupplierService.createSupplier(tenantId, req.body);
        res.status(201).json(supplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const supplier = await SupplierService.updateSupplier(tenantId, id, req.body);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const supplier = await SupplierService.deleteSupplier(tenantId, id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully', payload: supplier });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
