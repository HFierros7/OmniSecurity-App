# OmniGuard App — Component Library

Los componentes son especificaciones de diseño, no implementaciones. Todos deben cubrir foco visible, teclado, lector de pantalla, contraste aumentado, preferencia de movimiento reducido y estados sin conexión aplicables. En modo oscuro, cambiar superficies y tokens semánticos; no invertir imágenes o colores automáticamente.

## Navegación y estructura

### Navigation Bar
- **Propósito:** cambiar entre Inicio, Operaciones, Academia y Perfil en móvil.
- **Estados:** normal, seleccionado, foco, deshabilitado, badge/aviso.
- **Comportamiento:** cuatro destinos principales, etiqueta e icono; área táctil amplia; respeta zona segura inferior; no perder formularios sin confirmación.
- **Claro:** superficie blanca, texto `brand.primary`, indicador `brand.action`.
- **Oscuro:** `surface.darkRaised`, texto `text.dark`, indicador `brand.accent`.

### Sidebar
- **Propósito:** navegación persistente en escritorio.
- **Estados:** expandido/compacto, seleccionado, foco, submenú abierto, no autorizado.
- **Comportamiento:** muestra destinos y contexto del usuario; colapsado conserva nombres accesibles; autorización siempre se valida en servidor.
- **Claro:** blanco o `surface.lightSubtle`, selección azul con forma/indicador además de color.
- **Oscuro:** `surface.darkRaised`, selección con acento celeste y contraste suficiente.

### Header
- **Propósito:** identidad del producto, título/contexto, estado de conexión y acciones globales.
- **Estados:** normal, desplazado/sticky, búsqueda activa, menú abierto, offline.
- **Comportamiento:** título de página, servicio/curso cuando aplique, perfil y estado de sincronización; SOS separado del menú de overflow.
- **Claro:** superficie clara, texto azul marino.
- **Oscuro:** fondo oscuro elevado, texto claro; status siempre textual.

## Acciones y superficies

### Card
- **Propósito:** agrupar información o una acción relacionada.
- **Estados:** normal, hover/teclado, pressed, seleccionado, vacío, cargando, deshabilitado.
- **Comportamiento:** clic solo si es acción; evitar tarjetas completas con varios botones ambiguos; foco visible.
- **Claro:** blanco, borde tenue, sombra opcional.
- **Oscuro:** `surface.darkRaised`, borde oscuro, sombra mínima.

### Button Primary
- **Propósito:** acción principal de la vista.
- **Estados:** normal, foco, pressed, cargando, éxito, deshabilitado, error.
- **Comportamiento:** verbo explícito; bloquear doble envío mientras haya operación; la etiqueta explica acción.
- **Claro:** `brand.primary` o `brand.action` con texto blanco.
- **Oscuro:** `brand.accent` con texto `surface.dark`; evitar azul medio de bajo contraste.

### Button Secondary
- **Propósito:** acción alternativa o cancelación segura.
- **Estados:** normal, foco, pressed, deshabilitado.
- **Comportamiento:** visualmente subordinado; cancelación nunca debe aparentar guardar.
- **Claro:** superficie blanca, borde/texto azul oscuro.
- **Oscuro:** superficie oscura, borde y texto claro; acento celeste al enfocar.

### Floating Action Button
- **Propósito:** acceso rápido a una única acción contextual no crítica.
- **Estados:** normal, foco, pressed, expandido, deshabilitado.
- **Comportamiento:** etiqueta accesible; no tapar navegación, teclado, controles ni contenido; desaparecer o reubicarse ante teclado/modal; no usar para SOS.
- **Claro:** fondo `brand.action`, icono/texto blanco.
- **Oscuro:** fondo `brand.accent`, icono oscuro.

