# Hook cors: audite as origens de CORS

> Varra o código-fonte em busca de uma allowlist de origens CORS contornável, ou avalie se um único valor de origem dá acesso permissivo demais, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/cors
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/cors
Última atualização: 2026-11-05

O hook `cors` é o engine determinístico por trás da [especialização `http-request`](https://lagune.ai/pt-BR/docs/catalog), e você mesmo pode executá-lo. Ele funciona em dois modos a partir de um único comando: um **scan**, que varre o código-fonte em busca de uma **allowlist de origens contornável** (uma regex de validação de host pela qual o host de um atacante passa), e um **score**, que classifica um único valor de **origem CORS** como `wildcard`, `null` ou `safe`.

## Varrer um código

Sem nenhuma flag, ele varre o projeto inteiro.

**Projeto inteiro**

```bash
npx lagune read cors
```

**Um diretório**

```bash
npx lagune read cors --dir src/server
```

**Um único arquivo**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Ele lista cada allowlist contornável sob um único cabeçalho, agrupada por arquivo. Um validador de host cujo `.+`/`.*` fica no segmento de autoridade antes do sufixo do host confiável (`^https?://.+\.trusted\.com`) deixa passar o host de um atacante como `your-site.com.attacker.com`.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Isso é uma pista para revisão, não um achado fechado: pelo texto, não dá para decidir se a regex controla uma decisão de confiança real, então um scan nunca altera o código de saída. Leia cada uma e confirme que a allowlist compara por igualdade completa. Quando nada é encontrado, ele imprime uma única linha.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Avaliar uma origem

Passe cada origem com `--origin`. O hook imprime uma palavra por origem e termina com código diferente de zero diante de qualquer `wildcard` ou `null`.

**Uma origem**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Várias origens**

Repita `--origin` para avaliar uma allowlist inteira em uma única chamada, com um veredito por linha, na ordem.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Veredito   | Significado                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| `safe`     | Não é `*`, `null` nem um glob com `*`. Não garante uma origem bem formada.                              |
| `wildcard` | `*`, ou um glob de subdomínio, host ou porta: qualquer site (ou um conjunto amplo) pode ler a resposta. |
| `null`     | A origem `null`, que iframes em sandbox e redirecionamentos conseguem forjar.                           |

Só `safe` é uma permissão, e `--origin` é um oráculo de valores: ele julga o valor, não o handler, então confirme o handler com a especialização `http-request`.

### Opções da CLI

| Opção      | Valor        | Descrição                                                                            |
| ---------- | ------------ | ------------------------------------------------------------------------------------ |
| `--origin` | uma origem   | Avalia um valor de origem. Repita para avaliar vários, um por linha.                 |
| `--dir`    | um diretório | Restringe a varredura a um diretório. Pode ser repetida e combinada com `--file`.    |
| `--file`   | um arquivo   | Restringe a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`. |

Sem nenhuma opção, ele varre o projeto inteiro. `--origin` é o modo score e não pode ser combinada com `--dir` nem com `--file`.

### Escolha o que ele varre

Ele deixa de fora o que o **Git** ignora. Para deixar mais coisas de fora, ou para varrer o que o **Git** ignora, dê ao `cors` configurações próprias:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todas as configurações estão em [Configure os hooks](https://lagune.ai/pt-BR/docs/hooks/configure).

**O que ele não cobre**

O scan lê o formato de **regex contornável**, e `--origin` avalia **valores** de origem. Dois padrões no nível do código-fonte ficam fora de alcance: o reflexo do `Origin` da requisição (o servidor devolve o `Origin` recebido, ou o combina com credenciais) e uma allowlist permissiva por `endsWith` ou por substring. Reconheça esses padrões no código e trate-os como a [especialização `http-request`](https://lagune.ai/pt-BR/docs/catalog) descreve.

## Perguntas frequentes

### Por que uma origem CORS null é perigosa?

Iframes em sandbox e alguns redirecionamentos enviam Origin: null, então uma allowlist que confia em null dá acesso de leitura a esses contextos. O hook cors a sinaliza junto com o wildcard.

### Como detectar uma allowlist de origens CORS contornável?

Execute npx lagune read cors sobre o código. Ele sinaliza uma regex de validação de host cujo wildcard guloso fica antes do sufixo confiável, de modo que o host de um atacante como your-site.com.attacker.com passa por ela.
