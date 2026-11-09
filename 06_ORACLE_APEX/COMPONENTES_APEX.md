# Mapeo UX a componentes Oracle APEX

**Estado:** alternativas conceptuales basadas en `04_UX_UI/COMPONENT_LIBRARY.md` y `ORACLE_APEX_UI_MAPPING.md`. Confirmar nombres, propiedades y disponibilidad en la versión y tema reales. Preferir componentes nativos cuando cubran el criterio.

| Necesidad UX/PWA | Componente/alternativa APEX candidata | Consideraciones de diseño y seguridad |
|---|---|---|
| Header, menú y navegación inferior/sidebar | Navigation Menu, plantilla de página y regiones compartidas | El cambio responsive puede depender del tema; menú no es autorización. |
| Cards de inicio y catálogo | Cards Region o región con tarjetas aprobadas | Mostrar estado y acción por separado; no aparentar datos reales en demo. |
| Breadcrumb Course Player | Breadcrumb / enlaces de navegación | Incluir Curso, Unidad y Lección/version; probar ruta directa y foco. |
| Catálogo y filtro | Cards + búsqueda/filtros; Faceted Search si existe en versión | Filtrar solo registros autorizados y publicados. |
| Resumen estadístico | Cards/indicadores y reportes | Definir agregación, período y alcance; separar dato real de demo. |
| Timeline de bitácora | Cards/lista ordenada + Interactive Report para consulta histórica | No editar eventos; filtros autorizados; no incluir detalles sensibles sin permiso. |
| Incidentes | Form para alta/detalle + Interactive Report o Grid para administración autorizada | Validar transiciones/actor en servidor, conservar registro original y evitar edición masiva insegura. |
| Evidencias | File Browse/carga que ofrezca la versión + región de estado/listado | Límites, MIME real, antivirus/inspección, almacenamiento, cifrado, retención y descarga autorizada pendientes. |
| Consignas | Cards/Interactive Report + Form editorial | Versiones, vigencia, publicación y acuse con auditoría; no guardar consignas demo. |
| Inventario | Interactive Report/Grid para revisión + Form para conteo | Evitar sobrescribir historia; diferencias textuales además del color. |
| Barra de progreso | Región HTML nativa/visualización de progreso disponible + valor textual accesible | Separar porcentaje confirmado de local pendiente; el cálculo agregado debe tener definición. |
| Lección y contenido | Regiones de contenido con componentes aprobados; Accordion para secciones | Escapar contenido no confiable; recursos con licencia y versiones; evitar scripts embebidos del JSON. |
| Actividad/quiz | Form/selecciones y acciones de envío controladas por servidor | Retroalimentación según regla; validar intento/version en servidor; no enviar clave al cliente. |
| Examen | Wizard o navegación por página/estado con pregunta, avance y revisión | Guardado autoritativo, límite de intentos, orden/selección versionados, entrega idempotente y clave protegida. |
| Resultado | Región de resumen, reportes por tema y navegación segura | Mostrar solo después de cierre confirmado; impedir que el participante edite puntuación. |
| Perfil y preferencias | Form autenticado + región de lectura | Minimizar datos; no almacenar contraseña; preferencia visual no concede permiso. |
| Calendario | Calendar si está disponible y accesible; alternativa Interactive Report agrupado por fecha | Filtrar por Usuario, servicio y zona horaria; no exponer calendarios de terceros. |
| Solicitudes de vacaciones | Form + reporte de estado y cola de aprobación | Separar solicitante/aprobador; validar política y saldo con sistema autorizado. |
| Confirmación/modal/bottom sheet | Dialog/modal disponible en tema; página modal alternativa | Confirmación accesible; no usar como única evidencia de transacción. |
| Toast/confirmaciones | Mensaje APEX persistente o región de notificación | Operaciones críticas muestran recibo/estado en página, no solo toast. |
| Dark Mode | Preferencia de tema soportada por la aplicación/tema confirmado | No presuponer soporte de tema oscuro completo; probar contraste y preferencia. |
| Adjuntos de audio/video/foto | Control de carga más metadatos/estado y reproductor seguro si procede | Autorización server-side, tamaño/tipo, política de captura y almacenamiento. |
| Dynamic Actions | Solo interacciones de presentación y conveniencia | No contienen la única validación de regla, autorización o integridad. |

## Principios de composición

- Un componente visible no determina autorización ni propiedad de fila.
- Reutilizar plantillas/regiones compartidas donde reduzcan duplicación sin ocultar responsabilidades.
- Mensajes críticos (SOS, marcaje, incidente, evidencia, evaluación) deben mostrar resultado persistente y comprobable.
- Accesibilidad: etiquetas, encabezados, orden de foco, mensajes de error, teclado, lector de pantalla y estados no codificados solo por color.
- Responsive: conservar jerarquía móvil, evitar tablas inoperables, probar zoom, teclado virtual y ancho real. La emulación no sustituye pruebas físicas.
- No generar una exportación APEX ni nombrar propiedades/versiones hasta confirmar el entorno.
