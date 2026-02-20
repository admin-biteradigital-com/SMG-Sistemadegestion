# INFORME TÉCNICO DE REVISIÓN - SISTEMA SMG

## 1. Arquitectura Actual
Se ha migrado de una estructura monolítica (`/backend`) hacia una **Arquitectura Multi-Producto Desacoplada** tipo Workspaces (Monorepo).

**Dominios Establecidos:**
- `@smg/core`: Utilidades, middlewares genéricos.
- `@smg/database-layer`: Abstracción relacional, Wrapper `queryMultiTenant` que inyecta parámetros de aislamiento por tenant.
- `@smg/service-layer`: Lógica de negocio pura agrupada por dominio (`/logistica`, `/catalogo`), agnóstica de capas HTTP.
- `@smg/siglo-workframe`: Exposición API Backend B2B Interno. Corre en `PORT: 3001` con middleware de intercepción Multi-tenant (Ej. Tenant: `smg`).
- `@smg/abritusitio`: Exposición API Backend B2C de Catálogo Público. Corre en `PORT: 4001`, aislado de la lógica de logística interna.

Todo este enjambre está orquestado mediante **Docker Compose**, lo que significa que arrancar el stack levantará en paralelo PostgreSQL, SIGLO y Abritusitio en un entorno aislado y reproducible.

## 2. Progreso por Módulo
| Módulo | Estado | Detalles |
| :--- | :--- | :--- |
| **Infraestructura** | 🟢 Completado | Workspaces de NPM, `Dockerfile`, `docker-compose.yml` finalizados. Branch aislado `Gemini3.1-Pro` en uso exclusivo. |
| **Persistencia** | 🟢 Completado | `db.js` abstraído y empaquetado como workspace propio para consumo paralelo de los backends. |
| **Service-Layer** | 🟢 Completado | Capa lista. Lógica pionera migrada con éxito: `productService.js` y `catalogoService.js`. |
| **SIGLO Core** | 🟢 Completado | Framework base de Workframe activo. Rutas iniciales de producto (Logística) convertidas en patrón Service/Controller con RLS Multi-tenant. |
| **Abritusitio** | 🟢 Completado | Framework de Catálogo Público activo. Middlewares que diferencian requests B2C (públicos) e identifican tenant de cara a las ventas. |

## 3. Archivos Creados (Scope Principal)
- `/package.json` (Root Workspaces)
- `/.agent-state.json` y `/agent-manager/README.md`
- `/docker-compose.yml` y `/Dockerfile`
- `/database-layer/package.json` y `src/db.js`
- `/service-layer/package.json`, `src/logistica/productService.js`, `src/catalogo/catalogoService.js`
- `/siglo-workframe/package.json`, `src/index.js`, `src/routes/...`, `src/controllers/...`
- `/abritusitio/package.json`, `src/index.js`, `src/routes/...`, `src/controllers/...`
- `/ROADMAP_TECNICO.md` y `/architecture_final.md`

## 4. Riesgos Detectados (Deuda Técnica Temprana)
1. **Migración Pendiente:** El antiguo monolito que habita en la carpeta estática `/backend` posee múltiples rutas (Clientes, Empleados, Compras, Transporte, etc.) que deben ser gradualmente refactorizadas y trasladadas bajo este mismo patrón hacia `/service-layer` y `/siglo-workframe`. Mantener `/backend` desactualizado junto a lo nuevo puede producir confusión.
2. **Sistema Auth/Seguridad Real:** El middleware actual delega la identificación a la lectura mock de headers genéricos (`req.headers['x-tenant-id']`). Siendo esto Multi-Tenant estricto, es vital implementar un emisor JWT confiable para validar y restringir inyección de falsos tenant_ids.
3. **Ausencia Componente Visual de Abritusitio:** Existe backend pero no portal Frontend consumible en la web (HTML/React/Vue). 

## 5. Próxima Fase Recomendada
- **Fase de Consolidación y Baja de Legacy (Fase 6):** 
  1. Completar la refactorización de los 13 endpoints existentes de `/backend/src/routes/*.js` al nuevo esquema Multi-Tenant en `/service-layer`.
  2. Implementar pasarela de Auth JWT segura para inyectar los claims dinámicamente en middleware global.
  3. Eliminar la carpeta monolítica legacy `/backend` para evitar bifurcaciones no deseadas.
  4. Levantar proyecto `React/Next.js` oficial dentro de `/abritusitio/frontend` comunicándose con nuestro recién creado catálogo.
