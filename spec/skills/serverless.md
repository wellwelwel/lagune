# Serverless / FaaS configuration vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, <https://cheatsheetseries.owasp.org/> and the OWASP Serverless Top 10 (<https://owasp.org/www-project-serverless-top-10/>).

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

This terrain is **a function deployed to a Functions-as-a-Service platform** (AWS Lambda, Azure Functions, Google Cloud Functions, and the like): the handler code and the deploy config-as-code shipped with it, the IAM role and policy, the trigger and authorizer, the VPC/egress settings, the environment. Each function is its own trust boundary, and the single theme is **a function granted, trusted, or exposed more than its one job needs**: an over-broad role, an unvalidated event, a context assumed clean, a secret left in reach. The config is versioned and shipped by the developer (a `serverless.yml`, a SAM/CDK/Terraform function block, an IAM policy JSON), so a permissive default in it is a concrete finding. The cloud-account perimeter (org-wide guardrails, account boundaries, the platform's own runtime) is the operator's domain and out of scope: the line is the function and the config that defines how it runs and what it may reach.

### Over-permissioned function role (least privilege)

The highest-impact serverless mistake is a function whose IAM role grants far more than it uses: `"Action": "*"` on `"Resource": "*"`, a high-privilege role shared across many functions, or a database/API key scoped to everything. Each function is a distinct principal, so a flaw in one (an injection, a dependency compromise, a logic bug) inherits the whole role, turning a single-function compromise into account-wide reach: read every table, invoke every function, touch every bucket.

Safer shape: one minimal role per function, scoped to the exact actions and the exact resources that function needs (`dynamodb:GetItem`/`PutItem` on one table ARN, not `dynamodb:*` on `*`). Never share one high-privilege role across functions, and scope every credential the function holds (database, third-party API) to the smallest set of operations.

### Unvalidated event input

Every trigger delivers attacker-influenceable data, not only the obvious HTTP one. An API Gateway request body, an S3 object-created event, a Pub/Sub or SQS message, an IoT payload, all are untrusted input, and a function that trusts the event shape, or trusts that "only our own bucket fires this", is exposed. The injection that follows (SQLi, NoSQL operator injection, command injection, unsafe deserialization, XSS in a value later rendered) is the bug the `interpreter` and `browser` surfaces cover. The serverless framing adds two traps: developers often validate the HTTP path while trusting non-HTTP sources blindly, and the event carries platform metadata that should never be processed as data.

Safer shape: treat every event payload from every trigger as untrusted, even an internal one, validate it against a strict schema (type, length, format, allowed fields) before use, and strip unexpected fields and metadata. Carry the value into any query, command, or output through the parameterized/encoded interface its sink requires (the `interpreter` surface owns the per-sink defense).

### Cold-start and execution-context leakage

A platform reuses a warm execution environment across invocations to save cold-start cost, so the runtime is **not clean between calls**. Anything left in a global/static variable, a module-level cache, or the writable scratch space (`/tmp`) survives into the next invocation, which may serve a different user. A secret cached in a global, a previous request's data left in `/tmp`, or a user-specific value held in module scope can leak across tenants.

Safer shape: do not assume an empty or private context. Keep per-request and sensitive data out of global/static scope, and treat `/tmp` as shared, clearing anything user-specific. Fetch secrets fresh (or from a request-scoped cache) rather than pinning them in a global at module load, and for the most sensitive workloads use a single-use execution environment where the platform offers one.

### Function-chaining and trigger abuse

Functions invoke other functions and write to event sources that trigger more functions, so one compromised or over-trusting function can drive the chain: invoke a privileged downstream function, or drop an object/message that fires another with data the first controls. A trigger reachable without authentication, or a function-to-function call that trusts the caller implicitly, lets an attacker step through the workflow. The authentication and authorization controls are the `access-control` surface, applied here to every trigger and every internal call.

Safer shapes, applied where they fit:

- **Authenticate and authorize every trigger**, an API Gateway authorizer (JWT/IAM), a signed or authorized event source, not an open endpoint or an implicitly-trusted queue.
- **Verify function-to-function calls** with the platform's workload identity or a signed token, so a downstream function authorizes its caller rather than assuming the invocation is legitimate.
- **Throttle and rate-limit** invocations to blunt abuse and denial-of-wallet (an attacker driving cost through forced executions), since serverless autoscaling turns volume into a billing and availability problem.

### Excessive network reach

A function with unrestricted outbound access can be turned into an exfiltration or SSRF pivot once its code is influenced, reaching internal services, the cloud metadata/credential endpoint, or an attacker's host. Many platforms default to open egress.

Safer shape: disable network access the function does not need, place functions that must reach private resources in a private subnet with controlled, allowlisted egress, and isolate sensitive functions (payment, auth) from general-purpose ones. The destination-validation and metadata-endpoint mechanics are the `network` surface, applied to the function's outbound calls.

### Secrets and supply chain in the function package

Two deployment-time exposures. A **secret** hardcoded in the source or passed as a plain environment variable is readable by anyone who reads the code, the config, or the environment (env-var secrets are visible to the whole process and often to logs). A **dependency or layer** pulled into the deployment package runs with the function's permissions, so a compromised or unvetted package is code execution inside the function.

Safer shapes, applied where they fit:

- **Fetch secrets from a managed vault or parameter store at runtime** (with the platform's local caching extension where available) rather than environment variables, use ephemeral credentials (STS, workload identity federation), and rotate automatically. A hardcoded secret is the deterministic secret-scan finding, not a judgment call.
- **Vet and pin the deployment's dependencies and layers**, scan them (`npm audit`, `pip-audit`, `safety`), ship a minimal package, and validate layer integrity by checksum (the `interpreter` surface's package-and-integrity guidance applied to the function bundle).
- **Mask secrets and PII in logs**, since centralized function logs (CloudWatch, Azure Monitor, GCP Logging) otherwise persist whatever the handler prints (the log-as-evidence concern from the `interpreter` surface).

## How to act on the result

- **In detect (detection):** each function granted, trusting, or exposing more than its job needs is a finding. Record what it is (the function and the weak setting, one of the risks above), why it matters (the impact, from account-wide reach to a leaked secret), and the evidence (the IAM policy, the deploy config, the handler, the trigger definition). The injection, authz, egress, and secret facets are each confirmed by their own surface, so trace event data to a real sink before claiming an injection. It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when each function runs least-privileged and self-contained: a minimal per-function role with no `*` in action or resource, every event input validated against a schema before use, no per-request or sensitive data persisted in globals or `/tmp` across invocations, every trigger authenticated and authorized and every function-to-function call verified, egress restricted to what the function needs, secrets fetched from a vault rather than baked into code or env vars, and dependencies and layers vetted and pinned. If a single compromised or coerced function can still reach beyond its scope, act on unvalidated event data, leak across invocations, drive the chain, pivot the network, or expose a secret, the risk is not closed: record it and point back to harden.
