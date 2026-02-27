-- 01_enable_rls.sql
-- Este script prepara la base de datos para la Arquitectura Multi-Tenant real.
-- 1. Agrega la columna tenant_id a todas las tablas clave (si no existe).
-- 2. Habilita RLS (Row Level Security).
-- 3. Crea la política que filtra automáticamente por `app.current_tenant`.

DO $$
DECLARE
    -- Lista de todas las tablas que deben ser aisladas por tenant
    t_name text;
    tables_list text[] := ARRAY[
        'UNIDADES_MEDIDA', 'PRODUCTO_UNIDADES_CONVERSION', 'PROVEEDORES',
        'PRODUCTOS_SERVICIOS', 'ORDENES_COMPRA', 'DETALLES_ORDEN',
        'RECEPCIONES_MERCADERIA', 'DETALLES_RECEPCION', 'STOCK_DEPOSITO',
        'EMPLEADOS', 'VEHICULOS', 'ORDENES_CARGA', 'DETALLES_ORDEN_CARGA',
        'RUTAS', 'CLIENTES', 'SUCURSALES_CLIENTE', 'PEDIDOS_CLIENTE',
        'DETALLES_PEDIDO_CLIENTE', 'PEDIDOS_CARGADOS', 'ORDENES_TRANSPORTE',
        'DESTINOS_TRANSPORTE', 'DETALLES_DESTINO_TRANSPORTE', 'ORDENES_VENTA',
        'DETALLES_ORDEN_VENTA', 'FACTURAS', 'PAGOS_RECIBIDOS',
        'INTERACCIONES_CLIENTE', 'USUARIOS_CLIENTES', 'RENDIMIENTO_EMPLEADO',
        'METAS_EMPLEADO', 'CLIENTE_PREFERENCIAS', 'RUTAS_SUGERIDAS',
        'DETALLES_RUTA_SUGERIDA'
    ];
BEGIN
    FOREACH t_name IN ARRAY tables_list
    LOOP
        -- 1. Agregar la columna tenant_id si no existe
        BEGIN
            EXECUTE format('ALTER TABLE %I ADD COLUMN tenant_id VARCHAR(50) DEFAULT ''smg'';', t_name);
        EXCEPTION
            WHEN duplicate_column THEN
                -- Subimos un NOTICE silencioso si ya existe
                RAISE NOTICE 'La columna tenant_id ya existe en %', t_name;
        END;

        -- 2. Asegurarse de que las filas viejas no tengan nulo
        EXECUTE format('UPDATE %I SET tenant_id = ''smg'' WHERE tenant_id IS NULL;', t_name);
        EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL;', t_name);

        -- 3. Habilitar la Seguridad a Nivel de Fila (RLS)
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t_name);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', t_name);

        -- 4. Borrar la política anterior si existiese (para reruns idempotentes)
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', t_name);
        END;

        -- 5. Crear la nueva política
        -- Permite acceso solo si:
        -- a) current_setting('app.current_tenant') coincide con el tenant_id de la fila
        -- b) Opcional si hay un rol "admin_global" bypass (por ahora no).
        EXECUTE format('
            CREATE POLICY tenant_isolation_policy ON %I 
            FOR ALL 
            USING (tenant_id = current_setting(''app.current_tenant'', true))
            WITH CHECK (tenant_id = current_setting(''app.current_tenant'', true));
        ', t_name);

    END LOOP;
END $$;

-- Fin de migración.
