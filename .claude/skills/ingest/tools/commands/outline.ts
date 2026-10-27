import type { Command, OutlineRule, Target } from '../types.ts';
import { clip, displayPath, formatCount, omitted, tokens } from '../format.ts';
import { extensionOf } from '../paths.ts';
import { resolveTargets, selectedEntries } from '../selection.ts';

const OUTLINE_RULES: OutlineRule[] = [
  {
    extensions: ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'],
    pattern:
      /^(?:export\s(?:default\s)?)?(?:declare\s)?(?:async\s)?(?:function|class|abstract class|interface|type|enum|const|let|var|namespace)[\s*]|^export\s[*{]|^module\.exports\b|^\s{1,4}(?:async\s)?function[\s*]|^\s{1,4}(?:const|let)\s[\w$]{1,64}\s=\s(?:async\s)?(?:function\b|\([^)]{0,200}\)\s=>|\($|[\w$]{1,64}\s=>)/,
  },
  { extensions: ['.py'], pattern: /^\s{0,8}(?:async\s)?(?:def|class)\s/ },
  { extensions: ['.go'], pattern: /^(?:func|type)\s/ },
  {
    extensions: ['.rs'],
    pattern:
      /^\s{0,4}(?:pub(?:\([a-z]{1,10}\))?\s)?(?:async\s)?(?:fn|struct|enum|trait|impl|mod|type)[\s<]/,
  },
  { extensions: ['.rb'], pattern: /^\s{0,4}(?:class|module|def)\s/ },
  {
    extensions: ['.php'],
    pattern:
      /^\s{0,4}(?:(?:public|private|protected|static|abstract|final)\s){0,3}(?:function|class|interface|trait)\s/,
  },
  {
    extensions: ['.java', '.kt', '.cs', '.swift', '.scala'],
    pattern:
      /^\s{0,4}(?:(?:public|private|protected|internal|static|final|abstract|open|override|sealed|data)\s){0,4}(?:class|interface|enum|record|object|fun|func|struct|protocol|extension|trait)\s/,
  },
  { extensions: ['.md', '.mdx'], pattern: /^#{1,6}\s/ },
  {
    extensions: ['.sh', '.bash', '.zsh'],
    pattern: /^(?:function\s)?[\w-]{1,64}\s?\(\)/,
  },
  { extensions: ['.yml', '.yaml'], pattern: /^[A-Za-z_][\w.-]{0,63}:/ },
  { extensions: ['.toml'], pattern: /^\[/ },
];

const OUTLINE_WIDTH = 160;
const DEFAULT_LIMIT = 300;

const outlineOf = ({ entry, range }: Target): string[] => {
  const rule = OUTLINE_RULES.find(({ extensions }) =>
    extensions.includes(extensionOf(entry.path))
  );

  if (rule === undefined)
    return [`  (no outline rule for ${extensionOf(entry.path)}, use read)`];

  const first = range?.start ?? 1;
  const last = range?.end ?? entry.lines.length;

  return entry.lines.flatMap((line, index) =>
    index + 1 >= first && index + 1 <= last && rule.pattern.test(line)
      ? [`  ${index + 1}: ${clip(line, OUTLINE_WIDTH)}`]
      : []
  );
};

export const outline: Command = async (digests, options) => {
  const explicit = options.paths.length > 0 || options.at.length > 0;
  const targets = explicit
    ? resolveTargets(digests, options)
    : digests.flatMap((digest) =>
        selectedEntries(digest, options).map((entry): Target => ({
          digest,
          entry,
          range: null,
        }))
      );
  const lines = targets.flatMap((target) => [
    `${displayPath(digests, target.digest, target.entry.path)}  ${formatCount(target.entry.lines.length)} lines, ${tokens(target.entry.characters)}`,
    ...outlineOf(target),
  ]);
  const limit = options.limit ?? DEFAULT_LIMIT;

  return [
    ...lines.slice(0, limit),
    ...omitted(lines.length - limit, ', narrow with --under, --ext, or --path'),
  ];
};
