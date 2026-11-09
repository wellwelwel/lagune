# Spec-Driven Development: protege lo que construye tu especificación

> Combina Lagune con Superpowers, Spec Kit u OpenSpec: define el charter a partir de tu especificación e impleméntala con /lagune para que cada tarea quede bastionada a medida que se escribe el código.

URL canónica: https://lagune.ai/es-ES/docs/examples/spec-driven-development
Idioma: es-ES
Original: https://lagune.ai/docs/examples/spec-driven-development
Última actualización: 2026-11-09

Combina **Lagune** con una herramienta de Spec-Driven Development, como [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) u [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): tu herramienta decide qué construir y **Lagune** decide cómo se mantiene seguro.

## Cómo encaja

**Lagune** se suma al flujo de tu herramienta en dos puntos y deja el resto como está:

1. En cuanto tu herramienta escribe la especificación, [`/lagune-charter`](https://lagune.ai/es-ES/docs/commands/charter) la lee y fija los principios de seguridad que requiere la funcionalidad, antes de que exista código.
2. Añadido al comando de implementación de tu herramienta, [`/lagune`](https://lagune.ai/es-ES/docs/commands/lagune) bastiona cada tarea según esos principios a medida que se escribe el código.

**Consejo**

Sustituye la ruta de la especificación de cada ejemplo por el archivo que haya escrito tu herramienta. Si el proyecto ya tiene un charter, el mismo paso lo actualiza con lo que necesita la nueva funcionalidad.

## Ejemplos de prompts

Envía los prompts en orden, cada uno cuando termine el anterior.

```prompt
/superpowers:brainstorming Compra como invitado con pago con tarjeta.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Compra como invitado con pago con tarjeta.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
