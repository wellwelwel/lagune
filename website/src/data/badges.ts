export const BADGE_LINK = 'https://lagune.ai';

export const badgeMarkdown = (alt: string, src: string): string =>
  `[![${alt}](${src})](${BADGE_LINK})`;
