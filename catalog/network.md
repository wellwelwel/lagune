# Network-specific vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, <https://cheatsheetseries.owasp.org/> and <https://owasp.org/www-community/attacks/>.

## Rules

- This specialization audits and explains.
- By default, it never rewrites your code.

## What to look for

This terrain is a **destination the server takes from a request**: a URL, host, port, endpoint, or UNC share it connects to, as a webhook, a link preview, or an import "from URL" does, the internal services that connection reaches, and a redirect, forward, or form `action` it hands onward. A local file or module the server opens by name is `path` or `interpreter`, a navigation the browser builds (`location.href`) is `browser`, exact `redirect_uri` matching is `federation`, and the authorization a forward's landing target needs is `access-control`.

### How to check a destination

Call `lagune_read` with `command` set to `network` and an `--url` before each destination in `arguments`, such as `["--url", "<URL-OR-HOST>", "--url", "<URL-OR-HOST>"]`, to score every host an allowlist or denylist names and every literal the validation compares against. It reads each URL as the WHATWG URL parser does, the one browsers and Node's `fetch` use, resolving hex, octal, dotless, shorthand, IPv6, IPv4-mapped, percent-encoded, Unicode, and trailing-dot hosts with no DNS lookup, so its verdicts hold only for a client that parses the URL the same way. It prints one verdict per line, in order:

- **`safe`**: a public address, or a DNS name it never resolves, that a sloppy validator reads as the same host.
- **`private-target`**: a private, carrier-grade, loopback, link-local, unspecified, or cloud-metadata address, `localhost` and the `.localhost` family, or a `file:` URL with no host, which reads the server's own disk.
- **`parser-divergent`**: a sloppy validator reads a different real host than the client connects to (userinfo or backslash confusion).
- **`invalid url`**: no host it can read. Treat it as a block.

The hook exits non-zero when any line reads `private-target` or `parser-divergent`.

### Fetch of a user-supplied destination

The server opens a destination the request names: a full URL, a host or port for a socket, a download path, an endpoint a feature dials. It then reaches what the user cannot, such as an internal service, loopback, the cloud metadata endpoint, or a password-less database. A UNC share (`\\host\share`) handed to a file API makes a Windows server authenticate outbound to that host, leaking its credential hash, and the checker reads it `safe`.

Safer shapes, where they fit:

- **Choose the destination in code**, from a known set the request names only by key, or by an allowlist of hosts that denies by default.
- **Take a host or IP field, not a full URL,** and build the request yourself.
- **Where any host must be accepted, check the resolved address**: resolve the name yourself, reject it when any A or AAAA record is private, loopback, or link-local, and connect to the address you checked.

### Dangerous schemes

A fetch client left at its default opens any scheme the URL names, such as `file://`, which reads the server's own files (`/etc/passwd`, its `.env`, its private keys), `gopher://`, which writes raw bytes to an internal service's port, such as a password-less store, and `ftp://`. The checker judges a destination by its host, never by its scheme, so `gopher://` or `ftp://` to a public host reads `safe`.

Safer shape: restrict the client to `http` and `https`.

### Host blocklists and textual checks

A denylist or regex compares the URL's text while the client connects to the number the host resolves to, and every internal address has another written form:

- **Numeric encodings**: decimal, hex, octal, and mixed. The raw string `0x7f000001` matches no rule while the parsed `hostname` may already read `127.0.0.1`, so run the checker on the exact form the filter sees.
- **Ranges the list never enumerated**: RFC1918 (`10.x`, `172.16-31.x`, `192.168.x`), the carrier range (`100.64.0.0/10`), and the unspecified address.
- **IPv6** loopback and private space, compressed, expanded, and IPv4-mapped.
- **Userinfo `@` and backslash confusion**, where the filter and the client read different hosts.
- **Unicode look-alikes** that normalize to a forbidden name.

Safer shape: allowlist the known-good hosts, compared through a tested address parser, never the raw text.

Does not close it: a longer blocklist, or a regex over the URL.

### DNS rebinding and redirect chains

Both pass the checker and any check made before the connection: a name that resolves public when checked and internal when fetched, and an allowed host that answers with a redirect inward, which `fetch`, `axios`, and `requests` follow by default.

Safer shapes: connect to the address you validated, and disable redirects in the client or re-run the whole check on every `Location`.

Does not close it: validating the resolved address and then fetching by name, or validating only the URL the request named while the client follows redirects.

