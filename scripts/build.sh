#!/usr/bin/env bash
set -euo pipefail

rm -rf lib

esbuild src/bin/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --target=node22 \
  --tree-shaking=true \
  --minify-syntax \
  --outfile=lib/bin/index.js \
  --banner:js='#!/usr/bin/env node'

chmod +x lib/bin/index.js

bash scripts/dashboard/build.sh
