#!/bin/bash

set -e

echo '◯ update'
pu && (cd website && pu && bun update) && npm i && npm update && (npm audit fix || true)
npm run update:skills
echo '◉ update'

echo '◯ postupdate'
npm run lint:fix
echo '◉ postupdate'
