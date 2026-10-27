/** The pattern under analysis exists only at runtime: compiling it is the engine's own verdict on whether it is valid, and the result never runs against input */
export const compilePattern = (source: string, flags: string): RegExp =>
  new RegExp(source, flags);

/** The property is named by the pattern under analysis, and the names the engine accepts change with its Unicode version: no fixed literal covers them. Callers pass only a name the engine accepted when that pattern compiled */
export const propertyRun = (expression: string): RegExp =>
  new RegExp(`\\p{${expression}}+`, 'gu');
