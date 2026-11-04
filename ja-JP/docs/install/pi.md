# Pi に Lagune をパッケージとしてインストール

> npm または GitHub から、Pi に Lagune をパッケージとしてインストールし、最新の状態に保ちます。

正規 URL: https://lagune.ai/ja-JP/docs/install/pi
言語: ja-JP
原文: https://lagune.ai/docs/install/pi
最終更新日: 2026-11-04

**npm**

ターミナルからパッケージをインストールします：

```bash
pi install npm:lagune
```

**GitHub**

**GitHub** から最新のコミットをインストールします。この場合、エンジンは **npx** 経由で動作します：

```bash
pi install git:github.com/wellwelwel/lagune
```

## 更新

**npm**

**Lagune** を更新するには、次のコマンドを実行します：

```bash
pi update npm:lagune
```

**GitHub**

**Lagune** を更新するには、次のコマンドを実行します：

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` はインストールしたすべてのパッケージを更新します。`pi update` だけでは **Pi** しか更新されません。

## コマンド

コマンドは `skill:` プレフィックスを付けて入力します。たとえば `/skill:lagune-charter` で `/lagune-charter` を実行します。

## よくある質問

### Pi に Lagune をインストールするにはどうすればよいですか？

pi install npm:lagune を実行します。GitHub の最新コミットをインストールするなら、pi install git:github.com/wellwelwel/lagune を実行します。

### Pi で Lagune を更新するにはどうすればよいですか？

pi update npm:lagune を実行します。GitHub からインストールした場合は、pi update git:github.com/wellwelwel/lagune を実行します。pi update --extensions は、インストールしたすべてのパッケージを更新します。

### Pi で Lagune のコマンドを実行するにはどうすればよいですか？

/skill:lagune-charter のように、skill: プレフィックスを付けて入力します。
