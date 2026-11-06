# /lagune-prove: prueba de concepto exclusivamente defensiva

> Convierte cada hallazgo detectado en una prueba de concepto (PoC) ejecutable y exclusivamente defensiva, con un aviso de seguridad para la divulgación responsable.

URL canónica: https://lagune.ai/es-ES/docs/commands/prove
Idioma: es-ES
Original: https://lagune.ai/docs/commands/prove
Última actualización: 2026-11-03

🧪 Convierte cada hallazgo detectado en evidencia ejecutable y exclusivamente defensiva para la divulgación responsable.

Para cada hallazgo que recoge el mapa de detect, escribe un aviso de seguridad autocontenido y un test que comprueba el **camino seguro**, de modo que el test falla mientras el problema sigue presente y pasa en cuanto se corrige el código.

**Consejo**

Los tests de **Lagune** quedan aislados en `.lagune/`, separados de tus propios tests.

## Cómo usarlo

**Todos los hallazgos**

```prompt
/lagune-prove
```

**Un hallazgo por su nombre**

Consulta por su nombre los hallazgos que ya están en seguimiento:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • Inyección SQL en la búsqueda de usuarios
#   ...
```

```prompt
# Después, demuestra uno de ellos
/lagune-prove Inyección SQL en la búsqueda de usuarios
```

## Cómo funciona

Lee el código fuente al que apunta cada hallazgo y escribe en `.lagune/proofs/` un directorio por cada hallazgo demostrado, con exactamente dos archivos:

| Archivo                      | Qué es                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (o `.cjs`) | El test. Se ejecuta con Poku cuando tu proyecto ya lo usa y, si no, con el ejecutor de tests nativo de Node.js, así que no necesita instalar nada. |
| `report.md`                  | Un aviso de seguridad autocontenido: gravedad, impacto, cómo se reproduce y el comando para ejecutarlo, legible por sí solo.                       |

Las pruebas siempre están en JavaScript, así que siguen siendo portables sea cual sea el lenguaje de tu proyecto. Un índice `README.md` enlaza todas las pruebas y ofrece un único comando para ejecutarlas todas.

**Consejo**

- Es **opcional y autónomo**: no es una de las cinco fases ni forma parte de la cadena de seguimiento.
- Solo escribe en `.lagune/proofs/` y nunca toca los artefactos de las fases ni tu código, que solo lee.
- Un hallazgo cuyo test no reproduce el problema se queda sin prueba, y te indica que ejecutes [`/lagune-detect`](https://lagune.ai/es-ES/docs/commands/detect) sobre ese punto para conciliarlo.
- Volver a ejecutarlo concilia las pruebas: si un hallazgo ha desaparecido o ya no se reproduce, se elimina su directorio.

**Nota**

**Solo se ejecuta cuando lo invocas:** el agente nunca lo inicia por su cuenta.

**Se basa en detect**

Prove lee el mapa de detect que genera [`/lagune-detect`](https://lagune.ai/es-ES/docs/commands/detect), así que ejecuta detect primero.

## Solo defensa, y con autorización

Antes de generar nada, confirma que tienes autorización para probar el objetivo, y rechaza cualquier petición de un exploit funcional, de un payload de ataque o de técnicas para evadir la detección. Una prueba demuestra el comportamiento seguro y nunca emite una entrada de ataque.

## De la prueba a la divulgación

Los dos archivos de cada hallazgo demostrado van juntos en un **GitHub Gist privado** para informar de la vulnerabilidad. Son evidencia de un problema presente y aún sin divulgar, así que un `.gitignore` dentro de `.lagune/proofs/` los mantiene fuera de todos los commits: compártelos solo a través de ese Gist hasta que los mantenedores lo hayan resuelto.

Cerrar un hallazgo en la cadena de **Lagune** sigue siendo tarea de [`/lagune-harden`](https://lagune.ai/es-ES/docs/commands/harden) y [`/lagune-verify`](https://lagune.ai/es-ES/docs/commands/verify): prove genera evidencia, no cierra nada.

## Preguntas frecuentes

### ¿Lagune genera exploits?

No. /lagune-prove escribe evidencia exclusivamente defensiva: un test que comprueba el camino seguro, de modo que falla mientras el problema sigue presente y pasa en cuanto se corrige el código, además de un aviso de seguridad para la divulgación responsable.

### ¿Qué genera prove?

Dos archivos por hallazgo: un test (report.test.mjs o .cjs) y un aviso de seguridad (report.md).

### ¿Cómo divulgo de forma responsable un fallo que ha encontrado Lagune?

Prove escribe un aviso de seguridad autocontenido que puedes compartir por un canal privado, como un GitHub Gist privado, siguiendo la divulgación responsable.
