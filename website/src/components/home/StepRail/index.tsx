import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { RailTip } from '@site/src/components/home/RailTip';
import { PHASE_STEPS, STEP_RAIL_ICONS } from '@site/src/data/home';

type StepRailProps = {
  current: number;
  onStep: (index: number) => void;
};

const railItemClass = (current: boolean): string =>
  `relative flex items-center justify-center size-5.5 border-0 bg-none cursor-pointer transition-colors duration-200 ease-out [&>svg]:size-4.75 hover:text-ink after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2 ${
    current ? 'lagune-rail__item--active text-ink' : 'text-[#515664]'
  }`;

export const StepRail = ({ current, onStep }: StepRailProps): ReactNode => (
  <nav
    className='flex w-fit items-center gap-9 rounded-full py-3.5 min-[600px]:self-end xl:-translate-y-[17.5px] max-[600px]:w-full max-[600px]:justify-between max-[600px]:gap-0 max-[600px]:border max-[600px]:border-[#0c155c] max-[600px]:bg-[rgba(12,16,28,0.42)] max-[600px]:px-5 max-[600px]:[box-shadow:0_8px_30px_-6px_rgba(0,0,0,0.55)]'
    aria-label={translate({
      id: 'home.nav.phases',
      message: 'Phases',
      description:
        'The accessible name of the rail that switches the phase shown in the home usage section',
    })}
  >
    {PHASE_STEPS.map((step, index) => {
      const Icon = STEP_RAIL_ICONS[index];

      return (
        <RailTip key={step.phase.title} tip={step.phase.title}>
          <button
            type='button'
            onClick={() => onStep(index)}
            className={railItemClass(index === current)}
            aria-label={translate(
              {
                id: 'home.rail.step',
                message: '{phase} ({stage})',
                description:
                  'The label of a phase button in the home phase rail, where {phase} is the phase and {stage} its small caps label',
              },
              { phase: step.phase.title, stage: step.phase.eyebrow }
            )}
            aria-current={index === current ? 'step' : undefined}
          >
            <Icon aria-hidden />
          </button>
        </RailTip>
      );
    })}
  </nav>
);
