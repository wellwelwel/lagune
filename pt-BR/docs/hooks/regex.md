# Hook regex: detecte padrões vulneráveis a ReDoS

> Varra um código em busca de regex vulneráveis a ReDoS, ou avalie um único padrão, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/regex
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/regex
Última atualização: 2026-11-04

O hook `regex` é o engine determinístico de segurança de regex que a [especialização `regex`](https://lagune.ai/pt-BR/docs/catalog) executa, e você mesmo pode executá-lo. Ele funciona em dois modos a partir de um único comando: um **scan**, que varre um código em busca de padrões vulneráveis a **ReDoS** e de padrões montados em tempo de execução, e um **check**, que avalia um único padrão que você passar.

## Varrer um código

Sem nenhuma flag, ele varre o projeto inteiro. `--dir` limita a varredura a um diretório, e `--file`, a um único arquivo. As duas podem ser repetidas e se combinam em um único relatório, com cada arquivo listado uma vez, mesmo quando mais de um alvo o cobre.

**Projeto inteiro**

```bash
npx lagune read regex
```

**Um diretório**

```bash
npx lagune read regex --dir src/services
```

**Um único arquivo**

```bash
npx lagune read regex --file bin/import.pl
```

**Vários alvos**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**Com um limite**

`--limit` define o limite de ReDoS da varredura (o padrão é 25), o mesmo limite que o modo check aceita. Um limite menor é mais rigoroso.

```bash
npx lagune read regex --dir src/services --limit 15
```

A saída é texto puro, e os cabeçalhos dizem como ler cada seção. Uma seção só aparece quando tem achados.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

Quando nada é encontrado, ele imprime uma única linha.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### Como ler as seções

| Seção                                                                                       | Significado                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | Padrões vulneráveis a ReDoS, agrupados por arquivo, com cada padrão recuado logo abaixo e seguido, entre parênteses, do motivo de ser inseguro e, quando houver, do escopo e das flags dele. Toda linha é insegura, então o veredito não se repete. |
| `Regular expressions the analysis could not settle (review manually)`                       | Padrões que a análise não conseguiu resolver dentro do limite de trabalho dela, listados da mesma forma.                                                                                                                                            |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | Arquivos que montam uma regex a partir de uma variável, de uma concatenação ou de uma interpolação.                                                                                                                                                 |
| `Static regex wrapped in a constructor (use a literal instead)`                             | Arquivos que passam uma string literal simples a um construtor de regex quando um literal de regex seria mais simples e evitaria uma compilação em tempo de execução.                                                                               |

A primeira seção é um achado de segurança. A segunda e a terceira não são achados por si só: elas sinalizam código que uma verificação estática não consegue resolver, então pedem a leitura de uma pessoa. A quarta é uma dica de clareza, não um achado de segurança.

### Opções da CLI

| Opção       | Valor                       | Descrição                                                                                                        |
| ----------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--pattern` | o código-fonte de uma regex | Verifica um padrão. Repita para verificar vários, com um veredito por padrão, na mesma ordem.                    |
| `--flags`   | flags de regex              | Verifica cada `--pattern` com essas flags, como `im`. Vale apenas para o modo check.                             |
| `--dir`     | um diretório                | Limita a varredura a um diretório. Pode ser repetida e combinada com `--file`.                                   |
| `--file`    | um arquivo                  | Limita a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`.                                |
| `--limit`   | um inteiro não negativo     | Define o limite de repetição de ReDoS (o padrão é 25). Vale para os dois modos. Um limite menor é mais rigoroso. |

Sem nenhuma opção, ele varre o projeto inteiro. `--pattern` é o modo check e não pode ser combinado com `--dir` nem com `--file`.

### Escolha o que ele varre

Ele deixa de fora o que o **Git** ignora. Para deixar mais coisas de fora, ou para varrer o que o **Git** ignora, dê ao `regex` configurações próprias:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todas as configurações estão em [Configure os hooks](https://lagune.ai/pt-BR/docs/hooks/configure).

### Linguagens suportadas

A varredura lê estas linguagens, identificadas pela extensão do arquivo, cada uma pelas próprias regras, para que um padrão de uma nunca seja testado com as regras de outra. Todo o resto é ignorado em vez de ser varrido com as regras erradas.

| #   | Linguagem                   | Extensões                                                                                                    |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Melhor esforço, não exaustivo**

Ele lê o código-fonte como texto, então não consegue julgar um padrão montado em tempo de execução, e um padrão espalhado por várias linhas, escondido atrás de um alias ou escrito de uma forma que ele não reconhece pode passar despercebido. Trate as seções como um ponto de partida sólido, não como um inventário completo, e continue lendo o código para o que elas não alcançam.

## Verificar um único padrão

Passe `--pattern` com o código-fonte do padrão para avaliá-lo. O hook imprime uma palavra: `safe`, `unsafe`, `undetermined` quando a análise atinge o limite de trabalho antes de resolver o padrão, ou `invalid regex`. Repita `--pattern` para avaliar vários de uma vez, com um veredito por padrão, na mesma ordem.

**Um padrão**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Vários padrões**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**Com flags**

`--flags` verifica cada `--pattern` da chamada com as flags com que ele roda, já que uma flag muda os caracteres que um padrão reconhece.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**Com um limite**

`--limit` define o limite de repetição (o padrão é 25) e vale para cada `--pattern` da chamada. Um limite menor é mais rigoroso.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Por que um argumento entre aspas**

Cada padrão é passado como valor de uma flag, nunca interpolado no comando. Um valor com aspas ou crases continua inerte e não consegue injetar nada no shell. Sempre coloque o padrão entre aspas simples para que o seu shell não o expanda antes.

**Dica**

Este é o mesmo engine que a [especialização `regex`](https://lagune.ai/pt-BR/docs/catalog) executa: a varredura abre uma análise de ReDoS, e a verificação confirma um padrão que ela encontrar.

## Perguntas frequentes

### Como verificar se uma regex é vulnerável a ReDoS pela CLI?

Execute npx lagune read regex --pattern '<pattern>'. Ele retorna safe, unsafe, undetermined ou invalid regex.

### Como varrer um projeto inteiro em busca de regex inseguras?

Execute o hook regex no modo scan sobre o código. Ele sinaliza padrões vulneráveis a ReDoS em 25 linguagens suportadas.
