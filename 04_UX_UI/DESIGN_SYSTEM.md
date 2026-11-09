# OmniGuard App — Design System

## Alcance

Especificación visual y de interacción para la PWA responsive de guardias operativos. Los tokens son una base de diseño que debe validarse con usuarios, navegador real y versión de Oracle APEX objetivo. No representa una implementación.

## Filosofía de diseño

Priorizar claridad operativa, lectura rápida en campo y acciones seguras en situaciones de presión. La interfaz debe sentirse consistente en GitHub Pages demo y en una futura experiencia integrada con Oracle APEX, sin presentar datos de demostración como información real.

## Principios UX

1. **Orientación inmediata:** mostrar quién está autenticado, servicio activo, estado de turno, conexión y vigencia de datos.
2. **Jerarquía por criticidad:** separar acciones frecuentes de acciones críticas; SOS destaca, no se confunde con un botón primario normal.
3. **Estado inequívoco:** distinguir confirmado, pendiente offline, sincronizando y fallido. Nunca simular que una operación fue aceptada por el servidor.
4. **Prevención y recuperación:** validar antes de enviar, evitar duplicados, permitir corregir datos reversibles y confirmar consecuencias irreversibles.
5. **Accesibilidad:** lectura con contraste, ampliación de texto, foco visible, teclado, lector de pantalla y estados no codificados solo por color.
6. **Mobile-first y trabajo contextual:** controles alcanzables con pulgar, formularios breves, lectura por bloques y datos vigentes del servicio seleccionado.
7. **Privacidad por diseño:** mínima exposición de nómina, RH, incidentes, ubicación y evidencias; no usar información sensible en la demo pública.
8. **Offline honesto:** contenido cacheado y acciones pendientes se identifican con hora/versionado; SOS, asistencia y aprobación no se confirman sin respuesta autoritativa.

## Apple Human Interface Guidelines aplicable

