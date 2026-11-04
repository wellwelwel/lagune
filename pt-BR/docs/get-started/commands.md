# Skills de segurança para agentes de IA

> As skills que o seu agente de IA ganha com o Lagune: audite um projeto existente ou proteja o trabalho novo enquanto desenvolve, tudo regido pelo charter.

Canônica: https://lagune.ai/pt-BR/docs/get-started/commands
Idioma: pt-BR
Original: https://lagune.ai/docs/get-started/commands
Última atualização: 2026-11-04

Depois que o **Lagune** está [instalado](https://lagune.ai/pt-BR/docs), o seu agente de **IA** ganha um conjunto de skills. Há duas formas de usá-las, e as duas são regidas pelo **charter**: proteger o trabalho novo enquanto você o constrói ou rodar a auditoria completa em um projeto.

**⌨️ Construção / desenvolvimento**

Você não precisa terminar o seu trabalho antes de protegê-lo. Use o [**`/lagune`**](https://lagune.ai/pt-BR/docs/commands/lagune) para o trabalho que você está escrevendo **agora**:

| Skill                                         | O que ela faz por você                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/pt-BR/docs/commands/charter) | Define as regras de segurança do seu projeto, a base sobre a qual o `/lagune` constrói       |
| [**/lagune**](https://lagune.ai/pt-BR/docs/commands/lagune)          | Constrói o que você pede e aplica hardening enquanto o código é escrito, guiado pelo charter |

**Use a qualquer momento**

O [**`/lagune`**](https://lagune.ai/pt-BR/docs/commands/lagune) respeita as regras do seu charter sempre que roda. Ele aceita qualquer prompt, constrói o que você pediu e o protege com padrões seguros ao longo do caminho, e não depois.

---

#### Skills especiais

| Skill                                               | O que ela faz                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [**/lagune-specialize**](https://lagune.ai/pt-BR/docs/commands/specialize) | Ensina ao **Lagune** uma nova especialização de segurança a partir de artigos, exploits ou temas |

**🔬 Auditoria: fluxo Blue Team**

O **fluxo Blue Team** completo: entender o que um projeto faz, mapear os riscos dele e eliminá-los. Cada skill se apoia na anterior, então basta seguir a lista de cima para baixo:

| #   | Skill                                         | O que ela faz por você                                                                             |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/pt-BR/docs/commands/charter) | Define as regras de segurança do seu projeto, propostas para você ou moldadas pelo que você disser |
| 2   | [**/lagune-detect**](https://lagune.ai/pt-BR/docs/commands/detect)   | Lê o seu código e mapeia o que o seu sistema faz e onde estão os riscos                            |
| 3   | [**/lagune-plan**](https://lagune.ai/pt-BR/docs/commands/plan)       | Transforma o que o detect encontrou em um plano de defesa, com uma correção para cada achado       |
| 4   | [**/lagune-harden**](https://lagune.ai/pt-BR/docs/commands/harden)   | Aplica ao seu código as correções do plano, com segurança e uma de cada vez                        |
| 5   | [**/lagune-verify**](https://lagune.ai/pt-BR/docs/commands/verify)   | Comprova que cada correção aplicada se sustenta e encerra as que passarem                          |

---

#### Skills especiais

| Skill                                               | O que ela faz                                                                                                   |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/pt-BR/docs/commands/specialize) | Ensina ao **Lagune** uma nova especialização de segurança a partir de artigos, exploits ou temas                |
| [**/lagune-prove**](https://lagune.ai/pt-BR/docs/commands/prove)           | Transforma cada achado detectado em uma prova executável e exclusivamente defensiva para divulgação responsável |

---

#### Skills internas

| Skill                                       | O que ela faz                               |
| ------------------------------------------- | ------------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/pt-BR/docs/commands/repair) | Repara o rastreamento interno do **Lagune** |

**Dica**

Segurança não é custo, é investimento: o que você aplica de antemão, você economiza muitas vezes nos incidentes que nunca acontecem 🙋🏻‍♂️

## Perguntas frequentes

### Quais skills o Lagune adiciona?

O /lagune, para aplicar hardening ao trabalho enquanto você o constrói, e o fluxo de auditoria Blue Team de cinco fases: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden e /lagune-verify. Além do /lagune-specialize e do /lagune-prove.

### O que é o fluxo Blue Team do Lagune?

Uma auditoria em cinco fases: charter (define as regras), detect (mapeia os riscos), plan (dá notas e planeja as correções), harden (aplica as correções) e verify (comprova que elas se sustentam e as encerra).

### Qual é a diferença entre o /lagune e o fluxo de auditoria?

O /lagune protege o trabalho novo enquanto você o escreve, sem nenhum fluxo para seguir. O fluxo de auditoria executa as cinco fases em ordem sobre um projeto existente.
