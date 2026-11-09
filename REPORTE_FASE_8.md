# Reporte de Fase 8 — OmniGuard App

**Fecha:** 2026-11-08  
**Estado:** Curso AVSEC integrado como material demo en revisión; no publicado.

## Alcance implementado

Se integró exclusivamente el curso **CERTIFICACIÓN AVSEC — OFICIAL DE SEGURIDAD AEROPORTUARIA**, con cinco unidades y 20 horas estimadas. Mercancías Peligrosas y SMS continúan visibles como **Disponible próximamente**, sin acceso a contenidos, flashcards, quizzes ni evaluaciones.

Cada unidad incluye introducción, objetivos, lección con conceptos y ejemplos, caso práctico, errores frecuentes, factores humanos, resumen, actividad interactiva, cuestionario de cinco reactivos y referencias. El paquete contiene 50 preguntas originales, diez por unidad. La evaluación final selecciona 35 reactivos —siete por unidad— y usa un umbral demostrativo de 80% (28 respuestas correctas).

## Archivos creados

- `assets/data/avsec-course.json`: contenido versionado de las cinco unidades y sus actividades, objetivos y referencias.
- `assets/data/avsec-question-bank.json`: banco de 50 preguntas con opciones, respuestas, explicaciones y temas.
- `05_ACADEMIA/AVSEC/REFERENCIAS_AVSEC.md`: bibliografía y estado de verificación de fuentes.
- `05_ACADEMIA/AVSEC/LISTA_RECURSOS_VISUALES.md`: inventario de diagramas, ilustraciones e infografías pendientes.
- `REPORTE_FASE_8.md`: este reporte.

## Archivos modificados

- Datos del LMS: `assets/data/cursos.json`, `unidades.json`, `lecciones.json` y `evaluaciones.json`.
- Carga y evaluación: `app/data.js`, `app/lms/actions.js`, `app/lms/assessment.js`, `app/persistence/bootstrap.js` y `scripts/main.js`.
- Pantallas: `pages/academy.js`, `course.js`, `unit.js`, `lesson.js`, `activity.js`, `quiz.js`, `exam.js`, `results.js` y `flashcards.js`.
- Reproductor y PWA: `components/lms-player.js`, `service-worker.js` y `scripts/build-pages.mjs`.
- Se regeneró `07_GITHUB/` como distribución plana para Pages: 84 recursos estáticos, incluidos 44 módulos JavaScript, datos JSON, iconos, imágenes, manifest y Service Worker. No se publicó.

No se modificaron documentos de Gobierno Tecnológico, documentos de fases anteriores, README principal ni esquema de IndexedDB.

## Funcionalidad integrada

- Catálogo, dashboard y Course Player AVSEC con cinco unidades, navegación, progreso, quiz y evaluación final.
- Actividades y cuestionarios conectados al modelo LMS existente; las respuestas y el progreso se guardan en IndexedDB.
- Examen con 35 preguntas, navegación numerada, estado de respuesta y marca para revisar; el envío presenta resultados y desglose por temas.
- El contenido y los intentos demo usan versión `0.1.0`; los intentos de versiones anteriores no se cuentan como actuales.
- Rutas directas de Mercancías Peligrosas y SMS muestran disponibilidad futura y bloquean pantallas de contenido.
- El Service Worker de Pages se actualizó a caché `omniguard-pages-v9` e incluye los recursos AVSEC.

## Validaciones realizadas

- Se analizaron los JSON y se verificó: cinco unidades, 1,200 minutos estimados, 50 preguntas únicas —diez por unidad—, cinco preguntas de quiz por unidad, 35 preguntas de examen —siete por unidad—, umbral de 80%, claves válidas y opciones A–D.
- Se revisó que los enunciados no fueran negativos y que las opciones no usaran “Todas las anteriores” ni “Ninguna de las anteriores”.
- `node --check` pasó en 44 archivos JavaScript.
- En Microsoft Edge headless se probaron el ingreso demo, catálogo, Course Player, unidad, actividad interactiva y cuestionario. Se respondió y envió el quiz; el resultado local se mostró correctamente. También se respondieron y guardaron los 35 reactivos del examen; no apareció retroalimentación antes del envío y se mostró el resultado al finalizar.
- Se confirmó persistencia del tema claro después de cerrar y reabrir el navegador. En la pantalla de resultados no hubo desbordamiento horizontal a 390, 820 y 1280 px.
- Se comprobaron las rutas directas de Mercancías Peligrosas y SMS: sin flashcards, quizzes ni evaluación.
- Sin excepciones JavaScript durante el flujo probado. La distribución plana se regeneró y se comprobó la presencia de los datos AVSEC en el precache.
- No se instalaron dependencias ni se conectó Oracle, ORDS o backend.

## Referencias, riesgos y pendientes

- El curso está en estado `DRAFT_REVIEW`: es contenido introductorio de demostración, no acredita capacitación ni certifica competencias y no debe usarse como instrucción operacional.
- La página institucional de ICAO para GASeP 2024 y el portal AFAC fueron comprobados. La vigencia de la Ley de Aviación Civil y los artículos pertinentes requieren revisión jurídica. El acceso automatizado a eCFR fue bloqueado; FAA queda como referencia institucional general, no como fuente AVSEC sustantiva. Annex 17, Doc 8973 y programas locales requieren fuentes oficiales autorizadas.
- En una PWA estática el banco y sus claves pueden inspeccionarse técnicamente aunque la interfaz no muestre la respuesta correcta antes de finalizar. La evaluación es solo demostrativa y no es resistente a manipulación.
- No se generaron recursos visuales. Su producción requiere revisión AVSEC, accesibilidad, licencias y exclusión de información operacional sensible.
- Se probó Edge en entorno headless; no se realizó validación en Chrome, dispositivos físicos iOS/Android ni integración con Oracle APEX.

## Preparación para Fase 9

1. Solicitar revisión editorial y técnica a un especialista AVSEC autorizado y validar referencias jurídicas vigentes.
2. Aprobar y producir los recursos visuales del inventario con texto alternativo y versiones para ambos temas.
3. Ampliar la validación en Chrome, Safari/iOS, Android y tamaños de pantalla reales; automatizar recorridos de quiz, progreso, persistencia y accesibilidad.
4. Mantener el curso como demo hasta contar con contenido aprobado y una evaluación confiable; conservar Mercancías Peligrosas y SMS como próximos.
