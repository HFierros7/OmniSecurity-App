# Diccionario de datos — OmniGuard App

## Convenciones

- Tipos y nombres son lógicos y Oracle APEX Ready; no constituyen DDL. Confirmar límites, tipos disponibles y estrategia JSON con las versiones autorizadas de Oracle Database/APEX.
- `NUMBER` es tipo sugerido para claves y cantidades; los booleanos lógicos requieren mapearse a una representación compatible con la versión confirmada.
- `TIMESTAMP WITH TIME ZONE` es el candidato para instantes; los contratos JSON expresan instantes ISO 8601 con zona horaria.
- `CLOB` es candidato para texto extenso; los archivos se representan por metadatos/localizador, no se incluyen en el diccionario como contenido binario por defecto.
- `ID`, `CREADO_EN` y `ACTUALIZADO_EN` son comunes a todas las entidades persistidas. `ACTUALIZADO_EN` puede permanecer vacío hasta la primera modificación.
- Obligatorio indica requisito de negocio propuesto, pendiente de validación.

## Campos comunes

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| ID | NUMBER | Clave técnica interna, generada por el sistema | Sí | 10042 |
| CREADO_EN | TIMESTAMP WITH TIME ZONE | Fecha/hora de creación | Sí | 2026-11-08T10:15:00-07:00 |
| ACTUALIZADO_EN | TIMESTAMP WITH TIME ZONE | Fecha/hora de última actualización | No | 2026-11-08T11:00:00-07:00 |

## Usuario

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Identificador de negocio del usuario | Sí | USR-0001 |
| NOMBRES | VARCHAR2 | Nombres de la persona | Sí | Alex |
| APELLIDOS | VARCHAR2 | Apellidos | Sí | Rivera |
| CORREO | VARCHAR2 | Correo normalizado | Según autenticación | alex@example.invalid |
| TELEFONO | VARCHAR2 | Teléfono de contacto, sujeto a consentimiento | No | +52… |
| IDENTIDAD_EXTERNA | VARCHAR2 | Identificador emitido por proveedor de identidad | Según proveedor | idp-7f2… |
| ESTADO | VARCHAR2 | Estado del perfil | Sí | ACTIVO |

## Turno

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de turno | Sí | TRN-000001 |
| USUARIO_ID | NUMBER | Persona asignada | Sí | 10042 |
| SERVICIO_ID | NUMBER | Servicio donde se realiza | Sí | 220 |
| INICIO_PLANIFICADO | TIMESTAMP WITH TIME ZONE | Inicio programado | Sí | 2026-11-08T08:00:00-07:00 |
| FIN_PLANIFICADO | TIMESTAMP WITH TIME ZONE | Fin programado | Sí | 2026-11-08T16:00:00-07:00 |
| CHECK_IN_EN | TIMESTAMP WITH TIME ZONE | Marca efectiva de entrada | No | 2026-11-08T07:58:00-07:00 |
| CHECK_OUT_EN | TIMESTAMP WITH TIME ZONE | Marca efectiva de salida | No | 2026-11-08T16:03:00-07:00 |
| CHECK_IN_UBICACION | VARCHAR2/CLOB | Ubicación o referencia geográfica autorizada | No | sitio-01 |
| CHECK_OUT_UBICACION | VARCHAR2/CLOB | Ubicación o referencia geográfica autorizada | No | sitio-01 |
| ESTADO | VARCHAR2 | Estado del turno | Sí | PROGRAMADO |

## Cliente

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de cliente | Sí | CLI-0001 |
| NOMBRE | VARCHAR2 | Nombre institucional | Sí | Cliente Demo |
| ESTADO | VARCHAR2 | Estado comercial/operativo | Sí | ACTIVO |

## Servicio

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código del servicio | Sí | SRV-0001 |
| CLIENTE_ID | NUMBER | Cliente propietario | Sí | 501 |
| NOMBRE | VARCHAR2 | Nombre operativo | Sí | Terminal Norte |
| UBICACION | VARCHAR2/CLOB | Descripción del sitio | No | Ciudad / terminal |
| ZONA_HORARIA | VARCHAR2 | Zona horaria IANA aprobada | Sí | America/Mexico_City |
| ESTADO | VARCHAR2 | Estado del servicio | Sí | ACTIVO |

