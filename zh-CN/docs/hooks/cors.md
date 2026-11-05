# cors hook：审计 CORS 源

> 在命令行中扫描源代码里可被绕过的 CORS 源白名单，或评估单个源值是否放行过宽。

规范链接: https://lagune.ai/zh-CN/docs/hooks/cors
语言: zh-CN
原文: https://lagune.ai/docs/hooks/cors
最后更新: 2026-11-05

`cors` hook 是 [`http-request` 专项](https://lagune.ai/zh-CN/docs/catalog) 背后的确定性引擎，你也可以自己运行它。同一条命令有两种模式：**scan** 模式会扫描源代码，查找**可被绕过的源白名单**（攻击者的主机能够蒙混过关的主机校验正则），**score** 模式则把单个 **CORS 源**值判定为 `wildcard`、`null` 或 `safe`。

## 扫描代码库

不带任何选项时，它会扫描整个项目。

**整个项目**

```bash
npx lagune read cors
```

**某个目录**

```bash
npx lagune read cors --dir src/server
```

**单个文件**

```bash
npx lagune read cors --file internal/auth/origin.go
```

它会把每个可被绕过的白名单列在同一个标题下，按文件分组。如果主机校验器的 `.+`/`.*` 位于 URL 的 authority 部分、可信主机后缀之前（`^https?://.+\.trusted\.com`），像 `your-site.com.attacker.com` 这样的攻击者主机就能蒙混过关。

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

这是需要审查的警示，而不是已确认的发现项：仅凭文本无法判定这个正则是否真的把守着某个信任决策，因此扫描从不改变退出码。请逐条阅读，确认白名单使用完全相等的比较。没有发现任何问题时，它只输出一行。

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## 评估源

用 `--origin` 传入每个源。hook 会为每个源输出一个词，只要出现 `wildcard` 或 `null` 就以非零退出码退出。

**单个源**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**多个源**

重复使用 `--origin`，即可在一次调用中评估整份白名单，按顺序每行输出一个判定结果。

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| 判定结果   | 含义                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| `safe`     | 不是 `*`、`null`，也不是含 `*` 的通配模式。它不保证源的格式正确。                   |
| `wildcard` | `*`，或子域名、主机、端口的通配模式：任何站点（或范围很广的一组站点）都能读取响应。 |
| `null`     | `null` 源，沙箱化的 iframe 和重定向都能伪造它。                                     |

只有 `safe` 表示放行。`--origin` 只是值的判定器：它判断的是值，而不是 handler，因此还需要借助 `http-request` 专项确认 handler。

### CLI 选项

| 选项       | 值       | 说明                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| `--origin` | 一个源   | 评估一个源值。可重复使用以评估多个，每行一个。               |
| `--dir`    | 一个目录 | 将扫描范围限定在某个目录。可重复使用，也可与 `--file` 组合。 |
| `--file`   | 一个文件 | 将扫描范围限定在单个文件。可重复使用，也可与 `--dir` 组合。  |

不带任何选项时，它会扫描整个项目。`--origin` 属于 score 模式，不能与 `--dir` 或 `--file` 组合使用。

### 选择扫描范围

它会跳过 **Git** 忽略的内容。如果想排除更多内容，或者扫描 **Git** 忽略的内容，就为 `cors` hook 单独指定设置：

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

所有设置项见 [配置 hook](https://lagune.ai/zh-CN/docs/hooks/configure)。

**它不覆盖的范围**

扫描识别的是**可被绕过的正则**这种形态，`--origin` 评估的则是源的**值**。有两种源代码层面的模式超出了它的范围：反射请求的 `Origin`（服务器把收到的 `Origin` 原样返回，或在返回时同时允许携带凭据），以及基于 `endsWith` 或子字符串匹配的宽松白名单。请在代码中识别它们，并按照 [`http-request` 专项](https://lagune.ai/zh-CN/docs/catalog) 的说明处理。

## 常见问题

### 为什么 CORS 的 null 源很危险？

沙箱化的 iframe 和某些重定向会发送 Origin: null，所以信任 null 的白名单会让这些上下文获得读取权限。cors hook 会把它和通配符一起标记出来。

### 如何发现可被绕过的 CORS 源白名单？

对代码库运行 npx lagune read cors。它会标记贪婪通配符位于可信后缀之前的主机校验正则，这类正则会让 your-site.com.attacker.com 这样的攻击者主机蒙混过关。
