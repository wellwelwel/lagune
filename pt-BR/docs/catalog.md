# Catálogo: especializações de segurança sob demanda

> Esta página está desatualizada em relação à versão em inglês. [Ler a versão original](https://lagune.ai/docs/catalog).

> Como as especializações do catálogo do seu projeto são carregadas, sob demanda por uma fase ou diretamente por você.

Canônica: https://lagune.ai/pt-BR/docs/catalog
Idioma: pt-BR
Original: https://lagune.ai/docs/catalog
Última atualização: 2026-11-03

🧠 As especializações do **Lagune** são módulos de conhecimento de segurança focados e independentes de linguagem, que carregam apenas sob demanda, nunca por padrão. Elas não são comandos. O catálogo do seu projeto é o conjunto que ele usa: as especializações nativas das suas [categorias](https://lagune.ai/pt-BR/docs/categories), mais as próprias. As fases detect e verify recorrem a elas enquanto rodam, e você pode carregar uma diretamente a qualquer momento.

**Visão geral**

*A visão geral interativa do catálogo está na página web. Todas as especializações nativas estão na tabela abaixo.*

**Como funciona**

## Use você mesmo

Para usar uma especialização diretamente, peça ao seu agente para carregá-la com `read catalog <name>` e escreva a tarefa no mesmo prompt. O conhecimento então atua sobre o que você pediu. Isso funciona em qualquer prompt, mesmo em um que não tenha relação com o fluxo do **Lagune**.

Por exemplo, um prompt direto e livre para gerar uma coleção segura de **RegExp** em **Python**:

```prompt
Carregue a especialização regex com `npx lagune read catalog regex` e depois crie uma coleção de expressões regulares em @src/utils/regex.py para validar e-mails e nomes de usuário.
```

Isso usa um hook determinístico para testar cada **RegExp** contra **ReDoS**, mantém as seguras e produz algo como:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Experimente o verificador de ReDoS**

Teste um padrão você mesmo em [**devina.io/redos-checker**](https://devina.io/redos-checker).

## As especializações nativas

As especializações nativas são agrupadas em [**categorias**](https://lagune.ai/pt-BR/docs/categories). Este é o conjunto que vem com o **Lagune**:

| Especialização        | Categoria                   | Foco                                                                                                 |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** padrões que explodem com uma entrada manipulada.                                          |
| `network`             | `owasp`                     | **SSRF e redirecionamentos:** destinos de requisição ou de redirecionamento fornecidos pelo usuário. |
| `interpreter`         | `owasp`, `lovable`          | **Injeção de código:** `eval`, include dinâmico, despacho por nome.                                  |
| `sql`                 | `owasp`                     | **Bancos de dados relacionais:** injection, chamadas brutas ao ORM, privilégios, alcance do engine.  |
| `path`                | `owasp`                     | **Caminhos no sistema de arquivos:** traversal, byte nulo, streams NTFS, plantio de arquivos.        |
| `upload`              | `owasp`                     | **Upload de arquivos:** tipo e assinatura, conteúdo malicioso, armazenamento, limites.               |
| `access-control`      | `owasp`, `lovable`          | **Autenticação, autorização e sessão:** IDOR, mass assignment, tenants, sessões.                     |
| `credential-endpoint` | `owasp`, `lovable`          | **Adivinhação e bots:** força bruta, spraying, stuffing, throttling.                                 |
| `federation`          | `owasp`                     | **Confiança em tokens:** OAuth e OIDC, SAML, validação de JWT, login por QR code.                    |
| `http-request`        | `owasp`                     | **Origem da requisição:** CSRF, CORS mal configurado, IP de cliente falsificado.                     |
| `transport`           | `owasp`                     | **Segurança do canal:** configuração de TLS, HTTPS e texto puro, HSTS, pinning.                      |
| `crypto`              | `owasp`, `lovable`          | **Criptografia em repouso:** algoritmos fracos ou caseiros, CSPRNG, gestão de chaves.                |
| `secrets`             | `owasp`, `lovable`          | **Credenciais hardcoded:** chaves, tokens e senhas escritos no código-fonte.                         |
| `api-endpoint`        | `owasp`                     | **Superfícies além do REST:** GraphQL, gRPC, autorização em WebSocket, DoS, schema.                  |
| `payment`             | `owasp`, `lovable`          | **Fluxo de checkout:** verificação do gateway no servidor, callbacks assinados, idempotência.        |
| `xml`                 | `owasp`                     | **Parsing de XML:** XXE, entidades externas, expansão billion laughs.                                |
| `csv`                 | `owasp`                     | **Formula injection:** células de planilha que começam com `=`/`+`/`-`/`@`.                          |
| `container`           | `owasp`, `infra`            | **Configuração de contêineres:** root, capabilities, montagem do socket, hardening da imagem.        |
| `infra`               | `infra`                     | **Infraestrutura como código:** Terraform, Dockerfile, GitHub Actions.                               |
| `serverless`          | `owasp`, `infra`, `lovable` | **Funções FaaS:** IAM de menor privilégio, entrada de eventos, contexto, segredos.                   |
| `llm`                 | `ai`, `lovable`             | **Riscos de IA e LLM:** prompt injection, agência, RAG, MCP, saída.                                  |
| `supabase`            | `lovable`                   | **Backend Supabase:** RLS desligado por padrão, políticas mal geradas por IA, modelo de chaves.      |
| `browser`             | `javascript`, `lovable`     | **Riscos no cliente:** XSS, CSP, framing, armazenamento etc.                                         |
| `javascript`          | `javascript`                | **Riscos da linguagem:** RCE, prototype pollution etc.                                               |
| `python`              | `python`                    | **Riscos da linguagem:** RCE por `pickle`, class pollution, `-O` etc.                                |
| `rust`                | `rust`                      | **Solidez do `unsafe`:** UB a partir de chamadores seguros, `transmute`, overflow.                   |
| `java`                | `java`                      | **Desserialização e código móvel:** cadeias de `readObject`, sequestro de objetos.                   |
| `ruby`                | `ruby`                      | **Desserialização e `open`:** revivência por `Marshal` e YAML, a peculiaridade do pipe.              |
| `php`                 | `php`                       | **Type juggling e `unserialize`:** magic hashes, POP chains.                                         |
| `go`                  | `go`                        | **Nil tipado e data races:** `nil != nil`, goroutines com memória compartilhada.                     |
| `c-cpp`               | `c-cpp`                     | **Format strings:** `printf(user_input)`, write-what-where com `%n`.                                 |
| `dotnet`              | `dotnet`                    | **Riscos da plataforma:** RCE por `BinaryFormatter`, `@Html.Raw`, brechas em enums.                  |

A maior parte do conhecimento nativo é destilada da OWASP. Veja as [**Fontes OWASP**](https://lagune.ai/pt-BR/docs/references/owasp-sources) para o mapeamento completo de cada especialização às páginas canônicas de ataque e de Cheat Sheet da OWASP. Alguns módulos específicos de uma stack se baseiam nas orientações do próprio fornecedor: o `supabase`, por exemplo, vem da documentação do Supabase e da CVE-2025-48757.

## As suas próprias especializações

As nativas crescem com a adição de um arquivo de conhecimento e de uma linha no índice, nunca de um novo comando. Você adiciona as suas do mesmo jeito, com o [`/lagune-specialize`](https://lagune.ai/pt-BR/docs/commands/specialize): aponte para um artigo ou um tema e ele destila uma nova especialização no seu projeto, com o arquivo em `.lagune/catalog/` e a entrada dele em `.lagune/configs.json`. As suas sempre estão no catálogo, sejam quais forem as categorias dele, e uma especialização sua se sobrepõe a uma nativa de mesmo nome.

**Internamente, o Lagune carrega as especializações automaticamente, sob demanda**

Quando a fase detect ou verify encontra um contexto que uma especialização cobre, ela mesma carrega essa especialização com `read catalog <name>`. Isso acontece automaticamente, como parte da fase. Você não precisa fazer nada à mão para que funcione.

## Descubra o que está disponível

Para listar o catálogo do seu projeto no terminal, uma especialização por linha, com as tags dela:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Uma especialização `[required]` sempre se aplica, seja qual for o trabalho. Quais nativas entram na lista depende das [**categorias**](https://lagune.ai/pt-BR/docs/categories) do seu projeto.

**As especializações não são carregadas por padrão**

O conhecimento relevante é trazido para o que o projeto realmente é, em vez de todas as verificações rodarem por padrão.

## Perguntas frequentes

### O que é uma especialização do Lagune?

Um módulo de conhecimento de segurança focado e independente de linguagem, que carrega apenas sob demanda, nunca por padrão. Não é um comando como as skills do agente.

### O que é o catálogo de um projeto?

As especializações que o projeto usa: as nativas das categorias dele, mais as próprias. Enquanto nenhuma categoria está registrada, ele usa apenas o OWASP.

### As especializações são carregadas por padrão?

Não. Elas carregam apenas sob demanda, para o que o projeto realmente é.

### Como carregar uma especialização diretamente?

No mesmo prompt da tarefa, peça ao seu agente para executar npx lagune read catalog <name>.
