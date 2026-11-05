# 在 Claude Code 中以插件形式安装 Lagune

> 在 Claude Code 的终端、扩展或桌面应用中以插件形式安装 Lagune，保持更新，并预先允许引擎运行。

规范链接: https://lagune.ai/zh-CN/docs/install/claude-code
语言: zh-CN
原文: https://lagune.ai/docs/install/claude-code
最后更新: 2026-11-05

**终端**

在终端中安装插件：

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

或者在 **Claude Code** 会话中安装：

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**扩展**

- 输入 `/plugin`，然后选择 **Manage plugins**。
- 在 **Marketplaces** 选项卡中添加 `wellwelwel/lagune`。
- 在 **Plugins** 选项卡中安装 `lagune`。

**桌面端**

- 通过终端或扩展安装 **Lagune**，在扩展中安装时选择 **Install for you**。
- 在桌面应用中开启新会话，它会加载你为自己安装的插件。

## 更新

**终端**

运行以下命令更新 **Lagune**：

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

要让 `lagune` 插件市场自动更新，在 `/plugin` 中为它选择 **Enable auto-update**。

**扩展**

- 输入 `/plugin`，然后选择 **Manage plugins**。
- 打开 **Marketplaces** 选项卡。
- 点击 `lagune` 上的刷新图标。

**桌面端**

- 通过终端或扩展更新 **Lagune**。
- 在桌面应用中开启新会话。

## 命令

直接输入命令名，例如 `/lagune-charter`，或者加上插件的名称作为前缀，例如 `/lagune:lagune-charter`。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。如需预先允许它们，把这些规则添加到 `.claude/settings.json`（单个项目）或 `~/.claude/settings.json`（所有项目）：

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

引擎通过 **npx** 运行时（例如用 **skills.sh** 安装），允许 `Bash(npx --yes lagune@*)`。开启沙箱时，还要把 `registry.npmjs.org` 加入 `sandbox.network.allowedDomains`。

## 常见问题

### 如何在 Claude Code 中安装 Lagune？

运行 claude plugin install lagune --marketplace wellwelwel/lagune。在会话或扩展中，通过插件管理器添加 wellwelwel/lagune 插件市场，然后安装 lagune。你在终端或扩展中为自己安装之后，桌面应用就会加载它。

### 如何在 Claude Code 中更新 Lagune？

运行 claude plugin marketplace update lagune，然后运行 claude plugin update lagune@lagune，或者在 /plugin 中为 lagune 插件市场选择 Enable auto-update。在扩展中，从 /plugin 打开 Manage plugins，点击 lagune 插件市场上的刷新图标。桌面应用会在下一次会话中加载更新。

### 如何在 Claude Code 中运行 Lagune 的命令？

直接输入命令名，例如 /lagune-charter，或者加上插件的名称作为前缀，例如 /lagune:lagune-charter。

### Claude Code 可以不请求权限直接运行 Lagune 吗？

可以。在 Claude Code 的设置中允许 mcp__plugin_lagune_lagune__lagune_read 和 mcp__plugin_lagune_lagune__lagune_write，引擎通过 npx 运行时，再允许 Bash(npx --yes lagune@*)。
