const { queryMultiTenant } = require('@smg/database-layer/src/db');

class EmployeeService {
    static async getAllEmployees(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM EMPLEADOS', [], tenantId);
        return result.rows;
    }

    static async getEmployeeById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM EMPLEADOS WHERE ID_Empleado = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createEmployee(tenantId, data) {
        const result = await queryMultiTenant(
            'INSERT INTO EMPLEADOS (ID_Empleado, Nombres, Apellidos, RUT_Empleado, Fecha_Nacimiento, Telefono, Email, Fecha_Contratacion, Cargo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [data.ID_Empleado, data.Nombres, data.Apellidos, data.RUT_Empleado, data.Fecha_Nacimiento, data.Telefono, data.Email, data.Fecha_Contratacion, data.Cargo],
            tenantId
        );
        return result.rows[0];
    }

    static async updateEmployee(tenantId, id, data) {
        const result = await queryMultiTenant(
            'UPDATE EMPLEADOS SET Nombres = $1, Apellidos = $2, RUT_Empleado = $3, Fecha_Nacimiento = $4, Telefono = $5, Email = $6, Fecha_Contratacion = $7, Cargo = $8 WHERE ID_Empleado = $9 RETURNING *',
            [data.Nombres, data.Apellidos, data.RUT_Empleado, data.Fecha_Nacimiento, data.Telefono, data.Email, data.Fecha_Contratacion, data.Cargo, id],
            tenantId
        );
        return result.rows[0] || null;
    }

    static async deleteEmployee(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM EMPLEADOS WHERE ID_Empleado = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = EmployeeService;
