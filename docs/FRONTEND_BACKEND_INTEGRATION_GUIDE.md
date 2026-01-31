# 🔗 GUÍA DE INTEGRACIÓN FRONTEND-BACKEND

**Versión**: 1.0  
**Fecha**: 2026-01-31  
**Estado**: NORMATIVO OBLIGATORIO  
**Autoridad**: Concilio de Roles Tecnológicos

---

## 1. PROPÓSITO

Esta guía establece el procedimiento obligatorio para integrar componentes frontend con endpoints backend en el sistema SMG, garantizando:

- ✅ Consistencia de datos
- ✅ Prevención de errores de mapeo
- ✅ Mantenibilidad del código
- ✅ Escalabilidad del sistema

---

## 2. FLUJO DE DESARROLLO SEGURO

### 2.1 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────┐
│         FLUJO DE DESARROLLO FRONTEND-BACKEND            │
└─────────────────────────────────────────────────────────┘

1. BACKEND: Crear/Modificar Endpoint
   ├─ Implementar controller
   ├─ Implementar route
   ├─ Probar con curl/Postman
   └─ Documentar contrato en DATA_CONTRACTS.md
         │
         ↓
2. VALIDACIÓN: Verificar Contrato
   ├─ Ejecutar endpoint
   ├─ Capturar respuesta real
   ├─ Comparar con documentación
   └─ Aprobar contrato
         │
         ↓
3. FRONTEND: Consultar Contrato
   ├─ Leer DATA_CONTRACTS.md
   ├─ Identificar campos exactos
   ├─ Identificar campos nullable
   └─ Planificar componente
         │
         ↓
4. FRONTEND: Implementar Consumo
   ├─ Crear servicio/API call
   ├─ Mapear datos (si necesario)
   ├─ Implementar componente
   └─ Usar nombres exactos del contrato
         │
         ↓
5. QA VISUAL: Validar en Navegador
   ├─ Ejecutar aplicación
   ├─ Navegar al componente
   ├─ Verificar datos visibles
   └─ Validar funcionalidad completa
         │
         ↓
6. APROBACIÓN: Cerrar Ciclo
   ├─ QA aprueba
   ├─ Commit con referencia al contrato
   └─ Deploy
```

### 2.2 Reglas de Bloqueo

**NINGÚN componente frontend puede avanzar sin completar TODOS los pasos anteriores.**

---

## 3. PROCEDIMIENTO DETALLADO

### 3.1 PASO 1: Backend - Crear/Modificar Endpoint

#### 3.1.1 Implementar Controller

**Reglas**:
- ✅ Devolver datos **sin transformación** desde la base de datos
- ❌ NO cambiar nombres de campos
- ✅ Manejar errores apropiadamente
- ✅ Usar transacciones cuando sea necesario

**Ejemplo**:
```javascript
// backend/src/controllers/clientController.js
const getAllClients = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM CLIENTES');
        res.json(result.rows); // ✅ Sin transformación
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
```

#### 3.1.2 Implementar Route

**Reglas**:
- ✅ Usar nombres de ruta descriptivos
- ✅ Seguir convenciones REST
- ✅ Registrar en `routes/index.js`

**Ejemplo**:
```javascript
// backend/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
```

#### 3.1.3 Probar con curl/Postman

**Obligatorio**: Ejecutar el endpoint y capturar la respuesta real.

```bash
# Ejemplo: Probar GET /api/clients
curl http://localhost:3000/api/clients | ConvertFrom-Json | Select-Object -First 1
```

**Capturar**:
```json
{
  "id_cliente": 1,
  "razon_social": "EVELYN ANDREA INOSTROZA ACEITUNO",
  "rut_cliente": "152847297",
  "ciclo_reabastecimiento_dias": 7,
  "limite_credito_autorizado": "0.00",
  "segmento_cliente": null
}
```

#### 3.1.4 Documentar Contrato

**Obligatorio**: Agregar el contrato a `docs/DATA_CONTRACTS.md`

**Template**:
```markdown
#### **GET /api/[resource]**

**Descripción**: [Descripción clara]

**Request**: [Body si aplica]

**Response**: `200 OK`
```json
[Respuesta real capturada]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `campo_1` | tipo | SÍ/NO | Descripción |
```

---

### 3.2 PASO 2: Validación - Verificar Contrato

**Responsable**: Tech Lead o Backend Developer

**Checklist**:
1. [ ] Endpoint ejecutado exitosamente
2. [ ] Respuesta capturada
3. [ ] Documentación coincide con respuesta real
4. [ ] Campos nullable identificados
5. [ ] Tipos de datos correctos

**Criterio de Aprobación**:
- ✅ Documentación es exacta
- ✅ No hay ambigüedades
- ✅ Campos opcionales claramente marcados

