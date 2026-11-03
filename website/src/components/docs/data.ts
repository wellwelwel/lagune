import type {
  DocEntry,
  DocsGlobalData,
  DocsSidebarCategory,
  DocsSidebarEntry,
  DocsSidebarLink,
} from '@site/plugins/docs-content';
import type { Messages } from '@site/src/data/messages';
import { translate } from '@docusaurus/Translate';
import { usePluginData } from '@docusaurus/useGlobalData';

export type DocContext = {
  eyebrow: string;
  banner: string;
  previous: DocsSidebarLink | undefined;
  next: DocsSidebarLink | undefined;
};

export const useDocsData = (): DocsGlobalData => {
  const data = usePluginData('lagune-docs-content');
  return data as DocsGlobalData;
};

export const useDataMessages = (): Messages => useDocsData().data;

const isCategory = (entry: DocsSidebarEntry): entry is DocsSidebarCategory =>
  entry.type === 'category';

export const flattenSidebar = (
  sidebar: DocsSidebarEntry[]
): DocsSidebarLink[] =>
  sidebar.flatMap((entry) => (isCategory(entry) ? entry.items : [entry]));

const banners = [2, 3, 4, 5, 0];

export const findDocContext = (
  sidebar: DocsSidebarEntry[],
  doc: Pick<DocEntry, 'docId' | 'parent'>
): DocContext => {
  const docId = doc.parent ?? doc.docId;
  const links = flattenSidebar(sidebar);
  const position = links.findIndex((link) => link.docId === docId);

  const owner = sidebar.findIndex((entry) =>
    isCategory(entry)
      ? entry.items.some((link) => link.docId === docId)
      : entry.docId === docId
  );
  const entry = owner === -1 ? undefined : sidebar[owner];

  return {
    eyebrow:
      entry && isCategory(entry)
        ? entry.label
        : translate({
            id: 'common.documentation',
            message: 'Documentation',
            description: 'The name of the documentation as a whole',
          }),
    banner: `/img/docs/banner-${banners[Math.max(owner, 0) % banners.length]}.webp`,
    previous: links[doc.parent ? position : position - 1],
    next:
      position !== -1 && position < links.length - 1
        ? links[position + 1]
        : undefined,
  };
};
