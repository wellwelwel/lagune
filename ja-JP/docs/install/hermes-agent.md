# Hermes Agent に Lagune をプラグインとしてインストール

> Hermes Agent に Lagune をプラグインとしてインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/hermes-agent
言語: ja-JP
原文: https://lagune.ai/docs/install/hermes-agent
最終更新日: 2026-11-05

ターミナルからプラグインをインストールします：

```bash
hermes plugins install wellwelwel/lagune --enable
```

- **Hermes Agent** がカタログ外のプラグインについて確認を求めてきたら、**承認します**。
- リポジトリの **Node.js** 依存関係をインストールするか尋ねてきたら、**拒否します**。

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
hermes plugins update lagune
```

## コマンド

コマンドはプラグイン名を付けて入力します。たとえば `/lagune:lagune-charter` で `/lagune-charter` を、`/lagune:lagune` で `/lagune` を実行します。

## よくある質問

### Hermes Agent に Lagune をインストールするにはどうすればよいですか？

hermes plugins install wellwelwel/lagune --enable を実行します。確認を求められたらプラグインを承認し、リポジトリの Node.js 依存関係のインストールは拒否します。

### Hermes Agent で Lagune を更新するにはどうすればよいですか？

hermes plugins update lagune を実行します。

### Hermes Agent で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune:lagune-charter や /lagune:lagune のように、プラグイン名を付けて入力します。
