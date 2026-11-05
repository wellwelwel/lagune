# /lagune-repair: repara el seguimiento roto de los hallazgos

> Repara la cadena cuando un cambio de nombre o un archivo movido confunde el seguimiento de Lagune.

URL canónica: https://lagune.ai/es-ES/docs/commands/repair
Idioma: es-ES
Original: https://lagune.ai/docs/commands/repair
Última actualización: 2026-11-05

🧰 Repara la cadena cuando un cambio de nombre o un archivo movido la confunde.

**Mantenimiento interno, no una fase de seguridad**

Repair no es una sexta fase del flujo lineal. Su trabajo es mantener coherente el seguimiento.

```prompt
# No recibe ninguna entrada: siempre repara toda la cadena
/lagune-repair
```

## Cómo funciona

Cada hallazgo de detect es un elemento en seguimiento que plan, harden y verify van pasándose de una fase a otra, y cada una actúa sobre él y vuelve a informar de él por su nombre. Ese nombre, escrito igual como título de sección en todos los artefactos, es su identidad de principio a fin.

Lo único volátil que guarda el seguimiento son las rutas de los archivos a los que apunta el elemento. Esas rutas no están en ningún otro sitio, así que un cambio de nombre o un archivo movido solo puede romper el vínculo ahí, nunca en dos copias que divergen. Cuando ocurre, repair corrige el mapa (`.lagune/tracking.json`) para que la identidad sobreviva al cambio de nombre. Lee los artefactos y el mapa de seguimiento, lee tu código fuente solo para conocer la nueva ruta de un archivo renombrado, y nunca redacta contenido de seguridad.

En la misma pasada, compara cada artefacto de memoria con su plantilla e informa de lo que se ha desviado, indicando en cada caso la fase que lo corrige.

**Consejo**

- No toca ni tu código ni el texto de los artefactos, solo el seguimiento.
- Rara vez lo ejecutarás a mano. Cuando una fase detecta que la cadena es incoherente, ejecuta repair por ti y continúa.
- El seguimiento que mantiene está en `.lagune/tracking.json`, un estado interno que nunca editas a mano.
