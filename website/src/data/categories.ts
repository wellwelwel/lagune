import type { Messages, TranslationMessages } from './messages';
import { CATEGORIES, categoryIcon } from './lagune';
import { text } from './messages';

export type Category = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

export const CATEGORIES_ADD = 'npx lagune write add';

const labelId = (key: string): string => `category.${key}.label`;

const descriptionId = (key: string): string => `category.${key}.description`;

export const categoryMessages = (): TranslationMessages =>
  Object.fromEntries(
    CATEGORIES.flatMap((category) => [
      [
        labelId(category.key),
        {
          message: category.label,
          description: `The name of the ${category.label} specialization category`,
        },
      ],
      [
        descriptionId(category.key),
        {
          message: category.description,
          description: `What the ${category.label} specialization category covers`,
        },
      ],
    ])
  );

export const categoryLabelIn = (messages: Messages, key: string): string =>
  text(messages, labelId(key));

export const categoriesIn = (messages: Messages): Category[] =>
  CATEGORIES.map((category) => ({
    key: category.key,
    name: categoryLabelIn(messages, category.key),
    description: text(messages, descriptionId(category.key)),
    icon: categoryIcon(category.key),
  }));
