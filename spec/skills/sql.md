# SQL database vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, "SQL Injection Prevention", "Query Parameterization", and "Database Security" Cheat Sheets, CWE-89, and the MySQL, MariaDB, PostgreSQL, SQL Server, Oracle, and SQLite manuals.

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

This terrain is the **relational database the application queries**: the statement the code builds, the driver that carries it, the account it connects with, and the engine features that account can reach. A single unbound value is worth more here than almost anywhere else, because the engine that parses it also reads files, writes files, and on some engines runs commands. Non-relational stores stay with `interpreter`, key handling with `crypto`, connection secrets with `secrets`, the ownership rules a query is supposed to enforce with `access-control`, and the Supabase flavor of row-level security with `supabase`.

### A query assembled as a string

The statement is built by joining text with a value from outside the code, through concatenation, string interpolation, a format helper, a template, or a builder handed an already-finished string. Whatever the value contains is parsed as part of the statement, so it can close the literal it sits in and continue the query as instruction. The reach is the connection's reach: every table the account can read, every row it can change or delete, and on a permissive account the filesystem and the operating system underneath. The query does not have to show its output to be exploitable, since a **blind** finding recovers the same data one answer at a time through any difference the caller can observe, a changed page, an error, or a delay the engine was instructed to take. An endpoint that displays nothing is not evidence the risk is closed.

Safer shape: bind every value as a parameter, so the engine receives the statement and its data separately and never parses the data as instruction. This is the first defense in OWASP's order, ahead of validation, and it holds whatever the value contains. Bind every variable value, including the ones that look harmless, because a value that is not attacker-controlled today becomes one after a refactor.

Does not close it: escaping the value before pasting it in. OWASP marks escaping strongly discouraged and states it cannot guarantee protection in all situations, CWE-89 says manual escaping will not make an application secure, and the failure modes are concrete. An escape routine is specific to one engine and one configuration, a connection character set can absorb the escape character into a valid multi-byte character, an engine mode that turns off backslash escaping voids it entirely, and pattern wildcards are left untouched. Stripping quotes, rejecting keywords, and a web application firewall in front are the same class of decoy: they filter the text while the parser still receives the value.

### The parts of a statement a parameter cannot reach

Binding covers values, never the structure around them. A table name, a column name, a schema name, and the sort direction cannot be parameters, so a request that chooses which column to sort by is either spliced in as text or does not work at all. The engines fail differently and neither failure is safe: one raises a syntax error, another accepts the placeholder and silently sorts by a constant string. A passing test therefore proves nothing here, and this is where a codebase that parameterizes everywhere still injects.

Safer shape: keep the structure in the code and let the request choose only a key into it, mapping a validated key to a code-defined name and rejecting anything absent from the map. Where a name genuinely must be dynamic, pass it through the engine's identifier-quoting facility rather than pasting it, remembering that quoting an identifier is not binding it, so the allow-list stays behind it. OWASP treats a request that picks its own table name as a design problem worth rewriting rather than guarding.

Then there are the positions where binding is legal but easy to get wrong:

- **Row limits and offsets** bind on most engines. Where a driver refuses, convert the value to an integer in the code instead of pasting the text.
- **A list of values** needs one placeholder per element, generated from the length of the list. Joining the elements into a single string and binding that as one parameter matches nothing, and joining them into the statement injects.
- **A pattern match** binds the pattern as a value, yet the wildcards inside it stay meaningful. A user searching for a literal wildcard changes what the pattern matches, and a leading wildcard forces a full scan of the table. Escape the wildcards for the engine before binding.
- **A path into a document column** is a string the engine parses a second time, so a path built from a request is its own injection surface even when the statement around it is bound.

### Binding that never reaches the engine

Some drivers assemble the finished statement themselves and send one complete string, so the code reads as parameterized while the engine receives concatenated text carrying the driver's own escaping. PHP's PDO does this by default on MySQL, and the emulation stays on until the connection explicitly turns it off. The consequence is sharpest when a hand-built fragment, an identifier or a clause, is mixed with bound parameters in the same statement: a crafted fragment can desynchronize the driver's own parser so that a placeholder character inside the fragment is mistaken for a real one and bound text lands where the code never intended. This survives passing the fragment through the driver's quoting function, which is why the rule is about mixing rather than about raw concatenation. The class was reported across several PDO drivers in 2025 and patched upstream.

Safer shape: turn client-side emulation off so the engine prepares the statement, keep the runtime and driver patched, and never mix a hand-built fragment with bound parameters in one statement. Read the connection options rather than the query code, since a framework or a configuration layer may set this either way without the query site showing it.

Does not close it: the presence of prepare and bind calls. Whether the binding reaches the engine is a connection setting, not a coding style, so the audit question is where the statement is assembled.

### Values that come back out of the database

