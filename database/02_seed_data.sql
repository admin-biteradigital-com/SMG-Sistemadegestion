-- Seed Data for SMG System
-- Generated from User Input (Bootstrap Phase)
-- Order of insertion is critical for Foreign Key constraints

-- 1. UNIDADES_MEDIDA
INSERT INTO UNIDADES_MEDIDA (ID_Unidad, Nombre_Unidad, Abreviatura, Tipo_Unidad) VALUES
(1, 'Caja', 'cj', 'Contenedor'),
(2, 'Display', 'disp', 'Paquete'),
(3, 'Unidad', 'un', 'Granular'),
(4, 'Bolsa', 'bol', 'Paquete'),
(5, 'Pack', 'pk', 'Contenedor'),
(6, 'Pallet', 'plt', 'Contenedor Mayor'),
(7, 'Contenedor', 'cont', 'Contenedor Mayor')
ON CONFLICT (ID_Unidad) DO NOTHING;

-- 4. PRODUCTOS_SERVICIOS (Inserted before conversions)
INSERT INTO PRODUCTOS_SERVICIOS (ID_Producto_Servicio, Nombre_Producto_Servicio, Descripcion_Producto_Servicio, Precio_Unitario_Sugerido, Tiempo_Entrega_Proveedor_Dias, Stock_Seguridad_Minimo, Punto_Reorden, Cantidad_Reorden_Optima, ID_Unidad_Compra, ID_Unidad_Venta, ID_Unidad_Base) VALUES
(101, 'Alfajor de Maicena ''Don Satur''', 'Caja de 24 unidades', 15000, NULL, NULL, NULL, NULL, 1, 3, 3),
(102, 'Tableta Chocolate ''Andino'' 100g', 'Caja de 12 unidades', 12500, NULL, NULL, NULL, NULL, 1, 3, 3),
(103, 'Caramelos de Leche ''Vaquita''', 'Bolsa de 1kg', 8000, NULL, NULL, NULL, NULL, 4, 3, 3),
(104, 'Display de Trento Allegro Dark', 'Display de 16 unidades de chocolate', 5763, NULL, NULL, NULL, NULL, 1, 2, 2),
(105, 'Chicle Relleno Acido TNT', 'Caja de 20 displays con 40 unidades de golosinas', 31350, NULL, NULL, NULL, NULL, 1, 2, 3),
(106, 'Ducrem Granuleti', 'Caja de 18 displays con 18 unidades de golosinas', 33150, NULL, NULL, NULL, NULL, 1, 2, 3),
(107, 'Freegells Chicle Extra Fuerte', 'Caja de 12 displays con 15 unidades', 22472, NULL, NULL, NULL, NULL, 1, 2, 3),
(108, 'Freegells Play Extra Fuerte', 'Caja de 36 displays con 12 unidades', 50386, NULL, NULL, NULL, NULL, 1, 2, 3),
(109, 'Freegells Play Sandia', 'Caja de 36 displays con 12 unidades', 50386, NULL, NULL, NULL, NULL, 1, 2, 3),
(110, 'Freegells Play VitC Citrus', 'Caja de 36 displays con 12 unidades', 50386, NULL, NULL, NULL, NULL, 1, 2, 3),
(111, 'Go Jelly Gomitas Dentaduras', 'Caja de 12 bolsas con 70gr', 4413, NULL, NULL, NULL, NULL, 1, 4, 4),
(112, 'Go Jelly Gomitas Frutillas', 'Caja de 12 bolsas con 70gr', 4413, NULL, NULL, NULL, NULL, 1, 4, 4),
(113, 'Lollypop Pop Boom Surtido', 'Caja de 18 bolsas con 24 unidades', 19296, NULL, NULL, NULL, NULL, 1, 4, 4),
(114, 'Lollypop Pop Boom Blue', 'Caja de 18 bolsas con 24 unidades', 19296, NULL, NULL, NULL, NULL, 1, 4, 4),
(115, 'Lollypop Pop Boom Milkshake', 'Caja de 18 bolsas con 24 unidades', 19296, NULL, NULL, NULL, NULL, 1, 4, 4),
(116, 'Go Jelly Gomitas Platanos', 'Caja de 12 bolsas con 70gr', 4413, NULL, NULL, NULL, NULL, 1, 4, 4),
(117, 'Go Jelly Gomitas Besos', 'Caja de 12 bolsas con 70gr', 4413, NULL, NULL, NULL, NULL, 1, 4, 4),
(118, 'Gomutcho Surtido', 'Caja de 15 displays por 30 unidades de golosinas', 38944, NULL, NULL, NULL, NULL, 1, 2, 3),
(119, 'Gomutcho Yogurt', 'Caja de 15 displays por 30 unidades de golosinas', 38944, NULL, NULL, NULL, NULL, 1, 2, 3),
(120, 'Paleta Intensa Surtida', 'Caja de 20 displays con 24 unidades', 37396, NULL, NULL, NULL, NULL, 1, 2, 3),
(121, 'Bombon Bel Surtido', 'Caja de 30 displays con 12 unidades', 15916.29, NULL, NULL, NULL, NULL, 1, 2, 3),
(122, 'Freegells Chicle Cereza', 'Caja de 12 displays con 15 unidades', 22472, NULL, NULL, NULL, NULL, 1, 2, 3),
(123, 'Freegells Chicle Hierba Buena', 'Caja de 12 displays con 15 unidades', 22472, NULL, NULL, NULL, NULL, 1, 2, 3)
ON CONFLICT (ID_Producto_Servicio) DO NOTHING;

