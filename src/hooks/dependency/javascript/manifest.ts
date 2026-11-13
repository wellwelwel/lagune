import type {
  DependencyFlag,
  DependencyRead,
  Specifier,
} from '../../../types/hooks/dependency.js';
import { isRecord, ownValue } from '../../../core/collections.js';
import { parseJsonObject } from '../../../core/json.js';
import { wrongKind } from '../fields.js';
import { cannotJudge } from '../text.js';
import { isFloating, sourceOf, specifiersIn } from './specifier.js';

const INSTALLED_FIELDS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
];

const flagsOf = ([name, spec]: Specifier): DependencyFlag[] => {
  const trimmed = spec.trim();
  const shown = `${name}@${trimmed}`;
  const source = sourceOf(trimmed);

  if (source === 'plain') return [{ verdict: 'plain-transport', name: shown }];
  if (source === 'remote')
    return [{ verdict: 'outside-registry', name: shown }];
  if (source === 'registry' && isFloating(trimmed))
    return [{ verdict: 'floating-specifier', name: shown }];

  return [];
};

const hasWorkspaces = (
  file: string,
  manifest: Record<string, unknown>
): boolean => {
  const workspaces = ownValue(manifest, 'workspaces');

  if (workspaces === undefined) return false;
  if (Array.isArray(workspaces) || isRecord(workspaces)) return true;

  throw wrongKind(file, '', 'workspaces', 'a list or an object');
};

export const readManifest = (file: string, content: string): DependencyRead => {
  const manifest = parseJsonObject(content, file, cannotJudge);
  const specifiers = specifiersIn(manifest, INSTALLED_FIELDS, (field) =>
    wrongKind(file, '', field, 'package names and their specifiers')
  );

  return {
    flags: specifiers.flatMap(flagsOf),
    needsLockfile: specifiers.length > 0,
    pins: false,
    declaresWorkspace: hasWorkspaces(file, manifest),
  };
};
