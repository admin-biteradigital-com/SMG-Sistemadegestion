# 📋 CONTRATOS DE DATOS - SMG

**Versión**: 1.0  
**Fecha**: 2026-01-31  
**Estado**: NORMATIVO OBLIGATORIO  
**Autoridad**: Concilio de Roles Tecnológicos

---

## 1. PRINCIPIO FUNDAMENTAL

> **"Todo intercambio de datos entre capas del sistema debe estar explícitamente documentado y validado."**

**Regla de Oro**:
- ❌ **PROHIBIDO** asumir la estructura de datos
- ✅ **OBLIGATORIO** consultar el contrato antes de consumir
- ✅ **OBLIGATORIO** documentar antes de exponer

---

## 2. CONVENCIÓN DE NOMENCLATURA

### 2.1 Estándar Oficial: `snake_case` en minúsculas

**Decisión Conciliar**: Todos los campos de datos en el sistema SMG deben usar `snake_case` en minúsculas.

**Razón Técnica**:
- PostgreSQL convierte automáticamente todos los nombres de columnas a minúsculas
- Independientemente de cómo se definan en el schema (`Nombre_Proveedor`), la base de datos devuelve `nombre_proveedor`
- Intentar usar PascalCase o camelCase genera inconsistencias

**Ejemplos Correctos**:
```javascript
// ✅ CORRECTO
{
  id_cliente: 1,
  razon_social: "ACME Corp",
  rut_cliente: "12345678-9",
  limite_credito_autorizado: 1000000
}
```

**Ejemplos Incorrectos**:
```javascript
// ❌ INCORRECTO
{
  ID_Cliente: 1,              // PascalCase
  razonSocial: "ACME Corp",   // camelCase
  RUT_Cliente: "12345678-9"   // Mixed case
}
```

### 2.2 Excepciones Permitidas

**Ninguna**. No hay excepciones a esta regla en el sistema SMG.

---

## 3. RESPONSABILIDADES POR CAPA

### 3.1 Base de Datos (PostgreSQL)

**Responsabilidad**: Definir el schema autoritativo

**Reglas**:
- Las columnas se definen en el schema SQL
- PostgreSQL las convierte automáticamente a minúsculas
- El schema es la **única fuente de verdad**

**Ejemplo**:
```sql
-- Schema define:
CREATE TABLE CLIENTES (
    ID_Cliente INT PRIMARY KEY,
    Razon_Social VARCHAR(255)
);

-- PostgreSQL devuelve:
-- { id_cliente: 1, razon_social: "..." }
```

### 3.2 Backend (Node.js/Express)

**Responsabilidad**: Exponer contratos de datos documentados

**Reglas**:
1. ✅ Devolver datos **exactamente como vienen de la base de datos**
2. ❌ **NO transformar** nombres de campos
3. ✅ Documentar la estructura de respuesta en este archivo
4. ✅ Validar que las queries devuelvan los campos esperados

**Ejemplo de Controller Correcto**:
```javascript
// ✅ CORRECTO - Sin transformación
const getAllClients = async (req, res) => {
    const result = await db.query('SELECT * FROM CLIENTES');
    res.json(result.rows); // Devuelve tal cual
};
```

**Ejemplo de Controller Incorrecto**:
```javascript
// ❌ INCORRECTO - Transformación manual
const getAllClients = async (req, res) => {
    const result = await db.query('SELECT * FROM CLIENTES');
    const transformed = result.rows.map(row => ({
        ID_Cliente: row.id_cliente,  // ❌ NO hacer esto
        Razon_Social: row.razon_social
    }));
    res.json(transformed);
};
```

### 3.3 Frontend (React)

**Responsabilidad**: Consumir contratos documentados

**Reglas**:
1. ✅ **SIEMPRE** consultar el contrato antes de consumir un endpoint
2. ✅ Acceder a campos usando **exactamente** los nombres documentados
3. ❌ **NO asumir** nombres de campos
4. ✅ Usar validación defensiva (`&&`) para campos opcionales
5. ✅ Mapear a nombres internos **solo si es absolutamente necesario**

**Ejemplo Correcto**:
```javascript
// ✅ CORRECTO - Acceso directo a campos documentados
<TableCell>{client.razon_social}</TableCell>
<TableCell>{client.rut_cliente}</TableCell>
```

**Ejemplo Incorrecto**:
```javascript
// ❌ INCORRECTO - Asumiendo nombres no documentados
<TableCell>{client.nombre_cliente}</TableCell>  // Campo no existe
<TableCell>{client.Razon_Social}</TableCell>    // Case incorrecto
```

---

## 4. CONTRATOS DE ENDPOINTS

### 4.1 Formato de Documentación

Cada endpoint debe documentar:
1. **Ruta y Método**
2. **Descripción**
3. **Request Body** (si aplica)
4. **Response Body** (estructura exacta)
5. **Códigos de Estado**
6. **Notas Especiales**

