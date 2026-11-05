# Instalar Lagune en Cursor como plugin

> Instala Lagune en Cursor y en Cursor CLI como plugin, mantenlo actualizado y permite su motor de antemano.

URL canónica: https://lagune.ai/es-ES/docs/install/cursor
Idioma: es-ES
Original: https://lagune.ai/docs/install/cursor
Última actualización: 2026-11-05

**Cursor**

- Abre **Customize**.
- Selecciona **From GitHub Repository** e introduce `https://github.com/wellwelwel/lagune`.
- Selecciona **Install** en **Lagune** y elige el ámbito de proyecto o de usuario.

**Cursor CLI**

- Añade el marketplace desde tu terminal:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Escribe `/plugins` en una sesión de `agent`.
- Instala **Lagune**.

Si ya tienes **Lagune** instalado en **Claude Code**, **Cursor CLI** lo carga desde ahí.

## Actualización

**Cursor**

- Abre **Customize**.
- Selecciona **Refresh** en el marketplace `lagune`.

**Cursor CLI**

- Sustituye el marketplace desde tu terminal:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Escribe `/plugins` en una sesión de `agent`.
- Vuelve a instalar **Lagune**.

## Comandos

Escribe los comandos por su nombre, como `/lagune-charter`.

---

**Permisos**

En **Cursor**, los comandos ejecutan el motor mediante **npx**, que el modo predeterminado, Auto-review, permite sin preguntar.

En **Cursor CLI**, el motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. Para permitirlas de antemano, añade estas reglas a `.cursor/cli.json` para un solo proyecto, o a `~/.cursor/cli-config.json` para todos:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Cuando el motor se ejecuta mediante **npx**, como ocurre con **skills.sh**, permite `Shell(npx:--yes lagune@*)`.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Cursor?

En Cursor, abre Customize, selecciona From GitHub Repository, introduce https://github.com/wellwelwel/lagune e instala Lagune. En Cursor CLI, ejecuta agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor y después instala Lagune desde /plugins.

### ¿Cómo actualizo Lagune en Cursor?

En Cursor, selecciona Refresh en el marketplace lagune, dentro de Customize. En Cursor CLI, elimina el marketplace lagune, vuelve a añadirlo y después vuelve a instalar Lagune desde /plugins.

### ¿Cómo ejecuto los comandos de Lagune en Cursor?

Escríbelos por su nombre, como /lagune-charter.

### ¿Puede Cursor ejecutar Lagune sin pedir permiso?

Sí. El modo predeterminado de Cursor, Auto-review, ya lo permite. En Cursor CLI, permite Mcp(plugin-lagune-lagune:lagune_read) y Mcp(plugin-lagune-lagune:lagune_write), además de Shell(npx:--yes lagune@*) cuando el motor se ejecuta mediante npx.
