# Paquete de integración Oracle APEX — OmniGuard

**Fase:** 9, preparación documental
**Fecha de referencia:** 2026-11-08
**Estado:** paquete de diseño; no contiene código Oracle ni datos productivos.

**Copia de publicación:** se generalizaron identificadores personales y de cliente de demostración para esta copia aislada. El proyecto fuente conserva sus documentos originales; esta copia no debe confundirse con una reproducción binaria exacta de las fuentes.

## Uso del paquete

Leer primero `INTEGRACION_APEX.md` y `RIESGOS_INTEGRACION.md`; después el modelo/diccionario, contratos JSON, páginas y LMS. Los documentos de `FUENTES` se incluyen para mantener trazabilidad con las decisiones previas. En caso de divergencia, no alterar la fuente aprobada en silencio: registrar la diferencia y obtener resolución del dueño de datos.

## Diseño Fase 9

- `INTEGRACION_APEX.md`
- `MODELO_LOGICO_APEX.md`
- `DICCIONARIO_DATOS_APEX.md`
- `MAPEO_JSON_APEX.md`
- `PAGINAS_APEX_PROPUESTAS.md`
- `COMPONENTES_APEX.md`
- `SEGURIDAD_APEX.md`
- `LMS_MAPPING.md`
- `CHECKLIST_MIGRACION_APEX.md`
- `RIESGOS_INTEGRACION.md`
- `REPORTE_FASE_9.md`

## Fuentes de trazabilidad incluidas

En `FUENTES/` se copian solo documentos necesarios para comprender alcance, UX, contratos y curso:

- Casos de uso y mapa de navegación de Fase 1.
- Modelo de entidades, diccionario conceptual, identificadores y modelo JSON maestro de Fase 3.
- Mapeo UI APEX y biblioteca de componentes de Fase 4.
- Reporte Fase 8, referencias AVSEC e inventario visual pendiente.

## Exclusiones

- No se copió código fuente, distribución `07_GITHUB`, imágenes, bancos JSON con claves ni datos de IndexedDB.
- No se incluyen credenciales, endpoints, cadenas de conexión, exportaciones APEX, scripts SQL/PLSQL ni ORDS.
- Las plantillas JSON de Academia no son registros de carga.
- No se confirmó instancia ni versión de Oracle Database, APEX u ORDS. El integrador debe validar el entorno autorizado antes de implementar.

## Manifiesto de archivos fuente

| Archivo incluido | Documento fuente |
|---|---|
| `FUENTES/CASOS_DE_USO.md` | `01_ANALISIS/CASOS_DE_USO.md` |
| `FUENTES/MAPA_DE_NAVEGACION.md` | `01_ANALISIS/MAPA_DE_NAVEGACION.md` |
| `FUENTES/MODELO_ENTIDADES_FASE_3.md` | `03_MODELO_DATOS/MODELO_ENTIDADES.md` |
| `FUENTES/DICCIONARIO_DATOS_FASE_3.md` | `03_MODELO_DATOS/DICCIONARIO_DATOS.md` |
| `FUENTES/IDENTIFICADORES_FASE_3.md` | `03_MODELO_DATOS/IDENTIFICADORES.md` |
| `FUENTES/MODELO_JSON_MAESTRO.md` | `03_MODELO_DATOS/MODELO_JSON_MAESTRO.md` |
| `FUENTES/ORACLE_APEX_UI_MAPPING.md` | `04_UX_UI/ORACLE_APEX_UI_MAPPING.md` |
| `FUENTES/COMPONENT_LIBRARY.md` | `04_UX_UI/COMPONENT_LIBRARY.md` |
| `FUENTES/RESPONSIVE_LAYOUTS.md` | `04_UX_UI/RESPONSIVE_LAYOUTS.md` |
| `FUENTES/REPORTE_FASE_8.md` | `REPORTE_FASE_8.md` |
| `FUENTES/REFERENCIAS_AVSEC.md` | `05_ACADEMIA/AVSEC/REFERENCIAS_AVSEC.md` |
| `FUENTES/LISTA_RECURSOS_VISUALES.md` | `05_ACADEMIA/AVSEC/LISTA_RECURSOS_VISUALES.md` |

La copia facilita la transferencia; actualizarla solo mediante una nueva entrega trazable, no manualmente de forma divergente.
