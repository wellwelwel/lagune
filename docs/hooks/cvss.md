# cvss hook: Score a CVSS v4.0 vector

> Score one or many CVSS v4.0 vectors from the command line, with the same arithmetic as the FIRST calculator, and read each one back in plain words.

Canonical: https://lagune.ai/docs/hooks/cvss
Last updated: 2026-10-04

The `cvss` hook scores a **CVSS v4.0 vector** and prints its score and severity band, the rating [`/lagune.plan`](https://lagune.ai/docs/commands/plan) writes on each fix and [`/lagune.prove`](https://lagune.ai/docs/commands/prove) on each advisory. It is the deterministic engine behind those ratings, with the same arithmetic as the [FIRST calculator](https://www.first.org/cvss/calculator/4.0), and you can run it yourself.

## Run it

Pass each vector with `-v`. The hook prints one line per vector: its score and band.

**One vector**

```bash
node ./.lagune/hooks/cvss.mjs -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**Several vectors**

Repeat `-v` to score several at once, one line each, in order.

```bash
node ./.lagune/hooks/cvss.mjs \
  -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**In plain words**

Add `-e` to read each metric back in plain words. When Threat or Environmental metrics move the score, the Base score alone comes first.

```bash
node ./.lagune/hooks/cvss.mjs -e -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## How to read the result

| Band       | Score       |
| ---------- | ----------- |
| `None`     | 0.0         |
| `Low`      | 0.1 to 3.9  |
| `Medium`   | 4.0 to 6.9  |
| `High`     | 7.0 to 8.9  |
| `Critical` | 9.0 to 10.0 |

A vector with only Base metrics scores the flaw itself, assuming the worst: every security requirement High and the flaw attacked in the wild. Environmental metrics (`MAV` and the other modified metrics, plus `CR`, `IR`, and `AR`) settle it for one deployment, and the Threat metric (`E`) for what is known about exploitation.

An invalid vector prints `invalid vector:` and what is wrong, and the hook exits non-zero.

### CLI options

| Option      | Alias | Value               | Description                                                               |
| ----------- | ----- | ------------------- | ------------------------------------------------------------------------- |
| `--vector`  | `-v`  | a `CVSS:4.0` vector | Score one vector. Repeat to score several, one line per vector, in order. |
| `--explain` | `-e`  |                     | Add each metric in plain words under every rating line.                   |

At least one `-v` is required. The vector is never a bare positional, so it cannot be mistaken for a flag.

**Why a flag value**

Each vector is passed as a flag value, never interpolated into the command. A value with quotes or backticks stays inert and cannot inject into the shell. Always wrap it in single quotes so your shell does not expand it first.

**What it does not cover**

Only CVSS v4.0: a v2.0, v3.0, or v3.1 vector is rejected rather than scored, since **Lagune** rates every finding in v4.0.

**Tip**

The plan phase's validation reruns this same arithmetic on every CVSS line, so a score that drifted from its vector is caught before the plan is accepted.

## Frequently Asked Questions

### How does Lagune calculate a CVSS score?

The cvss hook follows the FIRST reference calculator for CVSS v4.0, so a vector scores exactly as it does on the FIRST site.

### Can I score a CVSS v3.1 vector with it?

No. Lagune rates every finding in CVSS v4.0, and the hook rejects any other version rather than scoring it.

### What does the -e flag do?

It reads each metric back in plain words and shows the Base score beside the overall one, so anyone can see what the vector says and how the project context moved it.
