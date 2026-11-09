# Modelo JSON maestro — OmniGuard App

## Propósito y límites

Este documento define contratos conceptuales versionables para contenido LMS e intercambio de progreso. No contiene archivos JSON de ejemplo ni implementación.

- Las claves de contrato usan `lower_snake_case`; son distintas de los nombres físicos Oracle.
- Los identificadores de negocio son códigos estables; claves internas de base de datos no se exponen por defecto.
- Cada documento debe identificar `schema_version`, `content_id`, `content_version`, `locale` y `status` cuando aplique.
- El contenido publicado es inmutable por versión; una modificación editorial crea nueva versión.
- Validar tamaño, tipos, enumeraciones, relaciones y referencias antes de importar o publicar.
- No incorporar secretos, credenciales, datos personales innecesarios ni documentos RH en paquetes de contenido público/offline.
- Aún no se ha seleccionado una versión de Oracle que determine cómo almacenar o validar JSON nativo. APEX Ready no implica dependencia de una característica concreta de base de datos.

## course.json

**Propósito:** metadatos y catálogo de unidades de un curso.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| course_id | string | Sí | Código estable del curso |
| content_version | string | Sí | Versión publicada del curso |
| title | string | Sí | Título localizado |
| summary | string | Sí | Descripción breve |
| locale | string | Sí | Idioma y región |
| status | string | Sí | Estado del ciclo editorial/publicación |
| owner_ref | string | No | Referencia al responsable editorial |
| prerequisites | array[string] | No | Cursos o requisitos previos |
| unit_refs | array[string] | Sí | Unidades y orden curricular |
| published_at | datetime | No | Instante de publicación con zona horaria |

**Validaciones:** IDs únicos; unidades referenciadas existentes y compatibles con la versión; curso publicado no editable en sitio.

## unit.json

**Propósito:** describir una unidad y su secuencia de lecciones.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| unit_id | string | Sí | Código estable de unidad |
| course_id | string | Sí | Curso contenedor |
| content_version | string | Sí | Versión curricular |
| sequence | integer | Sí | Orden dentro del curso |
| title | string | Sí | Título |
| objectives | array[string] | Sí | Objetivos de aprendizaje |
| estimated_minutes | integer | No | Duración estimada no negativa |
| lesson_refs | array[string] | Sí | Lecciones ordenadas |
| status | string | Sí | Estado editorial |

**Validaciones:** combinación curso/unidad única; secuencia positiva y estable; referencias resueltas en la misma versión.

## lesson.json

**Propósito:** organizar el contenido y actividades de una lección.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| lesson_id | string | Sí | Código estable de lección |
| unit_id | string | Sí | Unidad contenedora |
| sequence | integer | Sí | Orden en la unidad |
| title | string | Sí | Título localizado |
| objectives | array[string] | Sí | Resultados de aprendizaje |
| content_type | string | Sí | Tipo de material |
| content_ref | string | Sí | Referencia segura al contenido |
| estimated_minutes | integer | No | Duración estimada |
| activity_refs | array[string] | No | Actividades asociadas |
| reference_refs | array[string] | No | Fuentes bibliográficas |
| status | string | Sí | Estado editorial |

**Validaciones:** contenido accesible y autorizado; referencias y actividades pertenecen al mismo paquete compatible.

## activity.json

**Propósito:** definir una actividad y sus criterios de finalización.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| activity_id | string | Sí | Código estable de actividad |
| lesson_id | string | Sí | Lección contenedora |
| sequence | integer | Sí | Orden de presentación |
| activity_type | string | Sí | Tipo controlado de actividad |
| title | string | Sí | Título |
| instructions | string | Sí | Instrucciones al participante |
| required | boolean | Sí | Si es requerida para completar |
| completion_rule | object conceptual | Sí | Criterio verificable de finalización |
| resource_refs | array[string] | No | Recursos relacionados |
| assessment_ref | string | No | Evaluación asociada |
| status | string | Sí | Estado editorial |

**Validaciones:** tipo y regla de finalización compatibles; instrucciones localizadas; recursos aprobados y disponibles.

## question-bank.json

