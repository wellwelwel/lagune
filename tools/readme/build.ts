import { stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import { FLOW_ASSET, writeFlow } from './asset';

await writeFlow();

stdout.write(`${fileURLToPath(FLOW_ASSET)}\n`);
