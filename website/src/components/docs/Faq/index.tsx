import type { ReactNode } from 'react';
import Head from '@docusaurus/Head';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';

export type FaqItem = {
  question: string;
  answer: string;
};

export const Faq = ({ items }: { items: FaqItem[] }): ReactNode => {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);

      if (next.has(index)) next.delete(index);
      else next.add(index);

      return next;
    });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <Head>
        <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
      </Head>
      <section className='lagune-faq mt-8'>
        <h2 id='faq' className='text-balance'>
          Frequently Asked Questions
        </h2>
        <div className='flex flex-col gap-3'>
          {items.map((item, index) => {
            const isOpen = open.has(index);
            const panelId = `faq-panel-${index}`;

            return (
              <div
                key={item.question}
                className='rounded-xl border border-[rgba(0,94,255,0.2)] bg-[rgba(0,94,255,0.035)] px-5 transition-colors duration-200 hover:border-[rgba(0,94,255,0.45)] hover:bg-[rgba(0,94,255,0.07)]'
              >
                <h3 className='m-0'>
                  <button
                    type='button'
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className='flex w-full cursor-pointer appearance-none items-center justify-between gap-4 border-0 bg-transparent px-0 py-3 text-left text-base font-semibold'
                  >
                    <span className='text-balance text-[14px] text-[var(--ifm-link-color)]'>
                      {item.question}
                    </span>
                    <LuPlus
                      aria-hidden
                      className={`size-5 shrink-0 transition-[rotate,color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                        isOpen
                          ? 'rotate-45 text-[var(--ifm-link-color)]'
                          : 'rotate-0 text-[rgba(0,94,255,0.5)]'
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className='min-h-0 overflow-hidden'>
                    <p className='m-0 border-t border-[rgba(0,94,255,0.16)] py-4 text-pretty text-[13px] text-[#0e2a6e] docs-dark:text-[color-mix(in_srgb,var(--ifm-font-color-base)_82%,transparent)]'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
