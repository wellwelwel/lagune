import { stdout } from 'node:process';
import { styleText } from 'node:util';

export const color = {
  dim: (text: string): string => styleText('dim', text, { stream: stdout }),
  bold: (text: string): string => styleText('bold', text, { stream: stdout }),
  green: (text: string): string => styleText('green', text, { stream: stdout }),
  blue: (text: string): string =>
    styleText('blueBright', text, { stream: stdout }),
};
