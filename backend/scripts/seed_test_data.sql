-- Script de Datos de Prueba para SIGLO (Corregido)
-- Fecha: 2026-02-05
-- Propósito: Poblar la base de datos con datos de ejemplo para testing

-- ============================================
-- PRODUCTOS DE PRUEBA
-- ============================================

INSERT INTO productos_servicios (
    Nombre_Producto_Servicio, 
    Precio_Unitario_Sugerido, 
    Stock_Seguridad_Minimo
)
VALUES 
  ('Coca Cola 2L', 1500, 10),
  ('Coca Cola 1.5L', 1200, 10),
  ('Pepsi 2L', 1400, 10),
  ('Pepsi 1.5L', 1100, 10),
  ('Fanta 2L', 1400, 10),
  ('Sprite 2L', 1400, 10),
  ('Agua Mineral 500ml', 800, 20),
  ('Agua Mineral 1.5L', 1000, 15),
  ('Jugo Naranja 1L', 1800, 5),
  ('Jugo Manzana 1L', 1800, 5),
  ('Galletas Chocolate', 1200, 15),
  ('Galletas Vainilla', 1100, 15),
  ('Papas Fritas Grande', 1500, 10),
  ('Papas Fritas Mediana', 1000, 10),
  ('Chocolate Barra', 900, 20),
  ('Caramelos Surtidos', 500, 25),
  ('Chicles Pack', 600, 20),
  ('Helado Vaso 1L', 3500, 5),
  ('Yogurt Natural 1L', 2200, 8),
  ('Leche Entera 1L', 1300, 12)
ON CONFLICT DO NOTHING;

-- ============================================
-- CLIENTES DE PRUEBA
-- ============================================

INSERT INTO clientes (
    Razon_Social, 
    RUT_Cliente, 
    Ciclo_Reabastecimiento_Dias, 
    Limite_Credito_Autorizado, 
    Segmento_Cliente
)
VALUES
  ('Almacén Don Pedro', '12345678-9', 7, 50000, 'Premium'),
  ('Minimarket Central', '98765432-1', 14, 30000, 'Estándar'),
  ('Kiosco La Esquina', '11223344-5', 7, 15000, 'Básico'),
  ('Supermercado El Sol', '55667788-9', 3, 100000, 'Premium'),
  ('Botillería Los Andes', '99887766-5', 7, 40000, 'Estándar'),
  ('Almacén Doña María', '44556677-8', 14, 25000, 'Estándar'),
  ('Kiosco Escolar', '22334455-6', 7, 10000, 'Básico'),
  ('Minimarket Express', '66778899-0', 7, 35000, 'Estándar'),
  ('Almacén del Barrio', '33445566-7', 14, 20000, 'Básico'),
  ('Supermercado Familiar', '77889900-1', 3, 80000, 'Premium')
ON CONFLICT DO NOTHING;

-- ============================================
-- VENTAS DE PRUEBA (Últimos 7 días)
-- ============================================

-- Ventas de HOY
INSERT INTO ordenes_venta (
    Fecha_Venta, 
    Monto_Total_Venta, 
    Estado_Venta,
    Tipo_Documento_Venta
)
VALUES
  (CURRENT_DATE, 15000, 'Pagado', 'Boleta'),
  (CURRENT_DATE, 8500, 'Pagado', 'Boleta'),
  (CURRENT_DATE, 12000, 'Pendiente', 'Factura'),
  (CURRENT_DATE, 25000, 'Pagado', 'Factura'),
  (CURRENT_DATE, 18000, 'Pendiente', 'Boleta')
ON CONFLICT DO NOTHING;

-- Ventas de AYER
INSERT INTO ordenes_venta (
    Fecha_Venta, 
    Monto_Total_Venta, 
    Estado_Venta,
    Tipo_Documento_Venta
)
VALUES
  (CURRENT_DATE - INTERVAL '1 day', 14000, 'Pagado', 'Boleta'),
  (CURRENT_DATE - INTERVAL '1 day', 9500, 'Pagado', 'Boleta'),
  (CURRENT_DATE - INTERVAL '1 day', 11000, 'Pagado', 'Factura'),
  (CURRENT_DATE - INTERVAL '1 day', 7500, 'Pagado', 'Boleta')
ON CONFLICT DO NOTHING;

-- Ventas de hace 2 días
INSERT INTO ordenes_venta (
    Fecha_Venta, 
    Monto_Total_Venta, 
    Estado_Venta,
    Tipo_Documento_Venta
)
VALUES
  (CURRENT_DATE - INTERVAL '2 days', 13000, 'Pagado', 'Boleta'),
  (CURRENT_DATE - INTERVAL '2 days', 22000, 'Pagado', 'Factura'),
  (CURRENT_DATE - INTERVAL '2 days', 16000, 'Pagado', 'Boleta')
ON CONFLICT DO NOTHING;

-- Ventas de hace 3 días
INSERT INTO ordenes_venta (
    Fecha_Venta, 
    Monto_Total_Venta, 
    Estado_Venta,
    Tipo_Documento_Venta
)
VALUES
  (CURRENT_DATE - INTERVAL '3 days', 19000, 'Pagado', 'Factura'),
  (CURRENT_DATE - INTERVAL '3 days', 8000, 'Pagado', 'Boleta'),
  (CURRENT_DATE - INTERVAL '3 days', 30000, 'Pagado', 'Factura')
ON CONFLICT DO NOTHING;

-- Ventas de hace 4-7 días
INSERT INTO ordenes_venta (
    Fecha_Venta, 
    Monto_Total_Venta, 
    Estado_Venta,
    Tipo_Documento_Venta
)
VALUES
  (CURRENT_DATE - INTERVAL '4 days', 16000, 'Pagado', 'Boleta'),
  (CURRENT_DATE - INTERVAL '5 days', 10000, 'Pagado', 'Boleta'),
  (CURRENT_DATE - INTERVAL '6 days', 12500, 'Pagado', 'Factura'),
  (CURRENT_DATE - INTERVAL '7 days', 28000, 'Pagado', 'Factura')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Contar productos
SELECT COUNT(*) as total_productos FROM productos_servicios;

-- Contar clientes
SELECT COUNT(*) as total_clientes FROM clientes;

-- Contar ventas
SELECT COUNT(*) as total_ventas FROM ordenes_venta;

-- Ventas de hoy
SELECT COUNT(*) as ventas_hoy, SUM(Monto_Total_Venta) as monto_hoy 
FROM ordenes_venta 
WHERE Fecha_Venta::date = CURRENT_DATE;

-- Ventas pendientes
SELECT COUNT(*) as ventas_pendientes 
FROM ordenes_venta 
WHERE Estado_Venta = 'Pendiente';
