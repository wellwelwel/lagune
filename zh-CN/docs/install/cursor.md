# 在 Cursor 中以插件形式安装 Lagune

> 在 Cursor 和 Cursor CLI 中以插件形式安装 Lagune，保持更新，并预先允许引擎运行。

规范链接: https://lagune.ai/zh-CN/docs/install/cursor
语言: zh-CN
原文: https://lagune.ai/docs/install/cursor
最后更新: 2026-11-05

**Cursor**

- 打开 **Customize**。
- 选择 **From GitHub Repository**，然后输入 `https://github.com/wellwelwel/lagune`。
- 在 **Lagune** 上选择 **Install**，然后选择项目或用户作用域。

**Cursor CLI**

- 在终端中添加插件市场：

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- 把 `/plugins` 输入到 `agent` 会话中。
- 安装 **Lagune**。

如果 **Claude Code** 中已经安装了 **Lagune**，**Cursor CLI** 会直接从那里加载它。

## 更新

**Cursor**

- 打开 **Customize**。
- 在 `lagune` 插件市场上选择 **Refresh**。

**Cursor CLI**

- 在终端中替换插件市场：

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- 把 `/plugins` 输入到 `agent` 会话中。
- 重新安装 **Lagune**。

## 命令

直接输入命令名，例如 `/lagune-charter`。

---

**权限**

在 **Cursor** 中，命令通过 **npx** 运行引擎，默认的 Auto-review 模式会直接允许，不会询问。

在 **Cursor CLI** 中，引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。如需预先允许它们，把这些规则添加到 `.cursor/cli.json`（单个项目）或 `~/.cursor/cli-config.json`（所有项目）：

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

引擎通过 **npx** 运行时（例如用 **skills.sh** 安装），允许 `Shell(npx:--yes lagune@*)`。

## 常见问题

### 如何在 Cursor 中安装 Lagune？

在 Cursor 中，打开 Customize，选择 From GitHub Repository，输入 https://github.com/wellwelwel/lagune 并安装 Lagune。在 Cursor CLI 中，运行 agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor，然后在 /plugins 中安装 Lagune。

### 如何在 Cursor 中更新 Lagune？

在 Cursor 中，到 Customize 里的 lagune 插件市场上选择 Refresh。在 Cursor CLI 中，移除 lagune 插件市场，重新添加，然后在 /plugins 中重新安装 Lagune。

### 如何在 Cursor 中运行 Lagune 的命令？

直接输入命令名，例如 /lagune-charter。

### Cursor 可以不请求权限直接运行 Lagune 吗？

可以。Cursor 默认的 Auto-review 模式已经允许它运行。在 Cursor CLI 中，允许 Mcp(plugin-lagune-lagune:lagune_read) 和 Mcp(plugin-lagune-lagune:lagune_write)，引擎通过 npx 运行时，再允许 Shell(npx:--yes lagune@*)。