### 4.2 Contratos Actuales

---

#### **GET /api/clients**

**Descripción**: Obtiene todos los clientes registrados

**Request**: Ninguno

**Response**: `200 OK`
```json
[
  {
    "id_cliente": 1,
    "razon_social": "EVELYN ANDREA INOSTROZA ACEITUNO",
    "rut_cliente": "152847297",
    "ciclo_reabastecimiento_dias": 7,
    "limite_credito_autorizado": "0.00",
    "segmento_cliente": null
  }
]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_cliente` | integer | NO | ID único del cliente |
| `razon_social` | string | NO | Razón social o nombre del cliente |
| `rut_cliente` | string | NO | RUT del cliente (sin formato) |
| `ciclo_reabastecimiento_dias` | integer | SÍ | Días entre reabastecimientos |
| `limite_credito_autorizado` | decimal | SÍ | Límite de crédito en pesos |
| `segmento_cliente` | string | SÍ | Segmento del cliente (Premium, Estándar, Básico) |

**Notas**:
- ⚠️ NO existe campo `nombre_cliente`, `telefono_cliente`, `email_cliente`, ni `direccion_cliente`
- Esos datos están en la tabla `SUCURSALES_CLIENTE` (relación 1:N)

---

#### **POST /api/clients**

**Descripción**: Crea un nuevo cliente

**Request Body**:
```json
{
  "ID_Cliente": 100,
  "Razon_Social": "Nueva Empresa S.A.",
  "RUT_Cliente": "12345678-9",
  "Ciclo_Reabastecimiento_Dias": 7,
  "Limite_Credito_Autorizado": 500000,
  "Segmento_Cliente": "Estándar"
}
```

**Nota**: El backend espera PascalCase en el request body (legacy), pero devuelve snake_case en la respuesta.

**Response**: `201 Created`
```json
{
  "id_cliente": 100,
  "razon_social": "Nueva Empresa S.A.",
  "rut_cliente": "12345678-9",
  "ciclo_reabastecimiento_dias": 7,
  "limite_credito_autorizado": "500000.00",
  "segmento_cliente": "Estándar"
}
```

---

#### **GET /api/suppliers**

**Descripción**: Obtiene todos los proveedores registrados

**Request**: Ninguno

**Response**: `200 OK`
```json
[
  {
    "id_proveedor": 2,
    "nombre_proveedor": "Diacsa S.A.",
    "contacto_proveedor": "Juan Pérez",
    "telefono_proveedor": "+56912345678",
    "email_proveedor": "contacto@diacsa.cl",
    "direccion_proveedor": "Av. Principal 123",
    "rut_proveedor": "76123456-7"
  }
]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_proveedor` | integer | NO | ID único del proveedor |
| `nombre_proveedor` | string | NO | Razón social del proveedor |
| `contacto_proveedor` | string | SÍ | Nombre del contacto |
| `telefono_proveedor` | string | SÍ | Teléfono de contacto |
| `email_proveedor` | string | SÍ | Email de contacto |
| `direccion_proveedor` | string | SÍ | Dirección física |
| `rut_proveedor` | string | NO | RUT del proveedor |

**Notas**:
- ⚠️ Todos los campos son `snake_case` en minúsculas
- ⚠️ NO usar `ID_Proveedor`, `Nombre_Proveedor`, etc. (PascalCase)

---

#### **GET /api/products**

**Descripción**: Obtiene todos los productos/servicios

**Request**: Ninguno

**Response**: `200 OK`
```json
[
  {
    "id_producto_servicio": 101,
    "nombre_producto_servicio": "Coca-Cola 2L",
    "categoria": "Bebidas",
    "unidad_medida": "Unidad",
    "precio_venta_sugerido": "1500.00",
    "stock_actual": 100,
    "stock_minimo": 20
  }
]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_producto_servicio` | integer | NO | ID único del producto |
| `nombre_producto_servicio` | string | NO | Nombre del producto |
| `categoria` | string | SÍ | Categoría del producto |
| `unidad_medida` | string | SÍ | Unidad de medida (Unidad, Kg, L, etc.) |
| `precio_venta_sugerido` | decimal | SÍ | Precio sugerido de venta |
| `stock_actual` | integer | SÍ | Stock disponible actual |
| `stock_minimo` | integer | SÍ | Stock mínimo para alerta |


---

#### **GET /api/vehicles**

**Descripción**: Obtiene todos los vehículos registrados en la flota.

**Request**: Ninguno

