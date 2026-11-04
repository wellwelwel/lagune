# Devin CLI に Lagune をプラグインとしてインストール

> Devin CLI に Lagune をプラグインとしてインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/devin-cli
言語: ja-JP
原文: https://lagune.ai/docs/install/devin-cli
最終更新日: 2026-11-04

**Devin** にサインインしてから、ターミナルからプラグインをインストールします：

```bash
devin auth login
devin plugins install wellwelwel/lagune
```

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
devin plugins update lagune
```

## コマンド

コマンドはプラグイン名を付けて入力します。たとえば `/lagune:lagune-charter` で `/lagune-charter` を実行します。`/` メニューにも表示されます。

## よくある質問

### Devin CLI に Lagune をインストールするにはどうすればよいですか？

devin auth login でサインインしてから、devin plugins install wellwelwel/lagune を実行します。

### Devin CLI で Lagune を更新するにはどうすればよいですか？

devin plugins update lagune を実行します。

### Devin CLI で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune:lagune-charter のように、プラグイン名を付けて入力します。/ メニューにも表示されます。
