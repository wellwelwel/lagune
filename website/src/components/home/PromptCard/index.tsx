import type { PromptMode } from '@site/src/data/home';
import { translate } from '@docusaurus/Translate';
import { Tallest } from '@site/src/components/Tallest';
import { typedText } from '@site/src/components/typedText';
import { useVisible } from '@site/src/components/useVisible';
import { PHASE_STEPS } from '@site/src/data/home';
import { lazy, memo, Suspense, useRef } from 'react';
import { LuTerminal } from 'react-icons/lu';

const CURSOR = '▍';

const ON_SCREEN = '0px';

export const TERMINAL_SURFACE =
  'rounded-2xl border border-white/[0.07] bg-[#040406] overflow-hidden [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_40px_-24px_rgba(0,0,0,0.9)]';

const Typed = lazy(() =>
  import('react-typed').then((module) => ({ default: module.ReactTyped }))
);

const typedLine = (command: string, prompt: string) =>
  prompt ? `${command} ${prompt}` : command;

const PROMPTS = PHASE_STEPS.flatMap(({ phase }) =>
  phase.modes.map((mode) => `${typedLine(phase.command, mode.prompt)}${CURSOR}`)
);

export const PromptCard = memo(
  ({
    command,
    mode,
    typed,
    onDone,
  }: {
    command: string;
    mode: PromptMode;
    typed: boolean;
    onDone: () => void;
  }) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const lineRef = useRef<HTMLParagraphElement | null>(null);
    const visible = useVisible(cardRef);
    const onScreen = useVisible(lineRef, ON_SCREEN);
    const body = mode.prompt ? ` ${typedText(mode.prompt)}` : '';

    return (
      <div ref={cardRef} className={`relative mt-3 ${TERMINAL_SURFACE}`}>
        <div className='flex items-center gap-3 px-[18px] pt-3.5 pb-1'>
          <span className='inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] uppercase text-faint [&>svg]:size-3.5 [&>svg]:text-[#5fb4ff]'>
            <LuTerminal />
            {translate({
              id: 'home.prompt.example',
              message: 'Example',
              description:
                'The label over the example prompt typed on the home page',
            })}
          </span>
        </div>
        <Tallest
          variants={PROMPTS}
          className='px-[18px] pt-1 pb-[18px] font-mono text-[13.5px] leading-[1.65] text-ink text-justify'
        >
          <p
            ref={lineRef}
            dir='auto'
            className={onScreen ? 'm-0' : 'm-0 lagune-offscreen'}
          >
            {(typed || visible) && (
              <Suspense fallback={null}>
                <Typed
                  key={`${command}${body}`}
                  strings={[
                    `<span style="color:#5fb4ff">${typedText(command)}</span>${body}`,
                  ]}
                  typeSpeed={12.5}
                  startDelay={250}
                  showCursor={false}
                  className='lagune-typed'
                  loop={false}
                  onComplete={onDone}
                />
              </Suspense>
            )}
          </p>
        </Tallest>
      </div>
    );
  }
);
