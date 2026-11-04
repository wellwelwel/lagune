# TODO

## 1. Watch **Copilot CLI** and **Kimi Code** upstream (external bug)

**Problem.** Both start a plugin's server in the plugin's own folder with no way to name the project, so both keep the **npx** fallback. The `/playground` skill's `copilot` and `kimi` probes recheck each new version.

- **Copilot CLI**: github/copilot-cli#4234 asks for a project variable or roots for plugin servers.
- **Kimi Code**: no placeholder expands and no roots are advertised. Its native build also runs a `node` command as **Kimi Code** itself, so the engine's MCP server, which starts each call with its own runtime, would start **Kimi Code** instead of **Node.js**.

**To close**, once either harness passes the project, through a variable or the MCP roots the engine already reads:

- **Copilot CLI**: a `plugin-copilot` bundle with a `.plugin/plugin.json` naming its `.mcp.json`, which passes the project and sets `"deferTools": "never"`, the default branch's `.plugin/marketplace.json` entry moved to the branch, and the install page's tool rules, `--allow-tool='lagune(lagune_read)'` and its sibling. Plan 02 follows.
- **Kimi Code**: the engine's MCP server first picks a real **Node.js** whenever its own runtime is not one, the way the native plugin entries already find it on the search path. Then a `plugin-kimi` bundle whose overlay manifest declares the server, installed with `/plugins install https://github.com/wellwelwel/lagune/tree/plugin-kimi`. Plan 12 follows.
