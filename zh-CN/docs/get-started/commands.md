# AI 智能体的安全 Skills

> Lagune 为你的 AI 智能体解锁的 Skills：审计现有项目，或在构建时保障新代码的安全，全部遵循 charter 设定的安全原则。

规范链接: https://lagune.ai/zh-CN/docs/get-started/commands
语言: zh-CN
原文: https://lagune.ai/docs/get-started/commands
最后更新: 2026-11-05

[安装](https://lagune.ai/zh-CN/docs) **Lagune** 之后，你的 **AI** 智能体就会解锁一组 Skills。它们有两种用法，都遵循**安全原则**：一边构建一边保障新代码的安全，或者对整个项目运行完整审计。

**⌨️ 构建 / 开发**

你不必等工作做完才去保障安全。你**此刻**在写的内容，就交给 [**`/lagune`**](https://lagune.ai/zh-CN/docs/commands/lagune)：

| Skill                                         | 它能为你做什么                                        |
| --------------------------------------------- | ----------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/zh-CN/docs/commands/charter) | 设定项目的安全规则，也就是 `/lagune` 构建时依据的基础 |
| [**/lagune**](https://lagune.ai/zh-CN/docs/commands/lagune)          | 按你的要求构建，并在安全原则的指引下边写边加固        |

**随时可用**

[**`/lagune`**](https://lagune.ai/zh-CN/docs/commands/lagune) 每次运行都会遵守你的安全原则。它接受任何提示词，按你的要求构建，并在构建过程中就用安全的默认设置加固，而不是事后再补。

---

#### 特殊 Skills

| Skill                                               | 作用                                                           |
| --------------------------------------------------- | -------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/zh-CN/docs/commands/specialize) | 根据文章、漏洞利用代码或主题，教会 **Lagune** 一个新的安全专项 |

**🔬 审计：Blue Team 流程**

完整的 **Blue Team 流程**：读懂项目在做什么，梳理它的风险，再逐一消除。每一步都建立在上一步的基础上，所以照着列表从上往下做就够了：

| #   | Skill                                         | 它能为你做什么                                             |
| --- | --------------------------------------------- | ---------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/zh-CN/docs/commands/charter) | 设定项目的安全规则，可以由它为你提议，也可以按你的想法来定 |
| 2   | [**/lagune-detect**](https://lagune.ai/zh-CN/docs/commands/detect)   | 读取你的代码，梳理系统在做什么、风险在哪里                 |
| 3   | [**/lagune-plan**](https://lagune.ai/zh-CN/docs/commands/plan)       | 把 detect 的发现转化为防御计划，为每个发现项配上修复       |
| 4   | [**/lagune-harden**](https://lagune.ai/zh-CN/docs/commands/harden)   | 把计划中的修复安全地、逐项应用到你的代码中                 |
| 5   | [**/lagune-verify**](https://lagune.ai/zh-CN/docs/commands/verify)   | 证明每项已应用的修复确实有效，并将有效的发现项结案         |

---

#### 特殊 Skills

| Skill                                               | 作用                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/zh-CN/docs/commands/specialize) | 根据文章、漏洞利用代码或主题，教会 **Lagune** 一个新的安全专项   |
| [**/lagune-prove**](https://lagune.ai/zh-CN/docs/commands/prove)           | 把每个检测到的发现项转化为可运行、仅限防御的证明，用于负责任披露 |

---

#### 内部 Skills

| Skill                                       | 作用                       |
| ------------------------------------------- | -------------------------- |
| [**/lagune-repair**](https://lagune.ai/zh-CN/docs/commands/repair) | 修复 **Lagune** 的内部追踪 |

**提示**

安全不是成本，而是投资：前期投入的每一分，都会在那些从未发生的安全事件中成倍省回来 🙋🏻‍♂️

## 常见问题

### Lagune 提供了哪些 Skills？

/lagune 用于边构建边加固，还有五阶段的 Blue Team 审计流程：/lagune-charter、/lagune-detect、/lagune-plan、/lagune-harden、/lagune-verify。此外还有 /lagune-specialize 和 /lagune-prove。

### 什么是 Lagune 的 Blue Team 流程？

一套分五个阶段的审计：charter（设定规则）、detect（梳理风险）、plan（评分并规划修复）、harden（应用修复）、verify（证明修复有效并结案）。

### /lagune 和审计流程有什么区别？

/lagune 在你编写新代码时就保障它的安全，无需遵循任何流程。审计流程则对现有项目按顺序运行五个阶段。
