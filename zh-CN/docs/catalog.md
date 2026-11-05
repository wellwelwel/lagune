# 目录：按需加载的安全专项

> 项目目录中的专项如何加载：由阶段按需加载，或由你直接加载。

规范链接: https://lagune.ai/zh-CN/docs/catalog
语言: zh-CN
原文: https://lagune.ai/docs/catalog
最后更新: 2026-11-05

🧠 **Lagune** 的专项是聚焦特定领域、与语言无关的安全知识模块，只会按需加载，绝不默认加载。它们不是命令。项目的目录就是它使用的专项集合：所用 [类别](https://lagune.ai/zh-CN/docs/categories) 中的内置专项，加上它自己的专项。detect 和 verify 阶段会在运行时调用它们，你也可以随时直接加载某个专项。

**概览**

*交互式目录概览请在网页上查看。下表列出了所有内置专项。*

**工作原理**

## 自己运行

要直接使用某个专项，请让你的智能体用 `read catalog <name>` 加载它，并在同一条提示词里写明任务。这些知识随后就会作用于你要求的内容。任何提示词都可以这样用，即使与 **Lagune** 的流程无关。

例如，用一条直接的自由格式提示词，以 **Python** 生成一组安全的 **RegExp**：

```prompt
用 `npx lagune read catalog regex` 加载 regex 专项，然后在 @src/utils/regex.py 中创建一组用于验证邮箱和用户名的正则表达式。
```

这会用一个确定性的 hook 逐一测试每个 **RegExp** 是否存在 **ReDoS** 风险，保留安全的那些，并生成类似下面的结果：

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**试试 ReDoS 检查器**

你可以在 [**devina.io/redos-checker**](https://devina.io/redos-checker) 亲自测试一个正则表达式。

## 内置专项

内置专项按 [**类别**](https://lagune.ai/zh-CN/docs/categories) 分组。以下是 **Lagune** 自带的专项集合：

| 专项                  | 类别                        | 重点                                                                   |
| --------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS**：遇到精心构造的输入就会失控的正则表达式。                    |
| `network`             | `owasp`                     | **SSRF 与重定向**：由用户提供的请求目标或重定向目标。                  |
| `interpreter`         | `owasp`, `lovable`          | **代码注入**：`eval`、动态 include、按名称调度。                       |
| `sql`                 | `owasp`                     | **关系型数据库**：注入、原生 ORM 调用、权限、数据库引擎的能力范围。    |
| `path`                | `owasp`                     | **文件系统路径**：路径遍历、空字节、NTFS 数据流、文件植入。            |
| `upload`              | `owasp`                     | **文件上传**：类型与文件签名、恶意内容、存储、限制。                   |
| `access-control`      | `owasp`, `lovable`          | **身份验证、授权与会话**：IDOR、批量赋值、租户隔离、会话。             |
| `credential-endpoint` | `owasp`, `lovable`          | **猜测与机器人**：暴力破解、密码喷洒、撞库、限流。                     |
| `federation`          | `owasp`                     | **令牌信任**：OAuth/OIDC、SAML、JWT 验证、扫码登录。                   |
| `http-request`        | `owasp`                     | **请求来源**：CSRF、CORS 配置错误、伪造的客户端 IP。                   |
| `transport`           | `owasp`                     | **信道安全**：TLS 配置、HTTPS 与明文传输、HSTS、证书固定。             |
| `crypto`              | `owasp`, `lovable`          | **静态数据加密**：弱算法或自研算法、CSPRNG、密钥管理。                 |
| `secrets`             | `owasp`, `lovable`          | **硬编码凭证**：以字面量写在源码中的密钥、令牌和密码。                 |
| `api-endpoint`        | `owasp`                     | **非 REST 接口**：GraphQL、gRPC、WebSocket 授权、DoS、schema。         |
| `payment`             | `owasp`, `lovable`          | **支付流程**：在服务端向网关核验、签名回调、幂等性。                   |
| `xml`                 | `owasp`                     | **XML 解析**：XXE、外部实体、billion laughs 实体膨胀。                 |
| `csv`                 | `owasp`                     | **公式注入**：以 `=`/`+`/`-`/`@` 开头的电子表格单元格。                |
| `container`           | `owasp`, `infra`            | **容器配置**：root 权限、capabilities、socket 挂载、镜像加固。         |
| `infra`               | `infra`                     | **基础设施即代码**：Terraform、Dockerfile、GitHub Actions。            |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS 函数**：最小权限 IAM、事件输入、上下文、密钥。                  |
| `llm`                 | `ai`, `lovable`             | **AI/LLM 风险**：提示词注入、代理权限、RAG、MCP、输出。                |
| `supabase`            | `lovable`                   | **Supabase 后端**：默认关闭的 RLS、AI 误生成的策略、密钥模型。         |
| `browser`             | `javascript`, `lovable`     | **客户端风险**：XSS、CSP、iframe 嵌套、存储等。                        |
| `javascript`          | `javascript`                | **语言层面的风险**：RCE、原型链污染等。                                |
| `python`              | `python`                    | **语言层面的风险**：`pickle` RCE、类污染、`-O` 等。                    |
| `rust`                | `rust`                      | **`unsafe` 健全性**：safe 代码调用方引发的 UB、`transmute`、溢出。     |
| `java`                | `java`                      | **反序列化与移动代码**：`readObject` 利用链、对象劫持。                |
| `ruby`                | `ruby`                      | **反序列化与 `open`**：`Marshal`/YAML 对象复活、管道符陷阱。           |
| `php`                 | `php`                       | **type juggling 与 `unserialize`**：魔术哈希、POP 链。                 |
| `go`                  | `go`                        | **typed nil 与数据竞争**：`nil != nil`、共享内存的 goroutine。         |
| `c-cpp`               | `c-cpp`                     | **格式化字符串**：`printf(user_input)`、`%n` 任意地址写。              |
| `dotnet`              | `dotnet`                    | **平台层面的风险**：`BinaryFormatter` RCE、`@Html.Raw`、枚举校验缺口。 |

大部分内置知识提炼自 OWASP。每个专项与 OWASP 官方攻击页面和 Cheat Sheet 页面的完整对应关系，请参阅 [**OWASP 来源**](https://lagune.ai/zh-CN/docs/references/owasp-sources)。少数特定技术栈的模块则取材于厂商自己的指南，例如 `supabase` 来自 Supabase 文档和 CVE-2025-48757。

## 你自己的专项

内置专项的扩充方式是新增一个知识文件和一行索引，从不新增命令。你也可以用同样的方式，通过 [`/lagune-specialize`](https://lagune.ai/zh-CN/docs/commands/specialize) 添加自己的专项：给它一篇文章或一个主题，它就会为你的项目提炼出一个新专项，文件放在 `.lagune/catalog/` 下，条目写入 `.lagune/configs.json`。无论目录包含哪些类别，你自己的专项始终都在目录中，与内置专项同名时，你的专项会覆盖内置的那个。

**Lagune 会在内部按需自动加载专项**

当 detect 或 verify 阶段遇到某个专项涵盖的上下文时，会自行用 `read catalog <name>` 加载该专项。这是阶段流程的一部分，会自动完成，无需你手动操作。

## 查看可用的专项

要在终端中列出项目的目录，每行显示一个专项及其标签：

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

标记为 `[required]` 的专项无论做什么工作都会应用。列表中包含哪些内置专项，取决于项目的 [**类别**](https://lagune.ai/zh-CN/docs/categories)。

**专项不会默认加载**

相关知识会针对项目的实际情况引入，而不是默认运行所有检查。

## 常见问题

### Lagune 的专项是什么？

专项是聚焦特定领域、与语言无关的安全知识模块，只会按需加载，绝不默认加载。它不是命令，这一点与智能体的 skill 不同。

### 项目的目录是什么？

就是项目使用的专项：所用类别中的内置专项，加上它自己的专项。在没有记录任何类别时，项目只使用 OWASP。

### 专项会默认加载吗？

不会。专项只会根据项目的实际情况按需加载。

### 怎么直接加载某个专项？

在写任务的同一条提示词里，让你的智能体运行 npx lagune read catalog <name>。
