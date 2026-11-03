import type { TranslationMessages } from '../../src/data/messages';
import type { DocsNavCategory } from './nav';
import { agentMessages } from '../../src/data/agents';
import { categoryMessages } from '../../src/data/categories';
import { specializationMessages } from '../../src/data/specializations';
import { siteMessages } from '../../src/seo/site';
import { corpusMessages } from './markdown';
import { docsNav } from './nav';

export const NAV_FILE = 'nav';

export const DATA_FILE = 'data';

export const navCategoryId = (category: DocsNavCategory): string =>
  `category.${category.key}`;

export const navMessages = (): TranslationMessages =>
  Object.fromEntries(
    docsNav.flatMap((entry) =>
      typeof entry === 'string'
        ? []
        : [
            [
              navCategoryId(entry),
              {
                message: entry.label,
                description: `The sidebar label of the ${entry.label} group of pages`,
              },
            ],
          ]
    )
  );

export const dataMessages = (): TranslationMessages => ({
  ...siteMessages(),
  ...categoryMessages(),
  ...specializationMessages(),
  ...agentMessages(),
  ...corpusMessages(),
});
