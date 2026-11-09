# Manual del integrador — OmniGuard App y Oracle APEX

**Estado:** guía de transferencia documental; no es una implementación Oracle.  
**Fecha de referencia:** 2026-11-08  
**Fuente principal:** `06_ORACLE_APEX/` y `10_ENTREGA/ORACLE_APEX/`.

## 1. Resumen ejecutivo

OmniGuard es una PWA estática de demostración con código fuente modular, recursos JSON, LMS AVSEC y persistencia IndexedDB local. El proyecto fue preparado documentalmente para una futura migración a Oracle APEX: hay modelo lógico, diccionario, mapeo JSON, páginas/componentes propuestos, lineamientos de seguridad, mapeo LMS, riesgos y checklist.

No existe implementación de Oracle Database, APEX u ORDS en este paquete. No se generaron tablas, SQL, PL/SQL, REST, exportación APEX ni conexión de base de datos. El ambiente, sus versiones y acceso no están confirmados; deben verificarse antes de diseñar objetos físicos o usar características específicas.

## 2. Arquitectura general

### PWA actual

- Presentación: `pages/` y `components/`.
- Lógica cliente: `app/` y `scripts/main.js`.
- Persistencia local: `app/persistence/` con IndexedDB v2.
- Datos demo/contenido: `assets/data/`.
- Estilos y shell: `styles/`, `index.html`, `manifest.json` y Service Worker.
- Publicación web: distribución plana independiente `07_GITHUB/`; la fuente permanece modular.

La PWA no implementa autenticación real, API, sincronización ni servidor autoritativo. Sus datos locales son editables, específicos del origen/perfil y no deben cargarse a Oracle como hechos confirmados sin política de migración.

### Objetivo de integración

Oracle debe convertirse en autoridad de identidad/autorización, transacciones, asistencia/incidentes, calificaciones y resultados cuando el dueño del sistema lo apruebe. La PWA actual no es un contrato de sincronización ni un diseño físico para la futura solución.

## 3. Estructura del proyecto

| Ruta | Responsabilidad |
|---|---|
| `01_ANALISIS/` | Requisitos, casos de uso, navegación y alcance. |
| `02_ARQUITECTURA/` | Arquitectura funcional y decisiones. |
| `03_MODELO_DATOS/` | Entidades, diccionario, identificadores y contratos JSON fuente. |
| `04_UX_UI/` | Patrones, componentes y mapeo UX/APEX. |
| `05_ACADEMIA/` | Contenido AVSEC, referencias y plantillas de cursos futuros. |
| `06_ORACLE_APEX/` | Diseño conceptual y guía de integración Oracle. |
| `07_GITHUB/` | Distribución web plana y documentos de publicación. |
| `09_PRUEBAS/` | Matriz, defectos y checklist de Fase 11. |
| `10_ENTREGA/ORACLE_APEX/` | Paquete documental Oracle con índice y fuentes seleccionadas. |
| `10_ENTREGA/GITHUB_PAGES/` | `dist/` plano más instrucciones y checklist de Pages. |
| `app/`, `components/`, `pages/`, `assets/`, `styles/`, `scripts/` | Implementación fuente modular de la demo. |

El inventario detallado está en [`INVENTARIO_FINAL.md`](../../INVENTARIO_FINAL.md).

## 4. Modelo de datos

El modelo lógico de Fase 3 contiene 23 entidades conceptuales:

- **Operación e identidad:** Usuario, Turno, Cliente, Servicio, Consigna, Incidente, Bitácora, Evidencia, Equipo e Inventario.
- **Aprendizaje:** Curso, Unidad, Lección, Actividad, Pregunta, Respuesta, BancoPreguntas, Evaluación, Resultado, Progreso y ReferenciaAPA.
- **Recursos Humanos:** DocumentoRH y Vacación.

El modelo de entidades y el diccionario conceptual de Fase 3 son la fuente de verdad. `MODELO_LOGICO_APEX.md` y `DICCIONARIO_DATOS_APEX.md` trasladan la propuesta a Oracle en términos lógicos; no prescriben DDL, tipos físicos, longitud de columnas ni claves implementadas.

