# Instalar Lagune en OpenCode como plugin

> Instala Lagune en OpenCode 1.x y 2.x como plugin y mantenlo actualizado.

URL canónica: https://lagune.ai/es-ES/docs/install/opencode
Idioma: es-ES
Original: https://lagune.ai/docs/install/opencode
Última actualización: 2026-11-03

**OpenCode 2.x**

Instala el plugin desde tu terminal:

```bash
opencode plugin add lagune
```

O añádelo a la lista `plugins` de `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Instala el plugin en tu proyecto desde tu terminal, o añade `-g` para instalarlo en todos tus proyectos:

```bash
opencode plugin lagune
```

O añádelo a la lista `plugin` de `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Actualización

**OpenCode 2.x**

Para actualizar **Lagune**, ejecuta:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Para actualizar **Lagune**, instala la nueva versión sobre la anterior, añadiendo `-g` si lo instalaste en todos tus proyectos:

```bash
opencode plugin lagune@0.16.0 --force
```

## Comandos

**OpenCode 2.x**

Escribe `@` y elige el comando, como `@lagune-charter`, y después escribe tu petición en el mismo mensaje.

**OpenCode 1.x**

Escribe los comandos por su nombre, como `/lagune-charter`. Aparecen en `/skills`, no en el menú `/`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. **OpenCode** las ejecuta sin preguntar.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en OpenCode?

En OpenCode 2.x, ejecuta opencode plugin add lagune. En OpenCode 1.x, ejecuta opencode plugin lagune, añadiendo -g para instalarlo en todos tus proyectos.

### ¿Cómo actualizo Lagune en OpenCode?

En OpenCode 2.x, ejecuta opencode plugin update lagune y después opencode reload. En OpenCode 1.x, ejecuta opencode plugin lagune@0.16.0 --force.

### ¿Cómo ejecuto los comandos de Lagune en OpenCode?

En OpenCode 2.x, escribe @ y elige el comando, como @lagune-charter, y después escribe tu petición en el mismo mensaje. En OpenCode 1.x, escríbelos por su nombre, como /lagune-charter, o búscalos en /skills.

### ¿OpenCode pide permiso antes de ejecutar Lagune?

No. OpenCode ejecuta las dos herramientas del motor, lagune_read y lagune_write, sin preguntar.
