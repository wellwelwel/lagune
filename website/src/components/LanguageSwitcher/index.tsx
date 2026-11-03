import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { LOCALES } from '@site/i18n/locales';
import { useLocaleUrl } from '@site/src/components/LocaleHead';
import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';

export type LanguageOption = {
  locale: string;
  label: string;
  flag: string;
  htmlLang: string;
  url: string;
  current: boolean;
};

type Tone = 'docs' | 'canvas';

const TONES: Record<
  Tone,
  {
    button: string;
    flag: string;
    menu: string;
    item: string;
    current: string;
    entrance: string;
  }
> = {
  docs: {
    entrance: 'lagune-docs-route-fade',
    button:
      'inline-flex h-11.5 flex-none cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-surface text-[0.85rem] font-bold text-ink-2 shadow-card transition-[color,box-shadow] hover:text-accent hover:shadow-pop max-sm:size-10 sm:pr-4 sm:pl-3.5',
    flag: 'size-4.5',
    menu: 'rounded-panel border border-line bg-surface p-1.5 shadow-pop',
    item: 'flex items-center gap-2.5 rounded-field px-3 py-2.5 text-[0.85rem] font-semibold text-ink-2 no-underline transition-colors hover:bg-canvas hover:text-ink hover:no-underline',
    current:
      'bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent',
  },
  canvas: {
    entrance: 'lagune-menu-pop',
    button:
      'inline-flex h-10 cursor-pointer items-center justify-center gap-[10px] rounded-xl border-0 bg-transparent px-1 text-[12.75px] font-semibold tracking-[-0.01em] text-[#a1b1e7] transition-colors duration-200 ease-out hover:text-ink',
    flag: 'size-4',
    menu: 'rounded-2xl border border-line bg-[rgba(10,15,31,0.92)] p-1.5 [backdrop-filter:blur(16px)_saturate(150%)] [-webkit-backdrop-filter:blur(16px)_saturate(150%)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.08),0_20px_48px_-16px_rgba(0,0,0,0.6)]',
    item: 'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] text-ink no-underline transition-colors duration-200 ease-out hover:bg-white/[0.06] hover:text-ink',
    current: 'bg-accent/15 text-accent hover:bg-accent/15 hover:text-accent',
  },
};

const FlagIcon = ({
  src,
  className,
}: {
  src: string;
  className: string;
}): ReactNode => (
  <img
    className={clsx('flex-none', className)}
    src={src}
    alt=''
    aria-hidden
    width={18}
    height={18}
  />
);

const shortName = (htmlLang: string): string =>
  (htmlLang.split('-')[0] ?? htmlLang).toUpperCase();

export const useLanguageOptions = (): LanguageOption[] => {
  const {
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext();
  const localeUrl = useLocaleUrl();

  return LOCALES.filter(
    ({ code, status }) =>
      code in localeConfigs &&
      (status === 'published' || code === currentLocale)
  ).map(({ code, label, flag }) => ({
    locale: code,
    label,
    flag,
    htmlLang: localeConfigs[code]?.htmlLang ?? code,
    url: localeUrl(code, false),
    current: code === currentLocale,
  }));
};

const languageLabel = (): string =>
  translate({
    id: 'common.language',
    message: 'Language',
    description:
      'The accessible name of the menu that switches the site language',
  });

export const LanguageLinks = ({
  options,
  tone,
  onSelect,
}: {
  options: LanguageOption[];
  tone: Tone;
  onSelect?: () => void;
}): ReactNode => (
  <>
    {options.map((option) => (
      <a
        key={option.locale}
        href={option.url}
        lang={option.htmlLang}
        hrefLang={option.htmlLang}
        aria-current={option.current ? 'page' : undefined}
        className={clsx(
          TONES[tone].item,
          option.current && TONES[tone].current
        )}
        onClick={onSelect}
      >
        <FlagIcon src={option.flag} className='size-4.5' />
        {option.label}
      </a>
    ))}
  </>
);

export const LanguageSwitcher = ({
  tone,
  className,
}: {
  tone: Tone;
  className?: string;
}): ReactNode => {
  const options = useLanguageOptions();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const current = options.find((option) => option.current);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onPointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (options.length < 2 || current === undefined) return null;

  return (
    <div ref={rootRef} className={clsx('relative flex-none', className)}>
      <button
        type='button'
        className={TONES[tone].button}
        aria-label={translate(
          {
            id: 'common.language.current',
            message: 'Language: {language}',
            description:
              'The accessible name of the language button, where {language} is the language shown now',
          },
          { language: current.label }
        )}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <FlagIcon src={current.flag} className={TONES[tone].flag} />
        <span className={clsx(tone === 'docs' && 'max-sm:hidden')}>
          {shortName(current.htmlLang)}
        </span>
      </button>
      {open && (
        <nav
          id={menuId}
          aria-label={languageLabel()}
          className={clsx(
            'absolute top-[calc(100%+8px)] right-0 z-40 flex min-w-48 flex-col gap-0.5',
            TONES[tone].entrance,
            TONES[tone].menu
          )}
        >
          <LanguageLinks
            options={options}
            tone={tone}
            onSelect={() => setOpen(false)}
          />
        </nav>
      )}
    </div>
  );
};
