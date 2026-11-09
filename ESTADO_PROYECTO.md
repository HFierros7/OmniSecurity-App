# Estado del proyecto OmniGuard App

- **Fecha:** 2026-11-08
- **Fase actual:** Fase 2 — estructura documental y arquitectónica inicial
- **Estado:** Estructura creada; análisis funcional, diseño detallado e implementación pendientes.

## Hallazgos del diagnóstico

- La raíz del proyecto contenía únicamente `Recursos`; se preservó sin cambios.
- El repositorio de trabajo no mostró un remoto Git configurado. El repositorio declarado (`HFierros7/OmniSecurity-App`) requiere confirmación y vinculación local antes de operaciones GitHub.
- La disponibilidad de Oracle Database, Oracle APEX y ORDS no está verificada; confirmar versiones y acceso con el responsable del ambiente.
- No se encontraron especificaciones funcionales ni código de aplicación en la raíz inspeccionada.

## Riesgos

- Alcance, perfiles de usuario y flujos operativos/LMS aún no están definidos.
- Sin versiones y acceso Oracle confirmados no se puede validar compatibilidad ni diseñar una integración ejecutable.
- La publicación en GitHub Pages requiere confirmar remoto, rama, configuración y autorización.
- Los requisitos de operación offline, sincronización y persistencia local requieren análisis de datos, conflictos y seguridad.

## Próximos pasos

1. Levantar requisitos, actores, procesos y criterios de aceptación.
2. Confirmar el repositorio remoto y el flujo de ramas autorizado.
3. Confirmar versiones y disponibilidad de APEX, Oracle Database y ORDS.
4. Completar y aprobar la arquitectura funcional, UX/UI y el modelo conceptual de datos.
5. Definir seguridad, operación offline y estrategia de sincronización antes de implementar.
