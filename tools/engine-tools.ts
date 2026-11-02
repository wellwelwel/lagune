import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { argv } from 'node:process';
import { describeTool, ENGINE_TOOLS } from '../src/mcp/tools.js';

const [destination] = argv.slice(2);

if (destination === undefined)
  throw new Error('Name the file to write the engine tool definitions into.');

await mkdir(dirname(destination), { recursive: true });
await writeFile(
  destination,
  `${JSON.stringify(ENGINE_TOOLS.map(describeTool), null, 2)}\n`
);
