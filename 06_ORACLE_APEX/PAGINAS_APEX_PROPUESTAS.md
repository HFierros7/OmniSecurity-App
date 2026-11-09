# Páginas Oracle APEX propuestas

**Estado:** mapa funcional; son nombres lógicos, no números de página, configuración exportable ni disponibilidad confirmada en una versión APEX específica. Confirmar versión, tema y navegación antes de implementar.

## Mapa de páginas

| Página lógica | Propósito | Componentes candidatos | Navegación / acceso |
|---|---|---|---|
| Acceso | Iniciar y terminar sesión mediante el mecanismo aprobado. | Página de acceso nativa, mensajes accesibles, recuperación según proveedor. | Entrada pública; éxito → Inicio; no revela si existe una cuenta. |
| Inicio / Dashboard | Mostrar contexto autorizado, turno, avisos y accesos. | Cards, estados/badges, lista de actividad. | Destino tras autenticación; Inicio, Operaciones, Academia, Perfil. |
| Operaciones | Concentrar tareas por servicio/turno. | Cards, selector de contexto, reportes/listas. | Navegación principal → Turnos, Consignas, Incidentes, Evidencias e Inventario. |
| Turnos | Consultar turnos propios y su estado. | Reporte filtrado, detalle y región de acción. | Operaciones → detalle → Check In/Out autorizados. |
| Confirmar marcaje | Revisar y solicitar entrada o salida. | Formulario/diálogo, validaciones y recibo persistente. | Solo desde turno elegible; respuesta del servidor decide estado confirmado. |
| Consignas | Consultar instrucciones vigentes del Servicio autorizado. | Cards/lista, detalle, vigencia y acuse si se define. | Operaciones → Servicio → consigna; proteger contenido y versiones. |
| Bitácora | Consultar eventos propios/autorizados en orden cronológico. | Timeline conceptual con filtros y detalle. | Operaciones → Bitácora; acceso filtrado por autorización y ámbito. |
| Incidentes | Consultar casos según rol. | Reporte/Interactive Report o lista, filtros y estado. | Operaciones → Incidentes → detalle. |
| Nuevo incidente / Detalle | Crear reporte o consultar/gestionar uno existente. | Form, Select Lists, fechas, validaciones, mensajes y región de auditoría. | Creación para usuario autorizado; edición/cierre según rol y transición permitida. |
| Evidencias | Adjuntar y consultar metadatos/estado de carga. | Carga de archivo disponible en la versión objetivo, preview y reporte de adjuntos. | Desde incidente/turno autorizado; archivo protegido fuera de Pages/cache pública. |
| Inventario | Consultar historial y registrar verificación si el rol lo permite. | Interactive Report o Grid, formulario de conteo y diferencias. | Operaciones → Servicio → equipo/registro. |
| Academia | Mostrar cursos disponibles, estado y avance. | Cards, búsqueda/filtro opcional, barra de progreso. | Navegación principal → ficha de Curso. MP y SMS se muestran como próximos, sin contenido no aprobado. |
| Curso | Presentar descripción, versión, prerequisitos y unidades. | Cards, breadcrumbs, resumen y progreso. | Academia → Curso → Unidad. |
| Unidad / Lección | Navegar contenido, objetivos, actividad y referencias. | Índice/árbol, regiones de contenido, breadcrumb y navegación anterior/siguiente. | Curso → Unidad → Lección → Actividad; estado/versiones visibles. |
| Actividad / Quiz de práctica | Capturar interacción formativa y guardar su estado. | Formulario de respuesta, opciones accesibles y retroalimentación al momento permitido. | Lección → Actividad/Quiz → resultado de práctica. No usar la evaluación cliente como autoridad. |
| Evaluación / Examen | Ejecutar una evaluación versionada con control de intentos. | Wizard o flujo por preguntas, indicador de progreso, revisión y confirmación de entrega. | Curso → Evaluación; verificar asignación, versión e intentos en servidor. |
| Resultado | Mostrar calificación y retroalimentación autorizada del intento. | Región de resultado, resumen y desglose temático autorizado. | Después de entrega confirmada; disponible al Usuario y roles autorizados. |
| Perfil / Preferencias | Consultar datos propios y preferencias permitidas. | Form de perfil y preferencias, calendario/resumen según autorización. | Navegación principal → Perfil; nunca muestra datos de terceros por defecto. |
| Calendario | Mostrar turnos propios y eventos formativos permitidos. | Calendar candidato si existe en versión confirmada; alternativa reporte por fecha. | Perfil → Calendario; permisos y zona horaria explícitos. |
| Solicitud de vacaciones | Capturar solicitud y mostrar folio/estado. | Form, validaciones de fecha y región de estado/aprobación. | Perfil → solicitud; aprobación separada por rol autorizado. Alcance y reglas pendientes. |
| Administración académica | Mantener versiones de curso, unidad, lección, pregunta y evaluación. | Reportes/forms de mantenimiento, revisión/publicación controlada. | Solo rol editorial aprobado; no forma parte del catálogo de alumno. |
| Administración operativa | Mantener catálogos y asignaciones autorizadas. | Reportes/forms sujetos a decisión de alcance y rol. | No exponer a usuario general; confirmar sistemas maestros y responsables. |

## Flujo de navegación

`Acceso → Inicio → (Operaciones | Academia | Perfil)`

- **Operaciones:** Operaciones → turno/servicio → tarea → confirmación o estado verificable.
- **Incidente:** Operaciones → Incidentes → Nuevo/Detalle → evidencia → folio/estado.
- **Academia:** Academia → Curso/versión → Unidad → Lección → Actividad/Quiz → Evaluación → Resultado.
- **Perfil:** Perfil → Preferencias / Calendario / Solicitud, sujeto a datos y políticas aprobados.

Los destinos no autorizados deben rechazarse también por URL directa y procesamiento servidor, no únicamente ocultarse del menú. Mantener el regreso al contexto sin exponer datos sensibles en parámetros/URLs.

## Decisiones previas a configurar páginas

- Confirmar versión Oracle Database, APEX, ORDS (si aplica), tema y autenticación disponible.
- Aprobar roles, filtros por persona/servicio, catálogo de estados y propiedad de los datos.
- Definir reglas de transacción y mensajes de error/confirmación de asistencia, SOS, incidentes, adjuntos y evaluaciones.
- Validar accesibilidad de teclado/lector de pantalla y responsive en la versión APEX objetivo.
- Las funciones Nómina y DocumentosRH aparecen en documentación conceptual pero no tienen integración ni fuente confirmadas; no se proponen como páginas productivas en esta fase.