### SOS Button
- **Propósito:** solicitar ayuda operativa según protocolo aprobado.
- **Estados:** disponible, presionado, enviando, enviado confirmado, entrega fallida, deshabilitado por política.
- **Comportamiento:** etiqueta visible “SOS”; no depender de pulso/animación; acción y estado accesibles; prevenir activación accidental sin introducir una barrera que retrase ayuda; si offline, explicar que no fue enviado y mostrar alternativa aprobada.
- **Claro:** rojo `#DC2626`, texto/icono blanco y forma distintiva.
- **Oscuro:** mismo rojo con borde/superficie que asegure contraste; texto blanco; no usar rojo pequeño sobre fondo oscuro.

### Toast
- **Propósito:** comunicar una confirmación o aviso breve no crítico.
- **Estados:** información, éxito, advertencia, error, cerrando.
- **Comportamiento:** anunciar accesiblemente; permanecer suficiente tiempo; permitir cierre; no usar como único registro de resultado de SOS, incidente, pago o marcaje.
- **Claro:** superficie elevada con texto oscuro e icono/etiqueta de estado.
- **Oscuro:** superficie elevada oscura con texto claro.

### Bottom Sheet
- **Propósito:** presentar detalle o acciones contextuales desde el borde inferior en móvil.
- **Estados:** cerrado, abriendo, abierto, arrastrando, error/cargando.
- **Comportamiento:** modal con foco contenido, cierre por botón/Escape y gesto opcional; al cerrar restituir foco; no comunicar información solo por arrastre.
- **Claro:** superficie blanca, scrim neutro.
- **Oscuro:** superficie `surface.darkRaised`, scrim oscuro.

### Accordion
- **Propósito:** revelar contenido secundario sin sobrecargar la página.
- **Estados:** contraído, expandido, foco, deshabilitado, cargando.
- **Comportamiento:** encabezado operable por teclado; estado expandido anunciado; no ocultar advertencias o decisiones críticas.
- **Claro:** encabezado claro y divisor tenue.
- **Oscuro:** encabezado elevado, divisor oscuro visible.

## Datos y aprendizaje

### Timeline Item
- **Propósito:** mostrar un evento operativo cronológico.
- **Estados:** normal, actual, futuro, completado, pendiente offline, fallido.
- **Comportamiento:** hora, actor/etiqueta, estado textual y detalle; no usar color como único indicador.
- **Claro:** línea neutra, hitos azules; crítico rojo solo cuando corresponda.
- **Oscuro:** línea/borde legible, hito celeste; crítica conserva etiqueta e icono.

### Progress Bar
- **Propósito:** indicar avance de curso, actividad o carga.
- **Estados:** cero, parcial, completo, indeterminado, pausado, error.
- **Comportamiento:** exponer valor textual/semántico; diferenciar progreso formativo de progreso de transferencia.
- **Claro:** pista neutra, relleno `brand.action`.
- **Oscuro:** pista oscura visible, relleno `brand.accent`.

### Course Card
- **Propósito:** resumir curso, versión, duración y avance.
- **Estados:** asignado, disponible, en curso, completado, bloqueado, offline/desactualizado.
- **Comportamiento:** título, estado textual, progreso, acción de continuar; explicar prerequisitos.
- **Claro:** tarjeta blanca con jerarquía de título y metadatos.
- **Oscuro:** tarjeta elevada oscura, acento celeste y estados legibles.

### Quiz Card
- **Propósito:** presentar actividad breve de práctica.
- **Estados:** nuevo, iniciado, completado, reintento, bloqueado, pendiente de sincronización.
- **Comportamiento:** informar propósito, duración y si afecta calificación; no mostrar respuesta correcta antes de enviar.
- **Claro:** fondo blanco; borde/etiqueta de estado.
- **Oscuro:** superficie elevada oscura; etiquetas claras.

### Exam Question
- **Propósito:** mostrar enunciado y opciones de evaluación.
- **Estados:** sin responder, seleccionado, marcado para revisar, validación, guardado pendiente, enviado.
- **Comportamiento:** indicar número/avance, selección accesible, navegación con teclado, conservar borrador de acuerdo con política; no revelar clave.
- **Claro:** enunciado oscuro y selección azul con indicador adicional.
- **Oscuro:** texto claro y selección celeste de alto contraste.

