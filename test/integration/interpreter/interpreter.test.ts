import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import {
  analyze,
  analyzeFor,
  classify,
} from '../../../src/hooks/interpreter/interpreter.js';

const expectAll = (
  verdict: 'careful' | 'safe',
  cases: [snippet: string, language: LanguageId][]
): void => {
  for (const [snippet, language] of cases)
    it(`classifies ${JSON.stringify(snippet)} (${language}) as ${verdict}`, () => {
      strict.strictEqual(classify(snippet, language), verdict);
    });
};

describe('classify flags dynamic-execution sinks per language as careful', () => {
  expectAll('careful', [
    ['eval(x)', 'javascript'],
    ['new Function("x")', 'javascript'],
    ['child_process.exec(cmd)', 'javascript'],
    ['vm.runInNewContext(s)', 'javascript'],
    ['setTimeout("code", 0)', 'javascript'],
    ['require(name)', 'javascript'],
    ['exec(userInput)', 'python'],
    ['os.system(cmd)', 'python'],
    ['pickle.loads(data)', 'python'],
    ['system($cmd)', 'php'],
    ['Marshal.load(data)', 'ruby'],
    ['Runtime.getRuntime().exec(cmd)', 'java'],
    ['exec.Command(name)', 'go'],
    ['Command::new(bin)', 'rust'],
    ['system(cmd)', 'c'],
    ['Process.Start(psi)', 'csharp'],
  ]);
});

describe('classify reports snippets with no sink for their language as safe', () => {
  expectAll('safe', [
    ['JSON.parse(x)', 'javascript'],
    ['import "./static.js"', 'javascript'],
    ['const a = 1', 'javascript'],
    ['json.loads(x)', 'python'],
    ['system(cmd)', 'javascript'],
    ['ctx.eval(x)', 'javascript'],
    ['schema.eval(row)', 'javascript'],
  ]);
});

describe('classify still flags real eval and Ruby %x with any delimiter', () => {
  expectAll('careful', [
    ['eval(userInput)', 'javascript'],
    ['(0, eval)(userInput)', 'javascript'],
    ['%x!ls -la!', 'ruby'],
    ['%x|whoami|', 'ruby'],
  ]);
});

describe('analyze routes every sink to review and leaves findings empty', () => {
  it('flags a JavaScript eval as a review lead', () => {
    const result = analyze('app.js', 'const run = () => eval(x);');

    strict.ok(result.review.length >= 1);
    strict.strictEqual(result.findings.length, 0);
  });

  it('flags a Python sink through analyzeFor', () => {
    const result = analyzeFor('python', 'os.system(cmd)');

    strict.ok(result.review.length >= 1);
    strict.strictEqual(result.findings.length, 0);
  });

  it('reports nothing for an unrecognized extension', () => {
    const result = analyze('notes.txt', 'eval(x)');

    strict.strictEqual(result.review.length, 0);
    strict.strictEqual(result.findings.length, 0);
  });
});
