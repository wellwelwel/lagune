"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["3278"],{7869(e,t,o){o.d(t,{WaterField:()=>g});var r=o(4848),i=o(6540),n=o(3226);let a=`#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`,l=`#version 300 es
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
}`,s={antialias:!1,alpha:!1},c=1e3/60,m=e=>[Number.parseInt(e.slice(1,3),16)/255,Number.parseInt(e.slice(3,5),16)/255,Number.parseInt(e.slice(5,7),16)/255],u=(e,t)=>1-(1-e)**t,d=(e,t,o)=>{let r=e.createShader(t);return r?(e.shaderSource(r,o),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))?r:(console.error(`WaterField: a shader failed to compile, so the background stays plain: ${e.getShaderInfoLog(r)}`),e.deleteShader(r),null):null},p=e=>{let t=document.createElement("canvas");return t.style.cssText="position:absolute;inset:0;display:block;width:100%;height:100%;opacity:0;transition:opacity 400ms ease",e.prepend(t),t},f=(e,t,o)=>{let r=e.getContext("webgl2",s);return r&&((e,t,o)=>{let r,i,n,s=(r=d(e,e.VERTEX_SHADER,a),i=d(e,e.FRAGMENT_SHADER,l),n=e.createProgram(),r&&i&&n?(e.attachShader(n,r),e.attachShader(n,i),e.linkProgram(n),e.deleteShader(r),e.deleteShader(i),e.getProgramParameter(n,e.LINK_STATUS))?n:(console.error(`WaterField: the shader program failed to link, so the background stays plain: ${e.getProgramInfoLog(n)}`),e.deleteProgram(n),null):null);if(!s)return e.getExtension("WEBGL_lose_context")?.loseContext(),null;let p=e.getUniformLocation(s,"u_resolution"),f=e.getUniformLocation(s,"u_time"),v=e.getUniformLocation(s,"u_pointer"),h=e.getUniformLocation(s,"u_hover"),g={x:.5,y:.5,hover:0,targetX:.5,targetY:.5,targetHover:0},b=o,w=0,x=0,_=null;e.useProgram(s),e.bindVertexArray(e.createVertexArray()),e.uniform3fv(e.getUniformLocation(s,"u_light"),m(t.light)),e.uniform3fv(e.getUniformLocation(s,"u_rim"),m(t.rim)),e.uniform3fv(e.getUniformLocation(s,"u_blue"),m(t.blue)),e.uniform3fv(e.getUniformLocation(s,"u_deep"),m(t.deep));let y=()=>b?.15:.3,L=()=>{e.uniform1f(f,w),e.uniform2f(v,g.x,g.y),e.uniform1f(h,g.hover),e.drawArrays(e.TRIANGLES,0,3)},E=e=>{let t=Math.min(e-x,100),o=b?.5:1,r=u(.03,t/c),i=u(.02,t/c);x=e,w+=t/1e3*o,g.x+=(g.targetX-g.x)*r,g.y+=(g.targetY-g.y)*r,g.hover+=(g.targetHover-g.hover)*i,L(),_=requestAnimationFrame(E)},M=()=>{null!==_&&(cancelAnimationFrame(_),_=null)};return{resize:(t,o)=>{e.canvas.width=t,e.canvas.height=o,e.viewport(0,0,t,o),e.uniform2f(p,t,o),L()},point:(e,t)=>{g.targetX=e,g.targetY=t,g.targetHover=y()},release:()=>{g.targetHover=0},setRunning:e=>{e?null===_&&(x=performance.now(),_=requestAnimationFrame(E)):M()},setReducedMotion:e=>{b=e,g.targetHover>0&&(g.targetHover=y())},dispose:()=>{M(),e.getExtension("WEBGL_lose_context")?.loseContext()}}})(r,t,o)},v={light:"#071725",rim:"#041533",blue:"#110081",deep:"#08103a"},h="linear-gradient(to bottom, transparent, #000 50%, #000 75%, transparent)",g=(0,i.memo)(({className:e})=>{let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let e=t.current;if(e)return((e,t)=>{var r,i,a;let l,s,c=window.matchMedia(n.J),m={width:0,height:0,visible:!1},u=p(e),d=null,v=()=>m.visible&&!document.hidden,h=()=>d?.setRunning(v());if(!(d="function"==typeof Worker&&"transferControlToOffscreen"in HTMLCanvasElement.prototype?(r=u,i=c.matches,a=()=>{(d?.dispose(),u.remove(),d=f(u=p(e),t,c.matches))?(m.width>0&&d.resize(m.width,m.height),d.setRunning(v()),u.style.opacity="1"):u.remove()},l=new Worker(new URL(o.p+o.u("623"),o.b)),s=r.transferControlToOffscreen(),l.onmessage=e=>{"failure"===e.data.type&&a()},l.onerror=a,l.postMessage({type:"init",canvas:s,palette:t,reducedMotion:i},[s]),{resize:(e,t)=>{let o;return o={type:"resize",width:e,height:t},l.postMessage(o)},point:(e,t)=>{let o;return o={type:"point",x:e,y:t},l.postMessage(o)},release:()=>{let e;return e={type:"release"},l.postMessage(e)},setRunning:e=>{let t;return t={type:"running",running:e},l.postMessage(t)},setReducedMotion:e=>{let t;return t={type:"motion",reduced:e},l.postMessage(t)},dispose:()=>{l.onmessage=null,l.onerror=null,l.terminate()}}):f(u,t,c.matches)))return u.remove(),()=>{};let g=t=>{let o=e.getBoundingClientRect();0!==o.width&&0!==o.height&&d?.point((t.clientX-o.left)/o.width,1-(t.clientY-o.top)/o.height)},b=e=>{null===e.relatedTarget&&d?.release()},w=()=>d?.setReducedMotion(c.matches),x=new ResizeObserver(([e])=>{if(!e)return;let t=.75*Math.min(window.devicePixelRatio,2);m.width=Math.max(1,Math.round(e.contentRect.width*t)),m.height=Math.max(1,Math.round(e.contentRect.height*t)),d?.resize(m.width,m.height),u.style.opacity="1"}),_=new IntersectionObserver(e=>{m.visible=e[e.length-1]?.isIntersecting??!1,h()},{rootMargin:"100px"});return x.observe(e),_.observe(e),c.addEventListener("change",w),document.addEventListener("visibilitychange",h),window.addEventListener("pointermove",g,{passive:!0}),window.addEventListener("pointerout",b,{passive:!0}),()=>{d?.dispose(),x.disconnect(),_.disconnect(),c.removeEventListener("change",w),document.removeEventListener("visibilitychange",h),window.removeEventListener("pointermove",g),window.removeEventListener("pointerout",b),u.remove()}})(e,v)},[]),(0,r.jsx)("div",{ref:t,className:`pointer-events-none overflow-hidden ${e}`,style:{backgroundColor:v.deep,maskImage:h,WebkitMaskImage:h},"aria-hidden":!0})})}}]);