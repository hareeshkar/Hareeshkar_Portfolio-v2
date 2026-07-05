import { useEffect, useRef, useState, useMemo, memo } from "react";

const defaultParams = {
  patternScale: 2,
  refraction: 0.015,
  edge: 1,
  patternBlur: 0.005,
  liquid: 0.07,
  speed: 0.3,
};

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isLowEndDevice = navigator.hardwareConcurrency <= 4 || isMobile;
const MAX_FPS = isLowEndDevice ? 20 : 45;
const FRAME_TIME = 1000 / MAX_FPS;

// WebGL2 shaders - adapted from existing metallic paint effect
const vertexShaderSource = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vUv;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const liquidFragSource = `#version 300 es
precision ${isLowEndDevice ? "lowp" : "mediump"} float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_patternScale;
uniform float u_refraction;
uniform float u_edge;
uniform float u_patternBlur;
uniform float u_liquid;

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz - vec4(i1, 0., 0.);
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m; m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

vec2 get_img_uv() {
  vec2 img_uv = vUv - .5;
  if (u_ratio > u_img_ratio) {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;
  return img_uv;
}
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
  float ch = c2;
  float blur = u_patternBlur + extra_blur;
  ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));
  float border = w[0];
  ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
  b = smoothstep(.2, .8, b);
  border = w[0] + .4 * (1. - b) * w[1];
  ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
  border = w[0] + .5 * (1. - b) * w[1];
  ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));
  return ch;
}
float get_img_frame_alpha(vec2 uv, float img_frame_width) {
  float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
  img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
  return img_frame_alpha;
}
void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;
  float diagonal = uv.x - uv.y;
  float t = .001 * u_time;
  vec2 img_uv = get_img_uv();
  vec4 img = texture(u_image_texture, img_uv);
  vec3 color = vec3(0.);
  float opacity = 1.;
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));
  float edge = img.r;
  vec2 grad_uv = uv - .5;
  float dist = length(grad_uv + vec2(0., .2 * diagonal));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * 3.14159);
  float bulge = pow(1.8 * dist, 1.2);
  bulge = 1. - bulge;
  bulge *= pow(uv.y, .3);
  float cycle_width = u_patternScale;
  float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
  float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);
  float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
  float thin_strip_2_width = cycle_width * thin_strip_2_ratio;
  opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
  opacity *= get_img_frame_alpha(img_uv, 0.01);
  float noise = snoise(uv - t);
  edge += (1. - edge) * u_liquid * noise;
  float refr = (1. - bulge);
  refr = clamp(refr, 0., 1.);
  float dir = grad_uv.x + diagonal;
  dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));
  bulge *= clamp(pow(uv.y, .1), .3, 1.);
  dir *= (.1 + (1.1 - edge) * bulge);
  dir *= smoothstep(1., .7, edge);
  dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
  dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));
  dir *= (.5 + .5 * pow(uv.y, 2.));
  dir *= cycle_width;
  dir -= t;
  float refr_r = refr + .03 * bulge * noise;
  float refr_b = 1.3 * refr;
  refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
  refr_r -= diagonal;
  refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
  refr_b -= .2 * edge;
  refr_r *= u_refraction;
  refr_b *= u_refraction;
  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
  float stripe_r = mod(dir + refr_r, 1.);
  float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);
  float stripe_g = mod(dir, 1.);
  float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01 / (1. - diagonal), bulge);
  float stripe_b = mod(dir - refr_b, 1.);
  float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);
  color = vec3(r, g, b) * opacity;
  fragColor = vec4(color, opacity);
}
`;

const createShader = (gl, sourceCode, type) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const getUniforms = (program, gl) => {
  const uniforms = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    const uniformName = gl.getActiveUniform(program, i)?.name;
    if (uniformName)
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
  }
  return uniforms;
};

