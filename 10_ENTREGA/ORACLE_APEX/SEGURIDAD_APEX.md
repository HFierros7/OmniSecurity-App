# Seguridad propuesta para Oracle APEX

**Estado:** lineamientos y decisiones pendientes; no se eligió proveedor de identidad, no hay instancia Oracle/APEX accesible verificada y no se presume Entra ID, OAuth, SSO ni otro mecanismo.

## Identidad y autenticación

- La autenticación debe ser gestionada por el mecanismo aprobado para el ambiente objetivo y configurado en la plataforma/entorno APEX confirmado.
- Confirmar si el proveedor será local, corporativo, federado u otro; definir MFA, recuperación, bloqueo, expiración, revocación y soporte con el responsable de identidad.
- No almacenar contraseñas en tablas de Usuario, JSON, IndexedDB, logs, enlaces ni exportaciones.
- Vincular el perfil funcional con la identidad mediante un identificador externo opaco cuando exista; `DEMO-0001` es un dato demo, no prueba de autenticación ni permiso.
- No habilitar sesión operativa offline por defecto. Decidir qué contenido no sensible puede leerse offline, cuánto tiempo y cómo se revoca.

## Autorización y perfiles funcionales

La documentación de Fase 3 no define roles aprobados. Los perfiles siguientes son **necesidades de acceso candidatas**, no roles finales ni una matriz de privilegios aprobada:

| Perfil candidato | Acceso que debe definirse y probarse |
|---|---|
| Usuario operativo | Datos propios, turnos/consignas del servicio asignado, creación de incidente y consulta/avance de cursos asignados. |
| Supervisor/responsable | Seguimiento de incidentes, consignas, evidencias e inventario del ámbito autorizado; acciones de estado sujetas a política. |
| Aprendiz | Contenido publicado/asignado, progreso propio, intentos y resultados propios. |
| Editor/revisor académico | Crear/revisar contenido no publicado; no otorgar publicación final automáticamente. |
| Publicador académico | Aprobar y publicar versiones; separación de funciones por acordar. |
| Aprobador de vacaciones/RH | Resolver solicitudes/datos RH solo si estos módulos entran en alcance y existe autoridad aprobada. |
| Administrador de aplicación | Configuración técnica sin acceso implícito a contenido RH/operativo que no necesite. |

La asignación de personas, grupos, servicios y privilegios requiere aprobación de Seguridad, Operación, RH y responsable de aplicación. Aplicar mínimo privilegio y separación de funciones; el perfil de ejemplo Carlos no determina autorización.

## Aplicación de autorización

- Validar autorización en servidor en cada página, región con datos, proceso, descarga y operación; ocultar botones/menú solo mejora UX.
- Limitar filas por identidad, Servicio y función autorizada. Probar acceso directo a registros ajenos y cambios de `ID`/código enviados por el cliente.
- Validar las transiciones de Turno, Incidente, Consigna, Vacación y Evaluación en servidor. Repetir validaciones de integridad aun si la pantalla ya las ejecuta.
- Calcular calificación, aprobar intentos y registrar cierre en la capa confiable; no aceptar respuestas, porcentaje o estado enviado por navegador como resultado autoritativo.
- No exponer `ES_CORRECTA`, explicación reservada ni clave del banco en JSON, JavaScript, URL, caché pública o respuesta entregada antes del momento permitido. El banco actual de Fase 8 sí incluye claves y es solo demo.
- Proteger cargas y descargas de Evidencia/DocumentoRH mediante permisos por objeto; no usar nombre de archivo como ruta ni exponer localizadores.

## Información y privacidad

Clasificar y limitar acceso a:

- Datos personales y externos de Usuario, correo/teléfono/identidad.
- Turnos, localización de marcajes, cliente, servicio y consignas.
- Incidentes, reportes originales, asignaciones y bitácora.
- Evidencia multimedia, metadatos y archivos.
- DocumentosRH y solicitudes/decisiones de Vacación.
- Intentos, respuestas y resultados de aprendizaje individual.

Para cada categoría definir finalidad, minimización, base jurídica/consentimiento, retención, rectificación, eliminación, auditoría y exportación. No usar nombres/datos reales en Pages, ejemplos o caches PWA.

## Sesión, transporte y configuración

- Confirmar políticas de sesión, cookies, protección CSRF, HTTPS, cabeceras, límites de carga, expiración y gestión de errores con versiones reales.
- Usar configuración separada por ambiente y mecanismos aprobados para secretos; nunca incorporar secretos en exportación APEX, JavaScript, repositorio o documentación de entrega.
- No asumir un endpoint REST/ORDS. Si se autoriza integración, documentar contrato, autenticación, permisos, límites, errores, timeout, reintento seguro, idempotencia, versionado y monitoreo.
- No confiar en CORS o en el ocultamiento de páginas como control de acceso.

## Auditoría y respuesta

- Registrar actor autenticado, instante de servidor, acción, objetivo, resultado y correlación para operaciones sensibles; excluir contraseñas, tokens y contenido privado innecesario.
- Mantener bitácora no editable por usuarios funcionales y definir quién puede consultarla/retenerla.
- Diseñar mensajes de fallo explícitos; una falla de red o almacenamiento no debe parecer operación exitosa.
- Definir detección/atención de accesos anómalos, revocación, respaldo, restauración y notificación de incidentes con responsables.

## Criterios de aceptación de seguridad

- Matriz de roles/permisos aprobada y probada por páginas, procesos y filas.
- Pruebas de rutas directas, manipulación de parámetros, sesión expirada, usuario deshabilitado y permisos revocados.
- Intentos/clave evaluados en servidor y evidencia accesible solo a roles/propietarios aprobados.
- Política documentada de retención, offline, archivos, auditoría y datos demo.
- Revisión final con versiones de APEX/Database/ORDS reales; actualmente todos esos controles están pendientes de instancia autorizada.
