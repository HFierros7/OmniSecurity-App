# Mapeo de JSON de OmniGuard a un modelo Oracle

**Propósito:** orientar una futura importación a la propuesta lógica; no define DDL, paquetes de carga ni proceso ETL ejecutable. Oracle/APEX/ORDS no están disponibles ni versionados en el entorno auditado.

## Reglas de traducción

1. Usar `schema_version` para validar contrato y `content_version` para fijar currículo; no confundirlos.
2. Resolver códigos de negocio existentes antes de asociar referencias. No generar códigos para datos nulos ni cambiar los códigos Fase 3/Fase 8.
3. Separar maestros normalizados, contenido versionado, eventos de Usuario y preferencias. No almacenar una copia completa del JSON en una fila como sustituto del modelo relacional sin decisión de versión.
4. Cargar primero en staging lógico, validar IDs, relaciones, duplicados, versiones y estados; luego aceptar o rechazar el lote con trazabilidad.
5. Los ejemplos demo y datos públicos no son registros de producción. No cargar Cliente, personal, servicio, turno o consignas demo a una instancia real.

## Archivos `assets/data`

| Archivo | Traducción lógica | Transformación y observaciones |
|---|---|---|
| `usuario.json` | `Usuario` | `usuario.codigo`, nombres, apellidos, correo, teléfono, identidad externa y estado. `contexto_demo.employee_id` (`DEMO-0001`) no pertenece al diccionario Fase 3; decidir si es referencia RH externa. `grupo` es contexto demo, no rol ni autorización. |
| `empresa.json` | Ninguna entidad de negocio actualmente | El propio archivo marca `metadatos_visualizacion` como marca de interfaz, no entidad. Mantener como configuración de presentación aprobada; no crear `Empresa` por inferencia. |
| `cliente.json` | `Cliente`; `sitio_demo` es candidato a `Servicio` | Cliente tiene código y estado nulos. `Ubicación demo` no trae código de servicio, zona horaria ni estado. No crear filas hasta obtener fuente maestra/IDs autorizados. |
| `cursos.json` | Catálogo de `Curso` y estado de publicación | `key` es clave de interfaz (`AVSEC`, etc.), `codigo` es código de negocio. AVSEC conserva `CRS-AVSEC-001`; Mercancías Peligrosas y SMS tienen código nulo y son próximos: no crear sus cursos en producción ni inventar IDs. `porcentaje_inicial_demo` no es progreso persistente de Usuario. |
| `unidades.json` | `Unidad` con `curso_codigo` como referencia | Preservar `UNT-AVSEC-001..005`, `orden`, duración, título y estado. Resolver Curso/versión; estos registros son metadatos de catálogo parciales. |
| `lecciones.json` | `Lección` con `unidad_codigo` como referencia | Preservar `LES-AVSEC-001..005`, secuencia, duración y estado. Resolver Unidad/versión antes de cargar. |
| `avsec-course.json` | `Curso`, detalle de `Unidad`, `Lección`, `Actividad`, referencias y recursos de contenido | Documento versionado (`schema_version` 1, `content_version` 0.1.0, `DRAFT_REVIEW`). Contiene unidades anidadas, objetivos, secciones, bloques de contenido, actividad y referencias. Normalizar por código sin duplicar filas ya provenientes de `cursos.json`, `unidades.json` y `lecciones.json`; comparar campos y reportar diferencias. Los bloques multimedia/diagramas requieren un catálogo de tipos y estrategia de almacenamiento aprobados. |
| `avsec-question-bank.json` | `BancoPreguntas`, `Pregunta`, `Respuesta` y asociación `BancoPreguntaPregunta` | Mantener `BNK-AVSEC-001`, 50 `QST-AVSEC-…`, temas, opciones A–D, orden, explicación, recomendación y referencias. La respuesta correcta incluida en este JSON público es solo para demo: en producción separar/retener la clave en servidor y evitar exportarla al cliente. |
| `evaluaciones.json` | `Evaluación` y asociación `EvaluacionPregunta` | Mapear `EXM-AVSEC-001`, curso, banco, versión, 35 IDs seleccionados, 80% demo, estado `DRAFT_REVIEW`. El examen actual es de curso completo; no asignar `UNIDAD_ID`. Guardar selección/versiones para reproducir intentos. El umbral 80% no queda aprobado como política oficial. |
| `consignas.json` | Ningún registro operativo directo; forma conceptual para `Consigna` | Entradas sin código, Servicio, creador, prioridad ni vigencia y explícitamente de demostración. No importarlas como instrucciones vigentes. |
| `incidentes.json` | `Incidente` | Arreglo vacío; no contiene expedientes que migrar. Definir catálogo, acceso, retención e integración de producción antes de aceptar reportes. |
| `inventario.json` | `Equipo` e `Inventario` | Ambos arreglos están vacíos. No hay conteos ni activos reales para cargar; definir si el equipo es activo individual o tipo contabilizable. |
| `configuracion.json` | Preferencias de Usuario, solo si se aprueba persistencia de servidor | `tema` y última ruta/curso/unidad/lección son estado local de interfaz. No son reglas empresariales ni un registro de sesión seguro; evitar sincronizar rutas sensibles. |
| `lms-demo.json` | Ninguna carga curricular | Declara `DEMO_NO_ACADEMICO` y contiene flashcards placeholder de Mercancías Peligrosas. No importar como contenido formativo. |
| `demo-data.json` | Ninguna carga de negocio | Fixtures de turno, consignas, timeline, equipo y catálogo para mostrar la interfaz. Su lista de cursos es legado/demo; el loader actual toma el catálogo de `cursos.json`. No importar nombres, cliente, turno o eventos. |

