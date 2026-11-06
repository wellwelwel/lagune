# 在 Factory Droid 中以插件形式安装 Lagune

> 在 Factory Droid 中以插件形式安装 Lagune，保持更新，并允许引擎所用的工具。

规范链接: https://lagune.ai/zh-CN/docs/install/factory-droid
语言: zh-CN
原文: https://lagune.ai/docs/install/factory-droid
最后更新: 2026-11-03

在终端中安装插件：

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## 更新

运行以下命令更新 **Lagune**：

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## 命令

直接输入命令名，例如 `/lagune-charter`。

---

**权限**

引擎通过两个工具运行：`lagune_read` 只读取你的项目，`lagune_write` 只写入 `.lagune/`。**Factory Droid** 询问时，为每个工具选择始终允许。它同步 `lagune` 插件市场的新提交后会再次询问，而这种同步可能在它启动时发生。

## 常见问题

### 如何在 Factory Droid 中安装 Lagune？

运行 droid plugin marketplace add wellwelwel/lagune，然后运行 droid plugin install lagune@lagune。

### 如何在 Factory Droid 中更新 Lagune？

运行 droid plugin marketplace update lagune，然后运行 droid plugin update lagune@lagune。

### 如何在 Factory Droid 中运行 Lagune 的命令？

直接输入命令名，例如 /lagune-charter。

### Factory Droid 可以不请求权限直接运行 Lagune 吗？

可以。Factory Droid 询问时，为 lagune_read 和 lagune_write 选择始终允许。它同步 lagune 插件市场的新提交后会再次询问。
