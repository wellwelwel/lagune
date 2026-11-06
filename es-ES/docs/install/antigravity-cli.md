# Instalar Lagune en Antigravity CLI como plugin

> Instala Lagune en Antigravity CLI como plugin, mantenlo actualizado y permite su motor de antemano.

URL canónica: https://lagune.ai/es-ES/docs/install/antigravity-cli
Idioma: es-ES
Original: https://lagune.ai/docs/install/antigravity-cli
Última actualización: 2026-11-03

Instala el plugin desde tu terminal:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Actualización

Para actualizar **Lagune**, vuelve a instalarlo:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Comandos

Escribe los comandos precedidos del nombre del plugin, como `/lagune:lagune-charter` para `/lagune-charter`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. Un comando enviado como primer mensaje de una sesión se ejecuta antes de que se carguen, así que usa **npx** en su lugar. Para permitir de antemano las herramientas y **npx**, añade estas reglas a `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Antigravity CLI?

Ejecuta agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### ¿Cómo actualizo Lagune en Antigravity CLI?

Vuelve a ejecutar agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### ¿Cómo ejecuto los comandos de Lagune en Antigravity CLI?

Escríbelos precedidos del nombre del plugin, como /lagune:lagune-charter.

### ¿Puede Antigravity CLI ejecutar Lagune sin pedir permiso?

Sí. Permite mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) y command(regex:npx --yes lagune@[0-9.]+) en la configuración de Antigravity CLI. La regla de npx cubre el comando enviado como primer mensaje de una sesión.
