import { describe, it, strict } from 'poku';
import {
  planWarnings,
  validatePlan,
} from '../../../src/hooks/validate/plan.js';
import { validDetect, validPlan } from './__utils__.js';

const CVSS_LINE =
  '- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical)';

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

  it('flags a CVSS line without the score and band the cvss hook prints', () => {
    const problems = validatePlan(
      validPlan.replace(' (9.3, Critical)', ''),
      validDetect
    );

    strict(
      problems.some((problem) =>
        problem.includes('is not the vector followed by "(score, band)"')
      )
    );
  });

  it('flags an invalid vector on the CVSS line', () => {
    const problems = validatePlan(
      validPlan.replace('AV:N/', 'AV:X/'),
      validDetect
    );

    strict(
      problems.some(
        (problem) =>
          problem.includes('carries an invalid vector') &&
          problem.includes('AV (Attack Vector) does not take "X"')
      )
    );
  });

  it('flags a score that is not the one the vector yields', () => {
    const problems = validatePlan(
      validPlan.replace('(9.3, Critical)', '(9.0, Critical)'),
      validDetect
    );

    strict(
      problems.some((problem) =>
        problem.includes(
          'reads (9.0, Critical), but its vector scores (9.3, Critical)'
        )
      )
    );
  });

  it('flags a band that is not the one the score maps to', () => {
    const problems = validatePlan(
      validPlan.replace('(9.3, Critical)', '(9.3, High)'),
      validDetect
    );

    strict(
      problems.some((problem) =>
        problem.includes(
          'reads (9.3, High), but its vector scores (9.3, Critical)'
        )
      )
    );
  });

  it('flags a Priority that is not the band its CVSS line scores', () => {
    const problems = validatePlan(
      validPlan.replace('- **Priority:** Critical', '- **Priority:** High'),
      validDetect
    );

    strict(
      problems.some((problem) =>
        problem.includes(
          'the Priority "High" on the fix "Unrestricted file upload" is not the band "Critical"'
        )
      )
    );
  });

  it('accepts a Priority that follows an Environmental adjustment in the vector', () => {
    strict.deepStrictEqual(
      validatePlan(
        validPlan
          .replace('SA:N (9.3, Critical)', 'SA:N/MAV:A (8.7, High)')
          .replace('- **Priority:** Critical', '- **Priority:** High'),
        validDetect
      ),
      []
    );
  });

  it('flags a vector with no impact, which fits no Priority band', () => {
    const problems = validatePlan(
      validPlan.replace(
        'VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical)',
        'VC:N/VI:N/VA:N/SC:N/SI:N/SA:N (0.0, None)'
      ),
      validDetect
    );

    strict(
      problems.some((problem) =>
        problem.includes('scores (0.0, None), which fits no Priority band')
      )
    );
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

describe('planWarnings surfaces what deserves attention without failing', () => {
  it('stays quiet on a plan rated from the Base and Environmental metrics', () => {
    strict.deepStrictEqual(planWarnings(validPlan), []);
    strict.deepStrictEqual(
      planWarnings(validPlan.replace('SA:N (9.3', 'SA:N/MAV:A/CR:L (9.3')),
      []
    );
  });

  it('warns about a Threat metric, which the rating keeps out of scope', () => {
    const warnings = planWarnings(
      validPlan.replace('SA:N (9.3, Critical)', 'SA:N/E:U (9.3, Critical)')
    );

    strict.deepStrictEqual(warnings, [
      'the CVSS line on the fix "Unrestricted file upload" carries the Threat metric E, which the rating guide keeps out of scope',
    ]);
  });

  it('stays quiet on a CVSS line that does not parse, which the problems already cover', () => {
    strict.deepStrictEqual(
      planWarnings(validPlan.replace(CVSS_LINE, '- **CVSS:** 9.3 Critical')),
      []
    );
  });
});
