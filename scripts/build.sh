#!/usr/bin/env bash
set -euo pipefail

metafiles="$(mktemp -d)"

if [[ -z "$metafiles" || ! -d "$metafiles" || -n "$(ls -A "$metafiles")" ]]; then
  echo "Refusing to use \"$metafiles\" as the temporary metafiles directory." >&2
  exit 1
fi

trap 'rm -rf -- "${metafiles:?}"' EXIT

rm -rf lib

bundle=(
  --bundle
  --platform=node
  --format=esm
  --target=node22
  --tree-shaking=true
  --minify-syntax
)

esbuild src/bin/index.ts "${bundle[@]}" \
  --outfile=lib/bin/index.js \
  --metafile="$metafiles/bin.json" \
  --banner:js='#!/usr/bin/env node'

esbuild src/hooks/regex/worker.ts "${bundle[@]}" \
  --outfile=lib/bin/worker.js \
  --metafile="$metafiles/worker.json"

esbuild src/plugins/opencode.ts "${bundle[@]}" \
  --outfile=lib/plugins/opencode.js \
  --metafile="$metafiles/opencode.json"

esbuild src/plugins/pi.ts "${bundle[@]}" \
  --outfile=lib/plugins/pi.js \
  --metafile="$metafiles/pi.json"

chmod +x lib/bin/index.js

# Hermes Agent's plugin, written in Python, registers the engine tools from these definitions
tsx tools/engine-tools.ts lib/mcp/tools.json

DASHBOARD_METAFILE="$metafiles/dashboard.json" bash scripts/dashboard/build.sh

tsx tools/third-party-licenses.ts lib/THIRD_PARTY_LICENSES.txt "$metafiles"/*.json

# Qwen Code reads its manifest from the package root, which the repository root must never carry
cp scripts/plugins/qwen/qwen-extension.json qwen-extension.json
