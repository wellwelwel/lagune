# 配置 Schema

> Lagune 项目配置文件的 JSON Schema，让编辑器提供自动补全和校验，可以跟随当前版本的 Lagune，也可以固定到某个版本。

规范链接: https://lagune.ai/zh-CN/docs/references/configs-schema
语言: zh-CN
原文: https://lagune.ai/docs/references/configs-schema
最后更新: 2026-11-03

`.lagune/configs.json` 记录项目使用的 [**类别**](https://lagune.ai/zh-CN/docs/categories)，并为项目自己的 [**专项**](https://lagune.ai/zh-CN/docs/catalog) 建立索引。有了它的 JSON Schema，你编辑这个文件时，编辑器就能自动补全每个字段，并标记拼写错误或未知的类别。

## 当前 Schema

每当 **Lagune** 写入这个文件却没在其中找到 `$schema` 时，就会把文件指向当前的 Schema：

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

这个地址始终跟随当前版本的 **Lagune**。**Lagune** 0.16.0 之前写入的文件会在下次修改时加上它，在那之前，每个阶段都会提醒这一点。

## 固定版本

从 0.16.0 开始，**Lagune** 的每个发布版本都附带该版本当时的 Schema，发布在 **npm** 上，并通过 **jsDelivr** 分发。要固定某个版本，就把 `$schema` 换成在 `lagune@` 后写明版本号的地址：

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

版本号可以是任意 semver 范围：

| 版本               | Schema                       |
| ------------------ | ---------------------------- |
| `0.16.0`           | 0.16.0 版本中的 Schema       |
| `0.16.x` 或 `0.16` | 0.16 系列最新版本中的 Schema |
| `0.x` 或 `0`       | 0.x 系列最新版本中的 Schema  |
| `latest`           | 最新版本中的 Schema          |

## 常见问题

### Lagune 必须有这个 Schema 才能用吗？

不需要。Schema 只是帮你的编辑器，不管有没有 $schema，Lagune 读取这个文件的方式都一样。

### Lagune 会覆盖我固定的 Schema 吗？

不会。Lagune 只在文件里没有 $schema 时才写入它，你设置的任何地址都会保留。

### 什么时候应该固定版本？

在项目运行特定版本的 Lagune 时固定，这样编辑器会按照该版本接受的内容来校验文件。
