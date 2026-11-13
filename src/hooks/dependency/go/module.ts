import type {
  DependencyRead,
  GoDirective,
  GoModule,
  GoModuleVersion,
  GoReplacement,
} from '../../../types/hooks/dependency.js';
import { cannotJudge } from '../text.js';
import { goDirectivesOf } from './modfile.js';

const ARROW = '=>';

/** A module path or a version, which Go never lets hold a space or a punctuation mark of its own syntax */
const MODULE_WORD = /^[^\s()[\]{},]+$/;

/** A replacement Go reads as a folder: relative, rooted, or on a drive, in Unix or Windows syntax */
const DIRECTORY_PATH = /^(?:\.\.?(?:[/\\]|$)|[/\\]|[a-z]:)/i;

const isModuleWord = (token: string): boolean => MODULE_WORD.test(token);

/** The key a module version is recorded under in go.sum, a line's first two fields */
export const checksumKey = ({ path, version }: GoModuleVersion): string =>
  `${path} ${version}`;

const requirementOf = (
  file: string,
  { operands, line }: GoDirective
): GoModuleVersion => {
  if (operands.length !== 2 || !operands.every(isModuleWord))
    throw cannotJudge(
      file,
      `holds a requirement on line ${line} that is not a module path and a version`
    );

  return { path: operands[0], version: operands[1] };
};

const malformedReplacement = (file: string, line: number): Error =>
  cannotJudge(
    file,
    `holds a replace directive on line ${line} that is not "module [version] => folder" or "module [version] => module version"`
  );

/** What a replace directive swaps in, null being a folder */
const targetOf = (
  file: string,
  line: number,
  replacement: readonly string[]
): GoModuleVersion | null => {
  const [path, version] = replacement;

  if (replacement.length === 1 && DIRECTORY_PATH.test(path)) return null;
  if (
    replacement.length === 2 &&
    !DIRECTORY_PATH.test(path) &&
    replacement.every(isModuleWord)
  )
    return { path, version };

  throw malformedReplacement(file, line);
};

const replacementOf = (
  file: string,
  { operands, line }: GoDirective
): GoReplacement => {
  const arrow = operands.indexOf(ARROW);
  const replaced = operands.slice(0, arrow);

  if ((arrow !== 1 && arrow !== 2) || !replaced.every(isModuleWord))
    throw malformedReplacement(file, line);

  return {
    path: replaced[0],
    version: replaced[1] ?? null,
    target: targetOf(file, line, operands.slice(arrow + 1)),
  };
};

export const goModuleOf = (file: string, content: string): GoModule => {
  const directives = goDirectivesOf(file, content);

  return {
    requirements: directives
      .filter(({ verb }) => verb === 'require')
      .map((directive) => requirementOf(file, directive)),
    replacements: directives
      .filter(({ verb }) => verb === 'replace')
      .map((directive) => replacementOf(file, directive)),
  };
};

/** The module each requirement fetches once a replacement for its version, or else for every version, applies, leaving out what a folder replaces */
export const fetchedModules = ({
  requirements,
  replacements,
}: GoModule): GoModuleVersion[] => {
  const byVersion = new Map(
    replacements.map((replacement) => [
      replacement.version === null
        ? replacement.path
        : checksumKey({ path: replacement.path, version: replacement.version }),
      replacement,
    ])
  );

  return requirements.flatMap((requirement) => {
    const replacement =
      byVersion.get(checksumKey(requirement)) ??
      byVersion.get(requirement.path);

    if (replacement === undefined) return [requirement];

    return replacement.target === null ? [] : [replacement.target];
  });
};

/** A go.mod, which never names a URL: Go takes the transport it fetches a module over from the environment */
export const readGoMod = (file: string, content: string): DependencyRead => ({
  flags: [],
  needsLockfile: fetchedModules(goModuleOf(file, content)).length > 0,
  pins: false,
  declaresWorkspace: false,
});
