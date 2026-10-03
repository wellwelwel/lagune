import { describe, it, strict } from 'poku';
import { validate } from '../../../src/hooks/validate/validate.js';
import {
  newWorkspace,
  seedMemory,
  validCharter,
  validDetect,
  validHarden,
  validPlan,
} from './__utils__.js';

const ALL_CLEAR = 'no template drift found\n';

await describe('the validate hook logic', async () => {
  await it('answers all clear on a valid artifact', async () => {
    const workspace = await newWorkspace();
    await seedMemory(workspace, 'charter.md', validCharter);

    const result = await validate(workspace, 'charter');

    strict.strictEqual(result.hasFinding, false);
    strict.strictEqual(result.output, ALL_CLEAR);
  });

  await it('answers in prose, naming each problem and what to do', async () => {
    const workspace = await newWorkspace();
    await seedMemory(
      workspace,
      'charter.md',
      validCharter.replace('1.0.0', '[VERSION]')
    );

    const result = await validate(workspace, 'charter');

    strict.strictEqual(result.hasFinding, true);
    strict(
      result.output.includes(
        '.lagune/memory/charter.md drifted from its template:'
      )
    );
    strict(result.output.includes('[VERSION]'));
    strict(
      result.output.includes(
        'Fix each problem above, then rerun this hook until it prints "no template drift found".'
      )
    );
  });

  await it('answers that a requested artifact is missing', async () => {
    const workspace = await newWorkspace();

    const result = await validate(workspace, 'plan');

    strict.strictEqual(result.hasFinding, true);
    strict(result.output.includes('.lagune/memory/plan.md is missing'));
    strict(
      result.output.includes(
        'written at this exact path, moving it here if it was saved elsewhere'
      )
    );
  });

  await it('validates every artifact present when run with no target', async () => {
    const workspace = await newWorkspace();
    await seedMemory(workspace, 'charter.md', validCharter);
    await seedMemory(workspace, 'detect.md', validDetect);
    await seedMemory(workspace, 'plan.md', validPlan);
    await seedMemory(workspace, 'harden.md', validHarden);

    const result = await validate(workspace, '');

    strict.strictEqual(result.hasFinding, false);
    strict.strictEqual(result.output, ALL_CLEAR);
  });

  await it('stays quiet about absent artifacts when run with no target', async () => {
    const workspace = await newWorkspace();
    await seedMemory(workspace, 'charter.md', validCharter);

    const result = await validate(workspace, '');

    strict.strictEqual(result.hasFinding, false);
    strict.strictEqual(result.output, ALL_CLEAR);
  });

  await it('fails when no memory exists at all', async () => {
    const workspace = await newWorkspace();

    const result = await validate(workspace, '');

    strict.strictEqual(result.hasFinding, true);
    strict(
      result.output.includes('no memory artifact exists under .lagune/memory/')
    );
    strict(
      result.output.includes(
        'moving them there if they were saved elsewhere, then rerun this hook'
      )
    );
  });

  await it('warns about leftover comments without failing the run', async () => {
    const workspace = await newWorkspace();
    await seedMemory(
      workspace,
      'detect.md',
      validDetect.replace(
        '## Findings',
        '## Findings <!-- one block per finding -->'
      )
    );

    const result = await validate(workspace, 'detect');

    strict.strictEqual(result.hasFinding, false);
    strict(result.output.startsWith(ALL_CLEAR));
    strict(
      result.output.includes('.lagune/memory/detect.md deserves attention:')
    );
    strict(result.output.includes('one markdown comment'));
  });

  await it('warns about a Threat metric on the plan without failing the run', async () => {
    const workspace = await newWorkspace();
    await seedMemory(workspace, 'detect.md', validDetect);
    await seedMemory(
      workspace,
      'plan.md',
      validPlan.replace('SA:N (9.3, Critical)', 'SA:N/E:A (9.3, Critical)')
    );

    const result = await validate(workspace, 'plan');

    strict.strictEqual(result.hasFinding, false);
    strict(result.output.startsWith(ALL_CLEAR));
    strict(result.output.includes('carries the Threat metric E'));
  });

  await it('fails the plan whose CVSS score is not the one its vector yields', async () => {
    const workspace = await newWorkspace();
    await seedMemory(workspace, 'detect.md', validDetect);
    await seedMemory(
      workspace,
      'plan.md',
      validPlan.replace('(9.3, Critical)', '(8.0, High)')
    );

    const result = await validate(workspace, 'plan');

    strict.strictEqual(result.hasFinding, true);
    strict(result.output.includes('but its vector scores (9.3, Critical)'));
  });

  await it('rejects an unknown target', async () => {
    const workspace = await newWorkspace();

    await strict.rejects(
      validate(workspace, 'memory'),
      /charter, detect, plan, or harden/
    );
  });

  await it('flags the plan when its finding left the detect map', async () => {
    const workspace = await newWorkspace();
    await seedMemory(
      workspace,
      'detect.md',
      validDetect.replace('Unrestricted file upload', 'Renamed finding')
    );
    await seedMemory(workspace, 'plan.md', validPlan);

    const result = await validate(workspace, 'plan');

    strict.strictEqual(result.hasFinding, true);
    strict(result.output.includes('matches no finding in the detect map'));
  });
});
