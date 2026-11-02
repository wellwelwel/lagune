#!/usr/bin/env bash
set -euo pipefail

repository="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
tools="$repository/tools/playground"
fixture="$repository/.claude/skills/simulate/fixtures/image-upload-service"
root="${LAGUNE_PLAYGROUND:-$HOME/.lagune-playground}"
keysFile="$root/keys.env"
prompt='An image upload service for a small team'
agents='droid grok gemini qwen opencode pi cursor antigravity copilot kimi'

export GIT_AUTHOR_NAME='Lagune playground' GIT_AUTHOR_EMAIL='playground@lagune.invalid'
export GIT_COMMITTER_NAME='Lagune playground' GIT_COMMITTER_EMAIL='playground@lagune.invalid'
export COPYFILE_DISABLE=1

usage() {
  cat << TEXT
Usage: bash scripts/playground/agents.sh <agent> <action> [arguments]
       bash scripts/playground/agents.sh keys

Agents:
  acceptance  droid  grok  gemini  qwen  opencode  pi  cursor  antigravity
  probe       copilot  kimi

Actions:
  mount          Build this tree, install what the release would publish for the agent
                 into an isolated home, and copy the fixture into a fresh project.
  mount sign-in  The same, with the agent's own sign-in instead of the keys file's BYOK.
  run [args]     Start the agent in the project, with its isolated home.
  server on|off  Put the engine's server back in the installed plugin, or take it out,
                 and start a new measurement. Acceptance agents only.
  report         Print the engine calls and the verdict, or what the probe received.
  keys           Create the keys file, where your API keys and BYOK endpoint live.

Everything lives under $root, outside the repository
(override it with LAGUNE_PLAYGROUND). The agent's CLI comes from your PATH, or from
LAGUNE_PLAYGROUND_BIN. Logins stay in each agent's isolated home across mounts.
The agent starts with a clean environment, as outside any editor: only PATH, your user
and shell, the terminal, the locale, proxy settings, and the keys file reach it.
Claude Code keeps its own playground: bash scripts/playground/mount.sh
TEXT
}

binaryName() {
  case "$1" in
    droid | grok | gemini | qwen | opencode | pi | copilot | kimi) echo "$1" ;;
    cursor) echo agent ;;
    antigravity) echo agy ;;
    *) return 1 ;;
  esac
}

installHint() {
  case "$1" in
    droid) echo 'npm install --global @factory/cli' ;;
    grok) echo 'npm install --global @xai-official/grok' ;;
    gemini) echo 'npm install --global @google/gemini-cli' ;;
    qwen) echo 'npm install --global @qwen-code/qwen-code' ;;
    opencode) echo 'npm install --global opencode-ai (1.x) or @opencode/cli (2.x)' ;;
    pi) echo 'npm install --global @earendil-works/pi-coding-agent' ;;
    cursor) echo 'curl https://cursor.com/install -fsS | bash' ;;
    antigravity) echo 'curl -fsSL https://antigravity.google/cli/install.sh | bash' ;;
    copilot) echo 'npm install --global @github/copilot' ;;
    kimi) echo 'npm install --global @moonshot-ai/kimi-code' ;;
  esac
}

isProbe() {
  [[ "$1" == copilot || "$1" == kimi ]]
}

hasByok() {
  [[ -n "${LAGUNE_BYOK_BASE_URL:-}" && -n "${LAGUNE_BYOK_API_KEY:-}" && -n "${LAGUNE_BYOK_MODEL:-}" ]] && ! signsIn
}

signsIn() {
  [[ "$(cat "$state/model" 2> /dev/null)" == sign-in ]]
}

