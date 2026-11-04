# 在 Devin CLI 中以插件形式安装 Lagune

> 在 Devin CLI 中以插件形式安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/devin-cli
语言: zh-CN
原文: https://lagune.ai/docs/install/devin-cli
最后更新: 2026-11-04

先登录 **Devin**，然后在终端中安装插件：

```bash
devin auth login
devin plugins install wellwelwel/lagune
```

## 更新

运行以下命令更新 **Lagune**：

```bash
devin plugins update lagune
```

## 命令

输入命令时加上插件的名称作为前缀，例如用 `/lagune:lagune-charter` 运行 `/lagune-charter`。`/` 菜单中也会列出这些命令。

## 常见问题

### 如何在 Devin CLI 中安装 Lagune？

先用 devin auth login 登录，然后运行 devin plugins install wellwelwel/lagune。

### 如何在 Devin CLI 中更新 Lagune？

运行 devin plugins update lagune。

### 如何在 Devin CLI 中运行 Lagune 的命令？

输入时加上插件的名称作为前缀，例如 /lagune:lagune-charter。/ 菜单中也会列出这些命令。
