# 在 Gemini CLI 中以扩展形式安装 Lagune

> 在 Gemini CLI 中以扩展形式安装 Lagune，保持更新，并预先允许引擎运行。

规范链接: https://lagune.ai/zh-CN/docs/install/gemini-cli
语言: zh-CN
原文: https://lagune.ai/docs/install/gemini-cli
最后更新: 2026-11-04

在终端中安装扩展：

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## 更新

运行以下命令更新 **Lagune**：

```bash
gemini extensions update lagune
```

如需自动更新，安装时加上 `--auto-update`。

## 命令

输入命令时加上扩展的名称作为前缀，例如用 `/lagune:lagune-charter` 运行 `/lagune-charter`。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。**Gemini CLI** 只会在受信任的文件夹中启动它们。如需预先允许它们，把这条规则保存为 `~/.gemini/policies/lagune.toml`：

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

引擎通过 **npx** 运行时（例如用 **skills.sh** 安装），把这条规则添加到同一个文件中：

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## 常见问题

### 如何在 Gemini CLI 中安装 Lagune？

运行 gemini extensions install https://github.com/wellwelwel/lagune 即可。

### 如何在 Gemini CLI 中更新 Lagune？

运行 gemini extensions update lagune，或者安装扩展时加上 --auto-update。

### 如何在 Gemini CLI 中运行 Lagune 的命令？

输入时加上扩展的名称作为前缀，例如 /lagune:lagune-charter。

### Gemini CLI 可以不请求权限直接运行 Lagune 吗？

可以。添加一条策略规则，允许 lagune 服务器的 lagune_read 和 lagune_write 工具。引擎通过 npx 运行时，再为 run_shell_command 添加一条规则，匹配 npx --yes lagune@ 加上版本号。
