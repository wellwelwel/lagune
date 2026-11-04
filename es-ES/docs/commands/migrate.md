# Migrate: lleva un proyecto de Lagune basado en manifiesto a las skills y los plugins

> Migra un proyecto de Lagune basado en manifiesto a la versión de Lagune basada en skills, conservando tu charter, tus artefactos, el seguimiento y tus propias especializaciones.

URL canónica: https://lagune.ai/es-ES/docs/commands/migrate
Idioma: es-ES
Original: https://lagune.ai/docs/commands/migrate
Última actualización: 2026-11-04

🔀 Lleva un proyecto de **Lagune** basado en manifiesto a la versión de **Lagune** basada en skills, sin perder nada de lo que has escrito.

**Aviso de obsolescencia**

Un proyecto con manifiesto sigue funcionando tal cual hasta `v1.x`: `npx lagune` delega `init`, `pull`, `update`, `add`, `remove`, `list` y el dashboard en `lagune@0.15.0`, la última versión basada en manifiesto.

## Cómo migrarlo

1. Asegúrate de que tu trabajo actual está en un commit y después ejecuta migrate desde la raíz del proyecto:

   ```bash
   npx lagune migrate
   ```

2. Haz un commit aparte con lo que ha cambiado, para que la migración quede como un único cambio revisable.
3. Instala los comandos para tu agente, como indica la [página de instalación](https://lagune.ai/es-ES/docs).
4. Si el proyecto ya tiene un artefacto de detect, plan o harden, pide a [`/lagune-repair`](https://lagune.ai/es-ES/docs/commands/repair) que concilie las referencias antiguas que hay en ellos y en tus propias especializaciones:

   ```prompt
   /lagune-repair Concilia las especializaciones aplicadas (antes llamadas sub-skills) de los artefactos de `.lagune/memory/` (`detect.md`, `plan.md` y `harden.md`) con los nombres que lista el nuevo catálogo, y reescribe cada llamada que mis propias especializaciones de `.lagune/catalog/` hacen a los hooks antiguos de `.lagune/hooks/` como una llamada a la herramienta `lagune_read` o `lagune_write`.
   ```

## Qué cambia

| Antes                                                                 | Después                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` y `.lagune/specializations.md` | Eliminados: cada skill lleva su plantilla y el motor ejecuta los hooks          |
| Las copias de las especializaciones integradas en `.lagune/skills/`   | Eliminadas: el motor sirve las integradas                                       |
| Tus propias especializaciones en `.lagune/skills/`                    | Movidas a `.lagune/catalog/`                                                    |
| `.lagune/skills.json`, el índice de tus propias especializaciones     | Fusionado en `.lagune/configs.json`                                             |
| Las categorías del manifiesto                                         | Registradas en `.lagune/configs.json`                                           |
| Los comandos antiguos del agente, como `/lagune.detect`               | Eliminados: [instalar **Lagune**](https://lagune.ai/es-ES/docs) trae los nuevos, como `/lagune-detect` |
| El bloque de **Lagune** en `.gitignore`                               | Eliminado, junto con el archivo cuando no contenía nada más                     |
| `.lagune/proofs/`, que ignoraba ese bloque                            | Queda fuera de los commits gracias a su propio `.gitignore`                     |
| `.lagune/manifest.json`                                               | Eliminado, en último lugar                                                      |

Tu trabajo de seguridad se queda como está: el charter, el artefacto que generó cada fase y el mapa de seguimiento con las rutas a las que apunta cada hallazgo.

## Preguntas frecuentes

### ¿Tengo que migrar?

Sí. Los proyectos basados en manifiesto están obsoletos y solo siguen funcionando hasta v1.x, así que ejecuta npx lagune migrate para migrar el tuyo.

### ¿Qué conserva migrate?

Tu charter, todos los artefactos de las fases, el mapa de seguimiento, tus categorías y tus propias especializaciones. Las especializaciones pasan a .lagune/catalog/, y su índice se une a tus categorías en .lagune/configs.json.

### ¿Cuándo instalo los comandos nuevos?

Después de migrate, como indica la página de instalación para tu agente. Instalar primero también funciona, porque migrate conserva el nuevo /lagune.

### Un compañero ya ha migrado. ¿Qué ejecuto?

Haz pull de la migración y después ejecuta npx lagune migrate una vez. Elimina lo que la versión de Lagune basada en manifiesto dejó en tu copia local y que el control de versiones nunca llegó a incluir, y mantiene tus pruebas fuera de los commits.
