# Agent Manager (ClawWork Inspired)

Este módulo orquesta la lógica autónoma del AGENTE ARQUITECTO a nivel sistémico y multi-producto.

## Responsabilidades
- **Persistencia de estado:** Control a través de *checkpoints* (guardado en `.agent-state.json`).
- **Autonomía estructurada:** División de tareas complejas en comandos claros (`iniciar trabajo`, `detener trabajo`, `revisar trabajo`, `reanudar trabajo`).
- **Orquestación clara:** Mantiene el enfoque en la arquitectura sin derivar en asistentes conversacionales.

## Estado
El estado del agente se controla con el ecosistema de persistencia en `agent_state.json` el cual almacena la fase y progreso incremental del trabajo.
