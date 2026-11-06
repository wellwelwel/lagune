# カテゴリ

> Lagune プロジェクトで使える専門知識のカテゴリと、その変更方法を解説します。OWASP から、JavaScript、Python、Go、Rust の言語別の堅牢化までを扱います。

正規 URL: https://lagune.ai/ja-JP/docs/categories
言語: ja-JP
原文: https://lagune.ai/docs/categories
最終更新日: 2026-11-03

**Lagune** は組み込みの [**専門知識**](https://lagune.ai/ja-JP/docs/catalog) を **13 のカテゴリ**に分類しています。プロジェクトで使うカテゴリによって、どの組み込みの専門知識がプロジェクトの [**カタログ**](https://lagune.ai/ja-JP/docs/catalog) に入るかが決まります。カテゴリは、システムが何をするかを扱うものと、何の言語で書かれているかを扱うものの 2 種類に分かれます。

カテゴリがひとつも記録されていない間、プロジェクトは `owasp` だけを使います。[`/lagune-charter`](https://lagune.ai/ja-JP/docs/commands/charter) は、プロジェクトを読み取った結果から裏付けの得られたカテゴリをすべて記録します。カテゴリはいつでも自分で変更できます。

## システムが何をするか

| カテゴリ | キー      | 堅牢化の対象                                                                                                      |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| OWASP    | `owasp`   | OWASP が追跡するアプリケーションセキュリティのリスク：インジェクション、アクセス制御の不備、認証や暗号化の失敗    |
| インフラ | `infra`   | コンテナー、ワークロード、サーバーレスの設定：Dockerfile、Compose、Pod のセキュリティ、FaaS の IAM とトリガー     |
| AI / LLM | `ai`      | AI や LLM との連携を、プロンプトインジェクションや、安全でないツール、エージェント、検索、MCP の組み込みから守る  |
| Lovable  | `lovable` | AI が生成した Supabase アプリ（Lovable など）：RLS の不備、漏洩した `service_role` キー、安全でないデフォルト設定 |

## 何の言語で書かれているか

| カテゴリ   | キー         | 堅牢化の対象                                                                                                            |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | 各ランタイムでの `eval` や `child_process` による RCE、パストラバーサル、プロトタイプ汚染                               |
| Python     | `python`     | `pickle` や YAML のデシリアライズによる RCE、`str.format` による文字列トラバーサル、クラス汚染                          |
| Rust       | `rust`       | 健全でない `unsafe` API、`transmute` の誤用、整数オーバーフロー、FFI 境界での未定義動作                                 |
| C / C++    | `c-cpp`      | コード実行につながるフォーマット文字列のバグ、バッファーオーバーフロー、境界外書き込み                                  |
| PHP        | `php`        | 型の相互変換（type juggling）による認証回避、オブジェクトインジェクションのガジェットチェーン、安全でないデフォルト設定 |
| Go         | `go`         | typed nil インターフェースのバグ、goroutine のデータ競合、セキュリティに関わる処理での安全でない並行処理                |
| Java       | `java`       | リモートコード実行に至る `ObjectInputStream` のデシリアライズのガジェットチェーン                                       |
| Ruby       | `ruby`       | リモートコード実行に到達する `Marshal.load` や YAML のデシリアライズのガジェットチェーン                                |
| .NET / C#  | `dotnet`     | `BinaryFormatter` のデシリアライズによる RCE と、XSS につながるエンコーダーの回避                                       |

**ヒント**

**Lagune** は言語に依存しません。プロジェクトが何の言語で書かれていても、フロー全体でそのまま読み取れます。これらのカテゴリは、特定の言語に固有の落とし穴をさらに深く掘り下げるだけです。

## いつでも追加・削除できる

カテゴリは出発点であり、一度選んだら変えられないものではありません。今のプロジェクトに合うものを使い、`write add` と `write remove` でキーを指定して、いつでも変更できます。ターミナルで `--categories` に値を付けずに実行すると、対話式の選択画面が開きます（スペースキーで選択の切り替え、Enter キーで確定、何も選ばなければスキップ）。ターミナル以外では、そのあとにカテゴリを続けて指定します。

**追加**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**削除**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

最初の `write add` や `write remove` は `owasp` を起点にするため、カテゴリをすべて削除すると、デフォルトに戻るのではなく空のリストになります。変更はすべて `.lagune/configs.json` に記録されるので、チーム全員が同じカテゴリの組み合わせで作業できます。

## プロジェクトで使っているカテゴリを確認する

`read list --categories` は、すべてのカテゴリと、それぞれをプロジェクトで使っているかどうかを表示します：

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

各カテゴリにどの専門知識が含まれるかは、[**カタログ**](https://lagune.ai/ja-JP/docs/catalog) を参照してください。[`/lagune-specialize`](https://lagune.ai/ja-JP/docs/commands/specialize) で作成した独自の専門知識は、どのカテゴリを選んでいてもカタログに加わります。

## よくある質問

### カテゴリはどうやって追加しますか？

カテゴリのキーを --categories に渡します。たとえば npx lagune write add --categories javascript のように実行します。カテゴリがまだ記録されていない間は、charter もプロジェクトを読み取った結果から裏付けの得られたカテゴリを記録します。

### カテゴリは複数使えますか？

はい。同じ行に続けて並べて指定します。

### プロジェクトにはどのカテゴリを使えばいいですか？

まずはデフォルトの owasp から始め、使っている言語や技術スタックのカテゴリを追加してください。専門知識は必要なときだけ読み込まれるので、フェーズがそのカテゴリの専門知識を必要とするまでは、カテゴリを追加しても何のコストもかかりません。
