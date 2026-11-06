# 在 Codex CLI 中以插件形式安装 Lagune

> 在 Codex CLI 中以插件形式安装 Lagune，保持更新，并在沙箱中运行引擎。

规范链接: https://lagune.ai/zh-CN/docs/install/codex
语言: zh-CN
原文: https://lagune.ai/docs/install/codex
最后更新: 2026-11-03

在终端中安装插件：

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## 更新

运行以下命令更新 **Lagune**：

```bash
codex plugin marketplace upgrade lagune
```

## 命令

输入 `$` 和带插件名称前缀的命令，后面接上你的输入，例如用 `$lagune:lagune-charter` 运行 `/lagune-charter`。输入 `$` 会列出所有命令，选中一个就会插入它的完整名称。

---

**权限**

**Codex** 的沙箱无法访问网络。在你自己的终端中把引擎安装到项目里，先装一次，之后每次更新后再装一次：

```bash
npm i -D lagune@0.18.0
```

## 常见问题

### 如何在 Codex CLI 中安装 Lagune？

运行 codex plugin marketplace add wellwelwel/lagune，然后运行 codex plugin add lagune@lagune。

### 如何在 Codex CLI 中更新 Lagune？

运行 codex plugin marketplace upgrade lagune。

### 如何在 Codex CLI 中运行 Lagune 的命令？

输入 $ 和带插件名称前缀的命令，后面接上你的输入，例如 $lagune:lagune-charter。

### Lagune 能在 Codex 的沙箱中运行吗？

可以，只要你在自己的终端中用 npm i -D lagune@0.18.0 把引擎安装到项目里，先装一次，之后每次更新后再装一次。
