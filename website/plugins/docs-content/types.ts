import type { Messages } from '../../src/data/messages';
import type { PageState } from './translation';

export type DocAlternate = {
  locale: string;
  permalink: string;
};

export type DocEntry = {
  docId: string;
  permalink: string;
  source: string;
  title: string;
  sidebarLabel: string;
  description: string | undefined;
  keywords: string[];
  parent: string | undefined;
  datePublished: string | undefined;
  dateModified: string | undefined;
  state: PageState;
  alternates: DocAlternate[];
};

export type DocsSidebarLink = {
  type: 'link';
  docId: string;
  label: string;
  permalink: string;
};

export type DocsSidebarCategory = {
  type: 'category';
  key: string;
  label: string;
  collapsed: boolean;
  items: DocsSidebarLink[];
};

export type DocsSidebarEntry = DocsSidebarLink | DocsSidebarCategory;

export type DocsGlobalData = {
  sidebar: DocsSidebarEntry[];
  docs: DocEntry[];
  data: Messages;
};
