# Lista de defectos — Fase 11

**Fecha:** 2026-11-08  
**Estado:** sin defectos abiertos conocidos dentro del alcance probado.

## Defectos encontrados y corregidos

| ID | Severidad | Defecto | Corrección | Estado |
|---|---|---|---|---|
| F11-01 | Media | Cadenas largas de referencias AVSEC (por ejemplo, estados de verificación) excedían el ancho disponible en viewport móvil. | Se agregó `overflow-wrap: anywhere` al estilo de referencias, tanto en el CSS fuente como en el CSS plano de Pages. | Corregido y revalidado a 390 px. |
| F11-02 | Media | La instrucción junto al control SOS permanecía visible y podía tapar contenido. | Se limita su aparición a mantener presionado, foco o hover en dispositivos que lo admiten; deja de mostrarse al terminar la interacción. | Corregido y revalidado, incluida emulación táctil. |
| F11-03 | Media | Una instalación con caché v10 podía conservar estilos anteriores y no recibir los ajustes de QA. | Se elevó la versión de caché a v11 en fuente, generador y distribución; la activación elimina la caché v10. | Corregido y verificado en Chrome y Edge locales. |
| F11-04 | Baja | La arquitectura negaba la persistencia IndexedDB y el README aún describía AVSEC como no desarrollado. | Se actualizaron `docs/ARCHITECTURE.md` y `README.md` para reflejar el comportamiento actual y sus límites. | Corregido. |

## Defectos abiertos

No se identificaron defectos abiertos reproducibles durante las pruebas registradas. Esta conclusión se limita a los navegadores, rutas, viewports y estados de datos indicados en `MATRIZ_PRUEBAS.md`; no es una garantía de ausencia universal de defectos.

## Riesgos y pendientes que no son defectos corregibles de esta fase

- AVSEC permanece en `DRAFT_REVIEW`; referencias y contenido requieren revisión autorizada. La PWA no acredita capacitación ni competencias.
- Las claves y la lógica de evaluación están disponibles en el cliente estático; el examen es demostrativo.
- IndexedDB no sincroniza ni respalda datos. No usar información real, personal, operativa o sensible.
- Autenticación, autorización, backend, Oracle APEX/ORDS y alertas SOS reales no están implementados.
- No se verificaron instalación en dispositivos físicos, Safari/iOS, Android ni el dominio remoto de GitHub Pages.
- La validación de accesibilidad fue acotada a interacción, foco y presentación observada; no se ejecutó una auditoría de conformidad WCAG.

Estos puntos requieren aprobación, diseño o validación en una fase/ambiente autorizado; no se presentan como defectos resueltos.
