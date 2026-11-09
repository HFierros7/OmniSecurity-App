# Mapeo conceptual de pantallas a Oracle APEX

Este mapeo es conceptual. Confirmar versión APEX, tema, autenticación e integración ORDS antes de nombrar propiedades o depender de componentes concretos. No incluye SQL, configuración exportable ni código.

| Pantalla/área | Componentes APEX candidatos | Regiones/interacciones conceptuales | Consideraciones |
|---|---|---|---|
| Login | Esquema de autenticación APEX o proveedor aprobado | Página de acceso, mensajes de error, recuperación | No crear almacenamiento de contraseñas propio ni revelar existencia de usuarios |
| Home/Inicio | Cards, regiones de contenido, navegación y badges de estado | Resumen de turno, consignas, curso, alertas | Datos filtrados por autorización; estado offline no equivale a transacción confirmada |
| Operaciones | Cards, reportes/listas, formularios | Selector de servicio, turnos, consignas, acciones | Preferir regiones/componentes nativos; validar acciones en servidor |
| Check In / Check Out | Formulario, región de confirmación, reporte de turnos | Acción autorizada, revisión de estado, respuesta | Idempotencia y autorización server-side; ubicación solo con política/consentimiento |
| SOS | Acción global, diálogo/región de estado y navegación a ayuda | Estado de envío y alternativa aprobada | No presentarlo como “enviado” sin confirmación; no depender de Dynamic Action como seguridad |
| Nuevo Incidente | Formulario, select lists, date/time y validaciones | Captura, revisión, folio y seguimiento | Límites de texto, autorización y auditoría; conservar reporte original |
| Evidencia | File Browse u opción de carga disponible en versión objetivo; reporte de adjuntos | Metadatos, validación, estado y detalle | Configurar límites, tipos, antivirus/inspección, permisos y storage fuera del alcance visual |
| Inventario | Interactive Report o reporte filtrado; formulario de inspección | Servicio, equipo, conteo y diferencias | Reportes restringidos por servicio/rol; indicadores textuales |
| Academia | Cards para catálogo; Interactive Reports para listas administrativas | Filtro de cursos, estados, versiones | Experiencia alumno distinta de mantenimiento editorial |
| Curso/Unidad/Lección | Cards, breadcrumbs/navegación, regiones de contenido y progreso | Jerarquía curricular y avance | Mostrar versión y disponibilidad; evitar regiones que expongan contenido no publicado |
| Actividad/Quiz | Formularios/regiones de preguntas | Instrucción, selección, revisión | Definir guardado, reintento y captura de respuestas en servidor |
| Evaluación | Wizard o flujo por páginas; Forms y regiones de progreso | Inicio, pregunta, revisión, entrega y resultado | Evitar mostrar claves; controlar intentos/tiempo en el servidor; probar lectores de pantalla |
| Perfil | Cards, formulario de preferencias, reportes | Datos propios, calendario, solicitudes | Datos RH/nómina requieren autorización específica; no exponer en demo pública |
| Calendario | Calendario APEX si está disponible en versión confirmada; alternativamente reporte de fechas | Filtros, detalle de eventos | Confirmar compatibilidad responsive, teclado y permisos |
| Solicitud de vacaciones | Form, validaciones de fecha y región de estado | Envío, aprobación y seguimiento | Solicitante no aprueba su propia solicitud; política de saldo proviene del sistema autorizado |
| Nómina | Reporte/descarga autenticada mediante integración aprobada | Selector de periodo, detalle y auditoría de acceso | No existe entidad/integración confirmada; datos no deben cachearse en Pages/IndexedDB |

## Componentes compartidos

- **Navegación:** Shared Components/Navigation Menu o equivalente disponible en la versión objetivo; menú no sustituye autorización.
- **Regiones y plantillas:** usar tema responsive aprobado y plantillas nativas antes de personalización.
- **Dynamic Actions:** reservarlas para comportamiento de interfaz; repetir validación de reglas críticas en servidor.
- **Autorización:** esquemas nativos de APEX aplicados a páginas, regiones y procesos, más validación server-side para cada operación.
- **Mensajes:** notificaciones APEX para estados no críticos; resultados críticos persistentes en la vista/detalle y registrados en servidor.
- **Accesibilidad:** etiquetas, orden de foco, encabezados, región de error y estados revisados en pruebas con teclado/lector de pantalla.

## GitHub Pages y separación de responsabilidades

La demo de Pages será una distribución visual independiente y plana en su raíz según el estándar IData. No debe mostrar datos reales de guardias, clientes, nómina, incidentes o evidencias. No se debe simular que Pages tiene las garantías de identidad, autorización o persistencia transaccional de APEX/ORDS. Los límites de la demo deben quedar visibles en flujos y estados.