---

### 3.3 PASO 3: Frontend - Consultar Contrato

**Responsable**: Frontend Developer

**Checklist Obligatorio**:
1. [ ] Leer `docs/DATA_CONTRACTS.md`
2. [ ] Identificar el endpoint a consumir
3. [ ] Copiar la estructura de respuesta
4. [ ] Identificar campos nullable
5. [ ] Planificar validación defensiva

**Ejemplo de Planificación**:
```javascript
// Contrato consultado: GET /api/clients
// Campos identificados:
// - id_cliente (integer, NO nullable)
// - razon_social (string, NO nullable)
// - rut_cliente (string, NO nullable)
// - ciclo_reabastecimiento_dias (integer, SÍ nullable)
// - limite_credito_autorizado (decimal, SÍ nullable)
// - segmento_cliente (string, SÍ nullable)

// Planificación:
// - Usar razon_social para nombre
// - Mostrar ciclo con fallback a '-'
// - Formatear limite_credito como moneda
```

---

### 3.4 PASO 4: Frontend - Implementar Consumo

#### 3.4.1 Crear API Call

**Ubicación**: `frontend/src/api/` o dentro del componente

**Reglas**:
- ✅ Usar axios configurado (`api/axios.js`)
- ✅ Manejar errores apropiadamente
- ✅ No transformar datos en la llamada

**Ejemplo**:
```javascript
// frontend/src/pages/Clients.jsx
const fetchClients = async () => {
    try {
        const response = await api.get('/clients');
        setClients(response.data); // ✅ Sin transformación
    } catch (error) {
        console.error('Error fetching clients:', error);
    } finally {
        setLoading(false);
    }
};
```

#### 3.4.2 Mapeo de Datos (Solo si es Necesario)

**Cuándo Mapear**:
- ✅ Cuando el componente necesita una estructura interna diferente
- ✅ Cuando se combinan datos de múltiples endpoints
- ✅ Cuando se necesita computar campos derivados

**Dónde Mapear**:
- ✅ En un servicio dedicado (`services/clientService.js`)
- ✅ En un hook personalizado (`hooks/useClients.js`)
- ❌ **NO** directamente en el componente de UI

**Cuándo NO Mapear**:
- ❌ Solo para cambiar capitalización
- ❌ Para "embellecer" nombres de campos
- ❌ Por preferencia personal

**Ejemplo de Mapeo Justificado**:
```javascript
// services/clientService.js
export const enrichClientData = (client) => ({
    ...client,
    // Computar campo derivado
    credit_status: client.limite_credito_autorizado > 0 ? 'Activo' : 'Sin crédito',
    // Formatear para display
    formatted_credit: `$${parseFloat(client.limite_credito_autorizado).toLocaleString('es-CL')}`
});
```

#### 3.4.3 Implementar Componente

**Reglas**:
- ✅ Usar nombres de campos **exactos** del contrato
- ✅ Validación defensiva para campos nullable
- ✅ Fallbacks apropiados para valores null
- ✅ Formateo de datos para display

**Ejemplo Correcto**:
```javascript
<TableBody>
    {clients.map((client) => (
        <TableRow key={client.id_cliente}>
            <TableCell>{client.razon_social}</TableCell>
            <TableCell>{client.rut_cliente}</TableCell>
            <TableCell>{client.ciclo_reabastecimiento_dias || '-'}</TableCell>
            <TableCell>
                ${parseFloat(client.limite_credito_autorizado || 0).toLocaleString('es-CL')}
            </TableCell>
            <TableCell>{client.segmento_cliente || '-'}</TableCell>
        </TableRow>
    ))}
</TableBody>
```

**Ejemplo Incorrecto**:
```javascript
// ❌ INCORRECTO - Campos no existen en contrato
<TableBody>
    {clients.map((client) => (
        <TableRow key={client.ID_Cliente}>  {/* ❌ Case incorrecto */}
            <TableCell>{client.nombre_cliente}</TableCell>  {/* ❌ Campo no existe */}
            <TableCell>{client.telefono_cliente}</TableCell>  {/* ❌ Campo no existe */}
        </TableRow>
    ))}
</TableBody>
```

---

### 3.5 PASO 5: QA Visual - Validar en Navegador

**Responsable**: QA Visual o Developer

**Checklist Obligatorio**:
1. [ ] Aplicación ejecutándose localmente
2. [ ] Navegación al componente exitosa
3. [ ] Datos visibles en pantalla
4. [ ] Datos correctos (coinciden con BD)
5. [ ] Campos nullable muestran fallback apropiado
6. [ ] No hay errores en consola
7. [ ] Funcionalidad CRUD completa (si aplica)

