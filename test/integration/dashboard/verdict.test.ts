import { describe, it, strict } from 'poku';
import {
  chainStep,
  verdictKind,
} from '../../../src/dashboard/client/selectors/derive.js';
import { buildFindings } from '../../../src/dashboard/server/data/build/findings.js';

const lines = (...items: string[]): string => items.join('\n');

const detect = lines(
  '# Map',
  '',
  '## Findings',
  '',
  '### Uploads trust the extension',
  '',
  '- **What it is:** the endpoint reads the name, not the file.',
  '',
  '### Cookie is readable by page scripts',
  '',
  '- **What it is:** the login cookie is set without the flag that hides it.'
);

const harden = lines(
  '# Record',
  '',
  '## Applied',
  '',
  '### Uploads trust the extension',
  '',
  '- **Status:** Applied',
  '- **What changed:** added a file-type check and a size cap.',
  '- **Where:** the handleUpload function.',
  '- **Verdict:** ❌ Reproved',
  '- **Reason:** the size cap lands, but the file-type check reads the name the browser sent.',
  '',
  '### Cookie is readable by page scripts',
  '',
  '- **Status:** Applied',
  '- **What changed:** set the flag that hides the cookie from page scripts.',
  '- **Where:** the session setup.',
  '- **Verdict:** ❓ Inconclusive',
  '- **Reason:** the value comes from a config file this phase cannot read.'
);

const findingsOf = (hardenRecord: string | null) =>
  buildFindings(detect, null, hardenRecord, {});

describe('the hardening record carries verify reason to the dashboard', () => {
  it('reads the reason verify wrote beside a reproved verdict', () => {
    const [finding] = findingsOf(harden).filter(
      (item) => item.name === 'Uploads trust the extension'
    );

    strict.strictEqual(finding.verdict, '❌ Reproved');
    strict.strictEqual(
      finding.reason,
      'the size cap lands, but the file-type check reads the name the browser sent.'
    );
  });

  it('reads the reason beside an inconclusive verdict', () => {
    const [finding] = findingsOf(harden).filter(
      (item) => item.name === 'Cookie is readable by page scripts'
    );

    strict.strictEqual(finding.verdict, '❓ Inconclusive');
    strict.strictEqual(
      finding.reason,
      'the value comes from a config file this phase cannot read.'
    );
  });

  it('leaves the reason empty when no hardening record covers the finding', () => {
    for (const finding of findingsOf(null))
      strict.strictEqual(finding.reason, '');
  });
});

describe('verdictKind separates the verdicts verify writes', () => {
  it('reads an unjudged block as pending', () => {
    strict.strictEqual(verdictKind(null), 'pending');
    strict.strictEqual(verdictKind('Pending'), 'pending');
  });

  it('reads a reproved verdict as reproved', () => {
    strict.strictEqual(verdictKind('❌ Reproved'), 'reproved');
  });

  it('never reads an inconclusive verdict as proven', () => {
    strict.strictEqual(verdictKind('❓ Inconclusive'), 'inconclusive');
  });
});

describe('chainStep points each open verdict at its next command', () => {
  const stepOf = (name: string) =>
    chainStep(findingsOf(harden).filter((item) => item.name === name)[0]);

  it('sends a reproved fix back to harden', () => {
    strict.strictEqual(stepOf('Uploads trust the extension').next, 'Harden');
  });

  it('sends an inconclusive fix back to verify', () => {
    strict.strictEqual(
      stepOf('Cookie is readable by page scripts').next,
      'Verify'
    );
  });
});
