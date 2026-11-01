# TODO

What remains of plan zero B, which puts **Lagune**'s engine inside each plugin that can carry it (`.plans/plugins/00b-engine-over-mcp.md`). The code, the tests, the install pages, and the reconciled plans are done. Each harness plan in `.plans/plugins/` holds its research and probes. The evidence of the latest probes sits in each plan's `transcripts/<plan>/engine/` folder, whose `00-environment.txt` lists the exact commands, and the isolated installs and homes they used are under `temp/<harness>/`, ready to reuse.

## 1. Run the acceptance with a real model

**Problem.** Plan zero B is done only when each plugin's acceptance run shows the first engine call going through the tools with the server on, and through the pinned **npx** with the server removed. Only **Claude Code** measured it with a real model. The stub form, which reads the offered tools from a logged request and scripts one call proving the engine ran in the project, passed for **Factory Droid**, **Grok Build**, **Muse Code**, **Gemini CLI**, **Qwen Code**, **OpenCode** 1.x and 2.x, and **Pi**. **Cursor** ran neither, since every **Cursor** command needs an account.

**To close.** For each of those harnesses, with a sign-in or an API key the owner provides:

- Install the plugin the way its install page says, or from its bundle as the stub probe did while the release has not published the branches and archives yet.
- In a fresh copy of the `image-upload-service` fixture outside the repository, run the charter command with "An image upload service for a small team", in the form the harness plan records, headless or in the least interactive mode the harness offers, leaving every tool unapproved where the harness allows it.
- Read the first engine call from the transcript. With the server on, it must be a call to `lagune_read` or `lagune_write`, or a tool search followed by one. With the server's declaration removed from the installed plugin, it must be the pinned `npx --yes lagune@<version>` command.
- Keep the transcripts beside the stub evidence, and record the result in the harness plan's live run section and in plan zero B's per-harness table.

For **Cursor**, the same run also checks whether `agent plugin marketplace update` follows a marketplace added with `--git-ref plugin-cursor`. Its install page removes and adds the marketplace again until a run shows that it does.

## 2. Decide the **Muse Code** route

**Problem.** **Muse Code** starts a plugin's server in the folder **Muse Code** was launched from, not in the session's workspace. The engine refuses only its own folder and the root of the file system, so a session opened with `--workspace` from another folder, or through a `muse serve` started elsewhere, makes the engine read and write `.lagune/` in that other folder without any error. The install page tells the user to start **Muse Code** in the project.

**To close**, the owner chooses one route:

- **Keep the branch.** Nothing changes, and a later **Muse Code** release that hands a plugin server its workspace gets a new probe.
- **Go back to the default branch.** Remove the `muse` bundle (its bundle script case, its overlay, its entry in the release workflow's branch matrix, its row in the shared bundle test, and the branch checks in its own test), point the install page back at `muse plugins marketplace add lagune wellwelwel/lagune` with the engine installed in the project for the sandbox, and update plan 05 and plan zero B's table.

## 3. Decide the **Codex** route

**Problem.** **Codex**'s plugin format expands no variable in a server declaration and passes no project folder. A server with no working folder starts in the project but cannot name the engine's path, and one started in the plugin folder serves a folder the engine refuses. So no plugin branch can carry the engine, and **Codex** keeps the **npx** fallback, which its sandbox blocks unless the engine is installed in the project.

**To close**, the owner chooses one route:

- **Keep the fallback**, which closes this item.
- **Make an exception to plan zero B's first decision.** The default branch's **Codex** manifest declares the server inline, running the pinned `npx --yes lagune@<version> mcp`, which starts in the project, outside the sandbox, and downloads the engine on each version's first start. It takes the release's pin step moving that version too, an exception for **Codex** in the test that keeps servers off the default branch, the up-front loading setting (`omit_tools_from = ["deferred"]`), a longer startup timeout, the per-tool approval rule on the install page, and updates to plan 09 and plan zero B's table.

## 4. Teach the engine MCP roots, then give **Antigravity CLI** its branch

**Problem.** **Antigravity CLI** starts a plugin's server in the plugin's own folder and expands no project variable, so the engine refuses to serve, and the plugin stays on the default branch with the **npx** fallback. MCP roots are the only channel that could name the workspace, and the engine does not read them yet. The `agy` binary carries roots plumbing, but whether it lists the workspace is unverified.

**To close:**

1. Probe first, with no account needed: a stub MCP server declared in a throwaway plugin's `mcp_config.json` logs the client's capabilities and its `roots/list` reply, in a headless **Antigravity CLI** session against a stub of the **Gemini** API, as plan 08's probes ran. If `agy` lists no workspace root, record that in plan 08 and close this item.
2. If it does, teach the engine's MCP server to take the project from the client's roots when it has no project argument and its working folder is its own. It asks once the session is initialized, accepts exactly one `file://` root, asks again when the client reports a roots change, and stays fail-closed otherwise. End-to-end tests run it against a client that answers roots.
3. Then add the `plugin-antigravity` bundle. Its native manifest moves from the default branch into its overlay, with its version entry in the release config, beside an `mcp_config.json` that loads both tools up front. The bundle script, the release matrix, the shared bundle test, and the **Antigravity CLI** test take it in. The install page installs `https://github.com/wellwelwel/lagune/tree/plugin-antigravity` and shows the tool rules, `mcp(lagune_lagune/lagune_read)` and its sibling, which a run must confirm. Moving the manifest off the default branch also ends **Hermes Agent**'s discovery warning about it. Plan 08 and plan zero B's table follow.

## 5. Give **Hermes Agent** a branch for its catalog

**Problem.** **Hermes Agent** installs the default branch, so it runs the engine through **npx**. A native **Hermes Agent** plugin cannot declare an MCP server, but its `register(ctx)` can register tools, and a catalog entry can pin a commit of a branch that carries the engine.

**To close:**

1. Add a `plugin-hermes` bundle whose root holds `plugin.yaml`, listing both tools under `provides_tools`, and `__init__.py`, standard library only, beside the skills and the engine. The module registers the nine skills as today's does, plus the two tools, each relaying one call to the engine the plugin carries, run on **Node.js** from the session's working folder and refusing when there is none. It reuses the engine's own tool definitions and call validation, for example by serving each call through the engine's MCP server, never a copy of them.
2. Test the module with a recording context, as the current **Hermes Agent** test does, and wire the bundle script, the release matrix, the release config, and the shared bundle test.
3. Probe an install of a bare repository's `plugin-hermes` commit with `--ref <sha> --enable`, then `hermes plugins validate --install-deps`, which also runs the install scan.
4. The owner opens the catalog pull request pinning that commit, as the final plan's tutorial describes, and the install page moves to `hermes plugins install lagune`. Plan 15 and plan zero B's table follow.

## 6. Watch **Copilot CLI** and **Kimi Code** upstream

**Problem.** Both start a plugin's server in the plugin's own folder with no way to name the project, so both keep the **npx** fallback.

- **Copilot CLI**: github/copilot-cli#4234 asks for a project variable or roots for plugin servers.
- **Kimi Code**: no placeholder expands and no roots are advertised. Its native build also runs a `node` command as **Kimi Code** itself, so the engine's MCP server, which starts each call with its own runtime, would start **Kimi Code** instead of **Node.js**.

**To close**, once either harness passes the project, or item 4's roots cover it:

- **Copilot CLI**: a `plugin-copilot` bundle with a `.plugin/plugin.json` naming its `.mcp.json`, which passes the project and sets `"deferTools": "never"`, the default branch's `.plugin/marketplace.json` entry moved to the branch, and the install page's tool rules, `--allow-tool='lagune(lagune_read)'` and its sibling. Plan 02 follows.
- **Kimi Code**: the engine's MCP server first picks a real **Node.js** whenever its own runtime is not one, the way the native plugin entries already find it on the search path. Then a `plugin-kimi` bundle whose overlay manifest declares the server, installed with `/plugins install https://github.com/wellwelwel/lagune/tree/plugin-kimi`. Plan 12 follows.

## 7. Protect the plugin branches

**Problem.** The release publishes the plugin branches append-only, but nothing on **GitHub** stops a force push, a deletion, or an unsigned commit on them.

**To close.** The owner, with admin access, adds a repository ruleset targeting `plugin-*` that blocks force pushes, restricts deletion, and requires signed commits, which the release's publish tool already makes through the API.
