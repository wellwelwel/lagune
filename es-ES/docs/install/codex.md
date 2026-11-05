# Instalar Lagune en Codex CLI como plugin

> Instala Lagune en Codex CLI como plugin, mantenlo actualizado y ejecuta su motor dentro del sandbox.

URL canónica: https://lagune.ai/es-ES/docs/install/codex
Idioma: es-ES
Original: https://lagune.ai/docs/install/codex
Última actualización: 2026-11-05

Instala el plugin desde tu terminal:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Actualización

Para actualizar **Lagune**, ejecuta:

```bash
codex plugin marketplace upgrade lagune
```

## Comandos

Escribe `$` y el comando precedido del nombre del plugin, seguido de tu petición, como `$lagune:lagune-charter` para `/lagune-charter`. Al escribir `$` aparece la lista de comandos, y al elegir uno se inserta su nombre completo.

---

**Permisos**

El sandbox de **Codex** no tiene acceso a la red. Instala el motor en tu proyecto desde tu propio terminal, una vez y tras cada actualización:

```bash
npm i -D lagune@0.18.0
```

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Codex CLI?

Ejecuta codex plugin marketplace add wellwelwel/lagune y después codex plugin add lagune@lagune.

### ¿Cómo actualizo Lagune en Codex CLI?

Ejecuta codex plugin marketplace upgrade lagune.

### ¿Cómo ejecuto los comandos de Lagune en Codex CLI?

Escribe $ y el comando precedido del nombre del plugin, seguido de tu petición, como $lagune:lagune-charter.

### ¿Funciona Lagune dentro del sandbox de Codex?

Sí, en cuanto instales el motor en tu proyecto con npm i -D lagune@0.18.0 desde tu propio terminal, una vez y tras cada actualización.
