export type WaterPalette = {
  light: string;
  rim: string;
  blue: string;
  deep: string;
};

export type WaterRenderer = {
  resize: (width: number, height: number) => void;
  point: (x: number, y: number) => void;
  release: () => void;
  setRunning: (running: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
};

export type WaterInit = {
  type: 'init';
  canvas: OffscreenCanvas;
  palette: WaterPalette;
  reducedMotion: boolean;
};

export type WaterMessage =
  | WaterInit
  | { type: 'resize'; width: number; height: number }
  | { type: 'point'; x: number; y: number }
  | { type: 'release' }
  | { type: 'running'; running: boolean }
  | { type: 'motion'; reduced: boolean };

export type WaterEvent = { type: 'failure' };
