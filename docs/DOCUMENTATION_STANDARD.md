# 📚 ESTÁNDAR DE DOCUMENTACIÓN TÉCNICA - SMG

**Versión**: 1.0  
**Fecha**: 2026-01-31  
**Estado**: NORMATIVO OBLIGATORIO  
**Autoridad**: Concilio de Roles Tecnológicos

---

## 1. PRINCIPIO FUNDAMENTAL

> **"La documentación es código. El código sin documentación no existe."**

**Reglas de Oro**:
1. ✅ **TODO** cambio significativo debe documentarse
2. ✅ La documentación debe actualizarse **ANTES** del deploy
3. ✅ La documentación debe ser **accionable**, no descriptiva
4. ❌ **PROHIBIDO** documentar "después" o "cuando haya tiempo"

---

## 2. QUÉ SE DOCUMENTA

### 2.1 Documentación Obligatoria

| Qué | Dónde | Cuándo | Responsable |
|-----|-------|--------|-------------|
| **Contratos de Endpoints** | `docs/DATA_CONTRACTS.md` | Al crear/modificar endpoint | Backend Dev |
| **Decisiones de Arquitectura** | `docs/ARCHITECTURE_DECISIONS.md` | Al tomar decisión técnica | Tech Lead |
| **Procedimientos de Desarrollo** | `docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md` | Al establecer flujo | Concilio |
| **Schema de Base de Datos** | `database/01_smg_schema.sql` | Al modificar tablas | DB Admin |
| **Casos de Uso** | `docs/USE_CASES.md` | Al implementar funcionalidad | Product Owner |
| **Reportes QA** | `QA_REPORT_*.md` | Al finalizar validación | QA |
| **Lecciones Aprendidas** | `docs/LESSONS_LEARNED.md` | Al resolver incidente | Quien resuelve |

### 2.2 Documentación Recomendada

| Qué | Dónde | Cuándo |
|-----|-------|--------|
| **README de Módulos** | `[module]/README.md` | Al crear módulo complejo |
| **Guías de Configuración** | `docs/SETUP_GUIDE.md` | Al agregar dependencia |
| **Scripts de Utilidad** | Comentarios en script | Al crear script |
| **Componentes Complejos** | JSDoc en componente | Al crear componente reutilizable |

---

## 3. DÓNDE SE DOCUMENTA

### 3.1 Estructura de Carpetas

```
SMG-Sistemadegestion/
├── docs/                                    # Documentación general
│   ├── DATA_CONTRACTS.md                   # ✅ OBLIGATORIO
│   ├── FRONTEND_BACKEND_INTEGRATION_GUIDE.md  # ✅ OBLIGATORIO
│   ├── DOCUMENTATION_STANDARD.md           # ✅ OBLIGATORIO (este archivo)
│   ├── ARCHITECTURE_DECISIONS.md           # ✅ OBLIGATORIO
│   ├── LESSONS_LEARNED.md                  # ✅ OBLIGATORIO
│   ├── USE_CASES.md                        # Recomendado
│   └── SETUP_GUIDE.md                      # Recomendado
├── database/
│   ├── 01_smg_schema.sql                   # ✅ OBLIGATORIO
│   └── 02_seed_data.sql                    # Recomendado
├── QA_REPORT_*.md                          # ✅ OBLIGATORIO (por fase)
├── README.md                               # ✅ OBLIGATORIO
└── CHANGELOG.md                            # Recomendado
```

### 3.2 Reglas de Ubicación

1. **Documentación de Contratos**: Siempre en `docs/DATA_CONTRACTS.md`
2. **Documentación de Procedimientos**: Siempre en `docs/`
3. **Documentación de Código**: Comentarios inline o JSDoc
4. **Documentación de QA**: Raíz del proyecto (`QA_REPORT_*.md`)

---

## 4. EN QUÉ FORMATO

### 4.1 Markdown

**Formato Oficial**: Todos los documentos deben usar Markdown (`.md`)

