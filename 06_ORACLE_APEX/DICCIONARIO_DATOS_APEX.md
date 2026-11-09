# Diccionario lógico de datos para Oracle APEX

**Estado:** propuesta conceptual; no define tipos físicos, DDL, longitudes Oracle ni nombres de objetos. Confirmar versión de Oracle Database/APEX y reglas de negocio antes de implementar.

## Convenciones comunes

- Todas las entidades persistentes del modelo Fase 3 consideran `ID` como clave técnica lógica; el método de generación queda pendiente.
- Los códigos `CODIGO` son claves de negocio, con unicidad según el ámbito aprobado. No son secretos ni autorización.
- Se heredan `CREADO_EN` (instante con zona horaria, obligatorio) y `ACTUALIZADO_EN` (instante con zona horaria, opcional hasta la primera modificación) donde haya persistencia mutable.
- Los tipos siguientes son lógicos: texto corto/largo, entero, decimal, booleano lógico, fecha, instante con zona horaria, referencia, lista, localizador o huella. No son declaraciones Oracle.
- “Condicional” requiere que la regla de relación indicada se satisfaga. La obligatoriedad es propuesta de Fase 3, no aprobación del negocio.

## Entidades operativas

### Usuario
**Descripción:** perfil funcional asociado a identidad gestionada por un mecanismo de autenticación aprobado. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Código interno único; no usar como credencial. |
| NOMBRES, APELLIDOS | Texto corto | Sí | Datos personales mínimos necesarios. |
| CORREO | Texto | Condicional | Único/normalizado solo si se usa en el mecanismo aprobado. |
| TELEFONO | Texto | No | Finalidad, consentimiento/base y acceso por definir. |
| IDENTIDAD_EXTERNA | Texto | Condicional | Identificador del proveedor elegido; unicidad si existe. |
| ESTADO | Dominio | Sí | Valores y transiciones por aprobar. |

`DEMO-0001` está en `contexto_demo.employee_id`; el modelo no define `EMPLEADO_ID`. No equipararlo a `CODIGO` ni a identidad autenticada sin decisión.

### Turno
**Descripción:** asignación de trabajo y sus marcas efectivas. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `TRN-…`. |
| USUARIO_ID, SERVICIO_ID | Referencias | Sí | Usuario y Servicio existentes. |
| INICIO_PLANIFICADO, FIN_PLANIFICADO | Instantes con zona horaria | Sí | Fin posterior al inicio. |
| CHECK_IN_EN, CHECK_OUT_EN | Instantes con zona horaria | No | No aceptar cierre sin entrada; evitar duplicados. |
| CHECK_IN_UBICACION, CHECK_OUT_UBICACION | Texto/localización | No | Solo si finalidad y política lo autorizan. |
| ESTADO | Dominio | Sí | Transiciones y estados por aprobar. |

### Cliente
**Descripción:** organización receptora de servicios. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `CLI-…`. |
| NOMBRE | Texto corto | Sí | Fuente maestra y uso de marca por confirmar. |
| ESTADO | Dominio | Sí | No retirar si conserva historia asociada. |

### Servicio
**Descripción:** ámbito contratado donde se asignan operaciones. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `SRV-…`. |
| CLIENTE_ID | Referencia | Sí | Cliente existente. |
| NOMBRE | Texto corto | Sí | Nombre operativo aprobado. |
| UBICACION | Texto | No | No almacenar coordenadas sin autorización. |
| ZONA_HORARIA | Texto corto | Sí | Zona horaria explícita y válida. |
| ESTADO | Dominio | Sí | Las operaciones nuevas requieren servicio activo. |

### Consigna
**Descripción:** instrucción versionable con vigencia para un Servicio. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `CNS-…`. |
| SERVICIO_ID, CREADOR_ID | Referencias | Sí | Servicio y Usuario existentes. |
| TITULO | Texto corto | Sí | Contenido aprobado para el destino autorizado. |
| DESCRIPCION | Texto largo | Sí | Proteger información operativa; versionar cambios. |
| PRIORIDAD, ESTADO | Dominios | Sí | Valores, publicación y autorización por aprobar. |
| VIGENTE_DESDE | Instante con zona horaria | Sí | Debe preceder a VIGENTE_HASTA si existe. |
| VIGENTE_HASTA | Instante con zona horaria | No | Vigencia final no anterior a la inicial. |

