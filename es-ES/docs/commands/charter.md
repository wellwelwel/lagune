# /lagune-charter: define tus principios de seguridad

> Establece los principios de seguridad de tu proyecto, las reglas que respetan todas las fases posteriores, y registra las categorías de especializaciones que justifica su lectura del proyecto.

URL canónica: https://lagune.ai/es-ES/docs/commands/charter
Idioma: es-ES
Original: https://lagune.ai/docs/commands/charter
Última actualización: 2026-11-03

🧬 Cuéntale a **Lagune** qué es tu proyecto y lo convierte en tus reglas de seguridad (o, si no lo describes, las deduce a partir del propio proyecto).

El charter es la capa rectora: un conjunto de principios que ponen la seguridad por delante y que todas las fases posteriores deben respetar. Piensa en él como la comprobación en tiempo de compilación de la postura de seguridad de tu proyecto.

## Cómo usarlo

**Describirlo**

```prompt
/lagune-charter Mi proyecto es una tienda online de videojuegos. Los clientes añaden productos a un carrito y pagan con tarjeta de crédito o por transferencia bancaria. Pueden ver sus pedidos y el estado de cada uno.
```

**Dejar que Lagune proponga**

```prompt
/lagune-charter
```

> _Veo una biblioteca de pagos, un sistema de inicio de sesión y un modelo de pedidos vinculado a un cliente. Parece una tienda online que vende algo. Los clientes pagan y hacen el seguimiento de sus propios pedidos..._ ☁️

## Lo que deduce

**Lagune** toma tu descripción o tu **PRD** como guía, deduce lo que implica para la seguridad y luego lee el proyecto para ir más allá de lo que mencionaste. Por ejemplo:

- Un carrito que guarda pedidos implica que hay una **base de datos**:
  - p. ej., `"¿Dónde se guardan los datos?"`, `"¿Quién puede acceder a ellos?"`, `"¿Se filtran?"`.
- Que los clientes puedan ver sus propios pedidos implica algún tipo de **inicio de sesión o control de acceso**:
  - p. ej., `"¿Puede un cliente acceder a los pedidos de otro?"`, `"¿Están protegidas las sesiones?"`.
- Aceptar pagos con tarjeta y por transferencia implica que **hay dinero y datos sensibles en juego**:
  - p. ej., `"¿Se guardan los datos de las tarjetas?"`, `"¿Se verifican los pagos?"`.

Tu descripción y el proyecto se suman: tu descripción marca la intención, y la lectura de las dependencias, el README y la configuración saca a la luz lo que no mencionaste. Si algo importante sigue sin estar claro, **Lagune** te hace una pregunta breve y sencilla en lugar de suponer.

A partir de ahí, **Lagune** crea un conjunto de reglas de seguridad a medida para el proyecto, que puedes revisar y ajustar siempre que lo necesites.

**Sácale el máximo partido**

- También puedes definir tus propias reglas de seguridad para el proyecto.
- Cuantos más detalles relevantes des, mejor será el informe final:
  - Explica el proyecto, cómo funciona y qué ocurre por dentro.
  - ¿Quién es el usuario final? ¿Qué pueden hacer los usuarios y qué no?
  - Los detalles de comportamiento valen tanto como los técnicos.
- La memoria del charter se guarda en `.lagune/memory/charter.md`.

## Las categorías que registra

Las especializaciones, el conocimiento de seguridad que las fases posteriores cargan bajo demanda, se incorporan al [catálogo](https://lagune.ai/es-ES/docs/catalog) de tu proyecto por [categoría](https://lagune.ai/es-ES/docs/categories). Mientras tu proyecto no tenga ninguna categoría registrada, el charter registra cada una que justifique su lectura, como el lenguaje de tu proyecto, las llamadas a un LLM o los contenedores, y las nombra en su resumen.

Una vez registradas las categorías, el charter las deja como están y solo menciona las categorías que tu proyecto aún no usa. Cámbialas tú mismo cuando quieras:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Siguiente paso

Con las reglas fijadas, identifica qué hace realmente tu sistema: [`/lagune-detect`](https://lagune.ai/es-ES/docs/commands/detect).

## Preguntas frecuentes

### ¿Qué es el charter en Lagune?

El charter es la capa rectora de Lagune, un conjunto de principios que ponen la seguridad por delante y que todas las fases posteriores deben respetar. Piensa en él como la comprobación en tiempo de compilación de la postura de seguridad de tu proyecto.

### ¿Dónde se guarda el charter?

En .lagune/memory/charter.md.

### ¿Puedo escribir mis propias reglas en el charter?

Sí. Lagune propone reglas a partir de tu descripción y de tu código, y puedes reformularlas, eliminarlas, añadir otras o acotar su alcance.

### ¿El charter elige mis categorías de especializaciones?

Solo mientras no haya ninguna registrada. En ese caso registra cada categoría que justifique su lectura, como tu lenguaje o las llamadas a un LLM. Una vez registradas, nunca las cambia.
