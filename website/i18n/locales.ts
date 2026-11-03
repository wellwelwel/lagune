export type LocaleStatus = 'published' | 'draft';

export type SiteLocale = {
  code: string;
  label: string;
  flag: string;
  status: LocaleStatus;
};

export type LocaleBuild = {
  defaultLocale: string;
  locales: [string, ...string[]];
  localeConfigs: Record<string, { label: string; htmlLang: string }>;
};

export const DEFAULT_LOCALE = 'en';

export const LOCALES: SiteLocale[] = [
  {
    code: 'en',
    label: 'English',
    flag: '/img/flags/us.svg',
    status: 'published',
  },
  {
    code: 'pt-BR',
    label: 'Português (Brasil)',
    flag: '/img/flags/br.svg',
    status: 'published',
  },
  {
    code: 'zh-CN',
    label: '简体中文',
    flag: '/img/flags/cn.svg',
    status: 'published',
  },
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
