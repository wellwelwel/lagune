# Esquema de configuración

> El JSON Schema de la configuración de un proyecto Lagune, para autocompletar y validar en tu editor, siguiendo la versión actual de Lagune o fijado a una versión concreta.

URL canónica: https://lagune.ai/es-ES/docs/references/configs-schema
Idioma: es-ES
Original: https://lagune.ai/docs/references/configs-schema
Última actualización: 2026-11-03

El archivo `.lagune/configs.json` registra las [**categorías**](https://lagune.ai/es-ES/docs/categories) que usa un proyecto e indexa sus propias [**especializaciones**](https://lagune.ai/es-ES/docs/catalog). Su JSON Schema permite que tu editor autocomplete cada campo y señale una errata o una categoría desconocida mientras editas el archivo.

## El esquema actual

Siempre que **Lagune** escribe el archivo y no encuentra ningún `$schema` en él, lo apunta al esquema actual:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Esta dirección sigue siempre la versión actual de **Lagune**. Un archivo escrito antes de **Lagune** 0.16.0 la recibe en su próximo cambio, y hasta entonces todas las fases lo advierten.

## Fijar una versión

Cada versión de **Lagune** a partir de la 0.16.0 incluye el esquema tal como era en ella, publicado en **npm** y servido por **jsDelivr**. Para fijar una, pon la versión después de `lagune@` en la dirección de `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

La versión admite cualquier rango semver:

| Versión           | Esquema                      |
| ----------------- | ---------------------------- |
| `0.16.0`          | El de la 0.16.0              |
| `0.16.x` o `0.16` | El de la última versión 0.16 |
| `0.x` o `0`       | El de la última versión 0.x  |
| `latest`          | El de la última versión      |

## Preguntas frecuentes

### ¿Lagune necesita el esquema?

No. El esquema solo ayuda a tu editor, y Lagune lee el archivo igual con $schema o sin él.

### ¿Lagune sobrescribirá un esquema fijado?

No. Lagune solo escribe $schema cuando el archivo no tiene ninguno, y conserva cualquier dirección que hayas puesto.

### ¿Cuándo debo fijar una versión?

Cuando el proyecto usa una versión concreta de Lagune, para que tu editor valide el archivo según lo que acepta esa versión.
