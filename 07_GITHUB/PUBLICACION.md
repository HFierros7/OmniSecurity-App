# Publicacion en GitHub Pages

## Estado

La distribucion esta preparada, pero no se publico ni se modifico la configuracion del repositorio. El repositorio `HFierros7/OmniSecurity-App`, su remoto y la configuracion de Pages no se verificaron desde este entorno.

## Artefacto que se publica

1. Desde la raiz `PWA SEGURIDAD`, ejecutar `node .\scripts\build-pages.mjs`.
2. Revisar la distribucion plana generada en `07_GITHUB`.
3. Para la entrega preparada, usar los archivos de `10_ENTREGA\GITHUB_PAGES\dist`. La raiz de `dist` contiene los archivos web directamente; no publicar la carpeta del proyecto fuente ni la documentacion que acompana el paquete.

La aplicacion utiliza rutas relativas y se verifico tanto en la raiz del servidor local como bajo `/OmniSecurity-App/`. El enrutamiento interno usa fragmentos `#/...`, por lo que no requiere una regla de fallback HTTP para cada pantalla.

Para actualizar la copia entregable despues de regenerar `07_GITHUB`, copiar los archivos runtime (no Markdown) a `dist` y revisar el inventario antes de publicar:

```powershell
Get-ChildItem .\07_GITHUB -File |
  Where-Object Extension -ne ".md" |
  Copy-Item -Destination .\10_ENTREGA\GITHUB_PAGES\dist -Force
```

La copia no elimina archivos obsoletos de `dist`; comparar el inventario y retirar solo los artefactos puntuales que ya no se utilicen.

## Rama y configuracion recomendadas

Mantener el codigo modular en `main` y configurar **Settings > Pages > Build and deployment > Source: GitHub Actions**. El flujo de despliegue, cuando se autorice y configure, debe generar Pages desde `scripts/build-pages.mjs` y publicar el contenido de `07_GITHUB` como artefacto raiz. En PowerShell de Windows se ejecuta `node .\scripts\build-pages.mjs`; en un runner Ubuntu, `node ./scripts/build-pages.mjs`. Este paquete no incluye ni activa un workflow de despliegue.

Como alternativa manual, utilizar una rama `gh-pages` cuyo contenido publicado sea el contenido plano de `10_ENTREGA\GITHUB_PAGES\dist`, y configurar Pages para servir `gh-pages` desde `/(root)`. No seleccionar la subcarpeta `07_GITHUB` como origen de rama: GitHub Pages no la ofrece como carpeta de publicacion arbitraria en ese modo.

Verificar primero que el repositorio y la rama elegidos corresponden al destino autorizado. No se debe asumir que `main`, `gh-pages`, Pages o el remoto estan configurados actualmente.

## Verificacion posterior al despliegue

- Abrir la URL Pages asignada y confirmar que el sitio carga bajo la ruta del repositorio.
- Revisar en DevTools que `manifest.json`, los iconos, CSS, modulos, JSON y Service Worker carguen sin errores ni 404.
- Confirmar que el manifiesto declara `start_url` y `scope` relativos al sitio y que el Service Worker controla la ruta publicada.
- Probar login demo, Inicio, Operaciones, Academia, Curso AVSEC, quiz, examen y Perfil.
- Probar modo claro/oscuro, persistencia local y navegacion offline basica despues de la primera carga con conexion.
- Revisar los tamanos movil, tableta y escritorio, ademas de la instalacion PWA en dispositivos objetivo.
- Confirmar HTTPS, autorizacion de marca y datos, y que no se incorporaron datos reales o secretos.

## Limitaciones

El cache offline solo cubre recursos estaticos; no hay sincronizacion ni servicio backend. AVSEC continua en revision editorial y las evaluaciones de cliente son demostrativas, no certificables. Los PNG `splash-*-1024` son recursos graficos cuadrados y no sustituyen los splash de lanzamiento especificos de cada dispositivo.
