# Instalar Lagune en cualquier agente con skills.sh o GitHub CLI

> Instala Lagune en cualquier agente de IA con la CLI de skills o con GitHub CLI y mantenlo actualizado.

URL canónica: https://lagune.ai/es-ES/docs/install/universal
Idioma: es-ES
Original: https://lagune.ai/docs/install/universal
Última actualización: 2026-11-09

**skills.sh**

Instala los comandos de **Lagune** en tu proyecto desde tu terminal con [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

O pega este prompt en tu agente:

```md
Ejecuta `npx --yes skills add wellwelwel/lagune --yes` y sigue ahora las instrucciones de skill que genere. Lee su salida completa, redirigiéndola antes a un archivo temporal si hace falta. Resuelve las rutas relativas a partir del directorio de archivos de apoyo que indique.
```

**GitHub CLI**

Instala los comandos de **Lagune** en tu proyecto desde tu terminal con [**GitHub CLI**](https://cli.github.com/) 2.90.0 o posterior:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

O pega este prompt en tu agente:

```md
Ejecuta `gh skill install wellwelwel/lagune --all --scope project` y lee su salida completa, redirigiéndola antes a un archivo temporal si hace falta.
```

## Actualización

**skills.sh**

Para actualizar **Lagune**, ejecuta:

```bash
npx skills update
```

O pega este prompt en tu agente:

```md
Ejecuta `npx --yes skills update -y` y lee su salida completa, redirigiéndola antes a un archivo temporal si hace falta.
```

**GitHub CLI**

Para actualizar **Lagune**, ejecuta:

```bash
gh skill update --all
```

O pega este prompt en tu agente:

```md
Ejecuta `gh skill update --all` y lee su salida completa, redirigiéndola antes a un archivo temporal si hace falta.
```

---

**Sandbox**

En un sandbox sin acceso a la red, los comandos no pueden descargar el motor. Instálalo en tu proyecto desde tu propio terminal, una vez y tras cada actualización:

```bash
npm i -D lagune@0.19.0
```

## Preguntas frecuentes

### ¿Cómo instalo Lagune en cualquier agente de IA?

Ejecuta npx skills add wellwelwel/lagune -y o gh skill install wellwelwel/lagune --all --scope project en tu proyecto, o pega el prompt de instalación en tu agente.

### ¿Cómo actualizo Lagune en cualquier agente de IA?

Ejecuta npx skills update si lo instalaste con skills.sh, o gh skill update --all si lo instalaste con GitHub CLI. También puedes pegar el prompt de actualización en tu agente.

### ¿Puedo instalar Lagune por más de una vía?

No. Con dos, el agente muestra cada comando dos veces, o usa una copia y oculta la otra.
