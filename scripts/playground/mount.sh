#!/usr/bin/env bash
set -euo pipefail

repository="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
playground="$repository/playground"
plugin="$playground/plugin-claude"
project="$playground/project"
engine="$project/node_modules/lagune"
fixture="${1:-}"
fixtures="$repository/.claude/skills/simulate/fixtures"
marketplace="lagune-playground"
packed="$(mktemp -d)"

trap 'rm -rf -- "${packed:?}"' EXIT

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

npm pack --pack-destination "$packed" > /dev/null
rm -rf "$engine"
mkdir -p "$engine" "$project/node_modules/.bin"
tar -xzf "$packed"/lagune-*.tgz -C "$engine" --strip-components=1
chmod +x "$engine/lib/bin/index.js"
ln -sfn ../lagune/lib/bin/index.js "$project/node_modules/.bin/lagune"

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
  "claudeMdExcludes": ["$repository/CLAUDE.md"]
}
JSON

cd "$project"
if ! claude plugin update "lagune@$marketplace" --scope local; then
  echo "Start Claude Code in $project once to install lagune@$marketplace." >&2
fi
