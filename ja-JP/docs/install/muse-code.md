# Muse Code に Lagune をプラグインとしてインストール

> Muse Code に Lagune をプラグインとしてインストールし、最新の状態に保ち、サンドボックス内でエンジンを実行します。

正規 URL: https://lagune.ai/ja-JP/docs/install/muse-code
言語: ja-JP
原文: https://lagune.ai/docs/install/muse-code
最終更新日: 2026-11-04

ターミナルからプラグインをインストールします：

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## 更新

**Lagune** を更新するには、マーケットプレイスを更新してからプラグインを再インストールします：

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## コマンド

`/lagune-charter` のようにコマンド名をそのまま入力するか、`/lagune:lagune-charter` のようにプラグイン名を付けて入力します。

---

**権限**

**Muse Code** のサンドボックスはエンジンをダウンロードできません。自分のターミナルからプロジェクトにエンジンをインストールします。最初に一度、その後は更新のたびに実行してください：

```bash
npm i -D lagune@0.17.0
```

## よくある質問

### Muse Code に Lagune をインストールするにはどうすればよいですか？

muse plugins marketplace add lagune wellwelwel/lagune を実行してから、muse plugins install lagune@lagune を実行します。

### Muse Code で Lagune を更新するにはどうすればよいですか？

muse plugins marketplace update lagune を実行してから、muse plugins remove lagune と muse plugins install lagune@lagune で再インストールします。

### Muse Code で Lagune のコマンドを実行するにはどうすればよいですか？

/lagune-charter のようにコマンド名をそのまま入力するか、/lagune:lagune-charter のようにプラグイン名を付けて入力します。

### Muse Code のサンドボックス内で Lagune は動作しますか？

はい。自分のターミナルから npm i -D lagune@0.17.0 を実行してプロジェクトにエンジンをインストールすれば動作します。最初に一度、その後は更新のたびに実行してください。
