# Configura los hooks: elige qué analizan

> Elige qué dejan fuera los hooks que analizan archivos, para todos a la vez o para uno solo.

URL canónica: https://lagune.ai/es-ES/docs/hooks/configure
Idioma: es-ES
Original: https://lagune.ai/docs/hooks/configure
Última actualización: 2026-11-04

El bloque `checkers` de `.lagune/configs.json` define qué dejan fuera los hooks que analizan archivos, para todos a la vez o para uno solo.

## Cómo configurarlo

Añade o quita rutas y patrones desde la línea de comandos, y pon cada patrón entre comillas para que el shell lo deje tal como está escrito:

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

O defínelos en el archivo:

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### Ajustes

| Clave       | Valor                                       | Por defecto | Descripción                                                                                                 |
| ----------- | ------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `gitignore` | `true` o `false`                            | `true`      | Deja fuera lo que **Git** ignora. Un archivo bajo control de **Git** se analiza de todos modos.             |
| `ignore`    | rutas o patrones desde la raíz del proyecto | `[]`        | Deja fuera lo que coincide con cada uno y todo lo que contiene, incluso un archivo bajo control de **Git**. |

En el nivel superior de `checkers`, una clave se aplica a todos los checkers. Bajo el nombre de un checker, se aplica solo a ese checker y sustituye a la compartida, así que en el ejemplo `secrets` analiza lo que **Git** ignora y deja fuera `test/fixtures` y `temp`. Cuando `write add --ignore` da a un checker su primera lista propia, esa lista empieza como una copia de la compartida.

### Patrones

Un patrón parte de la raíz del proyecto, así que `*.generated.ts` solo alcanza los archivos que están ahí y `**/*.generated.ts` los alcanza a cualquier profundidad. Los nombres deben coincidir exactamente, mayúsculas y minúsculas incluidas.

| Patrón              | Deja fuera                                          |
| ------------------- | --------------------------------------------------- |
| `dist`              | `dist` en la raíz del proyecto                      |
| `packages/*/dist`   | `dist` en cada carpeta dentro de `packages`         |
| `**/dist`           | cada `dist`, a cualquier profundidad                |
| `**/*.generated.ts` | cada archivo cuyo nombre termina en `.generated.ts` |
| `fixture-?`         | `fixture-a`, `fixture-1` y similares                |
| `[ab]-cache`        | `a-cache` y `b-cache`                               |
| `[*]x`              | `*x`, con un `*` literal                            |

## Cómo interpretar el resultado

El informe termina indicando cuántas rutas ha dejado fuera el análisis, según lo que las ignora:

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

Una ruta indicada con `--dir` o `--file` se analiza diga lo que diga la configuración. Un ajuste que el motor no puede leer detiene el checker con un error que lo nombra, como un patrón que empieza por `!` o por un espacio, sale del proyecto, deja un corchete abierto o tarda demasiado en evaluarse.

## Preguntas frecuentes

### ¿Lagune configura esto por mí?

No. El charter enumera las carpetas versionadas que, según su lectura, no son código tuyo que haya que defender, como fixtures de test escritos para parecer vulnerables, y solo registra las que elijas por su número.

### ¿Cuándo debería un checker analizar lo que Git ignora?

Cuando no tienes motivos para fiarte del repositorio, ya que sus propios archivos .gitignore podrían ocultar código, o cuando una carpeta de build puede contener una clave insertada durante el build. Pon gitignore a false para todos los checkers o para uno solo.
