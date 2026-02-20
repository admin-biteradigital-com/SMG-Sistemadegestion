const { queryMultiTenant } = require('@smg/database-layer/src/db');

class ClientService {
    static async getAllClients(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM CLIENTES', [], tenantId);
        return result.rows;
    }

    static async getClientById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM CLIENTES WHERE ID_Cliente = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createClient(tenantId, data) {
        const result = await queryMultiTenant(
            'INSERT INTO CLIENTES (ID_Cliente, Razon_Social, RUT_Cliente, Ciclo_Reabastecimiento_Dias, Limite_Credito_Autorizado, Segmento_Cliente) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [data.ID_Cliente, data.Razon_Social, data.RUT_Cliente, data.Ciclo_Reabastecimiento_Dias, data.Limite_Credito_Autorizado, data.Segmento_Cliente],
            tenantId
        );
        return result.rows[0];
    }

    static async updateClient(tenantId, id, data) {
        const result = await queryMultiTenant(
            'UPDATE CLIENTES SET Razon_Social = $1, RUT_Cliente = $2, Ciclo_Reabastecimiento_Dias = $3, Limite_Credito_Autorizado = $4, Segmento_Cliente = $5 WHERE ID_Cliente = $6 RETURNING *',
            [data.Razon_Social, data.RUT_Cliente, data.Ciclo_Reabastecimiento_Dias, data.Limite_Credito_Autorizado, data.Segmento_Cliente, id],
            tenantId
        );
        return result.rows[0] || null;
    }

    static async deleteClient(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM CLIENTES WHERE ID_Cliente = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = ClientService;