### Cloud metadata endpoint

The link-local metadata endpoint (`169.254.169.254`, also served under an internal name such as `metadata.google.internal`) answers any local request with the instance role's temporary credentials and its bootstrap data, often plaintext secrets. The checker flags the address in every encoded form but reads the name `safe`.

Safer shape: keep the endpoint out of reach with the destination controls above, and give the instance role least privilege. The metadata service's hardened mode (token required, hop limit of one) is a layer, never the fix.

Does not close it: a denylist of the address alone, which misses the name, or the hardened mode alone.

### Implicit trust in the internal network

An internal service that skips authentication because only the internal network reaches it, such as an admin panel, an operator tool, a route that trusts a loopback caller, or a password-less data store, serves anyone who borrows the server's position through a fetch.

Safer shape: authenticate every internal service and require a password on every data store, wherever it sits, and restrict egress so a request that slips through cannot leave for an attacker's host.

### Blind SSRF

A fetch whose response the user never sees still leaks: through **timing** (a reachable host answers fast, an unreachable one hangs), **partial responses** (a different status or error for an open or closed port), and **out-of-band callbacks** to a server the attacker watches. A webhook verifier, a link checker, and any fire-and-forget fetch need the same destination controls as one that returns content.

Safer shape: the destination controls above, with one timeout and one response for every failure.

Does not close it: hiding the response body or the error.

### Open redirect

The server sets a `Location` header from a request value, such as a `next`, `return_to`, or `url` parameter (`response.sendRedirect(request.getParameter("url"))`, `header("Location: " . $_GET['url'])`, `Response.Redirect(url)`, `redirect_to params[:url]`). The link starts on the trusted domain and lands on an attacker's look-alike login, and it chains: an OAuth `redirect_uri` accepted for starting with the domain bounces the authorization code to the attacker, and a redirect on an allowed host carries a fetch past an SSRF allowlist. A string check on the target (`startsWith`, `contains`, a regex) loses to userinfo (`https://example.com@evil.com`), a protocol-relative target (`//evil.com`, `/\evil.com`), URL-encoding, a backslash (`https://evil.com\@example.com`), and a look-alike subdomain (`example.com.evil.com`). The checker reads every public host `safe`, so it never tells your origin from an attacker's.

Safer shapes, where they fit:

- **Map a short name, ID, or token** from the request to a full URL server-side.
- **Prepend your own origin** to a request-supplied path that begins with `/` (`redirect("https://example.com" + path)`).
- **Allowlist an external target by its parsed host**, through the language's URL parser (`new URL()`, `urlparse`, `java.net.URI`), and reject a target that reads `parser-divergent` or `private-target`.
- **Show an interstitial** for an unavoidable external redirect, naming the full destination and asking the user to confirm leaving.

Does not close it: a string check on the target, a relative target checked only for a leading `/`, or an origin prepended to a value that need not begin with `/`, which `@evil.com` turns into userinfo.

### Server-side forward

A forward (`getRequestDispatcher(fwd).forward(...)`) to a target taken from the request reaches an administrative page after the access check already passed on the entry route.

Safer shape: forward only to a target from a code-defined set, and authorize the landing target itself.

Does not close it: the entry route's access check.

### Form action hijacking

A form whose `action` attribute is rendered from a request parameter sends its fields, its CSRF token, and any credentials to the attacker's URL.

Safer shape: hard-code the `action`.

## How to act on the result

- **In detect (detection):** each destination built from a request value is a finding, whether the server connects to it or hands it onward, and so is each internal service the code trusts for its network position. Cite an encoded or confused form as a bypass of a host filter only once it passes the filter's own check and reads `private-target` or `parser-divergent`. When the server connects to a destination taken from a request, also record once under Not determined a side quest asking whether the server's outbound traffic is restricted and, on a cloud instance, whether its metadata service requires the hardened mode and its role holds least privilege, named by what these layers guard, never by a finding's name.
- **In verify (proof):** the control holds once the code carries the safer shape of its block, and no destination the code builds can reach an internal target, or hand the user or their form to an origin the attacker picks, by any path. Run the checker on every destination the control lets through: `private-target` or `parser-divergent` on one keeps the control open. A form you fed it yourself, to test what the control must reject, is the exception: there the control holds only once the code rejects that form. Read the client itself for the address it connects to and the redirects it follows. A deployed layer, such as egress rules or the metadata service's hardened mode, never keeps a finding open: point the summary at detect's side quest for it.
