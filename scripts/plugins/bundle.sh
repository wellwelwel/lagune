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
  claude | grok | muse)
    paths+=(.claude-plugin/plugin.json assets/logo.png)
    ;;
  cursor)
    paths+=(.cursor-plugin/plugin.json .cursor-plugin/marketplace.json assets/logo.png)
    ;;
  droid | gemini) ;;
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
tar "${packingOptions[@]}" "${paths[@]}" | tar -xf - -C "$bundle"

if [[ -d "$overlay" ]]; then
  tar -cf - -C "$overlay" . | tar -xf - -C "$bundle"
fi
