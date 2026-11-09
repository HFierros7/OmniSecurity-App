# Modelo conceptual de entidades — OmniGuard App

## Alcance y convenciones

Este es un modelo conceptual inicial para una PWA preparada para una futura implementación Oracle APEX. No representa tablas creadas ni un diseño físico aprobado. Los atributos son candidatos; tipos, nulabilidad, retención, restricciones e índices deben validarse contra requisitos y versiones reales de Oracle Database, APEX y ORDS.

- Toda entidad persistida tendrá una clave técnica interna `ID`; se recomienda una clave numérica generada por el motor. Los códigos legibles son identificadores de negocio únicos, no sustituyen la clave primaria.
- Las entidades auditables registrarán `CREADO_EN` y `ACTUALIZADO_EN`. Los cambios de estado relevantes deben quedar trazados.
- Los nombres de roles y permisos no se derivan de la persona de ejemplo; se definirán con el modelo de autorización de APEX y el responsable del negocio.
- Las referencias a archivos describen metadatos y localizadores. La ubicación física, límites, retención y cifrado de evidencias están pendientes de decisión.

## Usuario

- **Propósito:** representar a una persona autorizada para usar la aplicación.
- **Descripción:** perfil funcional vinculado a la identidad gestionada por el mecanismo de autenticación aprobado.
- **Atributos:** código, nombres, apellidos, correo, teléfono opcional, identificador externo de identidad y estado.
- **Identificadores:** `ID`; código de negocio `USR-…`; identificador externo único cuando lo proporcione el proveedor de identidad.
- **Relaciones:** tiene turnos, reporta incidentes, carga evidencias, registra progreso/resultados y puede tener documentos RH y solicitudes de vacaciones.
- **Reglas de negocio:** no guardar contraseñas en el perfil; correo e identidad externa deben ser únicos cuando se usen; desactivar en vez de borrar si existen registros relacionados; limitar acceso a datos personales.

## Turno

- **Propósito:** registrar una asignación de trabajo y sus marcas de asistencia.
- **Descripción:** periodo planificado para una persona en un servicio, con marcas efectivas de entrada y salida.
- **Atributos:** código, usuario, servicio, inicio/fin planificados, entrada/salida reales, ubicación de marcas si se autoriza y estado.
- **Identificadores:** `ID`; código `TRN-…`.
- **Relaciones:** pertenece a un usuario y un servicio; puede contextualizar incidentes, evidencias y bitácora.
- **Reglas de negocio:** fin planificado posterior al inicio; no registrar salida antes de entrada; impedir turnos incompatibles según regla laboral aprobada; conservar hora con zona horaria y distinguir tiempo planificado de efectivo.

## Cliente

- **Propósito:** identificar a la organización receptora de servicios.
- **Descripción:** cuenta comercial o institucional bajo la cual se prestan uno o más servicios.
- **Atributos:** código, nombre, estado y datos de contacto institucional aprobados.
- **Identificadores:** `ID`; código `CLI-…`.
- **Relaciones:** un cliente tiene servicios.
- **Reglas de negocio:** nombre y datos deben seguir la fuente maestra aprobada; limitar acceso a datos comerciales; no borrar clientes con servicios o registros históricos asociados.

## Servicio

- **Propósito:** representar el servicio o ubicación operativa contratado.
- **Descripción:** ámbito organizativo donde se asignan turnos, consignas, incidentes e inventarios.
- **Atributos:** código, cliente, nombre, ubicación descriptiva, zona horaria y estado.
- **Identificadores:** `ID`; código `SRV-…`.
- **Relaciones:** pertenece a un cliente y agrupa turnos, consignas, incidentes e inventarios.
- **Reglas de negocio:** toda operación debe referir a un servicio activo; la zona horaria debe ser explícita para interpretar horarios; los registros históricos conservan su servicio aunque este se cierre.

## Consigna

- **Propósito:** comunicar instrucciones operativas vigentes a personal de un servicio.
- **Descripción:** instrucción con vigencia, prioridad, autoría y estado de publicación.
- **Atributos:** código, servicio, creador, título, descripción, prioridad, vigencia desde/hasta y estado.
- **Identificadores:** `ID`; código `CNS-…`.
- **Relaciones:** pertenece a un servicio; se asocia a su creador y puede ser consultada durante uno o más turnos.
- **Reglas de negocio:** vigencia final no anterior a la inicial; publicar solo tras autorización; cambios y confirmaciones de lectura deben auditarse; conservar versiones anteriores para trazabilidad.

