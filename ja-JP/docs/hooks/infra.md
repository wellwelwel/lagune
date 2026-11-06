# infra フック：IaC の設定ミスを検出する

> コマンドラインから、Terraform、Dockerfile、GitHub Actions の設定ミスをスキャンしたり、1 つのコードスニペットを判定したりできます。

正規 URL: https://lagune.ai/ja-JP/docs/hooks/infra
言語: ja-JP
原文: https://lagune.ai/docs/hooks/infra
最終更新日: 2026-11-04

`infra` フックは、インターネット全体に開放されたネットワーク、ワイルドカードの権限、マニフェスト内のシークレット、root で動くコンテナ、CI のシェルに渡る信頼できない値といった、ファイルだけで判定できる **IaC（Infrastructure as Code）の設定ミス**を指摘します。読み取るのは IaC ファイル（`.tf`/`.tf.json`/`.hcl`、`Dockerfile*`、`.github/workflows/**`）だけです。また、[`infra` 専門知識](https://lagune.ai/ja-JP/docs/catalog) を支える決定論的なエンジンでもあり、**scan** モードまたは **check** モードで動作します。

## 実行方法

**コードベースをスキャン**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**コードスニペットをチェック**

コードスニペットを `--pattern` で、その種類を `--kind`（`terraform`、`dockerfile`、`github-actions` のいずれか）で渡します。

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

スキャンは最大 2 つのセクションを出力します。**Infrastructure risks found** は判定可能な不備（機密性の高いポートへの `0.0.0.0/0` からのインバウンド許可、ワイルドカードを使った IAM ステートメント、マニフェスト内のシークレット、`encrypted = false`、バージョンが固定されていない git モジュール、明示的に root で動くイメージ、`curl | sh`、CI のスクリプトインジェクション、`permissions: write-all`）の一覧で、フックは 0 以外の終了コードで終了します。**Infrastructure hardening advisories** は終了コードを変えません（中身が変わりうるベースイメージのタグ、タグで固定したアクション）。何も見つからなければ `no infrastructure risks found` と出力します。

## 判定の読み方

check モードは、一致したタグのうち最も深刻度の高いもの（例：`public-ingress`、`iam-wildcard`、`root-user`、`curl-pipe`、`script-injection`、`write-all`）、推奨事項のタグ（`mutable-tag`、`unpinned-action`）、または `safe` を出力します。0 以外の終了コードで終了するのは、検出事項レベルの深刻度のタグだけです。

### CLI オプション

| オプション  | 値                                              | 説明                                                                                        |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--pattern` | コードスニペット                                | 1 つのコードスニペットをチェックする。`--kind` が必要。繰り返し指定で複数をチェックできる。 |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | コードスニペットをどの種類として判定するか。                                                |
| `--dir`     | ディレクトリ                                    | スキャン対象をディレクトリに絞る。繰り返し指定でき、`--file` と併用できる。                 |
| `--file`    | ファイル                                        | スキャン対象を 1 つのファイルに絞る。繰り返し指定でき、`--dir` と併用できる。               |

オプションを指定しなければ、プロジェクト内のすべての IaC ファイルをスキャンします。`--pattern` は `--dir` や `--file` とは併用できません。

### スキャン対象を選ぶ

**Git** が無視するものはスキャンしません。さらに除外したいときや、**Git** が無視するものもスキャンしたいときは、`infra` フック専用の設定を指定します：

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

すべての設定項目は [フックの設定](https://lagune.ai/ja-JP/docs/hooks/configure) で説明しています。

**ヒント**

フックが捉えるのは明白で判定可能なケースで、暗号化の設定漏れ、`pull_request_target` による露出、適切な IAM の範囲といった判断は、引き続き [`infra` 専門知識](https://lagune.ai/ja-JP/docs/catalog) が担います。

## よくある質問

### infra フックはどのインフラ関連ファイルを読み取りますか？

Terraform/HCL（.tf、.tf.json、.hcl）、Dockerfile、そして .github/ 配下にある GitHub Actions のワークフローとアクションの YAML です。ソースコード向けのスキャナーはこれらのファイルを読み飛ばしますが、このフックは読み取ります。
