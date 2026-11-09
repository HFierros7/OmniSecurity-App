# Guía operativa — OmniGuard App

**Versión:** paquete demo de Fases 5–11  
**Uso:** recorrido local de demostración. No es una aplicación operativa ni un sistema de registro oficial.

## Acceso e Inicio

1. Servir la raíz del proyecto por HTTP/HTTPS; no abrir `index.html` con `file://`, ya que módulos, IndexedDB y Service Worker requieren un origen web.
2. El splash puede omitirse desde el control disponible.
3. Ingresar mediante el acceso demo. El perfil de ejemplo es ficticio para la demostración y no se valida contra un proveedor de identidad.
4. Inicio presenta el resumen y los accesos a Operaciones, Academia y Perfil. Las rutas pueden reanudarse localmente.

## Operaciones

- Consultar las tarjetas y el timeline ilustrativos; usar filtros para revisar los tipos de evento disponibles.
- Check In/Out son acciones locales de demostración, no marcajes de asistencia oficiales.
- Crear un incidente desde el formulario y, si se requiere probar la interfaz, seleccionar un adjunto. La vista previa y el Blob quedan en el navegador; no se envían a un servidor.
- Los incidentes y eventos de ejemplo no deben confundirse con reportes reales ni instrucciones vigentes.

## Academia

- El catálogo permite abrir **CERTIFICACIÓN AVSEC — OFICIAL DE SEGURIDAD AEROPORTUARIA** y recorrer sus cinco unidades, lecciones y actividades.
- Cada unidad tiene una actividad y un quiz de cinco preguntas. El examen final presenta 35 reactivos; la interfaz muestra resultados al terminar.
- Progreso, intentos y resultados se guardan localmente para la demostración. La clave y la lógica de calificación están en el cliente y pueden inspeccionarse o alterarse.
- AVSEC está en `DRAFT_REVIEW`; no acredita capacitación ni certifica competencias y no debe usarse como instrucción operacional.
- Mercancías Peligrosas y SMS se muestran como **Disponible próximamente** y no tienen contenido formativo implementado.

## Perfil

Perfil permite revisar información de demostración, calendario ilustrativo y preferencias disponibles, incluido el tema claro/oscuro. El cambio de tema se conserva en el navegador de este origen. No representa una cuenta corporativa ni un calendario laboral oficial.

## SOS

- Mantener presionado el control por el intervalo indicado por la interfaz para activar la simulación.
- Soltar antes de completarse el temporizador cancela la activación.
- La interfaz puede registrar el evento simulado en el historial local.
- SOS no llama a emergencias, no envía mensajes, no solicita ni comparte ubicación y no notifica a una central.

## Persistencia y modo offline

- La base IndexedDB de la demo se llama `omniguard-local-demo`, esquema v2. Guarda, entre otros, preferencias, navegación, actividad LMS, intentos, incidentes, evidencias locales y eventos SOS.
- Los datos viven en el perfil y origen del navegador; no se sincronizan entre equipos, no se respaldan y pueden borrarse al limpiar los datos del sitio o por políticas/cuotas del navegador.
- El Service Worker cachea recursos estáticos y ofrece navegación offline básica tras la primera carga. No hay cola de sincronización, backend ni confirmación de servidor.
- Los adjuntos pueden consumir la cuota local. No almacenar información real, personal, laboral, de seguridad, credenciales ni documentos RH.

## Soporte y límites

Para instalación de demostración, consulta `README.md`. Para decisiones de migración, usa [`MANUAL_INTEGRADOR_APEX.md`](MANUAL_INTEGRADOR_APEX.md) y el paquete `10_ENTREGA/ORACLE_APEX/`. La interfaz debe mantenerse como demo hasta que se aprueben seguridad, contenido, datos y servicios reales.
