# Hook regex: detecta patrones vulnerables a ReDoS

> Analiza un proyecto en busca de regex vulnerables a ReDoS, o evalúa un único patrón, desde la línea de comandos.

URL canónica: https://lagune.ai/es-ES/docs/hooks/regex
Idioma: es-ES
Original: https://lagune.ai/docs/hooks/regex
Última actualización: 2026-11-03

El hook `regex` es el motor determinista de seguridad de regex que ejecuta la [especialización `regex`](https://lagune.ai/es-ES/docs/catalog), y puedes ejecutarlo tú mismo. Funciona en dos modos desde un mismo comando: un **scan**, que analiza un proyecto en busca de patrones vulnerables a **ReDoS** y de patrones construidos en tiempo de ejecución, y un **check**, que evalúa un único patrón que tú le pases.

## Analizar un proyecto

Sin ninguna opción, analiza todo el proyecto. `--dir` limita el análisis a un directorio, y `--file`, a un solo archivo. Ambas se pueden repetir y se combinan en un único informe, en el que cada archivo aparece una sola vez aunque lo cubra más de un objetivo.

**Todo el proyecto**

```bash
npx lagune read regex
```

**Un directorio**

```bash
npx lagune read regex --dir src/services
```

**Un solo archivo**

```bash
npx lagune read regex --file bin/import.pl
```

**Varios objetivos**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**Con un límite**

`--limit` fija el umbral de ReDoS para el análisis (25 por defecto), el mismo límite que admite el modo check. Cuanto más bajo es el límite, más estricto.

```bash
npx lagune read regex --dir src/services --limit 15
```

La salida es texto plano, y sus encabezados indican cómo interpretar cada sección. Una sección solo aparece cuando tiene hallazgos.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

Si no encuentra nada, muestra una sola línea.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### Cómo interpretar las secciones

| Sección                                                                                     | Significado                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | Patrones vulnerables a ReDoS, agrupados por archivo con cada patrón sangrado debajo, seguido entre paréntesis del motivo por el que es inseguro y, cuando los tiene, de su alcance y sus modificadores. Todas las líneas son inseguras, así que el veredicto no se repite. |
| `Regular expressions the analysis could not settle (review manually)`                       | Patrones que el análisis no pudo resolver dentro de su límite de trabajo, enumerados de la misma forma.                                                                                                                                                                    |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | Archivos que construyen una regex a partir de una variable, una concatenación o una interpolación.                                                                                                                                                                         |
| `Static regex wrapped in a constructor (use a literal instead)`                             | Archivos que pasan un literal de cadena simple a un constructor de regex cuando un literal de regex es más sencillo y se ahorra una compilación en tiempo de ejecución.                                                                                                    |

La primera sección es un hallazgo de seguridad. La segunda y la tercera no son hallazgos por sí solas: señalan código que una comprobación estática no puede resolver, así que piden que lo lea una persona. La cuarta es una sugerencia de claridad, no un hallazgo de seguridad.

### Opciones de la CLI

| Opción      | Valor                  | Descripción                                                                                                         |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--pattern` | el texto de una regex  | Comprueba un patrón. Repítela para comprobar varios, con un veredicto por patrón y en el mismo orden.               |
| `--flags`   | modificadores de regex | Comprueba cada `--pattern` con estos modificadores, como `im`. Solo se aplica al modo check.                        |
| `--dir`     | un directorio          | Limita el análisis a un directorio. Se puede repetir y combinar con `--file`.                                       |
| `--file`    | un archivo             | Limita el análisis a un solo archivo. Se puede repetir y combinar con `--dir`.                                      |
| `--limit`   | un entero no negativo  | Fija el límite de repeticiones de ReDoS (25 por defecto). Se aplica a los dos modos. Cuanto más bajo, más estricto. |

Sin ninguna opción, analiza todo el proyecto. `--pattern` es el modo check y no se puede combinar con `--dir` ni con `--file`.

### Lenguajes compatibles

El análisis lee estos lenguajes, identificados por la extensión del archivo, cada uno según sus propias reglas, así que un patrón de un lenguaje nunca se prueba con las reglas de otro. Todo lo demás se omite en lugar de analizarse con reglas equivocadas.

| #   | Lenguaje                    | Extensiones                                                                                                  |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Orientativo, no exhaustivo**

Lee el código fuente como texto, así que no puede juzgar un patrón construido en tiempo de ejecución, y se le puede escapar un patrón repartido en varias líneas, oculto tras un alias o escrito de una forma que no reconoce. Toma las secciones como un buen punto de partida, no como un inventario completo, y sigue leyendo el código para cubrir lo que ellas no alcanzan.

## Comprobar un único patrón

Pasa `--pattern` con el texto del patrón para evaluarlo. El hook muestra una palabra: `safe`, `unsafe`, `undetermined` cuando el análisis alcanza su límite de trabajo antes de resolver el patrón, o `invalid regex`. Repite `--pattern` para evaluar varios a la vez, con un veredicto por patrón y en el mismo orden.

**Un patrón**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Varios patrones**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**Con modificadores**

`--flags` comprueba cada `--pattern` de la llamada con los modificadores con los que se ejecuta, porque un modificador cambia los caracteres que reconoce un patrón.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**Con un límite**

`--limit` fija el límite de repeticiones (25 por defecto) y se aplica a cada `--pattern` de la llamada. Cuanto más bajo es el límite, más estricto.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Por qué un argumento entre comillas**

Cada patrón se pasa como valor de una opción, nunca interpolado en el comando. Un valor con comillas o comillas invertidas queda inerte y no puede inyectar nada en la shell. Escribe siempre el patrón entre comillas simples para que tu shell no lo expanda antes.

**Consejo**

Es el mismo motor que ejecuta la [especialización `regex`](https://lagune.ai/es-ES/docs/catalog): el modo scan abre la revisión de ReDoS y el modo check confirma los patrones que esa revisión saca a la luz.

## Preguntas frecuentes

### ¿Cómo compruebo desde la CLI si una regex es vulnerable a ReDoS?

Ejecuta npx lagune read regex --pattern '<pattern>'. Devuelve safe, unsafe, undetermined o invalid regex.

### ¿Cómo analizo todo un proyecto en busca de regex inseguras?

Ejecuta el hook regex en modo scan sobre el proyecto. Informa de los patrones vulnerables a ReDoS en 25 lenguajes compatibles.
