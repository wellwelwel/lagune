# network hook: Score URLs for SSRF

> Score one or many fetch destinations for SSRF, straight from the command line.

Canonical: https://lagune.ai/docs/hooks/network
Last updated: 2026-11-04

The `network` hook decides whether a server-side fetch destination is safe from **SSRF** (a request that can be aimed at internal services, cloud metadata, or private hosts). It is the deterministic engine behind the [`network` specialization](https://lagune.ai/docs/catalog), and you can run it yourself.

## Run it

Pass each destination with `--url`. The hook prints one word per destination, read in the table below.

**One destination**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Several destinations**

Repeat `--url` to score a whole allowlist or denylist in one call, one verdict per line, in order.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

It resolves the host the way the network does, so encoded forms of an internal address do not slip past: hex, octal, dotless decimal, shorthand, IPv6, and IPv4-mapped all read `private-target`. And where a sloppy validator and the real fetcher would read different hosts, the verdict is `parser-divergent`.

## How to read the verdict

| Verdict            | Meaning                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `safe`             | The destination connects to a public host, and a sloppy validator would read the same host.    |
| `private-target`   | The host resolves to a private, loopback, link-local, unspecified, or cloud-metadata address.  |
| `parser-divergent` | A sloppy text validator would read a different real host than the one the fetcher connects to. |
| `invalid url`      | The string does not parse as a URL, so there is nothing to fetch.                              |

Only `safe` is an allow. Treat `private-target`, `parser-divergent`, and `invalid url` all as a block.

### CLI options

| Option  | Value         | Description                                                           |
| ------- | ------------- | --------------------------------------------------------------------- |
| `--url` | a URL or host | Check one destination. Repeat to check several, one verdict per line. |

At least one `--url` is required. The destination is never a bare positional, so it cannot be mistaken for a flag.

**Why a flag value**

Each destination is passed as a flag value, never interpolated into the command. A value with quotes or backticks stays inert and cannot inject into the shell. Always wrap it in single quotes so your shell does not expand it first.

**What it does not cover**

The hook is pure and never resolves DNS, so two runtime gaps are out of scope: **DNS rebinding** (a name that resolves public when checked, internal when fetched) and **redirect chains** (a first hop that passes, then redirects inward). Close those by resolving once and connecting to the validated address, and by refusing redirects. It pins the reserved loopback names (`localhost` and the `.localhost` family) to internal with no lookup, but any other DNS name reads `safe`, because asserting it resolves inward would require resolution: the allowlist guards those, and is what this checker validates.

**Tip**

This is the same check the [`network` specialization](https://lagune.ai/docs/catalog) runs to prove a destination filter holds.

## Frequently Asked Questions

### How do I test a URL for SSRF?

Run the network hook. It scores a fetch destination and returns safe, private-target, parser-divergent, or invalid url. Only safe is an allow.

### What is a parser-divergent URL?

A URL that different parsers read differently, which is a classic SSRF bypass. The network hook flags it rather than allowing it.
