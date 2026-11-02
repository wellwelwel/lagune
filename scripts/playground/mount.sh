#!/usr/bin/env bash
set -euo pipefail

repository="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
playground="$repository/playground"
plugin="$playground/plugin-claude"
project="$playground/project"
registry="$playground/registry"
npmCache="$playground/npm-cache"
fixture="${1:-}"
fixtures="$repository/.claude/skills/simulate/fixtures"
marketplace="lagune-playground"

if [[ -n "$fixture" && ! -d "$fixtures/$fixture" ]]; then
  echo "No fixture is named \"$fixture\". Choose one of: $(cd "$fixtures" && echo *)." >&2
  exit 1
fi

if [[ -n "$fixture" || ! -d "$project" ]]; then
  rm -rf "$project"
  mkdir -p "$project"
  cp -R "$fixtures/${fixture:-image-upload-service}/." "$project/"
  git -C "$project" init --quiet
fi

cd "$repository"
npm run build
rm -rf "$plugin"
bash scripts/plugins/bundle.sh claude "$plugin"

# Claude Code reuses its cached copy until the version changes
node -e '
  const { readFileSync, writeFileSync } = require("node:fs");
  const [file, stamp] = process.argv.slice(1);
  const manifest = JSON.parse(readFileSync(file, "utf8"));
  manifest.version = `${manifest.version}-playground.${stamp}`;
  writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
' "$plugin/.claude-plugin/plugin.json" "$(date +%s)"

# A copy of the engine inside the project draws models to run it directly, so the pinned npx call reaches this build from a registry outside it
rm -rf "$registry" "$npmCache" "$project/node_modules/lagune" "$project/node_modules/.bin/lagune"
rmdir "$project/node_modules/.bin" "$project/node_modules" 2> /dev/null || true
mkdir -p "$registry"
npm pack --pack-destination "$registry" > /dev/null
version="$(node -p 'require(process.argv[1]).version' "$repository/package.json")"
echo "$version" > "$registry/latest"
port="$(node -e "const server = require('node:net').createServer(); server.listen(0, '127.0.0.1', () => { console.log(server.address().port); server.close(); });")"

mkdir -p "$playground/.claude-plugin"
cat > "$playground/.claude-plugin/marketplace.json" << JSON
{
  "name": "$marketplace",
  "description": "The Claude plugin branch of Lagune, assembled from this repository.",
  "owner": { "name": "Lagune" },
  "plugins": [{ "name": "lagune", "source": "./plugin-claude" }]
}
JSON

mkdir -p "$project/.claude"
cat > "$project/.claude/settings.local.json" << JSON
{
  "extraKnownMarketplaces": {
    "$marketplace": {
      "source": { "source": "directory", "path": "$playground" }
    }
  },
  "enabledPlugins": { "lagune@$marketplace": true },
  "claudeMdExcludes": ["$repository/CLAUDE.md"],
  "env": {
    "npm_config_registry": "http://127.0.0.1:$port/",
    "npm_config_cache": "$npmCache"
  }
}
JSON

cd "$project"
if ! claude plugin update "lagune@$marketplace" --scope local; then
  echo "Start Claude Code in $project once to install lagune@$marketplace." >&2
fi

echo "Serving lagune@$version from this tree at http://127.0.0.1:$port/ for the pinned npx call."
echo "Start Claude Code in $project, and stop this with Ctrl+C when the measurement ends."
exec node "$repository/tools/playground/registry.ts" "$port" "$registry"
