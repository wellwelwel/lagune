import type { DocEntry } from '../../../../plugins/docs-content/types';

export type SearchableDoc = Pick<
  DocEntry,
  'docId' | 'title' | 'sidebarLabel' | 'description' | 'keywords' | 'state'
>;

const COMBINING_MARK = /\p{M}/gu;

export const foldForSearch = (text: string, locale: string): string =>
  text.toLocaleLowerCase(locale).normalize('NFD').replace(COMBINING_MARK, '');

const searchableText = (doc: SearchableDoc, locale: string): string =>
  foldForSearch(
    [
      doc.title,
      doc.sidebarLabel,
      doc.docId,
      doc.description ?? '',
      ...doc.keywords,
    ].join(' '),
    locale
  );

/** The docs matching every term of a query, with translated pages ranked before the ones still in English */
export const searchDocs = <Doc extends SearchableDoc>(
  docs: Doc[],
  query: string,
  locale: string,
  limit: number
): Doc[] => {
  const terms = foldForSearch(query, locale).split(/\s+/).filter(Boolean);

  if (terms.length === 0) return [];

  const matching = docs.filter((doc) => {
    const text = searchableText(doc, locale);

    return terms.every((term) => text.includes(term));
  });

  return [
    ...matching.filter(({ state }) => state !== 'untranslated'),
    ...matching.filter(({ state }) => state === 'untranslated'),
  ].slice(0, limit);
};
