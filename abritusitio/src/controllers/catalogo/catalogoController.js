const CatalogoService = require('@smg/service-layer/src/catalogo/catalogoService');

const getPublicProducts = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Inyectado por middleware global
        const products = await CatalogoService.getPublicProducts(tenantId);
        res.json({
            tenant: tenantId,
            items: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving catalog' });
    }
};

const getPublicProductById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const product = await CatalogoService.getPublicProductById(tenantId, id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found in public catalog' });
        }
        res.json({
            tenant: tenantId,
            item: product
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving catalog' });
    }
};

module.exports = {
    getPublicProducts,
    getPublicProductById
};
