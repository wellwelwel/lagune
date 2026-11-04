# Instalar Lagune en Gemini CLI como extensión

> Instala Lagune en Gemini CLI como extensión, mantenlo actualizado y permite su motor de antemano.

URL canónica: https://lagune.ai/es-ES/docs/install/gemini-cli
Idioma: es-ES
Original: https://lagune.ai/docs/install/gemini-cli
Última actualización: 2026-11-04

Instala la extensión desde tu terminal:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Actualización

Para actualizar **Lagune**, ejecuta:

```bash
gemini extensions update lagune
```

Para mantenerlo actualizado, instálalo con `--auto-update`.

## Comandos

Escribe los comandos precedidos del nombre de la extensión, como `/lagune:lagune-charter` para `/lagune-charter`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. **Gemini CLI** solo las inicia en una carpeta de confianza. Para permitirlas de antemano, guarda esta regla como `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Cuando el motor se ejecuta mediante **npx**, como ocurre con **skills.sh**, añade esta regla al mismo archivo:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Gemini CLI?

Ejecuta gemini extensions install https://github.com/wellwelwel/lagune.

### ¿Cómo actualizo Lagune en Gemini CLI?

Ejecuta gemini extensions update lagune o instala la extensión con --auto-update.

### ¿Cómo ejecuto los comandos de Lagune en Gemini CLI?

Escríbelos precedidos del nombre de la extensión, como /lagune:lagune-charter.

### ¿Puede Gemini CLI ejecutar Lagune sin pedir permiso?

Sí. Añade una regla de política que permita las herramientas lagune_read y lagune_write del servidor lagune, y otra para run_shell_command con npx --yes lagune@ y una versión cuando el motor se ejecuta mediante npx.
