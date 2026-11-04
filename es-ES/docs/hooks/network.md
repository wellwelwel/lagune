# Hook network: evalúa el riesgo de SSRF de las URL

> Evalúa el riesgo de SSRF de uno o varios destinos de petición, directamente desde la línea de comandos.

URL canónica: https://lagune.ai/es-ES/docs/hooks/network
Idioma: es-ES
Original: https://lagune.ai/docs/hooks/network
Última actualización: 2026-11-04

El hook `network` decide si el destino de una petición hecha desde el servidor está a salvo de **SSRF** (una petición que se puede dirigir contra servicios internos, metadatos de la nube o hosts privados). Es el motor determinista en el que se apoya la [especialización `network`](https://lagune.ai/es-ES/docs/catalog), y puedes ejecutarlo tú mismo.

## Cómo ejecutarlo

Pasa cada destino con `--url`. El hook muestra una palabra por destino, que se interpreta con la tabla de más abajo.

**Un destino**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Varios destinos**

Repite `--url` para evaluar toda una lista de permitidos o de bloqueados en una sola llamada, con un veredicto por línea y en el mismo orden.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Resuelve el host igual que lo hace la red, así que las formas codificadas de una dirección interna no se cuelan: hexadecimal, octal, decimal sin puntos, abreviada, IPv6 e IPv4 mapeada dan todas `private-target`. Y cuando un validador descuidado y el cliente que hace la petición real leerían hosts distintos, el veredicto es `parser-divergent`.

## Cómo interpretar el veredicto

| Veredicto          | Significado                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `safe`             | El destino apunta a un host público, y un validador descuidado leería el mismo host.                                  |
| `private-target`   | El host se resuelve a una dirección privada, de loopback, de enlace local, no especificada o de metadatos de la nube. |
| `parser-divergent` | Un validador de texto descuidado leería un host real distinto del host al que se conecta el cliente.                  |
| `invalid url`      | La cadena no es una URL válida, así que no hay nada que pedir.                                                        |

Solo `safe` equivale a permitir. Trata `private-target`, `parser-divergent` e `invalid url` como un bloqueo.

### Opciones de la CLI

| Opción  | Valor             | Descripción                                                                       |
| ------- | ----------------- | --------------------------------------------------------------------------------- |
| `--url` | una URL o un host | Comprueba un destino. Repítela para comprobar varios, con un veredicto por línea. |

Se necesita al menos un `--url`. El destino nunca va como argumento posicional suelto, así que no se puede confundir con una opción.

**Por qué como valor de una opción**

Cada destino se pasa como valor de una opción, nunca interpolado en el comando. Un valor con comillas o comillas invertidas queda inerte y no puede inyectar nada en la shell. Escríbelo siempre entre comillas simples para que tu shell no lo expanda antes.

**Lo que no cubre**

El hook es puro y nunca resuelve DNS, así que dos huecos que solo aparecen en tiempo de ejecución quedan fuera de su alcance: el **DNS rebinding** (un nombre que se resuelve a una dirección pública al comprobarlo y a una interna al hacer la petición) y las **cadenas de redirecciones** (un primer salto que pasa la comprobación y luego redirige hacia dentro). Ciérralos resolviendo una sola vez y conectándote a la dirección validada, y rechazando las redirecciones. Trata los nombres de loopback reservados (`localhost` y la familia `.localhost`) como internos sin consultar el DNS, pero cualquier otro nombre DNS da `safe`, porque afirmar que se resuelve hacia dentro exigiría resolverlo: de esos nombres se encarga la lista de permitidos, que es justo lo que este comprobador valida.

**Consejo**

Es la misma comprobación que ejecuta la [especialización `network`](https://lagune.ai/es-ES/docs/catalog) para demostrar que un filtro de destinos se sostiene.

## Preguntas frecuentes

### ¿Cómo compruebo si una URL es vulnerable a SSRF?

Ejecuta el hook network. Evalúa el destino de una petición y devuelve safe, private-target, parser-divergent o invalid url. Solo safe equivale a permitir.

### ¿Qué es una URL parser-divergent?

Una URL que distintos parsers leen de forma diferente, una forma clásica de eludir la protección contra SSRF. El hook network la señala en lugar de permitirla.
