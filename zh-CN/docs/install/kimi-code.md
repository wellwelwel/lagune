# 在 Kimi Code 中以插件形式安装 Lagune

> 在 Kimi Code 中以插件形式安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/kimi-code
语言: zh-CN
原文: https://lagune.ai/docs/install/kimi-code
最后更新: 2026-11-05

在 **Kimi Code** 会话中安装插件，选择 **Trust and install**，然后开启新会话来加载它：

```text
/plugins install https://github.com/wellwelwel/lagune
/new
```

## 更新

重新安装即可更新 **Lagune**：

```text
/plugins install https://github.com/wellwelwel/lagune
/new
```

## 命令

输入命令时加上插件的名称作为前缀，例如用 `/lagune:lagune-charter` 运行 `/lagune-charter`。`/` 菜单会把它们列为 `/skill:lagune:lagune-charter`，这种写法同样可用。

## 常见问题

### 如何在 Kimi Code 中安装 Lagune？

在 Kimi Code 会话中运行 /plugins install https://github.com/wellwelwel/lagune 并选择 Trust and install，然后运行 /new。

### 如何在 Kimi Code 中更新 Lagune？

重新运行 /plugins install https://github.com/wellwelwel/lagune 之后，再运行 /new。

### 如何在 Kimi Code 中运行 Lagune 的命令？

输入时加上插件的名称作为前缀，例如 /lagune:lagune-charter，或者按 / 菜单列出的形式输入，例如 /skill:lagune:lagune-charter。
