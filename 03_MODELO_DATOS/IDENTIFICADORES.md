# Convenciones de identificadores — OmniGuard App

## Principios

- Separar la clave técnica de base de datos, el código legible de negocio y el identificador público usado en integraciones.
- **Clave técnica:** `ID` numérico interno como candidato para PK Oracle. Generación con identity/sequence u otro mecanismo aprobado después de confirmar versión; nunca construir mediante `MAX(ID)+1`.
- **Código de negocio:** texto estable, legible y único por entidad. Usar mayúsculas ASCII y guiones; no incluir nombres, correo, teléfono ni otros datos personales.
- **Identificador público:** para APIs o enlaces no confiables, preferir una referencia opaca e impredecible; no exponer IDs secuenciales por defecto. Formato y generación pendientes.
- Los códigos no cambian al renombrar títulos o mover contenido. Usar un campo separado para versión.
- APEX Ready describe compatibilidad de diseño, no confirma instancia, esquema ni versión Oracle.

## Formatos propuestos

| Entidad | Prefijo/patrón | Ejemplo | Observaciones |
|---|---|---|---|
| Usuario | `USR-{secuencia}` | `USR-0001` | Código interno; no usar como secreto ni factor de autorización |
| Turno | `TRN-{secuencia}` | `TRN-000001` | Secuencia del sistema |
| Cliente | `CLI-{secuencia}` | `CLI-0001` | Sin razón social en el código |
| Servicio | `SRV-{secuencia}` | `SRV-0001` | Sin coordenadas o nombre sensible |
| Consigna | `CNS-{secuencia}` | `CNS-0001` | Identificador estable de la instrucción |
| Incidente | `INC-{secuencia}` | `INC-000001` | No codificar severidad o identidad personal |
| Bitácora | `LOG-{secuencia}` | `LOG-000001` | Acceso restringido |
| Evidencia | `EVD-{secuencia}` | `EVD-000001` | No revelar localizador del archivo |
| Inventario | `INV-{secuencia}` | `INV-000001` | Diferenciar de código del equipo |
| Equipo | `EQP-{secuencia}` | `EQP-0001` | Número de serie es atributo separado |
| Curso | `CRS-{tema}-{secuencia}` | `CRS-AVSEC-001` | El tema es una abreviatura controlada |
| Unidad | `UNT-{tema}-{secuencia}` | `UNT-AVSEC-001` | Código estable dentro del catálogo |
| Lección | `LES-{tema}-{secuencia}` | `LES-AVSEC-001` | La versión editorial va separada |
| Actividad | `ACT-{tema}-{secuencia}` | `ACT-AVSEC-001` | La versión editorial va separada |
| Pregunta | `QST-{tema}-{secuencia}` | `QST-AVSEC-0001` | No codificar la respuesta correcta |
| Respuesta | `RSP-{tema}-{secuencia}` | `RSP-AVSEC-0001` | Opción asociada a una pregunta |
| BancoPreguntas | `BNK-{tema}-{secuencia}` | `BNK-AVSEC-001` | Versionar por campo aparte |
| Evaluación | `EXM-{tema}-{secuencia}` | `EXM-AVSEC-001` | Intentos tienen códigos propios |
| Resultado | `RES-{secuencia}` | `RES-000001` | Restringir acceso a resultados individuales |
| Progreso | `PRG-{secuencia}` | `PRG-000001` | No incluir el ID del usuario en el código |
| DocumentoRH | `DHR-{secuencia}` | `DHR-000001` | Código sensible, no publicable |
| Vacación | `VAC-{año}-{secuencia}` | `VAC-2026-0001` | El año ayuda a clasificación, no a autorización |
| ReferenciaAPA | `REF-{tema}-{secuencia}` | `REF-AVSEC-001` | Código editorial estable |

Los ejemplos son ilustrativos, no códigos reservados ni datos existentes.

## Reglas de generación y validación

- La secuencia debe ser atómica y segura ante concurrencia; usar mecanismo aprobado por versión/plataforma, nunca cálculo manual desde registros existentes.
- Aplicar unicidad al código dentro del ámbito definido. Por defecto se propone unicidad global por entidad; confirmar si hay catálogos multiempresa.
- Definir longitud máxima y normalización antes de crear columnas; no truncar silenciosamente.
- Para cursos y recursos versionados, separar `CODIGO` de `VERSION_CONTENIDO`; referencias históricas deben resolver la versión exacta.
- Registrar fecha, actor y motivo si un código necesita corrección administrativa; no reutilizar códigos retirados.
- Validar prefijo, caracteres y estructura en el servidor; la validación del navegador es complementaria.
- Los códigos incrementales pueden revelar volumen o secuencia; APIs externas deben utilizar identificadores opacos y controles de acceso.