## Consigna

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de consigna | Sí | CNS-0001 |
| SERVICIO_ID | NUMBER | Servicio al que aplica | Sí | 220 |
| CREADOR_ID | NUMBER | Usuario que la registra | Sí | 10042 |
| TITULO | VARCHAR2 | Resumen de instrucción | Sí | Revisión de relevo |
| DESCRIPCION | CLOB | Instrucción completa | Sí | Verificar el equipo al inicio… |
| PRIORIDAD | VARCHAR2 | Nivel operativo | Sí | NORMAL |
| VIGENTE_DESDE | TIMESTAMP WITH TIME ZONE | Inicio de vigencia | Sí | 2026-11-08T00:00:00-07:00 |
| VIGENTE_HASTA | TIMESTAMP WITH TIME ZONE | Fin de vigencia | No | 2026-11-09T00:00:00-07:00 |
| ESTADO | VARCHAR2 | Borrador, publicada, retirada, etc. | Sí | PUBLICADA |

## Incidente

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código del incidente | Sí | INC-000001 |
| SERVICIO_ID | NUMBER | Servicio afectado | Sí | 220 |
| TURNO_ID | NUMBER | Turno relacionado | No | 10051 |
| REPORTADO_POR_ID | NUMBER | Usuario que reporta | Sí | 10042 |
| ASIGNADO_A_ID | NUMBER | Usuario responsable de seguimiento | No | 10077 |
| CATEGORIA | VARCHAR2 | Clasificación aprobada | Sí | OPERATIVO |
| SEVERIDAD | VARCHAR2 | Nivel de severidad | Sí | MEDIA |
| DESCRIPCION | CLOB | Descripción del evento | Sí | Descripción sintética |
| OCURRIDO_EN | TIMESTAMP WITH TIME ZONE | Instante del evento | Sí | 2026-11-08T09:10:00-07:00 |
| ESTADO | VARCHAR2 | Estado de atención | Sí | ABIERTO |
| RESOLUCION | CLOB | Resultado o cierre | No | Pendiente de investigación |

## Bitácora

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código del evento de auditoría | Sí | LOG-000001 |
| ACTOR_ID | NUMBER | Usuario o identidad que ejecuta la acción | Sí | 10042 |
| ENTIDAD_TIPO | VARCHAR2 | Tipo de objeto afectado | Sí | INCIDENTE |
| ENTIDAD_ID | NUMBER | ID técnico del objeto afectado | Sí | 7001 |
| ACCION | VARCHAR2 | Acción registrada | Sí | ESTADO_CAMBIADO |
| OCURRIDO_EN | TIMESTAMP WITH TIME ZONE | Instante del evento | Sí | 2026-11-08T09:12:00-07:00 |
| CORRELACION_ID | VARCHAR2 | Identificador para agrupar operaciones | No | 2f9… |
| DETALLE_RESUMIDO | CLOB | Contexto no sensible | No | Asignado para revisión |

## Evidencia

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de evidencia | Sí | EVD-000001 |
| INCIDENTE_ID | NUMBER | Incidente padre, si aplica | Condicional | 7001 |
| TURNO_ID | NUMBER | Turno padre, si aplica | Condicional | 10051 |
| CARGADO_POR_ID | NUMBER | Usuario que envía | Sí | 10042 |
| TIPO_MEDIO | VARCHAR2 | Foto, video, audio u otro permitido | Sí | FOTO |
| MIME_TYPE | VARCHAR2 | Tipo de contenido validado | Sí | image/jpeg |
| NOMBRE_ORIGINAL | VARCHAR2 | Nombre original solo informativo | No | evidencia.jpg |
| TAMANO_BYTES | NUMBER | Tamaño validado | Sí | 524288 |
| SHA256 | VARCHAR2 | Huella de integridad, si se habilita | No | a4…9c |
| LOCALIZADOR | VARCHAR2/CLOB | Referencia segura al almacenamiento | Sí | ref-91… |
| CAPTURADO_EN | TIMESTAMP WITH TIME ZONE | Momento de captura declarado | No | 2026-11-08T09:10:00-07:00 |
| CARGADO_EN | TIMESTAMP WITH TIME ZONE | Momento de recepción confirmada | Sí | 2026-11-08T09:15:00-07:00 |