createKeysFile() {
  if [[ -f "$keysFile" ]]; then
    echo "The keys file already exists: $keysFile"
    return
  fi

  mkdir -p "$root"
  (
    umask 077
    cat > "$keysFile" << 'TEXT'
# The Lagune playground reads this file on every mount and run. It lives outside the
# repository and only you can read it. Uncomment and fill what you have, then mount again.
# Keys exported by your shell never reach the agent, so every key it needs goes here.

# BYOK: any OpenAI-compatible endpoint drives Factory Droid, Grok Build, Qwen Code,
# OpenCode, and Pi with the same model. Examples of base URLs:
#   OpenRouter  https://openrouter.ai/api/v1
#   OpenAI      https://api.openai.com/v1
#   xAI         https://api.x.ai/v1
#   Anthropic   https://api.anthropic.com/v1
#   Google      https://generativelanguage.googleapis.com/v1beta/openai
# The model is its id as the provider names it, such as one listed at openrouter.ai/models.
# LAGUNE_BYOK_BASE_URL=https://openrouter.ai/api/v1
# LAGUNE_BYOK_API_KEY=
# LAGUNE_BYOK_MODEL=

# Gemini CLI and Antigravity CLI: a key from https://aistudio.google.com/apikey
# GEMINI_API_KEY=

# Cursor CLI: a user API key from https://cursor.com/dashboard/api, since its sign-in
# needs the macOS keychain, which the isolated home cannot reach.
# CURSOR_API_KEY=
TEXT
  )
  echo "Created $keysFile. Fill it in, then mount the agent again."
}

if [[ "${1:-}" == keys ]]; then
  createKeysFile
  exit 0
fi

agent="${1:-}"
action="${2:-}"

if [[ -z "$agent" || -z "$action" ]]; then
  usage
  exit 0
fi

if ! binaryName "$agent" > /dev/null; then
  echo "Unknown agent \"$agent\". Choose one of: $agents." >&2
  exit 1
fi

shift 2

state="$root/$agent"
project="$state/project"
calls="$state/engine-calls.jsonl"
measurements="$state/measurements"
probeLog="$state/probe.jsonl"
registryProcess=''

resolveBinary() {
  local name found

  name="$(binaryName "$agent")"
  found="${LAGUNE_PLAYGROUND_BIN:-$(command -v "$name" || true)}"

  if [[ -z "$found" && "$agent" == cursor ]]; then
    found="$(command -v cursor-agent || true)"
  fi

  if [[ -z "$found" ]]; then
    echo "The $agent CLI ($name) is not on your PATH. Install it with: $(installHint "$agent")" >&2
    exit 1
  fi

  binary="$found"
}

keepsVariable() {
  case "$1" in
    PATH | PWD | SHELL | USER | LOGNAME | TERM | COLORTERM | LANG | LC_* | TZ) return 0 ;;
    HTTP_PROXY | HTTPS_PROXY | NO_PROXY | ALL_PROXY | http_proxy | https_proxy | no_proxy | all_proxy) return 0 ;;
    NODE_EXTRA_CA_CERTS | SSL_CERT_FILE | SSL_CERT_DIR) return 0 ;;
    LAGUNE_PLAYGROUND | LAGUNE_PLAYGROUND_BIN | GIT_AUTHOR_* | GIT_COMMITTER_* | COPYFILE_DISABLE) return 0 ;;
  esac

  return 1
}

clearEnvironment() {
  local name

  for name in $(compgen -e); do
    keepsVariable "$name" || unset "$name" 2> /dev/null || true
  done
}

loadKeys() {
  if [[ -f "$keysFile" ]]; then
    set -a
    # shellcheck source=/dev/null
    . "$keysFile"
    set +a
  fi
}

