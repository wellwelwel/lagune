import { describe, it, strict } from 'poku';
import { formatReport } from '../../../src/core/scan/report.js';

const HEADINGS = {
  sentinel: 'no risks found\n',
  findings: 'Findings:',
  review: 'Review manually:',
  advisory: 'Advisories:',
};

describe('formatReport renders findings, review, and advisory sections', () => {
  it('prints the sentinel when every section is empty', () => {
    strict.strictEqual(
      formatReport({ findings: [], review: [], advisory: [] }, HEADINGS),
      'no risks found\n'
    );
  });

  it('groups details under each file, sorted, indented', () => {
    strict.strictEqual(
      formatReport(
        {
          findings: [
            { file: 'b.ts', detail: 'MD5 digest' },
            { file: 'a.ts', detail: 'SHA-1 digest' },
            { file: 'a.ts', detail: 'ECB mode' },
          ],
          review: [],
          advisory: [],
        },
        HEADINGS
      ),
      'Findings:\n\na.ts\n  SHA-1 digest\n  ECB mode\n\nb.ts\n  MD5 digest\n'
    );
  });

  it('orders findings, review, and advisory, each only when present', () => {
    strict.strictEqual(
      formatReport(
        {
          findings: [{ file: 'a.ts', detail: 'weak cipher' }],
          review: [{ file: 'b.ts', detail: 'timing-unsafe compare' }],
          advisory: [{ file: 'c.ts', detail: 'mutable base tag' }],
        },
        HEADINGS
      ),
      'Findings:\n\na.ts\n  weak cipher\n\n' +
        'Review manually:\n\nb.ts\n  timing-unsafe compare\n\n' +
        'Advisories:\n\nc.ts\n  mutable base tag\n'
    );
  });

  it('omits the review and advisory sections when their headings are unset', () => {
    strict.strictEqual(
      formatReport(
        {
          findings: [{ file: 'a.ts', detail: 'weak cipher' }],
          review: [{ file: 'b.ts', detail: 'unjudged' }],
          advisory: [],
        },
        { sentinel: 'no risks found\n', findings: 'Findings:' }
      ),
      'Findings:\n\na.ts\n  weak cipher\n'
    );
  });

  it('carries no ANSI escape sequence', () => {
    const output = formatReport(
      {
        findings: [{ file: 'a.ts', detail: 'weak cipher' }],
        review: [{ file: 'b.ts', detail: 'lead' }],
        advisory: [{ file: 'c.ts', detail: 'posture' }],
      },
      HEADINGS
    );

    strict.strictEqual(output.includes(String.fromCharCode(27)), false);
  });
});
