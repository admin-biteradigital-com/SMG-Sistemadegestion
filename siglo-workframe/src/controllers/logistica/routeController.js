const RouteService = require('@smg/service-layer/src/logistica/routeService');

const getAllRoutes = async (req, res) => {
    try {
        const routes = await RouteService.getAllRoutes(req.tenantId);
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getRouteById = async (req, res) => {
    try {
        const route = await RouteService.getRouteById(req.tenantId, req.params.id);
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json(route);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createRoute = async (req, res) => {
    try {
        const route = await RouteService.createRoute(req.tenantId, req.body);
        res.status(201).json(route);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateRoute = async (req, res) => {
    try {
        const route = await RouteService.updateRoute(req.tenantId, req.params.id, req.body);
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json(route);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteRoute = async (req, res) => {
    try {
        const route = await RouteService.deleteRoute(req.tenantId, req.params.id);
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllRoutes, getRouteById, createRoute, updateRoute, deleteRoute };
