export const lockedName = (
  name: string,
  version: string | undefined
): string => (version === undefined ? name : `${name}==${version}`);
