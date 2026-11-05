import type { IconName, Prompt } from './types';
import { CHARACTER_WIDTH } from './layout';
import { promptLength } from './timeline';

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
  [topLeft, topRight, bottomRight, bottomLeft]: [number, number, number, number]
) =>
  [
    `M${x + topLeft} ${y}`,
    `H${x + width - topRight}`,
    `A${topRight} ${topRight} 0 0 1 ${x + width} ${y + topRight}`,
    `V${y + height - bottomRight}`,
    `A${bottomRight} ${bottomRight} 0 0 1 ${x + width - bottomRight} ${y + height}`,
    `H${x + bottomLeft}`,
    `A${bottomLeft} ${bottomLeft} 0 0 1 ${x} ${y + height - bottomLeft}`,
    `V${y + topLeft}`,
    `A${topLeft} ${topLeft} 0 0 1 ${x + topLeft} ${y}`,
    'Z',
  ].join('');

export const icon = (
  name: IconName,
  x: number,
  y: number,
  size: number,
  className: string
) =>
  `<use href="#icon-${name}" x="${x}" y="${y}" width="${size}" height="${size}" class="${className}"/>`;

export const promptWidth = (prompt: Prompt) =>
  promptLength(prompt) * CHARACTER_WIDTH;

export const promptText = (
  prompt: Prompt,
  x: number,
  y: number,
  className = ''
) =>
  `<text x="${x}" y="${y}" class="mono prompt ${className}" textLength="${promptWidth(prompt)}" lengthAdjust="spacingAndGlyphs"><tspan class="command">${escapeXml(prompt.command)}</tspan>${escapeXml(prompt.text)}</text>`;
