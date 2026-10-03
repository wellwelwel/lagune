import { describe, it, strict } from 'poku';
import {
  canonicalVector,
  formatScore,
  rateVector,
  readRatingLine,
} from '../../../src/core/cvss/rating.js';
import { BASE_VECTOR, vectorOf } from './__utils__.js';

describe('canonicalVector writes the vector in the specification order', () => {
  it('reorders the metrics and drops the ones left as not defined', () => {
    strict.strictEqual(
      canonicalVector(
        vectorOf(`CVSS:4.0/S:P/MAV:A/E:X/CR:X/${BASE_VECTOR.slice(9)}`)
      ),
      `${BASE_VECTOR}/MAV:A/S:P`
    );
  });
});

describe('formatScore prints the score and band the hook writes', () => {
  it('writes the score, then the band', () => {
    strict.strictEqual(
      formatScore(rateVector(vectorOf(BASE_VECTOR)).overall),
      '9.3, Critical'
    );
  });

  it('keeps one decimal on a whole score', () => {
    strict.strictEqual(
      formatScore(
        rateVector(
          vectorOf(
            'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H'
          )
        ).overall
      ),
      '10.0, Critical'
    );
  });
});

describe('readRatingLine reads the CVSS line the plan carries', () => {
  it('reads the vector, score, and band', () => {
    strict.deepStrictEqual(readRatingLine(`${BASE_VECTOR} (9.3, Critical)`), {
      vector: BASE_VECTOR,
      score: 9.3,
      severity: 'Critical',
    });
    strict.deepStrictEqual(readRatingLine(`  ${BASE_VECTOR}(10.0,Critical) `), {
      vector: BASE_VECTOR,
      score: 10,
      severity: 'Critical',
    });
  });

  it('rejects a line without the score and band, or with a band outside the five', () => {
    strict.strictEqual(readRatingLine(BASE_VECTOR), null);
    strict.strictEqual(readRatingLine(`${BASE_VECTOR} 9.3 Critical`), null);
    strict.strictEqual(readRatingLine(`${BASE_VECTOR} (9.3, Urgent)`), null);
    strict.strictEqual(readRatingLine(`${BASE_VECTOR} (Critical, 9.3)`), null);
  });
});
