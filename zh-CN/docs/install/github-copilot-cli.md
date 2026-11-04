# 在 GitHub Copilot CLI 中以插件形式安装 Lagune

> 在 GitHub Copilot CLI 中以插件形式安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/github-copilot-cli
语言: zh-CN
原文: https://lagune.ai/docs/install/github-copilot-cli
最后更新: 2026-11-04

在终端中安装插件：

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

在编辑器中，用 [**skills.sh**](https://lagune.ai/zh-CN/docs/install/universal) 为 **GitHub Copilot** 安装 **Lagune**。

## 更新

运行以下命令更新 **Lagune**：

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

## 命令

直接输入命令名，例如 `/lagune-charter`。

## 常见问题

### 如何在 GitHub Copilot CLI 中安装 Lagune？

运行 copilot plugin marketplace add wellwelwel/lagune，然后运行 copilot plugin install lagune@lagune。

### 如何在 GitHub Copilot CLI 中更新 Lagune？

运行 copilot plugin marketplace update lagune，然后运行 copilot plugin update lagune@lagune。

### 如何在 GitHub Copilot CLI 中运行 Lagune 的命令？

直接输入命令名，例如 /lagune-charter。

### 可以在 VS Code 的 GitHub Copilot 中使用 Lagune 吗？

可以。在 VS Code 或其他编辑器中，用 skills.sh 而不是插件来安装 Lagune。
