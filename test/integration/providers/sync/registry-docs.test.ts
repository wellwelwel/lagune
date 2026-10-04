import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { AGENT_SPECS } from '../../../../src/providers/specs.js';

const packageRoot = new URL('../../../../', import.meta.url);
const readme = new URL('README.md', packageRoot);
const README_COUNT = /supports \[\*\*(\d+) agents\*\*\]/;

await describe('the agent registry and its hand-written mentions stay in sync', async () => {
  const keys = new Set(AGENT_SPECS.map((spec) => spec.key));
  const documented = (await readFile(readme, 'utf8')).match(README_COUNT);
  const documentedCount = documented === null ? null : Number(documented[1]);

  it('keeps agent keys unique', () => {
    strict.strictEqual(keys.size, AGENT_SPECS.length);
  });

  it('counts the same agents in the README as in the registry', () => {
    strict.strictEqual(documentedCount, AGENT_SPECS.length);
  });

  for (const spec of AGENT_SPECS) {
    it('links every agent to an https homepage', () => {
      strict(
        spec.url.startsWith('https://'),
        `${spec.key} has no https homepage`
      );
    });

    if (spec.deprecated === undefined || !('successor' in spec.deprecated))
      continue;

    const successor = spec.deprecated.successor;

    it('points every deprecated agent at a registered successor', () => {
      strict(
        keys.has(successor),
        `${spec.key} names unknown successor ${successor}`
      );
      strict.notStrictEqual(successor, spec.key);
    });
  }
});