## Incidente

- **Propósito:** registrar y dar seguimiento a un evento operativo o de seguridad.
- **Descripción:** expediente con clasificación, fecha/hora de ocurrencia, reporte, responsables y resolución.
- **Atributos:** código, servicio, turno opcional, reportado por, asignado a opcional, categoría, severidad, descripción, ocurrido en, estado y resolución.
- **Identificadores:** `ID`; código `INC-…`.
- **Relaciones:** pertenece a un servicio; puede referir a un turno; tiene reportante, posible responsable, evidencias y eventos de bitácora.
- **Reglas de negocio:** fecha de ocurrencia y reportante obligatorios; transiciones de estado controladas; no eliminar ni sobrescribir el reporte original; restringir acceso por severidad y función; registrar quién cambia o cierra el caso.

## Bitácora

- **Propósito:** aportar trazabilidad cronológica de acciones relevantes.
- **Descripción:** evento de auditoría con actor, acción, hora, correlación y entidad afectada.
- **Atributos:** código, actor, tipo e identificador de entidad afectada, acción, ocurrido en, identificador de correlación y detalle no sensible.
- **Identificadores:** `ID`; código `LOG-…`.
- **Relaciones:** cada entrada refiere a un usuario actor; el objetivo se expresa inicialmente como tipo más identificador.
- **Reglas de negocio:** solo adición, sin edición/borrado por usuarios funcionales; el vínculo polimórfico objetivo no se valida con una FK única y requiere decidir si se separa por dominio; no registrar credenciales, tokens ni contenido sensible.

## Evidencia

- **Propósito:** documentar una prueba adjunta a un incidente o turno.
- **Descripción:** metadatos de una foto, video, audio u otro archivo autorizado; no presupone almacenamiento local o externo.
- **Atributos:** código, incidente opcional, turno opcional, cargado por, tipo de medio, MIME, nombre original, tamaño, hash, localizador de almacenamiento, capturado en y cargado en.
- **Identificadores:** `ID`; código `EVD-…`.
- **Relaciones:** refiere exactamente a un incidente o a un turno y a un usuario que la carga.
- **Reglas de negocio:** validar tipo y tamaño en servidor; el nombre original no es una ruta confiable; almacenar el archivo fuera de la base de metadatos salvo decisión explícita; aplicar cifrado, retención, autorización y eliminación controlada; un registro pendiente offline no equivale a una carga confirmada.

## Inventario

- **Propósito:** guardar una observación de existencia o condición de un equipo en un servicio.
- **Descripción:** registro de conteo o inspección de un equipo, con valores esperados y observados.
- **Atributos:** código, equipo, servicio, verificado por, fecha/hora, cantidad esperada, cantidad observada, condición, observaciones y estado.
- **Identificadores:** `ID`; código `INV-…`.
- **Relaciones:** cada registro refiere a un equipo, servicio y usuario verificador.
- **Reglas de negocio:** cantidades no negativas; diferencias deben quedar visibles y explicables; el historial no se reemplaza con el conteo más reciente.

## Equipo

- **Propósito:** representar un activo o tipo de equipo controlado.
- **Descripción:** ficha maestra de identificación, categoría y estado del equipo.
- **Atributos:** código, nombre, categoría, número de serie opcional y estado.
- **Identificadores:** `ID`; código `EQP-…`; número de serie único si se proporciona.
- **Relaciones:** tiene registros de inventario asociados.
- **Reglas de negocio:** no duplicar número de serie; baja lógica conserva inventarios históricos; definir si el catálogo distingue activo individual de artículo contabilizable antes de la implementación.

## Curso

- **Propósito:** definir una oferta formativa versionada.
- **Descripción:** contenedor de unidades, referencias, bancos de preguntas y evaluaciones.
- **Atributos:** código temático, título, descripción, versión de contenido, idioma, propietario, estado y fecha de publicación.
- **Identificadores:** `ID`; código como `CRS-AVSEC-001`.
- **Relaciones:** contiene unidades; puede tener bancos de preguntas, evaluaciones y referencias.
- **Reglas de negocio:** una versión publicada es inmutable; cambios curriculares producen una nueva versión; distinguir borrador, publicado, retirado y archivado.

