export type LocaleStatus = 'published' | 'draft';

export type SiteLocale = {
  code: string;
  label: string;
  status: LocaleStatus;
};

export type LocaleBuild = {
  defaultLocale: string;
  locales: [string, ...string[]];
  localeConfigs: Record<string, { label: string; htmlLang: string }>;
};

export const DEFAULT_LOCALE = 'en';

export const LOCALES: SiteLocale[] = [
  { code: 'en', label: 'English', status: 'published' },
  { code: 'pt-BR', label: 'Português (Brasil)', status: 'draft' },
];

export const isPublished = (code: string): boolean =>
  LOCALES.some(
    (locale) => locale.code === code && locale.status === 'published'
  );

export const translationLocales = (): SiteLocale[] =>
  LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE);

export const findTranslationLocale = (code: string): SiteLocale | undefined =>
  translationLocales().find((locale) => locale.code === code);

export const localeOfBaseUrl = (baseUrl: string): string =>
  translationLocales().find(({ code }) => baseUrl === `/${code}/`)?.code ??
  DEFAULT_LOCALE;

export const localeBuild = ({
  includeDrafts,
}: {
  includeDrafts: boolean;
}): LocaleBuild => {
  const built = LOCALES.filter(
    (locale) => includeDrafts || locale.status === 'published'
  );

  return {
    defaultLocale: DEFAULT_LOCALE,
    locales: [
      DEFAULT_LOCALE,
      ...built
        .map((locale) => locale.code)
        .filter((code) => code !== DEFAULT_LOCALE),
    ],
    localeConfigs: Object.fromEntries(
      built.map((locale) => [
        locale.code,
        { label: locale.label, htmlLang: locale.code },
      ])
    ),
  };
};
