# /lagune-harden: aplica correcciones de seguridad a tu código

> Aplica a tu código las correcciones del plan, de forma segura y de una en una.

URL canónica: https://lagune.ai/es-ES/docs/commands/harden
Idioma: es-ES
Original: https://lagune.ai/docs/commands/harden
Última actualización: 2026-11-03

🔧 Aplica a tu código las correcciones del plan, de forma segura y de una en una.

## Cómo usarlo

**Aplicar todo**

```prompt
/lagune-harden
```

**Indicar rutas**

```prompt
/lagune-harden src/routes/upload.ts
```

**Por prioridad**

```prompt
/lagune-harden prioridad crítica y alta
```

## Cómo funciona

El plan ya ha decidido cada corrección, así que harden solo tiene que aplicarla. Como es la única fase que toca tu código, avanza con cuidado: aplica las correcciones de una en una para que cada cambio sea fácil de revisar, y nunca debilita un control para que una corrección encaje. Por ejemplo, la corrección de la subida de archivos:

- **Subida de archivos** (Estado: **Applied**)
  - _Qué ha cambiado:_ comprueba el tipo real y el tamaño del archivo, rechaza todo lo inesperado, lo renombra al guardarlo y lo almacena donde no puede ejecutarse como código.
  - _Dónde:_ la función `handleUpload`, además de la función auxiliar de almacenamiento a la que llama.

Si una corrección no se puede aplicar por completo, harden hace lo que puede sin riesgo, marca el resto como **Partial** o **Blocked** y lo deja abierto.

**Applied no significa verificado**

Applied aún no significa demostrado. Para eso está [verify](https://lagune.ai/es-ES/docs/commands/verify).

**Consejo**

- Se basa por completo en el plan. Si una corrección o un archivo nunca se planificó, te indica que ejecutes primero `/lagune-plan` sobre ello.
- Volver a ejecutarlo concilia el registro: salen los cambios revertidos y entran las correcciones recién aplicadas.
- El registro del bastionado está en `.lagune/memory/harden.md`.

**Depende de plan y cambia tu código**

Harden se basa en [`/lagune-plan`](https://lagune.ai/es-ES/docs/commands/plan). Es la única fase que cambia tu código.

## Siguiente paso

Demuestra que cada corrección se sostiene: [`/lagune-verify`](https://lagune.ai/es-ES/docs/commands/verify).

## Preguntas frecuentes

### ¿/lagune-harden cambia mi código?

Sí. Es la única fase que toca tu código, y aplica las correcciones del plan de una en una.

### ¿Qué significan Applied, Partial y Blocked?

Son el estado que Lagune registra para cada corrección. Applied significa que la corrección se ha hecho, Partial que solo se ha hecho en parte y Blocked que no se ha podido aplicar. Applied aún no significa demostrado.

### ¿Lagune aplica correcciones sin preguntar?

Que una edición necesite tu aprobación depende de tu agente y del modo de permisos con el que lo ejecutas, no de Lagune, que no añade ninguna confirmación propia. Aun así, nunca debilita un control para satisfacer una corrección, y si una corrección entrara en conflicto con una regla del charter, se detiene y te avisa antes.