Regla: exactamente uno entre `INCIDENTE_ID` y `TURNO_ID`.

## Inventario

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código del registro de conteo | Sí | INV-000001 |
| EQUIPO_ID | NUMBER | Equipo contado/inspeccionado | Sí | 300 |
| SERVICIO_ID | NUMBER | Servicio de inspección | Sí | 220 |
| VERIFICADO_POR_ID | NUMBER | Usuario verificador | Sí | 10042 |
| CONTEO_EN | TIMESTAMP WITH TIME ZONE | Momento de inspección | Sí | 2026-11-08T08:10:00-07:00 |
| CANTIDAD_ESPERADA | NUMBER | Cantidad esperada | Sí | 5 |
| CANTIDAD_OBSERVADA | NUMBER | Cantidad observada | Sí | 4 |
| CONDICION | VARCHAR2 | Condición observada | No | REQUIERE_REVISION |
| OBSERVACIONES | CLOB | Nota del conteo | No | Falta una unidad |
| ESTADO | VARCHAR2 | Estado del registro | Sí | REGISTRADO |

## Equipo

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de activo o tipo de equipo | Sí | EQP-0001 |
| NOMBRE | VARCHAR2 | Nombre del equipo | Sí | Radio portátil |
| CATEGORIA | VARCHAR2 | Categoría aprobada | Sí | COMUNICACION |
| NUMERO_SERIE | VARCHAR2 | Serie del fabricante, si aplica | No | SN-DEMO-001 |
| ESTADO | VARCHAR2 | Estado del equipo | Sí | ACTIVO |

## Curso

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código temático del curso | Sí | CRS-AVSEC-001 |
| TITULO | VARCHAR2 | Nombre del curso | Sí | Fundamentos AVSEC |
| DESCRIPCION | CLOB | Resumen y público objetivo | No | Curso introductorio |
| VERSION_CONTENIDO | VARCHAR2 | Versión publicada del contenido | Sí | 1.0.0 |
| IDIOMA | VARCHAR2 | Idioma/locale | Sí | es-MX |
| PROPIETARIO_ID | NUMBER | Responsable editorial | No | 10042 |
| ESTADO | VARCHAR2 | Estado editorial | Sí | BORRADOR |
| PUBLICADO_EN | TIMESTAMP WITH TIME ZONE | Publicación efectiva | No | 2026-11-08T12:00:00-07:00 |

## Unidad

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de unidad | Sí | UNT-AVSEC-001 |
| CURSO_ID | NUMBER | Curso contenedor | Sí | 801 |
| ORDEN | NUMBER | Posición dentro del curso | Sí | 1 |
| TITULO | VARCHAR2 | Nombre de unidad | Sí | Marco general |
| OBJETIVOS | CLOB | Resultados de aprendizaje | Sí | Identificar conceptos clave |
| DURACION_MINUTOS | NUMBER | Duración estimada | No | 45 |
| ESTADO | VARCHAR2 | Estado editorial | Sí | BORRADOR |

## Lección

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de lección | Sí | LES-AVSEC-001 |
| UNIDAD_ID | NUMBER | Unidad contenedora | Sí | 811 |
| ORDEN | NUMBER | Posición en la unidad | Sí | 1 |
| TITULO | VARCHAR2 | Título | Sí | Conceptos iniciales |
| TIPO | VARCHAR2 | Tipo de recurso formativo | Sí | LECTURA |
| REFERENCIA_CONTENIDO | VARCHAR2/CLOB | Localizador/versionado del contenido | Sí | lesson/avsec/001 |
| DURACION_MINUTOS | NUMBER | Duración estimada | No | 15 |
| ESTADO | VARCHAR2 | Estado editorial | Sí | BORRADOR |

