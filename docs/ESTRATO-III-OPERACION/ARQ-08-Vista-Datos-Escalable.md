# ARQ-08: Estrategia de Datos Escalable (Infinite Data)

**ID:** ARQ-08-Vista-Datos-Escalable  
**Versión:** 1.0  
**Fecha:** 2025-02-04  
**Agente Responsable:** AGENTE-02 (Arquitecto de Datos)  
**Clasificación:** OPERACIÓN / TÉCNICO  

---

## 1. Problema Identificado
El diagnóstico inicial (`GOV-00` sección 2.2) reveló que la arquitectura heredada realizaba cargas completas (`SELECT *`) de las tablas de `PRODUCTOS_SERVICIOS` y `ORDENES_VENTA`. Esto imponía un límite duro a la escalabilidad, degradando el rendimiento del navegador (UI blocking) al superar los ~500 registros.

## 2. Solución Arquitectónica: Paginación en Servidor

### 2.1 Principios de Diseño
Para permitir el manejo de "Datos Infinitos" (>1M registros), se ha implementado el patrón **Offset Pagination** con metadatos.

- **Backend**: No devuelve arrays planos. Devuelve objetos compuestos `{ data, meta }`.
- **Frontend**: No filtra en cliente. Delega el filtrado y ordenamiento al motor SQL (`WHERE ... ILIKE ... ORDER BY ... LIMIT ...`).

### 2.2 Especificación de API

#### Endpoint: `GET /products` y `GET /sales`
| Parámetro | Tipo | Descripción | Default |
| :--- | :--- | :--- | :--- |
| `page` | Integer | Número de página solicitada | 1 |
| `limit` | Integer | Cantidad de registros por página | 10 |
| `search` | String | Término de búsqueda (Nombre/Descripción) | "" |

**Respuesta Estándar (JSON):**
```json
{
  "data": [ ... ], // Array de registros (máx 10)
  "meta": {
    "total": 150,      // Total de registros que coinciden con filtro
    "page": 1,         // Página actual
    "limit": 10,       // Límite aplicado
    "totalPages": 15   // Total de páginas calculadas
  }
}
```

#### Endpoint Especial: `GET /sales/stats`
Para evitar iterar sobre toda la tabla en el frontend, se crea un endpoint dedicado a métricas rápidas.

```json
{
  "today": {
    "count": 45,
    "amount": 12500.50
  },
  "pending": 5
}
```

## 3. Implementación en Componentes

### 3.1 Products.jsx (Catálogo)
- **Estado**: Gestiona `currentPage`, `totalPages`, `searchTerm`.
- **Efecto**: `useEffect` dispara fetch al cambiar `currentPage` o `searchTerm` (con debounce 500ms).
- **Render**: Renderiza solo `limit` items. Controles de navegación `< Anterior | Siguiente >`.

### 3.2 Sales.jsx (Dashboard)
- **Hibridación**: 
  - Cards de métricas consumen `/sales/stats`.
  - Lista "Ventas Recientes" consume `/sales?page=1&limit=5`.
- **Beneficio**: Tiempos de carga inicial (TTI) reducidos de `O(n)` a `O(1)`.

## 4. Impacto ALCOA+
- **Atribuible**: Cambios registrados por AGENTE-02 bajo commit firmado.
- **Legible**: Código documentado y rutas explícitas.
- **Contemporáneo**: Implementación realizada tras aprobación del BIA (`GOV-00`).
- **Original**: Fuente única de verdad en repositorio soberano.
- **Exacto**: Pruebas manuales validan coincidencia entre DB y UI.

---

**Estado de Validación:**  
✅ Backend Implementado  
✅ Frontend Adaptado  
✅ Pruebas de Humo Exitosas  

*Firmado:* AGENTE-02
