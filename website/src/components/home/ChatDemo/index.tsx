import type { ReactNode } from 'react';
import flowUrl from '!!file-loader?name=assets/images/[name]-[contenthash].[ext]!@site/static/img/flow.svg';
import { translate } from '@docusaurus/Translate';
import { CONTROL_BUTTON, SpeedMenu } from '@site/src/components/home/SpeedMenu';
import { IconSwap } from '@site/src/components/IconSwap';
import { useExpandedView } from '@site/src/components/useExpandedView';
import { useVisible } from '@site/src/components/useVisible';
import { useEffect, useRef, useState } from 'react';
import { LuMaximize, LuMinimize } from 'react-icons/lu';
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from 'react-icons/tb';

const SEEK_STEP = 0.05;

/* flow.svg draws its card 8 of its 820 units in from each side. */
const CARD_INSET = 'mx-[calc(100%*8/820)]';

const EXPANDED_PLAYER =
  '[&:popover-open]:fixed [&:popover-open]:inset-0 [&:popover-open]:m-0 [&:popover-open]:flex [&:popover-open]:size-full [&:popover-open]:max-h-none [&:popover-open]:max-w-none [&:popover-open]:items-center [&:popover-open]:justify-center [&:popover-open]:overflow-hidden [&:popover-open]:border-0 [&:popover-open]:bg-transparent [&:popover-open]:p-6 [&:popover-open]:text-ink';

const CLOCK = 'w-10 shrink-0 text-[13px] font-medium text-ink/80 tabular-nums';

const secondsOf = (time: Animation['currentTime']) => Number(time ?? 0) / 1000;

const durationOf = (animation: Animation) =>
  Number(animation.effect?.getComputedTiming().duration ?? 0);

const cycleAnimation = (animations: Animation[]) =>
  animations.reduce<Animation | null>(
    (longest, animation) =>
      longest && durationOf(longest) >= durationOf(animation)
        ? longest
        : animation,
    null
  );

const pauseFlow = (flow: Document, paused: boolean) => {
  const svg = flow.querySelector('svg');

  if (!svg) return;

  svg.classList.toggle('paused', paused);

  if (paused) svg.pauseAnimations();
  else svg.unpauseAnimations();
};

const seekFlow = (flow: Document, seconds: number) => {
  for (const animation of flow.getAnimations())
    animation.currentTime = seconds * 1000;
};

const rateFlow = (flow: Document, speed: number) => {
  for (const animation of flow.getAnimations()) animation.playbackRate = speed;
};

const clockOf = (seconds: number): string => {
  const whole = Math.floor(seconds);
  const minutes = String(Math.floor(whole / 60)).padStart(2, '0');

  return `${minutes}:${String(whole % 60).padStart(2, '0')}`;
};

const showPosition = (
  range: HTMLInputElement | null,
  clock: HTMLElement | null,
  seconds: number
) => {
  const text = clockOf(seconds);

  if (range) {
    const max = Number(range.max);

    range.value = String(seconds);
    range.style.setProperty(
      '--lagune-share',
      String(max > 0 ? seconds / max : 0)
    );
    range.setAttribute('aria-valuetext', text);
  }

  if (clock && clock.textContent !== text) clock.textContent = text;
};

