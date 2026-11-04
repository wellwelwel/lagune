# Categorías

> Las categorías de especializaciones que puede usar un proyecto de Lagune, desde OWASP hasta el bastionado por lenguaje para JavaScript, Python, Go y Rust, y cómo cambiarlas.

URL canónica: https://lagune.ai/es-ES/docs/categories
Idioma: es-ES
Original: https://lagune.ai/docs/categories
Última actualización: 2026-11-04

**Lagune** agrupa sus [**especializaciones**](https://lagune.ai/es-ES/docs/catalog) integradas en **13 categorías**. Las categorías que usa un proyecto deciden qué integradas entran en su [**catálogo**](https://lagune.ai/es-ES/docs/catalog), y se dividen en dos grupos: qué hace el sistema y en qué está escrito.

Mientras no haya ninguna categoría registrada, un proyecto usa solo `owasp`. [`/lagune-charter`](https://lagune.ai/es-ES/docs/commands/charter) registra cada categoría que respalda su lectura del proyecto, y tú puedes cambiarlas cuando quieras.

## Qué hace el sistema

| Categoría       | Clave     | Qué bastiona                                                                                                                                  |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| OWASP           | `owasp`   | Los riesgos de seguridad de aplicaciones que sigue OWASP: inyección, pérdida de control de acceso y fallos de autenticación y criptográficos  |
| Infraestructura | `infra`   | Configuración de contenedores, cargas de trabajo y serverless: Dockerfile, Compose, seguridad de Pods, IAM y disparadores de FaaS             |
| IA / LLM        | `ai`      | Integraciones de IA y LLM, frente a la inyección de prompts y a conexiones inseguras de herramientas, agentes, recuperación (retrieval) y MCP |
| Lovable         | `lovable` | Apps de Supabase generadas por IA (Lovable y similares): huecos en RLS, claves `service_role` filtradas y valores por defecto inseguros       |

## En qué está escrito

| Categoría  | Clave        | Qué bastiona                                                                                                                       |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE con `eval` y `child_process`, recorrido de directorios y contaminación de prototipos, en todos sus entornos de ejecución       |
| Python     | `python`     | RCE por deserialización con `pickle` y YAML, recorrido de atributos con `str.format` y contaminación de clases                     |
| Rust       | `rust`       | APIs `unsafe` que no son sólidas, mal uso de `transmute`, desbordamiento de enteros y comportamiento indefinido en la frontera FFI |
| C / C++    | `c-cpp`      | Fallos de cadenas de formato, desbordamientos de búfer y escrituras fuera de límites que permiten ejecutar código                  |
| PHP        | `php`        | Evasión de la autenticación por type juggling, cadenas de gadgets de inyección de objetos y configuraciones por defecto inseguras  |
| Go         | `go`         | Fallos de interfaces typed nil, carreras de datos entre goroutines y concurrencia insegura en código crítico para la seguridad     |
| Java       | `java`       | Cadenas de gadgets de deserialización con `ObjectInputStream` que acaban en ejecución remota de código                             |
| Ruby       | `ruby`       | Cadenas de gadgets de deserialización con `Marshal.load` y YAML que llegan a la ejecución remota de código                         |
| .NET / C#  | `dotnet`     | RCE por deserialización con `BinaryFormatter` y las formas de eludir el codificador que llevan a XSS                               |

**Consejo**

**Lagune** es independiente del lenguaje: todo el flujo lee tu proyecto esté escrito en lo que esté, y estas categorías solo profundizan en los escollos propios de un lenguaje concreto.

## Añade y quita cuando quieras

Una categoría es un punto de partida, no un compromiso. Usa las que encajen con el proyecto ahora y cámbialas cuando quieras por su clave, con `write add` y `write remove`. En un terminal, `--categories` sin valor abre un selector interactivo (espacio para marcar o desmarcar, Intro para confirmar, vacío para omitir). Fuera de un terminal, pon las categorías justo después.

**Añadir**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Quitar**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

El primer `write add` o `write remove` parte de `owasp`, así que quitar todas las categorías deja una lista vacía, nunca el valor por defecto. Cada cambio queda en `.lagune/configs.json`, de modo que todo el equipo trabaja con el mismo conjunto.

## Consulta qué usa un proyecto

`read list --categories` muestra todas las categorías y si el proyecto usa cada una:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Consulta el [**Catálogo**](https://lagune.ai/es-ES/docs/catalog) para ver qué especializaciones incluye cada categoría. Tus propias especializaciones, escritas con [`/lagune-specialize`](https://lagune.ai/es-ES/docs/commands/specialize), se suman al catálogo sean cuales sean las categorías.

## Preguntas frecuentes

### ¿Cómo añado una categoría?

Pasa la clave de la categoría a --categories, por ejemplo npx lagune write add --categories javascript. Mientras no haya ninguna registrada, el charter también registra las categorías que respalda su lectura del proyecto.

### ¿Puedo usar más de una categoría?

Sí. Escríbelas en la misma línea, una detrás de otra.

### ¿Qué categoría debería usar un proyecto?

Empieza por owasp, la categoría por defecto, y después añade la de tu lenguaje o tu stack. Las especializaciones solo se cargan bajo demanda, así que una categoría no cuesta nada hasta que una fase necesita alguna de sus especializaciones.