isolate() {
  clearEnvironment
  loadKeys

  export HOME="$state/home"
  export XDG_CONFIG_HOME="$HOME/.config"
  export XDG_DATA_HOME="$HOME/.local/share"
  export XDG_CACHE_HOME="$HOME/.cache"
  export XDG_STATE_HOME="$HOME/.local/state"
  export TMPDIR="$state/tmp"
  export npm_config_cache="$HOME/.npm"
  export npm_config_prefix="$HOME/.npm-global"
  export PATH="$state/shadow:$PATH"

  mkdir -p "$XDG_CONFIG_HOME" "$XDG_DATA_HOME" "$XDG_CACHE_HOME" "$XDG_STATE_HOME" "$TMPDIR" "$npm_config_prefix" "$state/shadow"
  printf '#!/bin/sh\necho "lagune: command not found" >&2\nexit 127\n' > "$state/shadow/lagune"
  chmod +x "$state/shadow/lagune"

  case "$agent" in
    droid) export FACTORY_DISABLE_KEYRING=1 FACTORY_DROID_AUTO_UPDATE_ENABLED=false ;;
    grok) export GROK_HOME="$HOME/.grok" GROK_DISABLE_AUTOUPDATER=1 ;;
    gemini) export GEMINI_CLI_HOME="$HOME" ;;
    qwen) export QWEN_HOME="$HOME/.qwen" ;;
    opencode) export OPENCODE_DISABLE_AUTOUPDATE=1 ;;
    pi) export PI_CODING_AGENT_DIR="$HOME/.pi/agent" ;;
    copilot) export COPILOT_HOME="$HOME/.copilot" ;;
    kimi) export KIMI_CODE_HOME="$HOME/.kimi-code" ;;
  esac
}

commitAll() {
  git -C "$1" add -A
  git -C "$1" commit --quiet --no-verify -m "$2"
}

buildEngine() {
  echo "Building this tree..."

  if ! (cd "$repository" && npm run build > "$state/build.log" 2>&1); then
    cat "$state/build.log" >&2
    exit 1
  fi

  version="$(node -p 'require(process.argv[1]).version' "$repository/package.json")"
  tarball="$state/pack/lagune-$version.tgz"

  rm -rf "$state/pack"
  mkdir -p "$state/pack"
  (cd "$repository" && npm pack --pack-destination "$state/pack" > /dev/null 2>&1)
}

freshProject() {
  rm -rf "$project"
  mkdir -p "$project"
  cp -R "$fixture/." "$project/"
  git -C "$project" init --quiet
  commitAll "$project" 'The image-upload-service fixture'
}

stagePinnedEngine() {
  local unpacked="$state/unpacked"

  rm -rf "$unpacked" "$state/registry" "$state/home/.npm/_npx"
  mkdir -p "$unpacked" "$state/registry"
  tar -xzf "$tarball" -C "$unpacked"
  node "$tools/instrument.ts" "$unpacked/package/lib/bin/index.js" "$calls" npx
  tar -czf "$state/registry/lagune-$version.tgz" -C "$unpacked" package
  echo "$version" > "$state/registry/latest"
  echo "$version" > "$state/pinned"
  rm -rf "$unpacked"
}

assembleBundle() {
  rm -rf "$state/bundle"
  (cd "$repository" && bash scripts/plugins/bundle.sh "$1" "$state/bundle")
  node "$tools/instrument.ts" "$state/bundle/lib/bin/index.js" "$calls" tools
}

publishBareRepository() {
  local branch="$1" bare="$state/lagune.git" work="$state/work"

  rm -rf "$bare" "$work" "$work-main"
  git init --quiet --bare --initial-branch=main "$bare"

  git init --quiet --initial-branch="$branch" "$work"
  cp -R "$state/bundle/." "$work/"
  commitAll "$work" "The $branch bundle"
  git -C "$work" push --quiet "$bare" "$branch"

  git init --quiet --initial-branch=main "$work-main"
  "$2" "$work-main"
  commitAll "$work-main" 'The default branch'
  git -C "$work-main" push --quiet "$bare" main

  rm -rf "$work" "$work-main"
}

writeDroidMain() {
  node "$tools/config.ts" droid-marketplace \
    "$repository/.factory-plugin/marketplace.json" \
    "$1/.factory-plugin/marketplace.json" \
    "file://$state/lagune.git"
}

writePlaceholderMain() {
  echo 'The plugin lives on its own branch.' > "$1/README.md"
}

