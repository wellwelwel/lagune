#!/usr/bin/env bash
set -euo pipefail

if [[ $# -eq 0 ]]; then
  exec bun run --cwd website start
fi

exec bun run --cwd website start --locale "$1"