### Incidente
**Descripción:** expediente de evento con seguimiento y resolución. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `INC-…`. |
| SERVICIO_ID, REPORTADO_POR_ID | Referencias | Sí | Servicio y Usuario existentes. |
| TURNO_ID, ASIGNADO_A_ID | Referencias | No | Asignación y contexto autorizados. |
| CATEGORIA, SEVERIDAD, ESTADO | Dominios | Sí | Catálogos y transiciones controlados en servidor. |
| DESCRIPCION | Texto largo | Sí | Preservar el reporte original; acceso mínimo. |
| OCURRIDO_EN | Instante con zona horaria | Sí | Distinguir ocurrencia de registro. |
| RESOLUCION | Texto largo | No | Solo roles autorizados; conservar historial de cambios. |

### Bitácora
**Descripción:** evento cronológico de auditoría. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `LOG-…`. |
| ACTOR_ID | Referencia | Sí | Identidad autenticada o actor del sistema trazable. |
| ENTIDAD_TIPO, ENTIDAD_ID | Dominio + referencia lógica | Sí | Referencia polimórfica; resolver estrategia de integridad antes del modelo físico. |
| ACCION | Dominio/texto corto | Sí | Catálogo de acciones. |
| OCURRIDO_EN | Instante con zona horaria | Sí | Fecha de servidor para hechos confirmados. |
| CORRELACION_ID | Texto corto | No | Agrupa eventos de una operación. |
| DETALLE_RESUMIDO | Texto largo | No | No incluir secretos ni datos sensibles innecesarios. |

### Evidencia
**Descripción:** metadatos de un archivo autorizado; no define el almacenamiento binario. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `EVD-…`. |
| INCIDENTE_ID, TURNO_ID | Referencias | Condicional | Exactamente uno de los dos padres. |
| CARGADO_POR_ID | Referencia | Sí | Usuario autorizado. |
| TIPO_MEDIO, MIME_TYPE | Dominio/texto corto | Sí | Validar formato real en servidor. |
| NOMBRE_ORIGINAL | Texto corto | No | Informativo; nunca ruta confiable. |
| TAMANO_BYTES | Entero | Sí | No negativo; sujeto a límite aprobado. |
| SHA256 | Texto corto | No | Solo si se aprueba verificación de integridad. |
| LOCALIZADOR | Referencia segura | Sí | No exponer ubicación privada ni ruta directa. |
| CAPTURADO_EN | Instante con zona horaria | No | Dato declarado, diferenciado de recepción. |
| CARGADO_EN | Instante con zona horaria | Sí | Momento de recepción confirmada. |

### Inventario
**Descripción:** registro histórico de conteo/condición de Equipo en Servicio. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `INV-…`. |
| EQUIPO_ID, SERVICIO_ID, VERIFICADO_POR_ID | Referencias | Sí | Equipo, Servicio y Usuario existentes. |
| CONTEO_EN | Instante con zona horaria | Sí | Momento de verificación. |
| CANTIDAD_ESPERADA, CANTIDAD_OBSERVADA | Enteros | Sí | No negativos; diferencias explicables. |
| CONDICION | Dominio | No | Valores por aprobar. |
| OBSERVACIONES | Texto largo | No | No reemplazar historial previo. |
| ESTADO | Dominio | Sí | Estado de registro controlado. |

### Equipo
**Descripción:** activo individual o tipo de equipo controlado. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Único; patrón `EQP-…`. |
| NOMBRE, CATEGORIA | Texto/dominio | Sí | Catálogo aprobado. |
| NUMERO_SERIE | Texto corto | No | Único si se proporciona. |
| ESTADO | Dominio | Sí | Baja lógica conserva inventarios históricos. |

## Entidades LMS

### Curso
**Descripción:** oferta formativa versionada. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Estable; `CRS-AVSEC-001` está aprobado para demo. |
| TITULO | Texto corto | Sí | Localizable si se autoriza más de un idioma. |
| DESCRIPCION | Texto largo | No | No presentar borrador como certificación. |
| VERSION_CONTENIDO, IDIOMA | Texto corto | Sí | Fijar versión/locale; publicada e inmutable. |
| PROPIETARIO_ID | Referencia | No | Responsable editorial autorizado. |
| ESTADO | Dominio | Sí | Borrador, revisión, publicación o retiro, con valores aprobados. |
| PUBLICADO_EN | Instante con zona horaria | No | Solo se informa al publicar. |

