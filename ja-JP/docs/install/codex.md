# Codex CLI に Lagune をプラグインとしてインストール

> Codex CLI に Lagune をプラグインとしてインストールし、最新の状態に保ち、サンドボックス内でエンジンを実行します。

正規 URL: https://lagune.ai/ja-JP/docs/install/codex
言語: ja-JP
原文: https://lagune.ai/docs/install/codex
最終更新日: 2026-11-07

ターミナルからプラグインをインストールします：

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## 更新

**Lagune** を更新するには、次のコマンドを実行します：

```bash
codex plugin marketplace upgrade lagune
```

## コマンド

`$` に続けてプラグイン名付きのコマンドを入力し、そのあとに入力内容を書きます。たとえば `$lagune:lagune-charter` で `/lagune-charter` を実行します。`$` と入力するとコマンドの一覧が表示され、選ぶと完全な名前が挿入されます。

---

**サンドボックス**

**Codex** のサンドボックスはネットワークにアクセスできません。自分のターミナルからプロジェクトにエンジンをインストールします。最初に一度、その後は更新のたびに実行してください：

```bash
npm i -D lagune@0.18.1
```

## よくある質問

### Codex CLI に Lagune をインストールするにはどうすればよいですか？

codex plugin marketplace add wellwelwel/lagune を実行してから、codex plugin add lagune@lagune を実行します。

### Codex CLI で Lagune を更新するにはどうすればよいですか？

codex plugin marketplace upgrade lagune を実行します。

### Codex CLI で Lagune のコマンドを実行するにはどうすればよいですか？

$lagune:lagune-charter のように、$ に続けてプラグイン名付きのコマンドを入力し、そのあとに入力内容を書きます。

### Codex のサンドボックス内で Lagune は動作しますか？

はい。自分のターミナルから npm i -D lagune@0.18.1 を実行してプロジェクトにエンジンをインストールすれば動作します。最初に一度、その後は更新のたびに実行してください。