**Razones**:
- ✅ Legible en texto plano
- ✅ Renderizable en GitHub/GitLab
- ✅ Versionable con Git
- ✅ Fácil de buscar

### 4.2 Estructura de Documento

**Template Obligatorio**:

```markdown
# [TÍTULO DEL DOCUMENTO]

**Versión**: X.Y  
**Fecha**: YYYY-MM-DD  
**Estado**: [BORRADOR | NORMATIVO OBLIGATORIO | DEPRECADO]  
**Autoridad**: [Quién aprueba]

---

## 1. PROPÓSITO

[Explicar por qué existe este documento]

---

## 2. ALCANCE

[Qué cubre y qué no cubre]

---

## 3. CONTENIDO PRINCIPAL

[Secciones específicas del documento]

---

## 4. REFERENCIAS

[Links a otros documentos relacionados]

---

**Última Actualización**: YYYY-MM-DD  
**Próxima Revisión**: [Fecha o evento]  
**Responsable**: [Rol o persona]
```

### 4.3 Convenciones de Escritura

**Títulos**:
- `# Título Nivel 1` - Solo para el título principal
- `## Título Nivel 2` - Secciones principales
- `### Título Nivel 3` - Subsecciones
- `#### Título Nivel 4` - Detalles

**Énfasis**:
- `**Negrita**` - Para términos importantes
- `*Cursiva*` - Para énfasis suave
- `` `código` `` - Para nombres de archivos, variables, comandos

**Listas**:
- `- Item` - Listas desordenadas
- `1. Item` - Listas ordenadas
- `- [ ] Tarea` - Checklists

**Código**:
````markdown
```javascript
// Bloque de código con syntax highlighting
const example = "value";
```
````

**Tablas**:
```markdown
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Valor 1   | Valor 2   | Valor 3   |
```

**Alertas**:
- `> **Nota**: Información adicional`
- `⚠️ **Advertencia**: Cuidado con esto`
- `🔴 **Crítico**: Muy importante`
- `✅ **Correcto**: Ejemplo bueno`
- `❌ **Incorrecto**: Ejemplo malo`

---

## 5. CON QUÉ NIVEL DE DETALLE

### 5.1 Principio de Suficiencia

**Regla**: Documentar lo suficiente para que alguien nuevo pueda:
1. Entender **qué** hace
2. Entender **por qué** se hace así
3. Saber **cómo** usarlo/modificarlo
4. Identificar **qué puede salir mal**

### 5.2 Niveles de Detalle por Tipo

#### Contratos de Datos (DATA_CONTRACTS.md)

**Nivel**: EXHAUSTIVO

**Debe incluir**:
- ✅ Ruta exacta del endpoint
- ✅ Método HTTP
- ✅ Estructura de request (si aplica)
- ✅ Estructura de response (con ejemplo real)
- ✅ Tabla de campos con tipos y nullable
- ✅ Notas especiales (campos deprecados, breaking changes, etc.)

**Ejemplo**:
```markdown
#### **GET /api/clients**

**Descripción**: Obtiene todos los clientes registrados

**Request**: Ninguno

**Response**: `200 OK`
```json
[
  {
    "id_cliente": 1,
    "razon_social": "ACME Corp",
    "rut_cliente": "12345678-9"
  }
]
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_cliente` | integer | NO | ID único del cliente |
| `razon_social` | string | NO | Razón social |
| `rut_cliente` | string | NO | RUT sin formato |

**Notas**:
- ⚠️ NO existe campo `nombre_cliente`
```

#### Procedimientos (INTEGRATION_GUIDE.md)

**Nivel**: DETALLADO

**Debe incluir**:
- ✅ Diagrama de flujo (si aplica)
- ✅ Pasos numerados
- ✅ Ejemplos de código
- ✅ Checklist de validación
- ✅ Errores comunes y soluciones

#### Decisiones de Arquitectura

**Nivel**: JUSTIFICADO

**Debe incluir**:
- ✅ Contexto (por qué se tomó la decisión)
- ✅ Opciones consideradas
- ✅ Decisión tomada
- ✅ Consecuencias (pros y cons)
- ✅ Fecha y responsable

