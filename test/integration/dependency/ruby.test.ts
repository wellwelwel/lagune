import { describe, it, strict } from 'poku';
import { errorMessage } from '../../../src/core/errors.js';
import { readGemfile } from '../../../src/hooks/dependency/ruby/gemfile.js';
import { readGemfileLock } from '../../../src/hooks/dependency/ruby/lockfile.js';
import {
  CANNOT_JUDGE,
  CLEAN,
  findings,
  flaggedNames,
  PLAIN,
  reported,
} from './__utils__.js';

const refusalOf = (read: () => unknown): string => {
  try {
    read();
  } catch (error) {
    return errorMessage(error);
  }

  return '';
};

describe('a Gemfile flags every source it writes over plain http:// or git://', () => {
  it('reads a URL as a source whatever call takes it, and the symbols Bundler 2 fetches over http://', () => {
    const result = readGemfile(
      'Gemfile',
      `source "http://gems.example.com"
source :rubygems
git_source(:internal) { |repo| "http://git.internal/#{repo}.git" }

gem "rails", "~> 7.1"
gem "fork", :git => 'git://github.com/me/fork.git', branch: "main"
gem "mirror", source: ENV.fetch("GEM_SOURCE") { "http://mirror.example/" }

source "http://private.example" do
  gem "internal"
end

git "http://github.com/me/tools.git" do
  gem "tool"
end
`
    );

    strict.deepStrictEqual(
      [reported(result), result.needsLockfile],
      [
        findings([
          `${PLAIN}: git://github.com/me/fork.git, http://gems.example.com, http://git.internal/#{repo}.git, http://github.com/me/tools.git, http://mirror.example/, http://private.example, source :rubygems`,
        ]),
        true,
      ]
    );
  });

  it('leaves out comments, command strings, and quotes nested in an interpolation, and stays silent on https and ssh', () => {
    const result = readGemfile(
      'Gemfile',
      `source "https://rubygems.org"
# gem "old", git: "http://old.example/old.git"
=begin
We don't use "http://commented.example" anymore.
=end
gem "private", source: "https://#{ENV["GEM_TOKEN"]}@gems.example.com/"
gem "tool", git: "git@github.com:me/tool.git"
gem "tzinfo-data", platforms: %i[ windows jruby ]
revision = \`git ls-remote "http://cmd.example" HEAD\`
`
    );

    strict.deepStrictEqual(reported(result), CLEAN);
  });

  const writtenForms: Array<[string, string, string[]]> = [
    ['a %q string', 'source %q{http://q.example}\n', ['http://q.example']],
    [
      'a %Q string with nested brackets and an interpolation',
      'source %Q(http://nested.example/(a)/#{ENV["PATH"]})\n',
      ['http://nested.example/(a)/#{ENV["PATH"]}'],
    ],
    [
      'a bare percent string',
      'source %|http://bare.example|\n',
      ['http://bare.example'],
    ],
    [
      'a %w list of words',
      'MIRRORS = %w[https://safe.example http://w.example]\n',
      ['http://w.example'],
    ],
    [
      'a %I list with an interpolation',
      'SOURCES = %I<http://i.example #{suffix}>\n',
      ['http://i.example'],
    ],
    [
      'a <<~ heredoc',
      'source <<~URL.strip\n  http://squiggly.example\nURL\n',
      ['http://squiggly.example'],
    ],
    [
      'a <<- heredoc with a single-quoted identifier',
      "source <<-'URL'.strip\n    http://dash.example\n    URL\n",
      ['http://dash.example'],
    ],
    [
      'a << heredoc with a double-quoted identifier',
      'source <<"END URL".chomp\nhttp://double.example\nEND URL\n',
      ['http://double.example'],
    ],
    [
      'two heredocs opened on one line',
      'mirror(<<~ONE, <<~TWO)\n  http://one.example\nONE\n  http://two.example\nTWO\n',
      ['http://one.example', 'http://two.example'],
    ],
  ];

  for (const [form, content, urls] of writtenForms)
    it(`finds a plain URL written as ${form}`, () => {
      const result = readGemfile('Gemfile', content);

      strict.deepStrictEqual(flaggedNames(result), urls);
    });

  const hiddenForms: Array<[string, string, string]> = [
    [
      'behind a quote inside a regular expression',
      'a = /"/\nsource "http://regex.example"\nb = /"/\n',
      'http://regex.example',
    ],
    [
      'behind the $" global variable',
      'x = $"\nsource "http://dollar.example"\ny = $"\n',
      'http://dollar.example',
    ],
    [
      'behind a ?" character literal',
      'q = ?"\nsource "http://question.example"\nr = ?"\n',
      'http://question.example',
    ],
    [
      'behind a hexadecimal escape',
      'source "\\x68ttp://hex.example"\n',
      'http://hex.example',
    ],
    [
      'behind escaped slashes',
      'source "http:\\/\\/slash.example"\n',
      'http://slash.example',
    ],
    [
      'between two divisions by a local variable a pattern match declares',
      'case 4\nin a\nend\nb = a /2; source "http:\\/\\/evil.example"; c = a/ 2\n',
      'http://evil.example',
    ],
    [
      'across adjacent strings Ruby joins',
      'source "http" "://joined.example"\n',
      'http://joined.example',
    ],
    ['through self', 'self.source :rubygems\n', 'source :rubygems'],
  ];

  for (const [form, content, source] of hiddenForms)
    it(`finds a plain source a crafted Gemfile hides ${form}`, () => {
      const result = readGemfile('Gemfile', content);

      strict.deepStrictEqual(flaggedNames(result), [source]);
    });

  const quotingForms: Array<[string, string]> = [
    ['a heredoc', 'warn <<~MSG\n  Don\'t pin "this" yet\nMSG\n'],
    ['a command heredoc', 'REVISION = <<`GIT`\ngit log -1 --format="%H\nGIT\n'],
    ['a %w list', "SKIPPED = %w[don't can't]\n"],
    ['a %q string', 'NOTE = %q(it\'s "fine")\n'],
  ];

  for (const [form, content] of quotingForms)
    it(`keeps reading a valid Gemfile past a stray quote inside ${form}`, () => {
      const result = readGemfile(
        'Gemfile',
        `${content}source "http://after.example"\n`
      );

      strict.deepStrictEqual(flaggedNames(result), ['http://after.example']);
    });

  it('stops reading at __END__, leaving the data after it out, stray quotes included', () => {
    const result = readGemfile(
      'Gemfile',
      'source "http://before.example"\n__END__\nit\'s data: source "http://after.example"\n'
    );

    strict.deepStrictEqual(flaggedNames(result), ['http://before.example']);
  });

  it('declares dependencies through gem or gemspec alone, never through the word in a string or a comment', () => {
    const results = [
      'source "https://rubygems.org"\ngemspec\n',
      'source "https://rubygems.org"\ngroup(:test) { gem "rspec" }\n',
      'source "https://rubygems.org"\n# gem "rails"\nputs "gem"\n',
      'source "https://rubygems.org"\n',
    ].map((content) => readGemfile('Gemfile', content).needsLockfile);

    strict.deepStrictEqual(results, [true, true, false, false]);
  });
});