## Actividad

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de actividad | Sí | ACT-AVSEC-001 |
| LECCION_ID | NUMBER | Lección contenedora | Sí | 821 |
| ORDEN | NUMBER | Posición dentro de lección | Sí | 1 |
| TIPO | VARCHAR2 | Tipo de actividad | Sí | REFLEXION |
| REFERENCIA_CONTENIDO | VARCHAR2/CLOB | Instrucción o recurso asociado | Sí | activity/avsec/001 |
| OBLIGATORIA | BOOLEAN lógico | Si se exige para completar | Sí | Sí |
| PONDERACION | NUMBER | Peso si forma parte de calificación | No | 10.00 |
| ESTADO | VARCHAR2 | Estado editorial | Sí | BORRADOR |

## Pregunta

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de pregunta | Sí | QST-AVSEC-0001 |
| ENUNCIADO | CLOB | Pregunta o estímulo | Sí | ¿Cuál es el propósito…? |
| TIPO | VARCHAR2 | Selección simple/múltiple u otro aprobado | Sí | SELECCION_SIMPLE |
| DIFICULTAD | VARCHAR2 | Nivel editorial | No | BASICO |
| EXPLICACION | CLOB | Fundamento/retroalimentación | No | Explicación referenciada |
| IDIOMA | VARCHAR2 | Idioma/locale | Sí | es-MX |
| ESTADO | VARCHAR2 | Estado editorial | Sí | REVISION |

## Respuesta

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de opción | Sí | RSP-AVSEC-0001 |
| PREGUNTA_ID | NUMBER | Pregunta asociada | Sí | 901 |
| ORDEN | NUMBER | Orden de presentación | Sí | 1 |
| TEXTO | CLOB | Texto de opción/respuesta | Sí | Opción A |
| ES_CORRECTA | BOOLEAN lógico | Indica clave correcta | Sí | No |
| RETROALIMENTACION | CLOB | Explicación específica de la opción | No | Revisar la unidad 1 |

## BancoPreguntas

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de banco/versionado | Sí | BNK-AVSEC-001 |
| CURSO_ID | NUMBER | Curso de referencia | Sí | 801 |
| TITULO | VARCHAR2 | Nombre descriptivo | Sí | Banco AVSEC básico |
| VERSION | VARCHAR2 | Versión inmutable | Sí | 1.0.0 |
| ESTADO | VARCHAR2 | Estado editorial | Sí | BORRADOR |

La relación con preguntas se representa mediante una asociación lógica futura que podrá incluir orden, categoría y peso.

## Evaluación

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de evaluación | Sí | EXM-AVSEC-001 |
| CURSO_ID | NUMBER | Curso asociado | Sí | 801 |
| UNIDAD_ID | NUMBER | Unidad evaluada, si aplica | No | 811 |
| BANCO_ID | NUMBER | Banco/versionado de origen | Sí | 911 |
| TITULO | VARCHAR2 | Nombre de evaluación | Sí | Evaluación final AVSEC |
| DURACION_MINUTOS | NUMBER | Tiempo límite, si aplica | No | 30 |
| PORCENTAJE_APROBACION | NUMBER | Umbral porcentual | Sí | 80.00 |
| INTENTOS_PERMITIDOS | NUMBER | Límite de intentos | No | 2 |
| ALEATORIZAR | BOOLEAN lógico | Aleatorizar preguntas/opciones | Sí | Sí |
| ESTADO | VARCHAR2 | Estado editorial | Sí | BORRADOR |

## Resultado

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de intento/resultado | Sí | RES-000001 |
| EVALUACION_ID | NUMBER | Evaluación y versión ejecutada | Sí | 921 |
| USUARIO_ID | NUMBER | Persona evaluada | Sí | 10042 |
| NUMERO_INTENTO | NUMBER | Secuencia de intento | Sí | 1 |
| INICIADO_EN | TIMESTAMP WITH TIME ZONE | Inicio del intento | Sí | 2026-11-08T13:00:00-07:00 |
| ENTREGADO_EN | TIMESTAMP WITH TIME ZONE | Entrega/cierre | No | 2026-11-08T13:20:00-07:00 |
| PUNTUACION | NUMBER | Resultado numérico | No | 86.50 |
| APROBADO | BOOLEAN lógico | Cumplió el umbral | No | Sí |
| ESTADO | VARCHAR2 | Estado del intento | Sí | COMPLETADO |

