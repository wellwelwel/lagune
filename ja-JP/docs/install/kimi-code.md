# Kimi Code に Lagune をプラグインとしてインストール

> Kimi Code に Lagune をプラグインとしてインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/kimi-code
言語: ja-JP
原文: https://lagune.ai/docs/install/kimi-code
最終更新日: 2026-11-09

**Kimi Code** のセッションからプラグインをインストールし、**Trust and install** を選んでから、新しいセッションを開始して読み込みます：

```prompt
/plugins install https://github.com/wellwelwel/lagune
/new
```

## 更新

**Lagune** を更新するには、もう一度インストールします：

```prompt
/plugins install https://github.com/wellwelwel/lagune
/new
```

## コマンド

コマンドはプラグイン名を付けて入力します。たとえば `/lagune:lagune-charter` で `/lagune-charter` を実行します。`/` メニューには `/skill:lagune:lagune-charter` の形で表示され、この形でも実行できます。

## よくある質問

### Kimi Code に Lagune をインストールするにはどうすればよいですか？

Kimi Code のセッションで /plugins install https://github.com/wellwelwel/lagune を実行し、Trust and install を選んでから /new を実行します。

### Kimi Code で Lagune を更新するにはどうすればよいですか？

/plugins install https://github.com/wellwelwel/lagune をもう一度実行してから、/new を実行します。

### Kimi Code で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune:lagune-charter のようにプラグイン名を付けて入力するか、/skill:lagune:lagune-charter のように / メニューに表示される形で入力します。
