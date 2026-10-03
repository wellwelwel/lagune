import { describe, it, strict } from 'poku';
import {
  effectiveMetrics,
  macroKey,
  macroVector,
} from '../../../src/core/cvss/macrovector.js';
import { rateVector } from '../../../src/core/cvss/rating.js';
import { severityOf } from '../../../src/core/cvss/score.js';
import { BASE_VECTOR, vectorOf } from './__utils__.js';

const scoreOf = (input: string): number =>
  rateVector(vectorOf(input)).overall.score;

const macroOf = (input: string): string =>
  macroKey(macroVector(effectiveMetrics(vectorOf(input))));

const FULL_VECTOR =
  'CVSS:4.0/AV:P/AC:H/AT:P/PR:L/UI:P/VC:L/VI:L/VA:L/SC:H/SI:L/SA:L/S:P/R:I/U:Red/MAT:P/MPR:N/MUI:P/MVC:N/MVI:L/MVA:L/MSC:L/MSI:L/MSA:S/IR:M/AR:H/E:U';

const REFERENCE_SCORES: [string, number][] = [
  [BASE_VECTOR, 9.3],
  ['CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H', 10],
  ['CVSS:4.0/AV:N/AC:L/AT:N/PR:H/UI:N/VC:L/VI:L/VA:N/SC:N/SI:N/SA:N', 5.1],
  [
    'CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:A/VC:L/VI:L/VA:N/SC:L/SI:L/SA:H/S:P/AU:N/R:U/RE:L/U:Clear/MAV:A/MAC:L/MPR:N/MUI:P/MVC:H/MVI:N/MVA:H/MSC:L/MSI:H/MSA:S/CR:H/IR:H/AR:M/E:U',
    7.3,
  ],
  [
    'CVSS:4.0/AV:A/AC:L/AT:N/PR:L/UI:N/VC:H/VI:L/VA:H/SC:L/SI:L/SA:H/S:P/AU:N/R:U/RE:L/U:Clear/MAV:A/MAC:L/MUI:P/MVC:L/MVI:H/MVA:H/MSC:L/MSI:H/MSA:N/CR:H/IR:M/AR:L/E:U',
    1.6,
  ],
  [FULL_VECTOR, 1.0],
  ['CVSS:4.0/AV:P/AC:H/AT:P/PR:L/UI:P/VC:L/VI:L/VA:L/SC:H/SI:L/SA:L', 2.1],
  [
    'CVSS:4.0/AV:P/AC:H/AT:P/PR:L/UI:P/VC:L/VI:L/VA:L/SC:H/SI:L/SA:L/MAT:P/MPR:N/MUI:P/MVC:N/MVI:L/MVA:L/MSC:L/MSI:L/MSA:S/IR:M/AR:H',
    4.6,
  ],
  ['CVSS:4.0/AV:P/AC:H/AT:P/PR:L/UI:P/VC:L/VI:L/VA:L/SC:H/SI:L/SA:L/E:U', 0.3],
  [
    'CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:P/VC:N/VI:L/VA:N/SC:N/SI:N/SA:N/E:X/CR:X/IR:X/AR:X/MAV:X/MAC:X/MAT:X/MPR:X/MUI:X/MVC:X/MVI:X/MVA:X/MSC:X/MSI:X/MSA:X/S:X/AU:X/R:X/V:X/RE:X/U:X',
    2.3,
  ],
  [`${BASE_VECTOR}/MAV:A`, 8.7],
  [`${BASE_VECTOR}/CR:L/IR:L/AR:L`, 8.9],
];

describe('scoreEffective lands on the reference calculator score', () => {
  for (const [vector, expected] of REFERENCE_SCORES)
    it(`scores ${vector} as ${expected}`, () => {
      strict.strictEqual(scoreOf(vector), expected);
    });
});

