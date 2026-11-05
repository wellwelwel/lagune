# 設定スキーマ

> Lagune プロジェクトの設定ファイルに使う JSON Schema です。エディターでの自動補完と検証に使え、最新の Lagune に追従させることも、特定のバージョンに固定することもできます。

正規 URL: https://lagune.ai/ja-JP/docs/references/configs-schema
言語: ja-JP
原文: https://lagune.ai/docs/references/configs-schema
最終更新日: 2026-11-05

`.lagune/configs.json` は、プロジェクトが使う [**カテゴリ**](https://lagune.ai/ja-JP/docs/categories) を記録し、プロジェクト独自の [**専門知識**](https://lagune.ai/ja-JP/docs/catalog) の索引を持ち、[**チェッカー**](https://lagune.ai/ja-JP/docs/hooks/configure) がスキャンから除外するものを決めるファイルです。この JSON Schema を使うと、ファイルを編集している間、エディターが各フィールドを自動補完し、タイプミスや存在しないカテゴリを指摘してくれます。

## 最新のスキーマ

**Lagune** はこのファイルを書き込むとき、`$schema` が見つからなければ、ファイルが最新のスキーマを指すように設定します：

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

このアドレスは常に最新の **Lagune** に追従します。**Lagune** 0.16.0 より前に書かれたファイルには次に変更されるときに追加され、それまではどのフェーズもそのことを知らせます。

## バージョンを固定する

0.16.0 以降の **Lagune** の各リリースには、そのバージョン時点のスキーマが含まれており、**npm** で公開され、**jsDelivr** から配信されます。バージョンを固定するには、`lagune@` の後ろにバージョンを書いたアドレスを `$schema` に指定します：

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

バージョンには任意の semver 範囲を指定できます：

| バージョン             | スキーマ                        |
| ---------------------- | ------------------------------- |
| `0.16.0`               | 0.16.0 のスキーマ               |
| `0.16.x` または `0.16` | 0.16 系の最新リリースのスキーマ |
| `0.x` または `0`       | 0.x 系の最新リリースのスキーマ  |
| `latest`               | 最新リリースのスキーマ          |

## よくある質問

### Lagune の動作にスキーマは必要ですか？

いいえ。スキーマはエディターを補助するだけで、$schema があってもなくても、Lagune はファイルを同じように読み込みます。

### Lagune は固定したスキーマを上書きしますか？

いいえ。Lagune が $schema を書き込むのはファイルにまだない場合だけで、設定済みのアドレスはそのまま残します。

### どんなときにバージョンを固定すべきですか？

プロジェクトで特定のバージョンの Lagune を使っているときです。そうすれば、エディターはそのバージョンが受け付ける内容に照らしてファイルを検証します。
