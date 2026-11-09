# Casos de uso — OmniGuard App

## Actor y alcance

- **Actor de referencia:** Usuario de demostración, usuario representativo.
- Su función organizacional, permisos, servicio asignado y relación laboral deben confirmarse; no se presuponen por el nombre.
- **Sistema principal:** OmniGuard App, PWA preparada para futura integración Oracle APEX.
- Los flujos describen comportamiento funcional, no pantallas ni código. Las acciones sensibles requieren autorización del servidor.

## UC-01 — Login

- **Actor:** Carlos.
- **Precondición:** cuenta activa y proveedor de identidad/configuración de autenticación disponible.
- **Flujo principal:** abre la aplicación; inicia autenticación mediante el mecanismo aprobado; el sistema valida identidad y autorización; presenta Home y su contexto permitido.
- **Alternos/errores:** credenciales inválidas, cuenta bloqueada, sesión expirada o conectividad no disponible; no revelar si una cuenta existe; no permitir acceso autenticado offline sin decisión de seguridad explícita.
- **Resultado:** sesión controlada; no se guardan contraseñas en el perfil local.

## UC-02 — Check In

- **Actor:** Carlos.
- **Precondición:** sesión activa y turno asignado que admita marcaje.
- **Flujo principal:** consulta turno/servicio; solicita entrada; revisa la hora y ubicación que se registrarán; confirma; recibe confirmación persistente.
- **Alternos/errores:** turno inexistente, duplicado, fuera de ventana, ubicación no disponible o servidor no alcanzable; no informar éxito hasta obtener confirmación o identificar claramente una marca pendiente.
- **Resultado:** marca de entrada vinculada al turno, actor e instante.

## UC-03 — Check Out

- **Actor:** Carlos.
- **Precondición:** turno con check-in previo y aún abierto.
- **Flujo principal:** abre turno activo; solicita salida; revisa los datos; confirma; obtiene confirmación.
- **Alternos/errores:** no existe turno abierto, ya se cerró o no hay conexión; presentar estado real y no duplicar la marca.
- **Resultado:** turno cerrado con marca de salida y trazabilidad.

## UC-04 — Consultar Consignas

- **Actor:** Carlos.
- **Precondición:** sesión activa y acceso al servicio correspondiente.
- **Flujo principal:** selecciona servicio/turno; consulta consignas vigentes; abre detalle y confirma lectura cuando se requiera.
- **Alternos/errores:** sin servicio asignado, sin consignas, información vencida o cache offline desactualizado; mostrar vigencia y fecha de actualización.
- **Resultado:** visualización registrada cuando la política exija acuse.

## UC-05 — Activar SOS

- **Actor:** Carlos.
- **Precondición:** usuario autorizado; reglas de emergencia, destinatarios y canales aprobados.
- **Flujo principal:** activa la acción SOS; confirma si el diseño lo exige sin introducir demora indebida; el sistema envía la alerta al canal configurado y muestra entrega/estado verificable.
- **Alternos/errores:** red o servicio de alerta no disponible; mostrar claramente “no enviado”, ofrecer el procedimiento alternativo aprobado y conservar evidencia del intento sin afirmar que hubo ayuda.
- **Resultado:** alerta trazable al usuario y contexto operativo.
- **Riesgo crítico:** destinatario, escalamiento, geolocalización, pruebas, falsos positivos y obligación de respuesta requieren definición operativa antes de habilitarlo.

## UC-06 — Registrar Incidente

- **Actor:** Carlos.
- **Precondición:** sesión activa y permiso para reportar en el servicio.
- **Flujo principal:** inicia reporte; selecciona servicio/turno; captura categoría, severidad, hora y descripción; revisa; envía; recibe folio y estado.
- **Alternos/errores:** campos incompletos, severidad no autorizada, envío fallido o repetido; validar en cliente y servidor, idempotencia para reintentos y estado pendiente claramente señalado.
- **Resultado:** incidente creado sin alterar el contenido original en ediciones posteriores.

## UC-07 — Adjuntar Foto

