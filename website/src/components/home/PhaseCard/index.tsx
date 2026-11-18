import type { Phase } from '@site/src/data/home';
import type { IconType } from 'react-icons';
import { translate } from '@docusaurus/Translate';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { Tallest } from '@site/src/components/Tallest';
import { PHASE_STEPS } from '@site/src/data/home';

type FooterRowProps = {
  phase: Phase;
  modeIndex: number;
  onSelectMode: (index: number) => void;
};

const ignoreMode = () => {};

const FooterRow = ({ phase, modeIndex, onSelectMode }: FooterRowProps) => (
  <div className='flex flex-wrap items-center justify-between gap-3 max-[600px]:flex-col max-[600px]:items-stretch'>
    <div className='flex items-center gap-2 min-w-0'>
      <code className='px-2.5 py-[5px] rounded-md bg-accent/10 font-mono text-[12px] tracking-[0.02em] text-accent overflow-hidden text-ellipsis whitespace-nowrap'>
        {phase.command}
      </code>
      <CopyButton
        value={phase.command}
        filled
        label={translate(
          {
            id: 'home.phase.copyCommand',
            message: 'Copy {command}',
            description:
              'The label of the button that copies a command, where {command} is the command',
          },
          { command: phase.command }
        )}
      />
    </div>
    <div className='flex shrink-0 rounded-lg border border-line overflow-hidden max-[600px]:w-full'>
      {phase.modes.map((mode, index) => (
        <button
          key={mode.label}
          type='button'
          onClick={() => onSelectMode(index)}
          aria-pressed={index === modeIndex}
          className={`px-3.5 py-2 text-[12px] font-semibold tracking-[-0.01em] whitespace-nowrap cursor-pointer transition-[color,background-color] duration-200 ease-out max-[600px]:flex-1 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-line ${
            index === modeIndex
              ? 'bg-accent/15 text-accent'
              : 'text-muted hover:text-ink hover:bg-white/[0.03]'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  </div>
);

const DESCRIPTIONS = PHASE_STEPS.map(({ description }) => description);

const FOOTERS = PHASE_STEPS.map((phase) => (
  <FooterRow phase={phase} modeIndex={0} onSelectMode={ignoreMode} />
));

export const PhaseCard = ({
  phase,
  Icon,
  modeIndex,
  onSelectMode,
}: {
  phase: Phase;
  Icon: IconType;
  modeIndex: number;
  onSelectMode: (index: number) => void;
}) => (
  <div className='flex flex-col rounded-2xl border border-line bg-card overflow-hidden'>
    <div className='flex gap-3 p-4.5 text-[13.5px] leading-[1.55]'>
      <span aria-hidden className='flex h-lh shrink-0 items-center'>
        <Icon className='size-4.5 text-ink' />
      </span>
      <Tallest
        variants={DESCRIPTIONS}
        className='min-w-0 flex-1 text-[rgba(233, 237, 247,0.72)]'
      >
        <p className='m-0'>{phase.description}</p>
      </Tallest>
    </div>

    <Tallest
      variants={FOOTERS}
      className='px-[18px] py-[15px] border-t border-line'
    >
      <FooterRow
        phase={phase}
        modeIndex={modeIndex}
        onSelectMode={onSelectMode}
      />
    </Tallest>
  </div>
);
