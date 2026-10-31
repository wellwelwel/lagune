# Regex-specific vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.

## Rules

- This specialization audits and explains.
- By default, it never rewrites your code.

## What to look for

### ReDoS (Regular expression Denial of Service)

On a crafted input, the pattern takes an exploding amount of time to match, stalling or overloading the system.

#### Start by mapping the workspace

Begin every ReDoS pass with the deterministic scanner:

```bash
npx --yes lagune@0.15.0 regex               # scans the whole project
npx --yes lagune@0.15.0 regex --dir <DIR>   # scans a directory
npx --yes lagune@0.15.0 regex --file <FILE> # scans a single file
```

- `--dir` and `--file` repeat to scan several targets at once.
- The header `Vulnerable regular expressions found:` **is the `unsafe` verdict for every pattern beneath it**, so each is a closed finding. Each pattern is followed, in parentheses, by why it is unsafe, the scope it shows in (`search` or `whole match`) when it has one, and the flags it runs with when it has any.
- The header `Regular expressions the analysis could not settle (review manually):` lists the patterns that read `undetermined`.
- The scan is best-effort, so keep reading the code for what it cannot reach: a pattern built across lines, or one hidden behind an alias.

#### How to check a pattern the scan missed

Use `--pattern` only for a pattern the scan could not reach. Quote each pattern so its slashes or backticks cannot break the command:

```bash
npx --yes lagune@0.15.0 regex --pattern '<PATTERN>'
```

- `--pattern` cannot combine with `--file` or `--dir`.
- Repeat `--pattern` to check several at once, one verdict printed per pattern, in order.
- `--flags` gives every `--pattern` in the call the flags it runs with, such as `--flags 'im'`. Flags change which characters a pattern matches, so check a pattern with the flags it carries in the code.
- `--limit` sets a custom repetition limit (a non-negative integer) for patterns with many small repeats. It applies to every `--pattern` in the call, and to a scan:
  ```bash
  npx --yes lagune@0.15.0 regex --pattern '<PATTERN>' --limit <LIMIT>
  ```

#### How to read the verdict

Scan and `--pattern` report the same verdict: a pattern the scan lists already carries it, and a `--pattern` check prints exactly one of four words:

- **`safe`**: the pattern is not ReDoS-prone by this check. It passes.
- **`unsafe`**: the pattern is ReDoS-prone: some crafted input makes its matching work grow exponentially or polynomially with the input's length, through repetitions that can trade characters, a run the search rescans from every starting position, or a bounded repetition that multiplies its paths. So is a pattern with more quantifiers than the repetition limit allows. Always treat it as a real risk, without exception.
- **`undetermined`**: the analysis reached its work cap before it could settle the pattern, which leaves it neither `safe` nor `unsafe`.
- **`invalid regex`**: the pattern did not parse.

The hook exits non-zero when any pattern reads `unsafe`, and exits zero for `safe`, `undetermined`, `invalid regex`, and a clean scan.

#### Common safer shapes

- **Anchor it when it fits.** Add `^` at the start and `$` at the end when the pattern is meant to match the whole input.
- **Reshape it for a linear engine when one fits.** Prefer a form with nothing to backtrack over (for example a negated class `"([^"]*)"` instead of `"(.*?)"`).
- **Bound the repetition.** Prefer a small fixed range `{min,max}` (for example `\d{1,3}`) over an open-ended `.*`, `.+`, or `{1,}`.
- **Keep a run off its own delimiter.** A run that can also consume the character that opens it restarts its scan at every repeat of that character, so exclude it (for example `<([^<>]*)>` instead of `<([^>]*)>`).
- **Cap the input length** the pattern runs against, as a further guard.
- **When possible, avoid building the pattern at runtime.** Prefer a literal, fixed pattern over assembling one from variables or untrusted input.

## How to act on the result

- **In detect (detection):** an `unsafe` pattern is a finding. Describe it in plain language: what it is (a regular expression that can be made to hang on crafted input), why it matters (a denial-of-service risk), and the evidence (the function or area where the pattern lives). It flows through detect's normal steps and is tracked like any other finding. An `undetermined` pattern is not a finding on its own: read it by hand, and record it as one only when that reading shows it is ReDoS-prone.
- **In verify (proof):** the regex control holds only when the verdict is `safe`. An `unsafe` or `undetermined` verdict means the risk is not closed: record it as such and point back to harden.
