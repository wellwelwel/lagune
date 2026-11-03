#!/bin/bash

set -e

echo '◯ update'
pu && (cd website && pu && bun update) && npm i && npm update && (npm audit fix || true)
echo '◉ update'

echo '◯ postupdate'
npm run lint:fix
echo '◉ postupdate'
