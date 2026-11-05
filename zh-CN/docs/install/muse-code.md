# 在 Muse Code 中以插件形式安装 Lagune

> 在 Muse Code 中以插件形式安装 Lagune，保持更新，并在沙箱中运行引擎。

规范链接: https://lagune.ai/zh-CN/docs/install/muse-code
语言: zh-CN
原文: https://lagune.ai/docs/install/muse-code
最后更新: 2026-11-05

在终端中安装插件：

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## 更新

刷新插件市场并重新安装插件即可更新 **Lagune**：

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## 命令

直接输入命令名，例如 `/lagune-charter`，或者加上插件的名称作为前缀，例如 `/lagune:lagune-charter`。

---

**权限**

**Muse Code** 的沙箱无法下载引擎。在你自己的终端中把它安装到项目里，先装一次，之后每次更新后再装一次：

```bash
npm i -D lagune@0.18.0
```

## 常见问题

### 如何在 Muse Code 中安装 Lagune？

运行 muse plugins marketplace add lagune wellwelwel/lagune，然后运行 muse plugins install lagune@lagune。

### 如何在 Muse Code 中更新 Lagune？

运行 muse plugins marketplace update lagune，然后用 muse plugins remove lagune 和 muse plugins install lagune@lagune 重新安装。

### 如何在 Muse Code 中运行 Lagune 的命令？

直接输入命令名，例如 /lagune-charter，或者加上插件的名称作为前缀，例如 /lagune:lagune-charter。

### Lagune 能在 Muse Code 的沙箱中运行吗？

可以，只要你在自己的终端中用 npm i -D lagune@0.18.0 把引擎安装到项目里，先装一次，之后每次更新后再装一次。