function MetallicPaint({ imageData, params = defaultParams, renderSize }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const textureRef = useRef(null);
  const uniformsRef = useRef({});
  const animationStateRef = useRef({
    totalTime: 0,
    lastRenderTime: 0,
    lastFrameTime: 0,
    frameCount: 0,
  });
  const rafId = useRef(null);
  const isVisible = useRef(true);
  const [isReady, setIsReady] = useState(false);

  const memoizedParams = useMemo(
    () => params,
    [
      params.patternScale,
      params.refraction,
      params.edge,
      params.patternBlur,
      params.liquid,
      params.speed,
    ]
  );

  const isInViewport = useRef(true);

  const updateVisibility = () => {
    isVisible.current = !document.hidden && isInViewport.current;
    if (isVisible.current) {
      animationStateRef.current.lastFrameTime = performance.now();
    }
  };

  useEffect(() => {
    const handleVisibilityChange = updateVisibility;
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Several of these WebGL contexts can be mounted at once (one per skill icon) — pause
  // each one's render loop while it's scrolled out of view, not just when the tab is hidden.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport.current = entry.isIntersecting;
        updateVisibility();
      },
      { rootMargin: "100px" }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      powerPreference: isLowEndDevice ? "low-power" : "high-performance",
      desynchronized: true,
      preserveDrawingBuffer: false,
      premultipliedAlpha: true,
      stencil: false,
      depth: false,
    });

    if (!gl) return;
    glRef.current = gl;

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(
      gl,
      liquidFragSource,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    programRef.current = program;
    uniformsRef.current = getUniforms(program, gl);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    setIsReady(true);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (textureRef.current) gl.deleteTexture(textureRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(vertexBuffer);
    };
  }, []);

  // Batch uniform updates with single program switch
  useEffect(() => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !Object.keys(uniforms).length || !isReady) return;

    gl.useProgram(programRef.current);
    gl.uniform1f(uniforms.u_edge, memoizedParams.edge);
    gl.uniform1f(uniforms.u_patternBlur, memoizedParams.patternBlur);
    gl.uniform1f(uniforms.u_patternScale, memoizedParams.patternScale);
    gl.uniform1f(uniforms.u_refraction, memoizedParams.refraction);
    gl.uniform1f(uniforms.u_liquid, memoizedParams.liquid);
  }, [memoizedParams, isReady]);

  // Optimized render loop with adaptive frame skipping
  useEffect(() => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !Object.keys(uniforms).length || !imageData || !isReady) return;

    const FRAME_SKIP = isLowEndDevice ? 3 : 1;
    let animFrameId = null;
    let frameCount = 0;
    let lastFrameTime = performance.now();
    let accumulatedTime = 0;

    const render = (currentTime) => {
      if (!isVisible.current) {
        animationStateRef.current.lastRenderTime = currentTime;
        animFrameId = requestAnimationFrame(render);
        return;
      }

      const state = animationStateRef.current;

      // Frame skipping for performance
      if (FRAME_SKIP > 0) {
        frameCount++;
        if (frameCount % (FRAME_SKIP + 1) !== 0) {
          animFrameId = requestAnimationFrame(render);
          return;
        }
      }

      const elapsed = currentTime - lastFrameTime;
      accumulatedTime += elapsed;

      if (accumulatedTime < FRAME_TIME * 0.9) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      lastFrameTime = currentTime;
      const deltaTime = accumulatedTime;
      accumulatedTime = 0;

      state.totalTime += deltaTime * memoizedParams.speed;
      state.totalTime = state.totalTime % 12000;

      gl.uniform1f(uniforms.u_time, state.totalTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animFrameId = requestAnimationFrame(render);
    };

    animationStateRef.current.lastRenderTime = performance.now();
    animFrameId = requestAnimationFrame(render);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [imageData, memoizedParams.speed, isReady]);

  // Optimized canvas resize with aggressive debounce
  useEffect(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const uniforms = uniformsRef.current;
    if (
      !canvas ||
      !gl ||
      !Object.keys(uniforms).length ||
      !imageData ||
      !isReady
    )
      return;

    let resizeTimeout;
    const resizeCanvas = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const imgRatio = imageData.width / imageData.height;

        // Use provided renderSize or fallback to optimized adaptive size
        const baseSize = renderSize || (isLowEndDevice ? 64 : 96);
        const dpr = Math.min(
          window.devicePixelRatio,
          isLowEndDevice ? 1 : 1.25
        );

        const newWidth = baseSize * dpr;
        const newHeight = baseSize * dpr;

        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          gl.viewport(0, 0, newWidth, newHeight);
        }

        gl.useProgram(programRef.current);
        gl.uniform1f(uniforms.u_ratio, 1);
        gl.uniform1f(uniforms.u_img_ratio, imgRatio);
      }, 250);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [imageData, isReady, renderSize]);

  // Texture upload with GPU pinning
  useEffect(() => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !Object.keys(uniforms).length || !imageData || !isReady) return;

    if (textureRef.current) gl.deleteTexture(textureRef.current);

    const texture = gl.createTexture();
    textureRef.current = texture;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Better filtering for small icons
    const filterMode = isLowEndDevice ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      imageData.width,
      imageData.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imageData.data
    );

    if (!isLowEndDevice) gl.generateMipmap(gl.TEXTURE_2D);

    gl.useProgram(programRef.current);
    gl.uniform1i(uniforms.u_image_texture, 0);

    return () => {
      if (texture) gl.deleteTexture(texture);
    };
  }, [imageData, isReady]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

export default memo(MetallicPaint);
