const { queryMultiTenant } = require('@smg/database-layer/src/db');

class SupplierService {
    static async getAllSuppliers(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM PROVEEDORES', [], tenantId);
        return result.rows;
    }

    static async getSupplierById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM PROVEEDORES WHERE ID_Proveedor = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createSupplier(tenantId, data) {
        const result = await queryMultiTenant(
            'INSERT INTO PROVEEDORES (ID_Proveedor, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [data.ID_Proveedor, data.Nombre_Proveedor, data.Contacto_Proveedor, data.Telefono_Proveedor, data.Email_Proveedor, data.Direccion_Proveedor, data.RUT_Proveedor],
            tenantId
        );
        return result.rows[0];
    }

    static async updateSupplier(tenantId, id, data) {
        const result = await queryMultiTenant(
            'UPDATE PROVEEDORES SET Nombre_Proveedor = $1, Contacto_Proveedor = $2, Telefono_Proveedor = $3, Email_Proveedor = $4, Direccion_Proveedor = $5, RUT_Proveedor = $6 WHERE ID_Proveedor = $7 RETURNING *',
            [data.Nombre_Proveedor, data.Contacto_Proveedor, data.Telefono_Proveedor, data.Email_Proveedor, data.Direccion_Proveedor, data.RUT_Proveedor, id],
            tenantId
        );
        return result.rows[0] || null;
    }

    static async deleteSupplier(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM PROVEEDORES WHERE ID_Proveedor = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = SupplierService;
