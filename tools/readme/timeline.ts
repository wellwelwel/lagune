import type {
  Outro,
  OutroTiming,
  QueuedRun,
  Row,
  RunTiming,
  Session,
  SessionTiming,
  Timeline,
} from './types';

const TYPING_DELAY = 0.4;
const TYPING_SPEED = 38;
const PASTE_DELAY = 0.1;
const LINE_REVEAL = 0.09;
const READING_PAUSE = 0.6;
const SEND_DELAY = 0.35;
const THINKING_DELAY = 0.45;
const FIRST_ROW_DELAY = 0.3;
const RESULT_LINGER = 0.2;
const LOOP_PAUSE = 0.4;
const CLOSING_DELAY = 0.55;
const SWAP_DELAY = 0.35;
const SWAP_INTERVAL = 0.3;
const FADE_OUT = 0.8;
const RESET_LEAD = 0.3;

export const isPasted = (prompt: string[]) => prompt.length > 1;

const entryDuration = (prompt: string[]) =>
  isPasted(prompt)
    ? PASTE_DELAY + prompt.length * LINE_REVEAL + READING_PAUSE
    : prompt.join('').length / TYPING_SPEED;

const runCount = (row: Row) => (row.kind === 'step' ? row.runs.length : 1);

const queueRuns = (rows: Row[]): QueuedRun[] => {
  const rounds = Math.max(0, ...rows.map(runCount));

  return Array.from({ length: rounds }, (_, runIndex) =>
    rows.flatMap((row, rowIndex) =>
      runCount(row) > runIndex ? [{ rowIndex, runIndex }] : []
    )
  ).flat();
};

const scheduleRows = (session: Session, answer: number): RunTiming[][] => {
  const queue = queueRuns(session.rows);
  const timings = queue.map(({ rowIndex, runIndex }, order) => {
    const start =
      answer +
      FIRST_ROW_DELAY +
      order * session.pace +
      (runIndex > 0 ? LOOP_PAUSE : 0);
    const loading =
      session.rows[rowIndex].kind === 'step' ? session.pace - RESULT_LINGER : 0;

    return { start, finish: start + loading };
  });

  return session.rows.map((_, rowIndex) =>
    queue.flatMap((queued, order) =>
      queued.rowIndex === rowIndex ? [timings[order]] : []
    )
  );
};

const timeSession = (session: Session, opens: number): SessionTiming => {
  const type = opens + TYPING_DELAY;
  const lines = session.prompt.map(
    (_, index) => type + PASTE_DELAY + index * LINE_REVEAL
  );
  const typed = type + entryDuration(session.prompt);
  const send = typed + SEND_DELAY;
  const think = send + THINKING_DELAY;
  const answer = think + session.thinking;
  const rowRuns = scheduleRows(session, answer);
  const lastFinish = Math.max(
    answer,
    ...rowRuns.flat().map((run) => run.finish)
  );
  const closing = lastFinish + CLOSING_DELAY;

  return {
    opens,
    type,
    lines,
    typed,
    send,
    think,
    answer,
    rowRuns,
    closing,
    leaves: closing + session.hold,
  };
};

const outroCharacters = (outro: Outro) =>
  outro.lead.length + 2 + outro.trail.length;

const timeOutro = (outro: Outro, opens: number): OutroTiming => {
  const type = opens + TYPING_DELAY;
  const typed = type + outroCharacters(outro) / TYPING_SPEED;
  const click = typed + SEND_DELAY;
  const swapAt = (index: number) => click + SWAP_DELAY + index * SWAP_INTERVAL;

  return {
    opens,
    type,
    typed,
    click,
    swaps: outro.agents.map((_, index) => swapAt(index)),
    back: swapAt(outro.agents.length),
  };
};

export const createTimeline = (sessions: Session[], outro: Outro): Timeline => {
  const timings = sessions.reduce<SessionTiming[]>(
    (timed, session) => [
      ...timed,
      timeSession(session, timed.at(-1)?.leaves ?? 0),
    ],
    []
  );
  const outroTiming = timeOutro(outro, timings.at(-1)?.leaves ?? 0);
  const fade = outroTiming.back;
  const cycle = Number((fade + FADE_OUT).toFixed(2));

  return {
    sessions: timings,
    outro: outroTiming,
    cycle,
    fade,
    reset: cycle - RESET_LEAD,
  };
};
