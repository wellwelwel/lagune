import { stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import { FLOW_ASSETS, writeFlows } from './asset';

await writeFlows();
stdout.write(
  Object.values(FLOW_ASSETS)
    .map((asset) => `${fileURLToPath(asset)}\n`)
    .join('')
);
