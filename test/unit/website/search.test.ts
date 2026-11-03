import type { SearchableDoc } from '../../../website/src/components/docs/QuickSearch/search.js';
import { describe, it, strict } from 'poku';
import { searchDocs } from '../../../website/src/components/docs/QuickSearch/search.js';

const doc = (
  docId: string,
  title: string,
  state: SearchableDoc['state'],
  keywords: string[] = []
): SearchableDoc => ({
  docId,
  title,
  sidebarLabel: title,
  description: undefined,
  keywords,
  state,
});

const DOCS = [
  doc('hooks/regex', 'regex hook: Detect ReDoS Patterns', 'untranslated', [
    'segurança',
  ]),
  doc('get-started/install', 'Instalação para qualquer agente', 'translated'),
  doc('catalog', 'Catálogo de especializações', 'stale', ['segurança']),
];

const idsOf = (docs: SearchableDoc[]): string[] =>
  docs.map(({ docId }) => docId);

describe('the docs search of a locale', () => {
  const queries = ['instalação', 'instalacao', 'INSTALAÇÃO', 'Instalacao'];

  for (const query of queries)
    it(`finds the same page for "${query}"`, () => {
      strict.deepStrictEqual(idsOf(searchDocs(DOCS, query, 'pt-BR', 8)), [
        'get-started/install',
      ]);
    });

  it('finds a page by its keywords', () => {
    strict.deepStrictEqual(idsOf(searchDocs(DOCS, 'seguranca', 'pt-BR', 8)), [
      'catalog',
      'hooks/regex',
    ]);
  });

  it('ranks translated pages before the ones still in English', () => {
    strict.deepStrictEqual(idsOf(searchDocs(DOCS, 'e', 'pt-BR', 8)), [
      'get-started/install',
      'catalog',
      'hooks/regex',
    ]);
  });
});