stageNpmPackage() {
  local unpacked="$state/unpacked"

  stamped="$version-playground.$(date +%s)"

  rm -rf "$unpacked"
  mkdir -p "$unpacked"
  tar -xzf "$tarball" -C "$unpacked"
  node "$tools/config.ts" stamp-package "$unpacked/package" "$stamped"
  node "$tools/instrument.ts" "$unpacked/package/lib/bin/index.js" "$calls" tools
  tar -czf "$state/registry/lagune-$stamped.tgz" -C "$unpacked" package
  echo "$stamped" > "$state/registry/latest"
  rm -rf "$unpacked"
}

stopRegistry() {
  if [[ -n "$registryProcess" ]]; then
    kill "$registryProcess" 2> /dev/null || true
    wait "$registryProcess" 2> /dev/null || true
    registryProcess=''
  fi
}

startRegistry() {
  local attempt

  registryPort="$(node -e "const server = require('node:net').createServer(); server.listen(0, '127.0.0.1', () => { console.log(server.address().port); server.close(); });")"
  node "$tools/registry.ts" "$registryPort" "$state/registry" > "$state/registry.log" 2>&1 &
  registryProcess=$!
  trap stopRegistry EXIT

  for attempt in $(seq 1 50); do
    if curl -fsS "http://127.0.0.1:$registryPort/lagune" > /dev/null 2>&1; then
      export npm_config_registry="http://127.0.0.1:$registryPort/"
      echo "registry=$npm_config_registry" > "$HOME/.npmrc"
      return
    fi

    sleep 0.1
  done

  echo 'The local npm registry did not start.' >&2
  exit 1
}

openCodeMajor() {
  "$binary" --version 2> /dev/null | grep -oE '[0-9]+' | head -1
}

writeProbePlugin() {
  rm -rf "$state/probe-plugin"
  node "$tools/config.ts" probe-plugin "$agent" "$state/probe-plugin" "$(command -v node)" "$tools/probe.ts" "$probeLog"
}

installForAgent() {
  case "$agent" in
    droid)
      assembleBundle droid
      publishBareRepository plugin-droid writeDroidMain
      isolate
      cd "$HOME"
      "$binary" plugin uninstall lagune@lagune > /dev/null 2>&1 || true
      "$binary" plugin marketplace remove lagune > /dev/null 2>&1 || true
      "$binary" plugin marketplace add "file://$state/lagune.git"
      "$binary" plugin install lagune@lagune
      ;;
    grok)
      assembleBundle grok
      publishBareRepository plugin-grok writePlaceholderMain
      isolate
      cd "$HOME"
      "$binary" plugin uninstall lagune > /dev/null 2>&1 || true
      "$binary" plugin install "file://$state/lagune.git@plugin-grok" --trust
      ;;
    gemini)
      assembleBundle gemini
      isolate
      cd "$HOME"
      "$binary" extensions uninstall lagune > /dev/null 2>&1 || true
      printf 'y\n' | "$binary" extensions install "$state/bundle" --consent
      ;;
    qwen)
      stageNpmPackage
      isolate
      cd "$HOME"
      startRegistry
      "$binary" extensions uninstall lagune > /dev/null 2>&1 || true
      printf 'Y\n' | "$binary" extensions install lagune --registry "http://127.0.0.1:$registryPort"
      stopRegistry
      ;;
    opencode)
      stageNpmPackage
      isolate
      cd "$HOME"
      startRegistry
      node "$tools/config.ts" opencode-clear "$XDG_CONFIG_HOME/opencode/opencode.json" "$(openCodeMajor)"

      if [[ "$(openCodeMajor)" == 1 ]]; then
        "$binary" plugin "lagune@$stamped" -g --force
      else
        "$binary" plugin add "lagune@$stamped"
        "$binary" service stop > /dev/null 2>&1 || true
      fi

      stopRegistry
      ;;
    pi)
      stageNpmPackage
      isolate
      cd "$HOME"
      startRegistry
      "$binary" remove npm:lagune > /dev/null 2>&1 || true
      "$binary" install npm:lagune
      stopRegistry
      ;;
    cursor)
      assembleBundle cursor
      isolate
      rm -rf "$HOME/.cursor/plugins/local/lagune"
      mkdir -p "$HOME/.cursor/plugins/local"
      cp -R "$state/bundle" "$HOME/.cursor/plugins/local/lagune"
      ;;
    antigravity)
      assembleBundle antigravity
      isolate
      cd "$HOME"
      "$binary" plugin uninstall lagune > /dev/null 2>&1 || true
      "$binary" plugin install "$state/bundle"
      ;;
    copilot)
      writeProbePlugin
      isolate
      cd "$HOME"
      "$binary" plugin uninstall lagune-probe@lagune-probe > /dev/null 2>&1 || true
      "$binary" plugin marketplace remove lagune-probe > /dev/null 2>&1 || true
      "$binary" plugin marketplace add "$state/probe-plugin"
      "$binary" plugin install lagune-probe@lagune-probe
      ;;
    kimi)
      writeProbePlugin
      ;;
  esac
}

