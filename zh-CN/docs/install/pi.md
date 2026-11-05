# 在 Pi 中以包的形式安装 Lagune

> 从 npm 或 GitHub 在 Pi 中以包的形式安装 Lagune，并保持更新。

规范链接: https://lagune.ai/zh-CN/docs/install/pi
语言: zh-CN
原文: https://lagune.ai/docs/install/pi
最后更新: 2026-11-05

**npm**

在终端中安装包：

```bash
pi install npm:lagune
```

**GitHub**

从 **GitHub** 安装最新提交，这种方式会通过 **npx** 运行引擎：

```bash
pi install git:github.com/wellwelwel/lagune
```

## 更新

**npm**

运行以下命令更新 **Lagune**：

```bash
pi update npm:lagune
```

**GitHub**

运行以下命令更新 **Lagune**：

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` 会更新你安装的所有包，而单独运行 `pi update` 只会更新 **Pi** 本身。

## 命令

输入命令时加上 `skill:` 前缀，例如用 `/skill:lagune-charter` 运行 `/lagune-charter`。

## 常见问题

### 如何在 Pi 中安装 Lagune？

运行 pi install npm:lagune。如需 GitHub 上的最新提交，则运行 pi install git:github.com/wellwelwel/lagune。

### 如何在 Pi 中更新 Lagune？

运行 pi update npm:lagune。如果是从 GitHub 安装的，则运行 pi update git:github.com/wellwelwel/lagune。pi update --extensions 会更新你安装的所有包。

### 如何在 Pi 中运行 Lagune 的命令？

输入时加上 skill: 前缀，例如 /skill:lagune-charter。
