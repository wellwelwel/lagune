# カタログ：必要なときに読み込むセキュリティの専門知識

> プロジェクトのカタログにある専門知識がどう読み込まれるかを解説します。フェーズが必要なときに読み込むほか、自分で直接読み込むこともできます。

正規 URL: https://lagune.ai/ja-JP/docs/catalog
言語: ja-JP
原文: https://lagune.ai/docs/catalog
最終更新日: 2026-11-04

🧠 **Lagune** の専門知識は、特定の分野に絞った、言語に依存しないセキュリティの知識モジュールです。必要なときだけ読み込まれ、デフォルトで読み込まれることはありません。専門知識はコマンドではありません。プロジェクトのカタログとは、そのプロジェクトが使う専門知識の集まりで、プロジェクトの [カテゴリ](https://lagune.ai/ja-JP/docs/categories) に属する組み込みの専門知識と、プロジェクト独自の専門知識からなります。detect フェーズと verify フェーズは実行中にこれらを参照します。また、いつでも自分で直接読み込むこともできます。

**概要**

*インタラクティブなカタログ概要は Web ページにあります。組み込みの専門知識はすべて下の表に載っています。*

**仕組み**

## 自分で実行する

専門知識を直接使うには、エージェントに `read catalog <name>` で読み込むよう頼み、同じプロンプトにタスクを書きます。すると、その知識が依頼した内容に生かされます。どんなプロンプトでも使え、**Lagune** のフローと関係のないプロンプトでも構いません。

たとえば、**Python** で安全な **RegExp** のコレクションを生成する、自由形式のプロンプトを直接書く場合：

```prompt
`npx lagune read catalog regex` で regex の専門知識を読み込んでから、@src/utils/regex.py にメールアドレスとユーザー名を検証する正規表現のコレクションを作成してください。
```

この場合、決定論的なフックで各 **RegExp** に **ReDoS** の危険がないかをテストし、安全なものだけを残して、次のような結果を生成します：

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**ReDoS チェッカーを試す**

[**devina.io/redos-checker**](https://devina.io/redos-checker) で、パターンを自分でテストできます。

## 組み込みの専門知識

組み込みの専門知識は [**カテゴリ**](https://lagune.ai/ja-JP/docs/categories) ごとにまとめられています。**Lagune** に同梱されているのは次のとおりです：

| 専門知識              | カテゴリ                    | 対象                                                                                                                     |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `regex`               | `owasp`                     | **ReDoS**：細工された入力で処理が爆発的に重くなるパターン。                                                              |
| `network`             | `owasp`                     | **SSRF とリダイレクト**：ユーザーが指定する取得先やリダイレクト先。                                                      |
| `interpreter`         | `owasp`, `lovable`          | **コードインジェクション**：`eval`、動的な include、名前によるディスパッチ。                                             |
| `sql`                 | `owasp`                     | **リレーショナルデータベース**：インジェクション、ORM の生クエリ呼び出し、権限、データベースエンジンから到達できる範囲。 |
| `path`                | `owasp`                     | **ファイルシステムのパス**：パストラバーサル、ヌルバイト、NTFS のストリーム、不正なファイルの配置。                      |
| `upload`              | `owasp`                     | **ファイルアップロード**：種類とシグネチャ、悪意のある内容、保存先、制限。                                               |
| `access-control`      | `owasp`, `lovable`          | **認証・認可・セッション**：IDOR、マスアサインメント、テナント、セッション。                                             |
| `credential-endpoint` | `owasp`, `lovable`          | **推測攻撃とボット**：総当たり攻撃、パスワードスプレー、リスト型攻撃、スロットリング。                                   |
| `federation`          | `owasp`                     | **トークンの信頼性**：OAuth/OIDC、SAML、JWT の検証、QR ログイン。                                                        |
| `http-request`        | `owasp`                     | **リクエストの出所**：CSRF、CORS の設定ミス、偽装されたクライアント IP。                                                 |
| `transport`           | `owasp`                     | **通信経路のセキュリティ**：TLS の設定、HTTPS と平文通信、HSTS、証明書ピンニング。                                       |
| `crypto`              | `owasp`, `lovable`          | **保存データの暗号化**：脆弱なアルゴリズムや独自アルゴリズム、CSPRNG、鍵管理。                                           |
| `secrets`             | `owasp`, `lovable`          | **ハードコードされた認証情報**：ソースコードに直接書かれたキー、トークン、パスワード。                                   |
| `api-endpoint`        | `owasp`                     | **REST 以外の API**：GraphQL、gRPC、WebSocket の認可、DoS、スキーマ。                                                    |
| `payment`             | `owasp`, `lovable`          | **決済フロー**：サーバー側での決済ゲートウェイの検証、署名付きコールバック、冪等性。                                     |
| `xml`                 | `owasp`                     | **XML の解析**：XXE、外部エンティティ、Billion Laughs 型のエンティティ展開。                                             |
| `csv`                 | `owasp`                     | **数式インジェクション**：`=`/`+`/`-`/`@` で始まるスプレッドシートのセル。                                               |
| `container`           | `owasp`, `infra`            | **コンテナーの設定**：root での実行、ケーパビリティ、ソケットのマウント、イメージの堅牢化。                              |
| `infra`               | `infra`                     | **Infrastructure as Code**：Terraform、Dockerfile、GitHub Actions。                                                      |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS の関数**：最小権限の IAM、イベント入力、コンテキスト、シークレット。                                              |
| `llm`                 | `ai`, `lovable`             | **AI/LLM のリスク**：プロンプトインジェクション、AI に与える権限、RAG、MCP、出力。                                       |
| `supabase`            | `lovable`                   | **Supabase のバックエンド**：デフォルトで無効な RLS、AI が誤って生成したポリシー、キーの仕組み。                         |
| `browser`             | `javascript`, `lovable`     | **クライアント側のリスク**：XSS、CSP、フレームへの埋め込み、ストレージなど。                                             |
| `javascript`          | `javascript`                | **言語レベルのリスク**：RCE、プロトタイプ汚染など。                                                                      |
| `python`              | `python`                    | **言語レベルのリスク**：`pickle` による RCE、クラス汚染、`-O` など。                                                     |
| `rust`                | `rust`                      | **`unsafe` の健全性**：safe な呼び出し元から生じる UB、`transmute`、オーバーフロー。                                     |
| `java`                | `java`                      | **デシリアライズとモバイルコード**：`readObject` のチェーン、オブジェクトの乗っ取り。                                    |
| `ruby`                | `ruby`                      | **デシリアライズと `open`**：`Marshal` や YAML によるオブジェクトの復元、パイプの特殊な挙動。                            |
| `php`                 | `php`                       | **型の相互変換と `unserialize`**：マジックハッシュ、POP チェーン。                                                       |
| `go`                  | `go`                        | **typed nil とデータ競合**：`nil != nil`、メモリを共有する goroutine。                                                   |
| `c-cpp`               | `c-cpp`                     | **フォーマット文字列**：`printf(user_input)`、`%n` による任意アドレスへの書き込み。                                      |
| `dotnet`              | `dotnet`                    | **プラットフォームレベルのリスク**：`BinaryFormatter` による RCE、`@Html.Raw`、列挙型の検証漏れ。                        |

組み込みの知識のほとんどは OWASP をもとにまとめたものです。各専門知識と、その元になった OWASP の正式な攻撃ページや Cheat Sheet ページとの対応の全体は、[**OWASP の出典**](https://lagune.ai/ja-JP/docs/references/owasp-sources) を参照してください。一部の技術スタック固有のモジュールは、OWASP ではなくベンダー自身のガイダンスをもとにしています。たとえば `supabase` は、Supabase のドキュメントと CVE-2025-48757 に基づいています。

## 独自の専門知識

組み込みの専門知識は、知識ファイルを 1 つとインデックスの行を 1 つ追加するだけで増やせ、新しいコマンドは必要ありません。独自の専門知識も同じ方法で、[`/lagune-specialize`](https://lagune.ai/ja-JP/docs/commands/specialize) を使って追加できます。記事やトピックを指定すると、それをもとに新しい専門知識をまとめてプロジェクトに加えます。ファイルは `.lagune/catalog/` の下に置かれ、そのエントリは `.lagune/configs.json` に記録されます。独自の専門知識はカテゴリにかかわらず常にカタログに含まれ、組み込みと同じ名前のものは、組み込みのほうより優先されます。

**Lagune は内部で、必要に応じて専門知識を自動的に読み込む**

detect フェーズや verify フェーズは、ある専門知識が扱う状況に出会うと、`read catalog <name>` でその専門知識を自ら読み込みます。これはフェーズの一部として自動的に行われるため、手作業で読み込む必要はありません。

## 使える専門知識を調べる

ターミナルでプロジェクトのカタログを一覧表示すると、専門知識が 1 行に 1 つずつ、タグと一緒に表示されます：

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

`[required]` の付いた専門知識は、作業の内容にかかわらず常に適用されます。一覧にどの組み込みの専門知識が含まれるかは、プロジェクトの [**カテゴリ**](https://lagune.ai/ja-JP/docs/categories) によって決まります。

**専門知識はデフォルトでは読み込まれない**

すべてのチェックをデフォルトで実行するのではなく、プロジェクトの実態に合った知識だけを取り込みます。

## よくある質問

### Lagune の専門知識とは何ですか？

特定の分野に絞った、言語に依存しないセキュリティの知識モジュールです。必要なときだけ読み込まれ、デフォルトで読み込まれることはありません。エージェントのスキルとは違い、コマンドではありません。

### プロジェクトのカタログとは何ですか？

プロジェクトが使う専門知識の集まりで、プロジェクトのカテゴリに属する組み込みの専門知識と、プロジェクト独自の専門知識からなります。カテゴリが記録されていない間は、OWASP だけを使います。

### 専門知識はデフォルトで読み込まれますか？

いいえ。プロジェクトの実態に合わせて、必要なときだけ読み込まれます。

### 専門知識を直接読み込むにはどうすればいいですか？

タスクと同じプロンプトで、エージェントに npx lagune read catalog <name> を実行するよう依頼してください。
