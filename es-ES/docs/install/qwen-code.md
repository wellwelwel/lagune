# Instalar Lagune en Qwen Code como extensión

> Instala Lagune en Qwen Code como extensión, mantenlo actualizado y permite su motor de antemano.

URL canónica: https://lagune.ai/es-ES/docs/install/qwen-code
Idioma: es-ES
Original: https://lagune.ai/docs/install/qwen-code
Última actualización: 2026-11-03

Instala la extensión desde tu terminal:

```bash
qwen extensions install lagune
```

## Actualización

Para actualizar **Lagune**, ejecuta:

```bash
qwen extensions update lagune
```

Para mantenerlo actualizado, instálalo con `--auto-update`.

## Comandos

Escribe los comandos precedidos del nombre de la extensión, como `/lagune:lagune-charter` para `/lagune-charter`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. Para permitirlas de antemano, añade estas reglas a `.qwen/settings.json` para un solo proyecto, o a `~/.qwen/settings.json` para todos:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Cuando el motor se ejecuta mediante **npx**, como ocurre con **skills.sh**, permite `Shell(npx --yes lagune@*)`.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Qwen Code?

Ejecuta qwen extensions install lagune.

### ¿Cómo actualizo Lagune en Qwen Code?

Ejecuta qwen extensions update lagune o instala la extensión con --auto-update.

### ¿Cómo ejecuto los comandos de Lagune en Qwen Code?

Escríbelos precedidos del nombre de la extensión, como /lagune:lagune-charter.

### ¿Puede Qwen Code ejecutar Lagune sin pedir permiso?

Sí. Permite mcp__lagune__lagune_read y mcp__lagune__lagune_write en la configuración de Qwen Code, además de Shell(npx --yes lagune@*) cuando el motor se ejecuta mediante npx.
