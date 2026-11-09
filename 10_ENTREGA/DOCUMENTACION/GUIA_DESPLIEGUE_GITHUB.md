# Guía de despliegue — GitHub Pages

**Proyecto:** OmniGuard App  
**Estado:** paquete local preparado; repositorio remoto y Pages no verificados ni publicados.  
**Artefacto:** `10_ENTREGA/GITHUB_PAGES/dist/`

## 1. Estructura y artefactos

El proyecto conserva dos productos distintos:

- **Fuente modular:** raíz de `PWA SEGURIDAD`, con `app/`, `pages/`, `components/`, `assets/`, `styles/` y `scripts/`.
- **Distribución plana:** `07_GITHUB/`, generada por `node .\scripts\build-pages.mjs`. Contiene el runtime en una sola raíz con nombres estables.
- **Paquete de publicación:** `10_ENTREGA/GITHUB_PAGES/dist/` contiene la copia de distribución; fuera de `dist` están únicamente las instrucciones y el checklist de publicación.

No despliegues el código fuente como si fuera la raíz web ni incluyas `Recursos/`, archivos de trabajo o el paquete Oracle APEX en el artefacto Pages. La copia de `dist` debe coincidir con `07_GITHUB` y no contener documentos no requeridos por el sitio.

## 2. Rama y estrategia recomendadas

- Usar `main` para el código fuente y la documentación del repositorio dedicado `HFierros7/OmniSecurity-App`.
- Preferir **Settings → Pages → Build and deployment → Source: GitHub Actions**. Un workflow autorizado debe generar la salida con `scripts/build-pages.mjs` y publicar el contenido plano de `07_GITHUB` como raíz del artefacto.
- No existe un workflow de despliegue creado en esta fase.
- Como alternativa manual, publicar el contenido de `dist` en la raíz de la rama `gh-pages` y configurar Pages para servir `/(root)`. No seleccionar una subcarpeta arbitraria del repositorio como raíz en el modo de publicación por rama.
- Confirmar repositorio, propietario, rama, URL y permisos antes de modificar la configuración.

## 3. Preparación y validaciones

Antes de publicar:

1. Confirmar que el repositorio Git dedicado tiene como raíz el proyecto OmniGuard. El `git` local inspeccionado en esta fase tiene como raíz la carpeta superior `1 IData`, no `PWA SEGURIDAD`, y no muestra un remoto configurado. No ejecutar `git add .` desde esa raíz.
2. Revisar `git status`, origen, rama y contenido preparado. Excluir material ajeno al proyecto, secretos, datos reales y archivos no aprobados.
3. Regenerar `07_GITHUB` desde el proyecto fuente y sincronizar el paquete `dist`; verificar nombres, recursos y hashes.
4. Ejecutar `node --check` sobre el generador y el Service Worker; probar enlaces, imports, JSON, manifest, iconos y precache.
5. Revisar navegación, consola y red; probar Chrome y Edge y viewports móvil, tableta y escritorio. Las pruebas emuladas no sustituyen dispositivos físicos.
6. Confirmar HTTPS, privacidad, derechos de marca/contenido, datos de demostración y aprobación para publicación.

La Fase 11 dejó verificaciones locales en Chrome/Edge, en la raíz del servidor y bajo `/OmniSecurity-App/`. El manifest usa rutas relativas, y el Service Worker v11 permite navegación offline básica después de precargar recursos. El checklist detallado está en [`CHECKLIST_PUBLICACION.md`](../GITHUB_PAGES/CHECKLIST_PUBLICACION.md).

## 4. Publicación autorizada

1. Crear o confirmar el repositorio remoto dedicado `HFierros7/OmniSecurity-App`.
2. Revisar los cambios y confirmar que solo contienen archivos aprobados.
3. Publicar mediante el workflow autorizado o la rama `gh-pages` preparada con la raíz plana.
4. Activar Pages en Settings y confirmar que el origen corresponde al método elegido.
5. No ejecutar publicación desde esta guía; esta fase no autoriza commits, push ni despliegue.

Para los comandos Git manuales y sus salvaguardas, consulta [`INSTRUCCIONES_PUSH_GITHUB.md`](../../INSTRUCCIONES_PUSH_GITHUB.md).

## 5. Verificación posterior

En la URL HTTPS real:

- Abrir Inicio y verificar manifest, iconos, módulos JavaScript, CSS, datos JSON e imágenes sin errores ni 404.
- Comprobar `start_url`, `scope`, registro/actualización del Service Worker y control de la ruta del repositorio.
- Recorrer Inicio, Operaciones, Academia, AVSEC, quiz, examen y Perfil; confirmar cursos futuros como “Disponible próximamente”.
- Revisar modo claro/oscuro, persistencia local, navegación offline básica y responsive.
- Repetir pruebas de instalación en dispositivos físicos objetivo.
- Confirmar que Pages no exponga archivos privados, claves de respuesta ni datos reales.

AVSEC sigue en `DRAFT_REVIEW`; el banco y la calificación en cliente son demostrativos. IndexedDB no sincroniza ni ofrece respaldo. Estas limitaciones deben mostrarse al destinatario y no se resuelven por publicar el sitio.
