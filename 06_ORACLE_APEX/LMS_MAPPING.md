# Mapeo LMS de OmniGuard a Oracle APEX

**Estado:** diseño funcional, derivado del modelo de Fase 3, `MODELO_JSON_MAESTRO.md`, plantillas de Fase 7 y contenido AVSEC de Fase 8. No incluye SQL ni configuración APEX.

## Entidades y ciclo del contenido

| Concepto LMS | Entidad/estructura lógica | Relación y reglas |
|---|---|---|
| Curso | `Curso` | Código estable + `VERSION_CONTENIDO`, locale, estado y fechas editoriales. Una versión publicada es inmutable. |
| Unidad | `Unidad` | 1:N con Curso; secuencia única dentro de versión. |
| Lección | `Lección` | 1:N con Unidad; orden y referencia de contenido resueltos a la misma versión. |
| Actividad | `Actividad` | 1:N con Lección; tipo, instrucción y regla verificable de completitud. |
| Recurso | Referencia de contenido de Lección/Actividad, no entidad Fase 3 | Puede ser texto, imagen, audio, video, acordeón, caso, diagrama o fuente APA. Decidir si necesita entidad `Recurso` por metadatos, permisos, licencia, reutilización o archivo. |
| Pregunta | `Pregunta` | Tiene opciones `Respuesta`, tipo, idioma, estado y etiquetas/tema. Versionar para preservar evaluaciones previas. |
| Banco de preguntas | `BancoPreguntas` + asociación N:M | `BancoPreguntaPregunta` mantiene inclusión, versión, orden, tema y peso. |
| Quiz | `Evaluación` de práctica y/o `Actividad` evaluable | No hay entidad `Quiz` en Fase 3. Resolver clasificación antes de físico; Fase 8 usa cinco referencias por Unidad y retroalimentación de práctica. |
| Examen | `Evaluación` | Referencia fija a Banco/versión, política de selección, umbral, intentos y estado. La configuración actual no tiene límite de tiempo aprobado. |
| Preguntas del examen | `EvaluacionPregunta` o snapshot lógico | Fijar selección exacta/orden/versiones para que un Resultado sea reproducible. |
| Intento/resultado | `Resultado` | Pertenece a Usuario y Evaluación; tiene secuencia de intento, tiempos, puntuación, aprobado y estado. Una entrega se cierra una sola vez. |
| Respuestas del intento | Extensión lógica `RespuestaIntento` | No existe en las 23 entidades Fase 3; definirla si se requieren auditoría/revisión por pregunta. Calificación debe ser confiable y servidor. |
| Progreso | `Progreso` | Pertenece a Usuario y exactamente un recurso objetivo (Lección o Actividad); 0–100, estado, versión y posición reanudable no sensible. |
| Resultado | `Resultado` + detalle de respuesta si aprobado | Separar resultado final del estado de navegación; retener la versión de Curso/Banco/Evaluación. |
| Referencias | `ReferenciaAPA` | Fuente y estado de verificación vinculados al Curso/Unidad/Lección; asociación si una fuente es compartida. |

## Flujo lógico del alumno

1. Identidad y autorización verificadas por servidor.
2. Obtener Cursos publicados/asignados con versión vigente.
3. Abrir curso, unidades y lecciones autorizadas; mostrar progreso de esa versión.
4. Leer contenido y registrar actividad/progreso según reglas aprobadas.
5. Iniciar evaluación si la versión está publicada y el Usuario tiene intento disponible.
6. El servidor fija selección y versión; guarda respuestas bajo una clave de intento.
7. El servidor valida y cierra una entrega idempotente, calcula Resultado y expone la retroalimentación permitida.
8. Actualizar Progreso confirmado; si el cliente reporta avance offline, tratarlo como evento pendiente no autoritativo hasta política de sincronización.

## Configuración AVSEC de Fase 8

- Curso: `CRS-AVSEC-001`, `content_version: 0.1.0`, estado `DRAFT_REVIEW`; cinco unidades `UNT-AVSEC-001..005`, cinco lecciones `LES-AVSEC-001..005` y cinco actividades `ACT-AVSEC-001..005`.
- Banco: `BNK-AVSEC-001`, 50 preguntas `QST-AVSEC-0001..0050`, 10 por unidad; opciones A–D.
- Práctica: 5 preguntas referenciadas por unidad (25 referencias de quiz). Determinar si son Evaluaciones independientes o actividades configuradas.
- Examen: `EXM-AVSEC-001`, 35 referencias (7 por unidad), 80%/28 aciertos únicamente como umbral demo. Código, estado y referencias se conservan; no publicar como certificación.
- Fuentes `REF-AVSEC-001..` mantienen su estado de verificación. Revisar `05_ACADEMIA/AVSEC/REFERENCIAS_AVSEC.md`.
- Mercancías Peligrosas y SMS tienen código nulo y están disponibles próximamente; no crear contenido ni identificadores.

## Versionado, respuestas y privacidad

- Esquema (`schema_version`) y contenido (`content_version`, versiones de banco/evaluación) son dimensiones independientes.
- Una edición publicada crea versión nueva; no actualizar retrospectivamente lo que vio un participante.
- Un Resultado debe poder identificar versión exacta, preguntas presentadas, respuestas, regla de puntuación y fecha. Decidir snapshot versus asociación versionada.
- La clave `correct_option_id` en JSON y el cálculo de `gradeDemoQuestions` del cliente son exclusivamente demo. Para producción, el servidor conserva clave, valida selección y responde solo con resultado permitido después de entrega.
- Aplicar autorización de lectura/escritura por Usuario y curso; el alumno consulta sus intentos, no los de otras personas. Editor y publicador son funciones distintas por aprobar.
- No aceptar `percent_complete`, `passed`, `score` ni `user_ref` del navegador sin validación de sesión, propiedad, versión e idempotencia.

## Sincronización desde IndexedDB

La PWA conserva almacenes locales de actividades, quizzes, intentos, resultados y progreso, pero no ofrece contrato de sincronización validado. Para integrar:

- Definir `client_event_id`, identidad/learner ref seudónima, hora de evento, versión del recurso y estado pendiente/aceptado/rechazado.
- Deduplicar operaciones repetidas; devolver estado autoritativo.
- Resolver conflictos (misma actividad en más de un dispositivo, versión retirada, intento abierto/cerrado, resultados) por política aprobada.
- Mantener datos locales no sensibles; limpiar lo que requiera política al cerrar sesión o revocar acceso.
- No sincronizar claves, sesión, archivos privados, RH ni respuestas en progreso fuera del alcance aprobado.

## Trazabilidad de contratos

`course.json`, `unit.json`, `lesson.json`, `activity.json`, `question-bank.json`, `exam.json`, `progress.json` y `reference.json` de `05_ACADEMIA/JSON` son plantillas estructurales, no contenido importable. Validar sus referencias y contenido antes de importación.
