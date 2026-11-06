# Grok Build に Lagune をプラグインとしてインストール

> Grok Build に Lagune をプラグインとしてインストールし、最新の状態に保ち、エンジンの実行を事前に許可します。

正規 URL: https://lagune.ai/ja-JP/docs/install/grok-build
言語: ja-JP
原文: https://lagune.ai/docs/install/grok-build
最終更新日: 2026-11-03

ターミナルからプラグインをインストールします：

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
grok plugin update lagune
```

## コマンド

`/lagune-charter` のようにコマンド名をそのまま入力するか、`/lagune:lagune-charter` のようにプラグイン名を付けて入力します。

---

**権限**

エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。これらを事前に許可するには、`~/.grok/config.toml` に次のルールを追加します：

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

**skills.sh** でインストールした場合など、エンジンが **npx** 経由で動作するときは、`Bash(npx --yes lagune@*)` を許可します。

## よくある質問

### Grok Build に Lagune をインストールするにはどうすればよいですか？

grok plugin install wellwelwel/lagune@plugin-grok --trust を実行します。

### Grok Build で Lagune を更新するにはどうすればよいですか？

grok plugin update lagune を実行します。

### Grok Build で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune-charter のようにコマンド名をそのまま入力するか、/lagune:lagune-charter のようにプラグイン名を付けて入力します。

### Grok Build で、許可を求められずに Lagune を実行できますか？

はい。Grok Build の設定で MCPTool(lagune__lagune_read) と MCPTool(lagune__lagune_write) を許可します。エンジンが npx 経由で動作する場合は、Bash(npx --yes lagune@*) も許可します。