clearByok() {
  case "$agent" in
    droid) node "$tools/config.ts" clear-byok droid "$HOME/.factory/settings.json" ;;
    grok) node "$tools/config.ts" clear-byok grok "$GROK_HOME/config.toml" ;;
    qwen) node "$tools/config.ts" clear-byok qwen "$QWEN_HOME/settings.json" ;;
    opencode) node "$tools/config.ts" clear-byok opencode "$XDG_CONFIG_HOME/opencode/opencode.json" ;;
    pi) node "$tools/config.ts" clear-byok pi "$PI_CODING_AGENT_DIR/models.json" ;;
  esac
}

configureModel() {
  if signsIn; then
    clearByok
    return
  fi

  case "$agent" in
    gemini)
      if [[ -n "${GEMINI_API_KEY:-}" ]]; then
        node "$tools/config.ts" select-auth "$HOME/.gemini/settings.json" gemini-api-key
      fi
      ;;
    droid)
      if hasByok; then
        node "$tools/config.ts" byok-droid "$HOME/.factory/settings.json" "$LAGUNE_BYOK_BASE_URL" "$LAGUNE_BYOK_API_KEY" "$LAGUNE_BYOK_MODEL"
      fi
      ;;
    grok)
      if hasByok; then
        node "$tools/config.ts" byok-grok "$GROK_HOME/config.toml" "$LAGUNE_BYOK_BASE_URL" "$LAGUNE_BYOK_API_KEY" "$LAGUNE_BYOK_MODEL"
      fi
      ;;
    qwen)
      if hasByok; then
        node "$tools/config.ts" select-auth "$QWEN_HOME/settings.json" openai
      fi
      ;;
    opencode)
      if hasByok; then
        node "$tools/config.ts" byok-opencode "$XDG_CONFIG_HOME/opencode/opencode.json" "$(openCodeMajor)" "$LAGUNE_BYOK_BASE_URL" "$LAGUNE_BYOK_API_KEY" "$LAGUNE_BYOK_MODEL"
      fi
      ;;
    pi)
      if hasByok; then
        node "$tools/config.ts" byok-pi "$PI_CODING_AGENT_DIR/models.json" "$LAGUNE_BYOK_BASE_URL" "$LAGUNE_BYOK_API_KEY" "$LAGUNE_BYOK_MODEL"
      fi
      ;;
  esac
}