### Unidad
**Descripción:** bloque ordenado de Curso. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Código estable `UNT-…`. |
| CURSO_ID | Referencia | Sí | Curso y versión existentes. |
| ORDEN | Entero positivo | Sí | Único en Curso/versión. |
| TITULO, OBJETIVOS | Texto/lista | Sí | Objetivos requeridos para publicar. |
| DURACION_MINUTOS | Entero | No | No negativo; estimación, no constancia. |
| ESTADO | Dominio | Sí | Estado editorial. |

### Lección
**Descripción:** contenido ordenado de una Unidad. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Código estable `LES-…`. |
| UNIDAD_ID, ORDEN | Referencia + entero positivo | Sí | Orden único dentro de Unidad/versión. |
| TITULO, TIPO, REFERENCIA_CONTENIDO | Texto/dominio/referencia | Sí | El contenido debe resolver a la misma versión. |
| DURACION_MINUTOS | Entero | No | No negativo. |
| ESTADO | Dominio | Sí | No exponer borradores a participantes. |

### Actividad
**Descripción:** acción de aprendizaje asociada a Lección. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Código estable `ACT-…`. |
| LECCION_ID, ORDEN | Referencia + entero positivo | Sí | Lección existente; orden único. |
| TIPO, REFERENCIA_CONTENIDO | Dominio/referencia | Sí | Tipo compatible con su regla de finalización. |
| OBLIGATORIA | Booleano lógico | Sí | Representación física dependiente de versión. |
| PONDERACION | Decimal | No | No negativa; suma validada si puntúa. |
| ESTADO | Dominio | Sí | Estado editorial. |

### Pregunta
**Descripción:** reactivo versionado del banco. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Código `QST-…`; no codifica clave. |
| ENUNCIADO, TIPO, IDIOMA, ESTADO | Texto/dominio | Sí | Tipo y opciones deben ser compatibles. |
| DIFICULTAD | Dominio | No | Valores por aprobar. |
| EXPLICACION | Texto largo | No | Retroalimentación controlada por política de entrega. |

### Respuesta
**Descripción:** opción/respuesta de una Pregunta. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO | Texto corto | Sí | Código de opción; la relación y unicidad se resuelven por Pregunta. |
| PREGUNTA_ID, ORDEN, TEXTO | Referencia, entero positivo, texto | Sí | Orden único por pregunta. |
| ES_CORRECTA | Booleano lógico | Sí | Clave solo en servidor; selección simple permite una correcta. |
| RETROALIMENTACION | Texto largo | No | No revelar antes del momento autorizado. |

En Fase 8 las opciones usan `A`, `B`, `C`, `D` por pregunta y no tienen código `RSP-…` propio. Resolver unicidad `(PREGUNTA, id_opción)` sin inventar códigos ni cambiar los identificadores existentes.

### BancoPreguntas
**Descripción:** conjunto versionado de Preguntas. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, CURSO_ID | Texto corto + referencia | Sí | Código estable y Curso asociado. |
| TITULO, VERSION, ESTADO | Texto/dominio | Sí | Banco publicado inmutable. |

### Evaluación
**Descripción:** configuración de quiz o examen asociada a Curso y Banco. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, CURSO_ID, BANCO_ID | Texto corto + referencias | Sí | Código `EXM-AVSEC-001` para examen demo. |
| UNIDAD_ID | Referencia | No | Si existe, pertenece al Curso. |
| TITULO, PORCENTAJE_APROBACION, ALEATORIZAR, ESTADO | Texto, decimal, booleano, dominio | Sí | Rango y política de selección deben aprobarse. |
| DURACION_MINUTOS, INTENTOS_PERMITIDOS | Enteros | No | Límites por definir; no asumir los de la demo. |

La selección de preguntas y versiones es parte del contrato de evaluación, no un arreglo mutable del intento.

