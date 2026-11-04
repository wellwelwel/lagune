# Instalar Lagune en cualquier agente con skills.sh

> Instala Lagune en cualquier agente de IA con la CLI de skills y mantenlo actualizado.

URL canónica: https://lagune.ai/es-ES/docs/install/universal
Idioma: es-ES
Original: https://lagune.ai/docs/install/universal
Última actualización: 2026-11-04

**Terminal**

Instala los comandos de **Lagune** desde tu terminal con [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Pega este prompt en tu agente:

```md
Ejecuta `npx --yes skills add wellwelwel/lagune` y sigue ahora las instrucciones de skill que genere. Lee su salida completa, redirigiéndola antes a un archivo temporal si hace falta. Resuelve las rutas relativas a partir del directorio de archivos de apoyo que indique.
```

## Actualización

**Terminal**

Para actualizar **Lagune**, ejecuta:

```bash
npx skills update
```

**Prompt**

Para actualizar **Lagune**, pega este prompt en tu agente:

```md
Ejecuta `npx --yes skills update -y` y lee su salida completa, redirigiéndola antes a un archivo temporal si hace falta.
```

---

**Una sola vía de instalación por agente**

Instala **Lagune** con **skills.sh** o con su **plugin**, nunca con ambos.

**Permisos**

Los comandos ejecutan el motor como `npx --yes lagune@0.17.0`, y la [página de instalación de cada agente](https://lagune.ai/es-ES/docs) muestra la regla que lo permite de antemano. En un sandbox sin acceso a la red, instala el motor en tu proyecto desde tu propio terminal, una vez y tras cada actualización:

```bash
npm i -D lagune@0.17.0
```

## Preguntas frecuentes

### ¿Cómo instalo Lagune en cualquier agente de IA?

Ejecuta npx skills add wellwelwel/lagune en tu proyecto o pega el prompt de instalación en tu agente.

### ¿Cómo actualizo Lagune si lo instalé con la CLI de skills?

Ejecuta npx skills update o pega el prompt de actualización en tu agente.

### ¿Puedo instalar Lagune con la CLI de skills y con un plugin a la vez?

No. Con ambos, el agente muestra cada comando dos veces, o usa una copia y oculta la otra.
