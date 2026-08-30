# Skill Categories

> The 13 specialization categories Lagune installs with --skills, and the key for each, from OWASP to per-language hardening for JavaScript, Python, Go, and Rust.

Canonical: https://lagune.ai/docs/skill-categories
Last updated: 2026-07-28

**Lagune** groups its [**_sub_-skills**](https://lagune.ai/docs/commands/skills) into **13 categories**, the unit you install. Each category maps to a CLI key you pass to `--skills`, and they split in two: what the system does, and what it is written in.

Pick a category by passing its key, for example `npx -y lagune@latest init <agent> --skills <category>`. Pass several on the same line to install more than one, or pass none and **Lagune** opens an interactive picker.

```bash
# For example, adding Claude with the OWASP and JavaScript categories to a project
npx -y lagune@latest init claude --skills owasp javascript
```

## What the system does

| Category       | Key (Alias) | What it hardens                                                                                               |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| OWASP          | `owasp`     | The application security risks OWASP tracks: injection, broken access control, auth, and crypto failures      |
| Infrastructure | `infra`     | Container, workload, and serverless config: Dockerfile, Compose, Pod security, FaaS IAM and triggers          |
| AI / LLM       | `ai`        | AI and LLM integrations, against prompt injection and unsafe tool, agent, retrieval, and MCP wiring           |
| Lovable        | `lovable`   | AI-generated Supabase apps (Lovable and similar): RLS gaps, leaked `service_role` keys, and insecure defaults |

## What it is written in

| Category   | Key (Alias)  | What it hardens                                                                                  |
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

A category is a starting point, not a commitment. Install what fits the project now and change it any time with `add` and `remove`, the same `--skills` flag either way. See [**Install**](https://lagune.ai/docs/get-started/install#specializations) for every form of the flag, and [**Skills**](https://lagune.ai/docs/commands/skills) for which sub-skills each category carries.

Your own sub-skills, written with [`/lagune.specialize`](https://lagune.ai/docs/commands/specialize), join the project's catalog alongside these and are loaded exactly the same way.

## Frequently Asked Questions

### How do I install a category?

Pass the category's key to --skills. At setup, alongside your agent, with npx -y lagune@latest init claude --skills owasp. In a project that already has Lagune, with npx -y lagune@latest add --skills owasp.

### Can I install more than one category?

Yes. List them on the same line, one after the other.

### Which category should I install?

Start with owasp, then add the one for your language or stack. Nothing is loaded by default, so a category only costs you when a phase actually needs it.
