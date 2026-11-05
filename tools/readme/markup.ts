import type { IconName } from './types';
import {
  LINE_BASELINE,
  LINE_HEIGHT,
  PARAGRAPH_GAP,
  PROMPT_FONT_SIZE,
  PROMPT_SCALE,
} from './layout';
import { characterAdvance } from './metrics';

const COMMAND = /(\/lagune[a-z-]*)/;
const BULLET_MARKER = '- ';
const BULLET_INDENT = 26;
const BULLET_CENTER = 14;

export const escapeXml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export const roundedRectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) =>
  [
    `M${x + radius} ${y}`,
    `H${x + width - radius}`,
    `A${radius} ${radius} 0 0 1 ${x + width} ${y + radius}`,
    `V${y + height - radius}`,
    `A${radius} ${radius} 0 0 1 ${x + width - radius} ${y + height}`,
    `H${x + radius}`,
    `A${radius} ${radius} 0 0 1 ${x} ${y + height - radius}`,
    `V${y + radius}`,
    `A${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
    'Z',
  ].join('');

export const hairlineRectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  attributes: string
) =>
  `<rect x="${x + 0.5}" y="${y + 0.5}" width="${width - 1}" height="${height - 1}" rx="${radius - 0.5}" ${attributes}/>`;

export const icon = (
  name: IconName,
  x: number,
  y: number,
  size: number,
  className: string
) =>
  `<use href="#icon-${name}" x="${x}" y="${y}" width="${size}" height="${size}" class="${className}"/>`;

export const agentLogo = (name: IconName, x: number, y: number, size: number) =>
  icon(name, x, y, size, 'agent-logo');

export const fittedText = (
  text: string,
  x: number,
  baseline: number,
  width: number,
  className: string
) =>
  `<text x="${x}" y="${baseline}" class="sans ${className}" textLength="${width}" lengthAdjust="spacing">${escapeXml(text)}</text>`;

const segments = (line: string) =>
  line
    .split(COMMAND)
    .map((text, index) => ({ text, isCommand: index % 2 === 1 }));

const advances = (line: string) =>
  segments(line).flatMap(({ text, isCommand }) =>
    [...text].map(
      (character) =>
        characterAdvance(character, PROMPT_FONT_SIZE) *
        (isCommand ? PROMPT_SCALE.command : PROMPT_SCALE.text)
    )
  );

export const characterOffsets = (line: string) =>
  advances(line).reduce<number[]>(
    (offsets, advance) => [...offsets, (offsets.at(-1) ?? 0) + advance],
    []
  );

export const lineWidth = (line: string) =>
  Number((characterOffsets(line).at(-1) ?? 0).toFixed(1));

const isBullet = (line: string) => line.startsWith(BULLET_MARKER);

const bulletText = (line: string) => line.slice(BULLET_MARKER.length);

const renderedWidth = (line: string) =>
  isBullet(line)
    ? BULLET_INDENT + lineWidth(bulletText(line))
    : lineWidth(line);

export const renderedPromptWidth = (prompt: string[]) =>
  Math.max(...prompt.map(renderedWidth));

const lineHeight = (line: string) => (line ? LINE_HEIGHT : PARAGRAPH_GAP);

export const promptHeight = (prompt: string[]) =>
  prompt.reduce((height, line) => height + lineHeight(line), 0);

export const lineTops = (prompt: string[], top: number) =>
  prompt.map((_, index) => top + promptHeight(prompt.slice(0, index)));

const highlightCommands = (line: string) =>
  segments(line)
    .map(({ text, isCommand }) =>
      isCommand
        ? `<tspan class="command">${escapeXml(text)}</tspan>`
        : escapeXml(text)
    )
    .join('');

const glyphPositions = (line: string, x: number) =>
  [0, ...characterOffsets(line).slice(0, -1)]
    .map((offset) => Number((x + offset).toFixed(1)))
    .join(' ');

export const promptLine = (
  line: string,
  x: number,
  top: number,
  className = ''
) =>
  `<text x="${glyphPositions(line, x)}" y="${top + LINE_BASELINE}" class="sans prompt ${className}">${highlightCommands(line)}</text>`;

const renderedLine = (line: string, x: number, top: number) =>
  isBullet(line)
    ? `<circle cx="${x + BULLET_CENTER}" cy="${top + LINE_HEIGHT / 2 + 0.5}" r="2" class="bullet"/>${promptLine(bulletText(line), x + BULLET_INDENT, top)}`
    : promptLine(line, x, top);

export const renderedPromptLines = (
  prompt: string[],
  x: number,
  top: number
) => {
  const tops = lineTops(prompt, top);

  return prompt
    .flatMap((line, index) =>
      line ? [renderedLine(line, x, tops[index])] : []
    )
    .join('\n      ');
};
