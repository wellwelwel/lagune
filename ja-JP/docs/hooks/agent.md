# agent フック：上限のないエージェントループを検出する

> コマンドラインから、ステップ数や時間に上限のないエージェントや LLM の呼び出しをコードベース全体でスキャンしたり、1 つの呼び出しを判定したりできます。

正規 URL: https://lagune.ai/ja-JP/docs/hooks/agent
言語: ja-JP
原文: https://lagune.ai/docs/hooks/agent
最終更新日: 2026-11-05

`agent` フックは、**ターン数、予算、時間のどれにも上限を設けずにループするエージェントランタイム**を指摘します。自律動作の暴走を招くこの穴があると、細工された入力ひとつで、コストが際限なく膨らんだり、プロンプトインジェクションがエスカレートしたりします。**言語を識別**して動作し、**JavaScript**（**Claude** エージェント SDK の `query` ランタイム）と **Python**（**LangChain**、**LangGraph**、**CrewAI**、**OpenAI Agents**）という 2 つのエージェントフレームワークのエコシステムに対応しています。また、[`llm` 専門知識](https://lagune.ai/ja-JP/docs/catalog) を支える決定論的なエンジンでもあり、**scan** モードまたは **check** モードで自分で実行することもできます。

## 実行方法

**コードベースをスキャン**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**呼び出しをチェック**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

**Uncapped agent loops found** の下に並ぶ各行は、エージェント SDK をインポートしているファイル内で、Claude エージェント SDK の `query` ランタイムをターン数、予算、時間のどれにも上限を設けずに呼び出している箇所（JavaScript、デフォルトでは上限なし）か、`max_iterations=None` / `max_turns=None` のようにフレームワークのデフォルトの上限を明示的に外している箇所（Python、デフォルトでは上限あり）です。どちらが見つかっても、0 以外の終了コードで終了します。Vercel AI SDK の `generateText`/`streamText` はデフォルトで 1 ステップしか実行しない（`stopWhen: stepCountIs(1)`）ため、そのまま呼び出してもループせず、指摘されません。また、通常の `db.query(...)` がエージェントの呼び出しと誤認されることもありません。何も見つからなければ `no uncapped agent loops found` と出力します。

## 判定の読み方

| 判定       | 意味                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `uncapped` | 上限のない `query` ランタイムの呼び出し（JS）、または上限の明示的な解除（`=None`、Py）。                        |
| `safe`     | 上限を設定した `query` の呼び出し、1 ステップだけの生成、またはデフォルトで上限のあるフレームワークの呼び出し。 |
| `invalid`  | 判定できるエージェントの呼び出しがコードスニペットに見当たらない。                                              |

### CLI オプション

| オプション  | 値               | 説明                                                                                              |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `--pattern` | コードスニペット | 1 つの呼び出しをチェックする。繰り返し指定すると複数をチェックし、1 行に 1 つずつ判定を出力する。 |
| `--lang`    | 言語             | `--pattern` を使うときは必須：`javascript` または `python`。                                      |
| `--dir`     | ディレクトリ     | スキャン対象をディレクトリに絞る。繰り返し指定でき、`--file` と併用できる。                       |
| `--file`    | ファイル         | スキャン対象を 1 つのファイルに絞る。繰り返し指定でき、`--dir` と併用できる。                     |

オプションを指定しなければ、プロジェクト全体をスキャンします。`--pattern` には `--lang` が必要で、`--dir` や `--file` とは併用できません。

### スキャン対象を選ぶ

**Git** が無視するものはスキャンしません。さらに除外したいときや、**Git** が無視するものもスキャンしたいときは、`agent` フック専用の設定を指定します：

```bash
npx lagune write add --ignore test/fixtures --checker agent
```

```json
{
  "checkers": {
    "agent": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

すべての設定項目は [フックの設定](https://lagune.ai/ja-JP/docs/hooks/configure) で説明しています。

**ベストエフォートであり、網羅的ではない**

自前で実装したエージェントループは、どの言語で書かれていても静的スキャンでは捉えられません。完全な一覧ではなく、確かな最低ラインとして扱ってください。

**ヒント**

フックが判定するのは上限だけで、機能の範囲の絞り込み、信頼レベルの混在、認可といった判断は、引き続き [`llm` 専門知識](https://lagune.ai/ja-JP/docs/catalog) が担います。

## よくある質問

### エージェントループに上限を設けるべきなのはなぜですか？

上限のないエージェントは、際限のない再帰やコスト、プロンプトインジェクションのエスカレーションへと誘導されるおそれがあります。maxTurns/maxBudgetUsd/stopWhen/signal を設定すれば歯止めがかかり、agent フックはどれも設定していない query ランタイムの呼び出しを指摘します。
