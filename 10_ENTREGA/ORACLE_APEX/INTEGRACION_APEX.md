# Preparación de integración Oracle APEX

Esta carpeta contiene el diseño documental de Fase 9. No se generaron SQL, PL/SQL, ORDS, tablas, páginas configuradas ni exportaciones APEX. La arquitectura es lógica y sus alternativas dependen de la versión y ambiente autorizados.

## Estado del entorno

- Oracle Database local: no detectado en la auditoría tecnológica del 2026-11-08.
- SQL*Plus, SQL Developer, ORDS y Java: no detectados en PATH/rutas auditadas.
- Conexión remota a Oracle, APEX y ORDS: no verificada; no se proporcionaron endpoint ni credenciales.
- Versiones objetivo: pendientes de confirmación. No se asume proveedor de identidad ni despliegue REST.

## Índice de diseño

- `MODELO_LOGICO_APEX.md`: entidades, relaciones, cardinalidades, catálogos, reglas y asociaciones pendientes.
- `DICCIONARIO_DATOS_APEX.md`: claves lógicas, campos, tipos conceptuales, obligatoriedad y reglas de las 23 entidades Fase 3.
- `MAPEO_JSON_APEX.md`: traducción de archivos actuales y almacenes IndexedDB, fixtures y límites de importación.
- `PAGINAS_APEX_PROPUESTAS.md`: navegación y páginas lógicas sin números de página ni configuración de versión.
- `COMPONENTES_APEX.md`: mapeo UX a componentes candidatos, sujeto a versión/tema.
- `SEGURIDAD_APEX.md`: identidad, autorización, privacidad, sesión, auditoría y aceptación.
- `LMS_MAPPING.md`: contenido, preguntas, quiz/examen, resultados, progreso, versionado y sincronización.
- `CHECKLIST_MIGRACION_APEX.md`: pasos de preparación, construcción, pruebas y corte.
- `RIESGOS_INTEGRACION.md`: riesgos, dependencias y decisiones críticas.

## Principios para el integrador

1. `03_MODELO_DATOS/` es la fuente de las 23 entidades, sus códigos y reglas; cualquier extensión lógica aquí señalada requiere aprobación antes del diseño físico.
2. `05_ACADEMIA/JSON/` contiene plantillas, no registros importables. AVSEC de Fase 8 es `DRAFT_REVIEW` y no acredita capacitación.
3. La PWA es una demo cliente con IndexedDB; no es autoridad para identidad, permisos, asistencia, SOS, puntuación ni sincronización.
4. GitHub Pages debe seguir siendo una distribución plana independiente y pública sin datos sensibles, claves de respuesta ni archivos privados.
5. Confirmar versiones, temas, autenticación y acceso real; consultar documentación Oracle oficial correspondiente antes de depender de una capacidad.

El paquete de entrega seleccionada está en `10_ENTREGA/ORACLE_APEX/INDICE_CONTENIDO.md`.
