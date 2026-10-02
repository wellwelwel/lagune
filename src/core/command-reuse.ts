import type {
  AgentProvider,
  BundledAssets,
  PlannedCommandWrite,
} from '../types/core.js';

export const planCommandReuse = (
  providers: AgentProvider[],
  assets: BundledAssets
): PlannedCommandWrite[] => {
  const planned: PlannedCommandWrite[] = [];
  const ownerByContents = new Map<string, string>();
  const seenPaths = new Set<string>();

  for (const provider of providers) {
    for (const command of provider.buildCommands(assets)) {
      if (seenPaths.has(command.relativePath)) continue;

      seenPaths.add(command.relativePath);

      const owner = ownerByContents.get(command.contents);

      if (owner === undefined) {
        ownerByContents.set(command.contents, command.relativePath);
        planned.push(command);
        continue;
      }

      planned.push({ ...command, linkTo: owner });
    }
  }

  return planned;
};
