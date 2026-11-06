# cvss hook：为 CVSS v4.0 向量评分

> 在命令行中为一个或多个 CVSS v4.0 向量评分，算法与 FIRST 计算器相同，还能用通俗的语言逐项解读。

规范链接: https://lagune.ai/zh-CN/docs/hooks/cvss
语言: zh-CN
原文: https://lagune.ai/docs/hooks/cvss
最后更新: 2026-11-03

`cvss` hook 会为 **CVSS v4.0 向量**评分，并输出评分及其严重程度区间，也就是 [`/lagune-plan`](https://lagune.ai/zh-CN/docs/commands/plan) 为每项修复、[`/lagune-prove`](https://lagune.ai/zh-CN/docs/commands/prove) 为每份安全公告写下的定级。它是这些定级背后的确定性引擎，算法与 [FIRST 计算器](https://www.first.org/cvss/calculator/4.0) 相同，你也可以自己运行它。

## 如何运行

用 `--vector` 传入每个向量。hook 会为每个向量输出一行：评分和严重程度区间。

**单个向量**

```bash
npx lagune read cvss --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**多个向量**

重复使用 `--vector`，即可一次为多个向量评分，按顺序每个一行。

```bash
npx lagune read cvss \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**通俗解读**

加上 `--explain`，即可用通俗的语言逐项解读每个指标。当 Threat 或 Environmental 指标改变了评分时，会先单独列出 Base 评分。

```bash
npx lagune read cvss --explain --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## 如何解读结果

| 区间       | 评分        |
| ---------- | ----------- |
| `None`     | 0.0         |
| `Low`      | 0.1 至 3.9  |
| `Medium`   | 4.0 至 6.9  |
| `High`     | 7.0 至 8.9  |
| `Critical` | 9.0 至 10.0 |

只含 Base 指标的向量评估的是缺陷本身，并按最坏情况假设：每项安全要求都是 High，且该缺陷已在现实中遭到攻击。Environmental 指标（`MAV` 和其他修改后的指标，以及 `CR`、`IR` 和 `AR`）会针对具体部署确定评分，Threat 指标（`E`）则根据已知的利用情况确定评分。

无效的向量会输出 `invalid vector:` 及具体错误，hook 会以非零退出码退出。

### CLI 选项

| 选项        | 值                   | 说明                                                       |
| ----------- | -------------------- | ---------------------------------------------------------- |
| `--vector`  | 一个 `CVSS:4.0` 向量 | 为一个向量评分。可重复使用以评估多个，按顺序每个向量一行。 |
| `--explain` |                      | 在每一行定级下方，用通俗的语言列出每个指标。               |

至少需要一个 `--vector`。向量从不作为单独的位置参数传入，因此不会被误认为某个选项。

**为什么作为选项值传入**

每个向量都作为选项值传入，绝不会被插入命令文本。含有引号或反引号的值也只会被当作普通文本，无法注入 shell。请始终用单引号把它括起来，以免 shell 先对它进行展开。

**它不覆盖的范围**

只支持 CVSS v4.0：v2.0、v3.0 或 v3.1 的向量会被拒绝，而不会被评分，因为 **Lagune** 对每个发现项都按 v4.0 定级。

**提示**

plan 阶段的校验会对每一行 CVSS 重新运行同样的算法，因此与向量不符的评分会在计划被接受之前被发现。

## 常见问题

### Lagune 如何计算 CVSS 评分？

cvss hook 遵循 FIRST 的 CVSS v4.0 参考计算器，因此一个向量得到的评分与在 FIRST 网站上完全相同。

### 能用它为 CVSS v3.1 向量评分吗？

不能。Lagune 对每个发现项都按 CVSS v4.0 定级，hook 会拒绝其他任何版本，而不会为其评分。

### --explain 选项有什么作用？

它会用通俗的语言逐项解读每个指标，并在总评分旁显示 Base 评分，让任何人都能看懂向量表达了什么，以及项目上下文如何改变了评分。
