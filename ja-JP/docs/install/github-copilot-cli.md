# GitHub Copilot CLI に Lagune をプラグインとしてインストール

> GitHub Copilot CLI に Lagune をプラグインとしてインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/github-copilot-cli
言語: ja-JP
原文: https://lagune.ai/docs/install/github-copilot-cli
最終更新日: 2026-11-03

ターミナルからプラグインをインストールします：

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

エディターでは、[**skills.sh**](https://lagune.ai/ja-JP/docs/install/universal) を使って **GitHub Copilot** 用に **Lagune** をインストールします。

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

## コマンド

`/lagune-charter` のように、コマンド名をそのまま入力します。

## よくある質問

### GitHub Copilot CLI に Lagune をインストールするにはどうすればよいですか？

copilot plugin marketplace add wellwelwel/lagune を実行してから、copilot plugin install lagune@lagune を実行します。

### GitHub Copilot CLI で Lagune を更新するにはどうすればよいですか？

copilot plugin marketplace update lagune を実行してから、copilot plugin update lagune@lagune を実行します。

### GitHub Copilot CLI で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune-charter のように、コマンド名をそのまま入力します。

### VS Code の GitHub Copilot で Lagune を使えますか？

はい。VS Code などのエディターでは、プラグインではなく skills.sh で Lagune をインストールします。