**Template**:
```markdown
## Decisión: [Título]

**Fecha**: YYYY-MM-DD  
**Responsable**: [Nombre/Rol]  
**Estado**: [Propuesta | Aprobada | Deprecada]

### Contexto

[Por qué necesitamos tomar esta decisión]

### Opciones Consideradas

1. **Opción A**: [Descripción]
   - Pros: [...]
   - Cons: [...]

2. **Opción B**: [Descripción]
   - Pros: [...]
   - Cons: [...]

### Decisión

[Qué se decidió y por qué]

### Consecuencias

**Positivas**:
- [...]

**Negativas**:
- [...]

**Mitigaciones**:
- [...]
```

#### Lecciones Aprendidas

**Nivel**: EDUCATIVO

**Debe incluir**:
- ✅ Qué salió mal
- ✅ Por qué salió mal
- ✅ Cómo se resolvió
- ✅ Qué se aprendió
- ✅ Cómo prevenir en el futuro

**Template**:
```markdown
## Lección: [Título]

**Fecha**: YYYY-MM-DD  
**Severidad**: [Baja | Media | Alta | Crítica]  
**Módulo Afectado**: [Nombre]

### Problema

[Descripción del problema]

### Causa Raíz

[Por qué ocurrió]

### Solución Aplicada

[Cómo se resolvió]

### Lección Aprendida

[Qué aprendimos]

### Prevención

[Qué cambios se hicieron para prevenir recurrencia]

### Referencias

- [Link a commit]
- [Link a issue]
- [Link a PR]
```

---

## 6. CUÁNDO SE ACTUALIZA

### 6.1 Eventos que Requieren Actualización

| Evento | Documentos a Actualizar | Plazo |
|--------|-------------------------|-------|
| **Crear endpoint** | `DATA_CONTRACTS.md` | Antes de merge |
| **Modificar endpoint** | `DATA_CONTRACTS.md` | Antes de merge |
| **Cambiar schema DB** | `01_smg_schema.sql`, `DATA_CONTRACTS.md` | Antes de deploy |
| **Resolver incidente** | `LESSONS_LEARNED.md` | Dentro de 24h |
| **Tomar decisión técnica** | `ARCHITECTURE_DECISIONS.md` | Antes de implementar |
| **Completar hito** | `QA_REPORT_*.md`, `CHANGELOG.md` | Al finalizar hito |
| **Deprecar funcionalidad** | Documento relevante | Inmediatamente |

### 6.2 Ciclo de Revisión

**Documentos Normativos**:
- Revisión: **Trimestral**
- Responsable: Tech Lead
- Acción: Validar vigencia, actualizar si es necesario

**Contratos de Datos**:
- Revisión: **Por demanda** (cada vez que se modifica un endpoint)
- Responsable: Backend Developer
- Acción: Actualizar inmediatamente

**Lecciones Aprendidas**:
- Revisión: **Mensual**
- Responsable: Concilio
- Acción: Identificar patrones, actualizar procedimientos

---

## 7. RESPONSABILIDADES

### 7.1 Por Rol

| Rol | Responsabilidades de Documentación |
|-----|-----------------------------------|
| **Backend Developer** | Documentar contratos de endpoints, actualizar schema SQL |
| **Frontend Developer** | Documentar componentes complejos, reportar inconsistencias |
| **Tech Lead** | Aprobar documentación, mantener estándares, revisar periódicamente |
| **QA** | Generar reportes QA, documentar casos de prueba |
| **DB Admin** | Mantener schema actualizado, documentar migraciones |
| **Product Owner** | Documentar casos de uso, validar que documentación refleje requisitos |

### 7.2 Proceso de Aprobación

**Documentos Normativos** (como este):
1. Borrador creado por responsable
2. Revisión por Tech Lead
3. Revisión por Concilio
4. Aprobación final
5. Cambio de estado a "NORMATIVO OBLIGATORIO"

