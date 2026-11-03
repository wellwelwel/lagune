# 用 skills.sh 在任意智能体中安装 Lagune

> 用 skills CLI 在任意 AI 智能体中安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/universal
语言: zh-CN
原文: https://lagune.ai/docs/install/universal
最后更新: 2026-11-03

**终端**

在终端中用 [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) 安装 **Lagune** 的命令：

```bash
npx skills add wellwelwel/lagune
```

**提示词**

把这段提示词粘贴到你的智能体中：

```md
运行 `npx --yes skills add wellwelwel/lagune`，然后立即按照生成的 skill 指令操作。完整阅读它的输出，必要时先把输出重定向到临时文件。相对路径以它提供的支持文件目录为基准解析。
```

## 更新

**终端**

运行以下命令更新 **Lagune**：

```bash
npx skills update
```

**提示词**

把这段提示词粘贴到你的智能体中来更新 **Lagune**：

```md
运行 `npx --yes skills update -y`，并完整阅读它的输出，必要时先把输出重定向到临时文件。
```

---

**每个智能体只用一种安装方式**

安装 **Lagune** 时，要么用 **skills.sh**，要么用它的**插件**，不要两者同时使用。

**权限**

这些命令以 `npx --yes lagune@0.16.0` 的形式运行引擎，每个 [智能体的安装页面](https://lagune.ai/zh-CN/docs) 都列出了预先允许它的规则。如果沙箱无法访问网络，就在你自己的终端中把引擎安装到项目里，先装一次，之后每次更新后再装一次：

```bash
npm i -D lagune@0.16.0
```

## 常见问题

### 如何在任意 AI 智能体中安装 Lagune？

在项目中运行 npx skills add wellwelwel/lagune，或者把安装提示词粘贴到你的智能体中。

### 用 skills CLI 安装的 Lagune 如何更新？

运行 npx skills update，或者把更新提示词粘贴到你的智能体中。

### 可以同时用 skills CLI 和插件安装 Lagune 吗？

不可以。两者都装的话，智能体会把每个命令列出两次，或者只用其中一份而隐藏另一份。
