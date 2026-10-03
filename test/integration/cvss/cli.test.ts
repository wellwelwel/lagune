import { describe, it, strict } from 'poku';
import { parseArgs, run } from '../../../src/hooks/cvss/cli.js';
import { BASE_VECTOR } from './__utils__.js';

describe('parseArgs reads the vectors from -v flags', () => {
  it('collects one or many -v vectors in order', () => {
    strict.deepStrictEqual(parseArgs(['-v', BASE_VECTOR]), {
      vectors: [BASE_VECTOR],
      explain: false,
    });
    strict.deepStrictEqual(
      parseArgs(['-v', BASE_VECTOR, '-v', `${BASE_VECTOR}/MAV:A`]),
      { vectors: [BASE_VECTOR, `${BASE_VECTOR}/MAV:A`], explain: false }
    );
  });

  it('accepts the long-form aliases', () => {
    strict.deepStrictEqual(parseArgs(['--vector', BASE_VECTOR, '--explain']), {
      vectors: [BASE_VECTOR],
      explain: true,
    });
    strict.deepStrictEqual(parseArgs(['-e', '-v', BASE_VECTOR]), {
      vectors: [BASE_VECTOR],
      explain: true,
    });
  });

  it('rejects a call with no vector', () => {
    strict.throws(() => parseArgs([]), {
      message: 'the cvss hook needs at least one -v <vector>',
    });
    strict.throws(() => parseArgs(['-e']), {
      message: 'the cvss hook needs at least one -v <vector>',
    });
  });

  it('rejects a -v with no value', () => {
    strict.throws(() => parseArgs(['-v']), {
      code: 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
    });
  });

  it('rejects an unknown flag and a bare positional', () => {
    strict.throws(() => parseArgs(['--bogus']), {
      code: 'ERR_PARSE_ARGS_UNKNOWN_OPTION',
    });
    strict.throws(() => parseArgs([BASE_VECTOR]), {
      code: 'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL',
    });
  });
});

describe('run scores each vector', () => {
  it('prints one rating line per vector, in order, newline-terminated', () => {
    strict.deepStrictEqual(
      run(['-v', BASE_VECTOR, '-v', `${BASE_VECTOR}/MAV:A`]),
      {
        output: '9.3, Critical\n8.7, High\n',
        hasFinding: false,
      }
    );
  });

  it('scores a vector whatever the order of its metrics', () => {
    strict.deepStrictEqual(
      run(['-v', `CVSS:4.0/MAV:A/E:X/${BASE_VECTOR.slice(9)}/`]),
      {
        output: '8.7, High\n',
        hasFinding: false,
      }
    );
  });

  it('reports an invalid vector inline and flags the run', () => {
    strict.deepStrictEqual(run(['-v', BASE_VECTOR, '-v', 'nope']), {
      output:
        '9.3, Critical\ninvalid vector: the vector must start with CVSS:4.0/\n',
      hasFinding: true,
    });
  });

  it('explains the vector in plain words under its rating line', () => {
    const { output, hasFinding } = run([
      '-e',
      '-v',
      `${BASE_VECTOR}/MAV:A/CR:L`,
    ]);

    strict.strictEqual(hasFinding, false);
    strict.deepStrictEqual(output.split('\n'), [
      '8.6, High',
      '  Base metrics alone: 9.3, Critical',
      '  Attack Vector: Network, modified to Adjacent',
      '  Attack Complexity: Low',
      '  Attack Requirements: None',
      '  Privileges Required: None',
      '  User Interaction: None',
      '  Vulnerable System Confidentiality: High',
      '  Vulnerable System Integrity: High',
      '  Vulnerable System Availability: High',
      '  Subsequent System Confidentiality: None',
      '  Subsequent System Integrity: None',
      '  Subsequent System Availability: None',
      '  Confidentiality Requirement: Low',
      '',
    ]);
  });

  it('leaves the base score out of the explanation of a base-only vector', () => {
    const { output } = run(['-e', '-v', BASE_VECTOR]);

    strict(!output.includes('Base metrics alone'));
    strict(output.includes('  Attack Vector: Network\n'));
  });
});
