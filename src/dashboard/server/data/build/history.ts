import type { HistoryItem } from '../../../../types/dashboard/dashboard';
import { bulletField } from '../../../../core/markdown/fields';
import { inlineText } from '../../../../core/markdown/lines';
import { sectionBlocks } from '../../../../core/markdown/sections';
import { toSeverity } from '../../../shared/severity';

export const buildHistory = (history: string | null): HistoryItem[] =>
  sectionBlocks(history, 'Closed findings').map((block) => ({
    name: block.name,
    classification: toSeverity(bulletField(block.body, 'Classification')),
    whatItIs: inlineText(bulletField(block.body, 'What it is')),
    closed: inlineText(bulletField(block.body, 'Closed')),
  }));