### Calendar Cell
- **Propósito:** mostrar día y eventos permitidos.
- **Estados:** normal, hoy, seleccionado, turno, vacaciones solicitadas/aprobadas, no disponible.
- **Comportamiento:** fecha y eventos con etiqueta textual; navegación de teclado por calendario; respetar zona horaria y privacidad de otros usuarios.
- **Claro:** fondo neutro; selección con contorno azul.
- **Oscuro:** superficies oscuras; selección con contorno celeste.

### Inventory Item
- **Propósito:** resumir equipo, cantidad y condición.
- **Estados:** disponible, falta, sobrante, inspección requerida, desactualizado, pendiente de envío.
- **Comportamiento:** nombre/código, cantidad, hora de última verificación y acción autorizada; diferencias requieren explicación.
- **Claro:** fila/tarjeta blanca con texto y estado.
- **Oscuro:** superficie elevada oscura; estado indicado por texto/icono.

## Formularios e identidad

### Floating Label Input
- **Propósito:** capturar un dato con etiqueta persistente.
- **Estados:** vacío, foco, valor, error, inválido, deshabilitado, solo lectura.
- **Comportamiento:** etiqueta permanece visible; mensaje de error junto al campo; tipo de teclado apropiado; soporte autofill; no depender de placeholder.
- **Claro:** fondo blanco, borde neutro, foco azul, error rojo con texto.
- **Oscuro:** campo oscuro elevado, borde claro, foco celeste, error con texto/icono.

### Avatar
- **Propósito:** identificar visualmente al usuario autenticado.
- **Estados:** imagen disponible, iniciales, carga, error, desconocido.
- **Comportamiento:** texto alternativo/nombre accesible; no revelar datos personales en pantallas públicas; iniciales como alternativa.
- **Claro:** círculo neutro o marca azul.
- **Oscuro:** superficie clara/celeste sobre fondo oscuro, con contraste.

### Dark Mode Toggle
- **Propósito:** permitir elegir apariencia clara u oscura.
- **Estados:** claro, oscuro, sistema, foco, deshabilitado.
- **Comportamiento:** valor inicial respeta preferencia del sistema; cambio manual persiste localmente como preferencia no sensible; anunciar el modo elegido; no alterar datos ni estado de formulario.
- **Claro:** control sobre superficie clara, icono oscuro.
- **Oscuro:** control sobre superficie oscura, icono claro/celeste.

## Adjuntos

### Audio Attachment
- **Propósito:** adjuntar audio autorizado a incidente/turno.
- **Estados:** listo, grabando/seleccionado, revisando permiso, en cola offline, subiendo, recibido, fallido, rechazado.
- **Comportamiento:** mostrar duración, tamaño, origen y estado; permiso de micrófono explícito; cancelar y reintentar sin duplicar; no afirmar recepción antes de confirmación.
- **Claro:** tarjeta blanca, estado azul/rojo con texto.
- **Oscuro:** tarjeta elevada oscura, estado celeste/rojo con texto.

### Photo Attachment
- **Propósito:** adjuntar fotografía o imagen autorizada.
- **Estados:** seleccionada, vista previa, en cola, subiendo, recibida, fallida, rechazada.
- **Comportamiento:** vista previa antes del envío; revisar formato/tamaño; evitar EXIF innecesario; borrar pendiente con confirmación; acceso restringido tras carga.
- **Claro:** miniatura en superficie blanca, borde neutro.
- **Oscuro:** miniatura sobre superficie oscura, borde visible.

### Video Attachment
- **Propósito:** adjuntar video autorizado.
- **Estados:** seleccionado, procesando, en cola offline, subiendo, recibido, fallido, rechazado.
- **Comportamiento:** duración/tamaño visibles; respetar límites; permitir cancelar; proteger privacidad; mostrar progreso y reanudación solo si la plataforma lo soporta.
- **Claro:** tarjeta blanca con miniatura y texto de estado.
- **Oscuro:** tarjeta oscura con miniatura y controles claramente delimitados.
