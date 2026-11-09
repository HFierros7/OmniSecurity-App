# Modelo lógico propuesto para Oracle APEX

**Estado:** diseño lógico de preparación; no es modelo físico aprobado.
**Base de trazabilidad:** `03_MODELO_DATOS/MODELO_ENTIDADES.md`, `DICCIONARIO_DATOS.md`, `IDENTIFICADORES.md`, `MODELO_JSON_MAESTRO.md` y `REPORTE_FASE_8.md`.

## Alcance y convenciones

- Se conservan las 23 entidades conceptuales de Fase 3. No se crean tablas ni se prescribe SQL.
- La clave primaria lógica candidata es `ID`; el `CODIGO` legible es identificador de negocio único y no reemplaza a `ID`. La estrategia física de generación queda pendiente de confirmar con la versión real de Oracle Database.
- Las relaciones de contenido se resuelven por código y versión. El contenido publicado debe ser inmutable; los cambios editoriales producen una versión nueva.
- Los términos **1:N**, **N:M** y **0..1** expresan cardinalidad conceptual, no restricciones físicas ya implementadas.
- Las asociaciones marcadas como extensión son necesarias para representar lo que la PWA y el modelo JSON ya describen, pero deben aprobarse antes del diseño físico.

## Entidades por dominio

| Dominio | Entidades |
|---|---|
| Identidad y operación | Usuario, Cliente, Servicio, Turno, Consigna, Incidente, Bitácora, Evidencia, Equipo, Inventario |
| Aprendizaje | Curso, Unidad, Lección, Actividad, Pregunta, Respuesta, BancoPreguntas, Evaluación, Resultado, Progreso, ReferenciaAPA |
| Recursos Humanos | DocumentoRH, Vacación |

`Empresa` no es una entidad aprobada: `assets/data/empresa.json` declara que sus metadatos son de visualización y no representan una entidad del modelo. `Configuración` tampoco está en el modelo Fase 3; los valores actuales son preferencias/estado local de la demo.

## Relaciones y cardinalidades

| Origen | Relación | Destino | Cardinalidad y condición |
|---|---|---|---|
| Cliente | ofrece | Servicio | Cliente 1:N Servicio; cada Servicio pertenece a un Cliente. |
| Usuario | tiene asignado | Turno | Usuario 1:N Turno; cada Turno tiene un Usuario. |
| Servicio | programa | Turno | Servicio 1:N Turno; cada Turno pertenece a un Servicio. |
| Servicio | publica | Consigna | Servicio 1:N Consigna; la publicación y vigencia son controladas. |
| Usuario | crea | Consigna | Usuario 1:N Consigna como creador. |
| Servicio | registra | Incidente | Servicio 1:N Incidente. |
| Usuario | reporta | Incidente | Usuario 1:N Incidente; cada Incidente tiene reportante. |
| Usuario | recibe asignación | Incidente | Usuario 0..1:N Incidente como responsable, según permiso. |
| Turno | contextualiza | Incidente | Turno 0..1:N Incidente. |
| Incidente / Turno | tiene adjunta | Evidencia | Cada Evidencia refiere exactamente a un Incidente o a un Turno, no a ambos. |
| Usuario | carga / verifica | Evidencia / Inventario | Usuario 1:N en cada rol indicado. |
| Equipo | aparece en | Inventario | Equipo 1:N Inventario; cada registro conserva su fecha e historial. |
| Servicio | contiene registros | Inventario | Servicio 1:N Inventario. |
| Usuario | actúa en | Bitácora | Usuario 1:N eventos como actor; se requiere conservar identidad y fecha. |
| Curso | organiza | Unidad | Curso 1:N Unidad; orden único dentro de la versión del Curso. |
| Unidad | organiza | Lección | Unidad 1:N Lección; orden único dentro de la Unidad. |
| Lección | contiene | Actividad | Lección 1:N Actividad; orden único dentro de la Lección. |
| Pregunta | ofrece | Respuesta | Pregunta 1:N Respuesta; selección simple requiere exactamente una clave válida en el ámbito confiable. |
| Curso | posee | BancoPreguntas | Curso 1:N BancoPreguntas versionados. |
| BancoPreguntas | contiene | Pregunta | N:M mediante la asociación lógica `BancoPreguntaPregunta`; permite orden, tema y peso. |
| BancoPreguntas | alimenta | Evaluación | BancoPreguntas 1:N Evaluación; cada evaluación fija la versión del banco. |
| Curso | ofrece | Evaluación | Curso 1:N Evaluación; la Unidad evaluada es opcional y debe pertenecer al mismo Curso. |
| Evaluación | presenta | Pregunta | N:M mediante `EvaluacionPregunta` o una selección versionada equivalente; conserva el conjunto exacto de cada evaluación. |
| Usuario | realiza | Resultado | Usuario 1:N intentos/resultados; cada resultado corresponde a una Evaluación. |
| Evaluación | produce | Resultado | Evaluación 1:N resultados; unicidad de intento por Usuario según política aprobada. |
| Resultado | detalla | respuesta individual | Extensión lógica `RespuestaIntento`, si se requiere auditoría por reactivo; véase LMS_MAPPING. |
| Usuario | acumula | Progreso | Usuario 1:N registros, únicos por recurso y versión según política. |
| Lección / Actividad | es objetivo de | Progreso | Cada Progreso refiere exactamente a una Lección o a una Actividad. |
| Curso / Unidad / Lección | cita | ReferenciaAPA | El modelo Fase 3 propone un ámbito principal único; referencias compartidas requieren asociación lógica explícita. |
| Usuario | posee | DocumentoRH | Usuario 1:N documentos con acceso restringido. |
| Usuario | solicita | Vacación | Usuario 1:N solicitudes; un usuario autorizador decide, sin autoaprobación salvo política formal. |

