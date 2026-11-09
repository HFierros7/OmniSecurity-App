# Arquitectura del prototipo OmniGuard App

## Capas

- **Presentación:** `pages/` renderiza las vistas y `components/` contiene elementos reutilizables.
- **Aplicación:** `app/` administra rutas hash, estado de sesión demo, tema e interacciones.
- **Recursos:** `assets/data/demo-data.json` contiene valores ficticios; `assets/icons/` y `assets/images/` son copias de los recursos corporativos.
- **Shell web:** `index.html`, `manifest.json` y `service-worker.js` se sirven desde la raíz.
- **Estilos:** `styles/` contiene tokens y composición visual.

## Límites deliberados

No hay backend, autenticación real, llamadas APEX/ORDS ni conexión a Oracle Database. IndexedDB (esquema v2) conserva localmente preferencias, navegación, progreso, actividades, evaluaciones, incidentes, evidencias, bitácora y simulaciones SOS; estos datos son específicos del perfil y del origen del navegador, y no se sincronizan con un servidor.

El Service Worker precarga los recursos estáticos y ofrece navegación offline básica. No implementa sincronización, cola de servidor ni garantía ante cuotas, políticas del navegador o borrado de datos. Check In/Out, reportes, progreso, actividades, evaluaciones y SOS son demostraciones locales: no son registros oficiales, calificaciones certificables ni alertas reales. La preferencia de tema se guarda en IndexedDB.

## Compatibilidad futura

Las pantallas desacoplan estructura visual y estado de datos para permitir sustitución futura de datos de demo por servicios autorizados. No constituye una integración probada ni un contrato API. La distribución de GitHub Pages debe mantenerse plana en `07_GITHUB`, independiente de los módulos fuente.
