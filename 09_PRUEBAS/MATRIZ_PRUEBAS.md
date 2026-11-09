# Matriz de pruebas — Fase 11

**Proyecto:** OmniGuard App  
**Fecha:** 2026-11-08  
**Alcance:** auditoría funcional de la demo local y su distribución plana `07_GITHUB`. No se publicó ni se conectó Oracle APEX.

## Entorno y criterios

- Chrome y Microsoft Edge en ejecución local automatizada; los anchos 390, 820 y 1280 px son viewports emulados, no dispositivos físicos.
- La distribución Pages se probó en raíz y bajo la subruta `/OmniSecurity-App/`.
- IndexedDB y Service Worker se verificaron en un origen local servido por HTTP.
- **Aprobado:** comportamiento esperado dentro del alcance probado.
- **Corregido y revalidado:** se detectó una desviación, se corrigió y se repitió la comprobación.
- **Pendiente:** no ejecutado o requiere ambiente, autorización o dispositivo no disponible.

## Casos ejecutados

| ID | Caso | Resultado | Estado | Observaciones |
|---|---|---|---|---|
| NAV-01 | Splash, acceso demo e inicio | La aplicación llega al inicio y presenta el usuario demo esperado. | Aprobado | No es autenticación real. |
| NAV-02 | Navegación entre Inicio, Operaciones, Academia y Perfil | Las rutas y destinos principales se abren correctamente. | Aprobado | Se verificó navegación atrás/adelante y enlaces de destino repetidos. |
| OPS-01 | Check In/Out, filtros y timeline | Las acciones demo y los filtros actualizan la vista. | Aprobado | No constituyen marcajes oficiales. |
| OPS-02 | Crear incidente y adjuntar evidencia | El incidente y el archivo seleccionado se muestran en la aplicación. | Aprobado | El Blob queda en almacenamiento local; no se transmite. |
| LMS-01 | Catálogo de cursos | AVSEC abre el curso; Mercancías Peligrosas y SMS muestran “Disponible próximamente”. | Aprobado | Las rutas directas de cursos futuros no abren contenido inexistente. |
| LMS-02 | Recorrido AVSEC | Se recorrieron curso, unidad, lección y actividad interactiva. | Aprobado | Se verificó navegación del reproductor y avance local. |
| LMS-03 | Quizzes por unidad | El quiz acepta respuestas, presenta retroalimentación al enviar y guarda el resultado local. | Aprobado | Cinco reactivos por quiz. |
| LMS-04 | Examen final | Se completaron y enviaron 35 reactivos; el resultado se presenta al finalizar. | Aprobado | Las respuestas correctas no se muestran antes del envío en la interfaz; el banco cliente no es secreto ni resistente a manipulación. |
| LMS-05 | Resultados y progreso | Se presentan resultados/desglose y el progreso se conserva. | Aprobado | La calificación es demostrativa, no certificable. |
| DB-01 | Esquema local de IndexedDB | Se detectaron 16 almacenes en `omniguard-local-demo`, esquema v2. | Aprobado | Verificación en el navegador de prueba. |
| DB-02 | Restauración después de recarga | Se restauraron tema, última pantalla, curso/unidad/lección, progreso, actividad, quiz, examen, incidente/evidencia, bitácora y SOS. | Aprobado | Los datos pertenecen al perfil y origen del navegador. |
| UX-01 | Tema claro/oscuro | El cambio de tema se refleja en las vistas probadas y persiste tras recargar. | Aprobado | No se certificó conformidad WCAG. |
| SOS-01 | Cancelación antes del umbral y activación mantenida | La pulsación corta cancela; mantener el control activa la simulación y registra el evento. | Aprobado | No inicia llamada, no envía ubicación y no genera una alerta real. |
| SOS-02 | Instrucción del botón SOS en viewport táctil | La ayuda permanece oculta en reposo, aparece durante la pulsación y se oculta al soltar. | Aprobado | Verificado mediante emulación táctil de 390 px, no en un teléfono físico. |
| PWA-01 | Manifest e iconos | `start_url`/`scope` relativos, `standalone` e iconos 192, 512 y maskable cargan con dimensiones válidas. | Aprobado | Se probaron fuente y distribución plana. |
| PWA-02 | Service Worker y actualización | v11 se activa; la caché v10 anterior se elimina y se precargan 85 recursos. | Aprobado | La estrategia de fuente y Pages usa nombres de caché independientes. |
| PWA-03 | Navegación offline básica | Tras precargar la aplicación, la navegación local vuelve a abrir el shell y los recursos cacheados. | Aprobado | No implica sincronización offline ni disponibilidad garantizada bajo cualquier política/cuota del navegador. |
| PWA-04 | Subruta de Pages | Manifest, alcance, iconos, Service Worker y navegación operan bajo `/OmniSecurity-App/`. | Aprobado | Prueba local; no se accedió a un dominio Pages publicado. |
| RWD-01 | Layout en 390, 820 y 1280 px | Se revisaron 10 rutas representativas en ambos temas: 60 combinaciones por navegador/distribución. No se observó scroll horizontal en las combinaciones revisadas. | Aprobado | Chrome y Edge; fuente y `07_GITHUB`. Viewports emulados. |
| RWD-02 | Referencias AVSEC largas en móvil | Cadenas extensas de estado de verificación ahora pueden partirse dentro del contenedor. | Corregido y revalidado | Se comprobó a 390 px en fuente y Pages. |
| UI-01 | Ayuda del control SOS y superposición | La indicación ya no permanece sobre el contenido; aparece por interacción, foco o hover aplicable. | Corregido y revalidado | También se comprobó su cierre al soltar en emulación táctil. |
| CON-01 | Consola y respuestas de red | Sin errores críticos de JavaScript, Service Worker, recursos o respuestas HTTP 4xx durante las regresiones registradas. | Aprobado | Resultado limitado a las rutas y sesiones locales probadas. |
| DOC-01 | Documentación de límites y estado LMS | Arquitectura y README describen IndexedDB/offline y AVSEC conforme al comportamiento actual. | Corregido | Sin cambios a Gobierno Tecnológico. |
| BUILD-01 | Sintaxis y coherencia de distribución | `node --check` pasó para el generador y ambos Service Workers; CSS fuente y Pages coincide por SHA-256. | Aprobado | No se modificaron dependencias. |
| APEX-01 | Integración con Oracle APEX/ORDS | No ejecutada. | Pendiente | Fuera del alcance y sin versión, instancia ni acceso confirmados. |
| DEVICE-01 | Instalación y comportamiento en hardware físico | No ejecutada. | Pendiente | No se probó Safari/iOS, Android físico ni instalación real de Chrome/Edge. |
| RELEASE-01 | Publicación en GitHub Pages | No ejecutada. | Pendiente | No se configuró el sitio remoto, no se hizo commit ni push. |

## Cobertura responsive

La regresión final comprobó, por navegador y distribución, 10 rutas representativas × 3 anchos (390, 820 y 1280 px) × 2 temas. Los recorridos funcionales adicionales incluyeron unidad, actividad y resultados. Las comprobaciones de layout no equivalen a una auditoría WCAG completa ni sustituyen pruebas en hardware.

## Resultado

No quedan defectos conocidos abiertos dentro del alcance local probado. Las restricciones de publicación, revisión del contenido AVSEC, seguridad de producción, dispositivos físicos e integración Oracle se registran como pendientes/riesgos y no como fallas funcionales reproducibles de la demo.