`Empresa` no está aprobada como entidad; `empresa.json` representa metadatos de interfaz. No hay entidad `Quiz` ni `Recurso` en las 23: resolver su representación antes de crear tablas.

## 5. Identificadores

- `ID`: clave técnica lógica candidata. Mecanismo físico pendiente de la versión y decisión Oracle.
- `CODIGO`: identificador de negocio legible y estable, único por entidad según política aprobada. Ejemplos reales del contenido demo incluyen `CRS-AVSEC-001`, `UNT-AVSEC-001..005`, `LES-AVSEC-001..005`, `ACT-AVSEC-001..005`, `BNK-AVSEC-001`, `QST-AVSEC-0001..0050` y `EXM-AVSEC-001`.
- Identificadores de APIs/enlaces expuestos deben ser opacos y controlados por autorización; el código de negocio no es secreto ni permiso.
- `DEMO-0001` es un `employee_id` de contexto demo, no una credencial, autorización ni equivalencia aprobada de `Usuario.CODIGO`.
- Mercancías Peligrosas y SMS tienen código nulo; no asignar IDs por inferencia.

Consultar `03_MODELO_DATOS/IDENTIFICADORES.md` para formatos candidatos y reglas de generación.

## 6. JSON utilizados

El mapeo cubre 15 archivos en `assets/data/`:

`usuario.json`, `empresa.json`, `cliente.json`, `consignas.json`, `incidentes.json`, `inventario.json`, `cursos.json`, `unidades.json`, `lecciones.json`, `evaluaciones.json`, `configuracion.json`, `avsec-course.json`, `avsec-question-bank.json`, `lms-demo.json` y `demo-data.json`.

No tienen todos el mismo propósito:

- Catálogo/contenido estructurado: `cursos.json`, `unidades.json`, `lecciones.json`, `evaluaciones.json`, paquete AVSEC y banco de preguntas.
- Perfil/configuración visual demo: `usuario.json`, `empresa.json`, `configuracion.json`.
- Fixtures o estructuras vacías/incompletas: `demo-data.json`, `lms-demo.json`, `consignas.json`, `incidentes.json`, `inventario.json`.

`empresa.json` no debe crear una entidad Empresa. Cliente/Servicio y los cursos futuros tienen códigos nulos; no completar por suposición. Las plantillas `05_ACADEMIA/JSON/` y `progress.json` son contratos/plantillas, no exportaciones transaccionales.

Antes de cualquier importación: validar `schema_version`, `content_version`, códigos, relaciones, duplicados, estado de aprobación, claves y zona horaria. No importar identidades, turnos, consignas, incidentes, adjuntos ni claves demo a un ambiente real.

## 7. IndexedDB

Base local: `omniguard-local-demo`, versión de esquema 2, con 16 almacenes:

`users`, `settings`, `logbook`, `incidents`, `evidences`, `courses`, `progress`, `evaluations`, `navigation`, `sosHistory`, `activities`, `flashcards`, `quizzes`, `examAttempts`, `examResults` y `learningStats`.

Son datos de navegador, no tablas Oracle ni contrato de sincronización. Claves locales no equivalen a PK/FK; no hay identidad de servidor, control confiable de permisos, idempotencia, reconciliación ni validación autoritativa. Los incidentes y SOS se marcan como demo/local; los resultados no son certificables.

Si se aprueba migrar datos, definir primero consentimiento/base, identidad, alcance, selección de registros, versiones, zona horaria, deduplicación, conflictos, retención, limpieza local y respuesta de servidor. La migración no debe copiar la base completa ni confiar en campos calculados por el cliente.

## 8. LMS

El flujo lógico objetivo es Curso versionado → Unidad → Lección → Actividad → Preguntas/Respuestas → Evaluación → Resultado → Progreso. El servidor debe fijar versión y conjunto de preguntas, aplicar permisos, controlar intentos y calcular resultados.

Decisiones pendientes en Fase 9:

