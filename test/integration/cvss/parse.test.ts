import { describe, it, strict } from 'poku';
import { parseVector } from '../../../src/core/cvss/parse.js';
import { BASE_VECTOR, problemOf, vectorOf } from './__utils__.js';

const BASE_METRICS = {
  AV: 'N',
  AC: 'L',
  AT: 'N',
  PR: 'N',
  UI: 'N',
  VC: 'H',
  VI: 'H',
  VA: 'H',
  SC: 'N',
  SI: 'N',
  SA: 'N',
};

describe('parseVector reads a CVSS v4.0 vector into its metrics', () => {
  it('reads every base metric', () => {
    strict.deepStrictEqual(parseVector(BASE_VECTOR), { metrics: BASE_METRICS });
  });

  it('keeps the optional metrics, in whatever order they come', () => {
    strict.deepStrictEqual(
      vectorOf(`CVSS:4.0/MAV:A/${BASE_VECTOR.slice(9)}/E:U`),
      {
        ...BASE_METRICS,
        MAV: 'A',
        E: 'U',
      }
    );
  });

  it('keeps a metric left as not defined', () => {
    strict.strictEqual(vectorOf(`${BASE_VECTOR}/CR:X`).CR, 'X');
  });

  it('tolerates surrounding whitespace and a trailing slash', () => {
    strict.deepStrictEqual(vectorOf(` ${BASE_VECTOR}/ `), BASE_METRICS);
  });
});

describe('parseVector names what is wrong with a vector', () => {
  it('requires the CVSS:4.0/ prefix', () => {
    strict.strictEqual(
      problemOf('AV:N/AC:L'),
      'the vector must start with CVSS:4.0/'
    );
  });

  it('names an unsupported version', () => {
    strict.strictEqual(
      problemOf('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'),
      'only CVSS v4.0 vectors are supported, and this one is CVSS:3.1'
    );
  });

  it('rejects a part that is not a metric:value pair', () => {
    strict.strictEqual(
      problemOf(BASE_VECTOR.replace('AC:L', 'ACL')),
      '"ACL" is not a metric:value pair'
    );
    strict.strictEqual(
      problemOf(BASE_VECTOR.replace('AC:L', 'AC:L:H')),
      '"AC:L:H" is not a metric:value pair'
    );
  });

  it('rejects an empty part', () => {
    strict.strictEqual(
      problemOf(BASE_VECTOR.replace('/AC:L', '//AC:L')),
      'an empty part sits between two slashes'
    );
  });

  it('rejects an unknown metric', () => {
    strict.strictEqual(
      problemOf(`${BASE_VECTOR}/ZZ:H`),
      '"ZZ" is not a CVSS v4.0 metric'
    );
  });

  it('rejects a value the metric does not take, listing the ones it does', () => {
    strict.strictEqual(
      problemOf(BASE_VECTOR.replace('AV:N', 'AV:X')),
      'AV (Attack Vector) does not take "X": use N (Network), A (Adjacent), L (Local), or P (Physical)'
    );
    strict.strictEqual(
      problemOf(BASE_VECTOR.replace('AV:N', 'AV:n')),
      'AV (Attack Vector) does not take "n": use N (Network), A (Adjacent), L (Local), or P (Physical)'
    );
  });

  it('does not mistake an object property for a value', () => {
    strict(
      problemOf(BASE_VECTOR.replace('AV:N', 'AV:toString')).includes(
        '"toString"'
      )
    );
  });

  it('rejects a repeated metric', () => {
    strict.strictEqual(
      problemOf(`${BASE_VECTOR}/AV:N`),
      'the metric AV appears more than once'
    );
  });

  it('rejects a missing base metric', () => {
    strict.strictEqual(
      problemOf(BASE_VECTOR.replace('/AC:L', '')),
      'the base metric AC (Attack Complexity) is missing'
    );
  });

  it('lists every missing base metric at once', () => {
    strict.strictEqual(
      problemOf('CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H'),
      'the base metrics SC (Subsequent System Confidentiality), SI (Subsequent System Integrity), and SA (Subsequent System Availability) are missing'
    );
    strict.strictEqual(
      problemOf('CVSS:4.0/'),
      'the base metrics AV (Attack Vector), AC (Attack Complexity), AT (Attack Requirements), PR (Privileges Required), UI (User Interaction), VC (Vulnerable System Confidentiality), VI (Vulnerable System Integrity), VA (Vulnerable System Availability), SC (Subsequent System Confidentiality), SI (Subsequent System Integrity), and SA (Subsequent System Availability) are missing'
    );
  });
});
