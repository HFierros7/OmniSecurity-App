# Checklist de migración de OmniGuard PWA a Oracle APEX

Este checklist prepara el trabajo del integrador; no equivale a una instalación ni autoriza cambios de datos/infraestructura. No contiene SQL/PL/SQL, código ORDS ni números de página.

## 1. Gobierno, alcance y acceso

- [ ] Confirmar patrocinador, dueño de cada dominio de datos y aprobadores de negocio/seguridad.
- [ ] Confirmar ambiente Oracle autorizado, conectividad y credenciales mediante el mecanismo seguro aprobado.
- [ ] Registrar versiones reales de Oracle Database, APEX y ORDS; consultar documentación oficial de esas versiones.
- [ ] Confirmar tema APEX, despliegue, estrategia de backup/restore y límites de infraestructura.
- [ ] Delimitar piloto: AVSEC únicamente está en estado `DRAFT_REVIEW`; MP/SMS no tienen código ni contenido.
- [ ] Separar demo, datos sintéticos, datos de prueba y datos productivos; aprobar uso de nombre de Cliente y datos de Usuario.
- [ ] Documentar alcance/exclusiones y aprobar criterios de aceptación.

## 2. Arquitectura y decisiones de modelo

- [ ] Revisar `MODELO_LOGICO_APEX.md`, `DICCIONARIO_DATOS_APEX.md` y `LMS_MAPPING.md`.
- [ ] Aprobar las 23 entidades Fase 3, identificadores, unicidad y estrategia de claves técnicas.
- [ ] Resolver asociaciones de BancoPregunta/Pregunta, Evaluación/Pregunta y detalle de respuestas de intento.
- [ ] Resolver Bitácora polimórfica, padre exclusivo de Evidencia y reutilización de ReferenciaAPA.
- [ ] Decidir si `Recurso` requiere entidad propia y cómo representar bloques/contenido multimedia.
- [ ] Definir campos de identidad externos y si existe un identificador RH como `DEMO-0001`; no mapearlo a `Usuario.CODIGO` sin aprobación.
- [ ] Aprobar catálogos, transiciones de estado, zona horaria, retención y datos requeridos.
- [ ] Establecer arquitectura APEX/Database/API por versión, con límites y decisiones registradas; no presuponer ORDS.

## 3. Identidad, seguridad y privacidad

- [ ] Seleccionar y aprobar el mecanismo de autenticación; documentar MFA, recuperación, expiración y revocación.
- [ ] Aprobar matriz de roles y permisos; aplicar autorización por página, proceso, descarga y fila en servidor.
- [ ] Probar acceso directo a URL, manipulación de parámetros, cambio de IDs y acceso a registros ajenos.
- [ ] Definir políticas para incidentes, consignas, ubicación, multimedia, RH, vacaciones, progreso y evaluaciones.
- [ ] Definir manejo de secretos, HTTPS, sesión, CSRF, límites de carga, retención y auditoría según versiones.
- [ ] Asegurar que la clave correcta de evaluación no se entregue al navegador ni a exportaciones públicas.
- [ ] Determinar contenido permitido offline y tratamiento de datos locales al cerrar sesión/revocar permisos.

## 4. Contratos y datos

- [ ] Revisar `MAPEO_JSON_APEX.md` y `03_MODELO_DATOS/MODELO_JSON_MAESTRO.md`.
- [ ] Aprobar `schema_version`, versiones de Curso/Banco/Evaluación, locale, estados y formato de fechas/zona horaria.
- [ ] Marcar explícitamente qué JSON son catálogos, contenido, fixtures demo, preferencias o eventos.
- [ ] No cargar `demo-data.json`, consignas ilustrativas, identidades demo ni bancos con claves a producción.
- [ ] Resolver los códigos nulos de Cliente, Servicio y cursos futuros; no inventar códigos ni filas.
- [ ] Comparar el catálogo plano AVSEC con `avsec-course.json` y fijar autoridad por campo para evitar duplicados/conflictos.
- [ ] Validar referencias, conteos, claves, estados y duplicados en staging antes de cualquier importación.
- [ ] Definir un lote auditable, idempotente y reversible; registrar registros aceptados/rechazados sin datos sensibles.
- [ ] Definir cómo se conservarán intentos históricos frente a cambios de contenido.
- [ ] Definir migración consentida desde IndexedDB solo si existe necesidad; no tratarla como base confiable.

## 5. Construcción APEX (posterior a aprobación)

- [ ] Confirmar el diseño de páginas lógicas y componentes APEX para la versión/tema disponibles.
- [ ] Establecer navegación por rol y proteger las rutas directas.
- [ ] Construir primero identidad/perfil autorizado y catálogos operativos requeridos.
- [ ] Implementar operaciones con transacciones, errores explícitos, idempotencia y auditoría.
- [ ] Implementar carga/lectura de archivos con almacenamiento y controles aprobados.
- [ ] Implementar catálogo/Curso/Unidad/Lección/Actividad con publicación versionada.
- [ ] Implementar quiz y examen con selección, guardado, intentos, puntuación y claves calculadas en servidor.
- [ ] Separar funciones de autoría, revisión y publicación de contenido.
- [ ] Añadir integración API/ORDS solo cuando su necesidad, versión, autenticación y contrato estén aprobados.

## 6. Pruebas y aceptación

- [ ] Validar integridad referencial, reglas de cardinalidad y transiciones.
- [ ] Ejecutar pruebas de autorización positiva/negativa para cada rol y alcance de servicio.
- [ ] Probar entrada/salida duplicada, operaciones repetidas, caída de red y respuesta parcial.
- [ ] Probar intento abierto, recuperación, entrega duplicada, versión retirada y resultado inmutable.
- [ ] Probar accesibilidad de teclado/lector de pantalla, contraste, zoom y diseño responsive en navegadores objetivo.
- [ ] Verificar que errores de backend/archivo/red no generen estado de éxito aparente.
- [ ] Probar restauración de backup y procedimientos de reversión en ambiente no productivo.
- [ ] Registrar navegador, ambiente, datos sintéticos, comandos, resultados y pendientes; no afirmar pruebas sin evidencia.

## 7. Corte y entrega

- [ ] Aprobar contenido AVSEC, referencias y evaluación antes de habilitar para capacitación formal.
- [ ] Aprobar explícitamente cualquier comunicación de certificación o constancia; la Fase 8 no la provee.
- [ ] Documentar configuración por ambiente sin secretos, operación, monitoreo y soporte.
- [ ] Confirmar plan de migración, respaldo, ventana de corte y rollback con dueño de datos.
- [ ] Exportar/importar artefactos APEX solo en el formato que soporte la versión confirmada.
- [ ] Confirmar que GitHub Pages siga siendo una demo aislada y no publique datos ni secretos.
- [ ] Obtener aceptación del responsable Oracle y del dueño de negocio antes de producción.
