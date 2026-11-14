const UNPRINTABLE = /[^\x20-\x7e]/gu;

const URL_CREDENTIALS = /([a-z][a-z\d+.-]{0,31}:\/\/)[^\s/@]{1,512}@/gi;

const NAME_LENGTH = 214;

/** The problem of each file the checker cannot judge, keyed by the error that names it, which no fault of the engine's own ever carries */
const UNJUDGED_PROBLEMS = new WeakMap<Error, string>();

const escaped = (text: string): string =>
  text.replace(
    UNPRINTABLE,
    (character) => `\\u{${(character.codePointAt(0) ?? 0).toString(16)}}`
  );

/** The text with the user name and password of every URL in it left out */
const withoutCredentials = (text: string): string =>
  text.replace(URL_CREDENTIALS, '$1');

/** A name as the report prints it, never repeating a credential a URL in it carries */
export const shownName = (name: string): string => {
  const shown = withoutCredentials(name);

  return escaped(
    shown.length > NAME_LENGTH ? `${shown.slice(0, NAME_LENGTH)}...` : shown
  );
};

const shownText = (text: string): string => escaped(withoutCredentials(text));

const reported = (message: string): Error => new Error(shownText(message));

export const cannotJudge = (file: string, problem: string): Error => {
  const error = reported(
    `${file} ${problem}, so the dependency checker cannot judge it`
  );

  UNJUDGED_PROBLEMS.set(error, shownText(problem));

  return error;
};

export const unjudgedProblem = (error: unknown): string | undefined =>
  error instanceof Error ? UNJUDGED_PROBLEMS.get(error) : undefined;

/** A judgment across files, or its fallback when a file it reads is one the checker cannot judge, which that file's own lead already names */
export const unlessUnjudged = async <Value>(
  judgment: Promise<Value>,
  fallback: Value
): Promise<Value> => {
  try {
    return await judgment;
  } catch (error) {
    if (unjudgedProblem(error) === undefined) throw error;

    return fallback;
  }
};

/** The error for the Ruby parser Lagune ships failing to start, which no change to the file it was about to read can fix */
export const rubyParserFault = (file: string, problem: string): Error =>
  reported(
    `Lagune's Ruby parser could not start to read ${file} (${problem}): reinstall Lagune, then run this again.`
  );
