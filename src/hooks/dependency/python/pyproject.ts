import type {
  DependencyRead,
  PythonRequirement,
} from '../../../types/hooks/dependency.js';
import { isPlainRecord, isString } from '../../../core/collections.js';
import { pathOf, tableAt, tableOrEmptyAt, textsAt } from '../fields.js';
import { cannotJudge } from '../text.js';
import { tomlOf } from '../toml.js';
import { poetryProjectRead } from './poetry.js';
import { requirementOf } from './requirement.js';
import { requirementFlags } from './source.js';
import { uvProjectRead } from './uv.js';

const optionalDependencies = (
  file: string,
  project: Record<string, unknown>
): string[] => {
  const where = 'project.optional-dependencies';
  const extras = tableOrEmptyAt(
    file,
    project,
    'optional-dependencies',
    'project'
  );

  return Object.keys(extras).flatMap((extra) =>
    textsAt(file, extras, extra, where)
  );
};

/** The requirements of each PEP 735 dependency group, leaving out the tables that include another group */
const groupDependencies = (
  file: string,
  groups: Record<string, unknown>
): string[] =>
  Object.entries(groups).flatMap(([group, entries]) => {
    if (
      Array.isArray(entries) &&
      entries.every((entry) => isString(entry) || isPlainRecord(entry))
    )
      return entries.filter(isString);

    throw cannotJudge(
      file,
      `sets ${pathOf('dependency-groups', group)} to something other than a list of requirements`
    );
  });

const declaredRequirements = (
  file: string,
  document: Record<string, unknown>
): PythonRequirement[] => {
  const project = tableOrEmptyAt(file, document, 'project', '');
  const groups = tableOrEmptyAt(file, document, 'dependency-groups', '');

  return [
    ...textsAt(file, project, 'dependencies', 'project'),
    ...optionalDependencies(file, project),
    ...groupDependencies(file, groups),
  ].map((text) => requirementOf(file, text));
};

/** A pyproject.toml, read for its standard dependency lists and for the `[tool.poetry]` and `[tool.uv]` tables */
export const readPyproject = (
  file: string,
  content: string
): DependencyRead => {
  const document = tomlOf(file, content);
  const tool = tableOrEmptyAt(file, document, 'tool', '');
  const build = tableOrEmptyAt(file, document, 'build-system', '');
  const declared = declaredRequirements(file, document);
  const builders = textsAt(file, build, 'requires', 'build-system').map(
    (text) => requirementOf(file, text)
  );
  const poetry = poetryProjectRead(file, tableAt(file, tool, 'poetry', 'tool'));
  const uv = uvProjectRead(file, tableAt(file, tool, 'uv', 'tool'));

  return {
    flags: [
      ...[...declared, ...builders].flatMap(requirementFlags),
      ...poetry.flags,
      ...uv.flags,
    ],
    needsLockfile:
      declared.length > 0 || poetry.needsLockfile || uv.needsLockfile,
    pins: false,
    declaresWorkspace: uv.declaresWorkspace,
  };
};
