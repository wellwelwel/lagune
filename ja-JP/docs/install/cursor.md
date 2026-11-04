# Cursor に Lagune をプラグインとしてインストール

> Cursor と Cursor CLI に Lagune をプラグインとしてインストールし、最新の状態に保ち、エンジンの実行を事前に許可します。

正規 URL: https://lagune.ai/ja-JP/docs/install/cursor
言語: ja-JP
原文: https://lagune.ai/docs/install/cursor
最終更新日: 2026-11-04

**Cursor**

- **Customize** を開きます。
- **From GitHub Repository** を選択し、`https://github.com/wellwelwel/lagune` を入力します。
- **Lagune** の **Install** を選択し、プロジェクトかユーザーのスコープを選びます。

**Cursor CLI**

- ターミナルからマーケットプレイスを追加します：

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` を `agent` のセッションで入力します。
- **Lagune** をインストールします。

**Claude Code** に **Lagune** をインストール済みなら、**Cursor CLI** はそこから読み込みます。

## 更新

**Cursor**

- **Customize** を開きます。
- `lagune` マーケットプレイスの **Refresh** を選択します。

**Cursor CLI**

- ターミナルからマーケットプレイスを置き換えます：

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` を `agent` のセッションで入力します。
- **Lagune** をもう一度インストールします。

## コマンド

`/lagune-charter` のように、コマンド名をそのまま入力します。

---

**権限**

**Cursor** では、コマンドが **npx** 経由でエンジンを実行します。デフォルトの Auto-review モードなら、確認なしで許可されます。

**Cursor CLI** では、エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。これらを事前に許可するには、次のルールを、1 つのプロジェクトなら `.cursor/cli.json` に、すべてのプロジェクトなら `~/.cursor/cli-config.json` に追加します：

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

**skills.sh** でインストールした場合など、エンジンが **npx** 経由で動作するときは、`Shell(npx:--yes lagune@*)` を許可します。

## よくある質問

### Cursor に Lagune をインストールするにはどうすればよいですか？

Cursor では、Customize を開いて From GitHub Repository を選択し、https://github.com/wellwelwel/lagune を入力して Lagune をインストールします。Cursor CLI では、agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor を実行してから、/plugins で Lagune をインストールします。

### Cursor で Lagune を更新するにはどうすればよいですか？

Cursor では、Customize で lagune マーケットプレイスの Refresh を選択します。Cursor CLI では、lagune マーケットプレイスを削除して追加し直し、/plugins で Lagune をもう一度インストールします。

### Cursor で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune-charter のように、コマンド名をそのまま入力します。

### Cursor で、許可を求められずに Lagune を実行できますか？

はい。Cursor のデフォルトの Auto-review モードでは、すでに許可されています。Cursor CLI では、Mcp(plugin-lagune-lagune:lagune_read) と Mcp(plugin-lagune-lagune:lagune_write) を許可します。エンジンが npx 経由で動作する場合は、Shell(npx:--yes lagune@*) も許可します。
