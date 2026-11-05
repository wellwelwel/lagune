const FIRST_PRINTABLE = 32;
const FALLBACK_WIDTH = 556;
const SYSTEM_FONT_SCALE = 1.07;

const HELVETICA_WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278,
  278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584,
  584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556,
  833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278,
  278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222,
  500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500,
  500, 334, 260, 334, 584,
];

export const characterAdvance = (character: string, fontSize: number) =>
  ((HELVETICA_WIDTHS[(character.codePointAt(0) ?? 0) - FIRST_PRINTABLE] ??
    FALLBACK_WIDTH) *
    fontSize *
    SYSTEM_FONT_SCALE) /
  1000;

export const sansWidth = (text: string, fontSize: number) =>
  Number(
    [...text]
      .reduce(
        (width, character) => width + characterAdvance(character, fontSize),
        0
      )
      .toFixed(1)
  );
