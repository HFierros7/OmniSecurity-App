# OmniGuard App — Responsive Layouts

## Breakpoints propuestos

Valores de diseño en CSS px para especificar composición, no para clasificar el dispositivo. El contenido debe adaptarse por espacio disponible y orientación.

| Rango | Enfoque | Navegación principal |
|---|---|---|
| Móvil: hasta 767 px | Una columna, prioridad a acciones y lectura vertical | Bottom Navigation |
| Tablet: 768–1023 px | Una o dos columnas según ancho; formularios y listados más amplios | Bottom Navigation; filtros secundarios en panel contextual |
| Desktop: desde 1024 px | Contenido centrado con ancho legible; listas y detalle en paneles | Sidebar persistente |

**Transformación:** Bottom Navigation cambia a Sidebar al alcanzar 1024 px de ancho de viewport. Entre 768 y 1023 px se conserva la navegación inferior de cuatro módulos; no se cambia por dispositivo o sistema operativo. Si hay zoom o poco espacio efectivo, permitir modo compacto sin ocultar etiquetas esenciales.

## Esquemas

### Móvil

```text
+------------------------+
| Header / contexto      |
+------------------------+
| Contenido de la página |
| Tarjetas / formulario  |
| Acciones principales   |
|                        |
+------------------------+
| Inicio Oper. Acad. Perfil|
+------------------------+
```

Respetar áreas seguras, barra del navegador, teclado virtual y scroll. La navegación inferior no debe cubrir botones ni mensajes.

### Tablet

```text
+--------------------------------------+
| Header / servicio / conexión         |
+--------------------------------------+
| Navegación inferior persistente      |
+----------------------+---------------+
| Lista / filtros      | Detalle o     |
|                      | acción        |
|                      |               |
+----------------------+---------------+
```

La segunda columna aparece solo cuando el ancho permite lectura; evitar columnas estrechas en formularios/examen.

### Desktop

```text
+--------------+----------------------------------------+
| Sidebar      | Header / contexto / perfil              |
| Inicio       +----------------------------------------+
| Operaciones  | Contenido principal        | Detalle    |
| Academia     | cards/lista/formulario      | contextual|
| Perfil       |                             | opcional  |
+--------------+----------------------------------------+
```

Sidebar persistente; la columna de detalle es opcional, no duplica navegación.

## Comportamiento por módulo

### Inicio

- **Móvil:** resumen en una columna; estado de turno y acción vigente primero; tarjetas compactas y SOS visible según protocolo.
- **Tablet:** tarjetas en dos columnas cuando no pierdan prioridad; resumen y avisos.
- **Desktop:** panel de resumen, lista de actividad y detalle contextual; no exponer datos de terceros.

### Operaciones

- **Móvil:** selector de servicio/turno claro; listas con estado y hora; formularios paso a paso; captura de evidencia desde detalle.
- **Tablet:** lista y detalle en dos paneles; filtros secundarios en hoja/panel.
- **Desktop:** filtros laterales y lista/detalle; formularios con grupos cortos y confirmación visible.
- Check In/Out y SOS conservan una jerarquía de acción explícita en todos los tamaños.

### Academia

- **Móvil:** navegación vertical de curso/unidad/lección; controles de evaluación grandes y uno por bloque; progreso visible.
- **Tablet:** catálogo en dos columnas y contenido en lectura; índice plegable.
- **Desktop:** catálogo en grilla; navegación de curso lateral y contenido central; evitar texto en columnas demasiado largas.

### Perfil

- **Móvil:** secciones apiladas; calendario simplificado; solicitudes con campos progresivos.
- **Tablet:** calendario y detalle en paneles; privacidad de información personal.
- **Desktop:** calendario amplio y panel de detalle; nómina/documentos solo después de autorización y nunca en demo pública.

## Reglas transversales

- Formularios apilan columnas en móvil; preservar orden de lectura, etiquetas y errores.
- Tablas se convierten en tarjetas/listas o permiten scroll anunciado; no ocultar campos críticos.
- Dialogs grandes pasan a bottom sheet/página completa en móvil; foco y acción de cierre permanecen disponibles.
- En horizontal o con ampliación de texto, conservar navegación, SOS y operaciones sin solapamiento.
- Verificar Safari iOS, navegadores Android, teclado, orientación, zoom y tamaños pequeños. La emulación no sustituye pruebas físicas.