### Dependencias de integridad

1. Resolver Cliente → Servicio antes de cargar turnos, consignas, incidentes e inventarios.
2. Resolver Usuario e identidad autenticada antes de asignar actor, reportante, responsable, aprendiz o aprobador.
3. Cargar Curso y versión antes de Unidad; después Lección, Actividad, BancoPreguntas/Pregunta/Respuesta y Evaluación.
4. Cargar Resultados y Progreso solo después de resolver el recurso, versión y Usuario de referencia.
5. Asociar Evidencia solo después de definir el destino, autorización, almacenamiento, límites y retención.

## Asociaciones y referencias que requieren decisión

- **BancoPreguntaPregunta:** el contrato JSON contiene `question_refs` y el modelo conceptual define N:M. La asociación debe conservar versión, orden y metadatos de selección.
- **EvaluacionPregunta:** `evaluaciones.json` fija 35 códigos de pregunta. Se necesita conservar esa composición exacta y la versión de sus claves para reproducir cada intento.
- **RespuestaIntento:** `Resultado` actualmente no modela la selección individual. Incorporar el detalle lógico si la política exige auditoría, reanudación o revisión por reactivo.
- **Bitácora:** Fase 3 usa `ENTIDAD_TIPO` + `ENTIDAD_ID` como referencia polimórfica. No hay FK única que garantice integridad; definir un diseño auditable antes del modelo físico.
- **Evidencia:** la regla XOR entre Incidente y Turno no se debe dejar como validación de interfaz. Diseñar una representación que garantice el único padre y proteja el archivo.
- **ReferenciaAPA:** el modelo admite un ámbito principal. Para reutilización de una referencia en varias lecciones/unidades, definir una asociación N:M en vez de duplicar citas.
- **Roles y permisos:** no están en las 23 entidades Fase 3. APEX deberá resolverlos con mecanismos aprobados; no se agrega un modelo de roles propio en esta fase.

## Catálogos lógicos

Los siguientes dominios se usan o se desprenden del diccionario, pero sus valores completos y responsables no están aprobados. Mantenerlos como dominios controlados y confirmar si requieren catálogos administrables o listas cerradas:

`Usuario.ESTADO`; `Turno.ESTADO`; `Cliente.ESTADO`; `Servicio.ESTADO`; `Consigna.PRIORIDAD/ESTADO`; `Incidente.CATEGORIA/SEVERIDAD/ESTADO`; `Evidencia.TIPO_MEDIO`; `Equipo.CATEGORIA/ESTADO`; `Inventario.CONDICION/ESTADO`; estados editoriales de Curso/Unidad/Lección/Actividad/Pregunta/BancoPreguntas/Evaluación; tipos de contenido y actividad; tipo/dificultad de Pregunta; estado de Resultado/Progreso; sincronización; verificación de ReferenciaAPA; clasificación/estado de DocumentoRH; estado de Vacación.

Los valores de ejemplo de los documentos fuente no constituyen una lista exhaustiva ni una política laboral/operativa.

## Reglas de negocio transversales

- Aplicar integridad referencial, claves únicas, fechas válidas y validación de dominios en servidor/base de datos, no solo en la interfaz.
- Registrar actor e instante en cambios auditables; la Bitácora funcional es de solo adición para usuarios funcionales.
- Preservar registros históricos mediante baja lógica o retiro; no reutilizar códigos de negocio.
- No aceptar marcajes, SOS, incidentes, adjuntos ni solicitudes como confirmados hasta recibir confirmación autoritativa.
- No exponer claves de Pregunta en páginas cliente ni en paquetes públicos. La PWA Fase 8 solo lo simula.
- Separar datos personales, RH, operativos, contenido público y preferencias de interfaz.
- Todo campo, restricción y retención queda sujeto a validación jurídica, operativa y de versión Oracle.

## Trazabilidad

- **Fase 3:** entidades, cardinalidades, identificadores y diccionario conceptual en `03_MODELO_DATOS/`.
- **Fase 8:** `CRS-AVSEC-001`, `UNT-AVSEC-001..005`, `LES-AVSEC-001..005`, `ACT-AVSEC-001..005`, `BNK-AVSEC-001`, preguntas `QST-AVSEC-0001..0050`, `EXM-AVSEC-001`, umbral demo 80%, estado `DRAFT_REVIEW`.
- No se asignan códigos de negocio a Mercancías Peligrosas o SMS, cuyos códigos actuales son nulos.
