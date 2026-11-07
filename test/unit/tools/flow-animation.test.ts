import { describe, it, strict } from 'poku';
import { renderFlow } from '../../../tools/readme/render.js';
import { OUTRO, SESSIONS } from '../../../tools/readme/sessions.js';
import { createTimeline } from '../../../tools/readme/timeline.js';

const ANIMATION = /animation:([^;}]+)/g;

const stylesheetOf = (svg: string) =>
  svg.slice(svg.indexOf('<style>'), svg.indexOf('</style>'));

const splitEntries = (value: string) =>
  [...value]
    .reduce<{ depth: number; entries: string[] }>(
      ({ depth, entries }, character) => {
        if (character === ',' && depth === 0)
          return { depth, entries: [...entries, ''] };

        const nextDepth =
          depth + (character === '(' ? 1 : 0) - (character === ')' ? 1 : 0);
        const current = entries.at(-1) ?? '';

        return {
          depth: nextDepth,
          entries: [...entries.slice(0, -1), `${current}${character}`],
        };
      },
      { depth: 0, entries: [''] }
    )
    .entries.map((entry) => entry.trim());

const animationEntries = (svg: string) =>
  [...stylesheetOf(svg).matchAll(ANIMATION)]
    .map(([, value]) => value.trim())
    .filter((value) => !value.startsWith('none'))
    .flatMap(splitEntries);

const secondsOf = (entry: string) =>
  entry
    .split(' ')
    .filter((token) => /^[0-9.]+s$/.test(token))
    .map((token) => Number(token.slice(0, -1)));

describe('the chat animation on the website', () => {
  const website = renderFlow('website');
  const entries = animationEntries(website);
  const { cycle } = createTimeline(SESSIONS, OUTRO);

  it('never runs an endless CSS animation', () => {
    const endless = entries.filter((entry) => entry.includes('infinite'));

    strict.deepStrictEqual(endless, []);
  });

  it('settles every animation within one cycle', () => {
    const overrunning = entries.filter((entry) => {
      const [duration = 0, delay = 0] = secondsOf(entry);

      return delay + duration > cycle + 0.001;
    });

    strict.deepStrictEqual(overrunning, []);
  });

  it('keeps every animation addressable after it ends, so the player can rewind it', () => {
    const released = entries.filter(
      (entry) => !entry.endsWith(' forwards') && !entry.endsWith(' both')
    );

    strict.deepStrictEqual(released, []);
  });

  it('ends the cycle clock exactly when the cycle ends', () => {
    const clock = entries.filter((entry) => entry.startsWith('cycle-clock '));

    strict.deepStrictEqual(clock, [
      `cycle-clock 0s linear ${cycle}s 1 forwards`,
    ]);
    strict.ok(website.includes('<g class="cycle-clock"/>'));
  });
});

describe('the chat animation in the README', () => {
  const readme = renderFlow('readme');
  const entries = animationEntries(readme);

  it('loops on its own, with no player to restart it', () => {
    const finite = entries.filter((entry) => !entry.endsWith(' infinite'));

    strict.ok(entries.length > 0);
    strict.deepStrictEqual(finite, []);
    strict.ok(!readme.includes('cycle-clock'));
  });
});
