import type { Target } from './types';
import { writeFile } from 'node:fs/promises';
import { renderFlow } from './render';

export const FLOW_ASSETS: Record<Target, URL> = {
  readme: new URL('../../.github/readme/assets/flow.svg', import.meta.url),
  website: new URL('../../website/static/img/flow.svg', import.meta.url),
};

const writeFlow = async (target: Target) => {
  const svg = renderFlow(target);

  await writeFile(FLOW_ASSETS[target], svg);

  return svg;
};

export const writeFlows = async () => {
  const [readme, website] = await Promise.all([
    writeFlow('readme'),
    writeFlow('website'),
  ]);

  return { readme, website };
};
