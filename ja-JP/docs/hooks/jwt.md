# jwt フック：アルゴリズムを固定していない JWT 検証を検出する

> コマンドラインから、アルゴリズムを固定していない JWT 検証をコードベース全体でスキャンしたり、1 つの呼び出しを判定したりできます。

正規 URL: https://lagune.ai/ja-JP/docs/hooks/jwt
言語: ja-JP
原文: https://lagune.ai/docs/hooks/jwt
最終更新日: 2026-11-05

`jwt` フックは、**アルゴリズムを固定していない JWT 検証**と、**検証そのものを無効にしている箇所**を指摘します。前者は、検証側がトークン自身の `alg` ヘッダーを信頼してしまうアルゴリズム混同の穴です。**言語を識別**して動作し、各ファイルをそのファイルが使う JWT ライブラリに合わせて読み取ります。また、[`federation` 専門知識](https://lagune.ai/ja-JP/docs/catalog) を支える決定論的なエンジンでもあり、**scan** モードまたは **check** モードで自分で実行することもできます。

## 実行方法

**コードベースをスキャン**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**呼び出しをチェック**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

**Unpinned JWT verification found** の下に並ぶ各行は、`algorithms` の許可リストを設定していない（ライブラリが必要とする場合）、安全でない許可リストを受け入れている（`none`、または非対称アルゴリズムと HMAC の混在）、あるいは署名の検証を完全に無効にしているために、トークン自身の `alg` を信頼してしまう検証呼び出しです。これは確定したリスクの露出なので、フックは 0 以外の終了コードで終了します。何も見つからなければ `no unpinned JWT verification found` と出力します。

## 判定の読み方

| 判定       | 意味                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `unpinned` | アルゴリズムの許可リストがない（必要な場合）、許可リストが安全でない、または検証が無効になっている検証呼び出し。 |
| `safe`     | 適切なアルゴリズムの許可リストで固定している、またはライブラリが暗黙的に固定している検証呼び出し。               |
| `invalid`  | 判定できる検証呼び出しがコードスニペットに見当たらない。                                                         |

### CLI オプション

| オプション  | 値               | 説明                                                                                                     |
| ----------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| `--pattern` | コードスニペット | 1 つの呼び出しをチェックする。繰り返し指定すると複数をチェックし、1 行に 1 つずつ判定を出力する。        |
| `--lang`    | 言語             | `--pattern` を使うときは必須：javascript、python、go、java、kotlin、php、ruby、rust、csharp のいずれか。 |
| `--dir`     | ディレクトリ     | スキャン対象をディレクトリに絞る。繰り返し指定でき、`--file` と併用できる。                              |
| `--file`    | ファイル         | スキャン対象を 1 つのファイルに絞る。繰り返し指定でき、`--dir` と併用できる。                            |

オプションを指定しなければ、プロジェクト全体をスキャンします。`--pattern` には `--lang` が必要で、`--dir` や `--file` とは併用できません。

### スキャン対象を選ぶ

**Git** が無視するものはスキャンしません。さらに除外したいときや、**Git** が無視するものもスキャンしたいときは、`jwt` フック専用の設定を指定します：

```bash
npx lagune write add --ignore test/fixtures --checker jwt
```

```json
{
  "checkers": {
    "jwt": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

すべての設定項目は [フックの設定](https://lagune.ai/ja-JP/docs/hooks/configure) で説明しています。

### 対応言語

スキャンはファイル拡張子をもとに、次のライブラリを読み取ります。ライブラリによってはアルゴリズムを暗黙的に固定する（明示的なリストがなくても安全な）ため、"許可リストなし ⇒ unpinned" というルールは、明示的なリストを前提とするライブラリにだけ適用されます。そのため、正しく設定された呼び出しが指摘されることはありません。

| 言語                        | ライブラリ              | 許可リストなしを unpinned として指摘するか                               | 常に指摘するもの                                |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken、jose      | はい                                                                     | `none`、非対称アルゴリズムと HMAC の混在        |
| **Python**                  | PyJWT、python-jose      | はい（PyJWT は指定が必須、python-jose はデフォルトが `algorithms=None`） | `none`、`verify_signature: False`               |
| **Go**                      | golang-jwt              | はい（`WithValidMethods` がない場合）                                    | `none`、`ParseUnverified`                       |
| **Ruby**                    | ruby-jwt                | はい                                                                     | `none`、`verify = false`                        |
| **Java / Kotlin**           | jjwt、nimbus            | いいえ（鍵から導出）                                                     | `none`、署名なし/`unsecured` のパーサー         |
| **PHP**                     | firebase/php-jwt        | いいえ（`Key` がアルゴリズムを保持）                                     | `none`                                          |
| **Rust**                    | jsonwebtoken            | いいえ（`Validation` が指定を必須とする）                                | `none`、`insecure_disable_signature_validation` |
| **C#**                      | Microsoft.IdentityModel | いいえ（パラメーターが複数行にまたがる）                                 | `none`、`RequireSignedTokens = false`           |

**ヒント**

フックが判定するのはアルゴリズムの固定だけで、クレーム、鍵、フローのチェックといった判断は、引き続き [`federation` 専門知識](https://lagune.ai/ja-JP/docs/catalog) が担います。

## よくある質問

### JWT のアルゴリズム混同とは何ですか？

トークンのヘッダーからアルゴリズムを読み取る検証処理では、攻撃者が RS256 を HS256 にすり替え、公開鍵で署名できてしまいます。適切なアルゴリズムの許可リストをコードで固定すれば防げます。jwt フックは、許可リストを設定していない、または安全でない許可リストを使っている検証呼び出しを指摘します。
