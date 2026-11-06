# Instalação: hardening de segurança para qualquer agente de IA

> Instale o Lagune em qualquer projeto, como plugin quando o seu agente oferece suporte ou com o skills CLI nos demais, e escolha as especializações de segurança que combinam com ele.

Canônica: https://lagune.ai/pt-BR/docs
Idioma: pt-BR
Original: https://lagune.ai/docs
Última atualização: 2026-11-03

O **Lagune** ajuda seu agente de IA a deixar um projeto mais seguro. Você aponta para o seu código, o agente descobre o que o seu sistema realmente faz e então guia você pelo trabalho de segurança que importa para ele. O **Lagune** é o primeiro projeto da metodologia [Security-Driven Hardening (SDH)](https://lagune.ai/pt-BR/docs/references/paper).

**Apoie o open source**

Curtiu o **Lagune**? [Dê uma ⭐ no **GitHub**](https://github.com/wellwelwel/lagune)

## Escolha o seu agente

- [Claude Code](https://lagune.ai/pt-BR/docs/install/claude-code): A ferramenta de programação agêntica da Anthropic
- [Codex](https://lagune.ai/pt-BR/docs/install/codex): O agente de programação da OpenAI
- [Cursor](https://lagune.ai/pt-BR/docs/install/cursor): O editor de código com IA
- [GitHub Copilot](https://lagune.ai/pt-BR/docs/install/github-copilot-cli): O programador parceiro com IA do GitHub
- [Gemini CLI](https://lagune.ai/pt-BR/docs/install/gemini-cli): O agente de terminal open source do Google
- [Antigravity](https://lagune.ai/pt-BR/docs/install/antigravity-cli): A plataforma de desenvolvimento agêntico do Google
- [OpenCode](https://lagune.ai/pt-BR/docs/install/opencode): O agente de programação open source
- [Devin for Terminal](https://lagune.ai/pt-BR/docs/install/devin-cli): O agente de terminal da Cognition
- [Factory Droid](https://lagune.ai/pt-BR/docs/install/factory-droid): O agente de desenvolvimento de software da Factory
- [Grok Build](https://lagune.ai/pt-BR/docs/install/grok-build): O agente de programação da xAI
- [Qwen Code](https://lagune.ai/pt-BR/docs/install/qwen-code): O agente de programação para terminal do Qwen
- [Kimi Code](https://lagune.ai/pt-BR/docs/install/kimi-code): O agente de programação da Moonshot AI
- [Muse Code](https://lagune.ai/pt-BR/docs/install/muse-code): O agente de programação da Meta
- [Pi](https://lagune.ai/pt-BR/docs/install/pi): Um agente de programação minimalista para o terminal
- [Hermes Agent](https://lagune.ai/pt-BR/docs/install/hermes-agent): O agente open source da Nous Research
- [Universal](https://lagune.ai/pt-BR/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed e mais 66

**Informação**

- Por baixo dos panos, o **Lagune** roda em **Node.js**, mas você usa a linguagem que quiser.
- Para rodar totalmente offline, instale o **Lagune** no seu projeto com `npm i -D lagune@0.18.0`.

## Categorias

O conhecimento de segurança do **Lagune** vem em [**especializações**](https://lagune.ai/pt-BR/docs/catalog), agrupadas em [**categorias**](https://lagune.ai/pt-BR/docs/categories).

- **OWASP** (`owasp`): Protege contra os riscos de segurança de aplicações que a OWASP acompanha: injection, controle de acesso quebrado, falhas de autenticação e de criptografia
- **Infraestrutura** (`infra`): Protege a configuração de contêineres, workloads e serverless: Dockerfile, Compose, segurança de Pods, IAM e triggers de FaaS
- **IA / LLM** (`ai`): Protege integrações de IA e LLM contra prompt injection e conexões inseguras de ferramentas, agentes, retrieval e MCP
- **Lovable** (`lovable`): Protege apps Supabase gerados por IA (Lovable e similares): falhas de RLS, chaves service_role vazadas e padrões inseguros
- **JavaScript** (`javascript`): Protege JavaScript e seus runtimes contra RCE por eval e child_process, path traversal e prototype pollution
- **Python** (`python`): Protege Python contra RCE por desserialização de pickle e YAML, travessia de strings com str.format e class pollution
- **Rust** (`rust`): Protege Rust contra APIs unsafe incorretas, mau uso de transmute, integer overflow e comportamento indefinido na fronteira de FFI
- **Java** (`java`): Protege Java contra gadget chains de desserialização com ObjectInputStream que culminam em execução remota de código
- **Ruby** (`ruby`): Protege Ruby contra gadget chains de desserialização com Marshal.load e YAML que chegam à execução remota de código
- **PHP** (`php`): Protege PHP contra bypass de autenticação por type juggling, gadget chains de object injection e padrões de configuração inseguros
- **Go** (`go`): Protege Go contra bugs de interface com nil tipado, data races entre goroutines e concorrência insegura em caminhos de segurança
- **C / C++** (`c-cpp`): Protege C e C++ contra bugs de format string, buffer overflows e escritas fora dos limites que permitem execução de código
- **.NET** (`dotnet`): Protege .NET e C# contra RCE por desserialização com BinaryFormatter e contra os bypasses de encoder que levam a XSS

Execute `npx lagune write add --categories` com as chaves das categorias que você escolher.

**Dica**

Todo projeto começa com `owasp`, e o [`/lagune-charter`](https://lagune.ai/pt-BR/docs/commands/charter) adiciona as categorias que a leitura dele sobre o projeto justifica.

## Requisitos

Você precisa ter o [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) instalado no seu sistema.

## Use um badge ✨

Usa o **Lagune**? Adicione um ao seu **README**:

**Dois tons**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Sólido**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Próximo passo

Veja o que cada uma das [**Skills**](https://lagune.ai/pt-BR/docs/get-started/commands) do **Lagune** faz.

## Perguntas frequentes

### O que é o Lagune?

O Lagune é um fluxo de segurança open source, exclusivamente defensivo, que ajuda seu agente de IA a fortalecer a segurança de qualquer código. Você aponta para o seu código, ele detecta o que o seu sistema realmente faz e então orienta as correções de segurança que importam para esse contexto.

### Como instalar o Lagune?

Escolha o seu agente: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI e Hermes Agent instalam o Lagune como plugin, Gemini CLI e Qwen Code como extensão, o Pi como pacote e qualquer outro agente com npx skills add wellwelwel/lagune. Funciona tanto em projetos novos quanto em existentes.

### O Lagune precisa de chave de API?

Não. Ele roda pelo seu próprio agente de IA, então nenhuma chave de API é necessária.

### Quais são os requisitos?

Você precisa ter o Node.js (LTS) instalado no seu sistema.

### Quais linguagens de programação o Lagune suporta?

Qualquer uma. Por baixo dos panos, o Lagune roda em Node.js, mas audita e fortalece a segurança de projetos escritos em qualquer linguagem de programação.

### O que o Lagune adiciona ao meu projeto?

Um diretório .lagune/ com o estado de segurança do seu projeto, criado pelo primeiro comando que grava algo. O skills CLI também instala os slash commands no projeto, onde o seu agente os lê, enquanto um plugin os mantém dentro do agente.

### Como atualizar o Lagune?

Do mesmo jeito que você instalou. A página de instalação de cada agente mostra como atualizar o Lagune nele, e o skills CLI o atualiza com npx skills update. Seu charter, os artefatos das fases e as suas próprias especializações continuam intactos.

### Quais especializações um projeto usa?

As nativas das categorias dele, mais as suas próprias. O charter registra as categorias que a leitura dele sobre o projeto justifica, e npx lagune write add --categories as altera.

### Preciso terminar de desenvolver antes de proteger o meu projeto?

Não. O comando /lagune aplica hardening ao trabalho enquanto ele é escrito: aceita qualquer prompt, constrói o que você pediu e o protege com padrões seguros, guiado pelo charter. O fluxo Blue Team de cinco fases audita o que já existe.

### O Lagune consegue auditar um projeto que já existe?

Sim. O fluxo Blue Team de cinco fases audita o que já existe: o charter define suas regras de segurança, o detect mapeia o que o sistema faz e onde estão os riscos, o plan dá uma nota a cada achado e associa uma correção a ele, o harden aplica as correções e o verify comprova que elas se sustentam e as encerra.

### Qual é a diferença entre usar o Lagune e simplesmente pedir ao agente para mapear vulnerabilidades e falhas de segurança?

Um agente lendo por conta própria encontra o que parece uma vulnerabilidade e ignora o que parece um controle. Uma lista de endereços bloqueados dá a impressão de que alguém já tratou o risco, então ninguém confere que ela deixa a maioria deles de fora, e o código vai para produção. O Lagune inverte esse padrão: uma proteção que já está no código é considerada não comprovada até ser verificada, cada especialização do catálogo recebe um veredito explícito, e o verify pergunta se o risco acabou, não se existe um controle. Cada achado também continua sendo um único item rastreado entre as execuções, então pode ser comprovado como resolvido e encerrado, enquanto um pedido simples entrega um relatório diferente a cada vez, sem nada para comparar.

### Qual é a diferença entre desenvolver com o Lagune e simplesmente pedir ao agente para escrever código seguro?

Pedir código seguro deixa a definição de seguro por conta do agente e pressupõe que você sabe o que pedir. O requisito geralmente já está dentro do seu pedido sem que nenhum de vocês perceba: pedir uma página que mostra os cursos a que um usuário tem acesso estabelece uma regra de autorização, e uma verificação que nunca é escrita não deixa nada no código para ser notado. O comando /lagune carrega o seu charter e as especializações que combinam com o que está prestes a ser construído antes de a primeira linha ser escrita, e depois relê o resultado à luz da defesa que usou. A forma segura raramente custa mais do que a insegura, então o que decide o resultado é saber qual escolher, e é isso que chega de antemão.

### O Lagune faz DAST (Dynamic Application Security Testing) ou testa a minha aplicação em execução?

Não. O Lagune lê código e nunca executa o seu sistema nem envia requisições manipuladas a ele. O verify confirma que um controle está presente e correto no código-fonte, o que é uma pergunta diferente de saber se ele resiste a um ataque contra um alvo em produção, então "não dá para saber pelo código" é um veredito legítimo, e não uma aprovação silenciosa. O DAST responde à pergunta sobre a execução e o Lagune responde à pergunta sobre o código-fonte, então um não substitui o outro. Até o comando opcional prove respeita esse limite: os testes dele verificam o comportamento seguro, nunca um payload de ataque.

### O Lagune substitui um pentest (teste de intrusão)?

Não, de jeito nenhum! Um pentest é um trabalho autorizado em que um profissional usa o próprio julgamento contra o seu sistema em produção, encadeando achados e sondando a lógica de negócio que nenhuma regra por superfície descreve. Os achados de um pentest podem entrar no fluxo Blue Team do Lagune, para que o detect registre essas questões e o que um profissional relata seja planejado, fortalecido e verificado.

## Política de segurança

Consulte o [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Licença

O **Lagune** é distribuído sob a [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-presente [Weslley Araújo](https://github.com/wellwelwel) e [colaboradores](https://github.com/wellwelwel/lagune/graphs/contributors).
