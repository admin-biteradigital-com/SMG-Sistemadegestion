Changelog del Sistema SMG
Para: Administradores de Base de Datos, Desarrolladores, BitEra Digital, SMG
De: Gemini (Asistente de BitEra Digital)
Fecha: 19 de agosto de 2025
Propósito: Este documento registra los cambios significativos en el diseño de la base de datos del Sistema de Gestión y Control Interno de SMG. Sirve como un historial de versiones para comprender la evolución del sistema, las adiciones de funcionalidades y las mejoras en la estructura de datos.
Historial de Versiones de la Base de Datos
Versión 1.0 (Base Inicial)
Fecha: Inicio del Proyecto
Descripción: Establecimiento del modelo de datos fundamental para la gestión de proveedores, productos y órdenes de compra básicas.
Cambios en la Base de Datos:
Nuevas Tablas:
PROVEEDORES: Gestión de información de proveedores.
PRODUCTOS_SERVICIOS: Catálogo de productos.
ORDENES_COMPRA: Registro de órdenes de compra.
DETALLES_ORDEN: Detalles de los productos en cada orden de compra.
Valor de Negocio: Permite el registro digital de la cadena de suministro inicial.
Versión 1.1 (Control de Depósito y Cargas)
Fecha: 21 de Julio de 2025 (Aproximado)
Descripción: Incorporación de la gestión de recepción de mercadería en el depósito y la planificación de cargas para autoventa.
Cambios en la Base de Datos:
Nuevas Tablas:
RECEPCIONES_MERCADERIA: Registro de la llegada de mercadería.
DETALLES_RECEPCION: Detalles de los productos recibidos en cada recepción.
STOCK_DEPOSITO: Gestión del inventario actual en el depósito.
ORDENES_CARGA: Planificación de la carga de vehículos.
DETALLES_ORDEN_CARGA: Detalles de los productos cargados en cada orden de carga.
Lógica de Actualización: STOCK_DEPOSITO se actualiza automáticamente con entradas de DETALLES_RECEPCION y salidas de DETALLES_ORDEN_CARGA.
Valor de Negocio: Control de inventario en tiempo real y trazabilidad de productos en el depósito.
Versión 1.2 (Gestión de Personal y Flota)
Fecha: 21 de Julio de 2025 (Aproximado)
Descripción: Adición de la capacidad para gestionar empleados y la flota de vehículos, asignando responsabilidades a las operaciones.
Cambios en la Base de Datos:
Nuevas Tablas:
EMPLEADOS: Registro de personal (choferes, peones, vendedores).
VEHICULOS: Registro de la flota de vehículos.
Tablas Modificadas:
ORDENES_CARGA: Se añadió ID_Vehiculo (FK a VEHICULOS) y ID_Chofer (FK a EMPLEADOS) para asignar recursos.
DETALLES_ORDEN_CARGA: Se añadió ID_Peon_Carga (FK a EMPLEADOS) para registrar la responsabilidad de la carga.
Valor de Negocio: Trazabilidad de recursos humanos y materiales en operaciones logísticas.
Versión 1.3 (Rutas, Clientes y Órdenes de Transporte)
Fecha: 22 de Julio de 2025 (Aproximado)
Descripción: Inclusión de la gestión de rutas, la base de clientes y la formalización de las órdenes de transporte para la autoventa.
Cambios en la Base de Datos:
Nuevas Tablas:
RUTAS: Definición de rutas de autoventa.
CLIENTES: Base de datos de clientes.
ORDENES_TRANSPORTE: Registro de jornadas de despacho, vinculadas a una ORDEN_CARGA.
DESTINOS_TRANSPORTE: Clientes a visitar en cada orden de transporte.
DETALLES_DESTINO_TRANSPORTE: Productos planificados para cada destino.
Tablas Modificadas:
ORDENES_TRANSPORTE: Se añadió ID_Orden_Carga (FK, UNIQUE) y ID_Ruta (FK).
Valor de Negocio: Estructura para la planificación logística de la autoventa y gestión de la base de clientes.
Versión 1.4 (Ventas en Ruta y Facturación)
Fecha: 22 de Julio de 2025 (Aproximado)
Descripción: Implementación del registro de ventas realizadas en ruta y la gestión de facturación.
Cambios en la Base de Datos:
Nuevas Tablas:
ORDENES_VENTA: Registro de ventas en ruta.
DETALLES_ORDEN_VENTA: Detalles de los productos vendidos en cada orden de venta.
FACTURAS: Registro de facturas emitidas.
Tablas Modificadas:
ORDENES_VENTA: Se añadió ID_Agente_Venta (FK a EMPLEADOS).
FACTURAS: Se añadió ID_Orden_Venta (FK, UNIQUE).
Valor de Negocio: Trazabilidad de ingresos por ventas y control básico de documentos fiscales.
Versión 1.5 (Ventas a Crédito, Pagos Diferidos y Control de Vencimientos)
Fecha: 23 de Julio de 2025
Descripción: Adición de la capacidad para gestionar ventas a crédito, registrar pagos diferidos y un control más granular del inventario por fecha de vencimiento y lote.
Cambios en la Base de Datos:
Nuevas Tablas:
PAGOS_RECIBIDOS: Registro de pagos recibidos.
Tablas Modificadas:
CLIENTES: Se añadió Limite_Credito_Autorizado.
ORDENES_VENTA: Se añadió Metodo_Pago, Fecha_Vencimiento_Credito, Estado_Cobro.
DETALLES_RECEPCION: Se añadió Fecha_Vencimiento, Numero_Lote para control de calidad.
STOCK_DEPOSITO: Se modificó para gestionar inventario por Numero_Lote y Fecha_Vencimiento (Cantidad_Actual_Lote ahora es por lote).
DETALLES_ORDEN_CARGA: Se añadió Numero_Lote_Cargado para trazabilidad del lote en el vehículo.
Valor de Negocio: Gestión financiera más robusta (cuentas por cobrar), control de calidad de productos y optimización de la rotación de inventario.
Versión 1.6 (Funcionalidades de Valor Agregado - Estructura de Datos)
Fecha: 23 de Julio de 2025
Descripción: Inclusión de la estructura de datos necesaria para futuras funcionalidades de optimización, predicción, CRM y rendimiento.
Cambios en la Base de Datos:
Nuevas Tablas:
INTERACCIONES_CLIENTE: Registro de interacciones con clientes.
USUARIOS_CLIENTES: Gestión de usuarios para portal de clientes.
RENDIMIENTO_EMPLEADO: Métricas de rendimiento de empleados.
METAS_EMPLEADO: Definición de metas para empleados.
CLIENTE_PREFERENCIAS: Preferencias de productos/categorías de clientes.
RUTAS_SUGERIDAS: Rutas optimizadas sugeridas por el sistema.
DETALLES_RUTA_SUGERIDA: Detalles de las paradas en rutas sugeridas.
Tablas Modificadas:
PRODUCTOS_SERVICIOS: Se añadió Tiempo_Entrega_Proveedor_Dias, Stock_Seguridad_Minimo, Punto_Reorden, Cantidad_Reorden_Optima para predicción de demanda.
RUTAS: Se añadió Duracion_Estimada_Horas para optimización de rutas.
CLIENTES: Se añadió Latitud, Longitud, Segmento_Cliente para optimización de rutas y CRM.
DESTINOS_TRANSPORTE: Se añadió Tiempo_Estancia_Estimado_Minutos para optimización de rutas.
FACTURAS: Se añadió Estado_SII, Folio_SII, Fecha_Envio_SII para integración con el SII.
RUTAS_SUGERIDAS: Se añadió ID_Chofer (FK a EMPLEADOS) para la asignación de chofer sugerido.
Valor de Negocio: Cimientos de datos para inteligencia de negocio, automatización avanzada y mejora de la experiencia del cliente y empleado.
Versión 1.7 (Gestión de Unidades de Medida Jerárquica)
Fecha: 23 de Julio de 2025
Descripción: Implementación de un sistema flexible para la gestión de unidades de medida y conversiones entre diferentes jerarquías de empaque (caja, display, unidad base).
Cambios en la Base de Datos:
Nuevas Tablas:
UNIDADES_MEDIDA: Catálogo de todas las unidades de medida.
PRODUCTO_UNIDADES_CONVERSION: Definición de factores de conversión entre unidades para cada producto.
Tablas Modificadas:
PRODUCTOS_SERVICIOS:
Se eliminó Displays_Por_Caja.
Se añadieron ID_Unidad_Compra (FK a UNIDADES_MEDIDA), ID_Unidad_Venta (FK a UNIDADES_MEDIDA), y ID_Unidad_Base (FK a UNIDADES_MEDIDA).
DETALLES_ORDEN.Cantidad: Ahora se registra en ID_Unidad_Compra.
DETALLES_RECEPCION.Cantidad_Recibida: Ahora se registra en ID_Unidad_Compra.
STOCK_DEPOSITO.Cantidad_Actual_Lote: Ahora se registra siempre en ID_Unidad_Base.
DETALLES_ORDEN_CARGA.Cantidad_Cargada: Ahora se registra en ID_Unidad_Venta.
DETALLES_PEDIDO_CLIENTE.Cantidad_Solicitada/Cantidad_Entregada: Ahora se registran en ID_Unidad_Venta.
DETALLES_DESTINO_TRANSPORTE.Cantidad_Entregar: Ahora se registra en ID_Unidad_Venta.
DETALLES_ORDEN_VENTA.Cantidad_Vendida: Ahora se registra en ID_Unidad_Venta.
Valor de Negocio: Flexibilidad y precisión en el control de inventario para productos con múltiples unidades de empaque, simplificando la gestión de stock y los cálculos de costos/ganancias.
Versión 1.8 (Gestión de Sucursales de Clientes)
Fecha: 4 de Agosto de 2025
Descripción: Implementación de la capacidad para gestionar clientes con múltiples sucursales o direcciones de entrega, manteniendo la unicidad del RUT del cliente principal.
Cambios en la Base de Datos:
Nuevas Tablas:
SUCURSALES_CLIENTE: Almacena los detalles específicos de cada sucursal o punto de entrega de un cliente.
Tablas Modificadas:
CLIENTES:
Se eliminaron Direccion_Cliente, Ciudad_Cliente, Region_Cliente, Telefono_Cliente, Email_Cliente, Latitud, Longitud.
Ahora se centra en la información de la entidad legal o principal del cliente.
DESTINOS_TRANSPORTE:
El atributo ID_Cliente (FK) fue reemplazado por ID_Sucursal (FK a SUCURSALES_CLIENTE.ID_Sucursal).
La restricción UNIQUE ahora es por (ID_Orden_Transporte, ID_Sucursal).
PEDIDOS_CLIENTE:
El atributo ID_Cliente (FK) fue reemplazado por ID_Sucursal (FK a SUCURSALES_CLIENTE.ID_Sucursal).
INTERACCIONES_CLIENTE: Se añadió ID_Sucursal (FK a SUCURSALES_CLIENTE.ID_Sucursal) como atributo opcional.
USUARIOS_CLIENTES: Se añadió ID_Sucursal (FK a SUCURSALES_CLIENTE.ID_Sucursal) como atributo opcional.
DETALLES_RUTA_SUGERIDA: El atributo ID_Cliente (FK) fue reemplazado por ID_Sucursal (FK a SUCURSALES_CLIENTE.ID_Sucursal).
Valor de Negocio: Permite una gestión precisa de clientes con múltiples ubicaciones, mejora la planificación logística por punto de entrega y soporta reportes granulares por sucursal.
Versión 1.9 (Automatización e Identificación de Productos)
Fecha: 19 de agosto de 2025
Descripción: Adición de atributos clave para facilitar la automatización de la entrada de datos mediante escaneo y la identificación inequívoca de productos.
Cambios en la Base de Datos:
Tablas Modificadas:
PRODUCTOS_SERVICIOS:
Se añadieron los atributos Codigo_Barras (VARCHAR(255), UNIQUE) y Codigo_QR (VARCHAR(255), UNIQUE) para la identificación única de cada producto.
DETALLES_RECEPCION:
Se añadió el atributo Cantidad_Recibida_Unidad_Base (INT, GENERATED ALWAYS AS...) para registrar la cantidad recibida convertida a la ID_Unidad_Base del producto, automatizando el cálculo.
SUCURSALES_CLIENTE:
Se añadió el atributo Codigo_Sucursal (VARCHAR(50), UNIQUE) para una identificación más sencilla y unívoca de las sucursales.
DESTINOS_TRANSPORTE:
Se añadió el atributo Tiempo_Estancia_Real_Minutos (INT) para capturar el tiempo real de la visita y compararlo con el estimado.
Valor de Negocio: Habilita la automatización de procesos de recepción y carga mediante escaneo, reduce los errores de entrada de datos, y mejora la precisión del análisis de rendimiento de rutas.