- `BancoPreguntaPregunta` para la relación N:M de banco y pregunta.
- `EvaluacionPregunta` o snapshot versionado para conservar la selección exacta.
- `RespuestaIntento` si se requiere auditoría por reactivo/reanudación.
- Resolver `Quiz` como `Evaluación` de práctica y/o `Actividad`.
- Decidir si `Recurso` amerita entidad propia por licencias, metadatos, reutilización y archivos.
- Resolver la bitácora polimórfica y la regla de padre exclusivo de Evidencia.

El contenido publicado debe ser inmutable por versión; una modificación crea una nueva versión. El porcentaje, aprobado y la clave no se aceptan como verdad si provienen únicamente del navegador.

## 9. Curso AVSEC

- Título: **CERTIFICACIÓN AVSEC — OFICIAL DE SEGURIDAD AEROPORTUARIA**.
- Cinco unidades, 50 reactivos en el banco, cinco preguntas por quiz y examen demo de 35 reactivos.
- El 80% (28 correctas) es solo umbral demostrativo.
- Código de curso `CRS-AVSEC-001`; versión `0.1.0`; estado `DRAFT_REVIEW`.
- Mercancías Peligrosas y SMS permanecen como “Disponible próximamente”, sin contenido aprobado.

El curso requiere revisión editorial/técnica AVSEC, revisión jurídica de referencias, licencias y aprobación institucional. El banco de preguntas incluye claves en el cliente estático; ocultarlas en la UI no las protege. No usar para instrucción operacional, certificación ni evaluación oficial.

## 10. Oracle APEX Ready

“APEX Ready” significa que existe documentación conceptual para que un integrador diseñe la solución una vez aprobado el entorno. **No** significa que haya base de datos, APEX, ORDS, objetos, páginas, autenticación, exportación o pruebas disponibles.

En la auditoría tecnológica del 2026-11-08 no se confirmó instancia ni versiones de Oracle Database/APEX/ORDS, y no se probaron endpoints. Confirmar acceso autorizado y consultar documentación Oracle oficial correspondiente a las versiones reales antes de fijar decisiones.

No asumir proveedor de identidad, Entra ID, OAuth, SSO ni una configuración de seguridad. Autorización server-side y privilegio mínimo son requisitos de diseño, sujetos a aprobación.

## 11. Carpetas Oracle APEX

- [`06_ORACLE_APEX/`](../../06_ORACLE_APEX/): modelo lógico, diccionario, mapeo JSON, páginas, componentes, seguridad, LMS, checklist de migración, riesgos e integración.
- [`10_ENTREGA/ORACLE_APEX/`](../ORACLE_APEX/): 24 archivos Markdown: índice, once documentos de diseño/reporte y doce fuentes de trazabilidad. No contiene código, datos JSON, credenciales, SQL/PLSQL ni exportación APEX.
- [`10_ENTREGA/ORACLE_APEX/INDICE_CONTENIDO.md`](../ORACLE_APEX/INDICE_CONTENIDO.md): alcance, exclusiones y manifiesto de fuentes incluidas.

Las copias de FUENTES sirven para la transferencia; no editarlas divergentemente de los documentos fuente.

## 12. Proceso recomendado de migración

1. **Gobierno y ambiente:** obtener dueños de datos, patrocinio, aprobaciones, acceso autorizado y versiones reales Oracle/APEX/ORDS.
2. **Resolver decisiones:** identidad/roles, claves, catálogos, autorizaciones por servicio, asociaciones LMS, auditoría, archivos, retención y fuentes maestras.
3. **Diseño físico:** aprobar modelo relacional, restricciones y estrategia de versiones. Definir instalación/actualización/reversión solamente para el ambiente confirmado.
4. **Contrato y datos:** clasificar cada JSON; excluir fixtures y códigos nulos; validar staging, cardinalidades, duplicados, idempotencia y auditoría.
5. **Seguridad:** implementar identidad, autorización server-side, archivos privados, protección de datos, auditoría y configuración por ambiente.
6. **Construcción:** usar componentes APEX nativos cuando proceda; implementar primero dominio operativo aprobado y después el LMS/versionado.
7. **Pruebas:** integridad, roles, acceso directo, entradas duplicadas, errores, versiones, intentos, accesibilidad, respaldo y reversión.
8. **Piloto/corte:** aprobar contenido AVSEC, migración, monitoreo y soporte. Obtener aceptación de dueño de negocio y responsable Oracle antes de producción.