## Unidad

- **Propósito:** organizar un curso en bloques curriculares.
- **Descripción:** agrupador ordenado de lecciones con objetivos y duración estimada.
- **Atributos:** código, curso, orden, título, objetivos, duración estimada y estado.
- **Identificadores:** `ID`; código como `UNT-AVSEC-001`; orden único dentro del curso.
- **Relaciones:** pertenece a un curso y contiene lecciones.
- **Reglas de negocio:** solo unidades de un curso; cambios de orden no alteran identificadores; no publicar si faltan objetivos o contenido obligatorio.

## Lección

- **Propósito:** presentar contenido de aprendizaje dentro de una unidad.
- **Descripción:** recurso ordenado con objetivos, tipo de contenido y referencia a su versión publicada.
- **Atributos:** código, unidad, orden, título, tipo, referencia de contenido, duración y estado.
- **Identificadores:** `ID`; código como `LES-AVSEC-001`; orden único dentro de la unidad.
- **Relaciones:** pertenece a una unidad y agrupa actividades.
- **Reglas de negocio:** la referencia debe resolver a contenido de la misma versión publicada; validar accesibilidad, idioma y derechos de uso.

## Actividad

- **Propósito:** definir una acción de aprendizaje o comprobación asociada a una lección.
- **Descripción:** actividad ordenada con instrucciones, tipo y condición de cumplimiento.
- **Atributos:** código, lección, orden, tipo, referencia de contenido, obligatoria, ponderación y estado.
- **Identificadores:** `ID`; código como `ACT-AVSEC-001`; orden único dentro de la lección.
- **Relaciones:** pertenece a una lección; puede ser objetivo de progreso y referir a evaluación o recurso.
- **Reglas de negocio:** ponderaciones no negativas y con suma validada cuando se utilicen para calificar; definir criterio verificable de finalización.

## Pregunta

- **Propósito:** representar una unidad evaluable.
- **Descripción:** enunciado tipado con dificultad, explicación y una o más respuestas posibles.
- **Atributos:** código, enunciado, tipo, dificultad, explicación, idioma y estado.
- **Identificadores:** `ID`; código como `QST-AVSEC-0001`.
- **Relaciones:** tiene respuestas y puede incluirse en varios bancos mediante una asociación.
- **Reglas de negocio:** validar consistencia entre tipo y respuestas; revisión editorial antes de publicar; claves correctas y explicaciones no se exponen al cliente si permiten revelar respuestas.

## Respuesta

- **Propósito:** definir una alternativa o respuesta esperada de una pregunta.
- **Descripción:** opción ordenada con texto, indicador de corrección y retroalimentación.
- **Atributos:** código, pregunta, orden, texto, es correcta y retroalimentación.
- **Identificadores:** `ID`; código único de respuesta; orden único dentro de la pregunta.
- **Relaciones:** pertenece a una pregunta.
- **Reglas de negocio:** una pregunta de selección simple requiere una única respuesta correcta; las reglas de selección múltiple dependen del tipo; mantener la clave correcta protegida.

## BancoPreguntas

- **Propósito:** agrupar preguntas seleccionables para evaluaciones.
- **Descripción:** colección versionada y categorizada de preguntas asociada a un ámbito formativo.
- **Atributos:** código, curso, título, versión y estado.
- **Identificadores:** `ID`; código como `BNK-AVSEC-001`.
- **Relaciones:** se asocia a preguntas en relación muchos-a-muchos; una evaluación puede tomar preguntas del banco. Se requerirá una entidad asociativa lógica para ordenar, ponderar o etiquetar la inclusión.
- **Reglas de negocio:** solo preguntas aprobadas pueden entrar en bancos publicados; fijar versión para reproducir resultados históricos.

## Evaluación

- **Propósito:** configurar una evaluación y sus criterios de aprobación.
- **Descripción:** evaluación vinculada a un curso, opcionalmente a una unidad, y a un banco de preguntas.
- **Atributos:** código, curso, unidad opcional, banco, título, duración, porcentaje de aprobación, intentos permitidos, aleatorización y estado.
- **Identificadores:** `ID`; código como `EXM-AVSEC-001`.
- **Relaciones:** pertenece a un curso y banco, opcionalmente a una unidad; genera resultados.
- **Reglas de negocio:** la unidad debe pertenecer al curso; porcentaje dentro del rango acordado; límites de intentos y selección de preguntas deben ser reproducibles por versión.

