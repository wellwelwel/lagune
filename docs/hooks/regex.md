# regex hook: Detect ReDoS Patterns

> Sweep a codebase for ReDoS-prone regex, or score a single pattern, from the command line.

Canonical: https://lagune.ai/docs/hooks/regex
Last updated: 2026-11-05

The `regex` hook is the deterministic regex-safety engine the [`regex` specialization](https://lagune.ai/docs/catalog) runs, and you can run it yourself. It works in two modes from one command: a **scan** that sweeps a codebase for **ReDoS**-prone and runtime-built patterns, and a **check** that scores a single pattern you hand it.

## Scan a codebase

With no flag it scans the whole project. `--dir` scopes the scan to a directory, `--file` to a single file. Both repeat and combine into one report, each file listed once even when more than one target covers it.

**Whole project**

```bash
npx lagune read regex
```

**A directory**

```bash
npx lagune read regex --dir src/services
```

**A single file**

```bash
npx lagune read regex --file bin/import.pl
```

**Several targets**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**With a limit**

`--limit` sets the ReDoS threshold for the sweep (default 25), the same limit the check mode takes. A lower limit is stricter.

```bash
npx lagune read regex --dir src/services --limit 15
```

The output is raw text whose headers say how to read each section. A section is shown only when it has findings.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

When nothing is found, it prints a single line.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### How to read the sections

| Section                                                                                     | Meaning                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | ReDoS-prone patterns, grouped by file with each pattern indented beneath, followed in parentheses by why it is unsafe and, when it has them, its scope and its flags. Every line is unsafe, so the verdict is not repeated. |
| `Regular expressions the analysis could not settle (review manually)`                       | Patterns the analysis could not settle within its work cap, listed the same way.                                                                                                                                            |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | Files that build a regex from a variable, a concatenation, or an interpolation.                                                                                                                                             |
| `Static regex wrapped in a constructor (use a literal instead)`                             | Files that pass a plain string literal to a regex constructor where a regex literal is simpler and skips a runtime compile.                                                                                                 |

The first section is a security finding. The second and third are not findings on their own: they point to code a static check cannot settle, so they ask for a human read. The fourth is a clarity hint, not a security finding.

### CLI options

| Option      | Value                  | Description                                                                                    |
| ----------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| `--pattern` | a regex source         | Check one pattern. Repeat to check several, one verdict per pattern, in order.                 |
| `--flags`   | regex flags            | Check every `--pattern` with these flags, such as `im`. Applies to the check mode only.        |
| `--dir`     | a directory            | Scope a scan to a directory. Repeats and combines with `--file`.                               |
| `--file`    | a file                 | Scope a scan to a single file. Repeats and combines with `--dir`.                              |
| `--limit`   | a non-negative integer | Set the ReDoS repetition limit (default 25). Applies to both modes. A lower limit is stricter. |

With no option it scans the whole project. `--pattern` is the check mode and cannot be combined with `--dir` or `--file`.

### Choose what it scans

It leaves out what **Git** ignores. To leave out more, or to scan what **Git** ignores, give `regex` settings of its own:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Configure the hooks](https://lagune.ai/docs/hooks/configure) covers every setting.

### Supported languages

The scan reads these languages, keyed by file extension, each by its own rules so a pattern from one is never tested against another. Everything else is skipped rather than scanned with the wrong rules.

| #   | Language                    | Extensions                                                                                                   |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Best-effort, not exhaustive**

It reads source as text, so it cannot judge a pattern assembled at runtime, and a pattern spread across lines, hidden behind an alias, or written in a form it does not recognize can slip past. Treat the sections as a strong starting point, not a complete inventory, and keep reading the code for what they cannot reach.

## Check a single pattern

Pass `--pattern` with the pattern's source to score it. The hook prints one word: `safe`, `unsafe`, `undetermined` when the analysis reaches its work cap before settling the pattern, or `invalid regex`. Repeat `--pattern` to score several at once, one verdict per pattern, in order.

**One pattern**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Several patterns**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**With flags**

`--flags` checks every `--pattern` in the call with the flags it runs with, since a flag changes which characters a pattern matches.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**With a limit**

`--limit` sets the repetition limit (default 25) and applies to every `--pattern` in the call. A lower limit is stricter.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Why a quoted argument**

Each pattern is passed as a flag value, never interpolated into the command. A value with quotes or backticks stays inert and cannot inject into the shell. Always wrap the pattern in single quotes so your shell does not expand it first.

**Tip**

This is the same engine the [`regex` specialization](https://lagune.ai/docs/catalog) runs: the scan opens a ReDoS pass, the check confirms a pattern it surfaces.

## Frequently Asked Questions

### How do I check a regex for ReDoS from the CLI?

Run npx lagune read regex --pattern '<pattern>'. It returns safe, unsafe, undetermined, or invalid regex.

### How do I scan a whole project for unsafe regex?

Run the regex hook in scan mode over the codebase. It reports ReDoS-prone patterns across 25 supported languages.
