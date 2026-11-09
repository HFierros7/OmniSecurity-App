# Reporte de Fase 11 — OmniGuard App

**Fecha:** 2026-11-08  
**Estado:** QA funcional local completado para el alcance probado; defectos encontrados corregidos. No publicado.

## Resumen ejecutivo

Se recorrieron los flujos principales de OmniGuard, el curso AVSEC, la persistencia IndexedDB, el modo oscuro, la simulación SOS y el comportamiento PWA. Se corrigieron cuatro hallazgos: desbordamiento de referencias en móvil, ayuda SOS superpuesta, actualización de caché y documentación desfasada. Las regresiones locales no dejaron defectos conocidos abiertos.

**Recomendación:** OmniGuard está preparado para la Fase 12 de entrega controlada, pero **no está listo para liberación pública ni uso operativo**. Pages no se publicó, no se probó en dispositivos físicos, AVSEC requiere aprobación especializada y la aplicación sigue siendo una demo sin autenticación, backend ni sincronización.

## Validaciones ejecutadas

- **Navegación:** splash, login demo, inicio, Operaciones, Academia, AVSEC, quiz, examen, resultados y Perfil; se comprobaron destinos y navegación atrás/adelante.
- **Operaciones:** Check In/Out, filtros, timeline, creación de incidente y adjunto local.
- **Academia:** recorrido de curso, unidad, lección y actividad; quizzes de cinco preguntas y examen final de 35 reactivos, con resultado al enviar. Mercancías Peligrosas y SMS continúan como “Disponible próximamente”, sin rutas de contenido.
- **Persistencia:** IndexedDB `omniguard-local-demo`, v2, con 16 almacenes. Tras recargar se restauraron tema, pantalla, avance LMS, actividad, quiz, examen, incidente/evidencia, bitácora y eventos SOS.
- **SOS:** cancelación de pulsación corta, activación mantenida e historial local. No se realizan llamadas ni se comparte ubicación.
- **PWA:** manifest, iconos, Service Worker v11, actualización/eliminación de caché v10, 85 recursos cacheados y navegación offline básica. Se probó fuente y distribución plana, incluida la subruta `/OmniSecurity-App/`.
- **Responsive y temas:** Chrome y Edge, fuente y `07_GITHUB`; diez rutas representativas, tres viewports (390, 820 y 1280 px) y dos temas por combinación. No se observó desbordamiento horizontal en las combinaciones registradas.
- **Consola y distribución:** sin errores críticos de consola ni respuestas HTTP 4xx durante las regresiones locales. `node --check` pasó para el generador y ambos Service Workers; el CSS fuente y Pages coincide por SHA-256.
- **Documentación:** se corrigieron afirmaciones obsoletas de arquitectura y README sobre IndexedDB, modo offline y estado del curso AVSEC.

El detalle reproducible y las limitaciones se encuentran en `09_PRUEBAS/MATRIZ_PRUEBAS.md`.

## Correcciones realizadas

1. `styles/app.css` y `07_GITHUB/app.css`: salto de línea para referencias extensas en pantallas estrechas.
2. `styles/app.css` y `07_GITHUB/app.css`: la ayuda del botón SOS ya no permanece superpuesta; aparece mediante interacción/foco o hover compatible y desaparece al soltar.
3. `service-worker.js`, `scripts/build-pages.mjs` y `07_GITHUB/service-worker.js`: caché v11 para que instalaciones anteriores descarten v10 y reciban los estilos corregidos.
4. `docs/ARCHITECTURE.md` y `README.md`: límites y funcionalidad documentados conforme a la demo actual.

No se agregaron funcionalidades, dependencias, backend ni integración Oracle.

## Defectos y riesgos

- **Defectos abiertos conocidos:** ninguno dentro del alcance local probado. Los hallazgos corregidos están registrados en `09_PRUEBAS/LISTA_DEFECTOS.md`.
- **AVSEC:** estado `DRAFT_REVIEW`; referencias, contenido y uso requieren aprobación experta. La evaluación está del lado cliente, es manipulable y no certifica competencia.
- **Datos y seguridad:** IndexedDB es local al perfil/origen, no sincroniza ni constituye respaldo; los datos demo no deben sustituirse por datos reales sin diseño de seguridad y privacidad.
- **Integraciones:** login demo, operaciones y SOS no son servicios reales. Oracle APEX/ORDS no se conectó ni probó.
- **Publicación y plataformas:** no se validó el dominio remoto Pages ni la instalación física en Chrome/Edge, iOS/Safari o Android.
- **Accesibilidad:** las verificaciones fueron acotadas; no se realizó auditoría formal WCAG.

## Entregables y estado de liberación

- `09_PRUEBAS/MATRIZ_PRUEBAS.md`
- `09_PRUEBAS/LISTA_DEFECTOS.md`
- `09_PRUEBAS/CHECKLIST_LIBERACION.md`
- `REPORTE_FASE_11.md`

La lista de liberación mantiene como pendientes la autorización y configuración de Pages, verificación postpublicación, dispositivos físicos y aprobaciones de contenido/seguridad. **No se publicó, no se hizo commit ni push.**

## Preparación para Fase 12

Se puede continuar con el empaquetado y la entrega documental, conservando el estado de demo y señalando expresamente las limitaciones y pendientes. La Fase 12 no debe interpretarse como autorización para publicar: cualquier despliegue requiere aprobación expresa y completar el checklist de liberación.
