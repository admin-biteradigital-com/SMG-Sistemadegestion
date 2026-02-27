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
1. **Frontend**: Falta la interfaz gráfica de SIGLO y el portal Abritusitio (React/Next.js) para materializar la capa visual de todo el ecosistema.

## 5. Próxima Acción Recomendada
Con la arquitectura base 100% operativa (backend, persistencia multitenant aislada, workspaces, auth jwt), la prioridad natural es:
1. **Iniciar frontend SIGLO o Abritusitio** — Construir la primera interfaz visual SPA consumiendo los endpoints de `@smg/siglo-workframe`.
