# インストール：どの AI エージェントでも使えるセキュリティ強化

> Lagune はどのプロジェクトにもインストールできます。エージェントが対応していればプラグインとして、それ以外では skills CLI で導入し、プロジェクトに合ったセキュリティの専門知識を選びます。

正規 URL: https://lagune.ai/ja-JP/docs
言語: ja-JP
原文: https://lagune.ai/docs
最終更新日: 2026-11-04

**Lagune** は、AI エージェントがプロジェクトをより安全にするのを手伝います。コードに対して実行すると、エージェントはシステムが実際に何をしているかを把握したうえで、そのシステムにとって重要なセキュリティ作業を順に案内します。**Lagune** は、[Security-Driven Hardening (SDH)](https://lagune.ai/ja-JP/docs/references/paper) という方法論の最初のプロジェクトです。

**OSS を応援**

**Lagune** が気に入りましたか？[**GitHub** で ⭐ をお願いします](https://github.com/wellwelwel/lagune)

## エージェントを選ぶ

- [Claude Code](https://lagune.ai/ja-JP/docs/install/claude-code): Anthropic のエージェント型コーディングツール
- [Codex](https://lagune.ai/ja-JP/docs/install/codex): OpenAI のコーディングエージェント
- [Cursor](https://lagune.ai/ja-JP/docs/install/cursor): AI コードエディター
- [GitHub Copilot](https://lagune.ai/ja-JP/docs/install/github-copilot-cli): GitHub の AI ペアプログラマー
- [Gemini CLI](https://lagune.ai/ja-JP/docs/install/gemini-cli): Google のオープンソースのターミナルエージェント
- [Antigravity](https://lagune.ai/ja-JP/docs/install/antigravity-cli): Google のエージェント型開発プラットフォーム
- [OpenCode](https://lagune.ai/ja-JP/docs/install/opencode): オープンソースのコーディングエージェント
- [Devin for Terminal](https://lagune.ai/ja-JP/docs/install/devin-cli): Cognition のターミナルエージェント
- [Factory Droid](https://lagune.ai/ja-JP/docs/install/factory-droid): Factory のソフトウェア開発エージェント
- [Grok Build](https://lagune.ai/ja-JP/docs/install/grok-build): xAI のコーディングエージェント
- [Qwen Code](https://lagune.ai/ja-JP/docs/install/qwen-code): Qwen のターミナル向けコーディングエージェント
- [Kimi Code](https://lagune.ai/ja-JP/docs/install/kimi-code): Moonshot AI のコーディングエージェント
- [Muse Code](https://lagune.ai/ja-JP/docs/install/muse-code): Meta のコーディングエージェント
- [Pi](https://lagune.ai/ja-JP/docs/install/pi): ミニマルなターミナル向けコーディングエージェント
- [Hermes Agent](https://lagune.ai/ja-JP/docs/install/hermes-agent): Nous Research のオープンソースエージェント
- [汎用](https://lagune.ai/ja-JP/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed ほか 66 種類

**備考**

- **Lagune** は内部で **Node.js** を使って動作しますが、開発に使う言語は自由です。
- 完全にオフラインで実行するには、`npm i -D lagune@0.17.0` で **Lagune** をプロジェクトにインストールします。

## カテゴリ

**Lagune** のセキュリティに関する知見は [**専門知識**](https://lagune.ai/ja-JP/docs/catalog) という単位で提供され、[**カテゴリ**](https://lagune.ai/ja-JP/docs/categories) ごとにまとめられています。

- **OWASP** (`owasp`): OWASP が追跡するアプリケーションセキュリティのリスクに備えて堅牢化：インジェクション、アクセス制御の不備、認証や暗号化の失敗
- **インフラストラクチャ** (`infra`): コンテナー、ワークロード、サーバーレスの設定を堅牢化：Dockerfile、Compose、Pod セキュリティ、FaaS の IAM とトリガー
- **AI / LLM** (`ai`): AI・LLM との連携を堅牢化し、プロンプトインジェクションや、ツール・エージェント・検索・MCP の安全でない接続を防ぐ
- **Lovable** (`lovable`): AI が生成した Supabase アプリ（Lovable など）を堅牢化：RLS の不備、service_role キーの漏えい、安全でないデフォルト設定
- **JavaScript** (`javascript`): JavaScript とそのランタイムを堅牢化し、eval や child_process による RCE、パストラバーサル、プロトタイプ汚染を防ぐ
- **Python** (`python`): Python を堅牢化し、pickle や YAML のデシリアライズによる RCE、str.format による文字列トラバーサル、クラス汚染を防ぐ
- **Rust** (`rust`): Rust を堅牢化し、健全でない unsafe API、transmute の誤用、整数オーバーフロー、FFI 境界での未定義動作を防ぐ
- **Java** (`java`): Java を堅牢化し、ObjectInputStream のデシリアライズを悪用してリモートコード実行に至るガジェットチェーンを防ぐ
- **Ruby** (`ruby`): Ruby を堅牢化し、Marshal.load や YAML のデシリアライズを悪用してリモートコード実行に至るガジェットチェーンを防ぐ
- **PHP** (`php`): PHP を堅牢化し、型ジャグリングによる認証回避、オブジェクトインジェクションのガジェットチェーン、安全でないデフォルト設定を防ぐ
- **Go** (`go`): Go を堅牢化し、型付き nil インターフェースのバグ、goroutine のデータ競合、セキュリティ上重要な経路での安全でない並行処理を防ぐ
- **C / C++** (`c-cpp`): C と C++ を堅牢化し、コード実行につながる書式文字列のバグ、バッファオーバーフロー、境界外書き込みを防ぐ
- **.NET** (`dotnet`): .NET と C# を堅牢化し、BinaryFormatter のデシリアライズによる RCE や、XSS につながるエンコーダーの回避を防ぐ

選んだカテゴリのキーを付けて `npx lagune write add --categories` を実行してください。

**ヒント**

プロジェクトは `owasp` から始まり、[`/lagune-charter`](https://lagune.ai/ja-JP/docs/commands/charter) がプロジェクトを読み解いたうえで、その内容に裏付けられたカテゴリを追加します。

## 動作要件

システムに [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) がインストールされている必要があります。

## バッジを使う ✨

**Lagune** をお使いですか？**README** にバッジを追加しましょう：

**2 色**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**単色**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## 次のステップ

**Lagune** の各 [**スキル**](https://lagune.ai/ja-JP/docs/get-started/commands) の役割を確認しましょう。

## よくある質問

### Lagune とは何ですか？

Lagune は、AI エージェントがあらゆるコードベースを堅牢化するのを支援する、オープンソースで防御専用のセキュリティワークフローです。コードに対して実行すると、システムが実際に何をしているかを検出し、その状況にとって重要なセキュリティ修正を案内します。

### Lagune はどうやってインストールしますか？

エージェントを選んでください：Claude Code、GitHub Copilot CLI、Muse Code、Antigravity CLI、Cursor、Kimi Code、OpenCode、Codex CLI、Factory Droid、Grok Build、Devin CLI、Hermes Agent ではプラグインとして、Gemini CLI と Qwen Code では拡張機能として、Pi ではパッケージとして Lagune をインストールし、それ以外のエージェントでは npx skills add wellwelwel/lagune でインストールします。新規プロジェクトでも既存のプロジェクトでも使えます。

### Lagune に API キーは必要ですか？

いいえ。ご自身の AI エージェントを通じて動作するため、API キーは不要です。

### 動作要件は何ですか？

システムに Node.js (LTS) がインストールされている必要があります。

### Lagune はどのプログラミング言語に対応していますか？

どの言語にも対応しています。Lagune 自体は内部で Node.js を使って動作しますが、どのプログラミング言語で書かれたプロジェクトでも監査し、堅牢化できます。

### Lagune はプロジェクトに何を追加しますか？

プロジェクトのセキュリティ状態を保存する .lagune/ ディレクトリです。最初に書き込みを行うコマンドが作成します。さらに skills CLI はスラッシュコマンドをプロジェクト内にインストールし、エージェントはそこから読み込みますが、プラグインの場合はコマンドをエージェントの内部に保持します。

### Lagune はどうやって更新しますか？

インストールしたときと同じ方法で更新します。各エージェントのインストールページに、そのエージェントでの Lagune の更新方法が載っており、skills CLI の場合は npx skills update で更新します。セキュリティ原則、各フェーズの成果物、独自に追加した専門知識はそのまま残ります。

### プロジェクトではどの専門知識が使われますか？

プロジェクトのカテゴリに含まれる組み込みの専門知識と、プロジェクト独自の専門知識です。charter はプロジェクトを読み解いた結果に裏付けられたカテゴリを記録し、npx lagune write add --categories でそれらを変更できます。

### プロジェクトのセキュリティ対策は、開発が終わってからでないとできませんか？

いいえ。/lagune コマンドは、書いているそばから作業を堅牢化します。どんなプロンプトでも受け付けて、依頼されたものを構築し、セキュリティ原則に沿って安全なデフォルト設定で堅牢化します。既存のコードを監査するのは、5 フェーズの Blue Team フローです。

### Lagune で既存のプロジェクトを監査できますか？

はい。5 フェーズの Blue Team フローが既存のコードを監査します：charter がセキュリティルールを定め、detect がシステムの動作とリスクの所在を洗い出し、plan が各検出事項を評価して修正を対応づけ、harden が修正を適用し、verify が修正の有効性を証明してクローズします。

### Lagune を使うのと、エージェントに脆弱性やセキュリティ上の欠陥を洗い出すよう頼むだけなのとでは、何が違いますか？

エージェントが単独でコードを読むと、脆弱性らしく見えるものは見つけますが、対策らしく見えるものは素通りします。ブロック対象のアドレス一覧があると、すでに誰かがリスクに対処したように見えるため、その一覧が大半のアドレスを取りこぼしていることを誰も確かめないまま、コードがリリースされます。Lagune はこの前提をひっくり返します：コードにすでにある防御処理は確認するまで未証明とみなし、カタログ内のすべての専門知識に明確な判定を下し、verify は対策があるかどうかではなく、リスクがなくなったかどうかを問います。また、各検出事項は実行をまたいでも 1 つの追跡項目のままなので、リスクが解消されたことを証明してクローズできます。一方、ただ頼むだけでは毎回違うレポートが返ってくるため、比べようがありません。

### Lagune を使って開発するのと、エージェントに安全なコードを書くよう頼むだけなのとでは、何が違いますか？

安全なコードを頼むだけでは、何をもって安全とするかをエージェントに委ねることになり、しかも何を頼めばよいかを分かっていることが前提になります。必要な要件は、たいてい依頼した本人もエージェントも気づかないまま、すでに依頼の中に含まれています：ユーザーがアクセスできる講座を表示するページを頼めば、それだけで認可のルールを示していることになり、書かれなかったチェックは、コード上に気づく手がかりを何も残しません。/lagune コマンドは、最初の 1 行を書く前に、セキュリティ原則と、これから構築するものに合う専門知識を読み込み、そのうえで、使った防御に照らして結果を読み直します。安全な書き方が安全でない書き方よりコストがかかることはめったにないので、結果を左右するのはどちらを選ぶべきかを知っているかどうかであり、それこそが最初の段階で手に入るものです。

### Lagune は DAST（動的アプリケーションセキュリティテスト）を実行したり、稼働中のアプリケーションをテストしたりしますか？

いいえ。Lagune はコードを読むだけで、システムを実行したり、細工したリクエストを送ったりすることはありません。verify が確認するのは、対策がソースコードに存在し、正しく実装されているかどうかです。これは稼働中の環境で攻撃を受けても対策が持ちこたえるかどうかとは別の問いなので、"cannot tell from the code"（コードからは判断できない）は、黙って合格扱いにするのではなく、正当な判定のひとつです。DAST は実行時の問いに、Lagune はソースコードの問いに答えるため、どちらかがもう一方の代わりになることはありません。オプションの prove コマンドでさえこの一線を守っています：そのテストが検証するのは安全な振る舞いであり、攻撃ペイロードではありません。

### Lagune はペネトレーションテスト（ペンテスト）の代わりになりますか？

いいえ、決して代わりにはなりません！ペネトレーションテストは、正式な承認のもとで専門家が稼働中のシステムに対して自らの判断で進める作業で、複数の検出事項を連鎖させたり、攻撃対象領域ごとのルールでは表しきれないビジネスロジックを探ったりします。ペネトレーションテストの検出事項は、detect で懸念事項として扱うことで Lagune の Blue Team フローに取り込めるので、専門家が報告した内容も計画、堅牢化、検証まで進められます。

## セキュリティポリシー

[SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md) をご確認ください。

## ライセンス

**Lagune** は [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE) のもとで提供されています。

Copyright © 2026-present [Weslley Araújo](https://github.com/wellwelwel) および [コントリビューター](https://github.com/wellwelwel/lagune/graphs/contributors)。
