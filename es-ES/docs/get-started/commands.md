# Skills de seguridad para agentes de IA

> Las skills que tu agente de IA desbloquea con Lagune: audita un proyecto que ya existe o protege el trabajo nuevo mientras desarrollas, todo ello regido por tus principios de seguridad.

URL canónica: https://lagune.ai/es-ES/docs/get-started/commands
Idioma: es-ES
Original: https://lagune.ai/docs/get-started/commands
Última actualización: 2026-11-04

Una vez que [instalas](https://lagune.ai/es-ES/docs) **Lagune**, tu agente de **IA** desbloquea un conjunto de skills. Hay dos formas de usarlas, y ambas se rigen por tus **principios de seguridad**: proteger el trabajo nuevo a medida que lo desarrollas, o ejecutar la auditoría completa sobre un proyecto.

**⌨️ Construcción / Desarrollo**

No hace falta que termines tu trabajo antes de protegerlo. Usa [**`/lagune`**](https://lagune.ai/es-ES/docs/commands/lagune) para lo que estás escribiendo **ahora mismo**:

| Skill                                         | Qué hace por ti                                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/es-ES/docs/commands/charter) | Fija las reglas de seguridad de tu proyecto, la base sobre la que construye `/lagune`           |
| [**/lagune**](https://lagune.ai/es-ES/docs/commands/lagune)          | Crea lo que pides y lo bastiona a medida que se escribe, guiado por tus principios de seguridad |

**Úsalo cuando quieras**

[**`/lagune`**](https://lagune.ai/es-ES/docs/commands/lagune) respeta tus principios de seguridad cada vez que se ejecuta. Acepta cualquier prompt, crea lo que pediste y lo bastiona con valores por defecto seguros sobre la marcha, no después.

---

#### Skills especiales

| Skill                                               | Qué hace                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/es-ES/docs/commands/specialize) | Enseña a **Lagune** una nueva especialización de seguridad a partir de artículos, exploits o temas |

**🔬 Auditoría: flujo Blue Team**

El **flujo Blue Team** completo: leer lo que hace un proyecto, identificar sus riesgos y cerrarlos. Cada fase se apoya en la anterior, así que basta con seguir la lista de arriba abajo:

| #   | Skill                                         | Qué hace por ti                                                                               |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/es-ES/docs/commands/charter) | Fija las reglas de seguridad de tu proyecto, propuestas para ti o adaptadas a lo que le digas |
| 2   | [**/lagune-detect**](https://lagune.ai/es-ES/docs/commands/detect)   | Lee tu código e identifica qué hace tu sistema y dónde están los riesgos                      |
| 3   | [**/lagune-plan**](https://lagune.ai/es-ES/docs/commands/plan)       | Convierte lo que encontró detect en un plan de defensa, con una corrección para cada hallazgo |
| 4   | [**/lagune-harden**](https://lagune.ai/es-ES/docs/commands/harden)   | Aplica a tu código las correcciones del plan, de forma segura y una a una                     |
| 5   | [**/lagune-verify**](https://lagune.ai/es-ES/docs/commands/verify)   | Demuestra que cada corrección aplicada se sostiene y cierra las que superan la prueba         |

---

#### Skills especiales

| Skill                                               | Qué hace                                                                                                              |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/es-ES/docs/commands/specialize) | Enseña a **Lagune** una nueva especialización de seguridad a partir de artículos, exploits o temas                    |
| [**/lagune-prove**](https://lagune.ai/es-ES/docs/commands/prove)           | Convierte cada hallazgo detectado en una prueba ejecutable y exclusivamente defensiva para la divulgación responsable |

---

#### Skills internas

| Skill                                       | Qué hace                                    |
| ------------------------------------------- | ------------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/es-ES/docs/commands/repair) | Repara el seguimiento interno de **Lagune** |

**Consejo**

La seguridad no es un gasto, es una inversión: lo que pones al principio lo ahorras con creces en los incidentes que nunca llegas a tener 🙋🏻‍♂️

## Preguntas frecuentes

### ¿Qué skills añade Lagune?

/lagune, para bastionar el trabajo mientras lo desarrollas, y el flujo de auditoría Blue Team de cinco fases: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden y /lagune-verify. Además, /lagune-specialize y /lagune-prove.

### ¿Qué es el flujo Blue Team de Lagune?

Una auditoría en cinco fases: charter (fija las reglas), detect (identifica los riesgos), plan (puntúa y planifica las correcciones), harden (aplica las correcciones) y verify (demuestra que se sostienen y las cierra).

### ¿Qué diferencia hay entre /lagune y el flujo de auditoría?

/lagune protege el trabajo nuevo mientras lo escribes, sin ningún flujo que seguir. El flujo de auditoría ejecuta las cinco fases en orden sobre un proyecto que ya existe.
