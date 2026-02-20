const ClientService = require('@smg/service-layer/src/logistica/clientService');

const getAllClients = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Obtenido del middleware multitenant
        const clients = await ClientService.getAllClients(tenantId);
        res.json(clients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getClientById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const client = await ClientService.getClientById(tenantId, id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createClient = async (req, res) => {
    const tenantId = req.tenantId;
    try {
        const client = await ClientService.createClient(tenantId, req.body);
        res.status(201).json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const client = await ClientService.updateClient(tenantId, id, req.body);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteClient = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const client = await ClientService.deleteClient(tenantId, id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully', payload: client });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
};
