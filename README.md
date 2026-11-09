# OmniGuard App

PWA estática de demostración para seguridad operativa y aprendizaje. La fuente se mantiene modular; `07_GITHUB/` y `10_ENTREGA/GITHUB_PAGES/dist/` contienen distribuciones planas independientes.

## Alcance

- Inicio, Operaciones, Academia y Perfil.
- Curso AVSEC de demostración, en revisión editorial (`DRAFT_REVIEW`).
- Persistencia local IndexedDB y caché estática con Service Worker.
- Paquete documental para una futura integración con Oracle APEX.

Mercancías Peligrosas y SMS están disponibles próximamente. No se implementan autenticación real, backend, sincronización, Oracle Database/APEX/ORDS ni alertas SOS reales. No usar para operaciones, asistencia, capacitación o certificación oficiales ni para almacenar datos reales.

## Ejecución local

Servir la raíz del proyecto mediante HTTP/HTTPS; no abrir `index.html` con `file://`. Para regenerar la distribución plana desde esta raíz:

```powershell
node .\scripts\build-pages.mjs
```

La salida se genera en `07_GITHUB/`. Las instrucciones y el checklist de Pages están en `10_ENTREGA/GITHUB_PAGES/`.

## Integración Oracle

`06_ORACLE_APEX/` y `10_ENTREGA/ORACLE_APEX/` son documentos de diseño, no implementación. Confirmar versiones y acceso autorizado a Oracle Database, APEX y ORDS antes de desarrollar o migrar datos.

## Entrega

Los valores personales y de cliente de la demo fueron generalizados en esta copia de publicación; el proyecto fuente original no se modificó. Los logos web son recursos de marca y requieren autorización antes de publicar. El material AVSEC sigue en revisión y el banco de preguntas reside en el cliente.

La persistencia IndexedDB es local al perfil/origen y no sincroniza ni respalda información. Consulta `10_ENTREGA/DOCUMENTACION/` para las guías y el manual integrador.
