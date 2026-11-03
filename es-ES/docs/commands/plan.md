# /lagune-plan: puntúa los hallazgos y planifica las correcciones

> Convierte lo que ha encontrado detect en un plan de defensa: evalúa cada hallazgo con una categoría y una puntuación CVSS v4.0, y asígnale una corrección.

URL canónica: https://lagune.ai/es-ES/docs/commands/plan
Idioma: es-ES
Original: https://lagune.ai/docs/commands/plan
Última actualización: 2026-11-03

🛡️ Convierte lo que ha encontrado detect en un plan de defensa: evalúa cada hallazgo con una categoría y una puntuación CVSS v4.0, y asígnale la corrección que hay que aplicar.

## Cómo usarlo

**Planificar todo**

```prompt
/lagune-plan
```

**Indicar rutas**

```prompt
/lagune-plan src/routes/upload.ts
```

**Centrarse en una preocupación**

```prompt
/lagune-plan dónde podrían filtrarse datos sensibles
```

## Cómo funciona

Esta fase continúa donde lo dejó detect. Detect ya ha averiguado qué hace tu sistema y qué riesgo conlleva cada cosa, así que el plan no repite el riesgo, sino que evalúa su gravedad y decide qué hacer con él. Plan nunca lee el código, lo que obliga a que cada corrección apunte a algo que detect haya detectado de verdad. Evalúa cada hallazgo con el método CVSS v4.0: una categoría, un vector CVSS v4.0 razonado a partir de lo que recogieron detect y el charter y puntuado por el [hook `cvss`](https://lagune.ai/es-ES/docs/hooks/cvss), y el nivel de prioridad en el que cae esa puntuación. Cada corrección indica además el principio del charter que respeta.

Por ejemplo:

- **Subida de archivos** (Prioridad: **Critical**)
  - _Categoría:_ subida de archivos sin restricciones (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Por qué esta prioridad:_ cualquiera puede llegar a la subida desde internet, y está en el servidor que guarda los archivos de los clientes.
  - _Respeta:_ III. Toda entrada se considera no fiable hasta que se valida.
  - _Corrección:_ comprobar el tipo real y el tamaño del archivo, renombrarlo al guardarlo y almacenar las subidas donde no puedan ejecutarse como código.

Con eso tienes una lista de correcciones evaluadas y priorizadas, cada una vinculada a un hallazgo y lista para que la siguiente fase la aplique. La puntuación se calcula, nunca se estima: el vector recoge la exposición del proyecto y lo que está en juego como métricas de entorno (Environmental), y cualquiera puede pegarlo en la calculadora de FIRST o de NVD y obtener de nuevo la misma puntuación.

**Consejo**

- Se basa por completo en detect. Si un archivo o una preocupación nunca se identificó, te indica que ejecutes primero `/lagune-detect` sobre ello.
- Volver a ejecutarlo actualiza el plan: salen las correcciones ya hechas y entran las nuevas.
- El plan de defensa está en `.lagune/memory/plan.md`.

**Depende de detect**

Plan solo trabaja con lo que [`/lagune-detect`](https://lagune.ai/es-ES/docs/commands/detect) ya ha identificado, así que ejecuta detect primero.

## Siguiente paso

Aplica el plan: [`/lagune-harden`](https://lagune.ai/es-ES/docs/commands/harden).

## Preguntas frecuentes

### ¿Cómo prioriza Lagune las vulnerabilidades?

/lagune-plan evalúa cada hallazgo con una categoría y una puntuación CVSS v4.0 calculada por el hook cvss, y le asigna la corrección que hay que aplicar.

### ¿Lagune usa CVSS v4.0?

Sí. Cada hallazgo recibe un vector y una puntuación CVSS v4.0, calculados por el hook cvss con la misma aritmética que la calculadora de FIRST, así que cualquiera puede pegar ahí el vector y obtener de nuevo la puntuación.

### ¿La fase plan lee mi código?

No. Plan nunca lee el código, lo que obliga a que cada corrección apunte a algo que detect haya detectado de verdad.
