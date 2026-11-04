# network hook：评估 URL 的 SSRF 风险

> 直接在命令行中评估一个或多个请求目标的 SSRF 风险。

规范链接: https://lagune.ai/zh-CN/docs/hooks/network
语言: zh-CN
原文: https://lagune.ai/docs/hooks/network
最后更新: 2026-11-04

`network` hook 会判断服务端请求的目标地址是否存在 **SSRF** 风险（SSRF 指可被引向内部服务、云元数据或私有主机的请求）。它是 [`network` 专项](https://lagune.ai/zh-CN/docs/catalog) 背后的确定性引擎，你也可以自己运行它。

## 如何运行

用 `--url` 传入每个目标地址。hook 会为每个目标输出一个词，含义见下表。

**单个目标**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**多个目标**

重复使用 `--url`，就能在一次调用中评估整份白名单或黑名单，每行一个判定结果，顺序与输入一致。

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

它会像网络本身那样解析主机，因此内部地址的各种编码形式都逃不过：十六进制、八进制、无点十进制、简写、IPv6 和 IPv4 映射地址都会得到 `private-target`。如果粗糙的校验器和真正发起请求的客户端会读出不同的主机，判定结果就是 `parser-divergent`。

## 如何解读判定结果

| 判定结果           | 含义                                                             |
| ------------------ | ---------------------------------------------------------------- |
| `safe`             | 目标连接的是公网主机，粗糙的校验器读出的也是同一个主机。         |
| `private-target`   | 主机解析到私有、回环、链路本地、未指定或云元数据地址。           |
| `parser-divergent` | 粗糙的文本校验器读出的真实主机，与请求客户端实际连接的主机不同。 |
| `invalid url`      | 该字符串无法解析为 URL，因此没有可请求的目标。                   |

只有 `safe` 表示放行。`private-target`、`parser-divergent` 和 `invalid url` 都应视为拦截。

### CLI 选项

| 选项    | 值              | 说明                                                   |
| ------- | --------------- | ------------------------------------------------------ |
| `--url` | 一个 URL 或主机 | 检查一个目标。可重复使用以检查多个，每行一个判定结果。 |

至少需要一个 `--url`。目标地址从不作为裸位置参数传入，因此不会被误认为是选项。

**为什么作为选项值传入**

每个目标地址都作为选项值传入，绝不会被插入命令文本。含有引号或反引号的值也只会被当作普通文本，无法注入 shell。请始终用单引号把它括起来，以免 shell 先对它进行展开。

**它不覆盖的范围**

这个 hook 是纯函数，从不做 DNS 解析，因此有两个运行时缺口不在它的范围内：**DNS 重绑定**（检查时解析为公网地址，请求时却解析为内部地址的域名）和**重定向链**（第一跳通过检查，随后重定向到内部）。要堵住这两个缺口，只解析一次并连接到已校验的地址，同时拒绝重定向。它会把保留的回环名称（`localhost` 和 `.localhost` 系列）直接认定为内部地址，无需查询，但其他任何 DNS 名称都会得到 `safe`，因为要断定它解析到内部就必须做解析：这类名称由白名单把关，而白名单正是这个检查器所校验的对象。

**提示**

这与 [`network` 专项](https://lagune.ai/zh-CN/docs/catalog) 用来证明目标过滤确实有效的检查完全相同。

## 常见问题

### 如何测试 URL 是否存在 SSRF 风险？

运行 network hook。它会评估请求目标，并返回 safe、private-target、parser-divergent 或 invalid url。只有 safe 表示放行。

### 什么是 parser-divergent URL？

指不同解析器会读出不同结果的 URL，这是绕过 SSRF 防护的经典手法。network hook 会标记它，而不是放行。
