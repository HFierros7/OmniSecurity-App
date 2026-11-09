# Reporte de Fase 4 — UX/UI OmniGuard App

- **Fecha:** 2026-11-08
- **Resultado:** especificaciones UX/UI y arquitectura visual elaboradas para revisión.
- **Alcance respetado:** documentación únicamente; no se generó código, recursos gráficos ni dependencias.

## Documentos creados

- `04_UX_UI\DESIGN_SYSTEM.md`
- `04_UX_UI\COMPONENT_LIBRARY.md`
- `04_UX_UI\ANIMATIONS.md`
- `04_UX_UI\RESPONSIVE_LAYOUTS.md`
- `04_UX_UI\USER_FLOWS.md`
- `04_UX_UI\WIREFRAMES.md`
- `04_UX_UI\ORACLE_APEX_UI_MAPPING.md`
- `REPORTE_FASE_4.md`

## Decisiones UX propuestas

- Mobile-first; Bottom Navigation hasta 1023 px y Sidebar desde 1024 px.
- Cuatro módulos primarios: Inicio, Operaciones, Academia y Perfil.
- Tokens basados en la paleta oficial, con neutros auxiliares para claro/oscuro y contraste calculado para combinaciones principales.
- SOS se distingue de acciones normales; no se confirma envío sin respuesta autoritativa ni se retrasa por animación.
- Confirmaciones, errores, sincronización y modo offline se muestran como estados distintos.
- Datos de nómina, RH y operaciones no se exponen en la demo pública de GitHub Pages ni se cachean offline por defecto.
- Se propone usar primero componentes nativos de Oracle APEX una vez confirmada su versión.
- Las animaciones propuestas usan 120, 180, 220 o hasta 300 ms; se respetan preferencias de movimiento reducido.

## Riesgos encontrados

- `uiux.build` presentó una página de dominio en venta, no documentación verificable; no fue posible atribuirle pautas de diseño.
- No se verificaron instancia ni versiones de APEX, Oracle Database u ORDS; el mapeo APEX es conceptual.
- Nómina no figura en las entidades/casos de uso de Fase 3: faltan sistema fuente, permisos, retención y reglas de privacidad.
- SOS requiere protocolo de destinatarios, escalamiento, respuesta, ubicación, cancelación y contingencia offline.
- Evidencias multimedia, Check In/Out geográfico y operación offline requieren decisiones de privacidad, seguridad y fiabilidad.
- El nombre del cliente y la ubicación indicados para la demo requieren autorización antes de exponerse en GitHub Pages u otro canal público.
- Los wireframes no han sido evaluados con guardias ni probados en dispositivos reales.

## Pendientes

- Confirmar roles, alcance de datos por usuario, servicio y cliente.
- Validar navegación, etiquetas, iconografía y acciones con guardias operativos.
- Aprobar política de SOS y de estados de operación offline.
- Decidir alcance de nómina y su fuente/integración RH.
- Confirmar APEX/Database/ORDS y validar los componentes disponibles.
- Hacer revisión de accesibilidad y pruebas responsive en Safari iOS, Android y escritorio.
- Proporcionar una guía o URL vigente si se requiere adherencia verificable a UIUX.Build.

## Validaciones

- Se contrastaron principios y temas de Apple HIG con las páginas oficiales de diseño, accesibilidad, color, layout y tipografía.
- Se calculó contraste de tokens principales mediante luminancia relativa; las combinaciones deben revalidarse sobre los componentes finales.
- Se inspeccionaron los documentos UX/UI existentes y se confirmó que los ocho destinos nuevos no existían antes de crearlos.
- No se realizaron pruebas de navegador, APEX, Pages ni dispositivos porque no se generó implementación.
- Los documentos de fases anteriores y `Recursos` permanecen sin cambios.

## Siguiente fase recomendada

Fase 5 — prototipado visual y validación con guardias: probar tareas críticas (SOS, asistencia, incidente, evidencia y curso) en móvil/tablet/escritorio; corregir flujos y accesibilidad; confirmar requisitos de seguridad y datos antes de implementar.