**Evidencia Requerida**:
- Captura de pantalla del componente funcionando
- Confirmación de que datos son legibles
- Confirmación de que no hay errores

---

### 3.6 PASO 6: Aprobación - Cerrar Ciclo

**Responsable**: Tech Lead o QA Senior

**Checklist Final**:
1. [ ] QA visual aprobado
2. [ ] Código revisado
3. [ ] Contrato documentado
4. [ ] Tests pasando (si existen)
5. [ ] Commit con mensaje descriptivo

**Formato de Commit**:
```
feat(clients): implement client list view

- Consumes GET /api/clients endpoint
- Displays: razon_social, rut_cliente, ciclo, limite_credito, segmento
- Implements CRUD operations
- Contract: docs/DATA_CONTRACTS.md#get-apiclients

Refs: #HITO-1
```

---

## 4. PATRONES DE INTEGRACIÓN

### 4.1 Patrón: Listado Simple

**Caso de Uso**: Mostrar una tabla de registros

**Implementación**:
```javascript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    fetchItems();
}, []);

const fetchItems = async () => {
    try {
        const response = await api.get('/endpoint');
        setItems(response.data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
};

return (
    <Table>
        <TableBody>
            {items.map(item => (
                <TableRow key={item.id_campo}>
                    <TableCell>{item.campo_1}</TableCell>
                    <TableCell>{item.campo_2 || '-'}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
```

### 4.2 Patrón: Formulario de Creación

**Caso de Uso**: Crear un nuevo registro

**Implementación**:
```javascript
const [formData, setFormData] = useState({
    campo_1: '',
    campo_2: '',
    campo_3: 0
});

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Mapear a formato esperado por backend (si necesario)
        const requestData = {
            Campo_1: formData.campo_1,  // Backend espera PascalCase
            Campo_2: formData.campo_2,
            Campo_3: parseInt(formData.campo_3)
        };
        
        await api.post('/endpoint', requestData);
        fetchItems(); // Refrescar lista
        resetForm();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
};
```

### 4.3 Patrón: Detalle con Relaciones

**Caso de Uso**: Mostrar un registro con datos relacionados

**Implementación**:
```javascript
const [order, setOrder] = useState(null);

const fetchOrderDetails = async (id) => {
    try {
        const response = await api.get(`/purchase-orders/${id}`);
        setOrder(response.data);
        // response.data incluye:
        // - Datos de la orden
        // - items[] con detalles
    } catch (error) {
        console.error('Error:', error);
    }
};

return (
    <div>
        <h2>Orden #{order.id_orden}</h2>
        <p>Proveedor: {getSupplierName(order.id_proveedor)}</p>
        <Table>
            <TableBody>
                {order.items.map(item => (
                    <TableRow key={item.id_detalle_orden}>
                        <TableCell>{getProductName(item.id_producto_servicio)}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>${item.precio_unitario_acordado}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);
```

### 4.4 Patrón: Búsqueda y Filtrado

**Caso de Uso**: Filtrar registros localmente

**Implementación**:
```javascript
const [searchTerm, setSearchTerm] = useState('');

const filteredItems = items.filter(item =>
    (item.campo_texto && item.campo_texto.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.campo_codigo && item.campo_codigo.toLowerCase().includes(searchTerm.toLowerCase()))
);

return (
    <>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
        />
        <Table>
            <TableBody>
                {filteredItems.map(item => (
                    <TableRow key={item.id_campo}>
                        <TableCell>{item.campo_texto}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
);
```

---

## 5. MANEJO DE ERRORES

### 5.1 Errores de Backend

**Tipos Comunes**:
- `500 Internal Server Error` - Error del servidor
- `404 Not Found` - Recurso no encontrado
- `400 Bad Request` - Datos inválidos
- `23505 Unique Violation` - Duplicado (ej: RUT)
- `23503 Foreign Key Violation` - Referencia inválida

**Manejo en Frontend**:
```javascript
try {
    await api.post('/clients', formData);
} catch (error) {
    console.error('Error:', error);
    
    if (error.response) {
        // Error del servidor con respuesta
        if (error.response.status === 500) {
            const detail = error.response.data.details;
            if (detail && detail.includes('23505')) {
                alert('El RUT ya está registrado');
            } else if (detail && detail.includes('23503')) {
                alert('Referencia inválida');
            } else {
                alert('Error del servidor');
            }
        } else if (error.response.status === 404) {
            alert('Recurso no encontrado');
        }
    } else {
        // Error de red
        alert('Error de conexión');
    }
}
```

### 5.2 Validación Defensiva

**Regla**: Siempre validar antes de acceder a propiedades de objetos que pueden ser null.