-- 2. PRODUCTO_UNIDADES_CONVERSION
INSERT INTO PRODUCTO_UNIDADES_CONVERSION (ID_Conversion, ID_Producto_Servicio, ID_Unidad_Mayor, ID_Unidad_Menor, Factor_Conversion, Es_Unidad_Compra_Producto, Es_Unidad_Venta_Producto) VALUES
(1, 101, 1, 3, 24, TRUE, TRUE),
(2, 102, 1, 3, 12, TRUE, TRUE),
(3, 103, 4, 3, 1, TRUE, TRUE),
(4, 104, 1, 2, 8, TRUE, TRUE),
(5, 105, 5, 3, 12, TRUE, TRUE),
(6, 106, 1, 2, 20, TRUE, TRUE),
(7, 107, 1, 2, 18, TRUE, TRUE),
(8, 108, 1, 2, 12, TRUE, TRUE),
(9, 109, 1, 2, 12, TRUE, TRUE),
(10, 110, 1, 2, 12, TRUE, TRUE),
(11, 111, 1, 2, 15, TRUE, TRUE),
(12, 112, 1, 2, 8, TRUE, TRUE),
(13, 113, 1, 2, 8, TRUE, TRUE),
(14, 114, 1, 2, 8, TRUE, TRUE),
(15, 115, 1, 2, 8, TRUE, TRUE),
(16, 116, 1, 4, 12, TRUE, TRUE),
(17, 117, 1, 4, 12, TRUE, TRUE),
(18, 118, 1, 4, 18, TRUE, TRUE),
(19, 119, 1, 4, 18, TRUE, TRUE),
(20, 120, 1, 4, 18, TRUE, TRUE),
(21, 121, 1, 2, 15, TRUE, TRUE),
(22, 122, 1, 2, 15, TRUE, TRUE),
(23, 123, 1, 2, 20, TRUE, TRUE)
ON CONFLICT (ID_Conversion) DO NOTHING;

