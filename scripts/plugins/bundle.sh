#!/usr/bin/env bash
set -euo pipefail

plugin="${1:?Name the plugin to bundle, such as claude.}"
bundle="${2:?Name the directory to assemble the bundle into.}"
overlay="scripts/plugins/$plugin"
sharedPaths=(skills README.md LICENSE)
enginePaths=(package.json catalog lib/bin lib/THIRD_PARTY_LICENSES.txt)
packingOptions=(-cf -)

case "$plugin" in
  claude)
    pluginPaths=(.claude-plugin/plugin.json assets/logo.png "${enginePaths[@]}")
    packingOptions+=(--exclude='skills/*/agents')
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
tar "${packingOptions[@]}" "${sharedPaths[@]}" "${pluginPaths[@]}" | tar -xf - -C "$bundle"

if [[ -d "$overlay" ]]; then
  tar -cf - -C "$overlay" . | tar -xf - -C "$bundle"
fi
