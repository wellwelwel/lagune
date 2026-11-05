import { writeFile } from 'node:fs/promises';
import { renderFlow } from './render';

export const FLOW_ASSET = new URL(
  '../../.github/readme/assets/flow.svg',
  import.meta.url
);

export const writeFlow = async () => {
  const svg = renderFlow();

  await writeFile(FLOW_ASSET, svg);

  return svg;
};
