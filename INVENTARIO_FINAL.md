# Inventario del repositorio OmniGuard App

## Alcance y estado

Este inventario describe la copia aislada preparada para revisión previa a publicación. Incluye la PWA modular, su distribución plana para GitHub Pages, documentación de diseño para una futura integración con Oracle APEX y entregables operativos. No hay repositorio Git inicializado ni publicación remota.

Los valores personales y de cliente de la demostración se generalizaron únicamente en esta copia. El árbol exhaustivo se entrega como artefacto de revisión en la carpeta `11_RELEASE` del proyecto fuente y no forma parte del repositorio.

## Directorios

| Ruta | Propósito | Estado |
|---|---|---|
| `01_ANALISIS/` | Análisis y requisitos del proyecto | Incluido |
| `02_ARQUITECTURA/` | Decisiones y vistas de arquitectura | Incluido |
| `03_MODELO_DATOS/` | Modelo lógico y entidades | Incluido |
| `04_UX_UI/` | Lineamientos y documentación de interfaz | Incluido |
| `05_ACADEMIA/` | Documentación de cursos y evaluaciones | Incluido |
| `06_ORACLE_APEX/` | Diseño y documentación de integración APEX | Incluido; sin objetos ejecutables |
| `07_GITHUB/` | Distribución web plana generada desde la fuente | Incluido; 85 archivos runtime |
| `08_RECURSOS_TECNICOS/` | Referencias técnicas del proyecto | Incluido |
| `09_PRUEBAS/` | Documentación de pruebas y QA | Incluido |
| `10_ENTREGA/` | Entregables Pages, Oracle y documentación | Incluido |
| `app/` | Lógica cliente y persistencia IndexedDB | Incluido |
| `assets/` | Datos JSON, iconos e imágenes del runtime | Incluido |
| `components/` | Componentes de interfaz modulares | Incluido |
| `docs/` | Documentación complementaria | Incluido |
| `manifest/` | Material de apoyo para el manifiesto PWA | Incluido |
| `pages/` | Vistas funcionales de la aplicación | Incluido |
| `scripts/` | Entrada de cliente y generador de Pages | Incluido |
| `styles/` | Estilos de la aplicación | Incluido |

## Archivos principales

- `index.html`, `manifest.json`, `service-worker.js`: entrada y capacidades PWA.
- `README.md`, `.gitignore`, `INSTRUCCIONES_PUSH_GITHUB.md`: orientación y configuración del repositorio.
- `OMNIGUARD_MASTER_ARCHITECTURE.md`, `ESTADO_PROYECTO.md` y reportes de fases: contexto documental.
- `10_ENTREGA/GITHUB_PAGES/dist/`: copia plana para publicación Pages; sus 85 archivos runtime coinciden por SHA-256 con `07_GITHUB/`.
- `10_ENTREGA/ORACLE_APEX/`: 12 documentos de entrega Oracle y su índice.
- `10_ENTREGA/DOCUMENTACION/`: dos guías, manual Markdown y manual PDF de cinco páginas.

## Exclusiones conocidas

No se incluyen los originales de `Recursos/`, respaldos de logos, archivos temporales, entornos locales, secretos, dependencias instaladas ni metadatos Git. Los logos web incluidos en `assets/` requieren autorización de marca antes de una publicación pública.

El paquete Oracle es documental; la PWA es una demostración cliente sin backend, autenticación, sincronización ni base de datos Oracle. El contenido AVSEC conserva su estado de revisión editorial.
