# Spec-Driven Development：仕様から作るコードを安全に

> Lagune を Superpowers、Spec Kit、OpenSpec と組み合わせて使います。仕様からセキュリティ原則を定め、/lagune で実装すれば、コードを書く段階で各タスクが堅牢化されます。

正規 URL: https://lagune.ai/ja-JP/docs/examples/spec-driven-development
言語: ja-JP
原文: https://lagune.ai/docs/examples/spec-driven-development
最終更新日: 2026-11-09

**Lagune** を [**Superpowers**](https://github.com/obra/superpowers)、[**Spec Kit**](https://github.com/github/spec-kit)、[**OpenSpec**](https://github.com/Fission-AI/OpenSpec) などの Spec-Driven Development ツールと組み合わせて使います：何を作るかはツールが決め、それをどう安全に保つかは **Lagune** が決めます。

## 組み合わせ方

**Lagune** はツールのフローの 2 か所に加わり、それ以外は変えません：

1. ツールが仕様を書き上げたら、[`/lagune-charter`](https://lagune.ai/ja-JP/docs/commands/charter) がそれを読み、コードがまだ存在しないうちに、その機能に必要なセキュリティ原則を定めます。
2. ツールの実装コマンドに [`/lagune`](https://lagune.ai/ja-JP/docs/commands/lagune) を付けると、コードを書くそばから、それらの原則に沿って各タスクを堅牢化します。

**ヒント**

各例の仕様のパスは、ツールが書き出したファイルに置き換えてください。プロジェクトにすでにセキュリティ原則がある場合は、同じ手順で新しい機能に必要な内容に更新されます。

## プロンプト例

プロンプトは順番に、前のプロンプトが終わるのを待ってから 1 つずつ送ってください。

```prompt
/superpowers:brainstorming カード決済に対応したゲスト購入。
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify カード決済に対応したゲスト購入。
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
