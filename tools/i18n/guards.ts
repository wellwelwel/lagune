import type {
  TranslationMessage,
  TranslationMessages,
} from '../../website/src/data/messages';

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isTranslationMessage = (value: unknown): value is TranslationMessage =>
  isRecord(value) &&
  typeof value.message === 'string' &&
  (value.description === undefined || typeof value.description === 'string') &&
  Object.keys(value).every((key) => key === 'message' || key === 'description');

export const isTranslationMessages = (
  value: unknown
): value is TranslationMessages =>
  isRecord(value) && Object.values(value).every(isTranslationMessage);
