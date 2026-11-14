# Hook secrets: detecta secretos incrustados en el código

> Esta página está desactualizada respecto a su versión en inglés. [Leer la versión original](https://lagune.ai/docs/hooks/secrets).

> Analiza un proyecto en busca de credenciales incrustadas en el código, desde la línea de comandos.

URL canónica: https://lagune.ai/es-ES/docs/hooks/secrets
Idioma: es-ES
Original: https://lagune.ai/docs/hooks/secrets
Última actualización: 2026-11-04

El hook `secrets` señala las **credenciales incrustadas en el código fuente** en lugar de leídas del entorno. Se fija en la **procedencia** (un literal frente a una lectura del entorno), no en el contenido del valor, así que no necesita un catálogo exhaustivo de prefijos de proveedores y apenas produce falsos positivos. Es el motor determinista en el que se apoya la [especialización `secrets`](https://lagune.ai/es-ES/docs/catalog).

Las firmas con el formato de un proveedor, las credenciales en cadenas de conexión y los literales asignados a un identificador con nombre de secreto son **independientes del lenguaje**: la misma cadena se lee igual en cualquier archivo. Las dos heurísticas que dependen de la sintaxis, una lectura del entorno con un valor por defecto incrustado y un secreto que acaba en un sink de logs, **tienen en cuenta el lenguaje**, así que un `console.log` de JavaScript nunca se busca en un archivo de Rust y el `os.getenv("X", "default")` de Python se reconoce por sí mismo.

## Cómo ejecutarlo

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

El análisis muestra hasta dos secciones. **Hardcoded secrets found** es el conjunto de hallazgos (un valor por defecto incrustado para una variable de entorno con nombre de secreto, una credencial incluida en una cadena de conexión o un valor que coincide con uno de los formatos de proveedor seleccionados), así que el hook termina con un código de salida distinto de cero. **Secret handling to review manually** es un conjunto de indicios: un literal simple asignado a un identificador con nombre de secreto (su procedencia se puede determinar, pero no si el valor es un secreto real) y un valor con nombre de secreto que acaba en un sink de logs o de respuesta. Si no encuentra nada, muestra `no hardcoded secrets found`.

### Opciones de la CLI

| Opción   | Valor         | Descripción                                                                    |
| -------- | ------------- | ------------------------------------------------------------------------------ |
| `--dir`  | un directorio | Limita el análisis a un directorio. Se puede repetir y combinar con `--file`.  |
| `--file` | un archivo    | Limita el análisis a un solo archivo. Se puede repetir y combinar con `--dir`. |

Sin ninguna opción, analiza todo el proyecto.

### Elige qué analiza

Deja fuera lo que **Git** ignora. Para dejar fuera más cosas, o para analizar lo que **Git** ignora, dale a `secrets` una configuración propia:

```bash
npx lagune write add --ignore test/fixtures --checker secrets
```

```json
{
  "checkers": {
    "secrets": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todos los ajustes están en [Configura los hooks](https://lagune.ai/es-ES/docs/hooks/configure).

### Cobertura de lenguajes

El hallazgo del valor por defecto del entorno y el indicio del sink de logs leen un conjunto de formas propio de cada lenguaje, así que cubren los lenguajes de abajo y no señalan nada en los demás. Las otras tres señales se ejecutan en **todos** los archivos.

| Señal                         | Lenguajes                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------- |
| Valor por defecto del entorno | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Sink de logs o de respuesta   | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**¿Esto incumple alguna política?**

No. Detectar el formato de un secreto para avisar de que se ha incluido en un commit es una práctica habitual de las herramientas defensivas, la misma operación que hacen gitleaks, trufflehog y la push protection de GitHub. El hook incluye firmas de detección (**formatos** públicos de tokens), nunca un secreto activo, y audita y explica en lugar de exfiltrar.

## Preguntas frecuentes

### ¿Cómo evita falsos positivos el hook secrets?

Se fija en la procedencia, no en el contenido del valor. Los formatos de alta confianza (tokens de proveedores, valores por defecto del entorno, cadenas de conexión) son hallazgos que terminan con un código de salida distinto de cero. Un literal simple asignado a un identificador con nombre de secreto es un indicio que hay que confirmar, y ese mismo identificador leído de process.env no se señala en absoluto.
