const EXCERPT_LENGTH = 80;

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const quotedExcerpt = (value: string): string =>
  JSON.stringify(value.slice(0, EXCERPT_LENGTH));
