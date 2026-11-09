# Publicación manual del repositorio OmniGuard

Ejecutar únicamente desde la raíz de este repositorio aislado, después de revisar los archivos y recibir autorización. No usar la raíz superior `1 IData`.

## Verificación inicial

```powershell
git rev-parse --show-toplevel
git status --short
git branch --show-current
git remote -v
```

Confirmar que la raíz termina en `11_RELEASE\GITHUB_REPOSITORY`, que solo aparece contenido de OmniGuard y que no hay secretos, activos sin autorización ni archivos ajenos.

## Inicialización, commit y push

```powershell
git init
git branch -M main
git remote add origin https://github.com/HFierros7/OmniSecurity-App.git
git add .
git diff --cached --check
git diff --cached --stat
git diff --cached --name-only
git commit -m "Release v1.0 OmniGuard App"
git push -u origin main
```

Revisar el staging antes de confirmar el commit. Si `origin` ya existe, verificarlo y no ejecutar `git remote add` nuevamente. Estos comandos son una guía; no se ejecutan automáticamente.

## GitHub Pages

En GitHub abrir **Settings → Pages** y configurar el método aprobado. La alternativa recomendada es **GitHub Actions**, con un workflow revisado que genere la distribución plana desde `scripts/build-pages.mjs` y publique `07_GITHUB/`. No se incluye ni activa un workflow en este paquete.

Alternativamente, publicar el contenido de `10_ENTREGA/GITHUB_PAGES/dist/` en la raíz de una rama `gh-pages` y seleccionar `/(root)`. Después validar HTTPS, recursos, manifest, Service Worker, rutas, consola, instalación y modo offline en la URL publicada. No publicar sin aprobación de marca, datos, contenido AVSEC y repositorio.
