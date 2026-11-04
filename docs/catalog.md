# Catalog: On-Demand Security Specializations

> How the specializations in your project's catalog are loaded, by a phase on demand, and by you directly.

Canonical: https://lagune.ai/docs/catalog
Last updated: 2026-11-04

🧠 **Lagune**'s specializations are focused, language-agnostic security knowledge modules that load only on demand, never by default. They are not commands. Your project's catalog is the set it uses: the built-in specializations of its [categories](https://lagune.ai/docs/categories) plus its own. The detect and verify phases reach for them while they run, and you can load one directly any time.

**Overview**

*The interactive catalog overview lives on the web page. Every built-in specialization is in the table below.*

**How it Works**

## Run yourself

To use a specialization directly, ask your agent to load it with `read catalog <name>` and write the task in the same prompt. The knowledge then acts on what you asked for. This works in any prompt, even one unrelated to the **Lagune** flow.

For example, a direct free-form prompt to generate a safe **RegExp** collection with **Python**:

```prompt
Load the regex specialization with `npx lagune read catalog regex`, then create a collection of regular expressions in @src/utils/regex.py to validate emails and usernames.
```

This uses a deterministic hook to test each **RegExp** against **ReDoS**, keeps the safe ones, and produces something like:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Try the ReDoS checker**

Test a pattern yourself at [**devina.io/redos-checker**](https://devina.io/redos-checker).

## The built-in specializations

The built-in specializations are grouped into [**categories**](https://lagune.ai/docs/categories). This is the set that ships with **Lagune**:

| Specialization        | Category                    | Focus                                                                          |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `regex`               | `owasp`                     | **ReDoS:** patterns that explode on crafted input.                             |
| `network`             | `owasp`                     | **SSRF & redirects:** user-supplied fetch or redirect destinations.            |
| `interpreter`         | `owasp`, `lovable`          | **Code injection:** `eval`, dynamic include, name dispatch.                    |
| `sql`                 | `owasp`                     | **Relational databases:** injection, raw ORM calls, privileges, engine reach.  |
| `path`                | `owasp`                     | **Filesystem paths:** traversal, null-byte, NTFS streams, planting.            |
| `upload`              | `owasp`                     | **File uploads:** type/signature, malicious content, storage, limits.          |
| `access-control`      | `owasp`, `lovable`          | **Authn/authz/session:** IDOR, mass assignment, tenants, sessions.             |
| `credential-endpoint` | `owasp`, `lovable`          | **Guessing & bots:** brute force, spraying, stuffing, throttling.              |
| `federation`          | `owasp`                     | **Token trust:** OAuth/OIDC, SAML, JWT validation, QR login.                   |
| `http-request`        | `owasp`                     | **Request provenance:** CSRF, CORS misconfig, spoofed client-IP.               |
| `transport`           | `owasp`                     | **Channel security:** TLS config, HTTPS/cleartext, HSTS, pinning.              |
| `crypto`              | `owasp`, `lovable`          | **Crypto at rest:** weak/custom algorithms, CSPRNG, key management.            |
| `secrets`             | `owasp`, `lovable`          | **Hardcoded credentials:** keys, tokens, passwords literal in source.          |
| `api-endpoint`        | `owasp`                     | **Non-REST surfaces:** GraphQL, gRPC, WebSocket authz, DoS, schema.            |
| `payment`             | `owasp`, `lovable`          | **Checkout flow:** verify gateway server-side, signed callbacks, idempotency.  |
| `xml`                 | `owasp`                     | **XML parsing:** XXE, external entities, billion-laughs expansion.             |
| `csv`                 | `owasp`                     | **Formula injection:** spreadsheet cells starting `=`/`+`/`-`/`@`.             |
| `container`           | `owasp`, `infra`            | **Container config:** root, capabilities, socket mount, image hardening.       |
| `infra`               | `infra`                     | **Infrastructure as code:** Terraform, Dockerfile, GitHub Actions.             |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS functions:** least-privilege IAM, event input, context, secrets.        |
| `llm`                 | `ai`, `lovable`             | **AI/LLM risks:** prompt injection, agency, RAG, MCP, output.                  |
| `supabase`            | `lovable`                   | **Supabase backend:** RLS off by default, AI-misgenerated policies, key model. |
| `browser`             | `javascript`, `lovable`     | **Client-side risks:** XSS, CSP, framing, storage, etc.                        |
| `javascript`          | `javascript`                | **Language-level risks:** RCE, prototype pollution, etc.                       |
| `python`              | `python`                    | **Language-level risks:** `pickle` RCE, class pollution, `-O`, etc.            |
| `rust`                | `rust`                      | **`unsafe` soundness:** UB from safe callers, `transmute`, overflow.           |
| `java`                | `java`                      | **Deserialization & mobile code:** `readObject` chains, object hijack.         |
| `ruby`                | `ruby`                      | **Deserialization & `open`:** `Marshal`/YAML revival, pipe quirk.              |
| `php`                 | `php`                       | **Type juggling & `unserialize`:** magic hashes, POP chains.                   |
| `go`                  | `go`                        | **Typed-nil & data races:** `nil != nil`, shared-memory goroutines.            |
| `c-cpp`               | `c-cpp`                     | **Format strings:** `printf(user_input)`, `%n` write-what-where.               |
| `dotnet`              | `dotnet`                    | **Platform-level risks:** `BinaryFormatter` RCE, `@Html.Raw`, enum gaps.       |

Most built-in knowledge is distilled from OWASP. See [**OWASP Sources**](https://lagune.ai/docs/references/owasp-sources) for the full mapping of each specialization to its canonical OWASP attack and Cheat Sheet pages. A few stack-specific modules draw from the vendor's own guidance instead: `supabase`, for instance, comes from the Supabase docs and CVE-2025-48757.

## Your own specializations

The built-ins grow by adding one knowledge file plus one index row, never a new command. You add your own the same way, with [`/lagune-specialize`](https://lagune.ai/docs/commands/specialize): point it at an article or a topic and it distills a new specialization into your project, the file under `.lagune/catalog/` and its entry in `.lagune/configs.json`. Your own are always in the catalog, whatever its categories, and one of yours shadows a built-in of the same name.

**Internally, Lagune loads specializations automatically, on demand**

When the detect or verify phase hits a context a specialization covers, it loads that specialization with `read catalog <name>` itself. This happens automatically, as part of the phase. You do not do it by hand for this to work.

## Discover what is available

To list your project's catalog from the terminal, one specialization per line with its tags:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

A `[required]` specialization always applies, whatever the work. Which built-ins the list holds depends on your project's [**categories**](https://lagune.ai/docs/categories).

**Specializations are not loaded by default**

The relevant knowledge is pulled in for what the project actually is, instead of every check running by default.

## Frequently Asked Questions

### What is a Lagune specialization?

A focused, language-agnostic security knowledge module that loads only on demand, never by default. It is not a command like the agent skills.

### What is a project's catalog?

The specializations the project uses: the built-ins of its categories plus its own. While no category is recorded, it uses OWASP alone.

### Are specializations loaded by default?

No. They load only on demand, for what the project actually is.

### How do I load a specialization directly?

In the same prompt as the task, ask your agent to run npx lagune read catalog <name>.