**Ejemplo**:
```javascript
// ✅ CORRECTO - Validación defensiva
const filteredSuppliers = suppliers.filter(supplier =>
    (supplier.nombre_proveedor && supplier.nombre_proveedor.toLowerCase().includes(searchTerm)) ||
    (supplier.rut_proveedor && supplier.rut_proveedor.toLowerCase().includes(searchTerm))
);

// ❌ INCORRECTO - Sin validación
const filteredSuppliers = suppliers.filter(supplier =>
    supplier.nombre_proveedor.toLowerCase().includes(searchTerm)  // Crash si es null
);
```

---

## 6. CASO DE ESTUDIO: RC-01 y RC-02

### 6.1 Análisis de Fallas

#### RC-01: Clientes

**Paso Omitido**: PASO 3 - Consultar Contrato

**Consecuencia**:
- Frontend asumió campos que no existen
- Tabla mostraba solo guiones
- Funcionalidad inutilizable

**Lección**:
- **NUNCA asumir** la estructura de datos
- **SIEMPRE consultar** el contrato antes de implementar

#### RC-02: Proveedores

**Paso Omitido**: PASO 3 - Consultar Contrato + PASO 5 - QA Visual

**Consecuencia**:
- Frontend usó capitalización incorrecta
- Error `undefined.toLowerCase()` rompió la página
- Página completamente colapsada

**Lección**:
- **SIEMPRE probar** el endpoint antes de implementar
- **SIEMPRE validar** en navegador antes de aprobar

### 6.2 Aplicación del Flujo Correcto

**Si se hubiera seguido el flujo**:

1. **PASO 1**: Backend implementado ✅
2. **PASO 2**: Contrato documentado ✅ (ahora existe)
3. **PASO 3**: Frontend consulta contrato → Ve `razon_social`, no `nombre_cliente`
4. **PASO 4**: Frontend implementa con campos correctos
5. **PASO 5**: QA visual valida → Datos visibles ✅
6. **PASO 6**: Aprobado y desplegado

**Resultado**: ❌ FALLA PREVENIDA

---

## 7. HERRAMIENTAS Y RECURSOS

### 7.1 Herramientas de Desarrollo

**Backend**:
- `curl` - Probar endpoints desde terminal
- Postman - Cliente API con interfaz gráfica
- pgAdmin - Explorar base de datos

**Frontend**:
- React DevTools - Inspeccionar estado de componentes
- Browser DevTools - Consola y Network tab
- Axios DevTools - Monitorear requests

### 7.2 Scripts Útiles

**Probar todos los endpoints**:
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

### 7.3 Documentación de Referencia

- **Contratos de Datos**: `docs/DATA_CONTRACTS.md`
- **Schema de BD**: `database/01_smg_schema.sql`
- **Estándares de Documentación**: `docs/DOCUMENTATION_STANDARD.md`

---

## 8. PREGUNTAS FRECUENTES

### Q1: ¿Puedo usar PascalCase en el frontend?

**R**: No. Todos los campos deben usar `snake_case` en minúsculas, tal como vienen del backend.

### Q2: ¿Qué hago si el backend devuelve PascalCase?

**R**: Reportar al backend developer. El backend debe devolver `snake_case` (PostgreSQL lo hace automáticamente).

### Q3: ¿Puedo mapear datos en el componente?

**R**: No directamente. Usa un servicio o hook personalizado si necesitas mapear.

### Q4: ¿Cómo sé si un campo es nullable?

**R**: Consulta `docs/DATA_CONTRACTS.md`. Todos los campos nullable están marcados.

### Q5: ¿Qué hago si el contrato no está documentado?

**R**: **DETENER** el desarrollo. Solicitar al backend developer que documente el contrato primero.

---

## 9. CHECKLIST DE INTEGRACIÓN

**Antes de empezar a codear frontend**:
- [ ] Endpoint backend existe y funciona
- [ ] Contrato documentado en `DATA_CONTRACTS.md`
- [ ] Endpoint probado con curl/Postman
- [ ] Respuesta real capturada y analizada
- [ ] Campos nullable identificados

**Durante el desarrollo**:
- [ ] Usando nombres de campos exactos del contrato
- [ ] Validación defensiva para campos nullable
- [ ] Manejo de errores implementado
- [ ] No hay transformaciones innecesarias

**Antes de aprobar**:
- [ ] QA visual ejecutado en navegador
- [ ] Datos visibles y correctos
- [ ] No hay errores en consola
- [ ] Funcionalidad completa validada

---

**Documento Normativo**  
**Versión**: 1.0  
**Última Actualización**: 2026-01-31  
**Próxima Revisión**: Trimestral  
**Autoridad**: Concilio de Roles Tecnológicos