describe('scoreEffective follows the specification rules', () => {
  it('scores a flaw with no impact at all as 0.0, whatever else is set', () => {
    strict.strictEqual(
      scoreOf(
        'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N/E:A/CR:H'
      ),
      0
    );
  });

  it('reads a not-defined Exploit Maturity and requirement as the worst case', () => {
    strict.strictEqual(scoreOf(`${BASE_VECTOR}/E:X/CR:X/IR:X/AR:X`), 9.3);
    strict.strictEqual(scoreOf(`${BASE_VECTOR}/E:A/CR:H/IR:H/AR:H`), 9.3);
  });

  it('lets a modified metric override its base metric', () => {
    strict.strictEqual(
      scoreOf(`${BASE_VECTOR}/MAV:A`),
      scoreOf(BASE_VECTOR.replace('AV:N', 'AV:A'))
    );
    strict.strictEqual(scoreOf(`${BASE_VECTOR}/MAV:X`), scoreOf(BASE_VECTOR));
  });

  it('never raises a score through a lower exploit maturity or requirement', () => {
    strict(scoreOf(`${BASE_VECTOR}/E:U`) < scoreOf(BASE_VECTOR));
    strict(scoreOf(`${BASE_VECTOR}/CR:L`) <= scoreOf(BASE_VECTOR));
    strict(scoreOf(`${BASE_VECTOR}/CR:L/IR:L/AR:L`) < scoreOf(BASE_VECTOR));
  });

  it('counts a safety impact on a subsequent system as the top impact level', () => {
    strict(scoreOf(`${BASE_VECTOR}/MSI:S`) > scoreOf(`${BASE_VECTOR}/MSI:H`));
  });

  it('reads the macrovector the way the reference does', () => {
    strict.strictEqual(macroOf(BASE_VECTOR), '000200');
    strict.strictEqual(
      macroOf(
        'CVSS:4.0/AV:N/AC:L/AT:N/PR:H/UI:N/VC:L/VI:L/VA:N/SC:N/SI:N/SA:N'
      ),
      '102201'
    );
    strict.strictEqual(macroOf(FULL_VECTOR), '212021');
  });
});

describe('rateVector reports the base score beside the overall one', () => {
  it('tells the metrics used apart by nomenclature', () => {
    strict.strictEqual(
      rateVector(vectorOf(BASE_VECTOR)).nomenclature,
      'CVSS-B'
    );
    strict.strictEqual(
      rateVector(vectorOf(`${BASE_VECTOR}/E:P`)).nomenclature,
      'CVSS-BT'
    );
    strict.strictEqual(
      rateVector(vectorOf(`${BASE_VECTOR}/CR:L`)).nomenclature,
      'CVSS-BE'
    );
    strict.strictEqual(
      rateVector(vectorOf(FULL_VECTOR)).nomenclature,
      'CVSS-BTE'
    );
    strict.strictEqual(
      rateVector(vectorOf(`${BASE_VECTOR}/E:X/S:P`)).nomenclature,
      'CVSS-B'
    );
  });

  it('scores the base metrics alone beside the overall score', () => {
    const rating = rateVector(vectorOf(FULL_VECTOR));

    strict.deepStrictEqual(rating.overall, { score: 1.0, severity: 'Low' });
    strict.deepStrictEqual(rating.base, { score: 2.1, severity: 'Low' });
  });
});

describe('severityOf maps a score to its band', () => {
  it('follows the specification thresholds', () => {
    strict.strictEqual(severityOf(0), 'None');
    strict.strictEqual(severityOf(0.1), 'Low');
    strict.strictEqual(severityOf(3.9), 'Low');
    strict.strictEqual(severityOf(4.0), 'Medium');
    strict.strictEqual(severityOf(6.9), 'Medium');
    strict.strictEqual(severityOf(7.0), 'High');
    strict.strictEqual(severityOf(8.9), 'High');
    strict.strictEqual(severityOf(9.0), 'Critical');
    strict.strictEqual(severityOf(10), 'Critical');
  });
});
