# Arquitectura Desacoplada Multi-Tenant (Ecosistema SMG)

## Visión General
El producto ha mutado de un backend monolítico acoplado a un Ecosistema Distribuido en Monorepo a través de `NPM Workspaces`.

## Dominios de Operación
La arquitectura ha sido fraccionada en 5 responsabilidades claras:
1. **@smg/core**: Utilidades compartidas, lógica global y validaciones.
2. **@smg/database-layer**: Abstracción pura de conectividad con la base de datos y métodos multi-tenant (EJ. `queryMultiTenant`) para el aislamiento de datos.
3. **@smg/service-layer**: Lógica de negocio (Products, Catalogo, Auth) que consume de forma agnóstica la capa de base de datos.
4. **@smg/siglo-workframe**: Backend de backoffice logístico. Expone la API al cliente interno (vendedores) bajo el puerto `3001`.
5. **@smg/abritusitio**: Portal comercial público B2C que consume los datos restringidos del `service-layer` para construir catálogos. Expuesto en puerto `4001`.

## Aislamiento Multi-Tenant
La persistencia y el acceso de datos es manejado dinámicamente:
* **SIGLO Workframe** inyecta el `tenantId` (actualmente 'smg' en el piloto) por medio de un middleware analizando Headers / Sesión JWT.
* **Abritusitio** inyecta el `tenantId` desde Headers o resolución de nombre de dominio.
* **Service Layer** transporta el contexto del tenant transparente hacia la capa de bases de datos.

## Infraestructura
Despliegue unificado orquestado por **Docker Compose**, lo que facilita escalar u optimizar el rendimiento individual de la base de datos o de componentes independientes.
