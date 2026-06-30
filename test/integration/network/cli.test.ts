import { describe, it, strict } from 'poku';
import { parseArgs, run } from '../../../src/hooks/network/cli.js';

describe('parseArgs reads the destinations from -u flags', () => {
  it('collects one or many -u urls in order', () => {
    strict.deepStrictEqual(parseArgs(['-u', 'http://a.com/']), {
      urls: ['http://a.com/'],
    });
    strict.deepStrictEqual(
      parseArgs(['-u', 'http://a.com/', '-u', 'http://b.com/']),
      { urls: ['http://a.com/', 'http://b.com/'] }
    );
  });

  it('accepts the long-form alias', () => {
    strict.deepStrictEqual(parseArgs(['--url', 'http://a.com/']), {
      urls: ['http://a.com/'],
    });
  });

  it('rejects a call with no destination', () => {
    strict.throws(() => parseArgs([]), {
      message: 'the network hook needs at least one -u <url-or-host>',
    });
  });

  it('keeps an empty-string destination rather than treating it as no destination', () => {
    strict.deepStrictEqual(parseArgs(['-u', '']), { urls: [''] });
  });

  it('rejects a -u with no value', () => {
    strict.throws(() => parseArgs(['-u']), {
      code: 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
    });
  });

  it('does not swallow a following flag as a value', () => {
    strict.throws(() => parseArgs(['-u', '-u', 'http://a.com/']), {
      code: 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
    });
  });

  it('rejects an unknown flag and a bare positional', () => {
    strict.throws(() => parseArgs(['--bogus']), {
      code: 'ERR_PARSE_ARGS_UNKNOWN_OPTION',
    });
    strict.throws(() => parseArgs(['http://a.com/']), {
      code: 'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL',
    });
  });
});

describe('run scores each destination', () => {
  it('prints one verdict per url, in order, newline-terminated', () => {
    strict.deepStrictEqual(
      run([
        '-u',
        'http://example.com/',
        '-u',
        'http://[::1]/',
        '-u',
        'not a url',
      ]),
      { output: 'safe\nprivate-target\ninvalid url\n', hasFinding: true }
    );
  });

  it('flags an internal target written in an encoded form', () => {
    strict.deepStrictEqual(run(['-u', 'http://0x7f000001/']), {
      output: 'private-target\n',
      hasFinding: true,
    });
  });

  it('flags a userinfo divergence', () => {
    strict.deepStrictEqual(run(['-u', 'http://allowed.com@evil.example/']), {
      output: 'parser-divergent\n',
      hasFinding: true,
    });
  });

  it('reports a finding only for unsafe targets, not invalid input', () => {
    strict.deepStrictEqual(run(['-u', 'http://example.com/']), {
      output: 'safe\n',
      hasFinding: false,
    });
    strict.deepStrictEqual(run(['-u', '']), {
      output: 'invalid url\n',
      hasFinding: false,
    });
  });
});
