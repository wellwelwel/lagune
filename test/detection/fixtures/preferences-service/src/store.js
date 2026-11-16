const DEFAULTS = Object.freeze({
  theme: 'light',
  language: 'en',
  digest: 'weekly',
});

const preferences = new Map();

export const readPreferences = (userId) =>
  structuredClone(preferences.get(userId) ?? DEFAULTS);

export const savePreferences = (userId, value) => {
  preferences.set(userId, structuredClone(value));
};