## Progreso

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código del registro de progreso | Sí | PRG-000001 |
| USUARIO_ID | NUMBER | Persona aprendiz | Sí | 10042 |
| LECCION_ID | NUMBER | Lección objetivo, alternativa a actividad | Condicional | 821 |
| ACTIVIDAD_ID | NUMBER | Actividad objetivo, alternativa a lección | Condicional | 831 |
| PORCENTAJE | NUMBER | Avance de 0 a 100 | Sí | 60.00 |
| ESTADO | VARCHAR2 | Estado de avance | Sí | EN_PROGRESO |
| ULTIMA_POSICION | VARCHAR2/CLOB | Última posición reanudable no sensible | No | sección-3 |
| INICIADO_EN | TIMESTAMP WITH TIME ZONE | Inicio del recurso | No | 2026-11-08T13:00:00-07:00 |
| COMPLETADO_EN | TIMESTAMP WITH TIME ZONE | Finalización | No | 2026-11-08T13:30:00-07:00 |

Regla: exactamente uno entre `LECCION_ID` y `ACTIVIDAD_ID`.

## DocumentoRH

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código documental | Sí | DHR-000001 |
| USUARIO_ID | NUMBER | Persona relacionada | Sí | 10042 |
| TIPO_DOCUMENTO | VARCHAR2 | Categoría RH autorizada | Sí | IDENTIFICACION |
| LOCALIZADOR | VARCHAR2/CLOB | Referencia segura al archivo | Sí | rh-ref-91… |
| EMITIDO_EN | DATE | Fecha de emisión | No | 2026-01-15 |
| VENCE_EN | DATE | Fecha de vencimiento | No | 2027-01-15 |
| CLASIFICACION | VARCHAR2 | Nivel de sensibilidad | Sí | CONFIDENCIAL |
| ESTADO | VARCHAR2 | Estado del documento | Sí | VIGENTE |

## Vacación

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de solicitud | Sí | VAC-2026-0001 |
| USUARIO_ID | NUMBER | Solicitante | Sí | 10042 |
| INICIO | DATE | Primer día solicitado | Sí | 2026-12-10 |
| FIN | DATE | Último día solicitado | Sí | 2026-12-15 |
| SOLICITADO_EN | TIMESTAMP WITH TIME ZONE | Instante de envío | Sí | 2026-11-08T14:00:00-07:00 |
| ESTADO | VARCHAR2 | Estado de aprobación | Sí | PENDIENTE |
| APROBADOR_ID | NUMBER | Usuario autorizado que decide | No | 10077 |
| DECIDIDO_EN | TIMESTAMP WITH TIME ZONE | Instante de decisión | No | 2026-11-09T09:00:00-07:00 |
| NOTA_DECISION | CLOB | Nota restringida del flujo | No | Aprobada conforme a cobertura |

## ReferenciaAPA

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|---|
| CODIGO | VARCHAR2 | Código de referencia | Sí | REF-AVSEC-001 |
| AUTOR | VARCHAR2/CLOB | Persona u organización autora | Sí | Organización Demo |
| ANIO | NUMBER | Año de publicación | No | 2024 |
| TITULO | VARCHAR2/CLOB | Título de la fuente | Sí | Manual de referencia |
| EDICION | VARCHAR2 | Edición o versión | No | 3.ª edición |
| EDITORIAL | VARCHAR2 | Editor o entidad publicadora | No | Editorial Demo |
| DOI | VARCHAR2 | Identificador DOI | No | 10.xxxx/demo |
| URL | VARCHAR2/CLOB | URL de acceso | No | https://example.invalid/recurso |
| CONSULTADA_EN | DATE | Fecha de consulta | No | 2026-11-08 |
| CURSO_ID | NUMBER | Curso principal, alternativa a unidad/lección | Condicional | 801 |
| UNIDAD_ID | NUMBER | Unidad principal | Condicional | 811 |
| LECCION_ID | NUMBER | Lección principal | Condicional | 821 |
| ESTADO_VERIFICACION | VARCHAR2 | Estado de verificación editorial | Sí | PENDIENTE |

Regla: seleccionar exactamente un ámbito principal entre curso, unidad y lección, salvo que se apruebe una asociación reutilizable.
