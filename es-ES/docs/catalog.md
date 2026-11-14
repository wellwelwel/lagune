# Catálogo: especializaciones de seguridad bajo demanda

> Esta página está desactualizada respecto a su versión en inglés. [Leer la versión original](https://lagune.ai/docs/catalog).

> Cómo se cargan las especializaciones del catálogo de tu proyecto: bajo demanda desde una fase o directamente por ti.

URL canónica: https://lagune.ai/es-ES/docs/catalog
Idioma: es-ES
Original: https://lagune.ai/docs/catalog
Última actualización: 2026-11-03

🧠 Las especializaciones de **Lagune** son módulos acotados de conocimiento de seguridad, independientes del lenguaje, que se cargan solo bajo demanda, nunca por defecto. No son comandos. El catálogo de tu proyecto es el conjunto que usa: las especializaciones integradas de sus [categorías](https://lagune.ai/es-ES/docs/categories) más las suyas propias. Las fases detect y verify recurren a ellas mientras se ejecutan, y tú puedes cargar una directamente cuando quieras.

**Resumen**

*La vista general interactiva del catálogo está en la página web. Todas las especializaciones integradas aparecen en la tabla de abajo.*

**Cómo funciona**

## Úsala por tu cuenta

Para usar una especialización directamente, pide a tu agente que la cargue con `read catalog <name>` y escribe la tarea en el mismo prompt. El conocimiento actúa entonces sobre lo que has pedido. Funciona en cualquier prompt, incluso en uno que no tenga nada que ver con el flujo de **Lagune**.

Por ejemplo, un prompt directo y libre para generar una colección segura de **RegExp** con **Python**:

```prompt
Carga la especialización regex con `npx lagune read catalog regex` y después crea en @src/utils/regex.py una colección de expresiones regulares para validar correos electrónicos y nombres de usuario.
```

Esto usa un hook determinista para comprobar cada **RegExp** frente a **ReDoS**, se queda con las seguras y genera algo como esto:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Prueba el comprobador de ReDoS**

Comprueba tú mismo un patrón en [**devina.io/redos-checker**](https://devina.io/redos-checker).

## Las especializaciones integradas

Las especializaciones integradas se agrupan en [**categorías**](https://lagune.ai/es-ES/docs/categories). Este es el conjunto que incluye **Lagune**:

| Especialización       | Categoría                   | Enfoque                                                                                                               |
| --------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** patrones que se disparan con entradas manipuladas.                                                         |
| `network`             | `owasp`                     | **SSRF y redirecciones:** destinos de peticiones o redirecciones que aporta el usuario.                               |
| `interpreter`         | `owasp`, `lovable`          | **Inyección de código:** `eval`, inclusión dinámica, despacho por nombre.                                             |
| `sql`                 | `owasp`                     | **Bases de datos relacionales:** inyección, llamadas en crudo al ORM, privilegios, alcance del motor.                 |
| `path`                | `owasp`                     | **Rutas del sistema de archivos:** recorrido de directorios, byte nulo, flujos de NTFS, plantado de archivos.         |
| `upload`              | `owasp`                     | **Subida de archivos:** tipo/firma, contenido malicioso, almacenamiento, límites.                                     |
| `access-control`      | `owasp`, `lovable`          | **Autenticación, autorización y sesión:** IDOR, asignación masiva, tenants, sesiones.                                 |
| `credential-endpoint` | `owasp`, `lovable`          | **Adivinación de credenciales y bots:** fuerza bruta, password spraying, credential stuffing, limitación de intentos. |
| `federation`          | `owasp`                     | **Confianza en tokens:** OAuth/OIDC, SAML, validación de JWT, inicio de sesión con QR.                                |
| `http-request`        | `owasp`                     | **Origen de las peticiones:** CSRF, CORS mal configurado, IP de cliente suplantada.                                   |
| `transport`           | `owasp`                     | **Seguridad del canal:** configuración de TLS, HTTPS/texto en claro, HSTS, pinning.                                   |
| `crypto`              | `owasp`, `lovable`          | **Criptografía en reposo:** algoritmos débiles o propios, CSPRNG, gestión de claves.                                  |
| `secrets`             | `owasp`, `lovable`          | **Credenciales incrustadas:** claves, tokens y contraseñas escritos tal cual en el código fuente.                     |
| `api-endpoint`        | `owasp`                     | **Superficies no REST:** GraphQL, gRPC, autorización en WebSocket, DoS, esquema.                                      |
| `payment`             | `owasp`, `lovable`          | **Flujo de pago:** verificar la pasarela en el servidor, callbacks firmados, idempotencia.                            |
| `xml`                 | `owasp`                     | **Procesamiento de XML:** XXE, entidades externas, expansión billion laughs.                                          |
| `csv`                 | `owasp`                     | **Inyección de fórmulas:** celdas de hoja de cálculo que empiezan por `=`/`+`/`-`/`@`.                                |
| `container`           | `owasp`, `infra`            | **Configuración de contenedores:** root, capabilities, montaje del socket, bastionado de la imagen.                   |
| `infra`               | `infra`                     | **Infraestructura como código:** Terraform, Dockerfile, GitHub Actions.                                               |
| `serverless`          | `owasp`, `infra`, `lovable` | **Funciones FaaS:** IAM de mínimo privilegio, entrada de eventos, contexto, secretos.                                 |
| `llm`                 | `ai`, `lovable`             | **Riesgos de IA y LLM:** inyección de prompts, agencia, RAG, MCP, salida.                                             |
| `supabase`            | `lovable`                   | **Backend de Supabase:** RLS desactivado por defecto, políticas mal generadas por IA, modelo de claves.               |
| `browser`             | `javascript`, `lovable`     | **Riesgos en el cliente:** XSS, CSP, framing, almacenamiento, etc.                                                    |
| `javascript`          | `javascript`                | **Riesgos del lenguaje:** RCE, contaminación de prototipos, etc.                                                      |
| `python`              | `python`                    | **Riesgos del lenguaje:** RCE con `pickle`, contaminación de clases, `-O`, etc.                                       |
| `rust`                | `rust`                      | **Solidez de `unsafe`:** UB alcanzable desde código seguro, `transmute`, desbordamiento.                              |
| `java`                | `java`                      | **Deserialización y código móvil:** cadenas de `readObject`, secuestro de objetos.                                    |
| `ruby`                | `ruby`                      | **Deserialización y `open`:** reconstrucción de objetos con `Marshal`/YAML, la peculiaridad de las tuberías.          |
| `php`                 | `php`                       | **Type juggling y `unserialize`:** hashes mágicos, cadenas POP.                                                       |
| `go`                  | `go`                        | **Typed nil y carreras de datos:** `nil != nil`, goroutines con memoria compartida.                                   |
| `c-cpp`               | `c-cpp`                     | **Cadenas de formato:** `printf(user_input)`, escritura arbitraria (write-what-where) con `%n`.                       |
| `dotnet`              | `dotnet`                    | **Riesgos de la plataforma:** RCE con `BinaryFormatter`, `@Html.Raw`, huecos en los enum.                             |

La mayor parte del conocimiento integrado procede de OWASP. Consulta [**Fuentes de OWASP**](https://lagune.ai/es-ES/docs/references/owasp-sources) para ver la correspondencia completa entre cada especialización y sus páginas canónicas de ataques y de Cheat Sheets de OWASP. Unos pocos módulos específicos de un stack se basan, en cambio, en la guía del propio fabricante: `supabase`, por ejemplo, procede de la documentación de Supabase y de CVE-2025-48757.

## Tus propias especializaciones

Las integradas crecen añadiendo un archivo de conocimiento más una fila en el índice, nunca un comando nuevo. Las tuyas se añaden igual, con [`/lagune-specialize`](https://lagune.ai/es-ES/docs/commands/specialize): indícale un artículo o un tema y condensará una nueva especialización en tu proyecto, con el archivo en `.lagune/catalog/` y su entrada en `.lagune/configs.json`. Las tuyas siempre están en el catálogo, sean cuales sean sus categorías, y una tuya prevalece sobre una integrada con el mismo nombre.

**Internamente, Lagune carga las especializaciones de forma automática y bajo demanda**

Cuando la fase detect o verify se encuentra con un contexto que cubre una especialización, la carga ella misma con `read catalog <name>`. Ocurre automáticamente, como parte de la fase. No tienes que hacer nada a mano para que funcione.

## Descubre qué hay disponible

Para listar el catálogo de tu proyecto desde el terminal, con una especialización por línea y sus etiquetas:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Una especialización `[required]` se aplica siempre, sea cual sea el trabajo. Qué integradas aparecen en la lista depende de las [**categorías**](https://lagune.ai/es-ES/docs/categories) de tu proyecto.

**Las especializaciones no se cargan por defecto**

Se incorpora el conocimiento pertinente para lo que el proyecto es en realidad, en lugar de ejecutar todas las comprobaciones por defecto.

## Preguntas frecuentes

### ¿Qué es una especialización de Lagune?

Un módulo acotado de conocimiento de seguridad, independiente del lenguaje, que se carga solo bajo demanda, nunca por defecto. No es un comando como las skills del agente.

### ¿Qué es el catálogo de un proyecto?

Las especializaciones que usa el proyecto: las integradas de sus categorías más las suyas propias. Mientras no haya ninguna categoría registrada, usa solo OWASP.

### ¿Las especializaciones se cargan por defecto?

No. Solo se cargan bajo demanda, según lo que el proyecto es en realidad.

### ¿Cómo cargo una especialización directamente?

En el mismo prompt de la tarea, pide a tu agente que ejecute npx lagune read catalog <name>.
