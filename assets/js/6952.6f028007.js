"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["6952"],{9526(t,e,i){i.d(e,{A:()=>o});var r=i(4848);i(6540);var s=i(9863);function o({children:t,fallback:e}){return(0,s.A)()?(0,r.jsx)(r.Fragment,{children:t?.()}):e??null}},3385(t,e,i){i.d(e,{EJ:()=>w});var r=i(6540);let s=`#version 300 es
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
}`,o=8294400;class n{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=(function(){let t=navigator.userAgent.toLowerCase();return t.includes("safari")&&!t.includes("chrome")&&!t.includes("android")})();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(t,e,i,r,s=0,n=0,a=2,u=o,h=[]){if(t?.nodeType===1)this.parentElement=t;else throw Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=t.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let t=this.ownerDocument.createElement("style");t.innerHTML=l,t.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(t)}let c=this.ownerDocument.createElement("canvas");this.canvasElement=c,this.parentElement.prepend(c),this.fragmentShader=e,this.providedUniforms=i,this.mipmaps=h,this.currentFrame=n,this.minPixelRatio=a,this.maxPixelCount=u;let p=c.getContext("webgl2",r);if(!p)throw Error("Paper Shaders: WebGL is not supported in this browser");this.gl=p,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setSpeed(s),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let t=function(t,e,i){let r=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT),s=r?r.precision:null;s&&s<23&&(e=e.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let o=a(t,t.VERTEX_SHADER,e),n=a(t,t.FRAGMENT_SHADER,i);if(!o||!n)return null;let l=t.createProgram();return l?(t.attachShader(l,o),t.attachShader(l,n),t.linkProgram(l),t.getProgramParameter(l,t.LINK_STATUS))?(t.detachShader(l,o),t.detachShader(l,n),t.deleteShader(o),t.deleteShader(n),l):(console.error("Unable to initialize the shader program: "+t.getProgramInfoLog(l)),t.deleteProgram(l),t.deleteShader(o),t.deleteShader(n),null):null}(this.gl,s,this.fragmentShader);t&&(this.program=t)};setupPositionAttribute=()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),e=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([e,i])=>{if(t[e]=this.gl.getUniformLocation(this.program,e),i instanceof HTMLImageElement){let i=`${e}AspectRatio`;t[i]=this.gl.getUniformLocation(this.program,i)}}),this.uniformLocations=t};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let e=t.devicePixelContentBoxSize?.[0];void 0!==e&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=e.inlineSize,this.parentDevicePixelHeight=e.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let t=0,e=0,i=Math.max(1,window.devicePixelRatio),r=visualViewport?.scale??1;if(this.devicePixelsSupported){let s=Math.max(1,this.minPixelRatio/i);t=this.parentDevicePixelWidth*s*r,e=this.parentDevicePixelHeight*s*r}else{var s;let o,n,a=Math.max(i,this.minPixelRatio)*r;this.isSafari&&(a*=Math.max(1,(s=this.ownerDocument,(n=Math.round(100*(o=outerWidth/((visualViewport?.scale??1)*(visualViewport?.width??window.innerWidth)+(window.innerWidth-s.documentElement.clientWidth)))))%5==0?n/100:33===n?1/3:67===n?2/3:133===n?4/3:o))),t=Math.round(this.parentWidth)*a,e=Math.round(this.parentHeight)*a}let o=Math.min(1,Math.sqrt(this.maxPixelCount)/Math.sqrt(t*e)),n=Math.round(t*o),a=Math.round(e*o),l=n/Math.round(this.parentWidth);(this.canvasElement.width!==n||this.canvasElement.height!==a||this.renderScale!==l)&&(this.renderScale=l,this.canvasElement.width=n,this.canvasElement.height=a,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=t=>{if(this.hasBeenDisposed)return;if(null===this.program)return void console.warn("Tried to render before program or gl was initialized");let e=t-this.lastRenderTime;this.lastRenderTime=t,0!==this.currentSpeed&&(this.currentFrame+=e*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,.001*this.currentFrame),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),0!==this.currentSpeed?this.requestRender():this.rafId=null};requestRender=()=>{null!==this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(t,e)=>{if(!e.complete||0===e.naturalWidth)throw Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let i=this.textures.get(t);i&&this.gl.deleteTexture(i),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let r=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+r);let s=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,s),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let o=this.gl.getError();if(o!==this.gl.NO_ERROR||null===s)return void console.error("Paper Shaders: WebGL error when uploading texture:",o);this.textures.set(t,s);let n=this.uniformLocations[t];if(n){this.gl.uniform1i(n,r);let i=`${t}AspectRatio`,s=this.uniformLocations[i];if(s){let t=e.naturalWidth/e.naturalHeight;this.gl.uniform1f(s,t)}}};areUniformValuesEqual=(t,e)=>t===e||!!(Array.isArray(t)&&Array.isArray(e))&&t.length===e.length&&t.every((t,i)=>this.areUniformValuesEqual(t,e[i]));setUniformValues=t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([t,e])=>{let i=e;if(e instanceof HTMLImageElement&&(i=`${e.src.slice(0,200)}|${e.naturalWidth}x${e.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[t],i))return;this.uniformCache[t]=i;let r=this.uniformLocations[t];if(!r)return void console.warn(`Uniform location for ${t} not found`);if(e instanceof HTMLImageElement)this.setTextureUniform(t,e);else if(Array.isArray(e)){let i=null,s=null;if(void 0!==e[0]&&Array.isArray(e[0])){let r=e[0].length;if(!e.every(t=>t.length===r))return void console.warn(`All child arrays must be the same length for ${t}`);i=e.flat(),s=r}else s=(i=e).length;switch(s){case 2:this.gl.uniform2fv(r,i);break;case 3:this.gl.uniform3fv(r,i);break;case 4:this.gl.uniform4fv(r,i);break;case 9:this.gl.uniformMatrix3fv(r,!1,i);break;case 16:this.gl.uniformMatrix4fv(r,!1,i);break;default:console.warn(`Unsupported uniform array length: ${s}`)}}else"number"==typeof e?this.gl.uniform1f(r,e):"boolean"==typeof e?this.gl.uniform1i(r,+!!e):console.warn(`Unsupported uniform type for ${t}: ${typeof e}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(t=1)=>{this.speed=t,this.setCurrentSpeed(this.ownerDocument.hidden?0:t)};setCurrentSpeed=t=>{this.currentSpeed=t,null===this.rafId&&0!==t&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),null!==this.rafId&&0===t&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(t=o)=>{this.maxPixelCount=t,this.handleResize()};setMinPixelRatio=(t=2)=>{this.minPixelRatio=t,this.handleResize()};setUniforms=t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.setCurrentSpeed(this.ownerDocument.hidden?0:this.speed)};dispose=()=>{this.hasBeenDisposed=!0,null!==this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}}function a(t,e,i){let r=t.createShader(e);return r?(t.shaderSource(r,i),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS))?r:(console.error("An error occurred compiling the shaders: "+t.getShaderInfoLog(r)),t.deleteShader(r),null):null}let l=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function u(t){if(t.naturalWidth<1024&&t.naturalHeight<1024){if(t.naturalWidth<1||t.naturalHeight<1)return;let e=t.naturalWidth/t.naturalHeight;t.width=Math.round(e>1?1024*e:1024),t.height=Math.round(e>1?1024:1024/e)}}var h=i(4848);async function c(t){let e={},i=[];return Object.entries(t).forEach(([t,r])=>{if("string"==typeof r){let s=r||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";if(!(t=>{try{if(t.startsWith("/"))return!0;return new URL(t),!0}catch{return!1}})(s))return void console.warn(`Uniform "${t}" has invalid URL "${s}". Skipping image loading.`);let o=new Promise((i,r)=>{let o=new Image;(t=>{try{if(t.startsWith("/"))return!1;return new URL(t,window.location.origin).origin!==window.location.origin}catch{return!1}})(s)&&(o.crossOrigin="anonymous"),o.onload=()=>{u(o),e[t]=o,i()},o.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${s}`),r()},o.src=s});i.push(o)}else r instanceof HTMLImageElement&&u(r),e[t]=r}),await Promise.all(i),e}let p=(0,r.forwardRef)(function({fragmentShader:t,uniforms:e,webGlContextAttributes:i,speed:s=0,frame:o=0,width:a,height:l,minPixelRatio:u,maxPixelCount:p,mipmaps:g,style:f,...d},m){var v;let x,y,[_,b]=(0,r.useState)(!1),S=(0,r.useRef)(null),w=(0,r.useRef)(null),E=(0,r.useRef)(i);(0,r.useEffect)(()=>((async()=>{let i=await c(e);S.current&&!w.current&&(w.current=new n(S.current,t,i,E.current,s,o,u,p,g),b(!0))})(),()=>{w.current?.dispose(),w.current=null}),[t]),(0,r.useEffect)(()=>{let t=!1;return(async()=>{let i=await c(e);t||w.current?.setUniforms(i)})(),()=>{t=!0}},[e,_]),(0,r.useEffect)(()=>{w.current?.setSpeed(s)},[s,_]),(0,r.useEffect)(()=>{w.current?.setMaxPixelCount(p)},[p,_]),(0,r.useEffect)(()=>{w.current?.setMinPixelRatio(u)},[u,_]),(0,r.useEffect)(()=>{w.current?.setFrame(o)},[o,_]);let R=(v=[S,m],x=r.useRef(void 0),y=r.useCallback(t=>{let e=v.map(e=>{if(null!=e){if("function"==typeof e){let i=e(t);return"function"==typeof i?i:()=>{e(null)}}return e.current=t,()=>{e.current=null}}});return()=>{e.forEach(t=>t?.())}},v),r.useMemo(()=>v.every(t=>null==t)?null:t=>{x.current&&(x.current(),x.current=void 0),null!=t&&(x.current=y(t))},v));return(0,h.jsx)("div",{ref:R,style:void 0!==a||void 0!==l?{width:"string"==typeof a&&!1===isNaN(+a)?+a:a,height:"string"==typeof l&&!1===isNaN(+l)?+l:l,...f}:f,...d})});p.displayName="ShaderMount";let g={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},f={none:0,contain:1,cover:2};function d(t){if(Array.isArray(t))return 4===t.length?t:3===t.length?[...t,1]:v;if("string"!=typeof t)return v;let e,i,r,s=1;if(t.startsWith("#")){var o;[e,i,r,s]=(3===(o=(o=t).replace(/^#/,"")).length&&(o=o.split("").map(t=>t+t).join("")),6===o.length&&(o+="ff"),[parseInt(o.slice(0,2),16)/255,parseInt(o.slice(2,4),16)/255,parseInt(o.slice(4,6),16)/255,parseInt(o.slice(6,8),16)/255])}else if(t.startsWith("rgb")){let o;[e,i,r,s]=(o=t.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(o[1]??"0")/255,parseInt(o[2]??"0")/255,parseInt(o[3]??"0")/255,void 0===o[4]?1:parseFloat(o[4])]:[0,0,0,1]}else{let o;if(!t.startsWith("hsl"))return console.error("Unsupported color format",t),v;[e,i,r,s]=function(t){let e,i,r,[s,o,n,a]=t,l=s/360,u=o/100,h=n/100;if(0===o)e=i=r=h;else{let t=(t,e,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6)?t+(e-t)*6*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t,s=h<.5?h*(1+u):h+u-h*u,o=2*h-s;e=t(o,s,l+1/3),i=t(o,s,l),r=t(o,s,l-1/3)}return[e,i,r,a]}((o=t.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(o[1]??"0"),parseInt(o[2]??"0"),parseInt(o[3]??"0"),void 0===o[4]?1:parseFloat(o[4])]:[0,0,0,1])}return[m(e,0,1),m(i,0,1),m(r,0,1),m(s,0,1)]}let m=(t,e,i)=>Math.min(Math.max(t,e),i),v=[0,0,0,1],x=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,y=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,_=`
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`,b=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_highlights;
uniform float u_layering;
uniform float u_edges;
uniform float u_caustic;
uniform float u_waves;

in vec2 v_imageUV;

out vec4 fragColor;

${x}
${y}
${_}

float getUvFrame(vec2 uv) {
  float aax = 2. * fwidth(uv.x);
  float aay = 2. * fwidth(uv.y);

  float left   = smoothstep(0., aax, uv.x);
  float right = 1.0 - smoothstep(1. - aax, 1., uv.x);
  float bottom = smoothstep(0., aay, uv.y);
  float top = 1.0 - smoothstep(1. - aay, 1., uv.y);

  return left * right * bottom * top;
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float getCausticNoise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 6; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.1;
  }
  return (N.x + N.y + 1.);
}

void main() {
  vec2 imageUV = v_imageUV;
  vec2 patternUV = v_imageUV - .5;
  patternUV = (patternUV * vec2(u_imageAspectRatio, 1.));
  patternUV /= (.01 + .09 * u_size);

  float t = u_time;

  float wavesNoise = snoise((.3 + .1 * sin(t)) * .1 * patternUV + vec2(0., .4 * t));

  float causticNoise = getCausticNoise(patternUV + u_waves * vec2(1., -1.) * wavesNoise, 2. * t, 1.5);

  causticNoise += u_layering * getCausticNoise(patternUV + 2. * u_waves * vec2(1., -1.) * wavesNoise, 1.5 * t, 2.);
  causticNoise = causticNoise * causticNoise;

  float edgesDistortion = smoothstep(0., .1, imageUV.x);
  edgesDistortion *= smoothstep(0., .1, imageUV.y);
  edgesDistortion *= (smoothstep(1., 1.1, imageUV.x) + (1.0 - smoothstep(.8, .95, imageUV.x)));
  edgesDistortion *= (1.0 - smoothstep(.9, 1., imageUV.y));
  edgesDistortion = mix(edgesDistortion, 1., u_edges);

  float causticNoiseDistortion = .02 * causticNoise * edgesDistortion;

  float wavesDistortion = .1 * u_waves * wavesNoise;

  imageUV += vec2(wavesDistortion, -wavesDistortion);
  imageUV += (u_caustic * causticNoiseDistortion);

  float frame = getUvFrame(imageUV);

  vec4 image = texture(u_image, imageUV);
  vec4 backColor = u_colorBack;
  backColor.rgb *= backColor.a;

  vec3 color = mix(backColor.rgb, image.rgb, image.a * frame);
  float opacity = backColor.a + image.a * frame;

  causticNoise = max(-.2, causticNoise);

  float hightlight = .025 * u_highlights * causticNoise;
  hightlight *= u_colorHighlight.a;
  color = mix(color, u_colorHighlight.rgb, .05 * u_highlights * causticNoise);
  opacity += hightlight;

  color += hightlight * (.5 + .5 * wavesNoise);
  opacity += hightlight * (.5 + .5 * wavesNoise);

  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,S={name:"Default",params:{...g,scale:.8,speed:1,frame:0,colorBack:"#909090",colorHighlight:"#ffffff",highlights:.07,layering:.5,edges:.8,waves:.3,caustic:.1,size:1}},w=(0,r.memo)(function({speed:t=S.params.speed,frame:e=S.params.frame,colorBack:i=S.params.colorBack,colorHighlight:r=S.params.colorHighlight,image:s="",highlights:o=S.params.highlights,layering:n=S.params.layering,waves:a=S.params.waves,edges:l=S.params.edges,caustic:u=S.params.caustic,effectScale:c,size:g=void 0===c?S.params.size:10/9/c-1/9,fit:m=S.params.fit,scale:v=S.params.scale,rotation:x=S.params.rotation,originX:y=S.params.originX,originY:_=S.params.originY,offsetX:w=S.params.offsetX,offsetY:E=S.params.offsetY,worldWidth:R=S.params.worldWidth,worldHeight:U=S.params.worldHeight,...B}){let A={u_image:s,u_colorBack:d(i),u_colorHighlight:d(r),u_highlights:o,u_layering:n,u_waves:a,u_edges:l,u_caustic:u,u_size:g,u_fit:f[m],u_rotation:x,u_scale:v,u_offsetX:w,u_offsetY:E,u_originX:y,u_originY:_,u_worldWidth:R,u_worldHeight:U};return(0,h.jsx)(p,{...B,speed:t,frame:e,fragmentShader:b,mipmaps:["u_image"],uniforms:A})},function(t,e){for(let i in t){if("colors"===i){let i=Array.isArray(t.colors),r=Array.isArray(e.colors);if(!i||!r){if(!1===Object.is(t.colors,e.colors))return!1;continue}if(t.colors?.length!==e.colors?.length||!t.colors?.every((t,i)=>t===e.colors?.[i]))return!1;continue}if(!1===Object.is(t[i],e[i]))return!1}return!0})},5066(t,e,i){i.d(e,{A9x:()=>a,AUp:()=>o,HRP:()=>l,tgc:()=>s,tvk:()=>n});var r=i(1148);function s(t){return(0,r.k5)({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"},child:[]},{tag:"path",attr:{d:"M10 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-3v-4h4"},child:[]}]})(t)}function o(t){return(0,r.k5)({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"},child:[]},{tag:"path",attr:{d:"M10 8v3a1 1 0 0 0 1 1h3"},child:[]},{tag:"path",attr:{d:"M14 8v8"},child:[]}]})(t)}function n(t){return(0,r.k5)({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"},child:[]},{tag:"path",attr:{d:"M10 9a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1"},child:[]}]})(t)}function a(t){return(0,r.k5)({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"},child:[]},{tag:"path",attr:{d:"M10 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3"},child:[]}]})(t)}function l(t){return(0,r.k5)({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"},child:[]},{tag:"path",attr:{d:"M10 10l2 -2v8"},child:[]}]})(t)}},8631(t,e,i){i.d(e,{i:()=>u});var r=i(6540);function s(){return(s=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r])}return t}).apply(this,arguments)}var o={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:1/0,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(t){},onComplete:function(t){},preStringTyped:function(t,e){},onStringTyped:function(t,e){},onLastStringBackspaced:function(t){},onTypingPaused:function(t,e){},onTypingResumed:function(t,e){},onReset:function(t){},onStop:function(t,e){},onStart:function(t,e){},onDestroy:function(t){}},n=new(function(){function t(){}var e=t.prototype;return e.load=function(t,e,i){if(t.el="string"==typeof i?document.querySelector(i):i,t.options=s({},o,e),t.isInput="input"===t.el.tagName.toLowerCase(),t.attr=t.options.attr,t.bindInputFocusEvents=t.options.bindInputFocusEvents,t.showCursor=!t.isInput&&t.options.showCursor,t.cursorChar=t.options.cursorChar,t.cursorBlinking=!0,t.elContent=t.attr?t.el.getAttribute(t.attr):t.el.textContent,t.contentType=t.options.contentType,t.typeSpeed=t.options.typeSpeed,t.startDelay=t.options.startDelay,t.backSpeed=t.options.backSpeed,t.smartBackspace=t.options.smartBackspace,t.backDelay=t.options.backDelay,t.fadeOut=t.options.fadeOut,t.fadeOutClass=t.options.fadeOutClass,t.fadeOutDelay=t.options.fadeOutDelay,t.isPaused=!1,t.strings=t.options.strings.map(function(t){return t.trim()}),t.stringsElement="string"==typeof t.options.stringsElement?document.querySelector(t.options.stringsElement):t.options.stringsElement,t.stringsElement){t.strings=[],t.stringsElement.style.cssText="clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;";var r=Array.prototype.slice.apply(t.stringsElement.children),n=r.length;if(n)for(var a=0;a<n;a+=1)t.strings.push(r[a].innerHTML.trim())}for(var l in t.strPos=0,t.currentElContent=this.getCurrentElContent(t),t.currentElContent&&t.currentElContent.length>0&&(t.strPos=t.currentElContent.length-1,t.strings.unshift(t.currentElContent)),t.sequence=[],t.strings)t.sequence[l]=l;t.arrayPos=0,t.stopNum=0,t.loop=t.options.loop,t.loopCount=t.options.loopCount,t.curLoop=0,t.shuffle=t.options.shuffle,t.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},t.typingComplete=!1,t.autoInsertCss=t.options.autoInsertCss,t.autoInsertCss&&(this.appendCursorAnimationCss(t),this.appendFadeOutAnimationCss(t))},e.getCurrentElContent=function(t){return t.attr?t.el.getAttribute(t.attr):t.isInput?t.el.value:"html"===t.contentType?t.el.innerHTML:t.el.textContent},e.appendCursorAnimationCss=function(t){var e="data-typed-js-cursor-css";if(t.showCursor&&!document.querySelector("["+e+"]")){var i=document.createElement("style");i.setAttribute(e,"true"),i.innerHTML="\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ",document.body.appendChild(i)}},e.appendFadeOutAnimationCss=function(t){var e="data-typed-fadeout-js-css";if(t.fadeOut&&!document.querySelector("["+e+"]")){var i=document.createElement("style");i.setAttribute(e,"true"),i.innerHTML="\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ",document.body.appendChild(i)}},t}()),a=new(function(){function t(){}var e=t.prototype;return e.typeHtmlChars=function(t,e,i){if("html"!==i.contentType)return e;var r,s=t.substring(e).charAt(0);if("<"===s||"&"===s){for(r="<"===s?">":";";t.substring(e+1).charAt(0)!==r&&!(1+ ++e>t.length););e++}return e},e.backSpaceHtmlChars=function(t,e,i){if("html"!==i.contentType)return e;var r,s=t.substring(e).charAt(0);if(">"===s||";"===s){for(r=">"===s?"<":"&";t.substring(e-1).charAt(0)!==r&&!(--e<0););e--}return e},t}()),l=function(){function t(t,e){n.load(this,e,t),this.begin()}var e=t.prototype;return e.toggle=function(){this.pause.status?this.start():this.stop()},e.stop=function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this))},e.start=function(){this.typingComplete||this.pause.status&&(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this))},e.destroy=function(){this.reset(!1),this.options.onDestroy(this)},e.reset=function(t){void 0===t&&(t=!0),clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,t&&(this.insertCursor(),this.options.onReset(this),this.begin())},e.begin=function(){var t=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){0===t.strPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos):t.backspace(t.strings[t.sequence[t.arrayPos]],t.strPos)},this.startDelay)},e.typewrite=function(t,e){var i=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var r=this.humanizer(this.typeSpeed),s=1;!0!==this.pause.status?this.timeout=setTimeout(function(){e=a.typeHtmlChars(t,e,i);var r,o=0,n=t.substring(e);if("^"===n.charAt(0)&&/^\^\d+/.test(n)&&(r=1+(n=/\d+/.exec(n)[0]).length,o=parseInt(n),i.temporaryPause=!0,i.options.onTypingPaused(i.arrayPos,i),t=t.substring(0,e)+t.substring(e+r),i.toggleBlinking(!0)),"`"===n.charAt(0)){for(;"`"!==t.substring(e+s).charAt(0)&&(s++,!(e+s>t.length)););var l=t.substring(0,e),u=t.substring(l.length+1,e+s);t=l+u+t.substring(e+s+1),s--}i.timeout=setTimeout(function(){i.toggleBlinking(!1),e>=t.length?i.doneTyping(t,e):i.keepTyping(t,e,s),i.temporaryPause&&(i.temporaryPause=!1,i.options.onTypingResumed(i.arrayPos,i))},o)},r):this.setPauseStatus(t,e,!0)},e.keepTyping=function(t,e,i){0===e&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this));var r=t.substring(0,e+=i);this.replaceText(r),this.typewrite(t,e)},e.doneTyping=function(t,e){var i=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),this.arrayPos===this.strings.length-1&&(this.complete(),!1===this.loop||this.curLoop===this.loopCount)||(this.timeout=setTimeout(function(){i.backspace(t,e)},this.backDelay))},e.backspace=function(t,e){var i=this;if(!0!==this.pause.status){if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var r=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){e=a.backSpaceHtmlChars(t,e,i);var r=t.substring(0,e);if(i.replaceText(r),i.smartBackspace){var s=i.strings[i.arrayPos+1];i.stopNum=s&&r===s.substring(0,e)?e:0}e>i.stopNum?(e--,i.backspace(t,e)):e<=i.stopNum&&(i.arrayPos++,i.arrayPos===i.strings.length?(i.arrayPos=0,i.options.onLastStringBackspaced(),i.shuffleStringsIfNeeded(),i.begin()):i.typewrite(i.strings[i.sequence[i.arrayPos]],e))},r)}else this.setPauseStatus(t,e,!1)},e.complete=function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0},e.setPauseStatus=function(t,e,i){this.pause.typewrite=i,this.pause.curString=t,this.pause.curStrPos=e},e.toggleBlinking=function(t){this.cursor&&(this.pause.status||this.cursorBlinking!==t&&(this.cursorBlinking=t,t?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink")))},e.humanizer=function(t){return Math.round(Math.random()*t/2)+t},e.shuffleStringsIfNeeded=function(){this.shuffle&&(this.sequence=this.sequence.sort(function(){return Math.random()-.5}))},e.initFadeOut=function(){var t=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){t.arrayPos++,t.replaceText(""),t.strings.length>t.arrayPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],0):(t.typewrite(t.strings[0],0),t.arrayPos=0)},this.fadeOutDelay)},e.replaceText=function(t){this.attr?this.el.setAttribute(this.attr,t):this.isInput?this.el.value=t:"html"===this.contentType?this.el.innerHTML=t:this.el.textContent=t},e.bindFocusEvents=function(){var t=this;this.isInput&&(this.el.addEventListener("focus",function(e){t.stop()}),this.el.addEventListener("blur",function(e){t.el.value&&0!==t.el.value.length||t.start()}))},e.insertCursor=function(){this.showCursor&&(this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling)))},t}();let u=(0,r.memo)(({style:t,className:e,typedRef:i,parseRef:s,stopped:o,children:n,startWhenVisible:a,...u})=>{let h=(0,r.useRef)(null),c=(0,r.useMemo)(()=>[...Object.values(u).filter(t=>"boolean"==typeof t||"number"==typeof t||"string"==typeof t),u.strings?.join(",")],[u]);(0,r.useEffect)(()=>{let t=s&&s(h)||h.current,e=new l(t,{...u});if((o||a)&&e?.stop(),a){let i=new IntersectionObserver(([t])=>{t.isIntersecting&&(e?.start(),i.disconnect())});i.observe(t)}return i&&e&&i(e),()=>{e.destroy()}},c);let p=n?r.cloneElement(n,{ref:h}):r.createElement("span",{style:t,ref:h});return r.createElement("span",{style:t,className:e,"data-testid":"react-typed"},p)})}}]);