**Contratos de Datos**:
1. Backend Developer documenta
2. Tech Lead revisa
3. Frontend Developer valida
4. Aprobado

**Lecciones Aprendidas**:
1. Quien resuelve documenta
2. Tech Lead revisa
3. Publicado

---

## 8. CASO DE ESTUDIO: RC-01 y RC-02

### 8.1 Análisis de Falta de Documentación

**Problema Original**:
- ❌ No existía `DATA_CONTRACTS.md`
- ❌ No había procedimiento de integración documentado
- ❌ No había estándar de documentación

**Consecuencias**:
- Frontend asumió estructura de datos incorrecta (RC-01)
- Frontend usó capitalización incorrecta (RC-02)
- Fallas solo detectadas en QA visual
- Tiempo perdido en correcciones reactivas

### 8.2 Solución Aplicada

**Documentación Creada**:
1. ✅ `docs/DATA_CONTRACTS.md` - Contratos de todos los endpoints
2. ✅ `docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md` - Procedimiento de integración
3. ✅ `docs/DOCUMENTATION_STANDARD.md` - Este documento
4. ✅ `docs/LESSONS_LEARNED.md` - Lecciones de RC-01 y RC-02

**Resultado**:
- ✅ Futuros desarrollos tienen contratos claros
- ✅ Procedimiento previene errores de mapeo
- ✅ Estándar garantiza consistencia
- ✅ Lecciones previenen recurrencia

### 8.3 Lección Aprendida

> **"La ausencia de documentación no es neutral, es deuda técnica activa."**

**Antes**:
- Conocimiento tácito
- Errores por asunciones
- Correcciones reactivas

**Después**:
- Conocimiento explícito
- Validación por diseño
- Prevención proactiva

---

## 9. HERRAMIENTAS Y RECURSOS

### 9.1 Editores Recomendados

- **VS Code** con extensiones:
  - Markdown All in One
  - Markdown Preview Enhanced
  - markdownlint

### 9.2 Validadores

- **markdownlint** - Validar sintaxis Markdown
- **Prettier** - Formatear Markdown automáticamente

### 9.3 Templates

**Ubicación**: `docs/templates/`

Crear templates para:
- Contrato de endpoint
- Decisión de arquitectura
- Lección aprendida
- Reporte QA

---

## 10. CHECKLIST DE DOCUMENTACIÓN

**Antes de crear un PR**:
- [ ] Código implementado
- [ ] Documentación actualizada
- [ ] Contratos documentados (si aplica)
- [ ] Lecciones documentadas (si aplica)
- [ ] README actualizado (si aplica)
- [ ] CHANGELOG actualizado (si aplica)

**Antes de aprobar un PR**:
- [ ] Código revisado
- [ ] Documentación revisada
- [ ] Documentación es clara y accionable
- [ ] No hay inconsistencias entre código y documentación

**Antes de deploy**:
- [ ] Toda la documentación está actualizada
- [ ] Breaking changes documentados
- [ ] Migraciones documentadas (si aplica)

---

## 11. MÉTRICAS DE CALIDAD

### 11.1 Indicadores

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Cobertura de Endpoints** | 100% | Endpoints documentados / Total endpoints |
| **Actualidad** | < 7 días | Días desde último cambio sin actualizar doc |
| **Completitud** | 100% | Secciones obligatorias completadas |
| **Claridad** | > 90% | Feedback positivo de usuarios |

### 11.2 Auditoría

**Frecuencia**: Mensual

**Responsable**: Tech Lead

**Checklist**:
- [ ] Todos los endpoints tienen contrato documentado
- [ ] Contratos coinciden con realidad
- [ ] Documentos normativos están vigentes
- [ ] No hay documentación obsoleta
- [ ] Lecciones aprendidas están actualizadas

---

## 12. EVOLUCIÓN DE ESTE ESTÁNDAR

### 12.1 Versionado

**Formato**: `MAJOR.MINOR`

