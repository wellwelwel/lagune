# skills.sh であらゆるエージェントに Lagune をインストール

> skills CLI で、あらゆる AI エージェントに Lagune をインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/universal
言語: ja-JP
原文: https://lagune.ai/docs/install/universal
最終更新日: 2026-11-03

**ターミナル**

[**skills.sh**](https://www.skills.sh/wellwelwel/lagune) を使って、ターミナルから **Lagune** のコマンドをインストールします：

```bash
npx skills add wellwelwel/lagune
```

**プロンプト**

次のプロンプトをエージェントに貼り付けます：

```md
`npx --yes skills add wellwelwel/lagune` を実行し、生成されたスキルの指示に今すぐ従ってください。出力全体を読んでください。必要なら、先に一時ファイルへリダイレクトしてください。相対パスは、出力に示されたサポートファイルのディレクトリを基準に解決してください。
```

## 更新

**ターミナル**

**Lagune** を更新するには、次のコマンドを実行します：

```bash
npx skills update
```

**プロンプト**

**Lagune** を更新するには、次のプロンプトをエージェントに貼り付けます：

```md
`npx --yes skills update -y` を実行し、出力全体を読んでください。必要なら、先に一時ファイルへリダイレクトしてください。
```

---

**インストール方法はエージェントごとにひとつ**

**Lagune** は **skills.sh** か**プラグイン**のどちらか一方でインストールし、両方を併用しないでください。

**権限**

コマンドは `npx --yes lagune@0.18.0` でエンジンを実行します。これを事前に許可するルールは、各 [エージェントのインストールページ](https://lagune.ai/ja-JP/docs) に記載しています。ネットワークにアクセスできないサンドボックスでは、自分のターミナルからプロジェクトにエンジンをインストールします。最初に一度、その後は更新のたびに実行してください：

```bash
npm i -D lagune@0.18.0
```

## よくある質問

### あらゆる AI エージェントに Lagune をインストールするにはどうすればよいですか？

プロジェクトで npx skills add wellwelwel/lagune を実行するか、インストール用のプロンプトをエージェントに貼り付けます。

### skills CLI でインストールした Lagune を更新するにはどうすればよいですか？

npx skills update を実行するか、更新用のプロンプトをエージェントに貼り付けます。

### skills CLI とプラグインの両方で Lagune をインストールできますか？

いいえ。両方でインストールすると、エージェントがすべてのコマンドを重複して表示するか、片方だけを使ってもう片方を隠してしまいます。
