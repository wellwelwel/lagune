# Auditorías programadas: ejecuta Lagune de forma periódica

> Programa una auditoría periódica de Lagune en GitHub Actions con tu propia clave, o en Claude Code, Codex, Cursor, Antigravity u OpenCode, que informe de los nuevos riesgos o ejecute todo el flujo Blue Team.

URL canónica: https://lagune.ai/es-ES/docs/examples/scheduled-audits
Idioma: es-ES
Original: https://lagune.ai/docs/examples/scheduled-audits
Última actualización: 2026-11-09

Programa **Lagune** para que audite tu proyecto por su cuenta, ya sea informando de lo que encuentra o ejecutando todo el flujo Blue Team.

## Programación

**Universal**

**GitHub Actions** ejecuta la auditoría en la nube con [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Su motor **Copilot CLI** llama al proveedor de modelos que elijas con tu propia clave, así que no necesita ninguna suscripción a un agente:

- Instala la extensión con `gh extension install github/gh-aw`.
- Almacena la clave de tu proveedor como secreto del repositorio con `gh secret set PROVIDER_API_KEY`.
- Guarda este flujo de trabajo como `.github/workflows/lagune-audit.md`, sustituyendo `<model>` por uno de los modelos de tu proveedor que admita llamadas a herramientas, y `<your-prompt>` por uno de los [ejemplos de prompts](#prompt-examples):

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.19.0
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  Después, abre un pull request con tus cambios.
  ```

  | Proveedor                                                    | `<type>`    | `<url>`                                          |
  | ------------------------------------------------------------ | ----------- | ------------------------------------------------ |
  | **OpenAI**                                                   | `openai`    | `https://api.openai.com/v1`                      |
  | **Anthropic**                                                | `anthropic` | `https://api.anthropic.com`                      |
  | Cualquier API compatible con **OpenAI**, como **OpenRouter** | `openai`    | Su URL base, como `https://openrouter.ai/api/v1` |

- Ejecuta `gh aw compile` y haz commit del flujo de trabajo junto con el archivo `.lock.yml` que genera.

**En la nube**, la auditoría se ejecuta incluso con el ordenador apagado:

- Haz commit de **Lagune** con la [instalación universal](https://lagune.ai/es-ES/docs/install/universal) en lugar del plugin.
- Escribe `/schedule` en una sesión de **Claude Code** y describe la auditoría, o créala en [claude.ai/code/routines](https://claude.ai/code/routines).

**En tu ordenador**, la auditoría usa el plugin que instalaste para ti:

- Crea una tarea local en la página **Scheduled tasks** de la aplicación de escritorio.
- Permite el motor de antemano, como muestra la [página de instalación](https://lagune.ai/es-ES/docs/install/claude-code), ya que no habrá nadie para aprobar sus herramientas.
- La tarea solo se ejecuta mientras la aplicación esté abierta y el ordenador no esté en suspensión.

Las tareas programadas se crean en la aplicación de escritorio de **ChatGPT**, no en **Codex CLI**, y se ejecutan en tu ordenador:

- En un chat de **Codex**, describe la auditoría, cuándo debe ejecutarse y que cada ejecución abra un chat nuevo. Sus resultados aparecen en **Scheduled**.
- En el prompt, nombra cada comando con `$`, como `$lagune:lagune-detect`, para que la ejecución lo invoque de forma explícita.
- Elige tu proyecto local en lugar de un worktree nuevo, que empieza sin el motor que [instalaste en tu proyecto](https://lagune.ai/es-ES/docs/install/codex).
- La tarea solo se ejecuta mientras la aplicación esté abierta, el ordenador esté encendido y el proyecto esté en el disco.

Las Automations de **Cursor** se ejecutan en la nube, incluso con el ordenador apagado:

- Haz commit de **Lagune** con la [instalación universal](https://lagune.ai/es-ES/docs/install/universal) en lugar del plugin.
- Crea una automatización en [cursor.com/automations](https://cursor.com/automations), o descríbela con `/automate` en una sesión del agente, y asígnale un disparador programado.
- Selecciona tu repositorio, ya que un disparador programado empieza sin ninguno.

Las Automations de **Antigravity** se ejecutan en tu ordenador, cada una en una conversación nueva:

- Abre la pestaña **Automations** en la aplicación de **Antigravity** y crea una automatización programada para tu proyecto, o pide al agente que la configure.
- Permite el motor de antemano, como muestra la [página de instalación](https://lagune.ai/es-ES/docs/install/antigravity-cli), ya que no habrá nadie para aprobar sus herramientas.
- Usa una automatización en lugar de `/schedule`, que solo dura lo que dure su conversación.
- La automatización solo se ejecuta mientras **Antigravity** esté en marcha.

**OpenCode** no tiene un programador propio, así que la auditoría se ejecuta desde **GitHub Actions**, en la nube:

- Haz commit de **Lagune** en el `opencode.json` del repositorio, como muestra la [página de instalación](https://lagune.ai/es-ES/docs/install/opencode).
- Ejecuta `opencode github install` para conectar la GitHub app de **OpenCode** y guardar la clave de tu proveedor de modelos.
- Añade un flujo de trabajo que pase el prompt a **OpenCode** de forma programada, aquí cada lunes a las 09:00 UTC, rellenando `<KEY>` y `<provider>/<model>` como en el flujo de trabajo que creó `opencode github install`, y `<your-prompt>` con uno de los [ejemplos de prompts](#prompt-examples):

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### Ejemplos de prompts \{#prompt-examples}

**💧 Solo informe**

Identifica nuevos riesgos, planifica sus correcciones y vuelve a comprobar los controles ya aplicados, sin modificar tu código:

```md
Ejecuta los siguientes comandos, uno a uno: `/lagune-detect` y `/lagune-plan`. Si el proyecto tiene un registro de bastionado, ejecuta también `/lagune-verify`.

No modifiques el código del proyecto. Al final, resume los nuevos hallazgos y cualquier control aplicado que ya no se sostenga.
```

**🌊 Ciclo completo**

También aplica las correcciones planificadas y demuestra que cada una se sostiene, así que revisa sus cambios antes de que lleguen a tu rama principal:

```md
Ejecuta los siguientes comandos, uno a uno: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` y `/lagune-verify`.

Al final, resume las correcciones aplicadas y cualquier hallazgo que siga abierto.
```
