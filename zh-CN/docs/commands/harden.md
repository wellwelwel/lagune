# /lagune-harden: 为你的代码应用安全修复

> 把计划中的修复逐项应用到你的代码中，安全稳妥。

规范链接: https://lagune.ai/zh-CN/docs/commands/harden
语言: zh-CN
原文: https://lagune.ai/docs/commands/harden
最后更新: 2026-11-04

🔧 把计划中的修复逐项应用到你的代码中，安全稳妥。

## 如何使用

**应用全部**

```prompt
/lagune-harden
```

**指定路径**

```prompt
/lagune-harden src/routes/upload.ts
```

**按优先级**

```prompt
/lagune-harden 严重和高危
```

## 工作原理

每项修复都已经在计划中定好了，harden 只负责应用。由于这是唯一会改动你代码的阶段，它行事谨慎：一次只应用一项修复，让每处改动都便于审查，而且绝不会为了迁就某项修复而削弱控制措施。以上传功能的修复为例：

- **文件上传**（状态：**Applied**）
  - _改了什么_：检查文件的真实类型和大小，拒绝任何异常内容，保存时重命名，并把它存放在无法作为代码执行的位置。
  - _位置_：`handleUpload` 函数，以及它调用的存储辅助函数。

如果某项修复无法完整应用，harden 会先完成能安全完成的部分，再把剩下的标记为 **Partial** 或 **Blocked**，让它保持待处理状态。

**Applied 不等于已验证**

Applied 还不代表已经得到证明，证明正是 [verify](https://lagune.ai/zh-CN/docs/commands/verify) 的工作。

**提示**

- 它完全建立在计划之上。如果某项修复或某个文件从未规划过，它会提示你先对其运行 `/lagune-plan`。
- 再次运行会核对并更新记录：已撤销的改动会移除，新应用的修复会加入。
- 加固记录保存在 `.lagune/memory/harden.md`。

**依赖 plan，并且会改动你的代码**

harden 建立在 [`/lagune-plan`](https://lagune.ai/zh-CN/docs/commands/plan) 之上。它是唯一会改动你代码的阶段。

## 下一步

证明每项修复确实有效：[`/lagune-verify`](https://lagune.ai/zh-CN/docs/commands/verify)。

## 常见问题

### /lagune-harden 会改动我的代码吗？

会。它是唯一会改动你代码的阶段，一次应用一项计划中的修复。

### Applied、Partial 和 Blocked 是什么意思？

它们是 Lagune 为每项修复记录的状态。Applied 表示修复已完成，Partial 表示只完成了一部分，Blocked 表示无法应用。Applied 还不代表已经得到证明。

### Lagune 会不经询问就直接应用修复吗？

改动是否需要你批准，取决于你的智能体以及你运行它时使用的权限模式，而不是 Lagune，Lagune 本身不会额外设置确认环节。即便如此，它也绝不会为了迁就某项修复而削弱控制措施。如果某项修复会与 charter 中的规则冲突，它会先停下来告诉你。