Seguir [`CHECKLIST_MIGRACION_APEX.md`](../../06_ORACLE_APEX/CHECKLIST_MIGRACION_APEX.md); no empezar cargas/despliegues mientras los riesgos altos estén abiertos.

## 13. Riesgos y pendientes

- Entorno y versiones de Oracle no confirmados; integración no probada.
- Autenticación, roles, sistema maestro y permisos sin decisión.
- Demo IndexedDB editable, sin cifrado ni sincronización; la PWA no es autoridad.
- Claves del examen expuestas en los JSON cliente; AVSEC `DRAFT_REVIEW`.
- Datos demo y campos/códigos nulos; discrepancias entre JSON plano/anidado y duraciones curriculares.
- Storage/retención de Evidencia y DocumentoRH, privacidad, jurisdicción y bitácora pendientes.
- Git remoto, rama y Pages no configurados ni verificados.

El detalle y las mitigaciones están en [`RIESGOS_INTEGRACION.md`](../../06_ORACLE_APEX/RIESGOS_INTEGRACION.md) y [`SEGURIDAD_APEX.md`](../../06_ORACLE_APEX/SEGURIDAD_APEX.md).

## 14. Inventario de entregables

- Fuente PWA modular y datos/recursos demo en el proyecto.
- Distribución plana `07_GITHUB/`.
- Copia de distribución `10_ENTREGA/GITHUB_PAGES/dist/`, instrucciones y checklist.
- Paquete Oracle documental de Fase 9.
- Matriz, defectos, checklist y reporte QA de Fase 11.
- Este manual y su PDF de lectura.

Los conteos y estado por archivo están en [`INVENTARIO_FINAL.md`](../../INVENTARIO_FINAL.md).

## 15. Guía rápida para el integrador

1. Leer primero `10_ENTREGA/ORACLE_APEX/INDICE_CONTENIDO.md`, `INTEGRACION_APEX.md` y `RIESGOS_INTEGRACION.md`.
2. Revisar modelo lógico, diccionario, identificadores Fase 3 y contratos JSON.
3. Validar `MAPEO_JSON_APEX.md`, `LMS_MAPPING.md`, `SEGURIDAD_APEX.md` y el checklist.
4. Confirmar con dueños de negocio las decisiones abiertas; no inferir códigos, campos, roles o proveedor.
5. Confirmar ambiente, versiones y acceso Oracle autorizado. Si no existen, mantener la solución en diseño.
6. No cargar fixtures, no importar IndexedDB como fuente confiable y no publicar claves de respuesta.
7. Registrar decisiones, scripts/artefactos que se creen, pruebas reales y pendientes en una entrega posterior trazable.

## Referencias principales

- [`06_ORACLE_APEX/INTEGRACION_APEX.md`](../../06_ORACLE_APEX/INTEGRACION_APEX.md)
- [`06_ORACLE_APEX/MODELO_LOGICO_APEX.md`](../../06_ORACLE_APEX/MODELO_LOGICO_APEX.md)
- [`06_ORACLE_APEX/DICCIONARIO_DATOS_APEX.md`](../../06_ORACLE_APEX/DICCIONARIO_DATOS_APEX.md)
- [`06_ORACLE_APEX/MAPEO_JSON_APEX.md`](../../06_ORACLE_APEX/MAPEO_JSON_APEX.md)
- [`06_ORACLE_APEX/LMS_MAPPING.md`](../../06_ORACLE_APEX/LMS_MAPPING.md)
- [`06_ORACLE_APEX/CHECKLIST_MIGRACION_APEX.md`](../../06_ORACLE_APEX/CHECKLIST_MIGRACION_APEX.md)
- [`06_ORACLE_APEX/RIESGOS_INTEGRACION.md`](../../06_ORACLE_APEX/RIESGOS_INTEGRACION.md)
