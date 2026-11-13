import { parse, TomlError } from 'toml.min';
import { cannotJudge } from './text.js';

/** The tables of a TOML file, refusing one it cannot parse instead of reading it as empty */
export const tomlOf = (
  file: string,
  content: string
): Record<string, unknown> => {
  try {
    return parse<Record<string, unknown>>(content);
  } catch (error) {
    if (!(error instanceof TomlError)) throw error;

    throw cannotJudge(
      file,
      `is not valid TOML at line ${error.line}, column ${error.column}`
    );
  }
};
