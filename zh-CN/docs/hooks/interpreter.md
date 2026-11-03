# interpreter hook：标记动态代码执行 sink

> 在命令行中扫描代码库里多种语言的动态代码执行 sink，或评估单个代码片段。

规范链接: https://lagune.ai/zh-CN/docs/hooks/interpreter
语言: zh-CN
原文: https://lagune.ai/docs/hooks/interpreter
最后更新: 2026-11-03

`interpreter` hook 会标记**动态代码执行 sink**：把数据变成可运行代码或交给 shell 的结构，从 `eval` 到原生反序列化都在其列。它能识别语言，按每个文件自己的规则读取，也是 [`interpreter` 专项](https://lagune.ai/zh-CN/docs/catalog) 背后的确定性引擎，你也可以自己以 **scan** 或 **check** 模式运行它。

## 如何运行

**扫描代码库**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**检查代码片段**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

这些 sink 都是双刃剑：受攻击者影响的输入是否会到达某个 sink，静态扫描无法判定，因此每个匹配项都是**需要审查的警示**，而不是已确认的发现项。扫描只输出一个 **Dynamic-execution sinks to review** 部分，按文件分组。扫描结果干净时会输出 `no dynamic-execution sinks found`。

**只阅读被标记的代码，绝不运行！**

以**静态**方式分析每个 sink，追踪不可信输入是否会到达它。绝不要为了"测试"它的行为而执行或 `eval` 被标记的代码，也不要执行它引入的任何远程代码或运行时获取的代码。

## 如何解读判定结果

| 判定结果  | 含义                                                                |
| --------- | ------------------------------------------------------------------- |
| `careful` | 代码片段包含该语言的动态执行 sink。请通过阅读来审查，绝不要运行它。 |
| `safe`    | 在指定的语言中没有发现动态执行 sink。                               |

### CLI 选项

| 选项        | 值           | 说明                                                                                                         |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `--pattern` | 一个代码片段 | 检查一个代码片段。可重复使用以检查多个，每行一个判定结果。                                                   |
| `--lang`    | 一种语言     | 使用 `--pattern` 时必填，取值为 javascript、python、php、ruby、java、kotlin、go、rust、c、cpp、csharp 之一。 |
| `--dir`     | 一个目录     | 将扫描范围限定在某个目录。可重复使用，也可与 `--file` 组合。                                                 |
| `--file`    | 一个文件     | 将扫描范围限定在单个文件。可重复使用，也可与 `--dir` 组合。                                                  |

不带任何选项时，它会扫描整个项目。`--pattern` 需要配合 `--lang`，且不能与 `--dir` 或 `--file` 组合使用。

### 支持的语言

扫描会按文件扩展名识别以下语言，并对照每种语言自己的一组动态执行 sink 进行检查。

| #   | 语言                        | 扩展名                                                                                                       | 标记的 sink                                                                                                                                                                                                        |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`、`.jsx`、`.mjs`、`.cjs`、`.ts`、`.tsx`、`.mts`、`.cts`、`.astro`、`.vue`、`.svelte`、`.marko`、`.riot` | `eval()`、Function 构造函数、以字符串为函数体的 `setTimeout`/`setInterval`、`vm` 模块、`child_process` 的 exec、动态 `require()`、动态 `import()`                                                                  |
| 2   | **Python**                  | `.py`、`.pyi`                                                                                                | `eval`/`exec`、`__import__()`、`os.system`/`os.popen`、`subprocess` 的 `shell=True`、`pickle.load`/`loads`、`yaml.load`（不安全）                                                                                  |
| 3   | **Ruby**                    | `.rb`                                                                                                        | eval 系列（`instance_eval`/`class_eval`/`module_eval`/`eval`）、`system`/`exec`、反引号或 `%x`、`Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`、`Process.spawn`、`Marshal.load`                             |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`、`plugin.Open`                                                                                                                                                                |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`、作用于字符串的 `assert()`、`create_function()`、shell 执行（`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`）、`call_user_func`/`call_user_func_array`、使用运行时路径的 `include`/`require` |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`、`process::Command`                                                                                                                                                                                 |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`、`ProcessBuilder`、`ScriptEngine`、`ObjectInputStream.readObject`                                                                                                                                   |
| 8   | **Kotlin**                  | `.kt`、`.kts`                                                                                                | JVM 的 sink：`Runtime.exec`、`ProcessBuilder`、`ScriptEngine`、`ObjectInputStream.readObject`                                                                                                                      |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`、`BinaryFormatter`、`Assembly.Load`                                                                                                                                                |
| 10  | **C**                       | `.c`、`.h`                                                                                                   | `system()`、`popen()`、`exec*` 系列（`execl`、`execve`、`execvp` 等）                                                                                                                                              |
| 11  | **C++**                     | `.cc`、`.cpp`、`.cxx`、`.hpp`、`.hh`、`.hxx`                                                                 | `system()`、`popen()`、`exec*` 系列（`execl`、`execve`、`execvp` 等）                                                                                                                                              |

**尽力而为，并非详尽无遗**

它把源代码当作文本读取，因此在运行时拼装、藏在别名后面，或以它无法识别的形式写出的 sink 都可能被漏掉。请把这张表当作可靠的起点，而不是完整的清单。

**提示**

hook 保证的是底线（这些 sink 确实存在，以及它们在哪里）：不可信的值是否真的会到达某个 sink，则由 [`interpreter` 专项](https://lagune.ai/zh-CN/docs/catalog) 来判断。

## 常见问题

### interpreter hook 能确认漏洞吗？

不能。它把动态执行 sink 标记为需要审查的警示，而不是已确认的发现项，因为受攻击者影响的输入是否会到达 sink，静态扫描无法判定。

### interpreter hook 支持哪些语言？

它会按文件扩展名识别"支持的语言"表中列出的语言，并对照每种语言自己的一组 sink 进行检查。其他语言不会产出任何 sink。
