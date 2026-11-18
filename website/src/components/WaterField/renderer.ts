import type { WaterPalette, WaterRenderer } from './protocol';
import { fragmentShaderSource, vertexShaderSource } from './shaders';

type Pointer = {
  x: number;
  y: number;
  hover: number;
  targetX: number;
  targetY: number;
  targetHover: number;
};

export const CONTEXT_OPTIONS: WebGLContextAttributes = {
  antialias: false,
  alpha: false,
};

const POINTER_EASE = 0.03;
const HOVER_EASE = 0.02;
const FRAME_MS = 1000 / 60;
const MAX_FRAME_GAP_MS = 100;
const SWIRL = 0.3;
const REDUCED_SWIRL = 0.15;
const REDUCED_FLOW_RATE = 0.5;

const toUnitRgb = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16) / 255,
  Number.parseInt(hex.slice(3, 5), 16) / 255,
  Number.parseInt(hex.slice(5, 7), 16) / 255,
];

const easeFor = (factor: number, frames: number) => 1 - (1 - factor) ** frames;

const compileShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null => {
  const shader = gl.createShader(type);

  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

  console.error(
    `WaterField: a shader failed to compile, so the background stays plain: ${gl.getShaderInfoLog(shader)}`
  );
  gl.deleteShader(shader);

  return null;
};

const createProgram = (gl: WebGL2RenderingContext): WebGLProgram | null => {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = gl.createProgram();

  if (!vertexShader || !fragmentShader || !program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;

  console.error(
    `WaterField: the shader program failed to link, so the background stays plain: ${gl.getProgramInfoLog(program)}`
  );
  gl.deleteProgram(program);

  return null;
};

/**
 * Draws the reactive water into `gl`, or returns `null` when the shader cannot build there.
 */
export const createWaterRenderer = (
  gl: WebGL2RenderingContext,
  palette: WaterPalette,
  reducedMotion: boolean
): WaterRenderer | null => {
  const program = createProgram(gl);

  if (!program) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    return null;
  }

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const pointerLocation = gl.getUniformLocation(program, 'u_pointer');
  const hoverLocation = gl.getUniformLocation(program, 'u_hover');
  const pointer: Pointer = {
    x: 0.5,
    y: 0.5,
    hover: 0,
    targetX: 0.5,
    targetY: 0.5,
    targetHover: 0,
  };
  let reduced = reducedMotion;
  let elapsedSeconds = 0;
  let lastFrame = 0;
  let frameId: number | null = null;

  gl.useProgram(program);
  gl.bindVertexArray(gl.createVertexArray());
  gl.uniform3fv(
    gl.getUniformLocation(program, 'u_light'),
    toUnitRgb(palette.light)
  );
  gl.uniform3fv(
    gl.getUniformLocation(program, 'u_rim'),
    toUnitRgb(palette.rim)
  );
  gl.uniform3fv(
    gl.getUniformLocation(program, 'u_blue'),
    toUnitRgb(palette.blue)
  );
  gl.uniform3fv(
    gl.getUniformLocation(program, 'u_deep'),
    toUnitRgb(palette.deep)
  );

  const swirl = () => (reduced ? REDUCED_SWIRL : SWIRL);

  const draw = () => {
    gl.uniform1f(timeLocation, elapsedSeconds);
    gl.uniform2f(pointerLocation, pointer.x, pointer.y);
    gl.uniform1f(hoverLocation, pointer.hover);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    const gapMs = Math.min(now - lastFrame, MAX_FRAME_GAP_MS);
    const flowRate = reduced ? REDUCED_FLOW_RATE : 1;
    const pointerStep = easeFor(POINTER_EASE, gapMs / FRAME_MS);
    const hoverStep = easeFor(HOVER_EASE, gapMs / FRAME_MS);

    lastFrame = now;
    elapsedSeconds += (gapMs / 1000) * flowRate;
    pointer.x += (pointer.targetX - pointer.x) * pointerStep;
    pointer.y += (pointer.targetY - pointer.y) * pointerStep;
    pointer.hover += (pointer.targetHover - pointer.hover) * hoverStep;
    draw();
    frameId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frameId !== null) return;

    lastFrame = performance.now();
    frameId = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (frameId === null) return;

    cancelAnimationFrame(frameId);
    frameId = null;
  };

  return {
    resize: (width, height) => {
      gl.canvas.width = width;
      gl.canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
      draw();
    },
    point: (x, y) => {
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.targetHover = swirl();
    },
    release: () => {
      pointer.targetHover = 0;
    },
    setRunning: (running) => {
      if (running) start();
      else stop();
    },
    setReducedMotion: (value) => {
      reduced = value;

      if (pointer.targetHover > 0) pointer.targetHover = swirl();
    },
    dispose: () => {
      stop();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
};
