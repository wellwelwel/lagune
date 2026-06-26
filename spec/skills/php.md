# PHP-specific vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: the official PHP manual (Comparison Operators, Type Juggling, `unserialize`, the OOP magic methods, `extract`, `parse_str`), the "Saner string to number comparisons" RFC (PHP 8.0), the `spaze/hashes` magic-hash repository (the February 2014 proof-of-concept by spazef0rze), and the PHPGGC gadget-chain catalog.

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

### Type juggling and loose comparison (`==`), and "magic hashes"

PHP's `==` operator juggles types before comparing, so two values of different types can be made equal. The behavior that makes this a security problem: numeric strings are compared numerically, and a string of the form `0e[digits]` is a valid numeric string in exponential notation, parsed as `0 × 10^n = 0`. Two different "magic hash" strings that both start `0e` followed only by digits therefore both reduce to the float `0` and compare equal.

The original February 2014 proof-of-concept (spazef0rze, documented in the `spaze/hashes` repository) gives the exact collision, `md5('240610708') == md5('QNKCDZO')`:

```php
md5('240610708'); // "0e462097431906509019562988736854"
md5('QNKCDZO');   // "0e830400451993494058024219903391"
md5('240610708') == md5('QNKCDZO'); // both coerce to float 0 → true
```

The impact is authentication bypass: a password, HMAC, or token check written with `==` accepts a colliding value. Related juggling tricks reach the same place, `"any non-empty string" == true`, `"0" == 0`, and JSON-supplied types where `{"hmac": 0}` decodes to an integer that loosely equals a string check.

PHP 8's "Saner string to number comparisons" RFC narrowed this: comparing a number to a _non-numeric_ string now casts the number to string instead of the string to `0`, so `0 == "foo"` is `false` in PHP 8 (it was `true` in PHP 7). But the magic-hash collision is unaffected: both `0e...` hashes are _numeric_ strings, and two numeric strings are still compared numerically in PHP 8, so `"0e462..." == "0e830..."` remains `true`. Much code also still runs on PHP 7.x, where the broader `0 == "string"` juggling is live.

Safer shapes, applied where they fit:

- **Use strict comparison `===`/`!==`** everywhere a security decision rides on the result. It compares type _and_ value, so no coercion happens.
- **Use `hash_equals()`** for any hash, MAC, or token comparison. It is constant-time (timing-safe) and does an exact, type-aware comparison. Pass the known/expected value first and the user-supplied value second.
- **Use `password_hash()` / `password_verify()`** for passwords. `password_verify()` does its own constant-time, type-safe check and returns a strict boolean, so juggling never enters the comparison.
- The array-search helpers carry the same `==` footgun through their default: `in_array($needle, $haystack)` and `array_search($needle, $haystack)` compare loosely unless the third `$strict` argument is `true`. Pass `strict: true` when the values are security-relevant.
- `declare(strict_types=1)` does **not** fix this. It only switches scalar type declarations at function boundaries from coercive to strict, and is file-local. It has no effect on `==` or magic-hash behavior, so do not treat its presence as closing a loose-comparison finding. (It is still worth adding, alongside explicit validation of JSON-decoded types, so a value's type is what the check assumes.)

### `unserialize()` object injection and POP chains

PHP's `unserialize()` rebuilds arbitrary objects from a serialized string, and reconstruction invokes **magic methods**: `__wakeup()` (or `__unserialize()` on PHP 7.4+) fires the moment the object is unserialized. Others fire later as ordinary lifecycle events the attacker can steer, `__destruct()` when the object is destroyed, `__toString()` when it is used in string context. Attackers chain these methods across classes already loaded in the process (Property-Oriented Programming, "POP chains") to reach a dangerous sink. PHPGGC catalogs ready-made chains for Laravel, Symfony, Monolog, Guzzle, WordPress, and many more, so the gadgets usually live in vendor code, not the application's own.

`unserialize($_COOKIE['data'])`, or any untrusted serialized input, leads to file write/delete, SQL injection, or remote code execution depending on the classes in scope. A recent case is CVE-2026-3296 (Everest Forms WordPress plugin ≤ 3.4.3, CVSS 9.8, patched in 3.4.4), an unauthenticated object injection where stored entry meta is passed to `unserialize()` without `allowed_classes`.

#### The `phar://` trigger (object injection with no literal `unserialize` call)

A serialized object also reaches the sink through a different door. Any file operation on a `phar://` path (`file_exists`, `fopen`, `getimagesize`, `is_file`, and the rest) unserializes the Phar archive's metadata, with no literal `unserialize()` in the code. So a file function given an attacker-influenced path becomes an object-injection sink. The trigger was narrowed in PHP 8.0, but legacy code and older runtimes remain exposed. Trace the path argument of file operations, not just calls named `unserialize`.

Safer shapes, applied where they fit:

- **Never `unserialize()` untrusted input.** Use `json_decode()` / `json_encode()` for data interchange. `json_decode()` returns only `stdClass`, arrays, and scalars (associative arrays with `true` as the second argument), so it instantiates no application classes and invokes no magic methods.
- If `unserialize()` is unavoidable, pass **`['allowed_classes' => false]`** (no objects, every class becomes `__PHP_Incomplete_Class`) or a strict array of permitted class names. The manual is explicit that this is a mitigation, not a guarantee: untrusted input can still trigger autoloading, so it does not by itself make the call safe.
- As a stopgap on legacy code, wrap the serialized blob in an **HMAC** and verify it before unserializing. This is integrity-only defense-in-depth, not a fix: the underlying call is still a full object-injection primitive if the signing key leaks or a trusted producer is compromised. Keep dependencies patched, since the POP gadgets live in vendor libraries.
- Block or restrict the `phar://` stream wrapper where file operations take external paths, and validate the scheme of any user-influenced path.

### `extract()` and variable-variables (`$$var`) variable pollution

PHP's `extract()` imports an array's keys as local variables into the current symbol table, defaulting to `EXTR_OVERWRITE`. Combined with variable-variables (`$$key`) and the legacy `register_globals` / `import_request_variables` (both removed in PHP 5.4), attacker-controlled array keys overwrite existing local variables. `extract()` alone is enough: it does not need `$$key`.

`extract($_GET)` (or `$_POST` / `$_REQUEST`) lets an attacker set any local variable whose name they can supply as a key, the classic auth bypass by injecting `?auth=1`:

```php
$auth = 0;
extract($_GET);          // ?auth=1 overwrites $auth
if ($auth == 1) { /* private area */ }
```

Only keys that are valid PHP identifiers are imported, so this is a logic-level overwrite, not memory corruption.

Safer shapes, applied where they fit:

- **Don't call `extract()` on user input.** Read the keys you expect explicitly: `$user = $_GET['user'] ?? null;`. The PHP manual itself cautions against `extract()` on `$_GET`/`$_FILES` and untrusted data.
- The same applies to `parse_str()` and `mb_parse_str()` called **without** a result array: that single-argument form populates variables into the local scope exactly like `extract()`. It was deprecated in PHP 7.2 and the result parameter became mandatory in PHP 8.0, so always pass the result array. Treat `$$var` over user-controlled names the same way.
- If `extract()` is genuinely required, use **`EXTR_SKIP`** (never overwrite an existing variable) or `EXTR_PREFIX_ALL` with a prefix, and never extract before initializing security-relevant variables or calling `session_start()`.
- Historic note: a use-after-free in `extract()` when called with the `EXTR_REFS` flag (double-free on PHP 5.x, use-after-free on 7.x/8.x; SSD advisory, php-src GHSA-4pwq-3fv3-gm94) could reach native code execution, exploited via a `__destruct()` that unsets the reference mid-destruction. It is not triggered by default `extract()` usage, and the PHP team handled it as an ordinary bug rather than treating crafted-crash code as a security issue. Keep it in mind only where `EXTR_REFS` is used on attacker-shaped data.

## How to act on the result

- **In detect (detection):** each pattern you confirm is a finding. Describe it in plain language: what it is (the PHP behavior being abused, a loose `==` deciding a security check, an `unserialize()`/`phar://` path reviving live objects, or an `extract()`-family call overwriting locals), why it matters (the concrete impact, authentication bypass from a magic-hash collision, remote code execution via a POP chain, or variable pollution flipping an auth flag), and the evidence (the call and the source of its bytes or keys, the function or area where it lives). Trace the source to the sink: a `==` on a hash/token/password, an `unserialize`/file-op-on-`phar://` whose input is attacker-influenced even through a trusted-looking cookie or cache, or an `extract`/`parse_str`/`$$var` fed request data, is the finding. It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when the unsafe pattern is gone or properly guarded: a security comparison moved to `===`/`hash_equals()`/`password_verify()` with array searches passing `strict: true`, untrusted data parsed with `json_decode()` instead of `unserialize()` (or constrained with `allowed_classes` and the `phar://` path closed), and request data read by explicit keys instead of `extract()`/single-arg `parse_str`. An HMAC wrapper around `unserialize()`, the mere presence of `declare(strict_types=1)`, or a top-level-only guard does not close the risk. If the dangerous pattern still reaches untrusted input, record it as not closed and point back to harden.