A value the application stored earlier is untrusted when it is read back and used to build another query. This is **second-order** injection, and it defeats the usual mental model, where trust is decided at the edge and everything past it is clean. Storage is not a trust boundary, it is a place tainted data waits. The pattern is easy to miss because the write and the read are different features, so nothing at the vulnerable query site looks like input at all.

Safer shape: treat every read from your own tables, and every value from a queue, a cache, or an internal service, as a source that must be bound like any request parameter. Trace the sink, not the origin.

Does not close it: escaping on the way in. Escaping is consumed by the parser at insert time, so the stored value holds the original character and the escaping is simply gone by the time the value is read back and pasted into the next statement.

### SQL the database builds for itself

Moving a query inside the database changes who assembles the string, not whether it is assembled. A stored procedure, function, or trigger that concatenates its arguments into a statement and executes it dynamically injects exactly like application code, and every engine offers the facility: an execute-immediate form, a dynamic execution procedure, a prepare-from-string statement. OWASP names this directly for auditors, telling them to look for dynamic execution inside procedure bodies, and CWE-89 warns that using these features to build and run query strings re-introduces the risk the procedure was supposed to remove. A sound procedure can also be called unsafely from the outside, with a user-controlled value pasted into the invocation.

There is a second, quieter cost on some engines: making the application depend on procedures can push its account toward broader rights than it needed, so a breach that once yielded read access now yields the whole database.

Safer shape: keep procedure bodies static wherever possible, since a procedure that never builds a string needs no binding at all. Where dynamic SQL inside the database is unavoidable, use the engine's own binding form for the dynamic statement rather than pasting values into it, and treat any identifier inside that statement text by the allow-list rule above, optionally through the engine's identifier-quoting function. Grant the procedure only the rights it needs.

Does not close it: the fact that it is a stored procedure. OWASP treats procedures as equivalent to prepared statements only when implemented safely, meaning no unsafe dynamic construction inside, and the engine vendors say the same about their own dynamic-execution helpers: choosing the parameterized helper is not protection unless the parameters are actually declared and bound.

### The raw escape hatch in an ORM or query builder

Every ORM and query builder ships a door back to raw SQL, and it is the sink most likely to appear in a modern codebase. The names differ by ecosystem, yet the shape is constant: one call takes a safely-built query with bound values, its neighbor takes a string the caller assembled. A raw fragment appended to a condition, an ordering, or a grouping clause carries the whole risk of the first block while sitting inside code that otherwise looks safe, and reviewers skim past it because the surrounding file is full of safe calls. Some libraries make this harder to see by accepting a structured object whose keys or nested operators become query syntax, so a request body that arrives as an object rather than a string reshapes the query without any string concatenation appearing anywhere. Several such gaps have been assigned advisories in widely used builders.

Safer shape: use the library's parameter form, which usually means the variant that takes the value separately from the fragment. Where a raw fragment is genuinely required, keep every variable part of it a bound parameter and every identifier an allow-listed, code-defined name. Constrain the shape of any request value that reaches a query builder to the type the field expects, so an object cannot arrive where a string was meant. Keep the library patched, since this class of gap is fixed in point releases.

Does not close it: using an ORM. An ORM is safe for the queries it builds, and the raw call is precisely the place it stops building them.

### The account the application connects with

Injection decides whether an attacker can speak to the database, and the account decides what the database will do when they speak. A runtime account that is the built-in administrator, owns the schema, or holds rights to change it turns a read-only-looking finding into schema changes, data destruction, and on several engines file access. The signals are visible in code and configuration: a connection string using the administrative user, a framework setting that lets the application create or alter tables on startup, one credential shared by the application and its migrations.

Safer shape: give the runtime account only the data rights the application actually uses, and keep schema changes on a separate credential used by the migration step alone. Deny it ownership of the database, administrative rights over the instance, and any file-access privilege. Where the platform supports it, authenticate the connection through the platform's own identity instead of a stored password, which removes the credential rather than protecting it.

Credentials belong outside the source and outside the repository. A configuration file must be unreadable to the web server, restricted to the user that needs it, and absent from version control. The general handling rules live in `secrets`.

### Row-level security that is on but bypassed

Where the database itself enforces which rows a caller may see, the enforcement is only as good as the identity the connection carries. A policy is silently inert for the table's owner and for any account granted an explicit bypass, and it collapses entirely when the application connects through one shared, privileged account and decides ownership in its own code, because the database then sees a single trusted caller for every user. A pooled connection that carries the previous request's identity is the same failure with worse timing.

Safer shape: run application queries under an account that policies actually apply to, never the table owner, an administrator, or a bypass-granted role, and make the per-user identity part of the request's own session state rather than a value pasted into a query. Verify the policies from the outside, by asking for another user's row as a normal user and confirming the database refuses. The application-side ownership rules live in `access-control`, and the Supabase form of this, where the key model decides whether policies apply at all, lives in `supabase`.

Does not close it: seeing that row-level security is enabled on the table. Enabled and enforced are different states, and the difference is the connecting account.

### Engine features that reach files and the operating system

