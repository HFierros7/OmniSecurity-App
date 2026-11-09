# Checklist de liberación — OmniGuard App

**Fecha:** 2026-11-08  
**Uso:** distinguir la verificación local de QA de las aprobaciones y pruebas necesarias antes de una publicación o uso operativo.

## Verificaciones locales de Fase 11

- [x] Navegación principal y recorridos funcionales de la demo
- [x] Responsive a 390, 820 y 1280 px en Chrome y Edge (viewports emulados)
- [x] IndexedDB: almacenes y restauración de estado tras recarga
- [x] AVSEC: unidades, actividad, quizzes, examen y resultados
- [x] SOS simulado: cancelación, activación mantenida e historial
- [x] Manifest e iconos requeridos comprobados localmente
- [x] Service Worker v11, actualización de caché y navegación offline básica
- [x] Modo claro/oscuro y persistencia de preferencia
- [x] CSS de la distribución Pages coincide con el CSS fuente
- [x] Paquete documental Oracle APEX de Fase 9 revisado; sin instancia ni integración ejecutada
- [x] Sin errores críticos de consola/red en los recorridos registrados

## Condiciones pendientes antes de publicar

- [ ] Confirmar autorización, propiedad del repositorio remoto, rama y dominio GitHub Pages.
- [ ] Obtener aprobación explícita para publicar marca, imágenes, contenido y datos demo.
- [ ] Configurar y publicar GitHub Pages; verificar el dominio HTTPS real, rutas, manifest, instalación y consola/red después del despliegue.
- [ ] Probar instalación y uso en dispositivos físicos; validar Safari/iOS y Android.
- [ ] Obtener revisión y aprobación AVSEC, referencias y contenido. Mantener el curso como demo/no certificable hasta entonces.
- [ ] Completar revisión de privacidad y seguridad antes de incorporar datos reales; no reutilizar la persistencia local demo como sistema de producción.
- [ ] Confirmar requisitos de accesibilidad y realizar la auditoría formal correspondiente antes de declarar conformidad.
- [ ] Si la entrega incluye Oracle APEX, confirmar versiones, instancia y accesos autorizados y ejecutar una validación de integración independiente.

## Decisión de liberación

**Estado: no autorizado para publicación pública ni uso operativo.** La demo supera las comprobaciones locales registradas y puede pasar a la Fase 12 para empaquetado y entrega controlada. La liberación queda condicionada a completar los pendientes anteriores; no publicar ni hacer push sin autorización.
