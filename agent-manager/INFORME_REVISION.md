# INFORME TÉCNICO DE REVISIÓN ACTUALIZADO - SISTEMA SMG

## 1. Arquitectura Actual
Se ha migrado de una estructura monolítica (`/backend`) hacia una **Arquitectura Multi-Producto Desacoplada** tipo Workspaces (Monorepo) en el branch `Gemini3.1-Pro`.

**Dominios Establecidos:**
- `@smg/core`: Utilidades, middlewares genéricos.
- `@smg/database-layer`: Abstracción relacional, Wrapper `queryMultiTenant` que inyecta parámetros de aislamiento por tenant.
- `@smg/service-layer`: Lógica de negocio pura agrupada por dominio (`/logistica`, `/catalogo`), agnóstica de capas HTTP.
- `@smg/siglo-workframe`: Exposición API Backend B2B Interno. Corre en `PORT: 3001` con middleware de intercepción Multi-tenant (Ej. Tenant: `smg`).
- `@smg/abritusitio`: Exposición API Backend B2C de Catálogo Público. Corre en `PORT: 4001`, aislado de la lógica de logística interna.

Todo este enjambre está orquestado mediante **Docker Compose**, lo que significa que arrancar el stack levantará en paralelo PostgreSQL, SIGLO y Abritusitio en un entorno aislado y reproducible.

## 2. Progreso por Módulo (Fase 6 en curso)
| Módulo | Estado | Detalles |
| :--- | :--- | :--- |
| **Infraestructura** | 🟢 Completado | Workspaces de NPM, `Dockerfile`, `docker-compose.yml` finalizados. |
| **Persistencia** | 🟢 Completado | `db.js` abstraído y empaquetado como workspace propio. |
| **Service-Layer** | 🟡 En Progreso | Migración de entidades logísticas: **Products, Clients, Employees, Suppliers, Units, Vehicles** completadas. |
| **SIGLO Core** | 🟡 En Progreso | Framework activo. Los 6 módulos logísticos anteriores ya operan bajo patrón Service/Controller. |
| **Abritusitio** | 🟢 Completado | Framework de Catálogo Público activo (Backend ReadOnly para productos). |

## 3. Archivos Clave Creados
- `/package.json` (Root Workspaces)
- `/docker-compose.yml` y `/Dockerfile`
- `/database-layer/src/db.js`
- `/service-layer/src/logistica/...` (Servicios migrados)
- `/siglo-workframe/src/controllers/logistica/...` & `/routes/logistica/...`
- `/ROADMAP_TECNICO.md` y `/architecture_final.md`

## 4. Riesgos y Pendientes
1. **Migración Parcial:** Quedan pendientes en `/backend` las rutas de: `Routes, Purchase Orders, Receptions, Stock, Load Orders, Transport Orders, Sales`.
2. **Seguridad:** El middleware de tenant sigue siendo mock (`x-tenant-id`). Requiere Auth JWT real.
3. **Frontend:** Falta la interfaz gráfica de Abritusitio y la migración de la de SIGLO.

## 5. Próxima Acción Recomendada
Continuar con la **Fase 6** de migración de las entidades restantes para poder eliminar definitivamente la carpeta legacy `/backend`.
