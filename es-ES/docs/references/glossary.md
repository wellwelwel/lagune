# Glosario de Lagune: SDH, charter, hallazgos y controles

> Definiciones en lenguaje sencillo de cada término de Lagune y de Security-Driven Hardening: SDH, charter, detect, hallazgo, control, harden, verify, dar de baja, posibilidad de cierre, especializaciones, categorías y el catálogo.

URL canónica: https://lagune.ai/es-ES/docs/references/glossary
Idioma: es-ES
Original: https://lagune.ai/docs/references/glossary
Última actualización: 2026-11-05

Cada término clave de Lagune y de la metodología Security-Driven Hardening, definido una sola vez y en lenguaje sencillo.

### Security-Driven Hardening (SDH)

La metodología que implementa Lagune: una convención Blue Team, adaptada al contexto, que detecta el contexto de un sistema, hace el triaje de los riesgos que ese contexto conlleva y guía las correcciones. El conocimiento de seguridad reside en la especificación y en sus especializaciones bajo demanda, así que quien programa y quien no programa siguen el mismo flujo.

### Lagune

La implementación de referencia de SDH: nueve comandos de agente, cada uno con la plantilla que rellena, que un agente de IA ejecuta para bastionar un proyecto. Cada agente los instala con su propio instalador de plugins o con [**skills.sh**](https://www.skills.sh/wellwelwel/lagune), como muestra la [página de instalación](https://lagune.ai/es-ES/docs), y estos ejecutan el motor de Lagune en cada paso determinista.

### Charter

La capa rectora de Lagune: un conjunto de principios que anteponen la seguridad y que toda fase posterior debe respetar. Piensa en él como la comprobación en tiempo de compilación de la postura de seguridad de un proyecto. Se guarda en `.lagune/memory/charter.md`.

### Flujo de desarrollo

El comando universal `/lagune`, que bastiona el trabajo a medida que se escribe. Acepta cualquier prompt en cualquier etapa, construye lo que has pedido y lo bastiona con valores por defecto seguros antes de devolvértelo, guiado por el charter cuando existe. No escribe nada en el seguimiento de Lagune, así que su único producto es el código bastionado. Junto con el charter (antes) y el flujo Blue Team (después), es la forma en que Lagune protege durante el desarrollo.

### Flujo Blue Team

La auditoría en cinco fases que está en el centro de Lagune: charter, detect, plan, harden y verify. Cada fase se apoya en la anterior. "Blue Team" es la tradición de seguridad de los defensores, en contraposición al Red Team, que es ofensivo.

### Hallazgo

Un riesgo detectado. Cada hallazgo recoge qué es, por qué importa y la evidencia en el código. Un hallazgo es la unidad de seguimiento que plan, harden y verify llevan de una fase a la siguiente, identificada por su nombre en todos los artefactos.

### Control

Una medida de seguridad que se aplica para cerrar un riesgo. Harden aplica los controles y verify demuestra que se sostienen. Lagune nunca debilita un control para satisfacer lo que pide un prompt.

### Detect

La fase que lee el código e identifica qué hace el sistema y dónde están los riesgos. Su regla rectora es detectar, no inventar: solo registra lo que el código respalda.

### Harden

La única fase que toca tu código. Aplica las correcciones del plan de una en una y registra cada una como Applied, Partial o Blocked. Applied no significa que ya esté demostrada.

### Verify

La fase que demuestra que cada corrección aplicada se sostiene, leyendo el código y contrastándolo con lo que registró harden. Devuelve uno de tres veredictos: Risk closed, Risk not closed o Cannot tell from the code.

### Dar de baja

Cuando verify demuestra que un riesgo está cerrado, el hallazgo se da de baja: se elimina de toda la cadena, con tu confirmación, para que deje de reprocesarse.

### Posibilidad de cierre

La propiedad de que el trabajo de seguridad tenga un estado final. Como un hallazgo cuyo cierre se ha demostrado se da de baja, el flujo puede quedar en reposo, y solo se reabre cuando cambia el código. Con SDH, la seguridad se puede cerrar: no es un bucle sin fin.

### Motor

El paquete `lagune` en **npm**, que los comandos ejecutan mediante `npx` en cada paso determinista: los hooks, el catálogo y las categorías.

### Especialización

Un módulo de conocimiento de seguridad acotado e independiente del lenguaje, que solo se carga bajo demanda, nunca por defecto. Una especialización no es un comando. Carga una en cualquier prompt con `read catalog <name>` del motor, por ejemplo `npx lagune read catalog regex`.

### Categoría

Un grupo con nombre de especializaciones integradas, desde `owasp` hasta las de cada lenguaje, como `javascript`, `python`, `go` y `rust`. Las categorías que usa un proyecto, registradas en `.lagune/configs.json`, deciden qué especializaciones integradas entran en su catálogo. Mientras no haya ninguna registrada, el proyecto usa solo `owasp`.

### Catálogo

El conjunto de especializaciones que usa un proyecto: las integradas de sus categorías más las suyas propias, escritas con `/lagune-specialize`. El `read catalog` del motor lo lista, y las fases lo cotejan con el código.

### Prompt bajo demanda

El principio según el cual se carga el conocimiento de seguridad relevante para lo que el proyecto es realmente, en lugar de ejecutar todas las comprobaciones por defecto.

### Identidad por nombre

El modelo de seguimiento de Lagune: el nombre de cada hallazgo, escrito de forma idéntica como título de sección en todos los artefactos, es su identidad en toda la cadena. El mapa de seguimiento (`.lagune/tracking.json`) solo contiene seguimiento, nunca prosa.

## Preguntas frecuentes

### ¿Qué es Security-Driven Hardening (SDH)?

SDH es una metodología de seguridad Blue Team adaptada al contexto. Detecta el contexto de un sistema, hace el triaje de los riesgos que ese contexto conlleva y guía las correcciones, con cada hallazgo expresado en lenguaje sencillo. Lagune es su implementación de referencia.

### ¿Qué es el charter en Lagune?

El charter es la capa rectora de Lagune, un conjunto de principios que anteponen la seguridad y que toda fase posterior debe respetar. Se guarda en .lagune/memory/charter.md.

### ¿Qué significa dar de baja un hallazgo?

Cuando verify demuestra que un riesgo está cerrado, el hallazgo se da de baja: se elimina de toda la cadena con tu confirmación, para que deje de reprocesarse.
