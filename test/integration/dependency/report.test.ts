import { describe, it, strict } from 'poku';
import { FLOATING, manifestReport, PLAIN, report } from './__utils__.js';

describe('the report never repeats a credential a URL carries', () => {
  it('leaves out the user name and password of a URL it names', () => {
    const result = manifestReport({
      dependencies: { pad: 'http://deploy:s3cret@example.com/pad.tgz' },
    });

    strict.deepStrictEqual(
      result,
      report([`${PLAIN}: pad@http://example.com/pad.tgz`], [])
    );
  });
});

describe('a hostile package name cannot forge a line of the report', () => {
  it('spells control and invisible characters as escapes', () => {
    const result = manifestReport({
      dependencies: { 'evil\nno integrity hash‮': 'latest' },
    });

    strict.deepStrictEqual(
      result,
      report([], [`${FLOATING}: evil\\u{a}no integrity hash\\u{202e}@latest`])
    );
  });
});
