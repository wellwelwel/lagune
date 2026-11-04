# Factory Droid に Lagune をプラグインとしてインストール

> Factory Droid に Lagune をプラグインとしてインストールし、最新の状態に保ち、エンジンのツールを許可します。

正規 URL: https://lagune.ai/ja-JP/docs/install/factory-droid
言語: ja-JP
原文: https://lagune.ai/docs/install/factory-droid
最終更新日: 2026-11-04

ターミナルからプラグインをインストールします：

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## コマンド

`/lagune-charter` のように、コマンド名をそのまま入力します。

---

**権限**

エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。**Factory Droid** が確認を求めてきたら、それぞれを常に許可するよう選びます。`lagune` マーケットプレイスの新しいコミットを同期すると、もう一度確認を求めてきます。この同期は起動時に行われることがあります。

## よくある質問

### Factory Droid に Lagune をインストールするにはどうすればよいですか？

droid plugin marketplace add wellwelwel/lagune を実行してから、droid plugin install lagune@lagune を実行します。

### Factory Droid で Lagune を更新するにはどうすればよいですか？

droid plugin marketplace update lagune を実行してから、droid plugin update lagune@lagune を実行します。

### Factory Droid で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune-charter のように、コマンド名をそのまま入力します。

### Factory Droid で、許可を求められずに Lagune を実行できますか？

はい。Factory Droid が確認を求めてきたら、lagune_read と lagune_write を常に許可するよう選びます。lagune マーケットプレイスの新しいコミットを同期すると、もう一度確認を求めてきます。
