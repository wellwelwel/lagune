import { describe, it, strict } from 'poku';
import { validatePlan } from '../../../src/hooks/validate/plan.js';
import { validDetect, validPlan } from './__utils__.js';

describe('validatePlan accepts the template shape and flags drift', () => {
  it('accepts a plan that keeps the template shape', () => {
    strict.deepStrictEqual(validatePlan(validPlan, validDetect), []);
  });

  it('flags a fix with no Priority line', () => {
    const problems = validatePlan(
      validPlan.replace('- **Priority:** Critical\n', ''),
      validDetect
    );

    strict(problems.some((problem) => problem.includes('"Priority"')));
  });

  it('flags a priority outside the four bands', () => {
    const problems = validatePlan(
      validPlan.replace('- **Priority:** Critical', '- **Priority:** Urgent'),
      validDetect
    );

    strict(
      problems.some(
        (problem) =>
          problem.includes('"Urgent"') &&
          problem.includes('Critical, High, Medium, or Low')
      )
    );
  });

  it('flags a CVSS line that carries no 4.0 vector', () => {
    const problems = validatePlan(
      validPlan.replace(/- \*\*CVSS:\*\* .*/, '- **CVSS:** 9.3 Critical'),
      validDetect
    );

    strict(problems.some((problem) => problem.includes('CVSS:4.0/')));
  });

  it('flags a fix title no detect finding carries', () => {
    const problems = validatePlan(
      validPlan.replace(
        '### Unrestricted file upload',
        '### Harden the file upload'
      ),
      validDetect
    );

    strict(
      problems.some((problem) =>
        problem.includes('matches no finding in the detect map')
      )
    );
  });

  it('flags an absent detect map', () => {
    const problems = validatePlan(validPlan, null);

    strict(
      problems.some((problem) => problem.includes('the detect map is absent'))
    );
  });

  it('flags a dependency that names no fix or finding', () => {
    const plan = validPlan.replace(
      '- **Fix:**',
      '- **Depends on:** A fix that does not exist\n- **Fix:**'
    );

    const problems = validatePlan(plan, validDetect);

    strict(
      problems.some((problem) =>
        problem.includes('names no fix or detect finding')
      )
    );
  });

  it('flags a dependency loop', () => {
    const detect = `${validDetect}
### SQL injection

- **What it is:** queries are built from raw input.
- **Why it matters:** an attacker could run their own queries.
- **Evidence:** the search handler.
`;
    const plan = `${validPlan.replace(
      '- **Fix:**',
      '- **Depends on:** SQL injection\n- **Fix:**'
    )}
### SQL injection

- **Category:** SQL injection (CWE-89)
- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical)
- **Priority:** Critical
- **Why this priority:** the search is reachable by anyone.
- **Upholds:** None directly
- **Depends on:** Unrestricted file upload
- **Fix:** parameterize every query.
`;

    const problems = validatePlan(plan, detect);

    strict(
      problems.some((problem) => problem.includes('loops back to itself'))
    );
  });
});
