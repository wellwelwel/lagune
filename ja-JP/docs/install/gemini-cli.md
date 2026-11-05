# Gemini CLI に Lagune を拡張機能としてインストール

> Gemini CLI に Lagune を拡張機能としてインストールし、最新の状態に保ち、エンジンの実行を事前に許可します。

正規 URL: https://lagune.ai/ja-JP/docs/install/gemini-cli
言語: ja-JP
原文: https://lagune.ai/docs/install/gemini-cli
最終更新日: 2026-11-05

ターミナルから拡張機能をインストールします：

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
gemini extensions update lagune
```

常に最新の状態に保つには、`--auto-update` を付けてインストールします。

## コマンド

コマンドは拡張機能名を付けて入力します。たとえば `/lagune:lagune-charter` で `/lagune-charter` を実行します。

---

**権限**

エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。**Gemini CLI** は、信頼済みフォルダーでのみこれらを起動します。これらを事前に許可するには、次のルールを `~/.gemini/policies/lagune.toml` として保存します：

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

**skills.sh** でインストールした場合など、エンジンが **npx** 経由で動作するときは、同じファイルに次のルールを追加します：

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## よくある質問

### Gemini CLI に Lagune をインストールするにはどうすればよいですか？

gemini extensions install https://github.com/wellwelwel/lagune を実行します。

### Gemini CLI で Lagune を更新するにはどうすればよいですか？

gemini extensions update lagune を実行するか、--auto-update を付けて拡張機能をインストールします。

### Gemini CLI で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune:lagune-charter のように、拡張機能名を付けて入力します。

### Gemini CLI で、許可を求められずに Lagune を実行できますか？

はい。lagune サーバーの lagune_read と lagune_write ツールを許可するポリシールールを追加します。エンジンが npx 経由で動作する場合は、npx --yes lagune@ のあとにバージョンが続くコマンドを許可する run_shell_command のルールも追加します。
