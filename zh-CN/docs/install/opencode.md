# 在 OpenCode 中以插件形式安装 Lagune

> 在 OpenCode 1.x 和 2.x 中以插件形式安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/opencode
语言: zh-CN
原文: https://lagune.ai/docs/install/opencode
最后更新: 2026-11-05

**OpenCode 2.x**

在终端中安装插件：

```bash
opencode plugin add lagune
```

或者把它添加到 `plugins` 列表（位于 `opencode.json`）：

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

在终端中把插件安装到你的项目里，或者加上 `-g` 为你的所有项目安装：

```bash
opencode plugin lagune
```

或者把它添加到 `plugin` 列表（位于 `opencode.json`）：

```json
{
  "plugin": ["lagune"]
}
```

## 更新

**OpenCode 2.x**

运行以下命令更新 **Lagune**：

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

直接在旧版本上安装新版本即可更新 **Lagune**。如果你是为所有项目安装的，就加上 `-g`：

```bash
opencode plugin lagune@0.18.0 --force
```

## 命令

**OpenCode 2.x**

输入 `@` 并选择命令，例如 `@lagune-charter`，然后在同一条消息中写下你的输入。

**OpenCode 1.x**

直接输入命令名，例如 `/lagune-charter`。这些命令列在 `/skills` 中，而不是 `/` 菜单里。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。**OpenCode** 运行它们时不会询问。

## 常见问题

### 如何在 OpenCode 中安装 Lagune？

在 OpenCode 2.x 中，运行 opencode plugin add lagune。在 OpenCode 1.x 中，运行 opencode plugin lagune，加上 -g 可为你的所有项目安装。

### 如何在 OpenCode 中更新 Lagune？

在 OpenCode 2.x 中，运行 opencode plugin update lagune，然后运行 opencode reload。在 OpenCode 1.x 中，运行 opencode plugin lagune@0.18.0 --force。

### 如何在 OpenCode 中运行 Lagune 的命令？

在 OpenCode 2.x 中，输入 @ 并选择命令，例如 @lagune-charter，然后在同一条消息中写下你的输入。在 OpenCode 1.x 中，直接输入命令名，例如 /lagune-charter，或者在 /skills 中找到它们。

### OpenCode 运行 Lagune 前会请求权限吗？

不会。OpenCode 会直接运行引擎的两个工具 lagune_read 和 lagune_write，不会询问。