-- 3. PROVEEDORES
INSERT INTO PROVEEDORES (ID_Proveedor, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor) VALUES
(1, 'Distribuidora Dulce Sur S.A.', 'Juan Pérez', '56987654321', 'ventas@dulcesur.cl', 'Av. Industrial 123, Puerto Montt, Chile', '76.123.456-7'),
(2, 'Diacsa S.A.', 'Carolina Fuentes', '569227146090', 'cfuentes@diacsa.cl', 'Antillanca 440, Quilicura, Santiago, Chile', '76.507.455-K')
ON CONFLICT (ID_Proveedor) DO NOTHING;

-- 6. ORDENES_COMPRA
INSERT INTO ORDENES_COMPRA (ID_Orden, Fecha_Creacion, Fecha_Entrega_Estimada, Estado_Orden, Fecha_Confirmacion_Proveedor, Notas_Proveedor_Confirmacion, Total_Orden, Notas, ID_Proveedor) VALUES
(1, '2025-07-21', '2025-07-23', 'Pendiente', NULL, NULL, 481000, 'Primera orden de compra de prueba.', 1),
(2, '2025-07-18', '2025-07-23', 'Completada', '2025-07-19 10:00:00', 'Todo en stock.', 1036341, 'Tercera semana de julio', 2),
(3, '2025-07-25', '2025-07-29', 'En Proceso', '2025-07-25 00:00:00', NULL, 645793, 'Cuarta semana de julio', 2)
ON CONFLICT (ID_Orden) DO NOTHING;

-- 7. DETALLES_ORDEN
INSERT INTO DETALLES_ORDEN (ID_Detalle_Orden, ID_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado) VALUES
(1, 1, 101, 10, 14500),
(2, 1, 102, 15, 12000),
(3, 1, 103, 20, 7800),
(4, 2, 104, 5, 46104),
(5, 2, 105, 1, 31350),
(6, 2, 106, 1, 33150),
(7, 2, 107, 1, 22472),
(8, 2, 108, 1, 50386),
(9, 2, 109, 1, 50386),
(10, 2, 110, 1, 50386),
(11, 2, 111, 10, 4413),
(12, 2, 112, 7, 4413),
(13, 2, 113, 3, 19296),
(14, 2, 114, 1, 19296),
(15, 2, 115, 1, 19296),
(16, 2, 116, 10, 4413),
(17, 2, 117, 1, 4413),
(18, 2, 118, 1, 38944),
(19, 2, 119, 1, 38944),
(20, 2, 120, 1, 37396),
(21, 2, 121, 7, 15916.29),
(22, 2, 122, 1, 22472),
(23, 2, 123, 1, 22472),
(24, 3, 121, 7, 38944),
(25, 3, 122, 1, 38944),
(26, 3, 123, 1, 37396),
(27, 3, 106, 3, 31350),
(28, 3, 107, 1, 33150),
(29, 3, 108, 1, 22472),
(30, 3, 109, 1, 50386),
(31, 3, 110, 1, 50386),
(32, 3, 111, 10, 4413),
(33, 3, 112, 7, 4413),
(34, 3, 113, 3, 19296),
(35, 3, 114, 1, 19296),
(36, 3, 115, 1, 19296)
ON CONFLICT (ID_Detalle_Orden) DO NOTHING;

-- 8. RECEPCIONES_MERCADERIA
INSERT INTO RECEPCIONES_MERCADERIA (ID_Recepcion, ID_Orden, Fecha_Recepcion, Nro_Guia_Remision, Observaciones) VALUES
(1, 2, '2025-07-24', 'Despacho01', 'Todo llega en optimas condiciones'),
(2, 3, '2025-07-29', '29379', 'Todo llega en optimas condiciones')
ON CONFLICT (ID_Recepcion) DO NOTHING;

