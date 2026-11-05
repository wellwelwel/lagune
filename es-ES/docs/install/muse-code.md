# Instalar Lagune en Muse Code como plugin

> Instala Lagune en Muse Code como plugin, mantenlo actualizado y ejecuta su motor dentro del sandbox.

URL canónica: https://lagune.ai/es-ES/docs/install/muse-code
Idioma: es-ES
Original: https://lagune.ai/docs/install/muse-code
Última actualización: 2026-11-05

Instala el plugin desde tu terminal:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Actualización

Para actualizar **Lagune**, refresca el marketplace y vuelve a instalar el plugin:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Comandos

Escribe los comandos por su nombre, como `/lagune-charter`, o precedidos del nombre del plugin, como `/lagune:lagune-charter`.

---

**Permisos**

El sandbox de **Muse Code** no puede descargar el motor. Instálalo en tu proyecto desde tu propio terminal, una vez y tras cada actualización:

```bash
npm i -D lagune@0.18.0
```

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Muse Code?

Ejecuta muse plugins marketplace add lagune wellwelwel/lagune y después muse plugins install lagune@lagune.

### ¿Cómo actualizo Lagune en Muse Code?

Ejecuta muse plugins marketplace update lagune y después reinstálalo con muse plugins remove lagune y muse plugins install lagune@lagune.

### ¿Cómo ejecuto los comandos de Lagune en Muse Code?

Escríbelos por su nombre, como /lagune-charter, o precedidos del nombre del plugin, como /lagune:lagune-charter.

### ¿Funciona Lagune dentro del sandbox de Muse Code?

Sí, en cuanto instales el motor en tu proyecto con npm i -D lagune@0.18.0 desde tu propio terminal, una vez y tras cada actualización.
