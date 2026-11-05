import type { Prompt, Session, SessionTiming, Timeline } from './types';

const TYPING_DELAY = 0.8;
const TYPING_SPEED = 28;
const SEND_DELAY = 0.35;
const THINKING_DELAY = 0.45;
const FIRST_ROW_DELAY = 0.3;
const ROW_STAGGER = 0.25;
const CLOSING_DELAY = 0.55;
const FADE_OUT = 1.1;
const RESET_LEAD = 0.5;

export const promptLength = (prompt: Prompt) =>
  prompt.command.length + prompt.text.length;

const timeSession = (session: Session, opens: number): SessionTiming => {
  const type = opens + TYPING_DELAY;
  const typed = type + promptLength(session.prompt) / TYPING_SPEED;
  const send = typed + SEND_DELAY;
  const think = send + THINKING_DELAY;
  const answer = think + session.thinking;
  const rows = session.rows.map(
    (_, index) => answer + FIRST_ROW_DELAY + index * ROW_STAGGER
  );
  const closing =
    answer +
    FIRST_ROW_DELAY +
    (session.rows.length - 1) * ROW_STAGGER +
    CLOSING_DELAY;

  return {
    opens,
    type,
    typed,
    send,
    think,
    answer,
    rows,
    closing,
    leaves: closing + session.hold,
  };
};

export const createTimeline = (sessions: Session[]): Timeline => {
  const timings = sessions.reduce<SessionTiming[]>(
    (timed, session) => [
      ...timed,
      timeSession(session, timed.at(-1)?.leaves ?? 0),
    ],
    []
  );
  const fade = timings.at(-1)?.leaves ?? 0;
  const cycle = Number((fade + FADE_OUT).toFixed(2));

  return { sessions: timings, cycle, fade, reset: cycle - RESET_LEAD };
};
