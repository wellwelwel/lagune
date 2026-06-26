# Container and workload configuration vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, <https://cheatsheetseries.owasp.org/>.

## Rules

- This skill audits and explains.
- By default, it never rewrites your code.

## What to look for

This terrain is the config-as-code a developer ships to build and run the application's container: the versioned `Dockerfile`, `docker-compose.yml`, and workload manifest (a Kubernetes `Pod`/`Deployment` `securityContext`). The defaults are permissive, root user, full capabilities, writable filesystem, no resource cap, so the typical mistake is leaving a default in place, and each is a concrete finding in the file. Cluster administration (RBAC, etcd, the API server, the dashboard, admission control, the service mesh) is the cluster operator's domain and stays out of scope. The line is who ships the file: if it lives next to the app and defines how _this_ workload runs, it is here.

### Container runs as root

By default a container process runs as UID 0, so a flaw that escapes the process (a runtime CVE, a writable mount) lands on the host with root-equivalent reach. The image runs as root unless the config drops it.

Safer shape: add a dedicated user in the `Dockerfile` and switch to it with `USER` (or run with `-u`/`runAsUser`), and assert it at the workload level with `runAsNonRoot: true` and a numeric `runAsUser` in the Pod `securityContext`. Prefer rootless mode (or Podman's rootless model) for the daemon itself, and confirm the running process is not UID 0, not merely that a `USER` line exists somewhere before a later step switched back.

### Over-privileged container (capabilities, privileged, privilege escalation)

A container with more kernel privilege than its job needs widens every escape. `--privileged` grants _all_ Linux capabilities and is almost never warranted, the default capability set is already broad, and a `setuid` binary inside can gain new privileges mid-run.

Safer shapes, applied where they fit:

- **Drop all capabilities, then add back only what is required:** `--cap-drop all --cap-add <needed>`, or `securityContext.capabilities: { drop: [ALL], add: [...] }`. Never run with `--privileged`.
- **Block privilege escalation:** `--security-opt=no-new-privileges`, or `allowPrivilegeEscalation: false`, so a `setuid`/`setgid` binary cannot raise privilege.
- **Keep a Linux Security Module on:** do not disable the default seccomp/AppArmor/SELinux profile, start from it and tighten per workload.

### Host exposure: the Docker socket and wide port bindings

Mounting the Docker daemon socket into a container (`-v /var/run/docker.sock:/var/run/docker.sock`) hands that container full control of the host's Docker, which is root-equivalent, read-only mounting only slows it down. Separately, publishing a port with `-p 8000:8000` binds it on _all_ interfaces, and Docker's own `iptables` rules are applied before host firewall `DENY` rules, so a service meant to be internal is silently exposed to the internet.

Safer shape: never mount `docker.sock` into an application container, and never enable an unauthenticated TCP daemon socket (`-H tcp://0.0.0.0`). Bind published ports to the interface that needs them, `-p 127.0.0.1:8000:8000` for a local-only service, and do not rely on a host firewall alone to contain a container port.

### Writable filesystem and unbounded resources

A container whose root filesystem is writable lets an intruder drop tools or tamper with the app at runtime, and one with no resource cap can be driven to exhaust host memory or CPU (a local DoS) or restart-loop.

Safer shape: run read-only (`--read-only`, or `readOnlyRootFilesystem: true`), mounting a `tmpfs`/`emptyDir` only for the paths that genuinely need to write, and mount volumes `:ro` where the container only reads. Set memory, CPU, file-descriptor, process, and restart limits (`--memory`, `--cpus`, `--ulimit`, `--restart`, or Kubernetes `resources.limits`).

### Insecure image build (base image, secrets, contents)

The `Dockerfile` itself decides what ships. A floating base tag (`FROM node`) makes the build non-reproducible and silently pulls in whatever `latest` becomes, an unpinned base or OS package undermines every later control. A secret passed as a build `ARG`, copied in, or left in an intermediate layer remains in the image history even if a later layer deletes it. Pulling in the whole build context or dev dependencies bloats the attack surface.

Safer shapes, applied where they fit:

- **Pin the base image** to an explicit tag or digest, prefer a minimal/distroless/`-alpine` base, and pin OS package versions.
- **Keep secrets out of the image.** Use build secret mounts (`--mount=type=secret`) or runtime secret injection, never a build `ARG` or a copied-in file, and use a multi-stage build so build-time material never reaches the final layer.
- **Ship only what runs:** install production dependencies only, use a `.dockerignore` to keep source, `.git`, and `.env` out of the context, and prefer `COPY` over `ADD`.
- **Scan the image** for known-vulnerable packages and leaked secrets in CI (Trivy, Grype, and a secret scanner), as a backstop to the above.

## How to act on the result

- **In detect (detection):** each insecure default in a `Dockerfile`, `docker-compose.yml`, or workload `securityContext` is a finding, one of the risks above. Record what it is (the file and the setting), why it matters (host-level reach on escape, an internet-exposed internal service, a leaked secret, a DoS), and the evidence (the line in the `Dockerfile`/compose/manifest). It flows through detect's normal steps and is tracked like any other finding.
- **In verify (proof):** the control holds only when each insecure default is replaced by the safer shape for its risk, confirmed against the running container and the built image, not the manifest line alone, since a later build step can undo an earlier setting. If the risk is not closed, record it as such and point back to harden.
