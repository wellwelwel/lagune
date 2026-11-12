# Auditorias agendadas: execute o Lagune de forma recorrente

> Agende uma auditoria recorrente do Lagune no GitHub Actions com a sua própria chave, ou no Claude Code, Codex, Cursor, Antigravity ou OpenCode, que relata novos riscos ou executa o fluxo Blue Team completo.

Canônica: https://lagune.ai/pt-BR/docs/examples/scheduled-audits
Idioma: pt-BR
Original: https://lagune.ai/docs/examples/scheduled-audits
Última atualização: 2026-11-09

Agende o **Lagune** para auditar o seu projeto sozinho, relatando o que encontrar ou executando o fluxo Blue Team completo.

## Agendamento

**Universal**

O **GitHub Actions** executa a auditoria na nuvem com o [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). O engine **Copilot CLI** dele chama o provedor de modelo que você escolher com a sua própria chave, então não precisa de assinatura de nenhum agente:

- Instale a extensão com `gh extension install github/gh-aw`.
- Guarde a chave do seu provedor como segredo do repositório com `gh secret set PROVIDER_API_KEY`.
- Salve este workflow como `.github/workflows/lagune-audit.md`, substituindo `<model>` por um dos modelos do seu provedor que suporte chamada de ferramentas, e `<your-prompt>` por um dos [exemplos de prompts](#prompt-examples):

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
    - wellwelwel/lagune@v0.18.2
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

  Depois, abra um pull request com as suas alterações.
  ```

  | Provedor                                                      | `<type>`    | `<url>`                                              |
  | ------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
  | **OpenAI**                                                    | `openai`    | `https://api.openai.com/v1`                          |
  | **Anthropic**                                                 | `anthropic` | `https://api.anthropic.com`                          |
  | Qualquer API compatível com **OpenAI**, como o **OpenRouter** | `openai`    | A URL base dela, como `https://openrouter.ai/api/v1` |

- Execute `gh aw compile` e faça commit do workflow junto com o arquivo `.lock.yml` que ele gerar.

**Na nuvem**, a auditoria roda mesmo com o computador desligado:

- Faça commit do **Lagune** com a [instalação universal](https://lagune.ai/pt-BR/docs/install/universal) em vez do plugin.
- Digite `/schedule` em uma sessão do **Claude Code** e descreva a auditoria, ou crie-a em [claude.ai/code/routines](https://claude.ai/code/routines).

**No seu computador**, a auditoria usa o plugin que você instalou para si:

- Crie uma tarefa local na página **Scheduled tasks** do app desktop.
- Libere o engine de antemão, como mostra a [página de instalação](https://lagune.ai/pt-BR/docs/install/claude-code), já que não haverá ninguém para aprovar as ferramentas dele.
- A tarefa só roda enquanto o app estiver aberto e o computador não estiver em suspensão.

As tarefas agendadas são criadas no app desktop do **ChatGPT**, não no **Codex CLI**, e rodam no seu computador:

- Em um chat do **Codex**, descreva a auditoria, quando ela deve rodar e que cada execução abre um chat novo. Os resultados aparecem em **Scheduled**.
- No prompt, chame cada comando com `$`, como `$lagune:lagune-detect`, para que a execução o invoque explicitamente.
- Escolha o seu projeto local em vez de uma nova worktree, que começa sem o engine que você [instalou no projeto](https://lagune.ai/pt-BR/docs/install/codex).
- A tarefa só roda enquanto o app estiver aberto, o computador estiver ligado e o projeto estiver no disco.

As Automations do **Cursor** rodam na nuvem, mesmo com o computador desligado:

- Faça commit do **Lagune** com a [instalação universal](https://lagune.ai/pt-BR/docs/install/universal) em vez do plugin.
- Crie uma automação em [cursor.com/automations](https://cursor.com/automations), ou descreva-a com `/automate` em uma sessão do agente, dando a ela um gatilho agendado.
- Selecione o seu repositório, já que um gatilho agendado começa sem nenhum.

As Automations do **Antigravity** rodam no seu computador, cada uma em uma conversa nova:

- Abra a aba **Automations** no app do **Antigravity** e crie uma automação agendada para o seu projeto, ou peça ao agente que a configure.
- Libere o engine de antemão, como mostra a [página de instalação](https://lagune.ai/pt-BR/docs/install/antigravity-cli), já que não haverá ninguém para aprovar as ferramentas dele.
- Use uma automação em vez do `/schedule`, que só dura enquanto durar a conversa dele.
- A automação só roda enquanto o **Antigravity** estiver em execução.

O **OpenCode** não tem agendador próprio, então a auditoria roda pelo **GitHub Actions**, na nuvem:

- Faça commit do **Lagune** no `opencode.json` do repositório, como mostra a [página de instalação](https://lagune.ai/pt-BR/docs/install/opencode).
- Execute `opencode github install` para conectar o GitHub app do **OpenCode** e guardar a chave do seu provedor de modelo.
- Adicione um workflow que passe o prompt para o **OpenCode** de forma agendada, aqui toda segunda-feira às 09:00 UTC, preenchendo `<KEY>` e `<provider>/<model>` como no workflow que o `opencode github install` criou, e `<your-prompt>` com um dos [exemplos de prompts](#prompt-examples):

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

### Exemplos de prompts \{#prompt-examples}

**💧 Somente relatório**

Mapeia novos riscos, planeja as correções deles e reconfere os controles já aplicados, sem alterar o seu código:

```md
Execute os comandos a seguir, um por um: `/lagune-detect` e `/lagune-plan`. Se o projeto tiver um registro de hardening, execute também o `/lagune-verify`.

Não altere o código do projeto. No fim, resuma os novos achados e qualquer controle aplicado que não se sustente mais.
```

**🌊 Ciclo completo**

Também aplica as correções planejadas e comprova que cada uma se sustenta, então revise as alterações antes que elas cheguem à sua branch principal:

```md
Execute os comandos a seguir, um por um: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` e `/lagune-verify`.

No fim, resuma as correções aplicadas e qualquer achado ainda em aberto.
```
