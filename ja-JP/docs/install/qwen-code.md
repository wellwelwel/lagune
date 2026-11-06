# Qwen Code に Lagune を拡張機能としてインストール

> Qwen Code に Lagune を拡張機能としてインストールし、最新の状態に保ち、エンジンの実行を事前に許可します。

正規 URL: https://lagune.ai/ja-JP/docs/install/qwen-code
言語: ja-JP
原文: https://lagune.ai/docs/install/qwen-code
最終更新日: 2026-11-03

ターミナルから拡張機能をインストールします：

```bash
qwen extensions install lagune
```

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
qwen extensions update lagune
```

常に最新の状態に保つには、`--auto-update` を付けてインストールします。

## コマンド

コマンドは拡張機能名を付けて入力します。たとえば `/lagune:lagune-charter` で `/lagune-charter` を実行します。

---

**権限**

エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。これらを事前に許可するには、次のルールを、1 つのプロジェクトなら `.qwen/settings.json` に、すべてのプロジェクトなら `~/.qwen/settings.json` に追加します：

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

**skills.sh** でインストールした場合など、エンジンが **npx** 経由で動作するときは、`Shell(npx --yes lagune@*)` を許可します。

## よくある質問

### Qwen Code に Lagune をインストールするにはどうすればよいですか？

qwen extensions install lagune を実行します。

### Qwen Code で Lagune を更新するにはどうすればよいですか？

qwen extensions update lagune を実行するか、--auto-update を付けて拡張機能をインストールします。

### Qwen Code で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune:lagune-charter のように、拡張機能名を付けて入力します。

### Qwen Code で、許可を求められずに Lagune を実行できますか？

はい。Qwen Code の設定で mcp__lagune__lagune_read と mcp__lagune__lagune_write を許可します。エンジンが npx 経由で動作する場合は、Shell(npx --yes lagune@*) も許可します。
