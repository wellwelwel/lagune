import type { RegexUsage } from '../../../src/types/hooks/regex.js';
import type { LanguageId } from '../../../src/types/scan.js';
import { describe, it, strict } from 'poku';
import { regexUsage } from '../../../src/hooks/regex/usage.js';

const expectUsage =
  (field: keyof RegexUsage) =>
  (language: LanguageId, verdict: boolean, snippets: string[]): void => {
    for (const snippet of snippets)
      it(`treats ${JSON.stringify(snippet)} as ${verdict}`, () => {
        strict.strictEqual(regexUsage(snippet, language)[field], verdict);
      });
  };

const expectDynamic = expectUsage('dynamic');

const expectStaticWrap = expectUsage('staticWrap');

describe('regex usage flags a regex built from a non-literal as dynamic', () => {
  describe('JavaScript', () => {
    expectDynamic('javascript', true, [
      'const re = new RegExp(userInput);',
      'const re = RegExp(pattern, "g");',
      'const re = new RegExp(`^${prefix}-\\\\d+$`);',
      'const re = new RegExp("a" + tail);',
    ]);
    expectDynamic('javascript', false, [
      'const re = new RegExp("(a+)+$");',
      'const re = /foo/;',
    ]);
  });

  describe('Python', () => {
    expectDynamic('python', true, [
      'p = re.compile(value)',
      'm = re.match(pat, text)',
      'p = re.compile(f"{prefix}\\d+")',
    ]);
    expectDynamic('python', false, [
      "p = re.compile('\\\\d+')",
      'p = re.compile(r"\\d+")',
      'p = re.compile(rb"\\d+")',
    ]);
  });

  describe('Java', () => {
    expectDynamic('java', true, ['pat = Pattern.compile(input)']);
  });

  describe('C#', () => {
    expectDynamic('csharp', true, [
      'var r = new Regex(value);',
      'var r = new Regex($@"{prefix}\\d+");',
      'Regex.IsMatch(input, pattern);',
    ]);
    expectDynamic('csharp', false, [
      'var r = new Regex(@"\\d+");',
      'Regex.IsMatch(input, "^[a-z]+$");',
    ]);
  });

  describe('Go', () => {
    expectDynamic('go', true, [
      're := regexp.MustCompile(base + suffix)',
      'r := regexp.Compile(p)',
    ]);
    expectDynamic('go', false, ['var ok = regexp.MustCompile("[a-z]+")']);
  });

  describe('Ruby', () => {
    expectDynamic('ruby', true, [
      'rx = Regexp.new(value)',
      'rx = /user-#{id}/',
    ]);
  });

  describe('PHP', () => {
    expectDynamic('php', true, ['preg_match($pattern, $subject)']);
    expectDynamic('php', false, ['preg_match("/[0-9]+/", $subject)']);
  });

  describe('Rust', () => {
    expectDynamic('rust', true, ['let re = Regex::new(&value).unwrap();']);
    expectDynamic('rust', false, [
      'let re = Regex::new("^foo$").unwrap();',
      'let re = Regex::new(r"\\d+").unwrap();',
      'let re = Regex::new(r#"\\d+"#).unwrap();',
    ]);
  });

  describe('C++', () => {
    expectDynamic('cpp', true, ['std::regex re(pattern);']);
  });

  describe('C (POSIX)', () => {
    expectDynamic('c', true, [
      'regcomp(&re, pattern, REG_EXTENDED);',
      'regcomp(&re, argv[1], 0);',
    ]);
    expectDynamic('c', false, ['regcomp(&re, "[a-z]+", 0)']);
  });

  describe('Perl', () => {
    expectDynamic('perl', true, ['$x =~ /$pat/', 'my $re = qr/$prefix\\d+/']);
    expectDynamic('perl', false, ['$x =~ /[0-9]+/', 'my $re = qr/\\d+/']);
  });

  describe('Kotlin', () => {
    expectDynamic('kotlin', true, [
      'val r = Regex(input)',
      'val r = Pattern.compile(value)',
    ]);
    expectDynamic('kotlin', false, ['val r = Regex("[a-z]+")']);
  });

  describe('Swift', () => {
    expectDynamic('swift', true, [
      'let r = NSRegularExpression(pattern: input)',
    ]);
    expectDynamic('swift', false, [
      'let r = NSRegularExpression(pattern: "[0-9]+")',
    ]);
  });

  describe('Scala', () => {
    expectDynamic('scala', true, [
      'val r = new Regex(value)',
      'val r = s"$prefix.*".r',
    ]);
  });

  describe('Dart', () => {
    expectDynamic('dart', true, ['final r = RegExp(input);']);
    expectDynamic('dart', false, ["final r = RegExp(r'\\d+');"]);
  });

  describe('PowerShell', () => {
    expectDynamic('powershell', true, [
      '$x -match $pattern',
      '$s -replace $a, $b',
      '[regex]::IsMatch($s, $pattern)',
    ]);
    expectDynamic('powershell', false, [
      '$x -match "foo"',
      "[regex]::IsMatch($s, '^a+$')",
    ]);
  });

  describe('Elixir', () => {
    expectDynamic('elixir', true, [
      'Regex.compile(input)',
      '~r/#{prefix}\\d+/',
    ]);
    expectDynamic('elixir', false, [
      '~r/[0-9]+/',
      'Regex.run(~r/[0-9]+/, input)',
    ]);
  });

  describe('Objective-C', () => {
    expectDynamic('objc', true, [
      '[NSRegularExpression regularExpressionWithPattern:input options:0 error:&e]',
    ]);
    expectDynamic('objc', false, [
      '[NSRegularExpression regularExpressionWithPattern:@"[0-9]+" options:0 error:&e]',
    ]);
  });

  describe('R', () => {
    expectDynamic('r', true, ['grepl(pattern, x)', 'gsub(pat, repl, x)']);
    expectDynamic('r', false, ['grepl("[0-9]+", x)', 'regmatches(x, m)']);
  });

  describe('Julia', () => {
    expectDynamic('julia', true, ['r = Regex(input)']);
    expectDynamic('julia', false, ['r = r"[0-9]+"']);
  });

  describe('Clojure', () => {
    expectDynamic('clojure', true, [
      '(re-pattern input)',
      '(re-find (re-pattern p) s)',
    ]);
    expectDynamic('clojure', false, ['(re-pattern "\\\\d+")', '#"[0-9]+"']);
  });

  describe('Crystal', () => {
    expectDynamic('crystal', true, ['r = Regex.new(value)']);
  });

  describe('Nim', () => {
    expectDynamic('nim', true, ['let r = nre.re(value)']);
  });

  describe('V', () => {
    expectDynamic('vlang', true, [
      'mut re := regex.regex_opt(pattern) or { panic(err) }',
    ]);
  });

  describe('D', () => {
    expectDynamic('dlang', true, ['auto r = regex(pattern);']);
  });

  describe('word boundaries reject substrings of an API name', () => {
    expectDynamic('javascript', false, [
      'dispatch(handler)',
      'val MyRegExp = build()',
      'the response here',
      'description = "x";',
    ]);
    expectDynamic('python', false, ['rematch(a, b)', 'subscribe(topic)']);
  });

  describe('not a regex API', () => {
    expectDynamic('javascript', false, ['const label = "just a message";']);
  });

  describe('a language does not run another language form', () => {
    expectDynamic('javascript', false, [
      'rx = /user-#{id}/',
      'const x = qr/x/;',
    ]);
  });
});

