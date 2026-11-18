export const vertexShaderSource = `#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_hover;
uniform vec3 u_light;
uniform vec3 u_rim;
uniform vec3 u_blue;
uniform vec3 u_deep;

out vec4 fragmentColor;

float hash(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 fraction = fract(point);
  vec2 blend = fraction * fraction * (3.0 - 2.0 * fraction);
  float bottom = mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x);
  float top = mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x);
  return mix(bottom, top, blend.y);
}

float fractalNoise(vec2 point) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 3; octave++) {
    total += amplitude * valueNoise(point);
    point = mat2(1.6, 1.2, -1.2, 1.6) * point + 3.1;
    amplitude *= 0.5;
  }
  return total / 0.875;
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  bool landscape = aspect > 1.0;
  vec2 position = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  vec2 pointer = (u_pointer - 0.5) * vec2(aspect, 1.0);
  float time = u_time * 0.07;

  vec2 flow = mat2(0.8, -0.6, 0.6, 0.8) * position * (landscape ? 0.85 : 1.15);
  flow.y *= 1.8;

  vec2 firstWarp = vec2(fractalNoise(flow + vec2(0.0, time)), fractalNoise(flow + vec2(5.2, -time * 0.8)));
  vec2 fromPointer = position - pointer;
  vec2 swirl = vec2(-fromPointer.y, fromPointer.x);
  firstWarp += 0.9 * u_hover * exp(-dot(fromPointer, fromPointer) * 7.0) * swirl;
  vec2 secondWarp = vec2(
    fractalNoise(flow + 4.2 * firstWarp + vec2(1.7, 9.2) + time * 1.3),
    fractalNoise(flow + 4.2 * firstWarp + vec2(8.3, 2.8) - time * 1.1)
  );
  float field = fractalNoise(flow + 3.6 * secondWarp + time * 0.5);

  vec2 textArea = position / vec2(0.36 * max(aspect, 1.0), landscape ? 0.3 : 0.42);
  float behindText = exp(-dot(textArea, textArea));
  field -= (landscape ? 0.2 : 0.12) * behindText;

  float streak = sin(length(secondWarp) * 150.0 + field * 40.0);
  field += 0.014 * streak * smoothstep(0.32, 0.52, field) * (1.0 - smoothstep(0.54, 0.64, field));

  float band = smoothstep(0.34, 0.52, field);
  float lit = smoothstep(0.588, 0.605, field);
  float rimDistance = (field - 0.576) / 0.022;
  float rim = exp(-rimDistance * rimDistance);
  float sheen = pow(clamp(length(secondWarp - 0.5) * 2.2 - 0.4, 0.0, 1.0), 3.0);

  vec3 color = mix(u_deep * 0.75, u_blue, band * (0.45 + 0.55 * smoothstep(0.42, 0.55, field)));
  color += mix(u_blue, u_light, 0.45) * 0.45 * sheen * band;
  color = mix(color, u_rim, clamp(rim, 0.0, 1.0) * 0.95);
  color = mix(color, u_light, lit);
  color *= 1.0 - 0.5 * behindText * max(lit, rim * 0.6);

  fragmentColor = vec4(color, 1.0);
}`;
