# C / C++-specific vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: MITRE CWE-134 ("Use of Externally-Controlled Format String"), CERT C rule FIO30-C ("Exclude user input from format strings"), the GCC manual (`-Wformat-security`, `-Wformat=2`, `_FORTIFY_SOURCE`), and the wu-ftpd `SITE EXEC` advisory CVE-2000-0573.

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

C and C++ inherit a family of variadic output functions, the `printf` family and its relatives, that read their arguments from the stack or registers according to the conversion specifiers in a format string they are given. The risk below is intrinsic to that design: the function cannot know how many arguments were actually passed, so whoever controls the format string controls how many values are read and, with one specifier, where a value is written.

### Uncontrolled format string (`printf(user_input)`, CWE-134)

A variadic function in the `printf` family decides how many arguments to consume, and of what type, purely from the conversion specifiers in its format string. It has no independent knowledge of the real argument count. Per MITRE CWE-134, the bug "stems from the fact that there is no realistic way for a function that takes a variable number of arguments to determine just how many arguments were passed in." So when the format string is attacker-controlled instead of a fixed literal, the attacker dictates the read/write behavior of the call.

The dangerous pattern is passing untrusted data as the format argument itself, with no fixed format literal in front of it:

```c
printf(userName);            // VULNERABLE: userName is the format string
printf("%s", userName);      // SAFE: fixed literal, userName is just an argument
```

Why it matters, by specifier:

- `%x`, `%p`, and `%s` make the call read arguments that were never passed, walking adjacent stack memory and leaking it (information disclosure: stack contents, addresses that defeat ASLR, secrets).
- `%n` is the dangerous one: it _writes_. As CWE-134 puts it, "The %n operator will write the number of characters, which have been printed by the format string thus far, to the memory pointed to by its argument ... a malicious user may use values on the stack to create a write-what-where condition. Once this is achieved, they can execute arbitrary code." A controlled write-what-where primitive is the path from a logging bug to arbitrary code execution.

The impact is not theoretical. The wu-ftpd `SITE EXEC` format-string bug (CVE-2000-0573) gave remote root: per MITRE, "The lreply function in wu-ftpd 2.6.0 and earlier does not properly cleanse an untrusted format string, which allows remote attackers to execute arbitrary commands via the SITE EXEC command."

The same flaw lives in every variadic formatter that takes a format string, not only `printf`. Audit the whole family wherever the format argument is non-literal: `fprintf`, `sprintf`, `snprintf`, `vprintf`/`vfprintf`/`vsnprintf`, `syslog` (its message argument is a format string), `err`/`warn` (`errx`/`warnx`), and the wide-character `wprintf` variants. In C++, `std::printf` and friends carry it identically. `std::format`/`std::print` (C++20/23) instead require a compile-time-checked format string, which removes the class when the format is a literal.

Safer shapes, applied where they fit:

- **Always pass a fixed format literal**, and route the untrusted value through a `%s` (or the matching specifier) as an _argument_: `printf("%s", user_input)`, never `printf(user_input)`. This is CERT C rule FIO30-C, "Exclude user input from format strings." The same shape applies to `fprintf("%s", ...)`, `syslog(priority, "%s", ...)`, and the rest of the family.
- **Make the compiler reject it.** Build with `-Wformat -Wformat-security` (or the broader `-Wformat=2`) and promote it to an error with `-Werror=format-security`. Per the GCC manual, `-Wformat-security` "warn[s] about uses of format functions that represent possible security problems ... at present ... about calls to `printf` and `scanf` functions where the format string is not a string literal and there are no format arguments, as in `printf (foo)`." That is exactly the `printf(user_input)` shape.
- **Add runtime hardening.** Compile with `-D_FORTIFY_SOURCE=2` (or `3`) at optimization `-O1` or higher. glibc's fortified `printf` family adds checks and, per the feature's design, refuses a `%n` directive when the format string sits in writable memory, blunting the write-what-where path even if a non-literal format slips through.
- **Avoid `%n` entirely**, and prefer output APIs that do not interpret a runtime-supplied format string at all (in C++, `std::format`/`std::print` with a literal, or `fputs`/`fwrite` for raw text).

## How to act on the result

- **In detect (detection):** each call you confirm is a finding. Describe it in plain language: what it is (a `printf`-family or `syslog`/`err`-family call whose format argument is a non-literal value the program does not fully control), why it matters (the concrete impact: `%x`/`%s` leaking stack memory, or `%n` creating a write-what-where condition that leads to arbitrary code execution), and the evidence (the call site and the source of the format string, traced from untrusted input through to the variadic sink). A format argument that is a variable, a concatenation, or any expression other than a string literal is the thing to flag. It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when every flagged call passes a fixed format literal with the untrusted data demoted to an argument (`printf("%s", x)`), or has been moved to an API that does not interpret a runtime format string. Compiler enforcement (`-Werror=format-security` / `-Wformat=2`) and runtime hardening (`-D_FORTIFY_SOURCE`) building clean is strong supporting evidence, not a proof on its own, since fortify only covers the calls and paths it can see. If any reachable call still takes a non-literal, attacker-influenced format string, the risk is not closed: record it as such and point back to harden.
