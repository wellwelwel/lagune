import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../../src/catalog/builtin.js';
import {
  SPECIALIZATION_PHASES,
  tailorSpecialization,
} from '../../../../src/catalog/reading.js';

const packageRoot = new URL('../../../../', import.meta.url);
const PHASE_LEAD = /^- \*\*In (\w+)/gm;
const SOURCE_CREDIT = /^> - Source:/m;

await describe('the built-in specializations and the phases that read them stay in sync', async () => {
  const builtins = await Promise.all(
    BUILTIN_SPECIALIZATIONS.map(async ({ name }) => ({
      name,
      text: await readFile(new URL(`catalog/${name}.md`, packageRoot), 'utf8'),
    }))
  );

  for (const phase of SPECIALIZATION_PHASES)
    it(`hands ${phase} its own guidance from every built-in, and no other phase's`, () => {
      const handed = builtins.map(({ name, text }) => ({
        name,
        phases: [...tailorSpecialization(text, phase).matchAll(PHASE_LEAD)].map(
          ([, addressed]) => addressed
        ),
      }));

      strict.deepStrictEqual(
        handed.filter(({ phases }) => phases.join() !== phase),
        []
      );
    });

  it('hands no phase guidance from any built-in to a read outside a phase', () => {
    const guided = builtins
      .filter(
        ({ text }) =>
          tailorSpecialization(text, undefined).search(PHASE_LEAD) !== -1
      )
      .map(({ name }) => name);

    strict.deepStrictEqual(guided, []);
  });

  it('leaves the source credit of every built-in out of a read', () => {
    const credited = builtins
      .filter(({ text }) =>
        SOURCE_CREDIT.test(tailorSpecialization(text, undefined))
      )
      .map(({ name }) => name);

    strict.deepStrictEqual(credited, []);
  });
});
