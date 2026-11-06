# 在 Qwen Code 中以扩展形式安装 Lagune

> 在 Qwen Code 中以扩展形式安装 Lagune，保持更新，并预先允许引擎运行。

规范链接: https://lagune.ai/zh-CN/docs/install/qwen-code
语言: zh-CN
原文: https://lagune.ai/docs/install/qwen-code
最后更新: 2026-11-03

在终端中安装扩展：

```bash
qwen extensions install lagune
```

## 更新

运行以下命令更新 **Lagune**：

```bash
qwen extensions update lagune
```

如需自动更新，安装时加上 `--auto-update`。

## 命令

输入命令时加上扩展的名称作为前缀，例如用 `/lagune:lagune-charter` 运行 `/lagune-charter`。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。如需预先允许它们，把这些规则添加到 `.qwen/settings.json`（单个项目）或 `~/.qwen/settings.json`（所有项目）：

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

引擎通过 **npx** 运行时（例如用 **skills.sh** 安装），允许 `Shell(npx --yes lagune@*)`。

## 常见问题

### 如何在 Qwen Code 中安装 Lagune？

运行 qwen extensions install lagune。

### 如何在 Qwen Code 中更新 Lagune？

运行 qwen extensions update lagune，或者安装扩展时加上 --auto-update。

### 如何在 Qwen Code 中运行 Lagune 的命令？

输入时加上扩展的名称作为前缀，例如 /lagune:lagune-charter。

### Qwen Code 可以不请求权限直接运行 Lagune 吗？

可以。在 Qwen Code 的设置中允许 mcp__lagune__lagune_read 和 mcp__lagune__lagune_write，引擎通过 npx 运行时，再允许 Shell(npx --yes lagune@*)。