**Response**: `200 OK`
```json
[
  {
    "id_vehiculo": 1,
    "patente": "SVLF-48",
    "marca": "Chevrolet",
    "modelo": "N400 MAX",
    "ano": 2023,
    "tipo_vehiculo": "Furgón",
    "capacidad_carga_kg": "1000.00",
    "estado_vehiculo": "Activo"
  }
]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_vehiculo` | integer | NO | ID único del vehículo |
| `patente` | string | NO | Patente del vehículo (Placa) |
| `marca` | string | NO | Marca del fabricante |
| `modelo` | string | NO | Modelo del vehículo |
| `ano` | integer | SÍ | Año de fabricación |
| `tipo_vehiculo` | string | SÍ | Tipo de vehículo (e.g., Furgón, Camión) |
| `capacidad_carga_kg` | decimal | SÍ | Capacidad de carga máxima en Kg |
| `estado_vehiculo` | string | SÍ | Estado operativo (Activo/Inactivo) |

**Notas**:
- Este endpoint es crítico para el módulo de Órdenes de Carga (`/load-orders`).
- ⚠️ NO existe `patente_vehiculo` o `nombre_vehiculo`.
- Usar combinación `marca` + `modelo` para mostrar nombre descriptivo.

---

#### **GET /api/purchase-orders**

**Descripción**: Obtiene todas las órdenes de compra

**Request**: Ninguno

**Response**: `200 OK`
```json
[
  {
    "id_orden": 1,
    "fecha_creacion": "2025-07-21T03:00:00.000Z",
    "fecha_entrega_estimada": "2025-07-23T03:00:00.000Z",
    "estado_orden": "Confirmada",
    "total_orden": "645793.00",
    "notas": "Cuarta semana de julio",
    "id_proveedor": 2
  }
]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_orden` | integer | NO | ID único de la orden |
| `fecha_creacion` | timestamp | NO | Fecha de creación |
| `fecha_entrega_estimada` | timestamp | SÍ | Fecha estimada de entrega |
| `estado_orden` | string | NO | Estado (Pendiente, Confirmada, Completada, etc.) |
| `total_orden` | decimal | NO | Total de la orden |
| `notas` | string | SÍ | Notas adicionales |
| `id_proveedor` | integer | NO | ID del proveedor (FK) |

---

#### **GET /api/purchase-orders/:id**

**Descripción**: Obtiene una orden de compra con sus detalles

**Request**: Ninguno

**Response**: `200 OK`
```json
{
  "id_orden": 1,
  "fecha_creacion": "2025-07-21T03:00:00.000Z",
  "fecha_entrega_estimada": "2025-07-23T03:00:00.000Z",
  "estado_orden": "Confirmada",
  "total_orden": "645793.00",
  "notas": "Cuarta semana de julio",
  "id_proveedor": 2,
  "items": [
    {
      "id_detalle_orden": 1,
      "id_orden": 1,
      "id_producto_servicio": 101,
      "cantidad": 20,
      "precio_unitario_acordado": "7800.00",
      "subtotal_linea": "156000.00"
    }
  ]
}
```

**Campos Adicionales**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `items` | array | NO | Array de detalles de la orden |
| `items[].id_detalle_orden` | integer | NO | ID del detalle |
| `items[].cantidad` | integer | NO | Cantidad del producto |
| `items[].precio_unitario_acordado` | decimal | NO | Precio unitario acordado |
| `items[].subtotal_linea` | decimal | NO | Subtotal de la línea |

---

## 5. PROCEDIMIENTO DE VALIDACIÓN

### 5.1 Antes de Consumir un Endpoint

**Checklist Obligatorio**:
1. [ ] Consultar el contrato en `DATA_CONTRACTS.md`
2. [ ] Verificar los nombres exactos de los campos
3. [ ] Identificar campos nullable (pueden ser `null`)
4. [ ] Probar el endpoint con `curl` o Postman
5. [ ] Copiar la respuesta real y compararla con el contrato

**Ejemplo de Validación**:
```bash
# Probar endpoint
curl http://localhost:3000/api/clients | ConvertFrom-Json | Select-Object -First 1

# Verificar que los campos coincidan con el contrato
```

### 5.2 Antes de Crear un Endpoint

**Checklist Obligatorio**:
1. [ ] Definir la estructura de respuesta
2. [ ] Documentarla en `DATA_CONTRACTS.md`
3. [ ] Implementar el endpoint
4. [ ] Validar que la respuesta coincida con lo documentado
5. [ ] Notificar al equipo frontend del nuevo contrato

---

## 6. CASO DE ESTUDIO: RC-01 y RC-02

### 6.1 RC-01: Clientes - Campos Inexistentes

**Qué Falló**:
- Frontend esperaba: `nombre_cliente`, `telefono_cliente`, `email_cliente`, `direccion_cliente`
- Backend devolvía: `razon_social`, `rut_cliente`, `ciclo_reabastecimiento_dias`, etc.
- **Resultado**: Tabla mostraba solo guiones (`-`)

