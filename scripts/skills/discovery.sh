#!/usr/bin/env bash
set -euo pipefail

expected='lagune lagune.charter lagune.detect lagune.harden lagune.plan lagune.prove lagune.repair lagune.specialize lagune.verify'

listed="$(
  npx --yes skills@1.7.4 add . --list 2>&1 \
    | sed -E 's/\x1b\[[0-9;]*m//g' \
    | sed -nE 's/^│ +(lagune(\.[a-z]+)?) *$/\1/p' \
    | sort \
    | paste -sd ' ' -
)"

if [[ "$listed" != "$expected" ]]; then
  echo "The skills CLI lists: ${listed:-nothing}" >&2
  echo "Expected:             $expected" >&2
  exit 1
fi

echo "The skills CLI lists the nine commands."
