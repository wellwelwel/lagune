#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

remote='origin'
codeExtensions=(
  ts tsx mts cts js jsx mjs cjs vue svelte astro
  py pyi rb php go rs java kt kts scala groovy swift m mm
  c h cc cpp cxx hh hpp hxx cs fs fsx vb dart lua pl pm r R jl
  ex exs erl hrl elm clj cljs cljc hs ml mli zig nim sol sql
  sh bash zsh fish ps1 psm1 bat cmd
)
documentExtensions=(md mdx txt rst adoc)
testFolders=(test tests __tests__ spec specs e2e __mocks__ __fixtures__ testdata)
testNames=('*.test.*' '*.spec.*' '*.cy.*' '*_test.*' '*_spec.*' 'test_*' '*Test.*' '*Tests.*' 'conftest.py')
temporaryIndex=''

fail() {
  echo "$1" >&2
  exit 1
}

usage() {
  fail "Usage:
  bash $0 hashes [branch] [base]
  bash $0 diff <base-hash> <head-hash> <output-file>
  bash $0 changes <current|unstaged|staged>
  bash $0 changes-diff <current|unstaged|staged> <head-hash> <output-file>"
}

hasExtension() {
  local path="$1"
  local extension

  shift

  for extension in "$@"; do
    [[ "$path" == *."$extension" ]] && return 0
  done

  return 1
}

