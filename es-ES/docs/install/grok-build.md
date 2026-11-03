# Instalar Lagune en Grok Build como plugin

> Instala Lagune en Grok Build como plugin, mantenlo actualizado y permite su motor de antemano.

URL canónica: https://lagune.ai/es-ES/docs/install/grok-build
Idioma: es-ES
Original: https://lagune.ai/docs/install/grok-build
Última actualización: 2026-11-03

Instala el plugin desde tu terminal:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Actualización

Para actualizar **Lagune**, ejecuta:

```bash
grok plugin update lagune
```

## Comandos

Escribe los comandos por su nombre, como `/lagune-charter`, o precedidos del nombre del plugin, como `/lagune:lagune-charter`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. Para permitirlas de antemano, añade estas reglas a `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Cuando el motor se ejecuta mediante **npx**, como ocurre con **skills.sh**, permite `Bash(npx --yes lagune@*)`.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Grok Build?

Ejecuta grok plugin install wellwelwel/lagune@plugin-grok --trust.

### ¿Cómo actualizo Lagune en Grok Build?

Ejecuta grok plugin update lagune.

### ¿Cómo ejecuto los comandos de Lagune en Grok Build?

Escríbelos por su nombre, como /lagune-charter, o precedidos del nombre del plugin, como /lagune:lagune-charter.

### ¿Puede Grok Build ejecutar Lagune sin pedir permiso?

Sí. Permite MCPTool(lagune__lagune_read) y MCPTool(lagune__lagune_write) en la configuración de Grok Build, además de Bash(npx --yes lagune@*) cuando el motor se ejecuta mediante npx.
