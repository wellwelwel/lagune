import { describe, it, strict } from 'poku';
import { validateDetect } from '../../../src/hooks/validate/detect.js';
import { validDetect } from './__utils__.js';

describe('validateDetect accepts the template shape and flags drift', () => {
  it('accepts a map that keeps the template shape', () => {
    strict.deepStrictEqual(validateDetect(validDetect), []);
  });

  it('flags a finding with no What it is line', () => {
    const problems = validateDetect(
      validDetect.replace(
        '- **What it is:** the system accepts files uploaded by users.\n',
        ''
      )
    );

    strict(problems.some((problem) => problem.includes('"What it is"')));
  });

  it('flags a finding whose field is left empty', () => {
    const problems = validateDetect(
      validDetect.replace(
        '- **Evidence:** the upload route keeps the original filename.',
        '- **Evidence:**'
      )
    );

    strict(problems.some((problem) => problem.includes('"Evidence"')));
  });

  it('flags two findings sharing a name', () => {
    const duplicated = `${validDetect}
### Unrestricted file upload

- **What it is:** a second block under the same name.
- **Why it matters:** the chain traces items by name alone.
- **Evidence:** the same route.
`;

    const problems = validateDetect(duplicated);

    strict(problems.some((problem) => problem.includes('share the name')));
  });

  it('flags a missing Findings section', () => {
    const problems = validateDetect(
      validDetect.replace('## Findings', '## Inventory')
    );

    strict(
      problems.some((problem) =>
        problem.includes('the "Findings" section is missing')
      )
    );
  });

  it('flags a Mapped date that is not ISO', () => {
    const problems = validateDetect(
      validDetect.replace('- **Mapped:** 2026-06-11', '- **Mapped:** June 11')
    );

    strict(problems.some((problem) => problem.includes('"Mapped"')));
  });

  it('flags an Applied sub-skills section with no sub-skill row', () => {
    const detect = `${validDetect}
## Applied sub-skills

- a row that names no sub-skill file
`;

    const problems = validateDetect(detect);

    strict(problems.some((problem) => problem.includes('Applied sub-skills')));
  });

  it('accepts an Applied sub-skills section with a sub-skill row', () => {
    const detect = `${validDetect}
## Applied sub-skills

- .lagune/skills/upload.md: the unchecked upload under "Unrestricted file upload".
`;

    strict.deepStrictEqual(validateDetect(detect), []);
  });
});
