# Sistema de Gestión y Control para SMG

## 📖 Descripción del Proyecto
Este es un proyecto de software a medida, diseñado y desarrollado por BitEra Digital para SMG, un emprendimiento de autoventa de golosinas en Chamiza, Región de los Lagos, Chile.

El objetivo principal de este sistema es digitalizar y optimizar todas las operaciones de SMG, proporcionando control total y visibilidad completa de los flujos de negocio, desde la adquisición de productos hasta la venta y la gestión financiera. La implementación se realiza bajo una estrategia de despliegue gradual por fases, garantizando una adopción fluida y la entrega de valor incremental. El sistema se ha concebido como una herramienta estratégica para transformar el conocimiento tácito de Sebastián en datos objetivos y accionables, lo que le permitirá tomar decisiones informadas para el crecimiento sostenible de su empresa.

## ✨ Funcionalidades Clave

El sistema se compone de varios módulos interconectados, construidos para trabajar de forma coherente. Cada módulo está diseñado para resolver un problema operativo específico y contribuir a los objetivos estratégicos de SMG.

### Gestión de Maestros
*   **Proveedores:** Registro y gestión completa de la información de los proveedores, incluyendo datos de contacto y fiscalización (RUT). Esto permite una trazabilidad clara de las transacciones de compra.
*   **Productos y Servicios:** Un catálogo completo de golosinas que va más allá de la simple descripción. Incluye la gestión de unidades de medida jerárquicas (Caja, Display, Bolsa, etc.) y factores de conversión, asegurando que el inventario se gestione en la unidad más relevante para la venta (ID\_Unidad\_Base).
*   **Clientes:** Una base de datos detallada que no solo incluye el RUT y datos de contacto, sino también la gestión de múltiples sucursales por cliente. Los atributos de Latitud y Longitud preparan el terreno para la geolocalización y la optimización de rutas.
*   **Empleados y Vehículos:** Registro de todo el personal (choferes, peones de carga) y la flota de vehículos. Esto es crucial para asignar responsabilidades a cada operación y para futuros análisis de rendimiento.

### Gestión de Compras y Almacenamiento
*   **Órdenes de Compra:** Creación y seguimiento de pedidos a proveedores. El sistema maneja el flujo de confirmación, registrando la respuesta del proveedor y permitiendo ajustes a la orden antes de la recepción, lo que evita sorpresas y errores.
*   **Recepción de Mercadería:** Registro de la entrada física de productos al depósito. Se captura obligatoriamente el lote y la fecha de vencimiento de cada ítem, lo cual es vital para el control de calidad y la seguridad alimentaria.
*   **Control de Inventario (Stock):** El inventario se gestiona en tiempo real, con una trazabilidad completa por lote y fecha de vencimiento. Esto permite aplicar la lógica FEFO (First Expired, First Out), minimizando las pérdidas por productos caducados.

### Gestión de Ventas y Finanzas
*   **Órdenes de Carga y Transporte:** Planificación de la mercadería que sale del depósito y las rutas de autoventa. Cada carga se asocia a un vehículo, un chofer y una ruta, brindando una visión clara de la operación logística.
*   **Registro de Ventas en Ruta:** Tus vendedores registran cada transacción con los clientes, detallando los productos, cantidades y precios. Permite especificar diferentes métodos de pago, incluyendo el crédito, con un registro de la fecha de vencimiento.
*   **Gestión de Cuentas por Cobrar:** Un sistema robusto para el seguimiento de pagos pendientes y parciales. Los PAGOS\_RECIBIDOS se registran y actualizan automáticamente el estado de cobro de las ventas, facilitando la gestión financiera de la empresa.
*   **Facturación:** Emisión de facturas y boletas, con registro de su estado.

