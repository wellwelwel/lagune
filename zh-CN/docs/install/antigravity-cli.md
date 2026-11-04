# 在 Antigravity CLI 中以插件形式安装 Lagune

> 在 Antigravity CLI 中以插件形式安装 Lagune，保持更新，并预先允许引擎运行。

规范链接: https://lagune.ai/zh-CN/docs/install/antigravity-cli
语言: zh-CN
原文: https://lagune.ai/docs/install/antigravity-cli
最后更新: 2026-11-04

在终端中安装插件：

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## 更新

重新安装即可更新 **Lagune**：

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## 命令

输入命令时加上插件的名称作为前缀，例如用 `/lagune:lagune-charter` 运行 `/lagune-charter`。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。作为会话第一条消息发送的命令会在这两个工具加载之前运行，因此会改用 **npx**。如需预先允许这两个工具和 **npx**，把这些规则添加到 `~/.gemini/antigravity-cli/settings.json`：

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## 常见问题

### 如何在 Antigravity CLI 中安装 Lagune？

运行 agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity 即可。

### 如何在 Antigravity CLI 中更新 Lagune？

再次运行 agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity 即可。

### 如何在 Antigravity CLI 中运行 Lagune 的命令？

输入时加上插件的名称作为前缀，例如 /lagune:lagune-charter。

### Antigravity CLI 可以不请求权限直接运行 Lagune 吗？

可以。在 Antigravity CLI 的设置中允许 mcp(lagune_lagune/lagune_read)、mcp(lagune_lagune/lagune_write) 和 command(regex:npx --yes lagune@[0-9.]+)。npx 规则针对的是作为会话第一条消息发送的命令。