modelNote() {
  case "$agent" in
    gemini | antigravity)
      if [[ -n "${GEMINI_API_KEY:-}" ]]; then
        echo 'the Gemini API key from the keys file'
      elif [[ "$agent" == gemini ]]; then
        echo 'none yet: Gemini CLI takes a paid Gemini API key or a Code Assist Standard or Enterprise sign-in, since free, AI Pro, and AI Ultra accounts moved to Antigravity CLI. Put GEMINI_API_KEY in the keys file and mount again'
      else
        echo 'your Google sign-in, on the first session'
      fi
      ;;
    droid | grok | qwen | opencode | pi)
      if signsIn; then
        echo "your own sign-in, on the first run, since this mount skips BYOK"
      elif hasByok; then
        echo "BYOK, $LAGUNE_BYOK_MODEL at $LAGUNE_BYOK_BASE_URL, preselected as \"Playground\""
      else
        echo "the agent's own sign-in, on the first run, or BYOK: fill LAGUNE_BYOK_* in the keys file and mount again"
      fi
      ;;
    cursor)
      if [[ -n "${CURSOR_API_KEY:-}" ]]; then
        echo 'the Cursor API key from the keys file'
      else
        echo 'none yet: put CURSOR_API_KEY in the keys file, since agent login needs the macOS keychain, which the isolated home cannot reach'
      fi
      ;;
    copilot | kimi) echo 'your account, with /login on the first session if the agent asks' ;;
  esac
}

invocation() {
  case "$agent" in
    gemini | qwen | antigravity) echo "/lagune:lagune-charter $prompt" ;;
    pi) echo "/skill:lagune-charter $prompt" ;;
    opencode)
      if [[ "$(openCodeMajor)" == 1 ]]; then
        echo "/lagune-charter $prompt"
      else
        echo "@lagune-charter, picked from the @ menu, then: $prompt"
      fi
      ;;
    *) echo "/lagune-charter $prompt" ;;
  esac
}

printNextSteps() {
  local command="bash scripts/playground/agents.sh $agent"

  echo
  echo "Mounted $agent ($binary)."
  echo "Project: $project"
  echo "Home:    $state/home, where the agent keeps its login"
  echo "Model:   $(modelNote)"

  if [[ ! -f "$keysFile" ]]; then
    echo "Keys:    no keys file yet. Create it with: bash scripts/playground/agents.sh keys"
  fi

  echo

  if isProbe "$agent"; then
    echo "1. Start it:                                $command run"

    if [[ "$agent" == kimi ]]; then
      echo "   In the session: /plugins install $state/probe-plugin, choose Trust and install, then /new"
    fi

    echo '2. Ask it: "Call the where tool of the lagune-probe server."'
    echo "3. See what the plugin server received:     $command report"
    return
  fi

  echo "1. Start it:                                $command run"
  echo "2. Type: $(invocation)"
  echo '   Answer each permission prompt as it comes. Allow nothing up front.'
  echo "3. Read the verdict:                        $command report"
  echo "4. Take the server out, then repeat 1 to 3: $command server off"
}

mount() {
  local choice="${1:-byok}"

  if [[ "$choice" != byok && "$choice" != sign-in ]]; then
    echo 'Usage: mount [sign-in]' >&2
    exit 1
  fi

  if [[ ! -d "$fixture" ]]; then
    echo "The fixture is missing: $fixture" >&2
    exit 1
  fi

  resolveBinary
  mkdir -p "$state"
  echo "$choice" > "$state/model"
  freshProject

  if ! isProbe "$agent"; then
    buildEngine
    stagePinnedEngine
  fi

  rm -rf "$measurements"
  : > "$calls"
  : > "$probeLog"
  echo on > "$state/mode"

  installForAgent
  configureModel
  printNextSteps
}

switchFile() {
  if [[ "$1" == off && -e "$2" ]]; then
    mv "$2" "$2.off"
  fi

  if [[ "$1" == on && -e "$2.off" ]]; then
    mv "$2.off" "$2"
  fi
}

saveMeasurement() {
  if [[ -s "$calls" ]]; then
    mkdir -p "$measurements"
    mv "$calls" "$measurements/$(date +%H%M%S)-$(cat "$state/mode" 2> /dev/null || echo on).jsonl"
  fi

  : > "$calls"
}

