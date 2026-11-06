# 在 Hermes Agent 中以插件形式安装 Lagune

> 在 Hermes Agent 中以插件形式安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/hermes-agent
语言: zh-CN
原文: https://lagune.ai/docs/install/hermes-agent
最后更新: 2026-11-03

在终端中安装插件：

```bash
hermes plugins install wellwelwel/lagune --enable
```

- **Hermes Agent** 要求你确认一个不在其插件目录中的插件时，选择**确认**。
- 它提出安装该仓库的 **Node.js** 依赖时，选择**拒绝**。

## 更新

运行以下命令更新 **Lagune**：

```bash
hermes plugins update lagune
```

## 命令

输入命令时加上插件的名称作为前缀，例如用 `/lagune:lagune-charter` 运行 `/lagune-charter`，用 `/lagune:lagune` 运行 `/lagune`。

## 常见问题

### 如何在 Hermes Agent 中安装 Lagune？

运行 hermes plugins install wellwelwel/lagune --enable。询问时确认该插件，并拒绝安装该仓库的 Node.js 依赖。

### 如何在 Hermes Agent 中更新 Lagune？

运行 hermes plugins update lagune。

### 如何在 Hermes Agent 中运行 Lagune 的命令？

输入时加上插件的名称作为前缀，例如 /lagune:lagune-charter 和 /lagune:lagune。
