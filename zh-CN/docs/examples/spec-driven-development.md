# Spec-Driven Development：保护规范构建出的代码

> 把 Lagune 与 Superpowers、Spec Kit 或 OpenSpec 搭配使用：根据你的规范设定安全原则，再用 /lagune 实现它，让每项任务在编写代码的同时得到加固。

规范链接: https://lagune.ai/zh-CN/docs/examples/spec-driven-development
语言: zh-CN
原文: https://lagune.ai/docs/examples/spec-driven-development
最后更新: 2026-11-09

把 **Lagune** 与 Spec-Driven Development 工具搭配使用，例如 [**Superpowers**](https://github.com/obra/superpowers)、[**Spec Kit**](https://github.com/github/spec-kit) 或 [**OpenSpec**](https://github.com/Fission-AI/OpenSpec)：由你的工具决定构建什么，由 **Lagune** 决定如何保证它的安全。

## 搭配方式

**Lagune** 在两个环节加入你的工具流程，其余部分保持不变：

1. 你的工具写好规范后，[`/lagune-charter`](https://lagune.ai/zh-CN/docs/commands/charter) 会读取它，在还没有任何代码之前，就设定好该功能所需的安全原则。
2. 把 [`/lagune`](https://lagune.ai/zh-CN/docs/commands/lagune) 标记在你的工具的实现命令上，它会在编写代码的同时，按照这些原则加固每项任务。

**提示**

把每个示例中的规范路径替换为你的工具写出的文件。如果项目已经有安全原则，同一步骤会按新功能的需要更新它们。

## 提示词示例

按顺序发送这些提示词，每条都等上一条完成后再发送。

```prompt
/superpowers:brainstorming 支持银行卡支付的访客结账。
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
/speckit.specify 支持银行卡支付的访客结账。
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
