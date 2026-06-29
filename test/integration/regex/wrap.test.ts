import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { wrapsStaticRegex } from '../../../src/hooks/regex/dynamic.js';

describe('wrapsStaticRegex flags a static literal wrapped in a constructor', () => {
  const expectAll = (
    language: LanguageId,
    verdict: boolean,
    snippets: string[]
  ): void => {
    for (const snippet of snippets)
      it(`treats ${JSON.stringify(snippet)} as ${verdict}`, () => {
        strict.strictEqual(wrapsStaticRegex(snippet, language), verdict);
      });
  };

  describe('JavaScript', () => {
    expectAll('javascript', true, [
      'const re = new RegExp("(a+)+$");',
      'const re = RegExp("[a-z]+");',
    ]);
    expectAll('javascript', false, [
      'const re = new RegExp(userInput);',
      'const re = new RegExp("a" + tail);',
      'const re = /foo/;',
    ]);
  });

  describe('Ruby', () => {
    expectAll('ruby', true, ['rx = Regexp.new("\\\\d+")']);
    expectAll('ruby', false, ['rx = Regexp.new(value)', 'rx = /user-#{id}/']);
  });

  describe('Perl', () => {
    expectAll('perl', true, ['qr/[0-9]+/', '$x =~ m/[a-z]+/']);
  });

  describe('Elixir', () => {
    expectAll('elixir', true, ['~r/[0-9]+/', 'Regex.compile("[0-9]+")']);
  });

  describe('Clojure', () => {
    expectAll('clojure', true, ['#"[0-9]+"']);
  });

  describe('Julia', () => {
    expectAll('julia', true, ['r"[0-9]+"']);
  });

  describe('Nim', () => {
    expectAll('nim', true, ['re"[0-9]+"']);
  });

  describe('Scala', () => {
    expectAll('scala', true, ['val r = "[0-9]+".r']);
  });

  describe('Crystal', () => {
    expectAll('crystal', true, ['r = Regex.new("[a-z]+")']);
  });

  describe('languages without a regex literal stay clear', () => {
    expectAll('python', false, ['re.compile("\\\\d+")']);
    expectAll('csharp', false, [
      'new Regex("^foo$")',
      'var r = Regex("[a-z]+")',
    ]);
    expectAll('go', false, ['regexp.MustCompile("[a-z]+")']);
    expectAll('php', false, ['preg_match("/[0-9]+/", $subject)']);
    expectAll('c', false, ['regcomp(&re, "x", 0)']);
    expectAll('powershell', false, ['$x -match "foo"']);
  });
});
