# Distribución plana de OmniGuard App

Esta carpeta contiene los documentos de publicación preexistentes y una distribución plana generada para GitHub Pages. Los archivos que necesita el runtime quedan directamente en esta raíz; el código fuente del proyecto permanece modular.

Desde la raíz de `PWA SEGURIDAD`, regenera los artefactos con `node .\scripts\build-pages.mjs`. El proceso actualiza únicamente archivos runtime generados y conserva este README, `PUBLICACION_GITHUB_PAGES.md` y los demás documentos de publicación.

La demo usa IndexedDB en el navegador para persistencia local y un Service Worker que precarga recursos estáticos. No hay backend, autenticación, API, sincronización ni garantías de operación offline completa. La distribución no ha sido publicada; confirma autorización de marca y datos antes de desplegar.
