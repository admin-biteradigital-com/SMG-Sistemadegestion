const ProductService = require('@smg/service-layer/src/logistica/productService');

const getAllProducts = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Inyectado por middleware global
        const products = await ProductService.getAllProducts(tenantId);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const product = await ProductService.getProductById(tenantId, id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    const tenantId = req.tenantId;
    try {
        const product = await ProductService.createProduct(tenantId, req.body);
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const product = await ProductService.updateProduct(tenantId, id, req.body);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const product = await ProductService.deleteProduct(tenantId, id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', payload: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
