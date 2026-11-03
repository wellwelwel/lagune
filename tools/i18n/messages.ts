import type {
  TranslationMessage,
  TranslationMessages,
} from '../../website/src/data/messages';
import type { LocaleFolder, Site } from './site';
import path from 'node:path';
import {
  dataMessages,
  navMessages,
} from '../../website/plugins/docs-content/messages';
import { PLUGIN_NAME } from '../../website/plugins/docs-content/translation';
import { codeMessages } from './extract';
import { isTranslationMessages } from './guards';
import { confinedPath, readIfPresent } from './site';

export type MessageFile = {
  name: string;
  englishMessages: (site: Site) => Promise<TranslationMessages>;
};

export type Regeneration = {
  messages: TranslationMessages;
  added: string[];
  dropped: string[];
  marked: string[];
};

const UNTRANSLATED_MARK = '[untranslated]';

export const MESSAGE_FILES: MessageFile[] = [
  { name: 'code.json', englishMessages: codeMessages },
  {
    name: `${PLUGIN_NAME}/nav.json`,
    englishMessages: async () => navMessages(),
  },
  {
    name: `${PLUGIN_NAME}/data.json`,
    englishMessages: async () => dataMessages(),
  },
];

export const isMarked = (message: TranslationMessage): boolean =>
  message.description?.startsWith(UNTRANSLATED_MARK) ?? false;

const markedDescription = (description: string | undefined): string =>
  description ? `${UNTRANSLATED_MARK} ${description}` : UNTRANSLATED_MARK;

const byId = (messages: TranslationMessages): TranslationMessages =>
  Object.fromEntries(
    Object.entries(messages).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  );

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

export const messageFilePath = (
  locale: LocaleFolder,
  file: MessageFile
): Promise<string> => confinedPath(locale.folder, file.name);

export const readMessages = async (
  file: string
): Promise<TranslationMessages | undefined> => {
  const text = await readIfPresent(file);

  if (text === undefined) return undefined;

  const parsed = parseJson(text);

  if (!isTranslationMessages(parsed))
    throw new Error(
      `"${path.basename(file)}" is not a translation file: it must be JSON where every entry has a string message and, optionally, a string description.`
    );

  return parsed;
};

/** Keeps every existing translation, marks every new message, and drops what English no longer has */
export const regenerate = (
  english: TranslationMessages,
  existing: TranslationMessages = {}
): Regeneration => {
  const messages = byId(
    Object.fromEntries(
      Object.entries(english).map(([id, source]) => {
        const current = Object.hasOwn(existing, id) ? existing[id] : undefined;

        if (current === undefined)
          return [
            id,
            {
              message: source.message,
              description: markedDescription(source.description),
            },
          ];

        return [
          id,
          {
            message: current.message,
            description: isMarked(current)
              ? markedDescription(source.description)
              : source.description,
          },
        ];
      })
    )
  );

  return {
    messages,
    added: Object.keys(english).filter((id) => !Object.hasOwn(existing, id)),
    dropped: Object.keys(existing).filter((id) => !Object.hasOwn(english, id)),
    marked: Object.entries(messages)
      .filter(([, message]) => isMarked(message))
      .map(([id]) => id),
  };
};

export const serializeMessages = (messages: TranslationMessages): string =>
  `${JSON.stringify(messages, null, 2)}\n`;
