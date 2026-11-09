# Riesgos de integración Oracle APEX

Riesgos documentados con base en los artefactos revisados al 2026-11-08. La prioridad cualitativa es preliminar; el dueño y la aceptación del riesgo deben asignarse por el proyecto.

| ID | Riesgo / evidencia | Impacto | Mitigación y decisión requerida |
|---|---|---|---|
| R-01 | No se confirmó instancia, versión de Oracle Database, APEX, ORDS ni endpoint; herramientas cliente Oracle no están detectadas. | Alto: no se puede validar compatibilidad, despliegue o integración real. | Obtener acceso autorizado y registrar versiones antes de elegir características, exportación, tipos o APIs. |
| R-02 | No se ha aprobado proveedor ni mecanismo de autenticación; roles/permisos no están definidos en Fase 3. | Alto: exposición de información operativa o acceso impropio. | Aprobar identidad, MFA/sesión, roles, mínimo privilegio y autorización server-side antes de diseñar producción. No asumir Entra/OAuth. |
| R-03 | La PWA usa IndexedDB local y no tiene backend/sincronización autoritativa. | Alto: estado manipulable, duplicados, conflictos entre dispositivos y ausencia de recibos del servidor. | Diseñar contratos, identidad, idempotencia, reconciliación y confirmaciones antes de sincronizar. |
| R-04 | El JSON demo de preguntas contiene `correct_option_id`; la calificación Fase 8 ocurre en el cliente. | Alto: la clave se puede inspeccionar/manipular; no es examen confiable ni certificable. | Mantener banco/clave en servidor; calcular nota y cerrar intento en capa confiable. Tratar resultados actuales como demo. |
| R-05 | Versiones/estructuras distintas se superponen: catálogo plano `cursos/unidades/lecciones`, detalle anidado AVSEC y plantillas maestras. | Medio/alto: duplicados, campos divergentes o progreso asociado a contenido incorrecto. | Definir autoridad por campo, claves/versión y validación de staging; no cargar el mismo recurso varias veces. |
| R-06 | `empresa.json` es solo metadato de visualización según su propio contrato; `configuracion.json` es estado local. | Medio: crear entidades/tablas de negocio por inferencia o mezclar preferencias con configuración global. | No crear `Empresa` ni entidad `Configuración` sin requisito/modelo aprobado; conservar separación. |
| R-07 | `DEMO-0001` y “Grupo demo” son contexto demo; `Usuario` Fase 3 no define campo empleado ni autorización del grupo. | Alto: confusión entre identidad, atributo RH y rol. | Confirmar fuente RH, semántica y exposición; usar identidad externa solo mediante contrato aprobado. |
| R-08 | `cliente.json` tiene código/estado nulos; `sitio_demo` no trae código de Servicio ni zona horaria. | Alto: no puede establecerse integridad Cliente–Servicio ni contexto operativo productivo. | Obtener maestros autorizados; no poblar datos reales a partir del demo. |
| R-09 | Incidentes e inventario están vacíos; consignas y timeline son ejemplos explícitos. | Alto si se interpretan como evidencia o instrucción real. | No migrar fixtures. Definir captura, auditoría, catálogos y sistema fuente de producción. |
| R-10 | La regla Fase 3 de Bitácora es polimórfica (`ENTIDAD_TIPO` + `ENTIDAD_ID`). | Medio/alto: una FK genérica no garantiza que el objeto exista ni pertenezca al mismo ámbito. | Elegir modelo de auditoría con integridad/retenibilidad y permisos antes de físico. |
| R-11 | Evidencia y DocumentoRH requieren archivos; almacenamiento, antivirus, cifrado, acceso, cuotas y retención no están definidos. | Alto: exposición, pérdida o carga maliciosa. | Diseñar almacenamiento privado y ciclo de vida; separar metadatos/archivo y validar en servidor. |
| R-12 | El modelo Fase 3 no representa detalle de respuestas de intento; Quiz/Resource tampoco son entidades explícitas. | Medio/alto: no se reproducen intentos ni auditoría por reactivo; modelo puede quedarse corto. | Aprobar asociaciones `BancoPreguntaPregunta`, `EvaluacionPregunta`, `RespuestaIntento`; decidir entidad Recurso y clasificación del Quiz. |
| R-13 | El modelo de referencia APA permite un ámbito principal, mientras un recurso puede citarse en varias unidades/lecciones. | Medio: duplicación o pérdida de trazabilidad. | Confirmar si se acepta una referencia por ámbito o asociación N:M versionada. |
| R-14 | Fase 8 está `DRAFT_REVIEW`, referencias tienen validación mixta y recursos visuales no existen. | Alto para cualquier uso formativo oficial. | Revisión AVSEC/jurídica, licencias y aprobación institucional antes de publicar o certificar. |
| R-15 | El catálogo estima 1,200 min y unidades de 240 min, pero las cinco lecciones se estiman en 180 min cada una. | Medio: 60 min por unidad quedan sin asignación explícita y el total aún es estimativo. | Reconciliar objetivos, contenido, práctica, evaluación y duración con diseño instruccional aprobado. |
| R-16 | PWA Pages es estática y puede cachear recursos; el contenido cliente no es barrera de seguridad. | Alto si se publican datos o secretos. | Mantener distribución plana solo con datos públicos sintéticos; excluir RH, casos reales, claves, archivos y configuración privada. |
| R-17 | Plantillas MP/SMS son `TEMPLATE` y los cursos no tienen códigos; `demo-data.json` conserva metadatos demo antiguos. | Medio: se podrían cargar placeholders o estado obsoleto. | No importar plantillas/fixtures; usar `cursos.json` y estados aprobados como lectura demo, no como catálogo productivo. |
| R-18 | Retención, jurisdicción laboral, consentimiento/localización y cierre de sesión no están definidos. | Alto: incumplimiento de privacidad y riesgo de seguridad personal. | Revisión legal/privacidad y aprobación operativa antes de recolectar datos reales. |

## Dependencias actuales

- PWA y Service Worker estáticos, archivos JSON en `assets/data`, distribución plana `07_GITHUB` y almacenamiento IndexedDB v2.
- Acceso a datos empresariales, identidad, turnos, servicios, incidencias, evidencias, asistencia, cursos asignados y RH no tiene API/backend confirmado.
- No se identificó un paquete/configuración de Oracle en el proyecto ni cliente SQL/ORDS disponible; acceso remoto no verificado.

## Decisiones críticas abiertas

1. Versiones y ambiente Oracle/APEX/ORDS; arquitectura de despliegue.
2. Sistema maestro y dueño por entidad; datos reales que pueden migrarse.
3. Autenticación, roles, aislamiento por Servicio y datos personales.
4. Modelo de asociaciones, respuestas, versiones, auditoría y storage de archivos.
5. Política offline/sincronización y autoridad sobre progreso/resultados.
6. Aprobación de contenido AVSEC, referencias y duración.

No ejecutar migraciones, crear objetos ni publicar datos hasta cerrar los riesgos de autorización alta.