describe('regex usage flags a static literal wrapped in a constructor', () => {
  describe('JavaScript', () => {
    expectStaticWrap('javascript', true, [
      'const re = new RegExp("(a+)+$");',
      'const re = RegExp("[a-z]+");',
    ]);
    expectStaticWrap('javascript', false, [
      'const re = new RegExp(userInput);',
      'const re = new RegExp("a" + tail);',
      'const re = /foo/;',
    ]);
  });

  describe('Ruby', () => {
    expectStaticWrap('ruby', true, ['rx = Regexp.new("\\\\d+")']);
    expectStaticWrap('ruby', false, [
      'rx = Regexp.new(value)',
      'rx = /user-#{id}/',
    ]);
  });

  describe('Perl', () => {
    expectStaticWrap('perl', true, ['qr/[0-9]+/', '$x =~ m/[a-z]+/']);
  });

  describe('Elixir', () => {
    expectStaticWrap('elixir', true, ['~r/[0-9]+/', 'Regex.compile("[0-9]+")']);
  });

  describe('Clojure', () => {
    expectStaticWrap('clojure', true, ['#"[0-9]+"']);
  });

  describe('Julia', () => {
    expectStaticWrap('julia', true, ['r"[0-9]+"']);
  });

  describe('Nim', () => {
    expectStaticWrap('nim', true, ['re"[0-9]+"']);
  });

  describe('Scala', () => {
    expectStaticWrap('scala', true, ['val r = "[0-9]+".r']);
  });

  describe('Crystal', () => {
    expectStaticWrap('crystal', true, ['r = Regex.new("[a-z]+")']);
  });

  describe('languages without a regex literal stay clear', () => {
    expectStaticWrap('python', false, ['re.compile("\\\\d+")']);
    expectStaticWrap('csharp', false, [
      'new Regex("^foo$")',
      'var r = Regex("[a-z]+")',
    ]);
    expectStaticWrap('go', false, ['regexp.MustCompile("[a-z]+")']);
    expectStaticWrap('php', false, ['preg_match("/[0-9]+/", $subject)']);
    expectStaticWrap('c', false, ['regcomp(&re, "x", 0)']);
    expectStaticWrap('dart', false, ['final r = RegExp("[a-z]+");']);
    expectStaticWrap('powershell', false, ['$x -match "foo"']);
  });
});
