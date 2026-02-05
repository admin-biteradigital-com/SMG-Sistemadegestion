# ARQ-09: Transformación UI/UX SIGLO NEON

**ID:** ARQ-09  
**Versión:** 1.0  
**Fecha:** 2025-02-05  
**Responsable:** AGENTE-01 (Dirección) / AGENTE-06 (Growth & UX)  
**Estado:** EN PROGRESO  

---

## 1. Contexto y Motivación

El frontend original de SIGLO, aunque funcional, presentaba limitaciones estéticas y de experiencia de usuario que no reflejaban la sofisticación técnica del backend. La orden del Arquitecto Soberano fue clara: **"Refabricar desde cero con enfoque moderno y responsive"**.

## 2. Identidad Visual: SIGLO NEON

### 2.1 Paleta de Colores

| Color | Uso | Código |
|-------|-----|--------|
| **Teal-Emerald Gradient** | Primario (CTAs, navegación activa) | `#14B8A6` → `#10B981` |
| **Violet** | Acentos premium (KPIs destacados) | `#8B5CF6` |
| **Orange** | Alertas y acciones urgentes | `#F97316` |
| **Stone-50/950** | Fondos (claro/oscuro) | `#FAFAF9` / `#0C0A09` |

### 2.2 Materialidad

- **Glassmorphism**: Paneles con `backdrop-blur-md` y bordes sutiles (`border-white/10`).
- **Sombras Profundas**: Uso de `shadow-teal` personalizado para elementos flotantes.
- **Bordes Redondeados**: Radio base aumentado a `1rem` para sensación más moderna.

## 3. Arquitectura Responsive

### Desktop (≥1024px)
```
┌─────────────┬──────────────────────────┐
│   Sidebar   │   Main Content           │
│  (Fija)     │   (Scrollable)           │
│             │                          │
│  - Logo     │   [Page Content]         │
│  - Nav      │                          │
│  - Settings │                          │
└─────────────┴──────────────────────────┘
```

### Mobile (<1024px)
```
┌──────────────────────────────────────┐
│   Top Bar (Hamburger + Logo)        │
├──────────────────────────────────────┤
│                                      │
│   Main Content (Full Width)         │
│                                      │
├──────────────────────────────────────┤
│   Bottom Nav (4 items principales)  │
└──────────────────────────────────────┘
```

## 4. Componentes Implementados

### 4.1 AppShell.jsx
**Ubicación:** `frontend/src/components/layout/AppShell.jsx`

**Características:**
- Sidebar colapsable con animación `framer-motion` (spring physics).
- Bottom Navigation Bar para móviles (alcance del pulgar).
- Transiciones de página suaves con `motion.div`.
- Overlay oscuro con blur para el menú móvil.

**Navegación Definida:**
```javascript
const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Ventas', href: '/sales', icon: ShoppingCart },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Cargas', href: '/load-orders', icon: TruckIcon },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
];
```

### 4.2 index.css (Design System)
**Nuevas Utilidades:**
- `.glass` / `.glass-dark`: Efectos de vidrio.
- `.gradient-teal-emerald`: Degradado principal.
- `.gradient-violet`: Para elementos premium.
- `.transition-smooth`: Transiciones con easing personalizado.

## 5. Próximos Pasos

1. **Dashboard Bento Grid**: Rediseñar `Sales.jsx` con layout de cuadrícula moderna.
2. **Micro-interacciones**: Añadir feedback visual con `sonner` (toasts).
3. **Modo Oscuro**: Implementar toggle y persistencia en `localStorage`.

## 6. Impacto en ALCOA+

- **Atribuible**: Todas las interacciones UI mantienen trazabilidad (sin cambios en backend).
- **Legible**: La nueva UI mejora la claridad visual de los datos sin alterarlos.
- **Contemporáneo**: Las animaciones no afectan el timestamp de las operaciones.

---

**Firmado Digitalmente:** AGENTE-01  
**Revisado por:** AGENTE-06 (Cronista Comercial)
