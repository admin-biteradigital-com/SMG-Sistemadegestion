const { queryMultiTenant } = require('@smg/database-layer/src/db');

class UnitService {
    static async getAllUnits(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM UNIDADES_MEDIDA', [], tenantId);
        return result.rows;
    }

    static async getUnitById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM UNIDADES_MEDIDA WHERE ID_Unidad = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createUnit(tenantId, data) {
        const result = await queryMultiTenant(
            'INSERT INTO UNIDADES_MEDIDA (ID_Unidad, Nombre_Unidad, Abreviatura, Tipo_Unidad) VALUES ($1, $2, $3, $4) RETURNING *',
            [data.ID_Unidad, data.Nombre_Unidad, data.Abreviatura, data.Tipo_Unidad],
            tenantId
        );
        return result.rows[0];
    }

    static async updateUnit(tenantId, id, data) {
        const result = await queryMultiTenant(
            'UPDATE UNIDADES_MEDIDA SET Nombre_Unidad = $1, Abreviatura = $2, Tipo_Unidad = $3 WHERE ID_Unidad = $4 RETURNING *',
            [data.Nombre_Unidad, data.Abreviatura, data.Tipo_Unidad, id],
            tenantId
        );
        return result.rows[0] || null;
    }

    static async deleteUnit(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM UNIDADES_MEDIDA WHERE ID_Unidad = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = UnitService;