Referencia consultada: [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/), incluidos [Design principles](https://developer.apple.com/design/Human-Interface-Guidelines/design-principles), [Accessibility](https://developer.apple.com/design/Human-Interface-Guidelines/accessibility), [Color](https://developer.apple.com/design/Human-Interface-Guidelines/color), [Layout](https://developer.apple.com/design/Human-Interface-Guidelines/layout) y [Typography](https://developer.apple.com/design/Human-Interface-Guidelines/typography), consultados el 2026-11-08.

Adaptar sus principios —propósito, agencia, responsabilidad, familiaridad, flexibilidad, simplicidad y cuidado del detalle— al navegador móvil, sin afirmar que una PWA equivale a una aplicación nativa. Respetar preferencias de apariencia, tamaños de texto, contraste aumentado, orientación, áreas seguras de iPhone, navegación táctil y reducción de movimiento. Usar jerarquía clara, agrupación, revelado progresivo y patrones familiares.

## UIUX.Build aplicable

Se consultó `https://uiux.build` el 2026-11-08. El sitio mostró una página de dominio disponible para compra, no una guía, biblioteca o metodología de diseño verificable. Por ello no se atribuyen reglas ni componentes a UIUX.Build. La referencia queda pendiente de una URL o material vigente proporcionado por el proyecto.

## Consideraciones UX de Oracle APEX

- Confirmar versión de APEX y tema antes de fijar nombres/capacidades concretos.
- Preferir componentes, formularios, regiones, navegación y validaciones nativos disponibles en esa versión; personalizar solo cuando exista una necesidad documentada.
- Mantener autorización en servidor. Ocultar una región o botón no constituye seguridad.
- Formularios: etiquetas persistentes, errores junto al campo y resumen accesible; no usar placeholder como única etiqueta.
- Dynamic Actions y diálogos son opciones de interacción conceptual, no deben contener reglas de autorización exclusivamente del cliente.
- Probar en Safari iOS, Android y escritorio; la configuración responsive de APEX debe coexistir con la navegación de la PWA.
- Una demo estática en GitHub Pages no puede proteger datos ni reemplaza autenticación/servicios APEX. Usar datos ficticios y no incluir nómina, documentos RH, evidencias privadas ni secretos.

## Color Tokens

Los cinco colores oficiales conservan sus valores. Los neutros son tokens de soporte para legibilidad, no sustituyen la paleta corporativa.

| Token | Valor | Uso |
|---|---|---|
| `brand.primary` | `#1B365D` | Marca, encabezados, navegación y texto principal sobre superficie clara |
| `brand.action` | `#005A9C` | Enlaces y acciones sobre fondos claros |
| `brand.accent` | `#60C1E5` | Acento, selección y superficies de modo oscuro; no usar como texto pequeño sobre blanco |
| `brand.accentSoft` | `#A0E0EF` | Fondos/indicadores decorativos; no usar como texto sobre blanco |
| `status.critical` | `#DC2626` | SOS y errores críticos; reservar para significado crítico |
| `surface.light` | `#FFFFFF` | Superficie clara |
| `surface.lightSubtle` | `#F5F8FC` | Fondo de página claro |
| `text.light` | `#1B365D` | Texto primario en claro |
| `text.lightSecondary` | `#425466` | Texto secundario en claro |
| `border.light` | `#D8E1EA` | Separadores y bordes en claro |
| `surface.dark` | `#0B1726` | Fondo oscuro de soporte |
| `surface.darkRaised` | `#132A3D` | Tarjetas y paneles elevados en oscuro |
| `text.dark` | `#F3F8FC` | Texto principal en oscuro |
| `text.darkSecondary` | `#C2D3E1` | Texto secundario en oscuro |
| `border.dark` | `#36516A` | Separadores en oscuro |

### Contraste orientativo

Relaciones calculadas con la fórmula de luminancia relativa WCAG para los colores indicados; verificar de nuevo para cada combinación y estado final.

| Combinación | Contraste | Uso recomendado |
|---|---:|---|
| `#1B365D` sobre blanco | 12.12:1 | Texto y controles |
| `#005A9C` sobre blanco | 7.14:1 | Enlaces y texto de acción |
| `#60C1E5` sobre blanco | 2.05:1 | No usar para texto normal ni límites esenciales |
| `#A0E0EF` sobre blanco | 1.46:1 | Solo fondo/decoración no informativa |
| `#DC2626` con texto blanco | 4.83:1 | SOS/acción crítica con texto legible |
| `#60C1E5` sobre `#0B1726` | 8.81:1 | Acento/texto en modo oscuro |
| `#A0E0EF` sobre `#0B1726` | 12.37:1 | Acento/texto en modo oscuro |

No usar `#DC2626` como texto pequeño sobre el fondo oscuro propuesto sin una verificación adicional; contraste calculado 3.73:1. Ningún estado dependerá únicamente del color.

## Typography Tokens

Usar fuentes de sistema para no cargar fuentes remotas ni aumentar dependencias. En dispositivos Apple, permitir la fuente de sistema del navegador; no redistribuir fuentes propietarias.

| Token | Tamaño / interlineado | Peso | Uso |
|---|---|---|---|
| `type.family` | Sans-serif del sistema | — | SF del sistema Apple, Roboto/sistema Android, Segoe UI/sistema Windows; sin fuente descargada |
| `type.display` | 32 / 40 px | 700 | Título excepcional de inicio |
| `type.h1` | 28 / 36 px | 700 | Título de página |
| `type.h2` | 24 / 32 px | 600 | Secciones principales |
| `type.h3` | 20 / 28 px | 600 | Tarjetas y subsecciones |
| `type.body` | 17 / 24 px | 400 | Lectura y formularios |
| `type.bodyStrong` | 17 / 24 px | 600 | Etiquetas y datos destacados |
| `type.secondary` | 15 / 20 px | 400 | Metadatos |
| `type.caption` | 13 / 16 px | 500 | Solo metadatos no esenciales; nunca error crítico |
| `type.button` | 17 / 22 px | 600 | Acciones |

Los tamaños son px de diseño web y no equivalen automáticamente a puntos tipográficos nativos de Apple; probar legibilidad en Safari. No bajar campos interactivos de 16 px CSS sin validar el zoom de Safari iOS. Permitir ampliación de texto y reflujo; no truncar instrucciones, errores o datos críticos.

## Radius Tokens

| Token | Valor | Uso |
|---|---:|---|
| `radius.xs` | 4 px | Chips y controles compactos |
| `radius.sm` | 8 px | Campos y botones |
| `radius.md` | 12 px | Tarjetas |
| `radius.lg` | 16 px | Paneles y bottom sheets |
| `radius.xl` | 24 px | Superficies promocionales |
| `radius.pill` | 999 px | Avatar, indicador o botón cápsula cuando corresponda |

## Shadow Tokens

Usar elevación discreta; en oscuro preferir cambio de superficie y borde a sombras intensas.

| Token | Tratamiento | Uso |
|---|---|---|
| `shadow.none` | Sin sombra | Diseño plano, tablas y listas |
| `shadow.card` | Desplazamiento vertical 1 px, difusión 3 px, opacidad aproximada 12% | Tarjeta separada del fondo |
| `shadow.raised` | Desplazamiento vertical 4 px, difusión 12 px, opacidad aproximada 14% | FAB o menú flotante |
| `shadow.overlay` | Desplazamiento vertical 8 px, difusión 24 px, opacidad aproximada 24% | Diálogo/bottom sheet modal |

## Motion Tokens

| Token | Valor | Uso |
|---|---:|---|
| `motion.quick` | 120 ms | Respuesta de pulsación |
| `motion.standard` | 180 ms | Cambio de estado/control |
| `motion.navigation` | 220 ms | Cambio de vista y panel |
| `motion.emphasis` | 300 ms máximo | Progreso o transición compleja no crítica |

Easing sugerido: salida suave para entrada de elementos; entrada suave para cierre; evitar rebotes. Reducir o eliminar movimiento cuando el sistema indique preferencia de movimiento reducido. La animación nunca retrasará SOS, envío ni confirmación.

## Z-Index Tokens

| Token | Nivel | Uso |
|---|---:|---|
| `layer.base` | 0 | Contenido |
| `layer.sticky` | 10 | Header o navegación persistente |
| `layer.menu` | 20 | Menús y popovers |
| `layer.fab` | 30 | FAB no crítico |
| `layer.scrim` | 40 | Fondo de modal |
| `layer.modal` | 50 | Bottom sheet o diálogo |
| `layer.toast` | 60 | Aviso temporal sobre la vista |

SOS no se coloca encima de controles de confirmación ni oculta contenido; su ubicación y capa deben mantenerse consistentes.
