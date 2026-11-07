import Translate, { translate } from '@docusaurus/Translate';
import { PhaseCard } from '@site/src/components/home/PhaseCard';
import { PromptCard } from '@site/src/components/home/PromptCard';
import { Tallest } from '@site/src/components/Tallest';
import { PHASE_STEPS, STEP_CARD_ICONS } from '@site/src/data/home';
import { memo } from 'react';
import { LuArrowRight, LuCircleCheckBig } from 'react-icons/lu';

type StepOutroProps = {
  index: number;
  onStep: (index: number) => void;
};

const ignoreStep = () => {};

const OUTRO_TEXT =
  '[font-family:var(--font-mono)] text-[14px] font-bold tracking-[0.04em] uppercase text-[color-mix(in_srgb,var(--muted),var(--ink-2))]';

const StepOutro = ({ index, onStep }: StepOutroProps) => {
  const { phase } = PHASE_STEPS[index];
  const next = PHASE_STEPS[index + 1];

  if (!next)
    return (
      <span
        className={`${OUTRO_TEXT} inline-flex items-center gap-2 [&>svg]:size-4 [&>svg]:text-accent`}
      >
        <LuCircleCheckBig />
        {translate({
          id: 'home.usage.settled',
          message: 'After all proven, the cycle is settled',
          description: 'Closes the walk through the phases on the home page',
        })}
      </span>
    );

  return (
    <button
      type='button'
      onClick={() => onStep(index + 1)}
      className={`${OUTRO_TEXT} group inline-block cursor-pointer text-left transition-colors duration-200 hover:text-ink`}
      aria-label={
        phase.nextLabel ??
        translate(
          {
            id: 'home.usage.next',
            message: 'Next: {phase}',
            description:
              'Leads from one phase to the next on the home page, where {phase} is the next phase',
          },
          { phase: next.phase.title }
        )
      }
    >
      {phase.nextLabel ? (
        <span className='font-semibold group-hover:text-ink'>
          {phase.nextLabel}
        </span>
      ) : (
        <Translate
          id='home.usage.next'
          description='Leads from one phase to the next on the home page, where {phase} is the next phase'
          values={{
            phase: (
              <span className='font-semibold group-hover:text-ink'>
                {next.phase.title}
              </span>
            ),
          }}
        >
          {'Next: {phase}'}
        </Translate>
      )}
      {'\u00A0'}
      <LuArrowRight className='ml-0.5 inline-block size-4 align-[-4px] text-accent transition-transform duration-200 group-hover:translate-x-0.5' />
    </button>
  );
};

const OUTROS = PHASE_STEPS.map((_, index) => (
  <StepOutro index={index} onStep={ignoreStep} />
));

const UsagePanelComponent = ({
  usageStep,
  modeIndex,
  typedDone,
  onSelectMode,
  onStep,
  onTyped,
}: {
  usageStep: number;
  modeIndex: number;
  typedDone: boolean;
  onSelectMode: (index: number) => void;
  onStep: (index: number) => void;
  onTyped: () => void;
}) => {
  const step = PHASE_STEPS[usageStep];

  return (
    <div key={usageStep} className='lagune-fade-in flex flex-col min-w-0'>
      <PhaseCard
        phase={step.phase}
        stage={step.group}
        Icon={STEP_CARD_ICONS[usageStep]}
        modeIndex={modeIndex}
        onSelectMode={onSelectMode}
      />
      <PromptCard
        command={step.phase.command}
        mode={step.phase.modes[modeIndex]}
        typed={typedDone}
        onDone={onTyped}
      />
      <Tallest variants={OUTROS} className='mt-5 mx-1 pl-2.5'>
        <div className={typedDone ? 'lagune-fade-in' : 'invisible'}>
          <StepOutro index={usageStep} onStep={onStep} />
        </div>
      </Tallest>
    </div>
  );
};

export const UsagePanel = memo(UsagePanelComponent);
