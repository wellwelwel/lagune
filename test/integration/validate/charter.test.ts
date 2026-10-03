import { describe, it, strict } from 'poku';
import {
  charterWarnings,
  validateCharter,
} from '../../../src/hooks/validate/charter.js';
import { validCharter } from './__utils__.js';

describe('validateCharter accepts the template shape and flags drift', () => {
  it('accepts a charter that keeps the template shape', () => {
    strict.deepStrictEqual(validateCharter(validCharter), []);
  });

  it('flags a leftover placeholder token', () => {
    const problems = validateCharter(
      validCharter.replace('1.0.0', '[VERSION]')
    );

    strict(problems.some((problem) => problem.includes('[VERSION]')));
  });

  it('flags a principle with no Why line', () => {
    const problems = validateCharter(
      validCharter.replace(
        '- Why: a leaked key in git history is a full account takeover.\n',
        ''
      )
    );

    strict(
      problems.some(
        (problem) =>
          problem.includes('I. Secrets never live in code') &&
          problem.includes('"Why"')
      )
    );
  });

  it('flags a principle with no rule paragraph', () => {
    const problems = validateCharter(
      validCharter.replace(
        'Never commit a secret. Always load secrets from the environment.\n\n',
        ''
      )
    );

    strict(problems.some((problem) => problem.includes('rule paragraph')));
  });

  it('flags a missing baseline block', () => {
    const problems = validateCharter(
      validCharter.replace(
        '### Prefer the simplest vetted control',
        '### A renamed block'
      )
    );

    strict(
      problems.some((problem) =>
        problem.includes('Prefer the simplest vetted control')
      )
    );
  });

  it('flags a missing Principles section', () => {
    const problems = validateCharter(
      validCharter.replace('## Principles', '## Rules')
    );

    strict(
      problems.some((problem) =>
        problem.includes('the "Principles" section is missing')
      )
    );
  });

  it('flags a ratification date that is not ISO', () => {
    const problems = validateCharter(
      validCharter.replace('2026-06-11', '11/06/2026')
    );

    strict(problems.some((problem) => problem.includes('11/06/2026')));
  });

  it('flags a charter corrupted by an unclosed code fence', () => {
    const corrupted = validCharter.replace(
      '## Principles',
      '```\n## Principles'
    );

    strict(validateCharter(corrupted).length > 0);
  });
});

describe('charterWarnings surfaces what deserves attention without failing', () => {
  it('stays quiet on a charter of comfortable size', () => {
    strict.deepStrictEqual(charterWarnings(validCharter), []);
  });

  it('warns about a principle past 1024 characters', () => {
    const warnings = charterWarnings(
      validCharter.replace(
        'Never commit a secret. Always load secrets from the environment.',
        'Never commit a secret. '.repeat(50)
      )
    );

    strict(
      warnings.some(
        (warning) =>
          warning.includes('I. Secrets never live in code') &&
          warning.includes('1024')
      )
    );
  });

  it('warns about a Why line past 512 characters', () => {
    const warnings = charterWarnings(
      validCharter.replace(
        'a leaked key in git history is a full account takeover.',
        'a leaked key is an account takeover. '.repeat(16)
      )
    );

    strict(
      warnings.some(
        (warning) => warning.includes('"Why"') && warning.includes('512')
      )
    );
  });
});
