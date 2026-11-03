# Instalar Lagune en Pi como paquete

> Instala Lagune en Pi como paquete, desde npm o desde GitHub, y mantenlo actualizado.

URL canónica: https://lagune.ai/es-ES/docs/install/pi
Idioma: es-ES
Original: https://lagune.ai/docs/install/pi
Última actualización: 2026-11-03

**npm**

Instala el paquete desde tu terminal:

```bash
pi install npm:lagune
```

**GitHub**

Instala el último commit de **GitHub**, que ejecuta el motor mediante **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Actualización

**npm**

Para actualizar **Lagune**, ejecuta:

```bash
pi update npm:lagune
```

**GitHub**

Para actualizar **Lagune**, ejecuta:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` actualiza todos los paquetes que hayas instalado, mientras que `pi update` a secas actualiza únicamente **Pi**.

## Comandos

Escribe los comandos con el prefijo `skill:`, como `/skill:lagune-charter` para `/lagune-charter`.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Pi?

Ejecuta pi install npm:lagune, o pi install git:github.com/wellwelwel/lagune para el último commit de GitHub.

### ¿Cómo actualizo Lagune en Pi?

Ejecuta pi update npm:lagune, o pi update git:github.com/wellwelwel/lagune si lo instalaste desde GitHub. pi update --extensions actualiza todos los paquetes que hayas instalado.

### ¿Cómo ejecuto los comandos de Lagune en Pi?

Escríbelos con el prefijo skill:, como /skill:lagune-charter.
