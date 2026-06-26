import { env, stdout } from 'node:process';
import { styleText } from 'node:util';

const OFF = new Set(['', '0', 'false']);

const colorEnabled = (): boolean => {
  const force = env.FORCE_COLOR;

  if (force !== undefined && !OFF.has(force)) return true;
  if (env.NO_COLOR) return false;

  return stdout.isTTY === true;
};

const paint =
  (style: Parameters<typeof styleText>[0]) =>
  (text: string): string =>
    colorEnabled() ? styleText(style, text, { stream: stdout }) : text;

export const color = {
  dim: paint('dim'),
  bold: paint('bold'),
  green: paint('green'),
  blue: paint('blueBright'),
};
