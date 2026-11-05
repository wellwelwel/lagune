# Instalar Lagune en Claude Code como plugin

> Instala Lagune en Claude Code como plugin, en el terminal, la extensión o la aplicación de escritorio, mantenlo actualizado y permite su motor de antemano.

URL canónica: https://lagune.ai/es-ES/docs/install/claude-code
Idioma: es-ES
Original: https://lagune.ai/docs/install/claude-code
Última actualización: 2026-11-05

**Terminal**

Instala el plugin desde tu terminal:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

O desde una sesión de **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Extensión**

- Escribe `/plugin` y selecciona **Manage plugins**.
- Añade `wellwelwel/lagune` en la pestaña **Marketplaces**.
- Instala `lagune` en la pestaña **Plugins**.

**Escritorio**

- Instala **Lagune** desde el terminal o desde la extensión, y en la extensión elige **Install for you**.
- Inicia una sesión nueva en la aplicación de escritorio, que carga los plugins que instalas para ti.

## Actualización

**Terminal**

Para actualizar **Lagune**, ejecuta:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Para mantenerlo actualizado, selecciona **Enable auto-update** en el marketplace `lagune`, dentro de `/plugin`.

**Extensión**

- Escribe `/plugin` y selecciona **Manage plugins**.
- Abre la pestaña **Marketplaces**.
- Selecciona el icono de actualizar de `lagune`.

**Escritorio**

- Actualiza **Lagune** desde el terminal o desde la extensión.
- Inicia una sesión nueva en la aplicación de escritorio.

## Comandos

Escribe los comandos por su nombre, como `/lagune-charter`, o precedidos del nombre del plugin, como `/lagune:lagune-charter`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. Para permitirlas de antemano, añade estas reglas a `.claude/settings.json` para un solo proyecto, o a `~/.claude/settings.json` para todos:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Cuando el motor se ejecuta mediante **npx**, como ocurre con **skills.sh**, permite `Bash(npx --yes lagune@*)`. Con el sandbox activado, añade también `registry.npmjs.org` a `sandbox.network.allowedDomains`.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Claude Code?

Ejecuta claude plugin install lagune --marketplace wellwelwel/lagune. En una sesión o en la extensión, añade el marketplace wellwelwel/lagune desde el gestor de plugins e instala lagune. La aplicación de escritorio lo carga en cuanto lo instalas para ti en el terminal o en la extensión.

### ¿Cómo actualizo Lagune en Claude Code?

Ejecuta claude plugin marketplace update lagune y después claude plugin update lagune@lagune, o selecciona Enable auto-update en el marketplace lagune, dentro de /plugin. En la extensión, abre Manage plugins desde /plugin y selecciona el icono de actualizar del marketplace lagune. La aplicación de escritorio carga la actualización en su siguiente sesión.

### ¿Cómo ejecuto los comandos de Lagune en Claude Code?

Escríbelos por su nombre, como /lagune-charter, o precedidos del nombre del plugin, como /lagune:lagune-charter.

### ¿Puede Claude Code ejecutar Lagune sin pedir permiso?

Sí. Permite mcp__plugin_lagune_lagune__lagune_read y mcp__plugin_lagune_lagune__lagune_write en la configuración de Claude Code, además de Bash(npx --yes lagune@*) cuando el motor se ejecuta mediante npx.
