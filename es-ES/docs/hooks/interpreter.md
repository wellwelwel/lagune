# Hook interpreter: señala sinks de ejecución dinámica de código

> Analiza un proyecto en busca de sinks de ejecución dinámica de código en varios lenguajes, o evalúa un único fragmento de código, desde la línea de comandos.

URL canónica: https://lagune.ai/es-ES/docs/hooks/interpreter
Idioma: es-ES
Original: https://lagune.ai/docs/hooks/interpreter
Última actualización: 2026-11-04

El hook `interpreter` señala **sinks de ejecución dinámica de código**: construcciones que convierten datos en código que se ejecuta o que se los pasan a una shell, desde `eval` hasta la deserialización nativa. Tiene en cuenta el lenguaje, ya que lee cada archivo según sus propias reglas. Es el motor determinista en el que se apoya la [especialización `interpreter`](https://lagune.ai/es-ES/docs/catalog), y puedes ejecutarlo tú mismo en modo **scan** o **check**.

## Cómo ejecutarlo

**Analizar el proyecto**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Comprobar un fragmento**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Estos sinks son de doble uso: un análisis estático no puede decidir si una entrada influida por un atacante llega a alguno de ellos, así que cada coincidencia es una **advertencia que revisar**, nunca un hallazgo confirmado. El análisis muestra una única sección, **Dynamic-execution sinks to review**, agrupada por archivo. Si no encuentra nada, muestra `no dynamic-execution sinks found`.

**¡Lee el código señalado, nunca lo ejecutes!**

Estudia cada sink de forma **estática**, rastreando si una entrada no fiable llega hasta él. Nunca ejecutes ni pases por `eval` el código señalado, ni ningún código remoto o descargado en tiempo de ejecución que este cargue, para "probar" lo que hace.

## Cómo interpretar el veredicto

| Veredicto | Significado                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `careful` | El fragmento contiene un sink de ejecución dinámica propio de su lenguaje. Revísalo leyéndolo, nunca ejecutándolo. |
| `safe`    | No se ha encontrado ningún sink de ejecución dinámica para el lenguaje indicado.                                   |

### Opciones de la CLI

| Opción      | Valor                  | Descripción                                                                                                |
| ----------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--pattern` | un fragmento de código | Comprueba un fragmento. Repítela para comprobar varios, con un veredicto por línea.                        |
| `--lang`    | un lenguaje            | Obligatoria con `--pattern`: uno de javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, csharp. |
| `--dir`     | un directorio          | Limita el análisis a un directorio. Se puede repetir y combinar con `--file`.                              |
| `--file`    | un archivo             | Limita el análisis a un solo archivo. Se puede repetir y combinar con `--dir`.                             |

Sin ninguna opción, analiza todo el proyecto. `--pattern` necesita `--lang` y no se puede combinar con `--dir` ni con `--file`.

### Elige qué analiza

Deja fuera lo que **Git** ignora. Para dejar fuera más cosas, o para analizar lo que **Git** ignora, dale a `interpreter` una configuración propia:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todos los ajustes están en [Configura los hooks](https://lagune.ai/es-ES/docs/hooks/configure).

### Lenguajes compatibles

El análisis lee estos lenguajes, identificados por la extensión del archivo, y comprueba cada uno con su propio conjunto de sinks de ejecución dinámica.

| #   | Lenguaje                    | Extensiones                                                                                                  | Sinks que señala                                                                                                                                                                                                                                          |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, constructor Function, `setTimeout`/`setInterval` con el cuerpo en una cadena, módulo `vm`, exec de `child_process`, `require()` dinámico, `import()` dinámico                                                                                   |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` `shell=True`, `pickle.load`/`loads`, `yaml.load` (inseguro)                                                                                                                           |
| 3   | **Ruby**                    | `.rb`                                                                                                        | familia eval (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, comillas invertidas o `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                                     |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                                                       |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, `assert()` sobre una cadena, `create_function()`, ejecución en shell (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, `include`/`require` con una ruta construida en tiempo de ejecución |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                                          |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | Los sinks de la JVM: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                     |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                                                       |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, la familia `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                                |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, la familia `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                                |

**Orientativo, no exhaustivo**

Lee el código fuente como texto, así que se le puede escapar un sink construido en tiempo de ejecución, oculto tras un alias o escrito de una forma que no reconoce. Toma la tabla como un buen punto de partida, no como un inventario completo.

**Consejo**

El hook garantiza el mínimo (que estos sinks existen y dónde están): decidir si un valor no fiable llega realmente a alguno es la cuestión de criterio que cubre la [especialización `interpreter`](https://lagune.ai/es-ES/docs/catalog).

## Preguntas frecuentes

### ¿El hook interpreter confirma una vulnerabilidad?

No. Señala los sinks de ejecución dinámica como advertencias que revisar, nunca como hallazgos confirmados, porque un análisis estático no puede decidir si una entrada influida por un atacante llega al sink.

### ¿Qué lenguajes cubre el hook interpreter?

Lee los lenguajes de la tabla de lenguajes compatibles, identificados por la extensión del archivo, y comprueba cada uno con su propio conjunto de sinks. Los demás lenguajes no producen ningún sink.
