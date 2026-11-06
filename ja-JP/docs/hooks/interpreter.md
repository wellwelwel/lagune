# interpreter フック：動的コード実行のシンクを指摘する

> コマンドラインから、さまざまな言語の動的コード実行のシンクをコードベース全体でスキャンしたり、1 つのコードスニペットを判定したりできます。

正規 URL: https://lagune.ai/ja-JP/docs/hooks/interpreter
言語: ja-JP
原文: https://lagune.ai/docs/hooks/interpreter
最終更新日: 2026-11-04

`interpreter` フックは、**動的コード実行のシンク**を指摘します。データを実行可能なコードに変えたり、シェルに渡したりする構文のことで、`eval` からネイティブのデシリアライズまでが含まれます。言語を識別して動作し、各ファイルをその言語のルールで読み取ります。また、[`interpreter` 専門知識](https://lagune.ai/ja-JP/docs/catalog) を支える決定論的なエンジンでもあり、**scan** モードまたは **check** モードで自分で実行することもできます。

## 実行方法

**コードベースをスキャン**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**コードスニペットをチェック**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

こうしたシンクは正当な用途にも悪用にも使えるもので、攻撃者の影響を受けた入力がそこに届くかどうかは、静的スキャンでは判定できません。そのため、一致したものはすべて**確認すべき注意点**であり、確定した検出事項ではありません。スキャンは、ファイルごとにまとめた **Dynamic-execution sinks to review** セクションを 1 つだけ出力します。何も見つからなければ `no dynamic-execution sinks found` と出力します。

**指摘されたコードは読むだけにして、決して実行しない！**

各シンクは**静的に**検討し、信頼できない入力が届くかどうかをたどってください。動作を"試す"ために、指摘されたコードや、そのコードが取り込むリモートのコード、実行時に取得されるコードを実行したり `eval` したりしてはいけません。

## 判定の読み方

| 判定      | 意味                                                                                         |
| --------- | -------------------------------------------------------------------------------------------- |
| `careful` | コードスニペットに、その言語の動的実行のシンクが含まれている。実行せず、読んで確認すること。 |
| `safe`    | 指定した言語の動的実行のシンクは見つからなかった。                                           |

### CLI オプション

| オプション  | 値               | 説明                                                                                                             |
| ----------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--pattern` | コードスニペット | 1 つのコードスニペットをチェックする。繰り返し指定すると複数をチェックし、1 行に 1 つずつ判定を出力する。        |
| `--lang`    | 言語             | `--pattern` を使うときは必須：javascript、python、php、ruby、java、kotlin、go、rust、c、cpp、csharp のいずれか。 |
| `--dir`     | ディレクトリ     | スキャン対象をディレクトリに絞る。繰り返し指定でき、`--file` と併用できる。                                      |
| `--file`    | ファイル         | スキャン対象を 1 つのファイルに絞る。繰り返し指定でき、`--dir` と併用できる。                                    |

オプションを指定しなければ、プロジェクト全体をスキャンします。`--pattern` には `--lang` が必要で、`--dir` や `--file` とは併用できません。

### スキャン対象を選ぶ

**Git** が無視するものはスキャンしません。さらに除外したいときや、**Git** が無視するものもスキャンしたいときは、`interpreter` フック専用の設定を指定します：

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

すべての設定項目は [フックの設定](https://lagune.ai/ja-JP/docs/hooks/configure) で説明しています。

### 対応言語

スキャンはファイル拡張子をもとに次の言語を読み取り、それぞれの言語に固有の動的実行のシンクと照らし合わせてチェックします。

| #   | 言語                        | 拡張子                                                                                                       | 指摘するシンク                                                                                                                                                                                                       |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`、`.jsx`、`.mjs`、`.cjs`、`.ts`、`.tsx`、`.mts`、`.cts`、`.astro`、`.vue`、`.svelte`、`.marko`、`.riot` | `eval()`、Function コンストラクター、文字列を本体とする `setTimeout`/`setInterval`、`vm` モジュール、`child_process` の exec、動的な `require()`、動的な `import()`                                                  |
| 2   | **Python**                  | `.py`、`.pyi`                                                                                                | `eval`/`exec`、`__import__()`、`os.system`/`os.popen`、`subprocess` の `shell=True`、`pickle.load`/`loads`、`yaml.load`（安全でない使い方）                                                                          |
| 3   | **Ruby**                    | `.rb`                                                                                                        | eval 系（`instance_eval`/`class_eval`/`module_eval`/`eval`）、`system`/`exec`、バッククォートまたは `%x`、`Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`、`Process.spawn`、`Marshal.load`                     |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`、`plugin.Open`                                                                                                                                                                  |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`、文字列を渡した `assert()`、`create_function()`、シェル実行（`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`）、`call_user_func`/`call_user_func_array`、実行時のパスを使う `include`/`require` |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`、`process::Command`                                                                                                                                                                                   |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`、`ProcessBuilder`、`ScriptEngine`、`ObjectInputStream.readObject`                                                                                                                                     |
| 8   | **Kotlin**                  | `.kt`、`.kts`                                                                                                | JVM のシンク：`Runtime.exec`、`ProcessBuilder`、`ScriptEngine`、`ObjectInputStream.readObject`                                                                                                                       |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`、`BinaryFormatter`、`Assembly.Load`                                                                                                                                                  |
| 10  | **C**                       | `.c`、`.h`                                                                                                   | `system()`、`popen()`、`exec*` 系（`execl`、`execve`、`execvp`、…）                                                                                                                                                  |
| 11  | **C++**                     | `.cc`、`.cpp`、`.cxx`、`.hpp`、`.hh`、`.hxx`                                                                 | `system()`、`popen()`、`exec*` 系（`execl`、`execve`、`execvp`、…）                                                                                                                                                  |

**ベストエフォートであり、網羅的ではない**

ソースコードをテキストとして読み取るため、実行時に組み立てられたシンクや、エイリアスの陰に隠れたもの、認識できない書き方のものは見逃すことがあります。この表は完全な一覧ではなく、確かな出発点として扱ってください。

**ヒント**

フックが保証するのは最低ライン（こうしたシンクが存在すること、そしてその場所）で、信頼できない値が実際にシンクに届くかどうかの判断は、[`interpreter` 専門知識](https://lagune.ai/ja-JP/docs/catalog) が担います。

## よくある質問

### interpreter フックで脆弱性を確定できますか？

いいえ。動的実行のシンクは確認すべき注意点として指摘するだけで、確定した検出事項にはしません。攻撃者の影響を受けた入力がシンクに届くかどうかは、静的スキャンでは判定できないからです。

### interpreter フックはどの言語に対応していますか？

対応言語の表にある言語を、ファイル拡張子をもとに読み取り、それぞれの言語に固有のシンクと照らし合わせてチェックします。それ以外の言語からシンクが報告されることはありません。
