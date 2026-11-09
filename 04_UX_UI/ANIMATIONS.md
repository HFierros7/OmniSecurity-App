# OmniGuard App — Animaciones y microinteracciones

Las animaciones comunican causa, estado y continuidad; no decoran ni retrasan una acción operativa. Duraciones máximas conforme a la especificación: 300 ms. Respetar la preferencia del sistema para reducir movimiento.

| Microanimación | Duración | Easing | Propiedad afectada | Uso |
|---|---:|---|---|---|
| Button Press | 120 ms | Salida suave | Escala mínima y opacidad | Confirmar visualmente pulsación; no cambiar el tamaño del área táctil |
| Card Tap | 120 ms | Salida suave | Elevación/opacidad | Indicar selección de tarjeta interactiva |
| Navigation Transition | 220 ms | Entrada/salida suave | Opacidad y desplazamiento corto | Transición entre vistas; mantener contexto y foco |
| Bottom Sheet | 220 ms | Entrada suave; salida suave al cerrar | Traslación vertical y scrim | Apertura/cierre contextual; no depender del gesto |
| FAB | 180 ms | Salida suave | Escala/opacidad | Aparición contextual; no tapar contenido |
| SOS | 120 ms | Lineal o salida corta | Borde/estado pressed | Feedback táctil visual puntual; nunca pulso repetido, cuenta regresiva o demora antes de enviar |
| Dark Mode Transition | 220 ms | Suave | Color de superficie, texto y borde | Transición global sin parpadeo; mantener lectura y foco |
| Carousel | 220 ms | Entrada/salida suave | Desplazamiento horizontal | Navegación iniciada por usuario; sin autoplay en contenido crítico |
| Progress Bar | 300 ms máximo | Lineal | Longitud del indicador | Reflejar valor confirmado; progreso de carga puede actualizarse sin animar cada paquete |
| Timeline Filter | 180 ms | Suave | Opacidad/visibilidad | Cambiar filtro conservando foco y posición razonable |
| Exam Navigation | 180 ms | Suave | Opacidad/desplazamiento breve | Cambiar pregunta; nunca bloquear entrada ni cambiar respuesta por animación |

## Reglas de accesibilidad y seguridad

- En reducción de movimiento, reemplazar desplazamientos por cambio instantáneo o fundido mínimo; no eliminar información de estado.
- No usar movimiento, sonido o vibración como único aviso.
- SOS se intenta inmediatamente según protocolo; la transición visual no forma parte del tiempo de envío.
- Animar solo propiedades que no provoquen saltos de layout; no animar texto crítico de forma que impida leerlo.
- Las transiciones no deben ocultar confirmaciones, errores ni estados pendientes offline.
- En examen, no limpiar respuestas al cambiar de pregunta; guardar según política y exponer estado de guardado.
