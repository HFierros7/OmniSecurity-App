# Reporte de Fase 3 — OmniGuard App

- **Fecha:** 2026-11-08
- **Fase declarada:** Arquitectura Base completada; documentación funcional, modelo conceptual y contratos maestros elaborados.
- **Estado de entrega:** especificaciones preparadas para revisión; no se generó código ni se creó esquema.

## Documentos generados o actualizados

- **Actualizado con autorización:** `03_MODELO_DATOS\MODELO_ENTIDADES.md`.
- **Creado:** `03_MODELO_DATOS\DICCIONARIO_DATOS.md`.
- **Creado:** `03_MODELO_DATOS\MODELO_JSON_MAESTRO.md`.
- **Creado:** `01_ANALISIS\CASOS_DE_USO.md`.
- **Creado:** `01_ANALISIS\MAPA_DE_NAVEGACION.md`.
- **Creado:** `03_MODELO_DATOS\IDENTIFICADORES.md`.
- **Creado:** `REPORTE_FASE_3.md`.

Los demás entregables de fases previas permanecen sin cambios.

## Decisiones arquitectónicas propuestas

- Separar claves técnicas internas, códigos de negocio legibles e identificadores opacos para APIs.
- Usar contenido LMS versionado e inmutable al publicarse; progreso y datos personales se mantienen separados del contenido editorial.
- Mantener el servidor como autoridad para identidad, autorización, estado final de operaciones, calificaciones y sincronización.
- Registrar multimedia como metadatos y localizadores; almacenamiento, límites, retención y cifrado quedan por decidir.
- Modelar la relación BancoPreguntas–Pregunta como muchos-a-muchos; incorporar una asociación lógica y resolver el detalle de respuestas de cada intento antes del diseño físico.
- Tratar claves correctas de evaluación, documentos RH e incidentes como datos restringidos.
- Mantener errores y pendientes offline distinguibles de operaciones confirmadas.

Estas son propuestas de arquitectura, no decisiones de negocio aprobadas ni capacidades verificadas en una instancia Oracle.

## Riesgos detectados

- No se confirmaron versiones ni acceso a Oracle Database, APEX u ORDS; por ello tipos, almacenamiento JSON y capacidades de integración deben validarse.
- SOS requiere protocolo real de escalamiento y respuesta. Un mensaje sin entrega confirmada no debe mostrarse como alerta enviada.
- Check In/Out y SOS dependen de conectividad, ubicación/privacidad, idempotencia y una política segura para operación offline.
- Evidencia foto/video/audio y documentos RH requieren reglas de tamaño, almacenamiento, cifrado, retención, acceso y cumplimiento.
- Banco de preguntas y evaluaciones pueden exponer respuestas; se requiere separación entre autoría, entrega al participante y calificación confiable.
- Bitácora y asociaciones polimórficas no garantizan integridad referencial directa; decidir su normalización antes del modelo lógico/físico.
- Los formatos de códigos son propuestas; unicidad, secuencias, identificadores públicos y ámbitos deben aprobarse.
- Actores, roles, jerarquía de aprobación de vacaciones y acceso a calendario/servicios aún no están confirmados.

## Pendientes

- Validar atributos, cardinalidades, nulabilidad, estados, restricciones, retención y volumen esperado con responsables operativos, RH y academia.
- Definir roles, permisos, inicio de sesión, MFA si aplica y autorización server-side en APEX/ORDS.
- Definir política de sincronización y resolución de conflictos para progreso y operaciones offline.
- Completar requisitos de SOS, check-in geográfico y adjuntos, incluidos límites y procedimiento de contingencia.
- Diseñar entidades asociativas para BancoPreguntas–Pregunta y, si se necesita, detalle de respuestas del Resultado y referencias compartidas.
- Confirmar versiones y acceso de APEX, Oracle Database, ORDS; revisar documentación oficial correspondiente.
- Aprobar contratos JSON, campos obligatorios, valores controlados, versiones y estrategia de validación/almacenamiento.

## Siguiente fase recomendada

Fase 4 — validación y aprobación de requisitos y modelo lógico: talleres con responsables, catálogo de estados/roles, cardinalidades y reglas; confirmar plataforma Oracle objetivo. Después preparar el diseño físico y de autorización APEX/ORDS, todavía sin desplegar hasta contar con ambiente aprobado.

## Exclusiones verificadas

No se generó HTML, CSS, JavaScript, SQL ni otro código; no se instalaron dependencias; no se crearon tablas; no se modificaron otros documentos previos ni la carpeta `Recursos`.
