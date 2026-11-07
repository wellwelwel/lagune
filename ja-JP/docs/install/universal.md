# skills.sh または GitHub CLI であらゆるエージェントに Lagune をインストール

> skills CLI または GitHub CLI で、あらゆる AI エージェントに Lagune をインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/universal
言語: ja-JP
原文: https://lagune.ai/docs/install/universal
最終更新日: 2026-11-07

**skills.sh**

インストールスコープは **Project** のままにして、[**skills.sh**](https://www.skills.sh/wellwelwel/lagune) でターミナルからプロジェクトに **Lagune** のコマンドをインストールします：

```bash
npx skills add wellwelwel/lagune --skill '*'
```

または、次のプロンプトをエージェントに貼り付けます：

```md
`npx --yes skills add wellwelwel/lagune` を実行し、生成されたスキルの指示に今すぐ従ってください。必要なら先に一時ファイルへリダイレクトして、出力全体を読んでください。相対パスは、出力に示されたサポートファイルのディレクトリを基準に解決してください。
```

**GitHub CLI**

[**GitHub CLI**](https://cli.github.com/) 2.90.0 以降を使って、ターミナルからプロジェクトに **Lagune** のコマンドをインストールします：

```bash
gh skill install wellwelwel/lagune --all --scope project
```

または、次のプロンプトをエージェントに貼り付けます：

```md
`gh skill install wellwelwel/lagune --all --scope project` を実行し、必要なら先に一時ファイルへリダイレクトして、出力全体を読んでください。
```

## 更新

**skills.sh**

**Lagune** を更新するには、次のコマンドを実行します：

```bash
npx skills update
```

または、次のプロンプトをエージェントに貼り付けます：

```md
`npx --yes skills update -y` を実行し、必要なら先に一時ファイルへリダイレクトして、出力全体を読んでください。
```

**GitHub CLI**

**Lagune** を更新するには、次のコマンドを実行します：

```bash
gh skill update --all
```

または、次のプロンプトをエージェントに貼り付けます：

```md
`gh skill update --all` を実行し、必要なら先に一時ファイルへリダイレクトして、出力全体を読んでください。
```

---

**サンドボックス**

ネットワークにアクセスできないサンドボックスでは、コマンドがエンジンをダウンロードできません。自分のターミナルからプロジェクトにエンジンをインストールします。最初に一度、その後は更新のたびに実行してください：

```bash
npm i -D lagune@0.18.1
```

## よくある質問

### あらゆる AI エージェントに Lagune をインストールするにはどうすればよいですか？

プロジェクトで npx skills add wellwelwel/lagune --skill '*' または gh skill install wellwelwel/lagune --all --scope project を実行するか、インストール用のプロンプトをエージェントに貼り付けます。

### あらゆる AI エージェントで Lagune を更新するにはどうすればよいですか？

skills.sh でインストールした場合は npx skills update を、GitHub CLI でインストールした場合は gh skill update --all を実行します。更新用のプロンプトをエージェントに貼り付けることもできます。

### 複数の方法で Lagune をインストールできますか？

いいえ。2 つの方法でインストールすると、エージェントがすべてのコマンドを重複して表示するか、片方だけを使ってもう片方を隠してしまいます。
