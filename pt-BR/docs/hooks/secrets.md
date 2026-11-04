# Hook secrets: detecte segredos hardcoded

> Varra um código em busca de credenciais hardcoded, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/secrets
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/secrets
Última atualização: 2026-11-04

O hook `secrets` sinaliza **credenciais embutidas no código-fonte** em vez de lidas do ambiente. Ele se baseia na **procedência** (um literal versus uma leitura do ambiente), não no conteúdo do valor, então não precisa de um catálogo exaustivo de prefixos de provedores e quase não gera falsos positivos. É o engine determinístico por trás da [especialização `secrets`](https://lagune.ai/pt-BR/docs/catalog).

As assinaturas de formato de provedores, as credenciais em strings de conexão e um literal atribuído a um identificador com nome de segredo são **independentes de linguagem**: a mesma string é lida do mesmo jeito em qualquer arquivo. As duas heurísticas que dependem de sintaxe, uma leitura do ambiente com um valor padrão hardcoded e um segredo que vai parar em um ponto de log, **reconhecem a linguagem**, então um `console.log` de JavaScript nunca é procurado em um arquivo Rust, e o `os.getenv("X", "default")` do Python é reconhecido por si só.

## Como executar

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

A varredura imprime até duas seções. **Hardcoded secrets found** é o conjunto de achados (um valor padrão hardcoded para uma variável de ambiente com nome de segredo, uma credencial embutida em uma string de conexão ou um valor que corresponde a um formato de provedor catalogado), então o hook termina com código de saída diferente de zero. **Secret handling to review manually** é um conjunto de pistas: um literal simples atribuído a um identificador com nome de segredo (a procedência dele é decidível, mas não se o valor é um segredo real) e um valor com nome de segredo que vai parar em um ponto de log ou de resposta. Uma execução sem achados imprime `no hardcoded secrets found`.

### Opções da CLI

| Opção    | Valor        | Descrição                                                                         |
| -------- | ------------ | --------------------------------------------------------------------------------- |
| `--dir`  | um diretório | Limita a varredura a um diretório. Pode ser repetida e combinada com `--file`.    |
| `--file` | um arquivo   | Limita a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`. |

Sem nenhuma opção, ele varre o projeto inteiro.

### Escolha o que ele varre

Ele deixa de fora o que o **Git** ignora. Para deixar mais coisas de fora, ou para varrer o que o **Git** ignora, dê ao `secrets` configurações próprias:

```bash
npx lagune write add --ignore test/fixtures --checker secrets
```

```json
{
  "checkers": {
    "secrets": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todas as configurações estão em [Configure os hooks](https://lagune.ai/pt-BR/docs/hooks/configure).

### Cobertura de linguagens

O achado de valor padrão do ambiente e a pista de ponto de log leem um conjunto de formas próprio de cada linguagem, então cobrem as linguagens abaixo e ficam em silêncio nas demais. Os outros três sinais rodam em **todos** os arquivos.

| Sinal                       | Linguagens                                                                      |
| --------------------------- | ------------------------------------------------------------------------------- |
| Valor padrão do ambiente    | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Ponto de log ou de resposta | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**Isso é um problema de política?**

Não. Detectar o formato de um segredo para avisar que ele foi commitado é uma prática padrão de ferramentas defensivas, a mesma operação que o gitleaks, o trufflehog e o push protection do GitHub realizam. O hook traz assinaturas de detecção (os **formatos** públicos de tokens), nunca um segredo real, e audita e explica em vez de exfiltrar.

## Perguntas frequentes

### Como o hook secrets evita falsos positivos?

Ele se baseia na procedência, não no conteúdo do valor. Os formatos de alta confiança (tokens de provedores, valores padrão do ambiente, strings de conexão) são achados que terminam com código de saída diferente de zero. Um literal simples atribuído a um identificador com nome de segredo é uma pista para revisar e confirmar, e o mesmo identificador lido de process.env não é sinalizado de forma alguma.