**Por Qué Falló**:
- ❌ No se consultó el contrato (no existía)
- ❌ Se asumió la estructura de datos
- ❌ No se probó el endpoint antes de implementar el frontend

**Cómo se Corrigió**:
- ✅ Se consultó la tabla real en la base de datos
- ✅ Se actualizó el frontend para usar los campos correctos
- ✅ Se documentó el contrato en este archivo

**Regla que lo Previene**:
- **Sección 5.1**: Validación obligatoria antes de consumir

**Qué Hubiera Pasado**:
- Si no se detectaba ahora, el módulo de clientes sería inutilizable en producción
- Pérdida de confianza del usuario
- Tiempo perdido en debugging en producción

### 6.2 RC-02: Proveedores - Inconsistencia de Capitalización

**Qué Falló**:
- Frontend esperaba: `Nombre_Proveedor`, `RUT_Proveedor` (PascalCase)
- Backend devolvía: `nombre_proveedor`, `rut_proveedor` (snake_case)
- **Resultado**: Error `undefined.toLowerCase()` → Página colapsada

**Por Qué Falló**:
- ❌ No se conocía la convención de PostgreSQL (convierte a minúsculas)
- ❌ No se probó el endpoint antes de implementar
- ❌ No había documentación de la convención

**Cómo se Corrigió**:
- ✅ Se actualizó todo el frontend para usar snake_case
- ✅ Se agregó validación defensiva (`&&`)
- ✅ Se documentó la convención en este archivo

**Regla que lo Previene**:
- **Sección 2.1**: Convención oficial de nomenclatura
- **Sección 5.1**: Validación obligatoria

**Qué Hubiera Pasado**:
- Página de proveedores completamente rota en producción
- Imposibilidad de gestionar proveedores
- Bloqueo del flujo de órdenes de compra

---

## 7. MANTENIMIENTO DE ESTE DOCUMENTO

### 7.1 Cuándo Actualizar

Este documento debe actualizarse cuando:
- ✅ Se crea un nuevo endpoint
- ✅ Se modifica la estructura de respuesta de un endpoint existente
- ✅ Se agrega o elimina un campo de una tabla
- ✅ Se detecta una inconsistencia entre contrato y realidad

### 7.2 Quién es Responsable

- **Backend Developer**: Documentar nuevos endpoints
- **Database Admin**: Notificar cambios en schema
- **Tech Lead**: Revisar y aprobar cambios en contratos
- **QA**: Validar que contratos coincidan con realidad

### 7.3 Proceso de Actualización

1. Modificar este archivo (`DATA_CONTRACTS.md`)
2. Crear un commit con mensaje: `docs: update data contract for [endpoint]`
3. Notificar al equipo en el canal de desarrollo
4. Actualizar frontend si es necesario (breaking change)

---

## 8. HERRAMIENTAS DE VALIDACIÓN

### 8.1 Validación Manual con curl

```bash
# Clientes
curl http://localhost:3000/api/clients | ConvertFrom-Json | Select-Object -First 1

# Proveedores
curl http://localhost:3000/api/suppliers | ConvertFrom-Json | Select-Object -First 1

# Productos
curl http://localhost:3000/api/products | ConvertFrom-Json | Select-Object -First 1

# Órdenes de Compra
curl http://localhost:3000/api/purchase-orders | ConvertFrom-Json | Select-Object -First 1
```

### 8.2 Validación Automatizada (Futuro)

**Recomendación**: Implementar tests de contrato con herramientas como:
- **Pact** (Contract Testing)
- **JSON Schema Validation**
- **TypeScript Interfaces** (si se migra a TS)

---

## 9. GLOSARIO

| Término | Definición |
|---------|------------|
| **Contrato de Datos** | Especificación explícita de la estructura de datos intercambiada entre capas |
| **snake_case** | Convención de nomenclatura: `nombre_campo` (minúsculas con guiones bajos) |
| **PascalCase** | Convención de nomenclatura: `NombreCampo` (mayúsculas iniciales) |
| **camelCase** | Convención de nomenclatura: `nombreCampo` (primera palabra minúscula) |
| **Nullable** | Campo que puede tener valor `null` |
| **FK** | Foreign Key (Clave Foránea) |
| **Breaking Change** | Cambio que rompe compatibilidad con versiones anteriores |

---

## 10. REFERENCIAS

- **Schema de Base de Datos**: `database/01_smg_schema.sql`
- **Guía de Integración**: `docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md`
- **Estándares de Documentación**: `docs/DOCUMENTATION_STANDARD.md`
- **Reporte QA Visual**: `QA_VISUAL_REPORT_FASE2.md`

---

**Documento Normativo**  
**Versión**: 1.0  
**Última Actualización**: 2026-01-31  
**Próxima Revisión**: Cada vez que se modifique un endpoint  
**Autoridad**: Concilio de Roles Tecnológicos
