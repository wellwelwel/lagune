# Antigravity CLI に Lagune をプラグインとしてインストール

> Antigravity CLI に Lagune をプラグインとしてインストールし、最新の状態に保ち、エンジンの実行を事前に許可します。

正規 URL: https://lagune.ai/ja-JP/docs/install/antigravity-cli
言語: ja-JP
原文: https://lagune.ai/docs/install/antigravity-cli
最終更新日: 2026-11-05

ターミナルからプラグインをインストールします：

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## 更新

**Lagune** を更新するには、もう一度インストールします：

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## コマンド

コマンドはプラグイン名を付けて入力します。たとえば `/lagune:lagune-charter` で `/lagune-charter` を実行します。

---

**権限**

エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。セッションの最初のメッセージとして送ったコマンドは、これらのツールが読み込まれる前に実行されるため、代わりに **npx** を使います。ツールと **npx** を事前に許可するには、`~/.gemini/antigravity-cli/settings.json` に次のルールを追加します：

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## よくある質問

### Antigravity CLI に Lagune をインストールするにはどうすればよいですか？

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity を実行します。

### Antigravity CLI で Lagune を更新するにはどうすればよいですか？

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity をもう一度実行します。

### Antigravity CLI で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune:lagune-charter のように、プラグイン名を付けて入力します。

### Antigravity CLI で、許可を求められずに Lagune を実行できますか？

はい。Antigravity CLI の設定で mcp(lagune_lagune/lagune_read)、mcp(lagune_lagune/lagune_write)、command(regex:npx --yes lagune@[0-9.]+) を許可します。npx のルールは、セッションの最初のメッセージとして送ったコマンドに適用されます。
