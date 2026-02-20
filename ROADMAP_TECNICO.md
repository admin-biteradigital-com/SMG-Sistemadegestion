# ROADMAP TÉCNICO V1.0 - ECOSISTEMA SMG (SIGLO & ABRITUSITIO)

## Fase 1: Arquitectura Base e Infraestructura
*   [x] Creación de branch operativo `Gemini3.1-Pro`
*   [x] Diseño de árbol de directorios de nivel superior separando Dominios (core, tenants, db, services)
*   [x] Establecer configuraciones bases (p.ej.: package.json, tsconfig, linter y prettier) a nivel root (monorepo o polyrepo).
*   [ ] Centralizar variables de entorno (Gestión de configuración tipo Vault en `core/config`).
*   [x] Inicialización del `agent-manager` (Controlador autónomo estilo ClawWork) para la persistencia de estado.

## Fase 2: SIGLO Core (Workframe Interno)
*   [x] Configurar y construir esqueleto de aplicación para la gestión administrativa multi-tenant de `SIGLO`.
*   [ ] Implementar sistema de Autenticación, Roles y Permisos.
*   [ ] Integración robusta de logs y auditoría (`core/logger`).
*   [x] Módulos core: Gestión Logística, Inventario, Gestión de Precios (Base en `service-layer/logistica`).
*   [x] Consolidar el primer tenant: `SMG` (a través de middlewares injectores).

## Fase 3: Multi-tenant & Database Layer (Persistencia Inteligente)
*   [x] Mapeo y reingeniería de la persistencia de los datos en `database-layer`. Aislar lógica DB del negocio puro.
*   [x] Diseñar mecanismo de aislamiento Multi-tenant (Logical separation por `tenant_id` o aislamiento de schema). (Vía middleware y db wrapper).
*   [ ] Adaptación del esquema relacional actual para los nuevos dominios compartidos y dominios exclusivos.

## Fase 4: Abritusitio (Portal Público Comercial)
*   [x] Definir y crear estructura web frontend en `./abritusitio/` optimizado para acceso móvil.
*   [x] Conectar catálogo en tiempo real con la DB a través de `service-layer/catalope`.
*   [ ] Personalización visual por Tenant (Ej: themes y assets vinculados a DB / cloud storage).
*   [ ] Optimización de lectura (Caching y CDN).

## Fase 5: Integración y Sistema Operativo Conjunto
*   [x] Orquestar despliegue de piezas (Infra como código / Docker base). (Docker y Docker Compose).
*   [x] Testing de cross-comunicación API entre SIGLO Interno <-> DB <-> Abritusitio. (Integración simulada en middlewares).
*   [x] Publicación de documentación de arquitectura final para venta e implementación del Workframe.
