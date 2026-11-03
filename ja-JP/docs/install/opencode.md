# OpenCode に Lagune をプラグインとしてインストール

> OpenCode 1.x と 2.x に Lagune をプラグインとしてインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/opencode
言語: ja-JP
原文: https://lagune.ai/docs/install/opencode
最終更新日: 2026-11-03

**OpenCode 2.x**

ターミナルからプラグインをインストールします：

```bash
opencode plugin add lagune
```

または、`plugins` リスト（`opencode.json` 内）に追加します：

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

ターミナルからプロジェクトにプラグインをインストールします。すべてのプロジェクトにインストールするには `-g` を付けます：

```bash
opencode plugin lagune
```

または、`plugin` リスト（`opencode.json` 内）に追加します：

```json
{
  "plugin": ["lagune"]
}
```

## 更新

**OpenCode 2.x**

**Lagune** を更新するには、次のコマンドを実行します：

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

**Lagune** を更新するには、新しいリリースを上書きインストールします。すべてのプロジェクトにインストールした場合は `-g` を付けます：

```bash
opencode plugin lagune@0.16.0 --force
```

## コマンド

**OpenCode 2.x**

`@` と入力して `@lagune-charter` などのコマンドを選び、同じメッセージに続けて入力内容を書きます。

**OpenCode 1.x**

`/lagune-charter` のように、コマンド名をそのまま入力します。コマンドは `/skills` に一覧表示され、`/` メニューには表示されません。

---

**権限**

エンジンは 2 つのツールで動作します。`lagune_read` はプロジェクトを読み取るだけで、`lagune_write` は `.lagune/` に書き込むだけです。**OpenCode** は確認なしでこれらを実行します。

## よくある質問

### OpenCode に Lagune をインストールするにはどうすればよいですか？

OpenCode 2.x では、opencode plugin add lagune を実行します。OpenCode 1.x では、opencode plugin lagune を実行します。すべてのプロジェクトにインストールするには -g を付けます。

### OpenCode で Lagune を更新するにはどうすればよいですか？

OpenCode 2.x では、opencode plugin update lagune を実行してから opencode reload を実行します。OpenCode 1.x では、opencode plugin lagune@0.16.0 --force を実行します。

### OpenCode で Lagune のコマンドを実行するにはどうすればよいですか？

OpenCode 2.x では、@ と入力して @lagune-charter などのコマンドを選び、同じメッセージに続けて入力内容を書きます。OpenCode 1.x では、/lagune-charter のようにコマンド名をそのまま入力するか、/skills から探します。

### OpenCode は Lagune の実行前に許可を求めますか？

いいえ。OpenCode は、エンジンの 2 つのツールである lagune_read と lagune_write を確認なしで実行します。