- **Actor:** Carlos.
- **Precondición:** incidente o turno con permiso para adjuntar; cámara/archivo autorizado.
- **Flujo principal:** selecciona o captura foto; revisa vista previa; acepta; carga; el sistema valida formato/tamaño y confirma almacenamiento.
- **Alternos/errores:** permiso denegado, archivo inválido, carga parcial o falta de conexión; no exponer archivo antes de autorización.
- **Resultado:** evidencia fotográfica referenciada al expediente.

## UC-08 — Adjuntar Video

- **Actor:** Carlos.
- **Precondición:** permiso, incidente/turno válido y límites de video definidos.
- **Flujo principal:** selecciona/captura video; revisa; confirma carga; consulta estado de procesamiento y recepción.
- **Alternos/errores:** archivo excede límites, formato no permitido, carga interrumpida o almacenamiento no disponible; permitir reintento seguro y mostrar progreso/estado.
- **Resultado:** video validado asociado al expediente.

## UC-09 — Adjuntar Audio

- **Actor:** Carlos.
- **Precondición:** permiso y autorización de captura/grabación conforme a política.
- **Flujo principal:** selecciona o graba audio; revisa; confirma; el sistema valida y carga.
- **Alternos/errores:** micrófono denegado, formato/duración inválidos o falta de conectividad; informar sin iniciar grabación inadvertida.
- **Resultado:** evidencia de audio con actor, fecha y referencia del caso.

## UC-10 — Consultar Inventario

- **Actor:** Carlos.
- **Precondición:** sesión activa y acceso al servicio/equipos.
- **Flujo principal:** selecciona servicio; consulta equipos, conteos y estado; filtra o abre detalle.
- **Alternos/errores:** servicio sin inventario o datos desactualizados; indicar momento de actualización y si la información es local.
- **Resultado:** consulta auditada cuando lo requiera la política.

## UC-11 — Tomar Curso

- **Actor:** Carlos.
- **Precondición:** sesión, asignación o inscripción válida; curso publicado disponible.
- **Flujo principal:** abre Academia; selecciona curso; revisa objetivos; navega unidades y lecciones; realiza actividades; el sistema registra avance.
- **Alternos/errores:** prerrequisitos pendientes, contenido retirado, progreso incompatible o modo offline; explicar el bloqueo y conservar solo progreso permitido.
- **Resultado:** avance asociado al usuario y a una versión del curso.

## UC-12 — Realizar Evaluación

- **Actor:** Carlos.
- **Precondición:** evaluación publicada, habilitada y con intentos disponibles.
- **Flujo principal:** revisa reglas; inicia intento; responde; entrega; recibe resultado y retroalimentación autorizada.
- **Alternos/errores:** sesión expirada, cierre de página, tiempo agotado o conectividad interrumpida; aplicar política de recuperación/versionado e informar el estado real.
- **Resultado:** resultado inmutable del intento; clave de respuesta no se expone antes o durante la prueba.

## UC-13 — Consultar Calendario

- **Actor:** Carlos.
- **Precondición:** sesión activa.
- **Flujo principal:** abre calendario; filtra turnos, cursos/fechas y solicitudes propias permitidas; consulta detalle y zona horaria.
- **Alternos/errores:** datos parciales/desactualizados o falta de permisos; indicar origen y fecha de sincronización.
- **Resultado:** vista consolidada sin exponer calendarios de terceros no autorizados.

## UC-14 — Solicitar Vacaciones

- **Actor:** Carlos.
- **Precondición:** usuario activo; política y periodo de solicitud configurados.
- **Flujo principal:** abre Perfil/Calendario; selecciona intervalo; revisa saldo/reglas disponibles; envía; recibe folio y estado.
- **Alternos/errores:** intervalo inválido, solapamiento, periodo cerrado o falta de información de saldo; bloquear o marcar validación pendiente según política, sin inventar disponibilidad.
- **Resultado:** solicitud pendiente de decisión por rol autorizado; aprobación no la realiza el propio solicitante salvo regla formal.

## Reglas transversales

- Toda operación que cambie datos debe identificar actor, instante, resultado y correlación.
- Diferenciar guardado local pendiente de aceptación confirmada por servidor.
- Geolocalización, multimedia y datos laborales requieren aviso, finalidad, consentimiento/base aplicable, retención y acceso mínimo.
- Estados de error y confirmación deben ser inequívocos; no presentar éxito tras una falla.
