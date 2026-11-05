# /lagune-specialize: entrena una especialización de seguridad con texto plano

> Condensa una fuente o un tema de seguridad que le proporciones en una nueva especialización bajo demanda.

URL canónica: https://lagune.ai/es-ES/docs/commands/specialize
Idioma: es-ES
Original: https://lagune.ai/docs/commands/specialize
Última actualización: 2026-11-05

🎓 Enseña a **Lagune** una nueva especialización a partir de una fuente o un tema que le des.

Lee el material y lo condensa en una especialización acotada y exclusivamente defensiva, con la misma forma que las [integradas](https://lagune.ai/es-ES/docs/catalog), para que las fases detect y verify la carguen después como cualquier otra. Solo audita y explica: nunca escribe entradas de ataque ni exploits, y nunca toca tu código.

**A partir de un artículo**

```prompt
# Un enlace o una referencia: Lagune lo condensa en la defensa
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**A partir de un exploit**

```prompt
# Un ataque como fuente: la especialización sigue siendo la defensa
/lagune-specialize "' OR 1=1 -- inserta SQL en el texto de la consulta"
```

**A partir de un tema**

```prompt
# O simplemente nombra lo que quieres cubrir
/lagune-specialize inyección SQL
```

**Un ataque puede ser la fuente, nunca el resultado**

Darle un ataque está bien cuando el objetivo es defenderse de él: la descripción de un exploit es material de estudio que condensa en la defensa. La especialización que genera siempre audita y explica, y nunca produce un exploit funcional, un payload ni una técnica de evasión.

## Qué escribe

El resultado son dos archivos en tu proyecto, versionados y revisables junto a tu código:

- La especialización, en `.lagune/catalog/<name>.md`, con la misma forma que las [integradas](https://lagune.ai/es-ES/docs/catalog).
- Su entrada en `.lagune/configs.json`, donde tu proyecto indexa sus propias especializaciones para que el catálogo las combine con las integradas.

Después lista el catálogo para confirmar que la nueva entrada está ahí. Tus propias especializaciones siempre están en el catálogo, sean cuales sean sus categorías. Nunca añades un comando ni tocas el paquete: una nueva especialidad es un archivo de conocimiento más una entrada en el índice, escritos en tu propio proyecto.

## Refina, nunca sobrescribe

Especializar un nombre que ya existe, ya sea una integrada como `regex` o una que hayas especializado antes, **concilia** el archivo actual en lugar de sustituirlo. Lee lo que hay, incorpora el nuevo conocimiento, conserva lo que sigue siendo válido y reescribe lo que ha cambiado. No se descarta nada sin revisarlo. Una especialización tuya prevalece sobre una integrada con el mismo nombre, así que puedes afinar una integrada para tu propio proyecto sin perderla.

**Consejo**

- La nueva especialización se carga exactamente igual que una integrada: las fases detect y verify la recogen bajo demanda, o puedes cargarla tú con `npx lagune read catalog <name>` y darle una tarea.
- Cuando el material tiene un origen identificable (un artículo, un autor, un enlace, un estándar), la especialización lo cita. Un tema sin más no lleva fuente.

**Nota**

**Solo se ejecuta cuando lo invocas:** el agente nunca lo inicia por su cuenta.

## Preguntas frecuentes

### ¿Cómo añado una especialización de seguridad personalizada?

Ejecuta /lagune-specialize con una fuente o un tema. Lo condensa en una especialización exclusivamente defensiva, que escribe en .lagune/catalog/<name>.md junto con su entrada en .lagune/configs.json.

### ¿Lagune puede aprender de la descripción de un exploit?

Sí, como fuente, nunca como resultado. Un ataque puede ser la fuente, nunca el producto. Specialize nunca escribe entradas de ataque ni exploits.

### ¿Specialize sobrescribe las especializaciones integradas?

No. Refina, nunca sobrescribe.
