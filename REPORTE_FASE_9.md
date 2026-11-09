# Reporte de Fase 9 — OmniGuard App

**Fecha:** 2026-11-08
**Estado:** paquete documental de integración Oracle APEX preparado; no hay implementación Oracle ni instancia validada.

## Documentos creados

- `06_ORACLE_APEX/MODELO_LOGICO_APEX.md`
- `06_ORACLE_APEX/DICCIONARIO_DATOS_APEX.md`
- `06_ORACLE_APEX/MAPEO_JSON_APEX.md`
- `06_ORACLE_APEX/PAGINAS_APEX_PROPUESTAS.md`
- `06_ORACLE_APEX/COMPONENTES_APEX.md`
- `06_ORACLE_APEX/SEGURIDAD_APEX.md`
- `06_ORACLE_APEX/LMS_MAPPING.md`
- `06_ORACLE_APEX/CHECKLIST_MIGRACION_APEX.md`
- `06_ORACLE_APEX/RIESGOS_INTEGRACION.md`
- `10_ENTREGA/ORACLE_APEX/INDICE_CONTENIDO.md` y fuentes documentales seleccionadas.

Se actualizó `06_ORACLE_APEX/INTEGRACION_APEX.md` como índice y declaración de estado del entorno. No se modificó el código ni el funcionamiento de la PWA.

## Entidades y trazabilidad

- Se documentaron las **23 entidades** de `03_MODELO_DATOS/MODELO_ENTIDADES.md` y sus campos lógicos, clave primaria lógica, obligatoriedad y reglas.
- Se trazaron identificadores de Fase 3 y Fase 8, incluyendo `CRS-AVSEC-001`, `UNT-AVSEC-001..005`, `LES-AVSEC-001..005`, `ACT-AVSEC-001..005`, `BNK-AVSEC-001`, 50 preguntas y `EXM-AVSEC-001`.
- Se incluyeron las relaciones, cardinalidades, catálogos controlados y dependencias de integridad; se señalaron asociaciones adicionales para banco-pregunta, selección de examen y respuestas de intento.
- Se mapearon los **15 JSON** de `assets/data`, contratos de plantilla y los 16 almacenes IndexedDB, indicando correspondencia o ausencia de entidad de negocio. Se separaron catálogos, contenido, preferencias y fixtures no importables.
- Se conservaron el estado `DRAFT_REVIEW` de AVSEC y la disponibilidad futura de Mercancías Peligrosas/SMS. No se asignaron identificadores nuevos.
- Se mapearon páginas, componentes UX, acceso, seguridad, navegación LMS, checklist y paquete de entrega.

## Riesgos identificados

- Versiones/instancia Oracle Database, APEX y ORDS no confirmadas; no hay acceso remoto validado ni herramientas Oracle cliente detectadas.
- Mecanismo de autenticación, roles, permisos, fuentes maestras, zona horaria, retención y residencia de archivos pendientes.
- IndexedDB es almacenamiento de cliente sin sincronización; la PWA no es autoridad transaccional.
- Las claves y la calificación AVSEC de Fase 8 son accesibles en el cliente; el examen es demostrativo, no certificable.
- Hay datos demo, códigos nulos, contenido duplicado entre JSON planos/anidados, asociaciones LMS aún no aprobadas y duraciones por reconciliar.
- Evidencia/documentos RH, auditoría polimórfica y políticas de privacidad requieren diseño/validación antes de datos reales.

## Validaciones

- Se contrastaron documentos fuente de Fases 1 a 8, Gobierno Tecnológico, estándares Oracle/GitHub, contratos y archivos JSON realmente cargados por la PWA.
- Se verificó localmente que las rutas de archivos objetivo no existían antes de crearlas y que el proyecto no detecta SQL*Plus, SQL Developer, ORDS ni una instalación local Oracle.
- Se documentaron, sin resolver por suposición, los datos de cursos legados en `demo-data.json`, la duplicación de metadatos AVSEC entre JSON planos y anidados, y la diferencia entre las 240 min por unidad y las 180 min de su lección.
- No se ejecutó SQL, PL/SQL, DDL, conexión de base de datos, exportación APEX, pruebas de instancia ni cambios a la PWA.

## Pendientes y preparación para Fase 10

1. Confirmar instancia autorizada y versiones reales de Database/APEX/ORDS.
2. Obtener aprobación de modelo, asociaciones LMS, identidad/roles, catálogos, almacenamiento de archivos y reglas operativas.
3. Resolver los códigos nulos de Cliente/Servicio y autoridad por campo entre los JSON planos y el paquete AVSEC versionado.
4. Aprobar contenido AVSEC, referencias, evaluación y duración antes de cualquier uso formativo oficial.
5. Solo tras esas decisiones, iniciar Fase 10 con diseño físico y construcción incremental en el ambiente autorizado, incluyendo scripts versionados, pruebas, respaldo y reversión.
