# /lagune-detect: 摸清你的系统和它的风险

> 读取你的代码，梳理系统在做什么、风险在哪里。

规范链接: https://lagune.ai/zh-CN/docs/commands/detect
语言: zh-CN
原文: https://lagune.ai/docs/commands/detect
最后更新: 2026-11-04

🔬 弄清你的系统到底在做什么，风险又在哪里。

detect 会读取代码，只记录实际发现的内容，并附上后续阶段需要的证据。它的核心准则是只检测，不编造。

## 如何使用

**全面扫描**

```prompt
/lagune-detect
```

**指定路径**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**描述关注点**

```prompt
/lagune-detect 确保客户数据绝不会泄露
```

## 它会梳理什么

**Lagune** 会读取代码，梳理它发现的内容。每个发现项都会说明它是什么、为什么重要，并附上证据。例如：

- **文件上传**，系统会接收用户上传的文件：
  - _为什么重要_：伪装成图片的文件可能藏有恶意代码。
  - _证据_：`POST /upload` 的 handler 直接信任客户端发送的 MIME 类型，没有检查文件的真实类型。
- **登录与会话**，用户登录后才能访问自己的账户：
  - _为什么重要_：会话处理薄弱时，账户可能被他人接管。
  - _证据_：会话签发逻辑签发的会话没有设置过期时间。

在这个过程中，detect 会对照代码，为项目 [目录](https://lagune.ai/zh-CN/docs/catalog) 中的每个专项给出判定结果，应用其上下文在代码中确实存在的专项，并把它们记录在 **Applied specializations** 下，这份列表会被 harden 和 verify 复用。

这样，你就有了一张清晰的地图，标明系统在做什么、风险在哪里，后续步骤可以直接据此行动。

**提示**

- 再次运行会更新地图：已解决的发现项会移除，新的发现项会加入。
- detect 地图保存在 `.lagune/memory/detect.md`。

## 下一步

把地图变成计划：[`/lagune-plan`](https://lagune.ai/zh-CN/docs/commands/plan)。

## 常见问题

### /lagune-detect 是做什么的？

它会读取你的代码，梳理系统在做什么、风险在哪里，并且只记录实际发现的内容。它的准则是只检测，不编造。

### Lagune 里的发现项是什么？

发现项是检测到的一个风险，说明它是什么、为什么重要，并附上代码中的证据。它是 plan、harden 和 verify 一路沿用的追踪单元。

### detect 地图存放在哪里？

存放在 .lagune/memory/detect.md。

### detect 会用到哪些专项？

项目目录中的每个专项都会对照代码得到判定结果。detect 会应用其上下文在代码中确实存在的专项，并把它们记录在 Applied specializations 下。
