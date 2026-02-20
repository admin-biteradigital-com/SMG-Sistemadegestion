# INFORME TÉCNICO DE REVISIÓN ACTUALIZADO - SISTEMA SMG

## 1. Arquitectura Actual
Se ha migrado de una estructura monolítica (`/backend`) hacia una **Arquitectura Multi-Producto Desacoplada** tipo Workspaces (Monorepo) en el branch `Gemini3.1-Pro`.

**Dominios Establecidos:**
- `@smg/core`: Utilidades, middlewares genéricos.
- `@smg/database-layer`: Abstracción relacional, Wrapper `queryMultiTenant` + `getPool(tenantId)` para transacciones.
- `@smg/service-layer`: Lógica de negocio pura agrupada por dominio (`/logistica`, `/catalogo`), agnóstica de capas HTTP.
- `@smg/siglo-workframe`: Exposición API Backend B2B Interno. Corre en `PORT: 3001` con middleware de intercepción Multi-tenant (Ej. Tenant: `smg`).
- `@smg/abritusitio`: Exposición API Backend B2C de Catálogo Público. Corre en `PORT: 4001`, aislado de la lógica de logística interna.

Todo este enjambre está orquestado mediante **Docker Compose**, lo que significa que arrancar el stack levantará en paralelo PostgreSQL, SIGLO y Abritusitio en un entorno aislado y reproducible.

## 2. Progreso por Módulo (Fase 6 — MIGRACIÓN COMPLETA)
| Módulo | Estado | Detalles |
| :--- | :--- | :--- |
| **Infraestructura** | 🟢 Completado | Workspaces de NPM, `Dockerfile`, `docker-compose.yml` finalizados. |
| **Persistencia** | 🟢 Completado | `db.js` abstraído, empaquetado, exporta `queryMultiTenant` y `getPool`. |
| **Service-Layer** | � Completado | Los 13 módulos logísticos migrados: Products, Clients, Employees, Suppliers, Units, Vehicles, Routes, PurchaseOrders, Receptions, Stock, LoadOrders, TransportOrders, Sales. |
| **SIGLO Core** | � Completado | Todos los 13 módulos con patrón Service/Controller/Routes bajo `/api/v1/logistica/*`. |
| **Abritusitio** | 🟢 Completado | Framework de Catálogo Público activo (Backend ReadOnly para productos). |
| **Legacy /backend** | 🟡 Pendiente eliminación | 100% de rutas migradas. Listo para ser removido. |

## 3. Endpoints SIGLO disponibles en `/api/v1/logistica/`
| Path | Métodos |
| :--- | :--- |
| `/products` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/clients` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/employees` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/suppliers` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/units` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/vehicles` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/routes` | GET, GET/:id, POST, PUT/:id, DELETE/:id |
| `/purchase-orders` | GET, GET/:id, POST, PATCH/:id/status |
| `/receptions` | GET, POST |
| `/stock` | GET |
| `/load-orders` | GET, POST |
| `/transport-orders` | GET, POST |
| `/sales` | GET, POST, POST/payment |

## 4. Riesgos y Pendientes
1. **Eliminar `/backend`**: Toda la lógica está migrada. Confirmar y ejecutar eliminación del directorio legacy.
2. **Seguridad JWT**: El middleware de tenant sigue siendo mock (`req.tenantId = 'smg'`). Requiere Auth JWT real con `req.tenantId` dinámico.
3. **Frontend**: Falta la interfaz gráfica de SIGLO y el portal Abritusitio (React/Next.js).
4. **RLS Postgres**: Activar Row Level Security en la DB para reforzar aislamiento multi-tenant a nivel de DB.

## 5. Próxima Acción Recomendada
Con el monolito 100% vaciado, las opciones ordenadas por impacto son:
1. **Eliminar `/backend`** — Tarea de limpieza arquitectural definitiva.
2. **Implementar Auth JWT Multi-Tenant** — El punto crítico de seguridad.
3. **Iniciar frontend SIGLO o Abritusitio** — Primera interfaz visual del ecosistema.