## Resultado

- **Propósito:** conservar el resultado de un intento de evaluación.
- **Descripción:** registro de ejecución con puntuación, fechas, número de intento y resultado.
- **Atributos:** código, evaluación, usuario, número de intento, inicio, entrega, puntuación, aprobado y estado.
- **Identificadores:** `ID`; código `RES-…`; combinación evaluación/usuario/intento única según política.
- **Relaciones:** pertenece a una evaluación y usuario.
- **Reglas de negocio:** validar número de intentos; cerrar una entrega una sola vez; preservar versión de evaluación usada; el detalle por pregunta requiere un modelo adicional si se necesita auditoría de respuestas.

## Progreso

- **Propósito:** registrar avance individual por recurso de aprendizaje.
- **Descripción:** estado de avance de una persona en una lección o actividad.
- **Atributos:** código, usuario, lección opcional, actividad opcional, porcentaje, estado, última posición y fechas de inicio/finalización.
- **Identificadores:** `ID`; código `PRG-…`; unicidad por usuario y recurso objetivo.
- **Relaciones:** pertenece a un usuario y a exactamente una lección o actividad; el avance agregado de curso/unidad puede calcularse.
- **Reglas de negocio:** no aceptar porcentaje fuera de 0–100; una actividad debe pertenecer a la lección asociada; definir política de sincronización, conflictos y registro offline; no almacenar credenciales en progreso.

## DocumentoRH

- **Propósito:** referenciar documentación laboral relacionada con una persona.
- **Descripción:** metadatos y localizador de un documento de Recursos Humanos, potencialmente sensible.
- **Atributos:** código, usuario, tipo documental, localizador, fecha de emisión, vencimiento, clasificación y estado.
- **Identificadores:** `ID`; código `DHR-…`.
- **Relaciones:** pertenece a un usuario.
- **Reglas de negocio:** acceso por mínimo privilegio; cifrar y definir retención; evitar copias o exposición en cache/web pública; registrar accesos y cambios según política laboral aplicable.

## Vacación

- **Propósito:** gestionar una solicitud de ausencia por vacaciones.
- **Descripción:** solicitud por intervalo con estado, aprobación y trazabilidad.
- **Atributos:** código, usuario solicitante, inicio/fin, fecha de solicitud, estado, aprobador, fecha de decisión y nota.
- **Identificadores:** `ID`; código `VAC-…`.
- **Relaciones:** solicitada por un usuario y opcionalmente decidida por otro usuario autorizado.
- **Reglas de negocio:** fin no anterior al inicio; impedir solicitudes duplicadas o solapadas según política; solo un aprobador autorizado decide; conservar motivo/nota con acceso restringido.

## ReferenciaAPA

- **Propósito:** registrar una fuente bibliográfica de un contenido formativo.
- **Descripción:** cita y localizador verificable con alcance curricular.
- **Atributos:** código, autor, año, título, edición, editorial, DOI/URL, consultada en, curso/unidad/lección de alcance y estado de verificación.
- **Identificadores:** `ID`; código `REF-…`.
- **Relaciones:** se vincula a exactamente un ámbito curricular principal; puede ser utilizada por varias lecciones si se aprueba una asociación adicional.
- **Reglas de negocio:** validar fuente y fecha de consulta; preservar versión o edición; distinguir DOI de URL; revisar licencias y derechos antes de publicar.

## Relaciones y decisiones transversales

- Cliente 1:N Servicio; Servicio 1:N Turno, Consigna, Incidente e Inventario.
- Usuario 1:N Turno, Incidente, Evidencia, Resultado, Progreso, DocumentoRH y Vacación.
- Curso 1:N Unidad; Unidad 1:N Lección; Lección 1:N Actividad.
- Pregunta 1:N Respuesta; BancoPreguntas N:M Pregunta; BancoPreguntas 1:N Evaluación; Evaluación 1:N Resultado.
- El modelo conceptual necesita asociaciones para preguntas en bancos y, si se requiere, para referencias compartidas. También requiere decidir cómo guardar respuestas individuales de un intento.
- La bitácora y cualquier enlace polimórfico deben resolverse antes del modelo físico para no depender de referencias sin integridad referencial.
