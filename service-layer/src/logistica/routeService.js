const { queryMultiTenant } = require('@smg/database-layer/src/db');

class RouteService {
    static async getAllRoutes(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM RUTAS', [], tenantId);
        return result.rows;
    }

    static async getRouteById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM RUTAS WHERE ID_Ruta = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createRoute(tenantId, data) {
        const { ID_Ruta, Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas } = data;
        const result = await queryMultiTenant(
            'INSERT INTO RUTAS (ID_Ruta, Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ID_Ruta, Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas],
            tenantId
        );
        return result.rows[0];
    }

    static async updateRoute(tenantId, id, data) {
        const { Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas } = data;
        const result = await queryMultiTenant(
            'UPDATE RUTAS SET Nombre_Ruta = $1, Descripcion_Ruta = $2, Distancia_Estimada_KM = $3, Duracion_Estimada_Horas = $4 WHERE ID_Ruta = $5 RETURNING *',
            [Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas, id],
            tenantId
        );
        return result.rows[0] || null;
    }

    static async deleteRoute(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM RUTAS WHERE ID_Ruta = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = RouteService;