switchServer() {
  local wanted="${1:-}" file

  if [[ "$wanted" != on && "$wanted" != off ]]; then
    echo 'Usage: server on|off' >&2
    exit 1
  fi

  if isProbe "$agent"; then
    echo "The $agent probe has no engine server to switch." >&2
    exit 1
  fi

  resolveBinary
  isolate

  case "$agent" in
    droid)
      while IFS= read -r file; do
        switchFile "$wanted" "${file%.off}"
      done < <(find "$HOME/.factory/plugins" \( -name mcp.json -o -name mcp.json.off \) -path '*lagune*' 2> /dev/null)
      ;;
    grok)
      for file in "$GROK_HOME"/installed-plugins/lagune-*/.mcp.json "$GROK_HOME"/installed-plugins/lagune-*/.mcp.json.off; do
        if [[ -e "$file" ]]; then
          switchFile "$wanted" "${file%.off}"
        fi
      done
      ;;
    gemini) node "$tools/config.ts" extension-server "$HOME/.gemini/extensions/lagune/gemini-extension.json" "$wanted" ;;
    qwen) node "$tools/config.ts" extension-server "$QWEN_HOME/extensions/lagune/qwen-extension.json" "$wanted" ;;
    opencode) node "$tools/config.ts" opencode-tools "$XDG_CONFIG_HOME/opencode/opencode.json" "$(openCodeMajor)" "$wanted" ;;
    pi) switchFile "$wanted" "$PI_CODING_AGENT_DIR/npm/node_modules/lagune/lib/plugins/pi.js" ;;
    cursor) switchFile "$wanted" "$HOME/.cursor/plugins/local/lagune/mcp.json" ;;
    antigravity) switchFile "$wanted" "$HOME/.gemini/config/plugins/lagune/mcp_config.json" ;;
  esac

  saveMeasurement
  echo "$wanted" > "$state/mode"
  echo "Server $wanted. A new measurement starts, and report keeps the earlier ones. Start a new session with: bash scripts/playground/agents.sh $agent run"
}

runAgent() {
  if [[ ! -d "$project" ]]; then
    echo "Mount it first: bash scripts/playground/agents.sh $agent mount" >&2
    exit 1
  fi

  resolveBinary
  isolate
  cd "$project"

  if ! isProbe "$agent"; then
    startRegistry
  fi

  if [[ "$agent" == qwen ]] && hasByok; then
    export OPENAI_BASE_URL="$LAGUNE_BYOK_BASE_URL" OPENAI_API_KEY="$LAGUNE_BYOK_API_KEY" OPENAI_MODEL="$LAGUNE_BYOK_MODEL"
  fi

  if [[ "$agent" == pi && $# -eq 0 ]] && hasByok; then
    set -- --provider playground --model "$LAGUNE_BYOK_MODEL"
  fi

  "$binary" ${@+"$@"}
}

reportMeasurements() {
  local version file name

  version="$(cat "$state/pinned" 2> /dev/null || echo unknown)"

  for file in "$measurements"/*.jsonl; do
    if [[ -e "$file" ]]; then
      name="$(basename "$file" .jsonl)"
      echo "Saved when the server switched at ${name:0:2}:${name:2:2}:${name:4:2}"
      node "$tools/report.ts" calls "$file" "$project" "${name##*-}" "$version"
      echo
    fi
  done

  echo 'Current measurement'
  node "$tools/report.ts" calls "$calls" "$project" "$(cat "$state/mode" 2> /dev/null || echo on)" "$version"
}

report() {
  if [[ "$agent" == copilot ]]; then
    node "$tools/report.ts" probe "$probeLog" "$project" probe-plain probe-vars
  elif [[ "$agent" == kimi ]]; then
    node "$tools/report.ts" probe "$probeLog" "$project" probe-plain probe-vars probe-node
  else
    reportMeasurements
  fi
}

case "$action" in
  mount) mount "${1:-}" ;;
  run) runAgent ${@+"$@"} ;;
  server) switchServer "${1:-}" ;;
  report) report ;;
  *)
    usage
    exit 1
    ;;
esac
