# Categorias

> As categorias de especializações que um projeto Lagune pode usar, do OWASP ao hardening por linguagem para JavaScript, Python, Go e Rust, e como alterá-las.

Canônica: https://lagune.ai/pt-BR/docs/categories
Idioma: pt-BR
Original: https://lagune.ai/docs/categories
Última atualização: 2026-11-03

O **Lagune** agrupa as suas [**especializações**](https://lagune.ai/pt-BR/docs/catalog) nativas em **13 categorias**. As categorias que um projeto usa decidem quais especializações nativas entram no [**catálogo**](https://lagune.ai/pt-BR/docs/catalog) dele, e elas se dividem em dois grupos: o que o sistema faz e em que ele é escrito.

Enquanto nenhuma categoria está registrada, o projeto usa apenas `owasp`. O [`/lagune-charter`](https://lagune.ai/pt-BR/docs/commands/charter) registra cada categoria que a leitura dele sobre o projeto justifica, e você mesmo pode alterá-las a qualquer momento.

## O que o sistema faz

| Categoria      | Chave     | O que ela protege                                                                                                                            |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| OWASP          | `owasp`   | Os riscos de segurança de aplicações que a OWASP acompanha: injection, controle de acesso quebrado, falhas de autenticação e de criptografia |
| Infraestrutura | `infra`   | Configuração de contêineres, workloads e serverless: Dockerfile, Compose, segurança de Pods, IAM e triggers de FaaS                          |
| IA / LLM       | `ai`      | Integrações de IA e LLM, contra prompt injection e conexões inseguras de ferramentas, agentes, retrieval e MCP                               |
| Lovable        | `lovable` | Apps Supabase gerados por IA (Lovable e similares): falhas de RLS, chaves `service_role` vazadas e padrões inseguros                         |

## Em que ele é escrito

| Categoria  | Chave        | O que ela protege                                                                                                 |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE por `eval` e `child_process`, path traversal e prototype pollution, em todos os seus runtimes                 |
| Python     | `python`     | RCE por desserialização de `pickle` e YAML, travessia de strings com `str.format` e class pollution               |
| Rust       | `rust`       | APIs `unsafe` incorretas, mau uso de `transmute`, integer overflow e comportamento indefinido na fronteira de FFI |
| C / C++    | `c-cpp`      | Bugs de format string, buffer overflows e escritas fora dos limites que permitem execução de código               |
| PHP        | `php`        | Bypass de autenticação por type juggling, gadget chains de object injection e padrões de configuração inseguros   |
| Go         | `go`         | Bugs de interface com nil tipado, data races entre goroutines e concorrência insegura em caminhos de segurança    |
| Java       | `java`       | Gadget chains de desserialização com `ObjectInputStream` que culminam em execução remota de código                |
| Ruby       | `ruby`       | Gadget chains de desserialização com `Marshal.load` e YAML que chegam à execução remota de código                 |
| .NET / C#  | `dotnet`     | RCE por desserialização com `BinaryFormatter` e os bypasses de encoder que levam a XSS                            |

**Dica**

O **Lagune** é independente de linguagem: o fluxo inteiro lê o seu projeto, seja qual for a linguagem dele, e essas categorias só acrescentam profundidade nas armadilhas específicas de uma linguagem.

## Adicione e remova quando quiser

Uma categoria é um ponto de partida, não um compromisso. Use o que serve ao projeto agora e altere quando quiser, pela chave, com `write add` e `write remove`. Em um terminal, `--categories` sem valor abre um seletor interativo (espaço para marcar ou desmarcar, enter para confirmar, nenhuma seleção para pular). Fora de um terminal, passe as categorias depois dele.

**Adicionar**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Remover**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

O primeiro `write add` ou `write remove` parte de `owasp`, então remover todas as categorias deixa uma lista vazia, nunca o padrão. Toda alteração vai para `.lagune/configs.json`, para que o time inteiro trabalhe com o mesmo conjunto.

## Veja o que um projeto usa

O `read list --categories` mostra todas as categorias e se o projeto usa cada uma delas:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Veja o [**Catálogo**](https://lagune.ai/pt-BR/docs/catalog) para saber quais especializações cada categoria traz. As suas próprias especializações, escritas com o [`/lagune-specialize`](https://lagune.ai/pt-BR/docs/commands/specialize), entram no catálogo independentemente das categorias.

## Perguntas frequentes

### Como adicionar uma categoria?

Passe a chave da categoria para --categories, por exemplo npx lagune write add --categories javascript. Enquanto nenhuma está registrada, o charter também registra as categorias que a leitura dele sobre o projeto justifica.

### Posso usar mais de uma categoria?

Sim. Liste todas na mesma linha, uma depois da outra.

### Qual categoria um projeto deve usar?

Comece com owasp, o padrão, e depois adicione a da sua linguagem ou stack. As especializações carregam apenas sob demanda, então uma categoria não custa nada até que uma fase precise de uma das especializações dela.
