export const openGraphLocale = (code: string): string => {
  const { language, region } = new Intl.Locale(code).maximize();

  return region ? `${language}_${region}` : language;
};