## Otros contratos y estados que no son archivos maestros de `assets/data`

- `05_ACADEMIA/JSON/{AVSEC,MERCANCIAS_PELIGROSAS,SMS}` contiene plantillas estructurales basadas en `MODELO_JSON_MAESTRO.md`. Marcadores `TEMPLATE`, campos vacíos y referencias de ejemplo no son registros importables.
- `progress.json` describe un contrato de sincronización futuro, no una exportación de datos persistidos actual.
- Referencias Fase 8 están dentro de `avsec-course.json` y se enlazan mediante `reference_refs`; las citas deben conservar estado de verificación y no asumir aprobación curricular.
- No hay JSON maestro de `Turno`, `Servicio`, `Evidencia`, `Resultado`, `Vacación` ni `DocumentoRH`. Su ausencia no autoriza a inventar cargas iniciales.

## Persistencia actual IndexedDB (demo local)

La PWA usa `omniguard-local-demo`, versión IndexedDB 2. Los registros usan claves locales y no incluyen por sí mismos una identidad Oracle, FK o contrato de sincronización.

| Almacén local | Correspondencia lógica candidata | Límite para una migración |
|---|---|---|
| `users` | Perfil `Usuario` | Contiene una identidad demo basada en `employeeId`; no es autenticación ni una referencia de identidad validada. |
| `settings` | Preferencias de Usuario/configuración de cliente | Tema y valores locales; no son roles ni configuración empresarial. Migrar solo preferencias aprobadas. |
| `logbook` | `Bitácora` | Eventos locales de incidentes/SOS y acciones demo; objetivo polimórfico y hora local requieren validación. No aceptar como auditoría de servidor. |
| `incidents` | `Incidente` | Estados `LOCAL`; no tienen folio/confirmación de servidor. Revalidar campos, actor, servicio y autorización. |
| `evidences` | Metadatos de `Evidencia` | Registros locales asociados al incidente; no asumir que el archivo está en storage autorizado ni que fue recibido. |
| `courses` | Contexto de Curso seleccionado por el cliente | Es un registro `current` de navegación, no maestro/asignación de Curso. |
| `progress` | `Progreso` | Guarda agregado por `courseKey`/versión; el modelo Fase 3 exige objetivo Lección o Actividad. No insertar como avance granular sin reconciliar eventos. |
| `evaluations` | Estado de práctica/evaluación demo | Clave `demo:<courseKey>`; no es una Evaluación ni Resultado oficial. |
| `navigation` | Ninguna entidad de negocio | Última ruta reanudable; dato de interfaz. No importar URLs/rutas como actividad operativa. |
| `sosHistory` | Ninguna entidad de producción aprobada | El estado es `SIMULADO`; no representa alerta enviada. Solo diseñar un evento operativo si se aprueban destinatario, canal y protocolo. |
| `activities` | `Actividad`, `Progreso` o finalización de Lección | Guarda respuestas/completitud local; separar finalización de recurso y resultado antes de sincronizar. |
| `flashcards` | Estado local de actividad de práctica | Control de tarjeta aprendida/posición, actualmente demo MP; no contiene asignación ni progreso oficial. |
| `quizzes` | `Resultado` de práctica + eventual `RespuestaIntento` | Incluye selección/respuestas y resultado local por curso/unidad; mapear a configuración versionada de evaluación y mantener clave fuera del cliente. |
| `examAttempts` | Intento en curso asociado a `Resultado` | Guardado local editable; no cuenta con control autoritativo de tiempo/intentos ni firma de servidor. |
| `examResults` | `Resultado` demo | Tiene estado `DEMO_NO_CERTIFICABLE`; no convertir en calificación oficial ni constancia. |
| `learningStats` | Agregado derivable de actividad/progreso | Métricas locales de estudio; recalcular desde eventos confirmados si se requiere, no tratarlas como fuente primaria. |

Estos almacenes son estado de cliente, no tablas de servidor ni un contrato de sincronización. Antes de migrar datos reales definir exportación consentida, identidad, idempotencia, conflicto, retención, validación y limpieza local.

## Proceso documental de carga

1. Confirmar propietario, ambiente, versiones Oracle y autorización de datos.
2. Aprobar un contrato de importación versionado, normalización, encoding, zona horaria y catálogo de estados.
3. Crear una matriz de códigos y referencias; detectar duplicados entre catálogo plano y paquete anidado AVSEC.
4. Rechazar automáticamente registros demo/no aprobados, códigos nulos requeridos, referencias faltantes y claves de evaluación no válidas.
5. Preservar versión de Curso, Banco y Evaluación; nunca mezclar un intento con contenido de otra versión.
6. Validar conteos, relaciones, bitácora e idempotencia; registrar resultado de lote y errores sin secretos.
7. El integrador implementará el proceso aprobado en la herramienta autorizada de Fase 10; aquí no se entregan scripts.
