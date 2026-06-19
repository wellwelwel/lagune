# JavaScript-specific vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

### Remote code execution (RCE)

`eval`, the `Function` constructor, `setTimeout`/`setInterval` called with a string, and (in Node) `vm` run without real isolation, all turn data into executable code. Any one of them reached by untrusted input is arbitrary code execution.

Safer shape: remove the dynamic path entirely. Parse with `JSON.parse`, dispatch through a lookup map keyed by an allowlisted value, and pass functions (never strings) to the timers.

The same applies wherever the code spawns a subprocess. In Node, `child_process.exec` and `execSync` run their argument through a shell, so any untrusted value spliced into the command string becomes shell injection, and a reachable one is full command execution. `spawn`/`execFile` with a string and `shell: true` carry the same risk.

Safer shape: never build a shell command from input. Call `execFile`/`spawn` with the binary and an argument array (no `shell` option), so the input stays a single argument and is never parsed as shell syntax. Keep the binary fixed and allowlist it rather than letting input choose what to run.

### Prototype pollution

Writing to a key an attacker controls can reach `__proto__`, `constructor`, or `prototype` and mutate `Object.prototype`, so every object in the process inherits the injected property. It typically enters through a deep merge, a recursive `Object.assign`-style copy, or building an object from parsed user input (a query string, JSON body, or config).

The same risk applies to **any object that gains properties dynamically from a key the application does not fully control**, not just objects built straight from request input. A cache, a registry, a lookup keyed by a value that flows in from anywhere upstream, even one that looks internal, is exposed the moment that key can be `__proto__`, `constructor`, or `prototype`. The dangerous operation is the bracket assignment with a non-literal key, wherever it happens.

The risk: a single polluted prototype can flip an auth flag, inject a default that bypasses a check, or set up further execution. It is a process-wide effect from one untrusted write.

Safer shapes, applied where they fit:

- **Use a null-prototype object** as the target when building from untrusted keys, so there is no prototype to pollute:

  ```ts
  Object.create(null);
  ```

- **Guard the dangerous keys explicitly** when a plain object must be kept, defining `__proto__` as an own property instead of letting the assignment walk the prototype:

  ```ts
  export const safeObject = (
    target: Record<string, unknown>,
    key: string,
    value: unknown
  ): void => {
    if (key === '__proto__') {
      Object.defineProperty(target, key, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      target[key] = value;
    }
  };
  ```

  Reject or skip `constructor` and `prototype` keys on the same path.

### Unsafe deserialization and parser reviver abuse

`JSON.parse` with a `reviver`, or any library that revives typed objects from untrusted JSON, can run attacker-influenced logic during parsing or rebuild a dangerous object. Treat a reviver that touches prototypes or instantiates classes from the payload as a finding.

### Loose-equality and coercion bypass

`==` and implicit coercion let crafted input satisfy a check it should fail (for example `0 == '0e...'`, array-to-string coercion, or `Number`/`parseInt` accepting trailing garbage). When a security decision (an auth comparison, a token check, an amount validation) rides on a loose comparison or a coerced value, the comparison can be gamed.

Safer shape: use `===`, compare validated and normalized values, and bound-check parsed numbers rather than trusting the coercion.

## How to act on the result

- **In detect (detection):** each pattern you confirm is a finding. Describe it in plain language: what it is (the JavaScript behavior being abused), why it matters (the concrete impact, for example process-wide pollution or arbitrary code execution), and the evidence (the function or area where it lives). It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when the unsafe pattern is gone or properly guarded (a null-prototype target, a removed `eval`, an argument-array subprocess call, a strict comparison). If the dangerous pattern still reaches untrusted input, the risk is not closed: record it as such and point back to harden.