A relational engine is not only a query processor. Depending on the product and its configuration, it can read a file from the host into a table, write a result out to a path, load an extension, attach another database file, invoke a command interpreter, or run a program and consume its output. Those features are the reason an injection finding escalates from data disclosure to control of the host, and they are also standalone risks wherever the application enables them without needing them. This is largely a configuration surface, so audit it wherever the project keeps infrastructure definitions, container files, engine configuration, and startup scripts.

Safer shape: run the vendor's own hardening step, remove sample databases and default accounts, and confirm that command execution, runtime-loaded code, and file-access privileges are off for every account the application uses. Where server-side file access is genuinely required, scope it to a single directory rather than granting it outright. On several products these features ship disabled in current versions, which makes the check a drift detection rather than a fix, and finding one enabled is itself the finding.

### A file read where the client is the victim

One case inverts the usual direction. In the MySQL and MariaDB protocol, a local-file load is initiated by the **server**, which tells the client which file to send. A malicious, modified, or intercepted server can therefore request any file the client process can read, and in a web application the client is the web server, so the reach is the application's own configuration, keys, and credentials. This turns an injection finding into disclosure of the host's files, and it needs no privilege on the database at all.

Preconditions keep this from being universal, and they must be checked before flagging. The capability has to be enabled on both sides, current MySQL ships it disabled by default while MariaDB's default differs, and driver defaults split, with most modern clients off and some older ones on. The auditable pattern is any connection option that turns it back on.

Safer shape: leave the client-side capability off. Where a legitimate import needs it, pin it to a single directory through the driver's own option, and connect only to servers whose certificate is verified. Note that server-side file restrictions do not help here, because the file being read is the client's.

### The connection between the application and the database

An unencrypted connection exposes the credentials and every row in transit to anyone on the path. Encryption alone is not the control, though: a mode that encrypts without verifying the server's certificate and hostname still accepts an impostor, which is the same interception that makes the previous block work. The modes are named differently per engine and the weaker ones are frequently chosen because they connect without further setup, so read the actual mode rather than the presence of a TLS setting. Alongside this, check what the database listens on, since an engine bound to a public interface with a default port and a weak account is reachable without any application bug at all.

Safer shape: require encryption and full verification of the certificate chain and hostname, and keep the database on a private network reachable only by the services that need it. Transport specifics beyond the database live in `transport`.

### What the database hands back

Three exposures show up in ordinary, non-injectable code. An engine error returned to the caller carries table names, column names, and often the failing statement, handing an attacker the schema and turning a blind finding into a fast one. A query that selects every column ships password hashes, tokens, and personal data to layers that only needed a name, from where they reach logs, caches, and API responses. And query logging, slow-query logs, and ORM debug output write the statement and its values into files, so binding a value correctly still records it in plain text when the parameters are logged.

Safer shape: return a generic failure to the caller and keep the engine's message in the server-side log, select only the columns the feature uses, and keep statement logging off in production or configured to omit parameter values. Personal data that must be stored belongs in a form that limits the damage of a dump, which `crypto` covers.

### Queries without a ceiling

A request that controls how much work the database does is a denial-of-service surface. An endpoint that returns every row of a growing table, a search that scans the whole table because its pattern starts with a wildcard, a filter that a caller can make arbitrarily expensive, and a transaction left open holding locks all consume the resource the whole application shares. A connection pool makes the failure abrupt: once its connections are held by slow queries, every other request queues behind them, so one expensive endpoint takes down features that never touch it.

Safer shape: bound the result set by default with pagination the caller cannot opt out of, set a statement timeout on the engine or the connection so a single query cannot run indefinitely, keep transactions short, and size the pool with a timeout that fails fast rather than queueing without limit.

## How to act on the result

- **In detect (detection):** each confirmed path from an untrusted value to a statement the engine parses, and each of the configuration risks above, is a finding, named by its risk block. Describe it in plain language: what it is (the value pasted into a query, the raw escape hatch, the over-privileged account, the enabled feature), why it matters (the concrete reach, from reading one table to controlling the host), and the evidence (the query site, the connection option, the configuration file). Trace the value: a statement built entirely from code-defined text is not a finding, and a value read back from your own database is. Where a risk depends on a version or a driver default, confirm the actual one in use before recording it. It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when untrusted input can no longer change what the engine parses, and when the account behind the connection cannot exceed what the application needs. That means every variable value is bound and the binding reaches the engine, every identifier comes from a code-defined set, dynamic SQL inside the database binds its own parameters, the raw escape hatches carry no assembled values, the runtime account holds no schema, file, or administrative rights, row-level policies apply to the account that actually connects, and the dangerous engine features are confirmed off. Prove the data-exposure and limit controls by observation: an error returned to the caller reveals no schema, a listing endpoint refuses to return everything at once, and a query that runs too long is stopped by the engine. If a crafted value can still change the shape of a statement, or a compromised connection still reaches beyond the application's data, the risk is not closed: record it as such and point back to harden.
