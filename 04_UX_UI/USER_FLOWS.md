# OmniGuard App — User Flows

## Convenciones

- **Actor principal:** Usuario de demostración, guardia operativo demo `DEMO-0001`; confirmar identidad/roles antes de producción.
- **Contexto de demostración proporcionado:** Cliente de demostración - Ubicación demo. Confirmar autorización de uso de nombre e identidad del cliente antes de una publicación pública.
- Los flujos son especificaciones UX. Un estado “pendiente offline” no equivale a operación aceptada.
- No incluir datos personales reales en una demo de GitHub Pages.

## Login

- **Objetivo:** ingresar de forma segura a la aplicación.
- **Actor:** Carlos.
- **Inicio:** abre la PWA y elige iniciar sesión.
- **Decisión:** ¿identidad autenticada y cuenta autorizada? Sí: continuar a Inicio. No: conservar el acceso bloqueado.
- **Resultado:** sesión válida o mensaje de recuperación/soporte sin revelar si una cuenta existe.
- **Errores posibles:** conexión, credenciales, cuenta inactiva, expiración o proveedor no disponible. No guardar contraseñas en IndexedDB.

## Check-In

- **Objetivo:** registrar inicio de turno asignado.
- **Actor:** Carlos.
- **Inicio:** Inicio u Operaciones → turno vigente → Check In.
- **Decisión:** ¿turno válido, sin entrada previa y dentro de política? ¿se requiere/autoriza ubicación?
- **Resultado:** recibo confirmado por servidor con hora/servicio; si solo se almacena localmente, mostrar “Pendiente de sincronización”.
- **Errores posibles:** no hay turno, duplicado, ubicación no disponible, ventana inválida, red o servidor caído.

## Check-Out

- **Objetivo:** cerrar turno activo.
- **Actor:** Carlos.
- **Inicio:** turno con Check In → Check Out.
- **Decisión:** ¿turno abierto y salida permitida? ¿hay actividades pendientes que deban notificarse?
- **Resultado:** salida confirmada y turno cerrado.
- **Errores posibles:** no existe turno abierto, ya cerrado, conflicto de datos o conectividad; no repetir la operación sin idempotencia.

## SOS

- **Objetivo:** solicitar asistencia bajo protocolo operativo.
- **Actor:** Carlos.
- **Inicio:** acción SOS siempre localizable en contexto autenticado.
- **Decisión:** al activar, ¿el canal de emergencia está disponible y el usuario está autorizado? La confirmación adicional y cancelación deben definirse con seguridad operacional.
- **Resultado:** estado “Enviado/recibido” solo con confirmación; de otro modo “No enviado” y procedimiento alternativo.
- **Errores posibles:** offline, servicio de alerta caído, ubicación denegada o destinatario no configurado. No mostrar éxito ni depender de una animación.

## Nuevo Incidente

- **Objetivo:** reportar un evento operativo.
- **Actor:** Carlos.
- **Inicio:** Operaciones → Incidentes → Nuevo.
- **Decisión:** ¿servicio, categoría, hora y descripción cumplen reglas? ¿adjuntar evidencia ahora o después?
- **Resultado:** folio y estado confirmado; reintentos deduplicados.
- **Errores posibles:** campos faltantes, permiso insuficiente, servicio inactivo, red o envío duplicado.

## Adjuntar Evidencia

- **Objetivo:** vincular foto, video o audio a incidente/turno.
- **Actor:** Carlos.
- **Inicio:** detalle autorizado → Adjuntar → seleccionar tipo y origen.
- **Decisión:** ¿permiso concedido, formato/tamaño aceptados y expediente válido? ¿hay conexión para subir?
- **Resultado:** evidencia recibida o claramente pendiente en cola; metadatos visibles.
- **Errores posibles:** permiso de cámara/micrófono, archivo inválido, límite, almacenamiento, red interrumpida. Evitar exposición en cache y confirmar recepción.

## Continuar Curso

- **Objetivo:** reanudar aprendizaje desde el último recurso válido.
- **Actor:** Carlos.
- **Inicio:** Academia → curso asignado → Continuar.
- **Decisión:** ¿curso y contenido están vigentes? ¿progreso local coincide con la versión del servidor?
- **Resultado:** lección abierta, progreso actualizado o marcado pendiente de sincronizar.
- **Errores posibles:** curso retirado, paquete offline obsoleto, prerequisito o conflicto; preservar avance confirmado y explicar qué requiere conexión.

## Responder Examen

- **Objetivo:** completar una evaluación autorizada.
- **Actor:** Carlos.
- **Inicio:** Curso → Evaluación → Revisar reglas → Iniciar.
- **Decisión:** ¿hay intentos disponibles, versión actual y condiciones de conexión requeridas? ¿entregar o volver a revisar?
- **Resultado:** intento cerrado y resultado oficial confirmado; mostrar retroalimentación permitida.
- **Errores posibles:** sesión expirada, cierre, tiempo agotado, desconexión, versión retirada o límite de intentos. Nunca revelar clave de respuesta ni declarar calificación final sin autoridad del servidor.

## Solicitar Vacaciones

- **Objetivo:** enviar solicitud de ausencia.
- **Actor:** Carlos.
- **Inicio:** Perfil o Calendario → Vacaciones → Nueva solicitud.
- **Decisión:** ¿intervalo válido, política abierta y saldo disponible verificado? ¿enviar?
- **Resultado:** folio pendiente de aprobación; una aceptación local no equivale a autorización.
- **Errores posibles:** solapamiento, periodo cerrado, falta de saldo/datos, permiso o conectividad. No inferir saldo.

## Consultar Nómina

- **Objetivo:** consultar recibos o periodos de nómina propios.
- **Actor:** Carlos.
- **Inicio:** Perfil → Nómina, solo si el servicio autorizado está integrado.
- **Decisión:** ¿autenticación reforzada/permisos vigentes y datos disponibles para el periodo? ¿abrir/descargar?
- **Resultado:** información propia mostrada con periodo, fecha y procedencia; no se guarda en cache offline ni en la demo pública.
- **Errores posibles:** integración RH no disponible, periodo inexistente, autorización denegada o sesión expirada; mostrar mensaje genérico y canal de soporte.
- **Pendiente:** nómina no está en el modelo de entidades ni en los casos de uso de Fase 3; definir sistema fuente, autorización, retención y alcance antes de diseñarla o implementarla.