**Propósito:** describir una versión de banco y su conjunto de preguntas.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| question_bank_id | string | Sí | Código estable del banco |
| course_id | string | Sí | Curso asociado |
| bank_version | string | Sí | Versión inmutable |
| locale | string | Sí | Idioma |
| question_refs | array[object conceptual] | Sí | Preguntas y metadatos de selección |
| status | string | Sí | Estado editorial |

La especificación de cada pregunta debe incluir identificador, tipo, enunciado, opciones permitidas, idioma, dificultad y etiquetas. La clave correcta y la retroalimentación reservada se mantienen en el ámbito confiable del servidor; no deben incluirse en el paquete entregado al navegador cuando ello permita revelar respuestas.

**Validaciones:** preguntas aprobadas y únicas por versión; compatibilidad entre tipo, opciones y regla de corrección.

## exam.json

**Propósito:** definir una evaluación reproducible que referencia un banco versionado.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| exam_id | string | Sí | Código estable de evaluación |
| course_id | string | Sí | Curso |
| unit_id | string | No | Unidad evaluada, si aplica |
| exam_version | string | Sí | Versión de configuración |
| question_bank_ref | string | Sí | Banco y versión fijados |
| selection_policy | object conceptual | Sí | Cantidad, categorías y ponderación |
| time_limit_minutes | integer | No | Duración máxima |
| passing_score | number | Sí | Umbral aprobado |
| attempt_limit | integer | No | Intentos permitidos |
| randomization_policy | string | Sí | Regla de orden/selección |
| status | string | Sí | Estado editorial |

**Validaciones:** umbral y límites en rangos aprobados; curso/unidad/banco compatibles; nunca exportar respuestas correctas en el documento de examen del participante.

## progress.json

**Propósito:** transportar eventos o estado de avance de aprendizaje para sincronización.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| progress_id | string | Sí | Identificador idempotente del registro/evento |
| learner_ref | string | Sí | Referencia seudónima de participante |
| course_id | string | Sí | Curso y versión |
| resource_type | string | Sí | Lección o actividad |
| resource_ref | string | Sí | Recurso objetivo |
| state | string | Sí | Estado de avance |
| percent_complete | number | Sí | Avance de 0 a 100 |
| last_position | string | No | Posición reanudable no sensible |
| occurred_at | datetime | Sí | Instante del evento con zona horaria |
| client_event_id | string | Sí | Clave para deduplicación |
| sync_state | string | Sí | Pendiente, confirmado o conflicto |

**Validaciones:** identidad autorizada por el servidor; deduplicar por `client_event_id`; validar versión y progreso; resolver conflictos con política explícita y auditada. No almacenar credenciales ni datos de sesión.

## reference.json

**Propósito:** registrar una referencia bibliográfica y su vínculo curricular.

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| schema_version | string | Sí | Versión del contrato |
| reference_id | string | Sí | Código estable de referencia |
| authors | array[string] | Sí | Autores personales o institucionales |
| publication_year | integer | No | Año conocido |
| title | string | Sí | Título de la fuente |
| edition | string | No | Edición/versión |
| publisher | string | No | Editorial o entidad |
| doi | string | No | DOI cuando exista |
| url | string | No | URL segura de consulta |
| accessed_at | date | No | Fecha de consulta |
| scope_ref | string | Sí | Curso, unidad o lección vinculada |
| verification_status | string | Sí | Estado de revisión |

**Validaciones:** verificar fuente, formato, vigencia, licencia y derechos antes de publicar; no inferir que una URL garantiza autorización de redistribución.

## Compatibilidad, sincronización y seguridad

- Mantener separados contenido editorial versionado y datos personales/progreso.
- Versionar el esquema independientemente de la versión de contenido.
- Definir migraciones compatibles, política de contenido obsoleto y respuesta ante versiones desconocidas antes de producción.
- El servidor es autoridad para identidad, permisos, calificación final y aceptación de sincronización.
- PWA/IndexedDB pueden conservar contenido público y eventos pendientes aprobados; datos RH, secretos y claves de respuesta no se publican ni se guardan en caches públicos.
