# OmniGuard App — Wireframes textuales

Wireframes conceptuales, no especificaciones de pixel ni código. Los bloques representan jerarquía y contenido adaptable; la composición exacta depende de pruebas con usuarios y plataforma.

## Login

```text
+--------------------------------+
|          OmniGuard             |
| Seguridad operativa            |
|                                |
| Correo / usuario               |
| [________________________]     |
| Contraseña / proveedor SSO     |
| [________________________]     |
| [ Iniciar sesión           ]   |
| ¿Necesitas ayuda?              |
|                                |
| Privacidad  |  Estado servicio |
+--------------------------------+
```

No mostrar datos del demo ni credenciales; error accesible bajo el campo correspondiente.

## Inicio

```text
+--------------------------------+
| OmniGuard   Servicio ▾   Perfil|
| Estado: En línea / Sin conexión|
+--------------------------------+
| Hola, Carlos                   |
| Centro de Distribución         |
| Cliente demo - Ubicación demo|
| Turno de hoy                   |
| 08:00–16:00 | Estado: activo   |
| [ Check In / Check Out ]       |
+--------------------------------+
| Consignas vigentes       Ver > |
| • 2 pendientes de lectura      |
+--------------------------------+
| Accesos rápidos                |
| [Operaciones] [Academia]       |
| Curso asignado | Progreso      |
+--------------------------------+
|             [ SOS ]            |
| Inicio | Operac. | Academia | Perfil |
+--------------------------------+
```

SOS aparece solo según protocolo; su estado de entrega debe ser explícito.

## Operaciones

```text
+--------------------------------+
| ← Operaciones     Servicio ▾   |
+--------------------------------+
| [ Turno actual / estado ]      |
| [ Check In ] [ Check Out ]     |
+--------------------------------+
| Operaciones                    |
| [Consignas]   [Incidentes]     |
| [Inventario]  [Evidencias]     |
+--------------------------------+
| Actividad reciente             |
| Hora | Evento | Estado         |
| [Detalle de evento          >] |
+--------------------------------+
| Inicio | Operac. | Academia | Perfil |
+--------------------------------+
```

## Academia

```text
+--------------------------------+
| ← Academia       Buscar curso  |
+--------------------------------+
| Asignados | Catálogo           |
| [Curso AVSEC]                  |
| Progreso: █████░░░ 60%         |
| Versión / duración             |
| [ Continuar ]                  |
+--------------------------------+
| Otros cursos                   |
| [Curso] [Estado] [Ver detalle] |
+--------------------------------+
| Inicio | Operac. | Academia | Perfil |
+--------------------------------+
```

## Perfil

```text
+--------------------------------+
| ← Perfil                       |
+--------------------------------+
| (Avatar) Usuario de demostración  |
| Usuario demo: DEMO-0001          |
+--------------------------------+
| Mi cuenta                      |
| Calendario                     |
| Solicitar vacaciones           |
| Nómina (si está autorizada)    |
| Documentos RH (privado)        |
| Preferencias / Apariencia      |
| Cerrar sesión                  |
+--------------------------------+
| Inicio | Operac. | Academia | Perfil |
+--------------------------------+
```

El identificador demo y el nombre solo deben aparecer en ambiente de demostración controlado.

## Curso

```text
+--------------------------------+
| ← Academia       Curso AVSEC   |
+--------------------------------+
| Objetivo y versión             |
| Duración | Requisitos          |
| Progreso general               |
+--------------------------------+
| Unidades                       |
| 1. Fundamentos       Completa  |
| 2. Procedimientos    En curso  |
| 3. Evaluación        Bloqueada |
+--------------------------------+
| [ Continuar unidad ]           |
+--------------------------------+
```

## Lección

```text
+--------------------------------+
| ← Unidad        Lección 2 de 5 |
| Progreso de la unidad          |
+--------------------------------+
| Título de lección              |
| Objetivos                      |
|                                |
| Contenido / recurso accesible  |
|                                |
+--------------------------------+
| Referencias / actividad        |
| [ Completar actividad ]        |
| [ Anterior ]       [ Siguiente ]|
+--------------------------------+
| Guardado: confirmado/pendiente |
+--------------------------------+
```

## Evaluación

```text
+--------------------------------+
| ← Evaluación   Pregunta 3 de 10|
| Tiempo/estado según política   |
+--------------------------------+
| Enunciado de pregunta          |
| ( ) Opción A                   |
| ( ) Opción B                   |
| ( ) Opción C                   |
+--------------------------------+
| [Marcar para revisar]          |
| [Anterior]       [Siguiente]   |
| [Revisar y entregar]           |
+--------------------------------+
| Guardado: estado confirmado    |
+--------------------------------+
```

Los controles deben soportar teclado/lector de pantalla; confirmar entrega antes del cierre irreversible y no exponer respuestas correctas durante el intento.
