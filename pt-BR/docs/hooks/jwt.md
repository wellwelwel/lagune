# Hook jwt: detecte verificação de JWT sem algoritmo fixado

> Varra um código em busca de verificações de JWT sem algoritmo fixado, ou avalie uma única chamada, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/jwt
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/jwt
Última atualização: 2026-11-04

O hook `jwt` sinaliza **verificações de JWT sem algoritmo fixado**, a brecha de algorithm confusion em que o verificador confia no próprio cabeçalho `alg` do token, e **verificações desativadas por completo**. Ele **reconhece a linguagem** e lê cada arquivo pela biblioteca de JWT dela, e é o engine determinístico por trás da [especialização `federation`](https://lagune.ai/pt-BR/docs/catalog), que você mesmo pode executar no modo **scan** ou **check**.

## Como executar

**Varrer o código**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Verificar uma chamada**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

Cada linha em **Unpinned JWT verification found** é uma chamada de verificação que não define uma allowlist de `algorithms` (quando a biblioteca precisa de uma), aceita uma insegura (`none`, ou um algoritmo assimétrico misturado com HMAC) ou desativa de vez a checagem da assinatura, e por isso confia no próprio `alg` do token. É uma exposição confirmada, então o hook termina com código de saída diferente de zero. Uma execução sem achados imprime `no unpinned JWT verification found`.

## Como ler o veredito

| Veredito   | Significado                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `unpinned` | Uma chamada de verificação sem allowlist de algoritmos (quando é necessária), com uma allowlist insegura ou com a verificação desativada. |
| `safe`     | Uma chamada de verificação que fixa uma allowlist de algoritmos sólida, ou cuja biblioteca a fixa implicitamente.                         |
| `invalid`  | O trecho não contém nenhuma chamada de verificação reconhecível para julgar.                                                              |

### Opções da CLI

| Opção       | Valor               | Descrição                                                                                     |
| ----------- | ------------------- | --------------------------------------------------------------------------------------------- |
| `--pattern` | um trecho de código | Verifica uma chamada. Repita para verificar várias, com um veredito por linha.                |
| `--lang`    | uma linguagem       | Obrigatória com `--pattern`: javascript, python, go, java, kotlin, php, ruby, rust ou csharp. |
| `--dir`     | um diretório        | Limita a varredura a um diretório. Pode ser repetida e combinada com `--file`.                |
| `--file`    | um arquivo          | Limita a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`.             |

Sem nenhuma opção, ele varre o projeto inteiro. `--pattern` exige `--lang` e não pode ser combinado com `--dir` nem com `--file`.

### Escolha o que ele varre

Ele deixa de fora o que o **Git** ignora. Para deixar mais coisas de fora, ou para varrer o que o **Git** ignora, dê ao `jwt` configurações próprias:

```bash
npx lagune write add --ignore test/fixtures --checker jwt
```

```json
{
  "checkers": {
    "jwt": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todas as configurações estão em [Configure os hooks](https://lagune.ai/pt-BR/docs/hooks/configure).

### Linguagens suportadas

A varredura lê estas bibliotecas, identificadas pela extensão do arquivo. Como algumas fixam o algoritmo implicitamente (a falta de uma lista explícita é segura), a regra "sem allowlist ⇒ unpinned" só vale onde a biblioteca espera uma lista explícita, então uma chamada configurada corretamente nunca é sinalizada.

| Linguagem                   | Biblioteca              | Sinaliza a falta de allowlist como unpinned?                        | Sempre sinaliza                                 |
| --------------------------- | ----------------------- | ------------------------------------------------------------------- | ----------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Sim                                                                 | `none`, mistura de assimétrico com HMAC         |
| **Python**                  | PyJWT, python-jose      | Sim (o PyJWT exige, o python-jose usa `algorithms=None` por padrão) | `none`, `verify_signature: False`               |
| **Go**                      | golang-jwt              | Sim (sem `WithValidMethods`)                                        | `none`, `ParseUnverified`                       |
| **Ruby**                    | ruby-jwt                | Sim                                                                 | `none`, `verify = false`                        |
| **Java / Kotlin**           | jjwt, nimbus            | Não (derivado da chave)                                             | `none`, um parser sem assinatura ou `unsecured` |
| **PHP**                     | firebase/php-jwt        | Não (a `Key` carrega o alg)                                         | `none`                                          |
| **Rust**                    | jsonwebtoken            | Não (a `Validation` exige um)                                       | `none`, `insecure_disable_signature_validation` |
| **C#**                      | Microsoft.IdentityModel | Não (parâmetros em várias linhas)                                   | `none`, `RequireSignedTokens = false`           |

**Dica**

O hook decide apenas a fixação do algoritmo: as verificações de claims, de chaves e do fluxo são julgamentos que a [especialização `federation`](https://lagune.ai/pt-BR/docs/catalog) continua cobrindo.

## Perguntas frequentes

### O que é algorithm confusion em JWT?

Um verificador que lê o algoritmo do cabeçalho do token permite que um atacante troque RS256 por HS256 e assine com a chave pública. Fixar no código uma allowlist de algoritmos sólida impede isso, e o hook jwt sinaliza uma chamada de verificação que define none ou uma allowlist insegura.
