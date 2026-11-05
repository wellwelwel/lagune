# 在 Grok Build 中以插件形式安装 Lagune

> 在 Grok Build 中以插件形式安装 Lagune，保持更新，并预先允许引擎运行。

规范链接: https://lagune.ai/zh-CN/docs/install/grok-build
语言: zh-CN
原文: https://lagune.ai/docs/install/grok-build
最后更新: 2026-11-05

在终端中安装插件：

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## 更新

运行以下命令更新 **Lagune**：

```bash
grok plugin update lagune
```

## 命令

直接输入命令名，例如 `/lagune-charter`，或者加上插件的名称作为前缀，例如 `/lagune:lagune-charter`。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。如需预先允许它们，把这些规则添加到 `~/.grok/config.toml`：

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

引擎通过 **npx** 运行时（例如用 **skills.sh** 安装），允许 `Bash(npx --yes lagune@*)`。

## 常见问题

### 如何在 Grok Build 中安装 Lagune？

运行 grok plugin install wellwelwel/lagune@plugin-grok --trust。

### 如何在 Grok Build 中更新 Lagune？

运行 grok plugin update lagune。

### 如何在 Grok Build 中运行 Lagune 的命令？

直接输入命令名，例如 /lagune-charter，或者加上插件的名称作为前缀，例如 /lagune:lagune-charter。

### Grok Build 可以不请求权限直接运行 Lagune 吗？

可以。在 Grok Build 的配置中允许 MCPTool(lagune__lagune_read) 和 MCPTool(lagune__lagune_write)，引擎通过 npx 运行时，再允许 Bash(npx --yes lagune@*)。
