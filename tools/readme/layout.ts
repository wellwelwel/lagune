export const WIDTH = 820;
export const HEIGHT = 532;

const INSET = 20;
export const CARD = { x: 8, y: 6, width: 804, height: 518, radius: 30 };
export const CONTENT_LEFT = CARD.x + INSET;
export const CONTENT_RIGHT = CARD.x + CARD.width - INSET;

export const BADGE_LABEL_OFFSET = 34;
const ICON_LABEL_OFFSET = 28;
const ROW_INDENT = 16;
export const ICON_X = CONTENT_LEFT + ROW_INDENT;
export const LABEL_X = ICON_X + ICON_LABEL_OFFSET;
export const NOTE_X = LABEL_X + 172;
export const ROW_PITCH = 25;

export const PROMPT_FONT_SIZE = 14;
export const PROMPT_SCALE = { text: 0.965, command: 1.06 };
export const LINE_HEIGHT = 19;
export const PARAGRAPH_GAP = 6;
export const LINE_BASELINE = 14.5;

const TAB_PADDING = 16;
const TAB_ICON_SIZE = 16;

export const TAB = {
  x: CARD.x,
  y: CARD.y,
  height: TAB_ICON_SIZE + TAB_PADDING * 2,
  radius: 10,
  flare: 10,
  padding: TAB_PADDING,
  iconSize: TAB_ICON_SIZE,
  labelGap: 8,
  fontSize: 12.5,
};
export const HEADER_CENTER = TAB.y + TAB.height / 2;
export const BODY_TOP = TAB.y + TAB.height;

const FIELD_HEIGHT = 94;
const FIELD_RADIUS = 15;

export const FIELD = {
  x: CONTENT_LEFT,
  y: CARD.y + CARD.height - INSET - FIELD_HEIGHT,
  width: CONTENT_RIGHT - CONTENT_LEFT,
  height: FIELD_HEIGHT,
  radius: FIELD_RADIUS,
};

const SEND_SIZE = 32;
const SEND_INSET = 10;
const SEND_RADIUS = 7.5;

const FIELD_INSET = SEND_INSET + SEND_SIZE / 2;
export const FIELD_TEXT_X = FIELD.x + FIELD_INSET - 6;
export const FIELD_LINE_TOP = FIELD.y + FIELD_INSET - LINE_HEIGHT / 2;
export const TOOLBAR_CENTER = FIELD.y + FIELD.height - FIELD_INSET;
export const TOOLBAR_HEIGHT = FIELD.height - FIELD_INSET - LINE_HEIGHT / 2;
export const SEND = {
  x: FIELD.x + FIELD.width - SEND_INSET - SEND_SIZE,
  y: FIELD.y + FIELD.height - SEND_INSET - SEND_SIZE,
  size: SEND_SIZE,
  radius: SEND_RADIUS,
};

export const CHIP = { x: FIELD_TEXT_X + 24, height: 26, fontSize: 12.5 };

export const VIEWPORT = {
  top: BODY_TOP + INSET,
  bottom: FIELD.y - 8,
};

export const BUBBLE_TOP = VIEWPORT.top + 10;
export const BUBBLE_PADDING = { x: 14, y: 9 };
