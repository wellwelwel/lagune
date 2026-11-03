# /lagune-plan: 为发现项评分并规划修复

> 把 detect 的发现转化为防御计划，用类别和 CVSS v4.0 评分为每个发现项定级，并为它配上修复。

规范链接: https://lagune.ai/zh-CN/docs/commands/plan
语言: zh-CN
原文: https://lagune.ai/docs/commands/plan
最后更新: 2026-11-03

🛡️ 把 detect 的发现转化为防御计划：用类别和 CVSS v4.0 评分为每个发现项定级，再为它配上要应用的修复。

## 如何使用

**规划全部**

```prompt
/lagune-plan
```

**指定路径**

```prompt
/lagune-plan src/routes/upload.ts
```

**聚焦某个担忧**

```prompt
/lagune-plan 敏感数据可能在哪里泄露
```

## 工作原理

这个阶段承接 detect。detect 已经找出系统在做什么，以及每一处带来的风险，所以 plan 不会重复描述风险，而是评估它有多严重，并决定如何应对。plan 从不读取代码，这样每项修复都必须指向 detect 实际检测到的内容。它按 CVSS v4.0 方法为每个发现项定级：给出类别，根据 detect 和 charter 记录的信息推导出 CVSS v4.0 向量并交由 [`cvss` hook](https://lagune.ai/zh-CN/docs/hooks/cvss) 计算评分，再给出该评分落入的优先级区间。每项修复还会注明它遵循的 charter 原则。

例如：

- **文件上传**（优先级：**严重**）
  - _类别_：无限制文件上传（CWE-434）。
  - _CVSS_：CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N（9.3，严重）。
  - _为什么是这个优先级_：任何人都能通过互联网访问上传功能，而且它位于存放客户文件的服务器上。
  - _遵循_：III. 所有输入在验证之前都不可信。
  - _修复_：检查文件的真实类型和大小，保存时重命名，并把上传的文件存放在无法作为代码执行的位置。

这样，你就有了一份定好级、排好优先级的修复清单，每项修复都对应一个发现项，可以直接交给下一阶段应用。评分是计算出来的，绝非估计：向量以 Environmental 指标的形式记录项目的暴露程度和利害关系，任何人都可以把它粘贴到 FIRST 或 NVD 的计算器中，重新算出相同的评分。

**提示**

- 它完全建立在 detect 之上。如果 detect 从未梳理过某个文件或担忧，它会提示你先对其运行 `/lagune-detect`。
- 再次运行会更新计划：已完成的修复会移除，新的修复会加入。
- 防御计划保存在 `.lagune/memory/plan.md`。

**依赖 detect**

plan 只基于 [`/lagune-detect`](https://lagune.ai/zh-CN/docs/commands/detect) 已经梳理过的内容工作，所以请先运行 detect。

## 下一步

应用计划：[`/lagune-harden`](https://lagune.ai/zh-CN/docs/commands/harden)。

## 常见问题

### Lagune 如何给漏洞排优先级？

/lagune-plan 会用类别和由 cvss hook 计算的 CVSS v4.0 评分为每个发现项定级，再为它配上要应用的修复。

### Lagune 用的是 CVSS v4.0 吗？

是的。每个发现项都会得到一个 CVSS v4.0 向量和评分，由 cvss hook 按照与 FIRST 计算器相同的算法算出，所以任何人都可以把向量粘贴到那里，重新算出评分。

### plan 会读取我的代码吗？

不会。plan 从不读取代码，这样每项修复都必须指向 detect 实际检测到的内容。
