import { describe, it, strict } from 'poku';
import { extractCandidates } from '../../../src/hooks/regex/extract.js';

describe('extractCandidates is gated to each language', () => {
  it('keeps a genuine JavaScript regex literal', () => {
    strict.deepStrictEqual(
      extractCandidates('const re = /(a+)+$/;', 'javascript'),
      ['(a+)+$']
    );
  });

  it('keeps an arrow-body regex literal', () => {
    strict.deepStrictEqual(
      extractCandidates('const f = () => /(a+)+$/;', 'javascript'),
      ['(a+)+$']
    );
  });

  it('keeps a regex passed to a RegExp constructor or String method', () => {
    strict.deepStrictEqual(
      extractCandidates('const re = new RegExp("(a+)+$");', 'javascript'),
      ['(a+)+$']
    );
    strict.deepStrictEqual(
      extractCandidates('s.match("(a+)+$")', 'javascript'),
      ['(a+)+$']
    );
  });

  it('never scrapes a JavaScript template literal', () => {
    strict.deepStrictEqual(
      extractCandidates('const x = `${a ? b : c} ${d}`;', 'javascript'),
      []
    );
  });

  it('never scrapes division or a slash comment in JavaScript', () => {
    strict.deepStrictEqual(
      extractCandidates('const n = a / b / c;', 'javascript'),
      []
    );
    strict.deepStrictEqual(extractCandidates('/* (a+)+ */', 'javascript'), []);
    strict.deepStrictEqual(
      extractCandidates('// match (a+)+', 'javascript'),
      []
    );
  });

  it('drops a bare JavaScript string that is not a regex argument', () => {
    strict.deepStrictEqual(
      extractCandidates('const x = "just a message";', 'javascript'),
      []
    );
    strict.deepStrictEqual(
      extractCandidates('const x = "(a+)+$";', 'javascript'),
      []
    );
  });

  it('keeps an indirect literal in a constructor language', () => {
    strict.deepStrictEqual(
      extractCandidates('pat = "(a+)+$"\nre.compile(pat)', 'python'),
      ['(a+)+$']
    );
    strict.deepStrictEqual(extractCandidates('p := "(a+)+$"', 'go'), [
      '(a+)+$',
    ]);
  });

  it('does not run across a newline inside a literal', () => {
    strict.deepStrictEqual(extractCandidates('p = "(a+\n)+$"', 'python'), []);
  });
});
