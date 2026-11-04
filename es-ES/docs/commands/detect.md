# /lagune-detect: identifica qué hace tu sistema y sus riesgos

> Lee tu código e identifica qué hace tu sistema y dónde están los riesgos.

URL canónica: https://lagune.ai/es-ES/docs/commands/detect
Idioma: es-ES
Original: https://lagune.ai/docs/commands/detect
Última actualización: 2026-11-04

🔬 Descubre qué hace realmente tu sistema y dónde están los riesgos.

Detect lee el código y registra solo lo que realmente encuentra, con la evidencia que necesitan las fases posteriores. Su instrucción rectora es detectar, no inventar.

## Cómo usarlo

**Análisis completo**

```prompt
/lagune-detect
```

**Indicar rutas**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Describir una preocupación**

```prompt
/lagune-detect asegúrate de que los datos de los clientes nunca queden expuestos
```

## Lo que identifica

**Lagune** lee el código e identifica lo que encuentra. Cada hallazgo indica qué es, por qué importa y la evidencia. Por ejemplo:

- **Subida de archivos**, el sistema acepta archivos de los usuarios:
  - _Por qué importa:_ un archivo disfrazado de imagen puede ocultar código malicioso.
  - _Evidencia:_ el handler de `POST /upload` se fía del tipo MIME que envía el cliente, sin comprobar el tipo real del archivo.
- **Inicio de sesión y sesiones**, los usuarios se identifican para acceder a su cuenta:
  - _Por qué importa:_ una gestión débil de las sesiones permite que alguien se haga con la cuenta de otra persona.
  - _Evidencia:_ la lógica de emisión de sesiones, que las emite sin fecha de caducidad.

Por el camino, detect emite un veredicto para cada especialización del [catálogo](https://lagune.ai/es-ES/docs/catalog) de tu proyecto contrastándola con el código, aplica aquellas cuyo contexto está presente y las registra en **Applied specializations**, la lista que reutilizan harden y verify.

Con eso tienes un mapa claro de lo que hace tu sistema y de dónde están los riesgos, listo para que los siguientes pasos actúen sobre él.

**Consejo**

- Volver a ejecutarlo actualiza el mapa: los hallazgos resueltos desaparecen y entran los nuevos.
- El mapa de detect se guarda en `.lagune/memory/detect.md`.

## Siguiente paso

Convierte el mapa en un plan: [`/lagune-plan`](https://lagune.ai/es-ES/docs/commands/plan).

## Preguntas frecuentes

### ¿Qué hace /lagune-detect?

Lee tu código e identifica qué hace tu sistema y dónde están los riesgos, y registra solo lo que realmente encuentra. Su regla es detectar, no inventar.

### ¿Qué es un hallazgo en Lagune?

Un hallazgo es un riesgo detectado, con lo que es, por qué importa y la evidencia en el código. Es la unidad en seguimiento que plan, harden y verify van trasladando de una fase a la siguiente.

### ¿Dónde se guarda el mapa de detect?

En .lagune/memory/detect.md.

### ¿Qué especializaciones usa detect?

Todas las del catálogo de tu proyecto reciben un veredicto contrastado con el código. Detect aplica aquellas cuyo contexto está presente y las registra en Applied specializations.
