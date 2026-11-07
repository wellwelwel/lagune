# 用 skills.sh 或 GitHub CLI 在任意智能体中安装 Lagune

> 用 skills CLI 或 GitHub CLI 在任意 AI 智能体中安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/universal
语言: zh-CN
原文: https://lagune.ai/docs/install/universal
最后更新: 2026-11-07

**skills.sh**

在终端中用 [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) 把 **Lagune** 的命令安装到你的项目中，安装作用域保持 **Project** 不变：

```bash
npx skills add wellwelwel/lagune --skill '*'
```

或者把这段提示词粘贴到你的智能体中：

```md
运行 `npx --yes skills add wellwelwel/lagune`，然后立即按照生成的 skill 指令操作。完整阅读它的输出，必要时先把输出重定向到临时文件。相对路径以它提供的支持文件目录为基准解析。
```

**GitHub CLI**

在终端中用 [**GitHub CLI**](https://cli.github.com/) 2.90.0 或更高版本把 **Lagune** 的命令安装到你的项目中：

```bash
gh skill install wellwelwel/lagune --all --scope project
```

或者把这段提示词粘贴到你的智能体中：

```md
运行 `gh skill install wellwelwel/lagune --all --scope project`，并完整阅读它的输出，必要时先把输出重定向到临时文件。
```

## 更新

**skills.sh**

运行以下命令更新 **Lagune**：

```bash
npx skills update
```

或者把这段提示词粘贴到你的智能体中：

```md
运行 `npx --yes skills update -y`，并完整阅读它的输出，必要时先把输出重定向到临时文件。
```

**GitHub CLI**

运行以下命令更新 **Lagune**：

```bash
gh skill update --all
```

或者把这段提示词粘贴到你的智能体中：

```md
运行 `gh skill update --all`，并完整阅读它的输出，必要时先把输出重定向到临时文件。
```

---

**沙箱**

如果沙箱无法访问网络，这些命令就无法下载引擎。在你自己的终端中把它安装到项目里，先装一次，之后每次更新后再装一次：

```bash
npm i -D lagune@0.18.1
```

## 常见问题

### 如何在任意 AI 智能体中安装 Lagune？

在项目中运行 npx skills add wellwelwel/lagune --skill '*' 或 gh skill install wellwelwel/lagune --all --scope project，或者把安装提示词粘贴到你的智能体中。

### 如何在任意 AI 智能体中更新 Lagune？

如果你是用 skills.sh 安装的，就运行 npx skills update，如果是用 GitHub CLI 安装的，就运行 gh skill update --all。你也可以把更新提示词粘贴到你的智能体中。

### 可以同时用多种方式安装 Lagune 吗？

不可以。用两种方式安装的话，智能体会把每个命令列出两次，或者只用其中一份而隐藏另一份。
