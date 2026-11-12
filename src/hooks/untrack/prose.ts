import type {
  DanglingMention,
  LockedState,
  ProseRemoval,
} from '../../types/core.js';
import { hasFindingSection, removeSection } from '../../core/sections.js';
import {
  readStateFile,
  removeStateFile,
  writeStateFile,
} from '../../core/state-file.js';

const MEMORY_FILES = [
  '.lagune/memory/detect.md',
  '.lagune/memory/plan.md',
  '.lagune/memory/harden.md',
] as const;

const removeNamesFrom = (
  markdown: string,
  names: string[]
): { content: string; removedFrom: string[] } =>
  names.reduce<{ content: string; removedFrom: string[] }>(
    (state, name) => {
      const result = removeSection(state.content, name);

      return result.removed
        ? { content: result.content, removedFrom: [...state.removedFrom, name] }
        : state;
    },
    { content: markdown, removedFrom: [] }
  );

const findDanglingMentions = (
  content: string,
  names: string[]
): DanglingMention[] =>
  content
    .split('\n')
    .flatMap((line, index) =>
      names
        .filter((name) => line.includes(name))
        .map((name) => ({ name, line: index + 1, text: line.trim() }))
    );

export const removeSectionsFromMemory = async (
  state: LockedState,
  names: string[]
): Promise<ProseRemoval[]> =>
  Promise.all(
    MEMORY_FILES.map(async (relativePath): Promise<ProseRemoval> => {
      const original = await readStateFile(state.cwd, relativePath);

      if (original === null)
        return {
          file: relativePath,
          status: 'absent',
          removed: [],
          dangling: [],
        };

      const { content, removedFrom } = removeNamesFrom(original, names);

      if (content === original)
        return {
          file: relativePath,
          status: 'unchanged',
          removed: [],
          dangling: findDanglingMentions(content, names),
        };

      if (!hasFindingSection(content)) {
        await removeStateFile(state, relativePath);

        return {
          file: relativePath,
          status: 'removed',
          removed: removedFrom,
          dangling: [],
        };
      }

      await writeStateFile(state, relativePath, content);

      return {
        file: relativePath,
        status: 'edited',
        removed: removedFrom,
        dangling: findDanglingMentions(content, names),
      };
    })
  );
