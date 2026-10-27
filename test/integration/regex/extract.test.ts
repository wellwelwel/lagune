import { describe, it, strict } from 'poku';
import {
  extractPatterns,
  extractSources,
} from '../../../src/hooks/regex/extract.js';

describe('extractSources is gated to each language', () => {
  it('keeps a genuine JavaScript regex literal', () => {
    strict.deepStrictEqual(
      extractSources('const re = /(a+)+$/;', 'javascript'),
      ['(a+)+$']
    );
  });

  it('keeps an arrow-body regex literal', () => {
    strict.deepStrictEqual(
      extractSources('const f = () => /(a+)+$/;', 'javascript'),
      ['(a+)+$']
    );
  });

  it('keeps a regex passed to a RegExp constructor or String method', () => {
    strict.deepStrictEqual(
      extractSources('const re = new RegExp("(a+)+$");', 'javascript'),
      ['(a+)+$']
    );
    strict.deepStrictEqual(extractSources('s.match("(a+)+$")', 'javascript'), [
      '(a+)+$',
    ]);
  });

  it('never scrapes a JavaScript template literal', () => {
    strict.deepStrictEqual(
      extractSources('const x = `${a ? b : c} ${d}`;', 'javascript'),
      []
    );
  });

  it('never scrapes division or a slash comment in JavaScript', () => {
    strict.deepStrictEqual(
      extractSources('const n = a / b / c;', 'javascript'),
      []
    );
    strict.deepStrictEqual(extractSources('/* (a+)+ */', 'javascript'), []);
    strict.deepStrictEqual(extractSources('// match (a+)+', 'javascript'), []);
  });

  it('drops a bare JavaScript string that is not a regex argument', () => {
    strict.deepStrictEqual(
      extractSources('const x = "just a message";', 'javascript'),
      []
    );
    strict.deepStrictEqual(
      extractSources('const x = "(a+)+$";', 'javascript'),
      []
    );
  });

  it('keeps an indirect literal in a constructor language', () => {
    strict.deepStrictEqual(
      extractSources('pat = "(a+)+$"\nre.compile(pat)', 'python'),
      ['(a+)+$']
    );
    strict.deepStrictEqual(extractSources('p := "(a+)+$"', 'go'), ['(a+)+$']);
  });

  it('does not run across a newline inside a literal', () => {
    strict.deepStrictEqual(extractSources('p = "(a+\n)+$"', 'python'), []);
  });
});

describe('extractPatterns reads each regex as the program holds it', () => {
  it('keeps the flags written after a JavaScript literal', () => {
    strict.deepStrictEqual(
      extractPatterns('const re = /^\\s*#[^\\n]+/gm;', 'javascript'),
      [{ source: '^\\s*#[^\\n]+', flags: 'gm' }]
    );
  });

  it('decodes the escapes of a string literal', () => {
    strict.deepStrictEqual(
      extractPatterns('Pattern.compile("^(\\\\w+\\\\s?)*$")', 'java'),
      [{ source: '^(\\w+\\s?)*$', flags: '' }]
    );
  });

  it('keeps a raw string as written', () => {
    strict.deepStrictEqual(
      extractPatterns('re.compile(r"(\\w+)*$")', 'python'),
      [{ source: '(\\w+)*$', flags: '' }]
    );
    strict.deepStrictEqual(
      extractPatterns('regexp.MustCompile(`(\\w+)*$`)', 'go'),
      [{ source: '(\\w+)*$', flags: '' }]
    );
  });
});
