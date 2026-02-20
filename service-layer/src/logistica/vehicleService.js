const { queryMultiTenant } = require('@smg/database-layer/src/db');

class VehicleService {
    static async getAllVehicles(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM VEHICULOS', [], tenantId);
        return result.rows;
    }

    static async getVehicleById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM VEHICULOS WHERE ID_Vehiculo = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createVehicle(tenantId, data) {
        const result = await queryMultiTenant(
            'INSERT INTO VEHICULOS (ID_Vehiculo, Patente, Marca, Modelo, Ano, Tipo_Vehiculo, Capacidad_Carga_KG, Estado_Vehiculo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [data.ID_Vehiculo, data.Patente, data.Marca, data.Modelo, data.Ano, data.Tipo_Vehiculo, data.Capacidad_Carga_KG, data.Estado_Vehiculo],
            tenantId
        );
        return result.rows[0];
    }

    static async updateVehicle(tenantId, id, data) {
        const result = await queryMultiTenant(
            'UPDATE VEHICULOS SET Patente = $1, Marca = $2, Modelo = $3, Ano = $4, Tipo_Vehiculo = $5, Capacidad_Carga_KG = $6, Estado_Vehiculo = $7 WHERE ID_Vehiculo = $8 RETURNING *',
            [data.Patente, data.Marca, data.Modelo, data.Ano, data.Tipo_Vehiculo, data.Capacidad_Carga_KG, data.Estado_Vehiculo, id],
            tenantId
        );
        return result.rows[0] || null;
    }

    static async deleteVehicle(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM VEHICULOS WHERE ID_Vehiculo = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = VehicleService;