### Integraciones y Funcionalidades Estratégicas (Fases Futuras)
*   **Integración con SII (Servicio de Impuestos Internos de Chile):** En la fase final, el sistema se conectará directamente con el SII para el envío automatizado de documentos tributarios. Esto simplifica enormemente las obligaciones fiscales y garantiza el cumplimiento normativo.
*   **Optimización Inteligente de Rutas:** El sistema utilizará algoritmos avanzados y datos de geolocalización para sugerir rutas más eficientes, minimizando costos de combustible y tiempos de entrega.
*   **Análisis Predictivo de Demanda:** Se emplearán modelos de análisis para predecir las necesidades de compra, permitiendo a SMG optimizar el reabastecimiento y evitar quiebres de stock.
*   **CRM y Portal de Clientes:** Herramientas para una gestión de clientes más profunda y un portal para que los clientes puedan hacer sus pedidos directamente, mejorando su experiencia y reduciendo la carga administrativa de Sebastián.
*   **Sistema de Rendimiento:** Un módulo de evaluación automática del desempeño de empleados que fomenta la motivación y proporciona datos objetivos para la toma de decisiones.

## 🚀 Estrategia de Despliegue

La implementación del sistema de SMG se llevará a cabo en 3 fases, con una transición controlada y progresiva para asegurar el éxito del proyecto.

1.  **Fase 1: Cimientos y Control Básico:** Nos enfocamos en la digitalización de los procesos más críticos y la creación de la base de datos central. El objetivo es que Sebastián y su equipo se familiaricen con la plataforma y construyan confianza en su capacidad para gestionar el inventario, las compras y las ventas de forma precisa.
2.  **Fase 2: Optimización y Expansión:** Una vez que los cimientos estén sólidos, añadiremos funcionalidades que generen valor directo: gestión de pedidos de clientes, CRM básico y la primera versión de la optimización de rutas. Esta fase busca aumentar la eficiencia y comenzar a convertir los datos en inteligencia de negocio.
3.  **Fase 3: Estrategia y Crecimiento:** La fase final se centra en la ventaja competitiva. Aquí se implementarán las funcionalidades avanzadas como la integración con el SII, la optimización de rutas avanzada, la predicción de demanda, el portal de clientes y el sistema de incentivos.

## 🛠️ Tecnologías Utilizadas

Para garantizar un sistema robusto, escalable y mantenible, utilizaremos las siguientes tecnologías:
*   **Base de Datos:** PostgreSQL, base de datos relacional robusta y de código abierto.
*   **Backend:** Node.js (Express.js), ideal para el desarrollo ágil de APIs y la integración con servicios de terceros.
*   **Frontend:** React para la aplicación web y React Native para la aplicación móvil, permitiendo una experiencia de usuario fluida y un desarrollo multiplataforma eficiente.
*   **Infraestructura:** Infraestructura virtualizada (Hyper-V) con potencial para migración a servicios en la nube (GCP/AWS).
*   **Herramientas de Colaboración:** GitLab para el control de versiones, la automatización del ciclo de desarrollo (CI/CD) y la gestión de proyectos de forma integrada.

## 📚 Documentación

La documentación del proyecto ha sido reorganizada para facilitar su acceso y mantenimiento.

### 🏛️ Concilio de Tecnologías
*   [**Roles y Responsabilidades**](./CONCILIO_TECNOLOGIAS.md): Definición de los roles agentes que gestionan este repositorio.

### 📋 Reportes de Estado
*   [QA Correctivo (Enero 2026)](./docs/reports/qa/QA_CORRECTIVE_REPORT.md): Estado actual de bugs y correcciones críticas.
*   [Hitos del Proyecto](./docs/reports/milestones/): Resúmenes de hitos completados.

### 🛠️ Documentación Técnica
*   [**Contratos de Datos**](./docs/DATA_CONTRACTS.md): Estándar obligatorio para la comunicación Frontend-Backend.
*   [Base de Datos](./docs/technical/BASE_DE_DATOS.md): Documentación técnica del esquema SQL.
*   [Integración Frontend-Backend](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md): Guía de desarrollo.
*   [Componentes UI](./docs/technical/SHADCN_INTEGRATION.md): Guía de uso de Shadcn/UI.

### 📅 Planificación y Estrategia
*   [Estrategia de Implementación](./docs/planning/ESTRATEGIA_IMPLEMENTACION.md): Plan de fases del proyecto.
*   [Visión General](./docs/general/VISION_GENERAL.md): Descripción de alto nivel del sistema.
*   [Propósito y Beneficios](./docs/general/PROPOSITO_BENEFICIOS.md): Valor estratégico para SMG.

### 📜 Historial
*   [Changelog](./Changelog.md): Historial de versiones del sistema.
