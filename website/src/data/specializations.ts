import type {
  CategoryBadge,
  PromptSegment,
  SpecializationIconName,
} from './lagune';
import type { Messages, TranslationMessages } from './messages';
import { categoryLabelIn } from './categories';
import {
  BUILTIN_SPECIALIZATIONS,
  LOAD_VERB,
  specializationCategories,
  specializationDescription,
  specializationIconName,
  specializationLabel,
  specializationLoadPrompt,
  specializationPrompt,
} from './lagune';
import { text } from './messages';

export type CatalogSpecialization = {
  name: string;
  label: string;
  icon: SpecializationIconName;
  description: string;
  prompt: PromptSegment[][];
  loadPrompt: string;
  categories: CategoryBadge[];
};

const LOAD_VERB_ID = 'specialization.loadVerb';

const labelId = (name: string): string => `specialization.${name}.label`;

const descriptionId = (name: string): string =>
  `specialization.${name}.description`;

const requestId = (name: string): string => `specialization.${name}.request`;

const plainText = (segments: PromptSegment[]): string =>
  segments
    .filter((segment) => segment.mark === undefined)
    .map((segment) => segment.text)
    .join('')
    .trim();

const overlayPlainText = (
  segments: PromptSegment[],
  replacement: string
): PromptSegment[] =>
  segments.map((segment) =>
    segment.mark === undefined ? { text: replacement } : segment
  );

const byName = (
  left: CatalogSpecialization,
  right: CatalogSpecialization
): number => left.name.localeCompare(right.name);

export const specializationMessages = (): TranslationMessages => ({
  [LOAD_VERB_ID]: {
    message: LOAD_VERB,
    description:
      'The verb that opens the prompt loading a specialization, before its command',
  },
  ...Object.fromEntries(
    BUILTIN_SPECIALIZATIONS.flatMap(({ name }) => {
      const label = specializationLabel(name);
      const [requestLine = []] = specializationPrompt(name);

      return [
        [
          labelId(name),
          {
            message: label,
            description: `The name of the ${label} specialization`,
          },
        ],
        [
          descriptionId(name),
          {
            message: specializationDescription(name),
            description: `What the ${label} specialization protects, in plain language`,
          },
        ],
        [
          requestId(name),
          {
            message: plainText(requestLine),
            description: `An example request a user writes after /lagune when the ${label} specialization applies`,
          },
        ],
      ];
    })
  ),
});

export const catalogIn = (messages: Messages): CatalogSpecialization[] => {
  const loadVerb = text(messages, LOAD_VERB_ID);

  return BUILTIN_SPECIALIZATIONS.map(({ name }) => {
    const [requestLine = [], loadLine = []] = specializationPrompt(name);

    return {
      name,
      label: text(messages, labelId(name)),
      icon: specializationIconName(name),
      description: text(messages, descriptionId(name)),
      prompt: [
        overlayPlainText(requestLine, ` ${text(messages, requestId(name))}`),
        overlayPlainText(loadLine, `${loadVerb} `),
      ],
      loadPrompt: `${loadVerb}${specializationLoadPrompt(name).slice(LOAD_VERB.length)}`,
      categories: specializationCategories(name).map((category) => ({
        ...category,
        label: categoryLabelIn(messages, category.key),
      })),
    };
  }).sort(byName);
};

export const loadVerbIn = (messages: Messages): string =>
  text(messages, LOAD_VERB_ID);
