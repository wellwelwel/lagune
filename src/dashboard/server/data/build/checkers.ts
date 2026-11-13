import type { ProjectCheckers } from '../../../../types/dashboard/dashboard';
import { checkersConfigOf } from '../../../../core/checkers';
import { readConfigs } from '../../../../core/configs';
import { errorMessage } from '../../../../core/errors';

/** The checkers block as the engine reads it, or the refusal that stops every checker while the block cannot be trusted */
export const buildCheckers = async (
  projectRoot: string
): Promise<ProjectCheckers> => {
  try {
    const { shared, own } = checkersConfigOf(await readConfigs(projectRoot));

    return { shared, own: [...own], problem: null };
  } catch (error) {
    return {
      shared: Object.create(null),
      own: [],
      problem: errorMessage(error),
    };
  }
};
