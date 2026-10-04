#!/bin/bash

set -e

echo '◯ update'
pu && (cd website && pu) && npm i && npm update --workspaces --include-workspace-root && (npm audit fix || true)
echo '◉ update'

echo '◯ postupdate'
npm run lint:fix
echo '◉ postupdate'
