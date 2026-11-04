# Hook cors: audita los orígenes CORS

> Analiza el código fuente en busca de una lista de orígenes CORS permitidos que se pueda eludir, o evalúa si un único valor de origen concede un acceso demasiado permisivo, desde la línea de comandos.

URL canónica: https://lagune.ai/es-ES/docs/hooks/cors
Idioma: es-ES
Original: https://lagune.ai/docs/hooks/cors
Última actualización: 2026-11-04

El hook `cors` es el motor determinista en el que se apoya la [especialización `http-request`](https://lagune.ai/es-ES/docs/catalog), y puedes ejecutarlo tú mismo. Funciona en dos modos desde un mismo comando: un **scan**, que analiza el código fuente en busca de una **lista de orígenes permitidos que se puede eludir** (una regex de validación de host que un host atacante consigue burlar), y un **score**, que califica un único valor de **origen CORS** como `wildcard`, `null` o `safe`.

## Analizar un proyecto

Sin ninguna opción, analiza todo el proyecto.

**Todo el proyecto**

```bash
npx lagune read cors
```

**Un directorio**

```bash
npx lagune read cors --dir src/server
```

**Un solo archivo**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Enumera todas las listas de permitidos que se pueden eludir bajo un único encabezado, agrupadas por archivo. Un validador de host cuyo `.+`/`.*` está en el segmento de autoridad, antes del sufijo del host de confianza (`^https?://.+\.trusted\.com`), deja pasar un host atacante como `your-site.com.attacker.com`.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Es un indicio que revisar, no un hallazgo cerrado: el texto no permite decidir si la regex controla una decisión de confianza real, así que el análisis nunca cambia el código de salida. Lee cada una y confirma que la lista de permitidos compara por igualdad exacta. Si no encuentra nada, muestra una sola línea.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Evaluar un origen

Pasa cada origen con `--origin`. El hook muestra una palabra por origen y termina con un código de salida distinto de cero ante cualquier `wildcard` o `null`.

**Un origen**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Varios orígenes**

Repite `--origin` para evaluar toda una lista de permitidos en una sola llamada, con un veredicto por línea y en el mismo orden.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Veredicto  | Significado                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `safe`     | No es `*`, `null` ni un glob con `*`. No garantiza que el origen esté bien formado.                        |
| `wildcard` | `*`, un glob de subdominio, host o puerto: cualquier sitio (o un conjunto amplio) puede leer la respuesta. |
| `null`     | El origen `null`, que los iframes en sandbox y las redirecciones pueden falsificar.                        |

Solo `safe` equivale a permitir, y `--origin` es un oráculo de valores: juzga el valor, no el handler, así que confirma el handler con la especialización `http-request`.

### Opciones de la CLI

| Opción     | Valor         | Descripción                                                                    |
| ---------- | ------------- | ------------------------------------------------------------------------------ |
| `--origin` | un origen     | Evalúa un valor de origen. Repítela para evaluar varios, uno por línea.        |
| `--dir`    | un directorio | Limita el análisis a un directorio. Se puede repetir y combinar con `--file`.  |
| `--file`   | un archivo    | Limita el análisis a un solo archivo. Se puede repetir y combinar con `--dir`. |

Sin ninguna opción, analiza todo el proyecto. `--origin` es el modo score y no se puede combinar con `--dir` ni con `--file`.

### Elige qué analiza

Deja fuera lo que **Git** ignora. Para dejar fuera más cosas, o para analizar lo que **Git** ignora, dale a `cors` una configuración propia:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todos los ajustes están en [Configura los hooks](https://lagune.ai/es-ES/docs/hooks/configure).

**Lo que no cubre**

El análisis detecta la forma de **regex que se puede eludir**, y `--origin` evalúa **valores** de origen. Hay dos patrones del código fuente que quedan fuera de su alcance: el reflejo del `Origin` de la petición (el servidor devuelve el `Origin` entrante tal cual, o lo combina con credenciales) y una lista de permitidos permisiva basada en `endsWith` o en subcadenas. Reconócelos en el código y trátalos como describe la [especialización `http-request`](https://lagune.ai/es-ES/docs/catalog).

## Preguntas frecuentes

### ¿Por qué es peligroso un origen CORS null?

Los iframes en sandbox y algunas redirecciones envían Origin: null, así que una lista de permitidos que confía en null da acceso de lectura a esos contextos. El hook cors lo señala junto con el comodín.

### ¿Cómo detecto una lista de orígenes CORS permitidos que se puede eludir?

Ejecuta npx lagune read cors sobre el proyecto. Señala cualquier regex de validación de host cuyo comodín voraz esté antes del sufijo de confianza, de modo que un host atacante como your-site.com.attacker.com consigue colarse.
