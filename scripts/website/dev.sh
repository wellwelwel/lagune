#!/usr/bin/env bash
set -euo pipefail

if [[ $# -eq 0 ]]; then
  exec npm -w website run start
fi

exec npm -w website run start -- --locale "$1"
