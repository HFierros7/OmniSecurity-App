# Mapa de navegación — OmniGuard App

## Flujo de entrada

**Login → Home → Inicio**

- **Login:** autenticación mediante mecanismo aprobado; errores, recuperación y cierre de sesión según política.
- **Home:** punto de entrada después de autenticar, muestra contexto autorizado, avisos vigentes y accesos a módulos.
- **Inicio:** resumen personal de turno, estado de check-in/out, consignas recientes, alertas y accesos operativos permitidos.

Home y los módulos protegidos requieren sesión válida. Una URL directa debe aplicar las mismas autorizaciones que la navegación visible.

## Navegación principal desde Home

### Inicio

Home → Inicio → resumen personal → detalle de turno/consigna/incidente/curso → acción autorizada → resultado/confirmación → regreso al contexto anterior.

- Accesos: estado del turno, Check In/Check Out cuando proceda, consignas vigentes, incidentes propios/autorizados y cursos asignados.
- SOS se mantiene como acción de acceso rápido dentro de la aplicación autenticada conforme a la política aprobada; su estado de envío debe ser visible.

### Operaciones

Home → Operaciones → seleccionar servicio o turno → elegir tarea:

- **Turnos:** listado propio → detalle → Check In o Check Out → confirmación.
- **Consignas:** vigentes del servicio → detalle → acuse de lectura si corresponde.
- **Incidentes:** lista autorizada → detalle → registrar incidente o actualizar estado según permiso → adjuntar evidencia → confirmación/folio.
- **Evidencias:** seleccionar incidente/turno → elegir foto, video o audio → revisión → carga → estado recibido/pendiente/error.
- **Inventario:** seleccionar servicio → equipos → conteo/condición → registrar observación si el rol lo permite → confirmación.
- **SOS:** acción rápida → verificación/confirmación según diseño aprobado → estado verificable o procedimiento alternativo.

### Academia

Home → Academia → catálogo/asignaciones → curso → unidades → lecciones → actividades → progreso → evaluación → resultado.

- **Curso:** ficha, versión, prerequisitos y objetivos.
- **Unidad:** secuencia de lecciones y avance agregado.
- **Lección:** contenido y referencias.
- **Actividad:** instrucciones, ejecución y criterio de finalización.
- **Evaluación:** reglas e intentos → ejecución → entrega → resultado/retroalimentación autorizada.
- **Progreso:** avance por lección/actividad y estado de sincronización.
- Si el contenido está disponible offline, indicar versión y fecha; impedir que una copia antigua altere una evaluación ya cerrada sin política de conciliación.

### Perfil

Home → Perfil → datos personales permitidos / documentos RH autorizados / calendario / solicitudes / preferencias / cerrar sesión.

- **Calendario:** turnos propios, eventos formativos y solicitudes propias permitidas; detalle sujeto a autorización.
- **Vacaciones:** consultar reglas disponibles → crear solicitud → revisar folio/estado → consultar decisión.
- **Documentos RH:** solo para usuario y roles autorizados; no incluir en publicación Pages ni cache web pública.
- **Preferencias:** idioma y accesibilidad, sin sustituir políticas de autorización.
- **Cerrar sesión:** invalidar sesión conforme al proveedor; limpiar datos locales sensibles que la política determine.

## Navegación global y estados

- Navegación persistente hacia Inicio, Operaciones, Academia y Perfil; ocultar o deshabilitar accesos no autorizados sin depender de ello como control de seguridad.
- Mantener título, contexto de servicio/curso y ruta de regreso en vistas de detalle.
- Proteger rutas directas; al expirar sesión, solicitar autenticación y preservar solo una ruta de retorno no sensible.
- Mostrar estados consistentes: cargando, vacío, sin conexión, pendiente de sincronización, error y confirmado.
- No señalar como confirmado un Check In/Out, SOS, incidente, evidencia o solicitud hasta recibir confirmación autoritativa.
- Accesibilidad: navegación con teclado/táctil, foco comprensible, etiquetas accesibles, contraste y mensajes no basados solo en color.

## Decisiones pendientes

Confirmar roles/permisos, menú por perfil, soporte de múltiples servicios, acciones SOS, política offline, visibilidad de calendario, aprobación de vacaciones y mecanismo de autenticación APEX.