describe('a Gemfile.lock flags each gem it locks from a remote over plain http:// or git://', () => {
  it('reads every source section, flagging the gems of one whose remotes include a plain one', () => {
    const result = readGemfileLock(
      'Gemfile.lock',
      `GIT
  remote: git://github.com/me/fork.git
  revision: abc
  branch: main
  specs:
    fork (0.1.0)
      rack (>= 2)

GEM
  remote: http://rubygems.org/
  remote: https://gems.example.com/
  specs:
    nokogiri (1.16.0-x86_64-linux)
      racc (~> 1.4)
    rack (3.0.8)

GEM
  remote: https://rubygems.org/
  specs:
    safe (1.0.0)

PLUGIN SOURCE
  remote: http://github.com/me/plugin.git
  type: git
  revision: def
  specs:
    bundler-plugin (1.0.0)

PATH
  remote: .
  specs:
    app (0.1.0)

PLATFORMS
  ruby

DEPENDENCIES
  fork!
  rack

BUNDLED WITH
   2.5.6
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: bundler-plugin (1.0.0), fork (0.1.0), nokogiri (1.16.0-x86_64-linux), rack (3.0.8)`,
      ])
    );
  });

  it('reads an empty Gemfile.lock as nothing locked yet, the way Bundler does', () => {
    const result = readGemfileLock('Gemfile.lock', '\n');

    strict.deepStrictEqual(reported(result), CLEAN);
  });
});

describe('a Ruby dependency file the checker cannot judge is refused instead of read as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a Gemfile that never closes a string',
      () => readGemfile('Gemfile', 'gem "rails\n'),
    ],
    [
      'a Gemfile that never closes an interpolation',
      () => readGemfile('Gemfile', 'source "https://#{ENV["HOST"]"\n'),
    ],
    [
      'a Gemfile that never ends a =begin comment',
      () => readGemfile('Gemfile', '=begin\nsource "http://x"\n'),
    ],
    [
      'a Gemfile that never closes a percent literal',
      () => readGemfile('Gemfile', 'source %q(http://x\n'),
    ],
    [
      'a Gemfile that never ends a heredoc',
      () => readGemfile('Gemfile', 'source <<~URL\n  http://x\n'),
    ],
    [
      'a Gemfile whose heredoc terminator carries trailing spaces, as Ruby does',
      () => readGemfile('Gemfile', 'source <<~URL\n  http://x\nURL  \n'),
    ],
    [
      'a Gemfile.lock left with merge conflict markers',
      () =>
        readGemfileLock(
          'Gemfile.lock',
          'GEM\n<<<<<<< HEAD\n  remote: http://rubygems.org/\n=======\n  remote: https://rubygems.org/\n>>>>>>> main\n'
        ),
    ],
    [
      'a Gemfile.lock that opens none of the sections Bundler writes',
      () => readGemfileLock('Gemfile.lock', '{"GEM": []}\n'),
    ],
    [
      'a Gemfile.lock line a source section never holds',
      () =>
        readGemfileLock(
          'Gemfile.lock',
          'GEM\n   remote: http://rubygems.org/\n  specs:\n'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });

  it('refuses a Gemfile nested deeper than the Ruby parser reaches, naming it, and reads the next Gemfile afresh', () => {
    const refusal = refusalOf(() =>
      readGemfile(
        'deep/Gemfile',
        `x = ${'['.repeat(50_000)}${']'.repeat(50_000)}\n`
      )
    );
    const next = readGemfile('Gemfile', 'source "http://next.example"\n');

    strict.match(
      refusal,
      /^deep\/Gemfile .+, so the dependency checker cannot judge it/
    );
    strict.deepStrictEqual(flaggedNames(next), ['http://next.example']);
  });
});
