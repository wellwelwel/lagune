# Lagune 术语表：SDH、charter、发现项与控制措施

> Lagune 与 Security-Driven Hardening 全部术语的通俗定义：SDH、charter、detect、发现项、控制措施、harden、verify、结案、可结案性、专项、类别与目录。

规范链接: https://lagune.ai/zh-CN/docs/references/glossary
语言: zh-CN
原文: https://lagune.ai/docs/references/glossary
最后更新: 2026-11-04

这里用通俗的语言定义 Lagune 和 Security-Driven Hardening 方法论中的每个核心术语，每个术语只定义一次。

### Security-Driven Hardening (SDH)

Lagune 所实现的方法论：一种场景感知的 Blue Team 约定，先检测系统所处的场景，再研判这一场景带来的风险，并指导修复。安全知识存在于规范及其按需加载的专项中，因此开发者和非开发者都通过同一套流程获得支持。

### Lagune

SDH 的参考实现：九个智能体命令，每个命令都配有它要填写的模板，由 AI 智能体运行，用来加固代码库。各个智能体可以通过自己的插件安装器或 [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) 安装这些命令，具体见 [安装页面](https://lagune.ai/zh-CN/docs)。每个确定性步骤都由这些命令交给 Lagune 的引擎执行。

### Charter（安全原则）

Lagune 的治理层：一组安全优先的原则，之后的每个阶段都必须遵守。可以把它看作项目安全态势的编译期检查。它保存在 `.lagune/memory/charter.md`。

### 开发流程

通用命令 `/lagune`，在编写的同时加固工作成果。它接受任何阶段的任何提示词，构建你要求的内容，并在交还之前用安全的默认设置加固它，如果项目已有安全原则，还会以它为指引。它不会向 Lagune 的追踪写入任何内容，因此它唯一的产出就是加固后的代码。它与事前制定的安全原则、事后的 Blue Team 流程一起，构成了 Lagune 在构建期间的防护。

### Blue Team 流程

Lagune 核心的五阶段审计：charter、detect、plan、harden、verify。每个阶段都建立在前一个阶段之上。"Blue Team" 指安全领域中防御者的传统，与负责进攻的 Red Team 相对。

### 发现项（Finding）

一个检测到的风险。每个发现项都会说明它是什么、为什么重要，并附上代码中的证据。发现项是 plan、harden 和 verify 一路沿用的唯一追踪单元，在每个产物中都通过名称来识别。

### 控制措施（Control）

为关闭某个风险而应用的安全措施。harden 负责应用控制措施，verify 负责证明它们确实有效。Lagune 绝不会为了满足某个提示词而削弱控制措施。

### Detect

读取代码、梳理系统在做什么以及风险在哪里的阶段。它的核心准则是只检测，不编造：只记录代码能够佐证的内容。

### Harden

唯一会改动你代码的阶段。它一次应用计划中的一项修复，并把每项记录为 Applied、Partial 或 Blocked。Applied 并不代表已经得到证明。

### Verify

通过读取代码并与 harden 的记录相对照，证明每项已应用的修复确实有效的阶段。它会给出三种判定结果之一：Risk closed、Risk not closed 或 Cannot tell from the code。

### 结案（Stand down）

当 verify 证明某个风险已关闭时，对应的发现项就会结案：经你确认后，从整条链路中移除，不再被重复处理。

### 可结案性（Closability）

安全工作拥有终态的特性。由于已证明关闭的发现项会结案，流程可以进入静止状态，只有代码发生变化时才会重新开启。SDH 是可结案的，而不是一个无尽的循环。

### 引擎（Engine）

**npm** 上的 `lagune` 包，命令的每个确定性步骤都通过 `npx` 运行它：hook、目录和类别。

### 专项（Specialization）

一个聚焦且与编程语言无关的安全知识模块，只会按需加载，绝不默认加载。专项不是命令。你可以用引擎的 `read catalog <name>` 把某个专项加载到任意提示词中，例如 `npx lagune read catalog regex`。

### 类别（Category）

一组有名称的内置专项，从 `owasp` 到按语言划分的类别，例如 `javascript`、`python`、`go` 和 `rust`。项目所用的类别记录在 `.lagune/configs.json` 中，决定哪些内置专项会加入它的目录。在没有记录任何类别时，项目只使用 `owasp`。

### 目录（Catalog）

项目使用的专项集合：其类别中的内置专项，加上用 `/lagune-specialize` 编写的自有专项。引擎的 `read catalog` 会列出目录，各阶段则把它与代码相匹配。

### 按需提示词（Prompt-on-demand）

一项原则：根据项目的实际情况引入相关的安全知识，而不是默认运行所有检查。

### 名称即身份（Identity-by-name）

Lagune 的追踪模型：每个发现项的名称在每个产物中都以完全相同的写法作为章节标题，在整条链路中就是它的身份。追踪映射（`.lagune/tracking.json`）只保存追踪信息，从不保存说明文字。

## 常见问题

### Security-Driven Hardening（SDH）是什么？

SDH 是一种场景感知的 Blue Team 安全方法论。它先检测系统所处的场景，再研判这一场景带来的风险，并指导修复，每个发现项都用通俗的语言表述。Lagune 是它的参考实现。

### Lagune 里的 charter 是什么？

charter 是 Lagune 的治理层，即一组安全优先的原则，之后的每个阶段都必须遵守。它保存在 .lagune/memory/charter.md。

### 把发现项结案是什么意思？

当 verify 证明某个风险已关闭时，对应的发现项就会结案：经你确认后从整条链路中移除，不再被重复处理。
