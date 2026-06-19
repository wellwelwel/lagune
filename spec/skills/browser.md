# Browser / client-side vulnerabilities

> This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

### DOM-based XSS

The DOM sinks execute markup or script from their input: `innerHTML`, `outerHTML`, `document.write`, `insertAdjacentHTML`, `Range.createContextualFragment`, and assigning a `javascript:` URL to `href`/`src`/`action`. Setting `el.setAttribute('on...', ...)` or an event-handler property from data does the same. Any of these fed by a value that originates outside the code is XSS.

Common sources that reach these sinks: `location` (`href`, `search`, `hash`), `document.referrer`, `name`, a `postMessage` payload, a value read back from storage, and any server response rendered without encoding.

Safer shape: write text through `textContent`, build nodes with `createElement`/`append`, and keep untrusted values out of HTML-parsing sinks. When HTML is unavoidable, sanitize with a vetted library (for example DOMPurify) before it reaches the sink, and validate that a URL's scheme is `http`/`https` before assigning it.

### Cross-window messaging (`postMessage`)

A `message` listener that acts on `event.data` without checking `event.origin` trusts any page that can reach the window, so a malicious frame or opener can drive the handler. The mirror risk is a `postMessage` call that sends sensitive data with `'*'` as the target origin, leaking it to whatever document occupies the frame.

Safer shape: in the receiver, check `event.origin` against an allowlist before reading `event.data`, and validate the shape of the data. In the sender, pass the exact expected origin, never `'*'`, for anything sensitive.

### DOM clobbering

Naming an element with `id`/`name` can shadow a global or a property the code reads (for example `window.config`, `form.action`), so attacker-injected markup can replace a value the script trusts without running any script. It turns a markup-injection foothold into logic tampering.

Safer shape: do not read configuration or trusted references off the DOM or globals by name. Resolve them explicitly (`document.getElementById` with a known check, module-scoped constants) and verify a value is the type you expect before using it.

### Client-side storage of sensitive data

`localStorage`, `sessionStorage`, and non-`HttpOnly` cookies are readable by any script on the origin, so a single XSS reads everything in them. Tokens, session identifiers, and personal data held there are exposed by design.

Safer shape: keep session and auth tokens in `HttpOnly`, `Secure`, `SameSite` cookies the page's JavaScript cannot read. Treat web storage as untrusted input on read: never feed a stored value straight into a DOM sink or a security decision.

### Open redirect and URL sinks

Building a navigation target (`location.assign`, `location.href`, `window.open`, a link's `href`) from input lets an attacker redirect the user to a hostile origin, and a `javascript:`/`data:` scheme there re-enters the XSS path.

Safer shape: validate the destination against an allowlist of paths or origins, force a known scheme, and prefer relative paths built by the app over a full URL taken from input.

## How to act on the result

- **In detect (detection):** each pattern you confirm is a finding. Describe it in plain language: what it is (the browser behavior being abused), why it matters (the concrete impact, for example script execution in the user's session or token theft), and the evidence (the function or area where it lives). It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when the unsafe pattern is gone or properly guarded (a non-HTML sink, an origin check on the listener, a token moved off web storage, an allowlisted redirect). If the dangerous pattern still reaches untrusted input, the risk is not closed: record it as such and point back to harden.
