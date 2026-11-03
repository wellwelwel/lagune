# Hook agent: detecte loops de agente sem limite

> Varra um código em busca de chamadas a agentes e LLMs sem limite de passos ou de tempo, ou avalie uma única chamada, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/agent
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/agent
Última atualização: 2026-11-03

O hook `agent` sinaliza **runtimes de agente que entram em loop sem limite de turnos, de orçamento ou de tempo**, a brecha de autonomia descontrolada que transforma uma entrada manipulada em custo ilimitado ou em escalada de prompt injection. Ele **reconhece a linguagem** e cobre os dois ecossistemas de frameworks de agentes: **JavaScript** (o runtime `query` do SDK de agentes do **Claude**) e **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). Ele é o engine determinístico por trás da [especialização `llm`](https://lagune.ai/pt-BR/docs/catalog), e você mesmo pode executá-lo no modo **scan** ou **check**.

## Como executar

**Varrer o código**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Verificar uma chamada**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Cada linha em **Uncapped agent loops found** é, em um arquivo que importa um SDK de agentes, ou o runtime `query` do SDK de agentes do Claude chamado sem limite de turnos, de orçamento ou de tempo (JavaScript, sem limite por padrão), ou a remoção explícita do limite padrão de um framework, como `max_iterations=None` / `max_turns=None` (Python, com limite por padrão). Qualquer um dos dois termina com código diferente de zero. No Vercel AI SDK, `generateText`/`streamText` usam por padrão um único passo (`stopWhen: stepCountIs(1)`), então uma chamada simples ali não entra em loop e não é sinalizada, e um `db.query(...)` comum nunca é confundido com uma chamada de agente. Uma execução sem achados imprime `no uncapped agent loops found`.

## Como ler o veredito

| Veredito   | Significado                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `uncapped` | Uma chamada ao runtime `query` sem limite (JS), ou a remoção explícita de um limite (`=None`, Py).                       |
| `safe`     | Uma chamada `query` que define um limite, uma geração de passo único ou a chamada de um framework com limite por padrão. |
| `invalid`  | O trecho não contém nenhuma chamada de agente reconhecível para avaliar.                                                 |

### Opções da CLI

| Opção       | Valor               | Descrição                                                                            |
| ----------- | ------------------- | ------------------------------------------------------------------------------------ |
| `--pattern` | um trecho de código | Verifica uma chamada. Repita para verificar várias, com um veredito por linha.       |
| `--lang`    | uma linguagem       | Obrigatória com `--pattern`: `javascript` ou `python`.                               |
| `--dir`     | um diretório        | Restringe a varredura a um diretório. Pode ser repetida e combinada com `--file`.    |
| `--file`    | um arquivo          | Restringe a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`. |

Sem nenhuma opção, ele varre o projeto inteiro. `--pattern` exige `--lang` e não pode ser combinada com `--dir` nem com `--file`.

**Melhor esforço, não exaustivo**

Um loop de agente feito à mão, em qualquer linguagem, está além do alcance de uma varredura estática. Trate isso como uma base sólida, não como um inventário completo.

**Dica**

O hook decide apenas o limite: o escopo de capacidades, a mistura de níveis de confiança e a autorização são questões de julgamento que a [especialização `llm`](https://lagune.ai/pt-BR/docs/catalog) continua cobrindo.

## Perguntas frequentes

### Por que limitar o loop de um agente?

Um agente sem limite pode ser levado a recursão, custo ou escalada de prompt injection sem fim. Definir maxTurns/maxBudgetUsd/stopWhen/signal impõe esse limite, e o hook agent sinaliza uma chamada ao runtime query que não define nenhum deles.
