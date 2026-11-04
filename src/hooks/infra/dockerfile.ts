const finalStage = (content: string): string => {
  const lines = content.split('\n');
  let start = 0;

  lines.forEach((line, index) => {
    if (/^\s*FROM\s+/i.test(line)) start = index;
  });

  return lines.slice(start).join('\n');
};

/** The last USER of the final stage decides. Without one, the user is the base image's, which the file cannot show */
export const runsAsRoot = (content: string): boolean => {
  const users = [...finalStage(content).matchAll(/^[ \t]*USER[ \t]+(\S+)/gim)];

  if (users.length === 0) return false;

  return /^(?:root|0)\b/i.test(users[users.length - 1][1]);
};

const DOWNLOADER = /\b(?:curl|wget)\b/;

const SHELL_STAGE = /^\s{0,16}(?:sudo\s{1,16})?(?:sh|bash|zsh)\b/;

const pipesDownloadIntoShell = (line: string): boolean =>
  line
    .split('|')
    .some(
      (stage, index, stages) =>
        index > 0 &&
        SHELL_STAGE.test(stage) &&
        DOWNLOADER.test(stages[index - 1])
    );

export const hasCurlPipe = (content: string): boolean =>
  content
    .replace(/\\\s{0,16}\n/g, ' ')
    .split('\n')
    .some(
      (line) =>
        pipesDownloadIntoShell(line) &&
        !/\b(?:sha256sum|sha512sum|gpg|cosign|checksum|--verify)\b/i.test(line)
    );

const finalImage = (content: string): string | null => {
  const lines = content.split('\n');
  let image: string | null = null;

  for (const line of lines) {
    const match = /^\s*FROM\s+(\S+)/i.exec(line);

    if (match !== null) image = match[1];
  }

  return image;
};

export const hasMutableFrom = (content: string): boolean => {
  const image = finalImage(content);

  if (image === null) return false;

  return !/@sha256:/.test(image) && !/^scratch$/i.test(image);
};
