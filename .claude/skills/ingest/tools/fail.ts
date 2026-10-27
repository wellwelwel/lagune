export const fail = (message: string): never => {
  throw new Error(message);
};
