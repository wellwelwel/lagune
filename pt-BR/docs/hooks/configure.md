# Configure os hooks: escolha o que eles varrem

> Escolha o que os hooks que varrem arquivos deixam de fora, para todos eles ou para um só.

Canônica: https://lagune.ai/pt-BR/docs/hooks/configure
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/configure
Última atualização: 2026-11-04

O bloco `checkers` do `.lagune/configs.json` define o que os hooks que varrem arquivos deixam de fora, para todos eles ou para um só.

## Como configurar

Adicione ou remova caminhos e padrões pela linha de comando, colocando cada padrão entre aspas para que o shell o mantenha como foi escrito:

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

Ou defina-os no arquivo:

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### Configurações

| Chave       | Valor                                           | Padrão | Descrição                                                                                                    |
| ----------- | ----------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `gitignore` | `true` ou `false`                               | `true` | Deixa de fora o que o **Git** ignora. Um arquivo que o **Git** rastreia é varrido de qualquer forma.         |
| `ignore`    | caminhos ou padrões a partir da raiz do projeto | `[]`   | Deixa de fora o que cada um deles alcança e tudo o que está dentro, mesmo um arquivo que o **Git** rastreia. |

No nível de cima de `checkers`, uma chave vale para todos os checkers. Sob o nome de um checker, ela vale só para ele e substitui a compartilhada, então, no exemplo, o `secrets` varre o que o **Git** ignora e deixa de fora `test/fixtures` e `temp`. Quando o `write add --ignore` dá a um checker a primeira lista própria dele, essa lista começa como uma cópia da compartilhada.

### Padrões

Um padrão parte da raiz do projeto, então `*.generated.ts` alcança só os arquivos que estão nela e `**/*.generated.ts` os alcança em qualquer profundidade. Os nomes precisam corresponder exatamente, inclusive em maiúsculas e minúsculas.

| Padrão              | Deixa de fora                                     |
| ------------------- | ------------------------------------------------- |
| `dist`              | `dist` na raiz do projeto                         |
| `packages/*/dist`   | `dist` em cada pasta dentro de `packages`         |
| `**/dist`           | todo `dist`, em qualquer profundidade             |
| `**/*.generated.ts` | todo arquivo cujo nome termina em `.generated.ts` |
| `fixture-?`         | `fixture-a`, `fixture-1` e similares              |
| `[ab]-cache`        | `a-cache` e `b-cache`                             |
| `[*]x`              | `*x`, com um `*` literal                          |

## Como ler o resultado

O relatório termina dizendo quantos caminhos a varredura deixou de fora, separados pelo que os ignora:

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

Um caminho indicado com `--dir` ou `--file` é varrido independentemente do que dizem as configurações. Uma configuração que o engine não consegue ler interrompe o checker com um erro que a identifica, como um padrão que começa com `!` ou com um espaço, sai do projeto, deixa um colchete aberto ou demora demais para ser comparado.

## Perguntas frequentes

### O Lagune define essas configurações por mim?

Não. O charter lista as pastas versionadas que, pela leitura dele, não são código seu a defender, como fixtures de teste escritas para parecer vulneráveis, e registra só as que você escolher pelo número.

### Quando um checker deve varrer o que o Git ignora?

Quando você não tem motivo para confiar no repositório, já que os próprios arquivos .gitignore dele poderiam esconder código, ou quando uma pasta de build pode carregar uma chave embutida durante o build. Defina gitignore como false para todos os checkers ou para um só.