isTest() {
  local path="/$1"
  local name="${1##*/}"
  local folder
  local pattern

  for folder in "${testFolders[@]}"; do
    [[ "$path" == */"$folder"/* ]] && return 0
  done

  for pattern in "${testNames[@]}"; do
    [[ "$name" == $pattern ]] && return 0
  done

  return 1
}

isFullHash() {
  [[ ${#1} -eq 40 || ${#1} -eq 64 ]] && [[ "$1" != *[!0-9a-f]* ]]
}

kindOf() {
  local path="$1"

  if hasExtension "$path" "${documentExtensions[@]}"; then
    echo 'document'
    return 0
  fi

  if isTest "$path"; then
    echo 'test'
    return 0
  fi

  if hasExtension "$path" "${codeExtensions[@]}"; then
    echo 'code'
    return 0
  fi

  echo 'other'
}

commitOf() {
  git rev-parse --verify --quiet "$1^{commit}" || fail "$1 is not a commit in this repository."
}

approvedCommit() {
  isFullHash "$1" || fail "$1 is not a full commit hash. Pass the hashes the person approved."

  commitOf "$1"
}

branchName() {
  git check-ref-format --branch "$1" 2>/dev/null || fail "$1 is not a valid branch name."
}

defaultBranch() {
  git ls-remote --symref "$remote" HEAD \
    | awk '$1 == "ref:" { sub("refs/heads/", "", $2); print $2 }'
}

describeScope() {
  case "$1" in
    current) echo 'every change not yet committed, staged or not, against the last commit' ;;
    unstaged) echo 'every change not yet staged, against the stage' ;;
    staged) echo 'the staged changes, against the last commit' ;;
    *) fail "$1 is not a scope. Use current, unstaged, or staged." ;;
  esac
}

withScopeRange() {
  local scope="$1"
  local headHash="$2"

  shift 2

  case "$scope" in
    current) "$@" "$headHash" ;;
    unstaged) "$@" ;;
    staged) "$@" --cached "$headHash" ;;
  esac
}

removeTemporaryIndex() {
  rm -f "$temporaryIndex"
}

trackUntracked() {
  local index

  [[ "$1" == 'staged' ]] && return 0
  [[ -n "$(git ls-files --others --exclude-standard)" ]] || return 0

  index="$(git rev-parse --git-path index)"
  temporaryIndex="$(mktemp)"

  trap removeTemporaryIndex EXIT
  cp "$index" "$temporaryIndex"

  export GIT_INDEX_FILE="$temporaryIndex"

  git ls-files -z --others --exclude-standard \
    | git add --intent-to-add --pathspec-from-file=- --pathspec-file-nul
}

classified() {
  local status
  local path
  local previous

  while IFS= read -r -d '' status; do
    previous=''
    IFS= read -r -d '' path

    if [[ "$status" == [RC]* ]]; then
      previous="$path"
      IFS= read -r -d '' path
    fi

    [[ "$previous$path" != *[[:cntrl:]]* ]] || fail 'A changed file name holds a control character, so the review stops.'

    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$(kindOf "$path")" "${status:0:1}" "$path" \
      "${previous:+$(kindOf "$previous")}" "$previous"
  done < <(git diff --no-ext-diff --no-textconv --name-status -z -M "$@")
}

codeCount() {
  awk -F '\t' '$1 == "code" { count++ } END { print count + 0 }'
}

pathspecs() {
  awk -F '\t' '$1 == "code" { print ":(literal)" $3; if ($4 == "code") print ":(literal)" $5 }'
}

section() {
  awk -F '\t' -v kind="$1" -v title="$2" '
    $1 == kind { lines[++count] = "  " $2 "  " ($5 == "" ? "" : $5 " -> ") $3 }
    END {
      if (count == 0) exit
      print ""
      print title " (" count "):"
      for (position = 1; position <= count; position++) print lines[position]
    }
  '
}

writeCodeDiff() {
  local output="$1"
  local classification
  local expected
  local written
  local spec
  local pathspec=()

  shift

  [[ ! -e "$output" && ! -L "$output" ]] || fail "$output already exists. Write the diff to a new file."

  classification="$(classified "$@")" || exit 1
  expected="$(codeCount <<<"$classification")"

  while IFS= read -r spec; do
    pathspec+=("$spec")
  done < <(pathspecs <<<"$classification")

  if [[ "$expected" -eq 0 ]]; then
    : >"$output"
  else
    git diff --no-ext-diff --no-textconv --no-color -M -U5 "$@" -- "${pathspec[@]}" >"$output"
  fi

  written="$(grep -c '^diff --git ' "$output" || true)"

  if [[ "$written" -ne "$expected" ]]; then
    rm -f "$output"
    fail "The diff held $written files instead of the $expected code files listed, so it was deleted unread."
  fi

  printf '%s\n' "$classification"
}

report() {
  local output="$1"
  local classification="$2"

  [[ "$(codeCount <<<"$classification")" -gt 0 ]] || printf '\nNo code file changed.\n'

  section code "Code, written to $output" <<<"$classification"
  section document 'Documents, left closed' <<<"$classification"
  section test 'Tests, left closed' <<<"$classification"
  section other 'Other files, left closed' <<<"$classification"
}

changes() {
  [[ $# -eq 1 ]] || usage

  local scope="$1"
  local description
  local headHash
  local branch
  local classification

  description="$(describeScope "$scope")"
  headHash="$(commitOf HEAD)"
  branch="$(git branch --show-current)"

  trackUntracked "$scope"

  classification="$(withScopeRange "$scope" "$headHash" classified)"

  if [[ -z "$classification" ]]; then
    printf 'Nothing to review: there is no change in the %s scope, %s.\n' "$scope" "$description"
    return 0
  fi

  printf 'scope       %s, %s\n' "$scope" "$description"
  printf 'head        %s  %s\n' "$headHash" "${branch:-detached}"
}

changesDiff() {
  [[ $# -eq 3 ]] || usage

  local scope="$1"
  local output="$3"
  local description
  local headHash
  local currentHash
  local classification

  description="$(describeScope "$scope")"
  headHash="$(approvedCommit "$2")"
  currentHash="$(commitOf HEAD)"

  [[ "$currentHash" == "$headHash" ]] || fail "The last commit is now $currentHash, not the approved $headHash. Approve it first."

  trackUntracked "$scope"

  classification="$(withScopeRange "$scope" "$headHash" writeCodeDiff "$output")"

  printf 'scope       %s, %s\n' "$scope" "$description"
  printf 'head        %s\n' "$headHash"
  report "$output" "$classification"
}

hashes() {
  [[ $# -le 2 ]] || usage

  local head="${1:-$(git branch --show-current)}"
  local base="${2:-$(defaultBranch)}"
  local baseHash
  local headHash
  local localHash
  local mergeBase

  [[ -n "$head" ]] || fail 'No branch is checked out. Name the branch to review.'
  [[ -n "$base" ]] || fail "The default branch of $remote could not be found. Name the base branch."

  head="$(branchName "$head")"
  base="$(branchName "$base")"

  if [[ $# -eq 0 && "$head" == "$base" ]]; then
    changes current
    return 0
  fi

  git fetch --quiet "$remote" \
    "+refs/heads/$base:refs/remotes/$remote/$base" \
    "+refs/heads/$head:refs/remotes/$remote/$head"

  baseHash="$(commitOf "refs/remotes/$remote/$base")"
  headHash="$(commitOf "refs/remotes/$remote/$head")"
  mergeBase="$(git merge-base "$baseHash" "$headHash")" || fail "$base and $head share no history."
  localHash="$(git rev-parse --verify --quiet "refs/heads/$head^{commit}" || true)"

  printf 'base        %s  %s/%s\n' "$baseHash" "$remote" "$base"
  printf 'head        %s  %s/%s\n' "$headHash" "$remote" "$head"
  printf 'merge-base  %s\n' "$mergeBase"

  if [[ -n "$localHash" && "$localHash" != "$headHash" ]]; then
    printf 'local       %s  %s, differs from %s/%s\n' "$localHash" "$head" "$remote" "$head"
  fi
}

codeDiff() {
  [[ $# -eq 3 ]] || usage

  local output="$3"
  local baseHash
  local headHash
  local mergeBase
  local classification

  baseHash="$(approvedCommit "$1")"
  headHash="$(approvedCommit "$2")"
  mergeBase="$(git merge-base "$baseHash" "$headHash")" || fail 'The two commits share no history.'
  classification="$(writeCodeDiff "$output" "$mergeBase" "$headHash")"

  printf 'merge-base  %s\n' "$mergeBase"
  printf 'head        %s\n' "$headHash"
  report "$output" "$classification"
}

command="${1:-}"

[[ $# -gt 0 ]] && shift

case "$command" in
  hashes) hashes "$@" ;;
  diff) codeDiff "$@" ;;
  changes) changes "$@" ;;
  changes-diff) changesDiff "$@" ;;
  *) usage ;;
esac
