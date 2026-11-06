# 类别

> Lagune 项目可以使用的专项类别，从 OWASP 到 JavaScript、Python、Go 和 Rust 的语言级加固，以及如何更改它们。

规范链接: https://lagune.ai/zh-CN/docs/categories
语言: zh-CN
原文: https://lagune.ai/docs/categories
最后更新: 2026-11-03

**Lagune** 把内置的 [**专项**](https://lagune.ai/zh-CN/docs/catalog) 分为 **13 个类别**。项目使用哪些类别，决定了哪些内置专项会进入它的 [**目录**](https://lagune.ai/zh-CN/docs/catalog)。这些类别分为两组：系统做什么，以及系统用什么语言编写。

在没有记录任何类别时，项目只使用 `owasp`。[`/lagune-charter`](https://lagune.ai/zh-CN/docs/commands/charter) 会根据它对项目的解读，记录每个有依据的类别，你也可以随时自行更改。

## 系统做什么

| 类别     | 键        | 加固什么                                                                                              |
| -------- | --------- | ----------------------------------------------------------------------------------------------------- |
| OWASP    | `owasp`   | OWASP 追踪的应用安全风险：注入、失效的访问控制，以及身份验证和加密机制失效                            |
| 基础设施 | `infra`   | 容器、工作负载和 serverless 配置：Dockerfile、Compose、Pod 安全，以及 FaaS 的 IAM 和触发器            |
| AI / LLM | `ai`      | AI 和 LLM 集成，防范提示词注入，以及不安全的工具、智能体、检索和 MCP 接入方式                         |
| Lovable  | `lovable` | AI 生成的 Supabase 应用（Lovable 及同类工具）：RLS 疏漏、泄露的 `service_role` 密钥和不安全的默认设置 |

## 系统用什么语言编写

| 类别       | 键           | 加固什么                                                                       |
| ---------- | ------------ | ------------------------------------------------------------------------------ |
| JavaScript | `javascript` | `eval` 和 `child_process` 导致的 RCE、路径遍历和原型链污染，覆盖它的各种运行时 |
| Python     | `python`     | `pickle` 和 YAML 反序列化导致的 RCE、`str.format` 字符串遍历和类污染           |
| Rust       | `rust`       | 不健全的 `unsafe` API、`transmute` 误用、整数溢出，以及 FFI 边界上的未定义行为 |
| C / C++    | `c-cpp`      | 可导致代码执行的格式化字符串漏洞、缓冲区溢出和越界写入                         |
| PHP        | `php`        | type juggling 导致的身份验证绕过、对象注入利用链和不安全的默认配置             |
| Go         | `go`         | typed nil 接口缺陷、goroutine 数据竞争，以及安全路径上不安全的并发             |
| Java       | `java`       | 最终导致远程代码执行的 `ObjectInputStream` 反序列化利用链                      |
| Ruby       | `ruby`       | 可达成远程代码执行的 `Marshal.load` 和 YAML 反序列化利用链                     |
| .NET / C#  | `dotnet`     | `BinaryFormatter` 反序列化导致的 RCE，以及可导致 XSS 的编码器绕过              |

**提示**

**Lagune** 与语言无关：无论你的项目用什么语言编写，整个流程都能读懂它，这些类别只是针对某种语言特有的陷阱加深分析。

## 随时添加和移除

类别只是起点，不是承诺。先用适合项目当前情况的类别，之后随时可以用 `write add` 和 `write remove` 按键名更改。在终端中，不带值的 `--categories` 会打开交互式选择器（空格键切换选中，回车键确认，不选则跳过）。在终端之外，请把类别写在它后面。

**添加**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**移除**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

第一次 `write add` 或 `write remove` 会以 `owasp` 为起点，所以移除所有类别后得到的是空列表，而不是默认值。每次更改都会写入 `.lagune/configs.json`，让整个团队使用同一组类别。

## 查看项目使用的类别

`read list --categories` 会列出所有类别，并显示项目是否使用了每个类别：

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

每个类别包含哪些专项，请参阅 [**目录**](https://lagune.ai/zh-CN/docs/catalog)。你用 [`/lagune-specialize`](https://lagune.ai/zh-CN/docs/commands/specialize) 编写的自有专项，无论选了哪些类别，都会加入目录。

## 常见问题

### 怎么添加类别？

把类别的键名传给 --categories，例如 npx lagune write add --categories javascript。在还没有记录任何类别时，charter 也会根据它对项目的解读，记录有依据的类别。

### 可以同时使用多个类别吗？

可以。把它们依次写在同一行即可。

### 项目应该用哪个类别？

先从默认的 owasp 开始，再添加适合你的语言或技术栈的类别。专项只会按需加载，所以在某个阶段需要用到它的专项之前，类别不会带来任何开销。