export const ChatDemo = (): ReactNode => {
  const placeRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const flowRef = useRef<HTMLObjectElement | null>(null);
  const rangeRef = useRef<HTMLInputElement | null>(null);
  const clockRef = useRef<HTMLSpanElement | null>(null);
  const cycleRef = useRef<Animation | null>(null);
  const visible = useVisible(frameRef);
  const expandedView = useExpandedView({
    player: playerRef,
    frame: frameRef,
    controls: controlsRef,
    backdrop: backdropRef,
    holder: placeRef,
  });
  const [seen, setSeen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cycle, setCycle] = useState(0);
  const running = visible && !paused;

  if (visible && !seen) setSeen(true);

  useEffect(() => {
    const flow = flowRef.current?.contentDocument;

    if (flow) pauseFlow(flow, !running);
  }, [running]);

  useEffect(() => {
    const reference = cycleRef.current;

    if (!running || !reference) return;

    let frame = 0;

    const follow = () => {
      showPosition(
        rangeRef.current,
        clockRef.current,
        secondsOf(reference.currentTime) % cycle
      );
      frame = requestAnimationFrame(follow);
    };

    frame = requestAnimationFrame(follow);

    return () => cancelAnimationFrame(frame);
  }, [running, cycle]);

  const applySpeed = (value: number) => {
    const flow = flowRef.current?.contentDocument;

    if (flow) rateFlow(flow, value);

    setSpeed(value);
  };

  const seek = (seconds: number) => {
    const flow = flowRef.current?.contentDocument;

    if (!flow) return;

    pauseFlow(flow, true);
    seekFlow(flow, seconds);
    showPosition(rangeRef.current, clockRef.current, seconds);
    setPaused(true);
  };

  const onFlowLoad = () => {
    const flow = flowRef.current?.contentDocument;
    const reference = flow && cycleAnimation(flow.getAnimations());

    if (!flow || !reference) return;

    cycleRef.current = reference;
    pauseFlow(flow, !running);
    rateFlow(flow, speed);
    showPosition(rangeRef.current, clockRef.current, 0);
    setCycle(durationOf(reference) / 1000);
  };

  return (
    <div ref={placeRef} className='mx-auto w-full max-w-205'>
      <div ref={playerRef} className={`w-full select-none ${EXPANDED_PLAYER}`}>
        <div
          ref={backdropRef}
          className='absolute inset-0 hidden bg-[#050a18] [:popover-open>&]:block'
          aria-hidden
        />
        <div className='relative flex w-full flex-col gap-3 [:popover-open>&]:max-w-[calc((100dvh-12rem)*820/532)] [:popover-open>&]:gap-4'>
          <div
            ref={frameRef}
            role='img'
            aria-label={translate({
              id: 'home.demo.label',
              message:
                'An AI agent running Lagune: a project charter, a secure user sign-up, and a Blue Team audit',
              description:
                'The accessible description of the animated AI chat at the end of the home page',
            })}
            className='aspect-flow w-full'
          >
            {seen && (
              <object
                ref={flowRef}
                data={flowUrl}
                type='image/svg+xml'
                aria-hidden
                tabIndex={-1}
                onLoad={onFlowLoad}
                className='pointer-events-none block size-full'
              />
            )}
          </div>
          <div
            ref={controlsRef}
            className={`${CARD_INSET} @container flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-[rgba(4,8,22,0.55)] p-1.5 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05)] motion-reduce:hidden`}
          >
            <button
              type='button'
              aria-label={
                paused
                  ? translate({
                      id: 'home.demo.play',
                      message: 'Play the animation',
                      description:
                        'The accessible name of the button that resumes the animated AI chat on the home page',
                    })
                  : translate({
                      id: 'home.demo.pause',
                      message: 'Pause the animation',
                      description:
                        'The accessible name of the button that pauses the animated AI chat on the home page',
                    })
              }
              onClick={() => setPaused(!paused)}
              className={`${CONTROL_BUTTON} size-10 [&_svg]:size-6`}
            >
              <IconSwap
                on={paused}
                active={<TbPlayerPlayFilled className='translate-x-px' />}
                inactive={<TbPlayerPauseFilled />}
              />
            </button>
            <span ref={clockRef} className={CLOCK}>
              00:00
            </span>
            <input
              ref={rangeRef}
              type='range'
              min={0}
              max={cycle}
              step={SEEK_STEP}
              defaultValue={0}
              disabled={cycle === 0}
              aria-label={translate({
                id: 'home.demo.seek',
                message: 'Animation position',
                description:
                  'The accessible name of the slider that moves the animated AI chat on the home page forward or back',
              })}
              onChange={(event) => seek(Number(event.currentTarget.value))}
              className='lagune-scrubber h-10 min-w-0 flex-1'
            />
            <span className={`${CLOCK} text-right @max-[400px]:hidden`}>
              {clockOf(cycle)}
            </span>
            <SpeedMenu speed={speed} onSpeed={applySpeed} />
            {expandedView.supported && (
              <button
                type='button'
                aria-label={
                  expandedView.expanded
                    ? translate({
                        id: 'home.demo.fullscreen.exit',
                        message: 'Exit full screen',
                        description:
                          'The accessible name of the button that leaves full screen for the animated AI chat on the home page',
                      })
                    : translate({
                        id: 'home.demo.fullscreen.enter',
                        message: 'Enter full screen',
                        description:
                          'The accessible name of the button that shows the animated AI chat on the home page in full screen',
                      })
                }
                onClick={expandedView.toggle}
                className={`${CONTROL_BUTTON} size-10 [&_svg]:size-5`}
              >
                <IconSwap
                  on={expandedView.expanded}
                  active={<LuMinimize />}
                  inactive={<LuMaximize />}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
