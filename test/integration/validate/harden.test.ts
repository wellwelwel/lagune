import { describe, it, strict } from 'poku';
import { validateHarden } from '../../../src/hooks/validate/harden.js';
import { validHarden, validPlan } from './__utils__.js';

describe('validateHarden accepts the template shape and flags drift', () => {
  it('accepts a record that keeps the template shape', () => {
    strict.deepStrictEqual(validateHarden(validHarden, validPlan), []);
  });

  it('flags a status outside the template values', () => {
    const problems = validateHarden(
      validHarden.replace('- **Status:** Applied', '- **Status:** Done'),
      validPlan
    );

    strict(
      problems.some(
        (problem) =>
          problem.includes('"Done"') &&
          problem.includes('Applied, Partial, or Blocked')
      )
    );
  });

  it('flags a verdict outside the template values', () => {
    const problems = validateHarden(
      validHarden.replace('- **Verdict:** Pending', '- **Verdict:** Approved'),
      validPlan
    );

    strict(problems.some((problem) => problem.includes('"Approved"')));
  });

  it('flags a Reproved verdict with no Reason line', () => {
    const problems = validateHarden(
      validHarden.replace(
        '- **Verdict:** Pending',
        '- **Verdict:** ❌ Reproved'
      ),
      validPlan
    );

    strict(
      problems.some((problem) => problem.includes('with no "Reason" line'))
    );
  });

  it('flags a Reason recorded while the verdict is Pending', () => {
    const problems = validateHarden(
      validHarden.replace(
        '- **Verdict:** Pending',
        '- **Verdict:** Pending\n- **Reason:** the control is not proven yet.'
      ),
      validPlan
    );

    strict(
      problems.some((problem) =>
        problem.includes('while its Verdict is Pending')
      )
    );
  });

  it('accepts a Reproved verdict that carries its Reason', () => {
    const record = validHarden.replace(
      '- **Verdict:** Pending',
      '- **Verdict:** ❌ Reproved\n- **Reason:** the file-type check is bypassable.'
    );

    strict.deepStrictEqual(validateHarden(record, validPlan), []);
  });

  it('flags a Partial fix with no Remaining entry', () => {
    const problems = validateHarden(
      validHarden.replace('- **Status:** Applied', '- **Status:** Partial'),
      validPlan
    );

    strict(
      problems.some((problem) => problem.includes('no "Remaining" entry'))
    );
  });

  it('accepts a Partial fix named under Remaining', () => {
    const record = `${validHarden.replace(
      '- **Status:** Applied',
      '- **Status:** Partial'
    )}
## Remaining

- Unrestricted file upload: the saved filename is not randomized yet.
`;

    strict.deepStrictEqual(validateHarden(record, validPlan), []);
  });

  it('flags a block title no plan fix carries', () => {
    const problems = validateHarden(
      validHarden.replace(
        '### Unrestricted file upload',
        '### Hardened the upload'
      ),
      validPlan
    );

    strict(
      problems.some((problem) =>
        problem.includes('matches no fix in the defense plan')
      )
    );
  });

  it('flags an absent defense plan', () => {
    const problems = validateHarden(validHarden, null);

    strict(
      problems.some((problem) => problem.includes('the defense plan is absent'))
    );
  });
});
