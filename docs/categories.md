# Categories

> The specialization categories a Lagune project can use, from OWASP to per-language hardening for JavaScript, Python, Go, and Rust, and how to change them.

Canonical: https://lagune.ai/docs/categories
Last updated: 2026-11-05

**Lagune** groups its built-in [**specializations**](https://lagune.ai/docs/catalog) into **13 categories**. The categories a project uses decide which built-ins join its [**catalog**](https://lagune.ai/docs/catalog), and they split in two: what the system does, and what it is written in.

While no category is recorded, a project uses `owasp` alone. [`/lagune-charter`](https://lagune.ai/docs/commands/charter) records each category its reading of the project supports, and you can change them yourself anytime.

## What the system does

| Category       | Key       | What it hardens                                                                                               |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| OWASP          | `owasp`   | The application security risks OWASP tracks: injection, broken access control, auth, and crypto failures      |
| Infrastructure | `infra`   | Container, workload, and serverless config: Dockerfile, Compose, Pod security, FaaS IAM and triggers          |
| AI / LLM       | `ai`      | AI and LLM integrations, against prompt injection and unsafe tool, agent, retrieval, and MCP wiring           |
| Lovable        | `lovable` | AI-generated Supabase apps (Lovable and similar): RLS gaps, leaked `service_role` keys, and insecure defaults |

## What it is written in

| Category   | Key          | What it hardens                                                                                  |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------ |
| JavaScript | `javascript` | `eval` and `child_process` RCE, path traversal, and prototype pollution, across its runtimes     |
| Python     | `python`     | `pickle` and YAML deserialization RCE, `str.format` string traversal, and class pollution        |
| Rust       | `rust`       | Unsound `unsafe` APIs, `transmute` misuse, integer overflow, and FFI boundary undefined behavior |
| C / C++    | `c-cpp`      | Format-string bugs, buffer overflows, and out-of-bounds writes that enable code execution        |
| PHP        | `php`        | Type-juggling auth bypass, object injection gadget chains, and insecure configuration defaults   |
| Go         | `go`         | Typed-nil interface bugs, goroutine data races, and unsafe concurrency on security paths         |
| Java       | `java`       | `ObjectInputStream` deserialization gadget chains that culminate in remote code execution        |
| Ruby       | `ruby`       | `Marshal.load` and YAML deserialization gadget chains that reach remote code execution           |
| .NET / C#  | `dotnet`     | `BinaryFormatter` deserialization RCE and the encoder bypasses that reach XSS                    |

**Tip**

**Lagune** is language-agnostic: the whole flow reads whatever your project is written in, and these categories only add depth on the pitfalls specific to one language.

## Add and remove anytime

A category is a starting point, not a commitment. Use what fits the project now and change it any time by key, with `write add` and `write remove`. `--categories` with no value opens an interactive picker in a terminal (space to toggle, enter to confirm, empty to skip). Outside a terminal, pass the categories after it.

**Add**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Remove**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

The first `write add` or `write remove` starts from `owasp`, so removing every category leaves an empty list, never the default. Every change lands in `.lagune/configs.json`, so the whole team works with the same set.

## See what a project uses

`read list --categories` shows every category and whether the project uses it:

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

See [**Catalog**](https://lagune.ai/docs/catalog) for which specializations each category carries. Your own specializations, written with [`/lagune-specialize`](https://lagune.ai/docs/commands/specialize), join the catalog whatever the categories.

## Frequently Asked Questions

### How do I add a category?

Pass the category's key to --categories, for example npx lagune write add --categories javascript. The charter also records the categories its reading of the project supports while none is recorded.

### Can I use more than one category?

Yes. List them on the same line, one after the other.

### Which category should a project use?

Start with owasp, the default, then add the one for your language or stack. Specializations load only on demand, so a category costs nothing until a phase needs one of its specializations.