-- 9. DETALLES_RECEPCION
INSERT INTO DETALLES_RECEPCION (ID_Detalle_Recepcion, ID_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote) VALUES
(1, 2, 121, 7, '2026-03-06', 'L2003'),
(2, 2, 122, 1, '2027-03-01', 'Lote 11888'),
(3, 2, 123, 1, '2026-07-01', 'Lote 11883'),
(4, 2, 106, 1, '2027-03-01', 'Lote 11884'),
(5, 2, 107, 1, '2027-02-01', 'Lote 11723'),
(6, 2, 108, 3, '2026-03-13', 'Lote 30239'),
(7, 2, 109, 1, '2026-01-01', 'Lote 89052'),
(8, 2, 110, 4, '2026-05-01', 'Lote 88907'),
(9, 2, 111, 1, '2026-01-16', 'Lote 86788'),
(10, 2, 112, 1, '2026-01-16', 'Lote 88906')
ON CONFLICT (ID_Detalle_Recepcion) DO NOTHING;

-- 10. STOCK_DEPOSITO
INSERT INTO STOCK_DEPOSITO (ID_Stock, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento, Cantidad_Actual_Lote, Ultima_Actualizacion_Lote) VALUES
(1, 121, 'L2003', '2026-03-06', 105, '2025-08-04 10:33:00'),
(2, 122, 'Lote 11888', '2027-03-01', 15, '2025-08-04 10:33:00'),
(3, 123, 'Lote 11883', '2026-07-01', 20, '2025-08-04 10:33:00'),
(4, 106, 'Lote 11884', '2027-03-01', 18, '2025-08-04 10:33:00'),
(5, 107, 'Lote 11723', '2027-02-01', 18, '2025-08-04 10:33:00'),
(6, 108, 'Lote 30239', '2026-03-13', 36, '2025-08-04 10:33:00'),
(7, 109, 'Lote 89052', '2026-01-01', 12, '2025-08-04 10:33:00'),
(8, 110, 'Lote 88907', '2026-05-01', 16, '2025-08-04 10:33:00'),
(9, 111, 'Lote 86788', '2026-01-16', 12, '2025-08-04 10:33:00'),
(10, 112, 'Lote 88906', '2026-01-16', 8, '2025-08-04 10:33:00')
ON CONFLICT (ID_Stock) DO NOTHING;

-- 11. EMPLEADOS
INSERT INTO EMPLEADOS (ID_Empleado, Nombres, Apellidos, RUT_Empleado, Fecha_Nacimiento, Telefono, Email, Fecha_Contratacion, Cargo) VALUES
(1, 'Sebastian', 'Marin', '25.913.604-0', '1977-11-27', '56985144771', 'smaringiacomino@gmail.com', '2023-01-01', 'Director')
ON CONFLICT (ID_Empleado) DO NOTHING;

-- 12. VEHICULOS
INSERT INTO VEHICULOS (ID_Vehiculo, Patente, Marca, Modelo, Ano, Tipo_Vehiculo, Capacidad_Carga_KG, Estado_Vehiculo) VALUES
(1, 'SVLF-48', 'Chevrolet', 'N400 MAX', 2023, 'Furgón', 1000, 'Activo')
ON CONFLICT (ID_Vehiculo) DO NOTHING;

-- 13. ORDENES_CARGA
INSERT INTO ORDENES_CARGA (ID_Orden_Carga, Fecha_Carga, ID_Vehiculo, ID_Chofer, Estado_Carga, Observaciones) VALUES
(1, '2025-08-03', 1, 1, 'Cargada', NULL)
ON CONFLICT (ID_Orden_Carga) DO NOTHING;

-- 14. DETALLES_ORDEN_CARGA
INSERT INTO DETALLES_ORDEN_CARGA (ID_Detalle_Orden_Carga, ID_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado) VALUES
(1, 1, 121, 1, 30, 'L2003'),
(2, 1, 122, 1, 6, 'Lote 11888'),
(3, 1, 107, 1, 4, 'Lote 11723'),
(4, 1, 108, 1, 24, 'Lote 30239'),
(5, 1, 109, 1, 1, 'Lote 89052'),
(6, 1, 110, 1, 6, 'Lote 88907'),
(7, 1, 111, 1, 4, 'Lote 86788'),
(8, 1, 112, 1, 2, 'Lote 88906')
ON CONFLICT (ID_Detalle_Orden_Carga) DO NOTHING;

