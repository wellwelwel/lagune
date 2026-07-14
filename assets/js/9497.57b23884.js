(()=>{"use strict";var e={},i={};function t(o){var r=i[o];if(void 0!==r)return r.exports;var a=i[o]={exports:{}};return e[o](a,a.exports,t),a.exports}t.rv=()=>"1.7.12",t.gca=function(e){return e=({})[e]||e,t.p+t.u(e)},t.ruid="bundler=rspack@1.7.12";let o=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,r=(e,i,t)=>{let o=e.createShader(i);return o?(e.shaderSource(o,t),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS))?o:(console.error(e.getShaderInfoLog(o)),e.deleteShader(o),null):null};class a{gl;program;locations=new Map;currentFrame=0;lastRenderTime=0;speed;currentSpeed=0;hidden=!1;rafId=null;pixelRatio=1;resolutionChanged=!0;constructor(e){let i=e.canvas.getContext("webgl2");if(!i)throw Error("WebGL2 is not supported");let t=((e,i)=>{let t=o,a=i,n=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT);n&&n.precision<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),a=a.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let s=r(e,e.VERTEX_SHADER,t),l=r(e,e.FRAGMENT_SHADER,a);if(!s||!l)return null;let u=e.createProgram();return u?(e.attachShader(u,s),e.attachShader(u,l),e.linkProgram(u),e.getProgramParameter(u,e.LINK_STATUS))?(e.detachShader(u,s),e.detachShader(u,l),e.deleteShader(s),e.deleteShader(l),u):(console.error(e.getProgramInfoLog(u)),e.deleteProgram(u),e.deleteShader(s),e.deleteShader(l),null):null})(i,e.fragmentShader);if(!t)throw Error("Shader program failed to build");this.gl=i,this.program=t,this.speed=e.speed,i.useProgram(t),this.setupPositionAttribute(),this.setUniforms(e.uniforms)}setupPositionAttribute(){let e=this.gl,i=e.getAttribLocation(this.program,"a_position"),t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0)}location(e){return this.locations.has(e)||this.locations.set(e,this.gl.getUniformLocation(this.program,e)),this.locations.get(e)??null}setUniforms(e){for(let[i,t]of Object.entries(e)){let e=this.location(i);if(e){if("number"==typeof t){this.gl.uniform1f(e,t);continue}2===t.length?this.gl.uniform2fv(e,t):3===t.length?this.gl.uniform3fv(e,t):4===t.length?this.gl.uniform4fv(e,t):console.warn(`Unsupported uniform array length for ${i}`)}}}async loadImages(e){await Promise.all(Object.entries(e).map(([e,i],t)=>this.loadImage(e,i,t)))}async loadImage(e,i,t){let o=this.location(`${e}AspectRatio`);try{let r=await fetch(i),a=await createImageBitmap(await r.blob()),n=this.gl;n.activeTexture(n.TEXTURE0+t),n.bindTexture(n.TEXTURE_2D,n.createTexture()),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,a),n.generateMipmap(n.TEXTURE_2D),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR);let s=this.location(e);s&&n.uniform1i(s,t),o&&n.uniform1f(o,a.width/a.height),a.close()}catch{o&&this.gl.uniform1f(o,1)}}start(){this.currentSpeed=this.hidden?0:this.speed,this.lastRenderTime=performance.now(),this.render(this.lastRenderTime)}resize(e,i,t){let o=this.gl.canvas;(o.width!==e||o.height!==i||this.pixelRatio!==t)&&(o.width=e,o.height=i,this.pixelRatio=t,this.resolutionChanged=!0,this.gl.viewport(0,0,e,i),null===this.rafId&&this.render(performance.now()))}setSpeed(e){this.speed=e,this.syncSpeed()}setHidden(e){this.hidden=e,this.syncSpeed()}syncSpeed(){let e=this.hidden?0:this.speed;this.currentSpeed=e,null===this.rafId&&0!==e&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),null!==this.rafId&&0===e&&(cancelAnimationFrame(this.rafId),this.rafId=null)}requestRender(){null!==this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)}render=e=>{let i=this.gl,t=e-this.lastRenderTime;this.lastRenderTime=e,0!==this.currentSpeed&&(this.currentFrame+=t*this.currentSpeed),i.clear(i.COLOR_BUFFER_BIT),i.useProgram(this.program),i.uniform1f(this.location("u_time"),.001*this.currentFrame),this.resolutionChanged&&(i.uniform2f(this.location("u_resolution"),i.canvas.width,i.canvas.height),i.uniform1f(this.location("u_pixelRatio"),this.pixelRatio),this.resolutionChanged=!1),i.drawArrays(i.TRIANGLES,0,6),0!==this.currentSpeed?this.requestRender():this.rafId=null}}let n=null;addEventListener("message",e=>{let i=e.data;if("init"===i.type){try{n=new a(i)}catch{postMessage({type:"failure"});return}n.loadImages(i.images).then(()=>{n?.start(),postMessage({type:"ready"})});return}n&&("resize"===i.type?n.resize(i.width,i.height,i.pixelRatio):"speed"===i.type?n.setSpeed(i.speed):"visibility"===i.type&&n.setHidden(i.hidden))})})();