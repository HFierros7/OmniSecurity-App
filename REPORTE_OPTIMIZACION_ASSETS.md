# Reporte de optimizacion de assets — Fase 10

## Resultado

Se generaron derivados web para los logos de trabajo, sin editar los archivos originales de `Recursos`. La interfaz y el paquete Pages usan los derivados de 768 px. La distribucion plana ocupa aproximadamente 1.10 MiB.

| Asset fuente | Dimensiones/formato fuente | Derivado usado por la PWA | Dimensiones/formato | Peso fuente | Peso derivado | Reduccion aproximada |
|---|---|---|---|---:|---:|---:|
| `Recursos\Logo Día PN.jpg` | 2752 × 1536 JPEG | `assets\images\logo-light-web.jpg` / `07_GITHUB\logo-light.jpg` | 768 × 429 JPEG | 168.7 KiB | 25.3 KiB | 85.0% |
| `Recursos\Logo noche PN.png` | 2752 × 1536 PNG RGBA | `assets\images\logo-dark-web.png` / `07_GITHUB\logo-dark.png` | 768 × 429 PNG RGBA | 4193.9 KiB | 106.2 KiB | 97.5% |

El redimensionamiento conserva la proporcion 16:9. El logo nocturno conserva transparencia; el diurno permanece opaco. Los derivados se muestran en marcos de hasta 360 px CSS, por lo que 768 px proporciona resolucion suficiente para pantallas de alta densidad. Las copias de trabajo originales dentro de `assets\images` y los originales de `Recursos` se conservaron.

## Iconos e ilustraciones revisados

Los iconos existentes son pequenos y ya estan dimensionados para web; no se volvieron a comprimir para evitar degradar o alterar artefactos ya optimizados. Los archivos listados se incluyen en la distribucion final.

| Archivo | Dimensiones | Peso aproximado |
|---|---:|---:|
| `favicon.ico` | 16 × 16, 32 × 32 y 48 × 48 | 14.7 KiB |
| `favicon-32x32.png` | 32 × 32 | 1.8 KiB |
| `favicon-48x48.png` | 48 × 48 | 3.3 KiB |
| `apple-touch-icon.png` | 180 × 180 | 27.5 KiB |
| `icon-72x72.png` | 72 × 72 | 6.2 KiB |
| `icon-96x96.png` | 96 × 96 | 10.1 KiB |
| `icon-128x128.png` | 128 × 128 | 16.0 KiB |
| `icon-144x144.png` | 144 × 144 | 19.2 KiB |
| `icon-152x152.png` | 152 × 152 | 20.8 KiB |
| `icon-180x180.png` | 180 × 180 | 27.5 KiB |
| `icon-192x192.png` | 192 × 192 | 30.2 KiB |
| `icon-384x384.png` | 384 × 384 | 90.9 KiB |
| `icon-512x512.png` | 512 × 512 | 145.7 KiB |
| `maskable-icon-512x512.png` | 512 × 512 | 98.5 KiB |
| `splash-light-1024.png` | 1024 × 1024 | 124.6 KiB |
| `splash-dark-1024.png` | 1024 × 1024 | 107.9 KiB |

Las tres ilustraciones SVG de cursos miden 640 × 360 y pesan menos de 1 KiB cada una. Ningun icono o ilustracion vectorial excede 150 KiB. Los splash cuadrados son recursos de marca; el navegador puede generar su pantalla de inicio a partir del manifiesto y no se garantizan como splash nativos de iOS/Android.

## Alcance y observaciones

- `07_GITHUB` incluye los derivados optimizados; el logo nocturno de 4.2 MiB no se distribuye ni se precarga.
- Los datos JSON y modulos JavaScript permanecen sin minificar: no se agregaron herramientas ni dependencias de build.
- Se verificaron formatos, dimensiones, peso, transparencia del logo nocturno y existencia de iconos/recursos desde el manifiesto y la lista de precache.
- ImageMagick se utilizo localmente; los archivos fuente de `Recursos` no se modificaron.
