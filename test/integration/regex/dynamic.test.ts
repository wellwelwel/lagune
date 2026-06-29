import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { buildsDynamicRegex } from '../../../src/hooks/regex/dynamic.js';

describe('buildsDynamicRegex flags a regex built from a non-literal', () => {
  const expectAll = (
    language: LanguageId,
    verdict: boolean,
    snippets: string[]
  ): void => {
    for (const snippet of snippets)
      it(`treats ${JSON.stringify(snippet)} as ${verdict}`, () => {
        strict.strictEqual(buildsDynamicRegex(snippet, language), verdict);
      });
  };

  describe('JavaScript', () => {
    expectAll('javascript', true, [
      'const re = new RegExp(userInput);',
      'const re = RegExp(pattern, "g");',
      'const re = new RegExp(`^${prefix}-\\\\d+$`);',
      'const re = new RegExp("a" + tail);',
    ]);
    expectAll('javascript', false, [
      'const re = new RegExp("(a+)+$");',
      'const re = /foo/;',
    ]);
  });

  describe('Python', () => {
    expectAll('python', true, [
      'p = re.compile(value)',
      'm = re.match(pat, text)',
    ]);
    expectAll('python', false, ["p = re.compile('\\\\d+')"]);
  });

  describe('Java', () => {
    expectAll('java', true, ['pat = Pattern.compile(input)']);
  });

  describe('C#', () => {
    expectAll('csharp', true, ['var r = new Regex(value);']);
  });

  describe('Go', () => {
    expectAll('go', true, [
      're := regexp.MustCompile(base + suffix)',
      'r := regexp.Compile(p)',
    ]);
    expectAll('go', false, ['var ok = regexp.MustCompile("[a-z]+")']);
  });

  describe('Ruby', () => {
    expectAll('ruby', true, ['rx = Regexp.new(value)', 'rx = /user-#{id}/']);
  });

  describe('PHP', () => {
    expectAll('php', true, ['preg_match($pattern, $subject)']);
    expectAll('php', false, ['preg_match("/[0-9]+/", $subject)']);
  });

  describe('Rust', () => {
    expectAll('rust', true, ['let re = Regex::new(&value).unwrap();']);
    expectAll('rust', false, ['let re = Regex::new("^foo$").unwrap();']);
  });

  describe('C++', () => {
    expectAll('cpp', true, ['std::regex re(pattern);']);
  });

  describe('C (POSIX)', () => {
    expectAll('c', true, [
      'regcomp(&re, pattern, REG_EXTENDED);',
      'regcomp(&re, argv[1], 0);',
    ]);
    expectAll('c', false, ['regcomp(&re, "[a-z]+", 0)']);
  });

  describe('Perl', () => {
    expectAll('perl', true, ['$x =~ /$pat/', 'my $re = qr/$prefix\\d+/']);
    expectAll('perl', false, ['$x =~ /[0-9]+/', 'my $re = qr/\\d+/']);
  });

  describe('Kotlin', () => {
    expectAll('kotlin', true, [
      'val r = Regex(input)',
      'val r = Pattern.compile(value)',
    ]);
    expectAll('kotlin', false, ['val r = Regex("[a-z]+")']);
  });

  describe('Swift', () => {
    expectAll('swift', true, ['let r = NSRegularExpression(pattern: input)']);
  });

  describe('Scala', () => {
    expectAll('scala', true, [
      'val r = new Regex(value)',
      'val r = s"$prefix.*".r',
    ]);
  });

  describe('Dart', () => {
    expectAll('dart', true, ['final r = RegExp(input);']);
  });

  describe('PowerShell', () => {
    expectAll('powershell', true, ['$x -match $pattern', '$s -replace $a, $b']);
    expectAll('powershell', false, ['$x -match "foo"']);
  });

  describe('Elixir', () => {
    expectAll('elixir', true, ['Regex.compile(input)', '~r/#{prefix}\\d+/']);
    expectAll('elixir', false, ['~r/[0-9]+/']);
  });

  describe('Objective-C', () => {
    expectAll('objc', true, [
      '[NSRegularExpression regularExpressionWithPattern:input options:0 error:&e]',
    ]);
  });

  describe('R', () => {
    expectAll('r', true, ['grepl(pattern, x)', 'gsub(pat, repl, x)']);
    expectAll('r', false, ['grepl("[0-9]+", x)']);
  });

  describe('Julia', () => {
    expectAll('julia', true, ['r = Regex(input)']);
    expectAll('julia', false, ['r = r"[0-9]+"']);
  });

  describe('Clojure', () => {
    expectAll('clojure', true, [
      '(re-pattern input)',
      '(re-find (re-pattern p) s)',
    ]);
    expectAll('clojure', false, ['(re-pattern "\\\\d+")', '#"[0-9]+"']);
  });

  describe('Crystal', () => {
    expectAll('crystal', true, ['r = Regex.new(value)']);
  });

  describe('Nim', () => {
    expectAll('nim', true, ['let r = nre.re(value)']);
  });

  describe('V', () => {
    expectAll('vlang', true, [
      'mut re := regex.regex_opt(pattern) or { panic(err) }',
    ]);
  });

  describe('D', () => {
    expectAll('dlang', true, ['auto r = regex(pattern);']);
  });

  describe('word boundaries reject substrings of an API name', () => {
    expectAll('javascript', false, [
      'dispatch(handler)',
      'val MyRegExp = build()',
      'the response here',
      'description = "x";',
    ]);
    expectAll('python', false, ['rematch(a, b)', 'subscribe(topic)']);
  });

  describe('not a regex API', () => {
    expectAll('javascript', false, ['const label = "just a message";']);
  });

  describe('a language does not run another language form', () => {
    it('does not flag a Ruby interpolation literal in JavaScript', () => {
      strict.strictEqual(
        buildsDynamicRegex('rx = /user-#{id}/', 'javascript'),
        false
      );
    });
    it('does not flag a Perl qr// in TypeScript-tagged JavaScript', () => {
      strict.strictEqual(
        buildsDynamicRegex('const x = qr/x/;', 'javascript'),
        false
      );
    });
  });
});
