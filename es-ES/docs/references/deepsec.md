# Lagune vs. Deepsec: dos enfoques de seguridad con IA, frente a frente

> Una referencia que compara Lagune y Deepsec, de Vercel, en cómo funcionan, ciclo de vida, detección, coste, hallazgos y cierre.

URL canónica: https://lagune.ai/es-ES/docs/references/deepsec
Idioma: es-ES
Original: https://lagune.ai/docs/references/deepsec
Última actualización: 2026-11-09

[Lagune](https://github.com/wellwelwel/lagune) y [Deepsec](https://github.com/vercel-labs/deepsec) (`v2.2.1`) son dos respuestas defensivas al mismo problema: la seguridad en la era del desarrollo asistido por IA. Su premisa, su principio, su desarrollo y su final, y la forma en que cada uno se presenta al usuario difieren por diseño, incluso donde sus mecanismos coinciden.

**Consejo**

¿Lagune se inspira en Deepsec? No. Lagune está escrito desde cero y se inspira en Spec-Driven Development y en Security Hardening. Los dos proyectos se desarrollaron de forma independiente, y esta comparación sirve para ayudar a los usuarios a entender sus diferencias.

## De un vistazo

| Aspecto            | Lagune                                                                                                                    | Deepsec                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Tipo               | Una metodología (SDH) con una implementación de referencia                                                                | Un producto: un escáner de vulnerabilidades impulsado por agentes                                |
| Centro de gravedad | Un charter y el conocimiento bajo demanda guían al agente, con hooks deterministas como base                              | Una amplia red de regex alimenta una investigación obligatoria con IA                            |
| Qué produce        | Código bastionado, pruebas y una cadena de hallazgos en seguimiento                                                       | Un informe de hallazgos clasificados y ordenados por gravedad                                    |
| Toca tu código     | Sí: `harden` edita tu código                                                                                              | No: solo análisis estático, emite hallazgos y texto con recomendaciones                          |
| Ejecución          | Funciona con el agente y el modelo que ya usas, de cualquier gama                                                         | Ejecuta su propio pipeline de modelos, con un modelo puntero por defecto                         |
| Primeros pasos     | Una instalación de plugin o `npx skills add`, y luego lo guías en lenguaje sencillo, sin montar ninguna herramienta nueva | Montar un espacio de trabajo `.deepsec/`, instalar las dependencias y añadir una clave de modelo |

## Cómo funciona

En Lagune, el agente va primero: lleva el control, carga bajo demanda el conocimiento que corresponde a lo que es el código y delega en los hooks deterministas la parte que estos pueden decidir.

En Deepsec, lo determinista va primero: un análisis amplio señala candidatos que indican a un modelo obligatorio qué investigar y juzgar.

| Aspecto             | Lagune                                                                                                                | Deepsec                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Orden               | El charter y el conocimiento que coincide con el código guían al agente, que delega en los hooks y juzga el resto     | Los matchers señalan candidatos, y el modelo investiga y juzga cada uno   |
| Papel determinista  | Hooks multilenguaje que devuelven un veredicto u orientan al agente, combinados con el conocimiento de las categorías | Matchers que señalan candidatos para que el modelo obligatorio los juzgue |
| Flujo de desarrollo | `/lagune` construye de forma segura sobre la marcha mientras programas                                                | Revisa código, no lo escribe                                              |
| Flujo de auditoría  | `charter` → `detect` → `plan` → `harden` → `verify`                                                                   | `scan` → `process` → `triage` → `revalidate` → `report`                   |
| El papel de la IA   | Razonar a partir del conocimiento, aplicar la corrección y demostrar que se sostiene                                  | Investigar cada candidato e informar de los hallazgos                     |

## Ciclo de vida

Lagune actúa antes, durante y después de escribir el código. Deepsec revisa un repositorio cuando el código ya existe.

| Momento                    | Lagune                                                                                      | Deepsec                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Antes de que exista código | `charter` crea una política de seguridad a partir de la intención declarada                 | Parte de código existente: `init` necesita un directorio                     |
| Durante el desarrollo      | `/lagune` construye de forma segura por defecto sobre la marcha, sin dejar ningún artefacto | Revisa después del desarrollo, no durante                                    |
| Sobre código existente     | `detect` → `plan` → `harden` → `verify`                                                     | `scan` → `process`, el flujo principal                                       |
| Revisión continua          | Vuelve a ejecutar las fases por ámbito, sin un filtro de CI listo para usar                 | Nuevo análisis incremental, con `process --diff` como filtro de salida en CI |

## Capa de detección

Las dos capas deterministas son de naturaleza opuesta: una decide y la otra señala.

| Aspecto          | Lagune                                                                                           | Deepsec                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Agrupación       | Hooks y especializaciones, agrupados en categorías                                               | Matchers por patrón o framework                                                 |
| Salida           | Veredicto literal (finding / review / advisory) más una etiqueta de clasificación                | Candidato sin veredicto (slug, líneas, fragmento de código, patrón coincidente) |
| Ajuste           | Precisión: reconoce los comentarios y aplica salvaguardas de marcadores de posición y de ventana | Exhaustividad: redes amplias, y la IA descarta después los falsos positivos     |
| Profundidad      | Más profundo en las clases que ambos cubren                                                      | Más amplio, menos profundo en las clases que ambos cubren                       |
| Falsos positivos | Se mantienen bajos en origen y luego se juzgan en contexto                                       | Se generan de más a propósito y se recortan con una pasada de `revalidate`      |

## Conocimiento y juicio

Ambos aportan conocimiento de seguridad que las regex no alcanzan. Difieren en dónde reside y en quién puede darle forma.

| Aspecto                | Lagune                                                                           | Deepsec                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Forma                  | Módulos markdown editables, varios de ellos respaldados por un hook determinista | Un prompt breve y puntos destacados por tecnología, apoyados en el conocimiento propio del modelo |
| Selección              | Se coteja con el código y solo se carga cuando su contexto está presente         | Se inyecta en cada lote de IA, junto con los puntos destacados de la tecnología detectada         |
| Quién lo redacta       | El usuario edita los módulos y añade otros nuevos con `specialize`               | El mantenedor es dueño del prompt, y el usuario rellena un `INFO.md`                              |
| Dónde reside el juicio | Los hooks deciden su base, y el agente juzga el resto a partir del conocimiento  | Centralizado: un único procesador de IA juzga cada candidato                                      |
| Reutilización          | Un mismo módulo guía tanto `detect` como `verify`                                | Un solo prompt dirige la etapa única de `process`                                                 |

## Hallazgos y cierre

En lo que más difieren es en qué se convierte un hallazgo una vez resuelto.

| Aspecto               | Lagune                                                                                   | Deepsec                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Gravedad              | Una puntuación CVSS v4.0, ajustada según la exposición y lo que está en juego            | Una gravedad asignada por la IA, más un triaje P0 / P1 / P2 de explotabilidad e impacto |
| Veredictos            | Risk closed, Risk not closed o Cannot tell from the code                                 | true-positive, false-positive, fixed, uncertain, accepted-risk, duplicate               |
| Persistencia          | La cadena de trabajo se concilia, y los hallazgos cerrados se condensan en un historial  | Registros por archivo a los que solo se añade, sin eliminar nada                        |
| Estado final          | Se puede cerrar: un hallazgo demostrado se da de baja y la cadena puede quedar en reposo | Cada hallazgo se conserva para siempre, oculto de las vistas una vez resuelto           |
| Detalle del historial | Un resumen breve de cuál era el riesgo                                                   | El rastro completo de veredictos, incluido cómo se corrigió                             |

## Coste

| Aspecto           | Lagune                                                                                                                                                  | Deepsec                                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base determinista | Gratis: los hooks se ejecutan sin IA y sin clave, y ya emiten veredictos                                                                                | Gratis: `scan` se ejecuta sin IA, pero no emite veredictos por sí solo                                                                                                                                                                  |
| Factura habitual  | Integrada en un agente que ya usas: desde 0 dólares con un modelo local, el precio del plan que ya pagas o por iteración si lo usas a través de una API | [Entre unos 25 y 1200 dólares por ejecución para entre 100 y 2000 archivos, y más a gran escala](https://github.com/vercel-labs/deepsec/blob/f75a16803ec5250938bacfe41571d929e8564f45/docs/getting-started.md#run-the-ai-investigation) |
| La vía más barata | Cualquier modelo, incluido uno local y gratuito, cierra el ciclo                                                                                        | Hay planes de pago más baratos, pero los hallazgos requieren la etapa de IA de pago                                                                                                                                                     |

## Extensibilidad y gobernanza

Cada uno abre la capa que el otro mantiene cerrada.

| Aspecto                | Lagune                                                | Deepsec                                                                |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| Qué puedes ampliar     | Editar módulos o añadir otros nuevos con `specialize` | Añadir matchers, agentes, notificadores y asignaciones de responsables |
| Capa de políticas      | El charter rige cada fase y está versionado           | La configuración es operativa (matchers, modelos, rutas)               |
| Sustitución por nombre | Un módulo refinado prevalece sobre el integrado       | Ante una colisión de slug de matcher, gana tu matcher                  |

## Interfaces

Deepsec genera entregables para una organización de seguridad. Lagune muestra una vista en tiempo real para quien lo ejecuta.

| Aspecto                       | Lagune                                                                        | Deepsec                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Interfaz para personas        | Un dashboard local en tiempo real de toda la cadena, en lenguaje sencillo     | Archivos de informe, exportación, métricas y comentarios de PR, más un sitio de documentación |
| Responsabilidad               | Muestra los archivos y las especializaciones que se aplicaron                 | Propone a quién asignarlo: la persona de guardia, su responsable o el autor del commit        |
| Prueba reproducible           | `prove` escribe tests ejecutables y un aviso de seguridad para su divulgación | Se mantiene estático por diseño y nunca ejecuta el objetivo                                   |
| Autodefensa de la herramienta | Bastiona una API local de escritura del dashboard                             | Bastiona su propia ejecución de IA frente a código no fiable del objetivo                     |

## Escala y despliegue

| Aspecto             | Lagune                                                                                          | Deepsec                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Instalación         | Nueve comandos desde el plugin de tu agente o la CLI de skills, sin generar nada en el proyecto | Un espacio de trabajo `.deepsec/` con su propio paquete y sus dependencias |
| Dirección de escala | Se acota a cualquier parte, un contexto, desde un archivo hasta todo el proyecto                | Analiza repositorios completos, hasta grandes monorepos                    |
| Distribución        | Solo local, y su único servidor escucha en loopback                                             | Reparto opcional entre VM de workers de Vercel Sandbox                     |

## Experiencia de usuario

Cómo recibe cada uno a quien lo ejecuta: qué exige la primera ejecución y cómo lo orienta quien lo maneja.

### Puesta en marcha

Lagune funciona a través del agente que ya tienes abierto. Deepsec prepara primero su propio espacio de trabajo y el acceso al modelo.

| Aspecto                      | Lagune                                                                                              | Deepsec                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Primer comando               | La instalación del plugin o `npx skills add wellwelwel/lagune -y`, y luego `/lagune-*` en el agente | `npx deepsec init`, luego `cd .deepsec`, `pnpm install`, `scan`, `process`                                 |
| Credenciales para ejecutarlo | Ninguna clave aparte, usa tu agente actual                                                          | Una clave de modelo (por ejemplo, AI Gateway, un token OIDC de Vercel de 12 horas o un token de Anthropic) |

### Cómo dirigirlo

Ambos admiten indicaciones. Lagune interpreta la forma de la entrada en cada fase. Deepsec acota el conjunto de archivos sobre el que se ejecuta la misma investigación.

| Aspecto                 | Lagune                                                                                         | Deepsec                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Todo el proyecto        | Una fase sin entrada analiza todo el ámbito                                                    | `scan` y `process` analizan el repositorio               |
| Una parte               | Cualquier fase se acota a los archivos o directorios indicados                                 | `--files`, `--files-from` o `--diff` acotan la ejecución |
| Una preocupación        | Una fase se acota a una preocupación descrita                                                  | El prompt de investigación es fijo                       |
| Una franja de prioridad | `harden` y `verify` se acotan a la gravedad crítica, alta, media o baja                        | Los hallazgos se etiquetan después de la ejecución       |
| Un valor concreto       | Un hook puntúa directamente un fragmento de código, un patrón o una URL (`--pattern`, `--url`) | La unidad de trabajo es un archivo                       |

## Preguntas frecuentes

### ¿En qué se diferencia Lagune de Deepsec?

Lagune pone al agente primero y actúa antes, durante y después de escribir el código: fija la política antes del código, bastiona sobre la marcha durante el desarrollo, y audita, bastiona y verifica el código ya escrito. Deepsec pone lo determinista primero: un análisis amplio con regex alimenta una investigación obligatoria con un modelo puntero, que revisa el código existente e informa de los hallazgos sin modificarlo.

### ¿Puedo usar alguno de los dos gratis?

Todo el flujo de Lagune puede funcionar por 0 dólares con un modelo local gratuito, y sus hooks deterministas emiten veredictos sin nada de IA. El scan de Deepsec es gratuito pero no emite veredictos, así que cualquier hallazgo requiere su etapa de IA de pago.

### ¿Alguno de los dos modifica mi código?

Lagune sí: harden aplica las correcciones en tu código. Deepsec no: solo hace análisis estático y emite hallazgos y texto con recomendaciones que una persona o un agente aplica por separado.
