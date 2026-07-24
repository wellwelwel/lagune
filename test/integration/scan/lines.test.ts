import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { codeLines } from '../../../src/core/scan/lines.js';

const firstLine = (content: string, language?: LanguageId | null): string =>
  codeLines(content, language)[0];

describe('codeLines blanks comments by the language, keeping code', () => {
  const kept: [string, LanguageId | null][] = [
    ['#define AWS_KEY "AKIA"', 'c'],
    ['*ptr = system(cmd);', 'c'],
    ['--count;', 'c'],
    ['#include <stdio.h>', 'cpp'],
    ['#define KEY "x"', 'objc'],
    ['const s = "/*";', 'javascript'],
    ['#[Route("/x")]', 'php'],
    ['# a shell comment KEY=x', null],
  ];

  for (const [line, language] of kept)
    it(`keeps ${JSON.stringify(line)} (${language}) as code`, () => {
      strict.strictEqual(firstLine(line, language), line);
    });

  const blanked: [string, LanguageId][] = [
    ['# a python comment', 'python'],
    ['  // a js comment', 'javascript'],
    ['# a ruby comment', 'ruby'],
    ['; a clojure comment', 'clojure'],
  ];

  for (const [line, language] of blanked)
    it(`blanks ${JSON.stringify(line)} (${language})`, () => {
      strict.strictEqual(firstLine(line, language), '');
    });
});

describe('codeLines tracks block comments as spans', () => {
  it('blanks a /* */ block interior even when a line does not start with *', () => {
    const result = codeLines('/*\nexec(userInput)\n*/\nreal(x)', 'javascript');

    strict.deepStrictEqual(result, ['', '', '', 'real(x)']);
  });

  it('strips an inline /* */ span and keeps the code around it', () => {
    strict.strictEqual(
      firstLine('code(); /* note */ more();', 'javascript'),
      'code();   more();'
    );
  });

  it('does not open a phantom block from a /* inside a string', () => {
    const result = codeLines('const s = "/*";\nreal(x)', 'javascript');

    strict.strictEqual(result[1], 'real(x)');
  });

  it('does not open a block from a /* inside a trailing line comment', () => {
    const result = codeLines('x = 1; // see /*\nreal(x)', 'javascript');

    strict.strictEqual(result[1], 'real(x)');
  });
});
