import type { FileAnalysis } from '../../../src/types/scan.js';
import { describe, it, strict } from 'poku';
import { analysisOf } from '../../../src/hooks/dependency/analysis.js';
import { readGoMod } from '../../../src/hooks/dependency/go/module.js';
import {
  missingChecksumFlags,
  readGoSum,
} from '../../../src/hooks/dependency/go/sum.js';
import { CANNOT_JUDGE, CLEAN, report } from './__utils__.js';

const UNRECORDED =
  'no go.sum checksum, so Go builds nothing from it until go mod tidy records one from the checksum database';

const sumReport = (sum: string, mod: string): FileAnalysis =>
  analysisOf(missingChecksumFlags('go.sum', sum, 'go.mod', mod));

const GO_MOD = `module example.com/app

go 1.22

require github.com/google/uuid v1.6.0

require (
	golang.org/x/text v0.14.0 // indirect
	golang.org/x/net v0.20.0 // indirect
	example.com/lib v0.0.0-00010101000000-000000000000
	rsc.io/quote v1.5.0
	rsc.io/sampler v1.3.0
)

replace example.com/lib => "../my lib"

replace (
	rsc.io/quote v1.5.0 => rsc.io/quote v1.5.1
	rsc.io/quote v1.4.0 => ./never-required
	rsc.io/sampler => example.com/sampler v1.99.99
)
`;

describe('a go.sum advises on each module its go.mod requires without a checksum, which Go refuses to build from', () => {
  it('accepts a checksum of the whole module or of its go.mod alone, and checks what each replacement swaps in', () => {
    const result = sumReport(
      `github.com/google/uuid v1.6.0 h1:a=
github.com/google/uuid v1.6.0/go.mod h1:b=
golang.org/x/text v0.14.0/go.mod h1:c=
rsc.io/quote v1.5.0 h1:d=
rsc.io/sampler v1.3.0 h1:e=
`,
      GO_MOD
    );

    strict.deepStrictEqual(
      result,
      report(
        [],
        [
          `${UNRECORDED}: example.com/sampler@v1.99.99, golang.org/x/net@v0.20.0, rsc.io/quote@v1.5.1`,
        ]
      )
    );
  });

  it('stays silent once every fetched module has a checksum, leaving out what a folder replaces', () => {
    const result = sumReport(
      `github.com/google/uuid v1.6.0 h1:a=
golang.org/x/text v0.14.0/go.mod h1:c=
golang.org/x/net v0.20.0/go.mod h1:f=

rsc.io/quote v1.5.1 h1:g=
example.com/sampler v1.99.99/go.mod h1:h=
`,
      GO_MOD
    );

    strict.deepStrictEqual(result, CLEAN);
  });
});

describe('a go.mod is read the way Go reads it', () => {
  it("decodes Go's string escapes, a raw tab, and backquoted text, and ends a word where a comment starts", () => {
    const content = [
      'module example.com/app',
      'require (',
      `\t${String.raw`"example.com/\x61\142c\U00000064"`} v1.0.0`,
      '\t`example.com/raw` v1.0.0',
      '\texample.com/glued v1.0.0// indirect',
      '\texample.com/local v1.0.0',
      ')',
      'replace example.com/local => "../my\tlocal"',
    ].join('\n');
    const result = sumReport('', content);

    strict.deepStrictEqual(
      result,
      report(
        [],
        [
          `${UNRECORDED}: example.com/abcd@v1.0.0, example.com/glued@v1.0.0, example.com/raw@v1.0.0`,
        ]
      )
    );
  });
});

describe('a go.mod declares dependencies only when it requires a module no folder replaces', () => {
  const cases: Array<[string, string, boolean]> = [
    ['requires a module', GO_MOD, true],
    ['requires nothing', 'module example.com/app\n\ngo 1.22\n', false],
    [
      'requires only what folders replace',
      'module example.com/app\n\nrequire example.com/lib v1.0.0\n\nreplace example.com/lib v1.0.0 => ../lib\n',
      false,
    ],
  ];

  for (const [description, content, needsLockfile] of cases)
    it(`reads a go.mod that ${description}`, () => {
      strict.deepStrictEqual(readGoMod('go.mod', content), {
        flags: [],
        needsLockfile,
        pins: false,
        declaresWorkspace: false,
      });
    });
});

describe('a Go dependency file the checker cannot judge is refused instead of read as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a go.mod that never closes a block',
      () => readGoMod('go.mod', 'require (\n\trsc.io/quote v1.5.0\n'),
    ],
    [
      'a go.mod that closes a block it never opened',
      () => readGoMod('go.mod', 'module example.com/app\n)\n'),
    ],
    [
      'a go.mod requirement without a version',
      () => readGoMod('go.mod', 'require rsc.io/quote\n'),
    ],
    [
      'a go.mod requirement with a stray word',
      () => readGoMod('go.mod', 'require rsc.io/quote v1.5.0 extra\n'),
    ],
    [
      'a go.mod that replaces a module with another and no version',
      () =>
        readGoMod(
          'go.mod',
          'require rsc.io/quote v1.5.0\nreplace rsc.io/quote => rsc.io/fork\n'
        ),
    ],
    [
      'a go.mod that replaces a module with a folder and a version',
      () =>
        readGoMod(
          'go.mod',
          'require rsc.io/quote v1.5.0\nreplace rsc.io/quote => ../fork v1.0.0\n'
        ),
    ],
    [
      'a go.mod with a string that is never closed',
      () => readGoMod('go.mod', 'replace rsc.io/quote => "../fork\n'),
    ],
    [
      'a go.mod string with an escape only JSON knows',
      () => readGoMod('go.mod', 'require "example.com\\/app" v1.0.0\n'),
    ],
    [
      'a go.mod string with an octal escape past one byte',
      () => readGoMod('go.mod', 'require "example.com/\\400" v1.0.0\n'),
    ],
    [
      'a go.mod string that escapes a surrogate',
      () => readGoMod('go.mod', 'require "example.com/\\ud800" v1.0.0\n'),
    ],
    [
      'a go.mod with a block comment',
      () => readGoMod('go.mod', 'module example.com/app\n/* old */\n'),
    ],
    [
      'a go.sum line without a checksum',
      () => readGoSum('go.sum', 'rsc.io/quote v1.5.0\n'),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