### Resultado
**Descripción:** intento cerrado o en curso y su calificación. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, EVALUACION_ID, USUARIO_ID, NUMERO_INTENTO | Texto + referencias + entero | Sí | Número único por Usuario/Evaluación según política. |
| INICIADO_EN, ENTREGADO_EN | Instantes con zona horaria | Inicio sí; entrega no | Entrega única; retener si hay intento en progreso. |
| PUNTUACION, APROBADO | Decimal/booleano lógico | No | Se calcula y valida en servidor. |
| ESTADO | Dominio | Sí | Iniciado, enviado u otros aprobados. |
| VERSION_EVALUACION | Texto corto o snapshot lógico | Sí para reproducibilidad | Extensión necesaria en la integración; la estructura física requiere decisión. |

### Progreso
**Descripción:** avance de Usuario por recurso formativo. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, USUARIO_ID | Texto + referencia | Sí | Código `PRG-…`; usuario autorizado. |
| LECCION_ID, ACTIVIDAD_ID | Referencias | Exactamente uno | XOR; recurso dentro de Curso/versión vigente. |
| PORCENTAJE | Decimal | Sí | Entre 0 y 100. |
| ESTADO, ULTIMA_POSICION | Dominio + texto/referencia | Estado sí; posición no | No guardar secretos ni datos de sesión. |
| INICIADO_EN, COMPLETADO_EN | Instantes con zona horaria | No | Cronología consistente. |
| VERSION_CONTENIDO | Texto corto | Sí para sincronización | Extensión necesaria para resolver progreso obsoleto. |

### ReferenciaAPA
**Descripción:** fuente bibliográfica verificable vinculada a contenido. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, AUTOR, TITULO, ESTADO_VERIFICACION | Texto/lista | Sí | Código editorial estable; verificar fuente/licencia. |
| ANIO | Entero | No | Año conocido. |
| EDICION, EDITORIAL, DOI, URL | Texto | No | Validar formato, edición, derechos y vigencia. |
| CONSULTADA_EN | Fecha | No | Fecha de consulta, no instante de publicación. |
| CURSO_ID, UNIDAD_ID, LECCION_ID | Referencias | Exactamente un ámbito principal | Si se permite reutilización, modelar asociación. |

## Entidades de Recursos Humanos

### DocumentoRH
**Descripción:** referencia a documento laboral potencialmente sensible. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, USUARIO_ID, TIPO_DOCUMENTO | Texto/referencia/dominio | Sí | Acceso mínimo y auditado. |
| LOCALIZADOR | Referencia segura | Sí | Nunca cache público ni ruta expuesta. |
| EMITIDO_EN, VENCE_EN | Fechas | No | Vencimiento coherente con emisión. |
| CLASIFICACION, ESTADO | Dominios | Sí | Catálogos, retención y eliminación controlados. |

### Vacación
**Descripción:** solicitud de ausencia y decisión trazable. **PK lógica:** `ID`.

| Campo | Tipo lógico | Obligatorio | Regla |
|---|---|---:|---|
| CODIGO, USUARIO_ID, INICIO, FIN, SOLICITADO_EN, ESTADO | Texto/referencia/fechas/instante/dominio | Sí | Fin no anterior al inicio; política de solapamiento por aprobar. |
| APROBADOR_ID, DECIDIDO_EN, NOTA_DECISION | Referencia/instante/texto largo | No | Solo aprobador autorizado; evitar autoaprobación. |

## Asociaciones/extensiones LMS que no están entre las 23 entidades Fase 3

| Estructura lógica | Campos lógicos mínimos | Motivo / estado |
|---|---|---|
| BancoPreguntaPregunta | `BANCO_ID`, `PREGUNTA_ID`, `VERSION_BANCO`, `ORDEN`, `TEMA`, `PESO` | N:M descrita por Fase 3; columnas exactas pendientes. |
| EvaluacionPregunta | `EVALUACION_ID`, `PREGUNTA_ID`, `ORDEN`, `VERSION_PREGUNTA`, `PUNTAJE` | Preserva selección de 35 reactivos por examen; decidir si es lista fija o política reproducible. |
| RespuestaIntento | `RESULTADO_ID`, `PREGUNTA_ID`, `OPCION_ID`/respuesta, `RESPONDIDA_EN`, `PUNTAJE_OTORGADO` | Detalle de respuestas que Fase 3 identifica como faltante; aprobar retención y acceso. |

Estas estructuras no son tablas existentes ni autorización para crear objetos. Su aprobación forma parte de Fase 10.