-- 15. RUTAS
INSERT INTO RUTAS (ID_Ruta, Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas) VALUES
(1, 'Bosquemar, Puerta Sur, Mirasol, Pichipelluco', 'No tiene peajes, tiene congestión entre las 12:00-15:00 cerca de los colegios', 60, NULL)
ON CONFLICT (ID_Ruta) DO NOTHING;

-- 16. CLIENTES
INSERT INTO CLIENTES (ID_Cliente, Razon_Social, RUT_Cliente, Ciclo_Reabastecimiento_Dias, Limite_Credito_Autorizado, Segmento_Cliente) VALUES
(1, 'EVELYN ANDREA INOSTROZA ACEITUNO', '152847297', 7, 0, NULL),
(2, 'COMERCIAL ANKEN SPA', '771860796', NULL, 0, NULL),
(3, 'INGENIEROS ASOCIADOS SPA', '777243128', NULL, 0, NULL)
ON CONFLICT (ID_Cliente) DO NOTHING;

-- 17. SUCURSALES_CLIENTE
INSERT INTO SUCURSALES_CLIENTE (ID_Sucursal, ID_Cliente, Nombre_Sucursal, Direccion_Fisica, Ciudad, Region, Telefono_Contacto, Email_Contacto, Latitud, Longitud, Es_Principal, Observaciones, Codigo_Sucursal) VALUES
(1, 1, 'Sucursal Principal', 'LAGO PANGUIPULLI MZ 91393 PICHIPELLUCO', 'PUERTO MONTT', 'PUERTO MONTT', NULL, NULL, NULL, NULL, TRUE, NULL, 'SUC-001'),
(2, 2, 'Sucursal Principal', 'P PELLUCO LC 1 PICHIPELLUCO', 'PUERTO MONTT', 'PUERTO MONTT', NULL, NULL, NULL, NULL, TRUE, NULL, 'SUC-002'),
(3, 3, 'Sucursal Principal', 'AV ARCHIP JUAN FERNANDEZ 6076 PUERTA SUR ETAPA', 'PUERTO MONTT', 'PUERTO MONTT', NULL, NULL, NULL, NULL, TRUE, NULL, 'SUC-003')
ON CONFLICT (ID_Sucursal) DO NOTHING;

-- 18 (Partial). ORDENES_TRANSPORTE (Dependencies check: ID_Ruta 1 exists, ID_Orden_Carga 1 exists)
INSERT INTO ORDENES_TRANSPORTE (ID_Orden_Transporte, ID_Orden_Carga, ID_Ruta, Fecha_Salida, Fecha_Llegada_Estimada, Estado_Transporte, Observaciones) VALUES
(1, 1, 1, '2025-08-04 09:00:00', '2025-08-04 19:00:00', 'Programada', 'Prioridad de visita: Cliente Libreria Bosquemar')
ON CONFLICT (ID_Orden_Transporte) DO NOTHING;

-- 21. DESTINOS_TRANSPORTE (Note: User input had NULL ID_Destino_Transporte, using sequences usually, but here manually assigning to avoid null constraint if PK is manual, or using defaults. The schema doesn't specify SERIAL implies manual management in previous inserts so I will assume manual IDs for now, assigning 1, 2, 3)
INSERT INTO DESTINOS_TRANSPORTE (ID_Destino_Transporte, ID_Orden_Transporte, ID_Sucursal, Orden_Visita, Estado_Entrega, Observaciones_Entrega, Tiempo_Estancia_Estimado_Minutos) VALUES
(1, 1, 1, 1, 'Pendiente', NULL, NULL),
(2, 1, 2, 2, 'Pendiente', NULL, NULL),
(3, 1, 3, 3, 'Pendiente', NULL, NULL)
ON CONFLICT (ID_Destino_Transporte) DO NOTHING;