- **MAJOR**: Cambios significativos en estructura o proceso
- **MINOR**: Mejoras, aclaraciones, correcciones

**Versión Actual**: 1.0

### 12.2 Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-01-31 | Versión inicial - Respuesta a RC-01 y RC-02 |

### 12.3 Propuestas de Mejora

**Proceso**:
1. Identificar mejora necesaria
2. Crear issue con propuesta
3. Discutir en Concilio
4. Aprobar cambio
5. Actualizar documento
6. Incrementar versión
7. Notificar al equipo

---

## 13. PREGUNTAS FRECUENTES

### Q1: ¿Qué hago si no tengo tiempo para documentar?

**R**: Documentar **NO ES OPCIONAL**. Si no hay tiempo, el feature no está completo. Ajustar el alcance o el timeline.

### Q2: ¿Puedo documentar "después"?

**R**: No. La documentación debe estar lista **antes** del merge/deploy.

### Q3: ¿Qué hago si encuentro documentación obsoleta?

**R**: Crear un issue y asignarlo al responsable del módulo. Actualizar inmediatamente si es crítico.

### Q4: ¿Cómo sé si mi documentación es suficiente?

**R**: Pregúntate: "¿Podría alguien nuevo usar esto sin preguntarme?" Si la respuesta es no, falta detalle.

### Q5: ¿Qué hago si el contrato no coincide con la realidad?

**R**: **DETENER** el desarrollo. Reportar la inconsistencia. Actualizar el contrato o corregir el código.

---

## 14. FILOSOFÍA DE LA DOCUMENTACIÓN

> **"Documentar es diseñar. Diseñar es documentar."**

**Principios**:
1. **Claridad sobre Brevedad**: Mejor explicar de más que de menos
2. **Acción sobre Descripción**: Documentar **cómo hacer**, no solo **qué es**
3. **Prevención sobre Corrección**: Documentar para prevenir errores
4. **Evolución sobre Perfección**: Documentar iterativamente, mejorar continuamente

**Resultado Esperado**:
- ✅ Onboarding rápido de nuevos miembros
- ✅ Reducción de errores por asunciones
- ✅ Conocimiento distribuido, no centralizado
- ✅ Sistema mantenible y escalable

---

**Documento Normativo**  
**Versión**: 1.0  
**Última Actualización**: 2026-01-31  
**Próxima Revisión**: 2026-04-30 (Trimestral)  
**Responsable**: Tech Lead  
**Autoridad**: Concilio de Roles Tecnológicos

---

## ANEXO A: TEMPLATES

### Template: Contrato de Endpoint

```markdown
#### **[METHOD] /api/[resource]**

**Descripción**: [Descripción clara de qué hace]

**Request**: [Body si aplica, o "Ninguno"]
```json
{
  "campo_1": "valor",
  "campo_2": 123
}
```

**Response**: `[STATUS CODE]`
```json
{
  "campo_respuesta_1": "valor",
  "campo_respuesta_2": 123
}
```

**Campos**:
| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `campo_1` | string | NO | Descripción |
| `campo_2` | integer | SÍ | Descripción |

**Notas**:
- ⚠️ [Notas especiales, advertencias, breaking changes]
```

### Template: Lección Aprendida

```markdown
## Lección: [Título Descriptivo]

**Fecha**: YYYY-MM-DD  
**Severidad**: [Baja | Media | Alta | Crítica]  
**Módulo**: [Nombre del módulo]  
**Responsable**: [Quien resolvió]

### Problema

[Descripción clara del problema que ocurrió]

### Causa Raíz

[Análisis de por qué ocurrió]

### Impacto

[Qué afectó y qué hubiera pasado si no se detectaba]

### Solución Aplicada

[Cómo se resolvió]

### Lección Aprendida

[Qué aprendimos de esto]

### Prevención

[Qué cambios se hicieron para prevenir recurrencia]

### Referencias

- Commit: [hash]
- Issue: [#número]
- PR: [#número]
- Documentos actualizados: [lista]
```

---

**FIN DEL DOCUMENTO**
