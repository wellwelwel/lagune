#!/usr/bin/env bash
set -euo pipefail

version="$(node -p "require('./package.json').version")"

grep -rlE 'lagune@[0-9]+\.[0-9]+\.[0-9]+' skills catalog \
  | xargs sed -i.bak -E "s/lagune@[0-9]+\.[0-9]+\.[0-9]+/lagune@${version}/g"

find skills catalog -name '*.bak' -delete

echo "skills/ and catalog/ now call lagune@${version}."
