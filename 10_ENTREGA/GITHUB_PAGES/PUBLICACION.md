# Publicacion en GitHub Pages

## Estado

Este paquete no se publico ni configura Pages automaticamente. El repositorio `HFierros7/OmniSecurity-App`, su remoto y la configuracion actual de Pages no se verificaron desde este entorno.

## Artefacto

La carpeta `dist` es la raiz estatica a desplegar. Contiene los archivos de runtime directamente en su raiz y no incluye documentacion tecnica completa. No publicar la carpeta del proyecto fuente.

Para regenerar la distribucion en el proyecto fuente, ejecutar desde `PWA SEGURIDAD`:

```powershell
node .\scripts\build-pages.mjs
```

La salida generada es `07_GITHUB`; la copia entregable queda en `10_ENTREGA\GITHUB_PAGES\dist`.

La aplicacion utiliza rutas relativas y se verifico en la raiz del servidor local y bajo `/OmniSecurity-App/`. El enrutamiento interno usa fragmentos `#/...`, por lo que no necesita un fallback HTTP individual por pantalla.

Para refrescar el paquete despues de regenerar Pages, copiar los archivos runtime (no Markdown) y revisar el inventario:

```powershell
Get-ChildItem .\07_GITHUB -File |
  Where-Object Extension -ne ".md" |
  Copy-Item -Destination .\10_ENTREGA\GITHUB_PAGES\dist -Force
```

Esta copia no elimina archivos obsoletos; comparar el inventario y retirar solo archivos puntuales que ya no se utilicen.

## Rama y configuracion recomendadas

Mantener el codigo fuente modular en `main` y configurar **Settings > Pages > Build and deployment > Source: GitHub Actions**. El flujo, cuando se autorice y configure, debe generar Pages desde `scripts/build-pages.mjs` y publicar el contenido de `07_GITHUB` como raiz del artefacto Pages. En PowerShell de Windows se ejecuta `node .\scripts\build-pages.mjs`; en un runner Ubuntu, `node ./scripts/build-pages.mjs`. Este paquete no incluye ni activa un workflow de despliegue.

Como alternativa manual, utilizar una rama `gh-pages` cuyo contenido publicado sea el contenido plano de `dist`, y configurar Pages para servir `gh-pages` desde `/(root)`. No seleccionar la subcarpeta `07_GITHUB` como origen de rama: GitHub Pages no la ofrece como carpeta de publicacion arbitraria en ese modo.

Verificar primero que el repositorio y la rama elegidos corresponden al destino autorizado. No asumir que `main`, `gh-pages`, Pages o el remoto estan configurados actualmente.

## Verificacion posterior al despliegue

- Abrir la URL Pages asignada y confirmar que el sitio carga bajo la ruta del repositorio.
- Revisar en DevTools que `manifest.json`, iconos, CSS, modulos, JSON y Service Worker carguen sin errores ni 404.
- Confirmar que `start_url` y `scope` del manifiesto son relativos al sitio y que el Service Worker controla la ruta publicada.
- Probar login demo, Inicio, Operaciones, Academia, Curso AVSEC, quiz, examen y Perfil.
- Probar modo claro/oscuro, persistencia local y navegacion offline basica despues de la primera carga con conexion.
- Revisar tamanos movil, tableta y escritorio, ademas de la instalacion PWA en dispositivos objetivo.
- Confirmar HTTPS, autorizacion de marca y datos, y que no se incorporaron datos reales o secretos.

## Limitaciones

El cache offline solo cubre recursos estaticos; no hay sincronizacion ni backend. AVSEC continua en revision editorial y las evaluaciones del cliente son demostrativas, no certificables. Los PNG `splash-*-1024` son recursos graficos cuadrados y no sustituyen los splash de lanzamiento especificos de cada dispositivo.
