#!/usr/bin/env bash
set -euo pipefail

plugin="${1:?Name the plugin to bundle, such as claude.}"
bundle="${2:?Name the directory to assemble the bundle into.}"
overlay="scripts/plugins/$plugin"
sharedPaths=(skills README.md LICENSE)
enginePaths=(package.json catalog lib/bin lib/THIRD_PARTY_LICENSES.txt)
paths=("${sharedPaths[@]}" "${enginePaths[@]}")
packingOptions=(-cf - --exclude='skills/*/agents')

case "$plugin" in
  antigravity)
    paths+=(assets/logo.png)
    ;;
  claude | grok)
    paths+=(.claude-plugin/plugin.json assets/logo.png)
    ;;
  cursor)
    paths+=(.cursor-plugin/plugin.json .cursor-plugin/marketplace.json assets/logo.png)
    ;;
  droid | gemini) ;;
  hermes)
    paths+=(lib/mcp/tools.json)
    ;;
  *)
    echo "No bundle is declared for the \"$plugin\" plugin." >&2
    exit 1
    ;;
esac

if [[ -e "$bundle" ]]; then
  echo "Refusing to assemble the $plugin bundle into \"$bundle\", which already exists." >&2
  exit 1
fi

mkdir -p "$bundle"
# Git Bash's tar opens a folder after -C only in the shell's own path form, never as a Windows path
bundle="$(cd "$bundle" && pwd)"
tar "${packingOptions[@]}" "${paths[@]}" | tar -xf - -C "$bundle"

if [[ -d "$overlay" ]]; then
  tar -cf - -C "$overlay" . | tar -xf - -C "$bundle"
fi

# Hermes Agent's catalog installs a plugin from its root, while the default branch keeps it one level down
if [[ "$plugin" == hermes ]]; then
  cp .hermes-plugin/__init__.py "$bundle/__init__.py"
fi
