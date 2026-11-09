# Instalación: bastionado de seguridad para cualquier agente de IA

> Instala Lagune en cualquier proyecto, como plugin si tu agente lo admite o con la CLI de skills en los demás, y elige las especializaciones de seguridad que encajan con él.

URL canónica: https://lagune.ai/es-ES/docs
Idioma: es-ES
Original: https://lagune.ai/docs
Última actualización: 2026-11-09

**Lagune** ayuda a tu agente de IA a hacer más seguro un proyecto. Lo pones a trabajar sobre tu código, y el agente averigua qué hace realmente tu sistema y luego te guía por el trabajo de seguridad que importa en su caso. **Lagune** es el primer proyecto de la metodología [Security-Driven Hardening (SDH)](https://lagune.ai/es-ES/docs/references/paper).

**Apoya el código abierto**

¿Te encanta **Lagune**? [Danos una ⭐ en **GitHub**](https://github.com/wellwelwel/lagune)

## Elige tu agente

- [Claude Code](https://lagune.ai/es-ES/docs/install/claude-code): La herramienta de programación agéntica de Anthropic
- [Codex](https://lagune.ai/es-ES/docs/install/codex): El agente de programación de OpenAI
- [Cursor](https://lagune.ai/es-ES/docs/install/cursor): El editor de código con IA
- [GitHub Copilot](https://lagune.ai/es-ES/docs/install/github-copilot-cli): El compañero de programación con IA de GitHub
- [Gemini CLI](https://lagune.ai/es-ES/docs/install/gemini-cli): El agente de terminal de código abierto de Google
- [Antigravity](https://lagune.ai/es-ES/docs/install/antigravity-cli): La plataforma de desarrollo agéntico de Google
- [OpenCode](https://lagune.ai/es-ES/docs/install/opencode): El agente de programación de código abierto
- [Devin for Terminal](https://lagune.ai/es-ES/docs/install/devin-cli): El agente de terminal de Cognition
- [Factory Droid](https://lagune.ai/es-ES/docs/install/factory-droid): El agente de desarrollo de software de Factory
- [Grok Build](https://lagune.ai/es-ES/docs/install/grok-build): El agente de programación de xAI
- [Qwen Code](https://lagune.ai/es-ES/docs/install/qwen-code): El agente de programación para terminal de Qwen
- [Kimi Code](https://lagune.ai/es-ES/docs/install/kimi-code): El agente de programación de Moonshot AI
- [Muse Code](https://lagune.ai/es-ES/docs/install/muse-code): El agente de programación de Meta
- [Pi](https://lagune.ai/es-ES/docs/install/pi): Un agente de programación minimalista para terminal
- [Hermes Agent](https://lagune.ai/es-ES/docs/install/hermes-agent): El agente de código abierto de Nous Research
- [Universal](https://lagune.ai/es-ES/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed y 66 más

**Información**

- **Lagune** funciona con **Node.js** por debajo, pero tú usas el lenguaje que quieras.
- Para ejecutarlo totalmente sin conexión, instala **Lagune** en tu proyecto con `npm i -D lagune@0.18.1`.

## Categorías

El conocimiento de seguridad de **Lagune** llega en forma de [**especializaciones**](https://lagune.ai/es-ES/docs/catalog), agrupadas en [**categorías**](https://lagune.ai/es-ES/docs/categories).

- **OWASP** (`owasp`): Bastiona las aplicaciones frente a los riesgos de seguridad que recoge OWASP: inyección, pérdida de control de acceso y fallos de autenticación y criptográficos
- **Infraestructura** (`infra`): Bastiona la configuración de contenedores, cargas de trabajo y serverless: Dockerfile, Compose, seguridad de Pods, IAM y desencadenadores de FaaS
- **IA / LLM** (`ai`): Bastiona las integraciones de IA y LLM frente a la inyección de prompts y las conexiones inseguras con herramientas, agentes, recuperación de documentos y MCP
- **Lovable** (`lovable`): Bastiona las aplicaciones de Supabase generadas por IA (Lovable y similares): huecos en RLS, claves service_role filtradas y valores por defecto inseguros
- **JavaScript** (`javascript`): Bastiona el código JavaScript y sus entornos de ejecución frente a la RCE con eval y child_process, el recorrido de directorios y la contaminación de prototipos
- **Python** (`python`): Bastiona el código Python frente a la RCE por deserialización de pickle y YAML, el recorrido de atributos con cadenas de formato de str.format y la contaminación de clases
- **Rust** (`rust`): Bastiona el código Rust frente a las API unsafe no sólidas, el mal uso de transmute, el desbordamiento de enteros y el comportamiento indefinido en la frontera de FFI
- **Java** (`java`): Bastiona el código Java frente a las cadenas de gadgets de deserialización con ObjectInputStream que culminan en la ejecución remota de código
- **Ruby** (`ruby`): Bastiona el código Ruby frente a las cadenas de gadgets de deserialización con Marshal.load y YAML que llegan a la ejecución remota de código
- **PHP** (`php`): Bastiona el código PHP frente a la evasión de la autenticación por type juggling, las cadenas de gadgets de inyección de objetos y los valores de configuración inseguros por defecto
- **Go** (`go`): Bastiona el código Go frente a fallos de interfaces con nil tipado, carreras de datos entre goroutines y concurrencia insegura en rutas críticas para la seguridad
- **C / C++** (`c-cpp`): Bastiona el código C y C++ frente a errores de cadena de formato, desbordamientos de búfer y escrituras fuera de límites que permiten ejecutar código
- **.NET** (`dotnet`): Bastiona el código .NET y C# frente a la RCE por deserialización con BinaryFormatter y las evasiones del codificador que acaban en XSS

Ejecuta `npx lagune write add --categories` con las claves de las categorías que elijas.

**Consejo**

Un proyecto empieza con `owasp`, y [`/lagune-charter`](https://lagune.ai/es-ES/docs/commands/charter) añade las categorías que justifica su lectura del proyecto.

## Requisitos

Necesitas tener [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) instalado en tu sistema.

## Usa una insignia ✨

¿Usas **Lagune**? Añade una a tu **README**:

**Dos tonos**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Color sólido**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Siguiente paso

Descubre qué hace cada una de las [**skills**](https://lagune.ai/es-ES/docs/get-started/commands) de **Lagune**.

## Preguntas frecuentes

### ¿Qué es Lagune?

Lagune es un flujo de trabajo de seguridad de código abierto y exclusivamente defensivo que ayuda a tu agente de IA a bastionar cualquier proyecto. Lo pones a trabajar sobre tu código, detecta qué hace realmente tu sistema y luego te guía en las correcciones de seguridad que importan en ese contexto.

### ¿Cómo instalo Lagune?

Elige tu agente: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI y Hermes Agent instalan Lagune como plugin, Gemini CLI y Qwen Code como extensión, Pi como paquete, y cualquier otro agente con npx skills add wellwelwel/lagune -y. Funciona tanto en proyectos nuevos como en los que ya existen.

### ¿Necesito una clave de API para usar Lagune?

No. Funciona a través de tu propio agente de IA, así que no hace falta ninguna clave de API.

### ¿Cuáles son los requisitos?

Necesitas tener Node.js (LTS) instalado en tu sistema.

### ¿Qué lenguajes de programación admite Lagune?

Cualquiera. Lagune funciona con Node.js por debajo, pero audita y bastiona proyectos escritos en cualquier lenguaje de programación.

### ¿Qué añade Lagune a mi proyecto?

Una carpeta .lagune/ con el estado de seguridad de tu proyecto, que crea el primer comando que escribe en ella. La CLI de skills también instala los comandos de barra en el proyecto, donde tu agente los lee, mientras que un plugin los mantiene dentro del agente.

### ¿Cómo actualizo Lagune?

Igual que lo instalaste. La página de instalación de cada agente explica cómo actualizar Lagune en él, y la CLI de skills lo actualiza con npx skills update. Tus principios de seguridad, los artefactos de las fases y tus propias especializaciones quedan intactos.

### ¿Qué especializaciones usa un proyecto?

Las integradas de sus categorías, más las suyas propias. El charter registra las categorías que justifica su lectura del proyecto, y npx lagune write add --categories las cambia.

### ¿Tengo que terminar de desarrollar antes de proteger mi proyecto?

No. El comando /lagune bastiona el trabajo a medida que se escribe: acepta cualquier prompt, crea lo que pediste y lo bastiona con valores por defecto seguros, guiado por tus principios de seguridad. El flujo Blue Team de cinco fases audita lo que ya existe.

### ¿Puede Lagune auditar un proyecto que ya existe?

Sí. El flujo Blue Team de cinco fases audita lo que ya existe: charter fija tus reglas de seguridad, detect identifica qué hace el sistema y dónde están los riesgos, plan puntúa cada hallazgo y le asigna una corrección, harden aplica las correcciones y verify demuestra que se sostienen y las cierra.

### ¿Qué diferencia hay entre usar Lagune y simplemente pedirle al agente que identifique vulnerabilidades y fallos de seguridad?

Un agente que lee el código por su cuenta encuentra lo que parece una vulnerabilidad y pasa por alto lo que parece un control. Una lista de direcciones bloqueadas da la impresión de que alguien ya se ocupó del riesgo, así que nadie comprueba que se deja fuera la mayoría, y el código se publica. Lagune invierte esa presunción: una protección que ya está en el código se considera no demostrada hasta que se comprueba, cada especialización del catálogo recibe un veredicto explícito, y verify pregunta si el riesgo ha desaparecido, no si hay un control. Además, cada hallazgo sigue siendo un único elemento en seguimiento de una ejecución a otra, así que se puede demostrar que está cerrado y darlo de baja, mientras que una petición sin más te da un informe distinto cada vez, sin nada con lo que comparar.

### ¿Qué diferencia hay entre desarrollar con Lagune y simplemente pedirle al agente que escriba código seguro?

Pedir código seguro deja en manos del agente decidir qué es seguro, y da por hecho que sabes qué pedir. El requisito suele estar ya dentro de tu petición sin que ninguno de los dos lo vea: pedir una página que muestre los cursos a los que tiene acceso un usuario enuncia una regla de autorización, y una comprobación que nunca se escribe no deja en el código nada que salte a la vista. El comando /lagune carga tus principios de seguridad y las especializaciones que encajan con lo que se va a construir antes de escribir la primera línea, y después vuelve a leer el resultado contrastándolo con la defensa que aplicó. La forma segura rara vez cuesta más que la insegura, así que lo que decide el resultado es saber cuál elegir, y eso es justo lo que llega desde el principio.

### ¿Lagune hace DAST (pruebas dinámicas de seguridad de aplicaciones) o prueba mi aplicación en ejecución?

No. Lagune lee el código y nunca ejecuta tu sistema ni le envía peticiones manipuladas. Verify confirma que un control está presente y es correcto en el código fuente, que es una pregunta distinta de si resiste un ataque contra un sistema en funcionamiento, así que "cannot tell from the code" es un veredicto legítimo y no un aprobado silencioso. DAST responde a la pregunta sobre la ejecución y Lagune a la pregunta sobre el código fuente, así que ninguno sustituye al otro. Incluso el comando opcional prove respeta este límite: sus pruebas afirman el comportamiento seguro, nunca un payload de ataque.

### ¿Lagune sustituye a un pentest (test de intrusión)?

¡No, para nada! Un pentest es un encargo autorizado en el que un profesional aplica su propio criterio contra tu sistema en funcionamiento, encadenando hallazgos y explorando la lógica de negocio que ninguna regla por superficie describe. Los hallazgos de un pentest pueden entrar en el flujo Blue Team de Lagune pasándoselos a detect como preocupaciones, de modo que lo que recoge el informe de un profesional se planifica, se bastiona y se verifica.

## Política de seguridad

Consulta [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Licencia

**Lagune** se distribuye bajo la [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-present [Weslley Araújo](https://github.com/wellwelwel) y [colaboradores](https://github.com/wellwelwel/lagune/graphs/contributors).
