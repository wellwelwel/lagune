# Hook interpreter: sinalize pontos de execução dinâmica de código

> Varra um código em busca de pontos de execução dinâmica de código em várias linguagens, ou avalie um único trecho, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/interpreter
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/interpreter
Última atualização: 2026-11-05

O hook `interpreter` sinaliza **pontos de execução dinâmica de código** (sinks): construções que transformam dados em código em execução ou os entregam a um shell, de `eval` à desserialização nativa. Ele reconhece a linguagem e lê cada arquivo pelas regras dela, e é o engine determinístico por trás da [especialização `interpreter`](https://lagune.ai/pt-BR/docs/catalog), que você mesmo pode executar no modo **scan** ou **check**.

## Como executar

**Varrer o código**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Verificar um trecho**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Esses sinks têm uso duplo: uma varredura estática não consegue decidir se uma entrada influenciada por um atacante chega até eles, então cada ocorrência é um **alerta para revisar**, nunca um achado confirmado. A varredura imprime uma única seção, **Dynamic-execution sinks to review**, agrupada por arquivo. Uma execução sem achados imprime `no dynamic-execution sinks found`.

**Leia o código sinalizado, nunca o execute!**

Analise cada sink de forma **estática**, rastreando se uma entrada não confiável chega até ele. Nunca execute nem passe por `eval` o código sinalizado, nem qualquer código remoto ou baixado em tempo de execução que ele traga, para "testar" o que ele faz.

## Como ler o veredito

| Veredito  | Significado                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------ |
| `careful` | O trecho contém um ponto de execução dinâmica para a linguagem dele. Revise-o lendo, nunca executando. |
| `safe`    | Nenhum ponto de execução dinâmica foi encontrado para a linguagem informada.                           |

### Opções da CLI

| Opção       | Valor               | Descrição                                                                                             |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `--pattern` | um trecho de código | Verifica um trecho. Repita para verificar vários, com um veredito por linha.                          |
| `--lang`    | uma linguagem       | Obrigatória com `--pattern`: javascript, python, php, ruby, java, kotlin, go, rust, c, cpp ou csharp. |
| `--dir`     | um diretório        | Limita a varredura a um diretório. Pode ser repetida e combinada com `--file`.                        |
| `--file`    | um arquivo          | Limita a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`.                     |

Sem nenhuma opção, ele varre o projeto inteiro. `--pattern` exige `--lang` e não pode ser combinado com `--dir` nem com `--file`.

### Escolha o que ele varre

Ele deixa de fora o que o **Git** ignora. Para deixar mais coisas de fora, ou para varrer o que o **Git** ignora, dê ao `interpreter` configurações próprias:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Todas as configurações estão em [Configure os hooks](https://lagune.ai/pt-BR/docs/hooks/configure).

### Linguagens suportadas

A varredura lê estas linguagens, identificadas pela extensão do arquivo, e confere cada uma com o próprio conjunto de pontos de execução dinâmica.

| #   | Linguagem                   | Extensões                                                                                                    | Sinks que ela sinaliza                                                                                                                                                                                                                        |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, construtor Function, `setTimeout`/`setInterval` com corpo em string, módulo `vm`, exec de `child_process`, `require()` dinâmico, `import()` dinâmico                                                                                |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` com `shell=True`, `pickle.load`/`loads`, `yaml.load` (inseguro)                                                                                                           |
| 3   | **Ruby**                    | `.rb`                                                                                                        | família eval (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, crases ou `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                                     |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                                           |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, `assert()` com string, `create_function()`, execução de shell (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, `include`/`require` com caminho definido em tempo de execução |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                                            |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                              |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | Os sinks da JVM: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                             |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                                           |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, a família `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, a família `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |

**Melhor esforço, não exaustivo**

Ele lê o código-fonte como texto, então um sink montado em tempo de execução, escondido atrás de um alias ou escrito de uma forma que ele não reconhece pode passar despercebido. Trate a tabela como um ponto de partida sólido, não como um inventário completo.

**Dica**

O hook garante o mínimo (que esses sinks existem e onde estão): saber se um valor não confiável realmente chega a um deles é o julgamento que a [especialização `interpreter`](https://lagune.ai/pt-BR/docs/catalog) cobre.

## Perguntas frequentes

### O hook interpreter confirma uma vulnerabilidade?

Não. Ele sinaliza pontos de execução dinâmica como um alerta para revisar, nunca como um achado confirmado, porque uma varredura estática não consegue decidir se uma entrada influenciada por um atacante chega até eles.

### Quais linguagens o hook interpreter cobre?

Ele lê as linguagens da tabela de linguagens suportadas, identificadas pela extensão do arquivo, e confere cada uma com o próprio conjunto de sinks. Outras linguagens não geram sinks.
