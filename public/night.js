/*
 * Programmed Dream — the nocturnal photograph behind every page.
 *
 * One fragment shader paints a defocused night exposure (dense multicolored
 * grain, uneven exposure, broad halation) and dissolves between three
 * subjects: a cream dachshund, a playing radio, and a turning pottery wheel.
 * The lens breathes out of focus at every dissolve. Frames are paced at film
 * rate. Reduced motion receives one still frame; no WebGL leaves the deep navy
 * page untouched.
 */
(() => {
  const canvas = document.querySelector("[data-night]");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const vertexSource = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

  const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;   // render size in pixels
uniform float T;  // seconds
uniform vec3 W;   // subject weights: dachshund, radio, wheel
uniform float B;  // defocus width, subject units
uniform vec2 F;   // subject focus, render pixels (GL orientation)
uniform float U;  // subject unit, render pixels
uniform float D;  // exposure (dimmed under articles)
uniform float G;  // grain seed

const vec3 CYAN = vec3(0.24, 0.84, 0.96);
const vec3 AMBER = vec3(1.0, 0.6, 0.2);
const vec3 VERM = vec3(0.96, 0.27, 0.15);
const vec3 ROSE = vec3(0.86, 0.5, 0.58);
const vec3 LAV = vec3(0.58, 0.5, 0.92);
const vec3 CREAM = vec3(0.98, 0.87, 0.68);
const vec3 NAVY = vec3(0.018, 0.03, 0.078);

vec3 L; vec3 H1; vec3 H2;

float h21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x),
             mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
float cap(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
float ell(vec2 p, vec2 r) { return (length(p / r) - 1.0) * min(r.x, r.y); }
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float soft(float d, float b) { return 1.0 - smoothstep(-b, b, d); }
float luma(vec3 c) { return dot(c, vec3(0.3, 0.59, 0.11)); }
// The brief's colour path: cyan -> lavender -> dusty rose -> amber -> vermilion.
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0) * 4.0;
  if (t < 1.0) return mix(CYAN, LAV, t);
  if (t < 2.0) return mix(LAV, ROSE, t - 1.0);
  if (t < 3.0) return mix(ROSE, AMBER, t - 2.0);
  return mix(AMBER, VERM, t - 3.0);
}

// Light bleeds at every defocused edge: the rim of a source turns dusty
// rose and lavender before the halation carries it to amber and vermilion.
vec3 bleed(vec3 c, float m, vec2 p) {
  float edge = 4.0 * m * (1.0 - m);
  vec3 tint = mix(LAV, ROSE, 0.5 + 0.5 * sin(p.x * 3.0 + p.y * 2.0));
  return c * m + tint * luma(c) * edge * 0.55;
}
vec2 P;
// An emitter: defocused core, a brighter rim, and two halation fields.
void glow(float d, vec3 c, float b) {
  float m = soft(d, b);
  float rim = smoothstep(-b * 2.2, 0.0, d) * m;
  L += bleed(c, m, P) + c * rim * 0.25;
  float e = max(d, 0.0);
  H1 += c * exp(-e / 0.14);
  H2 += c * exp(-e / 0.7);
}
// A lit surface: defocused, its exposure uneven like fur, cloth, or clay.
void lit(float d, vec3 c, float b) {
  float m = soft(d, b);
  L += bleed(c, m, P) * (0.7 + 0.6 * vn(P * 4.0 + 3.1));
}
// A window: a defocused pane crossed by darker mullions.
void pane(vec2 q, vec2 size, vec3 c, float b) {
  float d = box(q, size, 0.03);
  float bars = min(abs(q.x), abs(q.y + size.y * 0.15)) - 0.012;
  glow(d, c * (1.0 - 0.55 * soft(bars, b * 0.8)), b);
}

void dachshund(vec2 p, float b, float k) {
  float breath = 1.0 + 0.025 * sin(T * 1.4);
  vec2 q = p - vec2(0.0, -0.06);
  float d = cap(q, vec2(-0.18, 0.0), vec2(0.42, -0.01), 0.12 * breath);
  d = smin(d, length(q - vec2(-0.24, -0.01)) - 0.15 * breath, 0.08);
  d = smin(d, length(q - vec2(-0.42, 0.16)) - 0.105, 0.07);
  d = smin(d, cap(q, vec2(-0.48, 0.14), vec2(-0.65, 0.09), 0.048), 0.04);
  d = smin(d, cap(q, vec2(-0.26, -0.1), vec2(-0.31, -0.23), 0.04), 0.03);
  d = smin(d, cap(q, vec2(-0.13, -0.1), vec2(-0.15, -0.23), 0.04), 0.03);
  d = smin(d, cap(q, vec2(0.33, -0.1), vec2(0.29, -0.23), 0.042), 0.03);
  d = smin(d, cap(q, vec2(0.44, -0.08), vec2(0.46, -0.22), 0.04), 0.03);
  d = smin(d, cap(q, vec2(0.52, 0.03), vec2(0.72, 0.14 + 0.035 * sin(T * 3.1)), 0.022), 0.03);
  vec3 key = ramp(0.85 - 0.85 * smoothstep(-0.6, 0.7, q.x)) * 1.05;
  float top = 0.6 + 0.5 * smoothstep(-0.22, 0.24, q.y);
  lit(d, CREAM * key * top * 0.9 * k, b);
  L -= AMBER * 0.32 * soft(ell(q - vec2(-0.37, 0.1), vec2(0.055, 0.1)), b) * k;
  lit(ell(q - vec2(0.05, -0.27), vec2(0.95, 0.07)), ROSE * 0.14 * k, b * 2.0);
  glow(length(p - vec2(-0.86, 0.62)) - 0.2, AMBER * 1.5 * k, b);
  pane(p - vec2(0.86, 0.52), vec2(0.22, 0.32), CYAN * 0.85 * k, b * 1.6);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 c = vec2(-1.1 + fi * 0.42, 0.98 + 0.08 * sin(fi * 1.7));
    glow(length(p - c) - 0.07, mix(LAV, ROSE, fract(fi * 0.37)) * 0.5 * k, b * 0.6);
  }
}

void radio(vec2 p, float b, float k) {
  float beat = pow(0.5 + 0.5 * sin(T * 7.85), 6.0) * 0.6 + 0.4 * vn(vec2(T * 3.0, 1.0));
  vec2 q = p;
  lit(box(q, vec2(0.56, 0.33), 0.12), vec3(0.44, 0.2, 0.16) * 0.6 * k, b);
  lit(length(q - vec2(-0.24, 0.0)) - 0.21, (LAV * 0.3 + ROSE * 0.18 * beat) * k, b);
  vec3 dial = ramp(smoothstep(0.08, 0.45, q.x) * 0.8);
  glow(box(q - vec2(0.25, 0.09), vec2(0.2, 0.065), 0.03), dial * (1.5 + 0.4 * beat) * k, b * 0.8);
  float nx = 0.1 + 0.25 * (0.5 + 0.5 * sin(T * 0.21));
  glow(cap(q, vec2(nx, 0.04), vec2(nx, 0.14), 0.006), VERM * 1.2 * k, b * 0.7);
  glow(length(q - vec2(0.16, -0.17)) - 0.05, AMBER * 0.35 * k, b);
  glow(length(q - vec2(0.37, -0.17)) - 0.05, AMBER * 0.3 * k, b);
  glow(length(q - vec2(0.46, 0.22)) - 0.018, VERM * (1.0 + 2.0 * beat) * k, b * 0.5);
  lit(cap(q, vec2(0.38, 0.33), vec2(0.8, 0.95), 0.024), CYAN * 0.3 * k, b * 1.4);
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float ph = fract(T * 0.045 + fi * 0.143);
    vec2 c = vec2(-0.24 + 0.35 * sin(fi * 2.3 + ph * 3.0), 0.25 + ph * 1.1);
    float r = 0.04 + 0.05 * fract(fi * 0.61);
    glow(length(q - c) - r, mix(ROSE, LAV, fract(fi * 0.5)) * sin(ph * 3.1416) * 0.6 * k, b * 0.7);
  }
  lit(ell(q - vec2(0.0, -0.42), vec2(1.2, 0.06)), AMBER * 0.12 * k, b * 2.0);
  pane(p - vec2(-0.98, 0.58), vec2(0.2, 0.28), CYAN * 0.55 * k, b * 1.7);
}

void wheel(vec2 p, float b, float k) {
  float spin = T * 2.2;
  vec2 q = p - vec2(0.0, -0.05);
  lit(abs(ell(q - vec2(0.0, -0.26), vec2(0.66, 0.17))) - 0.015, LAV * 0.38 * k, b);
  lit(ell(q - vec2(0.0, -0.21), vec2(0.44, 0.1)), vec3(0.5, 0.48, 0.56) * 0.35 * k, b);
  for (int i = 0; i < 6; i++) {
    float a = spin + float(i) * 1.047;
    vec2 c = vec2(cos(a) * 0.44, -0.21 + sin(a) * 0.1);
    float front = smoothstep(0.2, -0.6, sin(a));
    glow(length(q - c) - 0.022, mix(CYAN, vec3(1.0), 0.4) * front * 1.1 * k, b * 0.5);
  }
  float y = q.y + 0.2;
  float w = 0.17 + 0.09 * sin(clamp(y, 0.0, 0.62) * 4.6) - 0.1 * smoothstep(0.42, 0.62, y);
  float vessel = max(abs(q.x) - w, max(-y, y - 0.64));
  float shade = 0.25 + 0.8 * smoothstep(0.25, -0.2, q.x);
  lit(vessel, mix(VERM, ROSE, 0.35) * shade * 0.95 * k, b);
  float turn = spin + 1.3;
  glow(length(q - vec2(w * 0.8 * sin(turn), 0.1)) - 0.03, AMBER * 0.5 * max(cos(turn), 0.0) * k, b * 0.6);
  glow(length(p - vec2(-0.82, 0.66)) - 0.24, AMBER * 1.6 * k, b);
  pane(p - vec2(0.96, 0.48), vec2(0.21, 0.32), CYAN * 0.65 * k, b * 1.7);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    glow(length(p - vec2(0.55 + 0.18 * fi, -0.75 + 0.1 * sin(fi * 2.0))) - 0.06,
         mix(ROSE, LAV, fi / 3.0) * 0.4 * k, b * 0.6);
  }
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 p = (fc - F) / U + 0.03 * vec2(sin(T * 0.07), cos(T * 0.05));
  P = p;
  L = vec3(0.0); H1 = vec3(0.0); H2 = vec3(0.0);
  if (W.x > 0.001) dachshund(p, B, W.x);
  if (W.y > 0.001) radio(p, B, W.y);
  if (W.z > 0.001) wheel(p, B, W.z);

  float h1 = dot(H1, vec3(0.333));
  float h2 = dot(H2, vec3(0.333));
  vec3 col = max(L, 0.0)
    + mix(H1, mix(ROSE, LAV, 0.35) * h1, 0.7) * 0.16
    + mix(AMBER, VERM, 0.6) * h2 * 0.15;

  // Uneven exposure: a slow, low-frequency field fixed to the frame, plus
  // a faint veil of flare that lifts the shadows around the brightest light.
  vec2 s = fc / R.y;
  float field = fbm(s * 1.1 + vec2(T * 0.013, -T * 0.009));
  col *= 0.35 + 1.25 * field * field;
  col += mix(LAV, AMBER, field) * h2 * h2 * 0.075;
  col *= D;
  col = 1.0 - exp(-col * 1.3);
  col = NAVY + col * (1.0 - NAVY);

  // Dense multicolored grain, strongest in the midtones.
  vec2 g = floor(fc);
  vec3 n = vec3(h21(g + G * 1.7), h21(g + G * 2.3 + 19.0), h21(g + G * 3.1 + 41.0)) - 0.5;
  float m = h21(g * 1.31 + G * 5.0) - 0.5;
  float lum = dot(col, vec3(0.3, 0.59, 0.11));
  float amp = 0.065 + 0.6 * lum * (1.0 - lum);
  col += (n * 0.7 + m * 0.5) * amp;
  gl_FragColor = vec4(col, 1.0);
}`;

  function shader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  let u = null;
  // Builds the program; runs again after the browser restores a lost context.
  function init() {
    const vs = shader(gl.VERTEX_SHADER, vertexSource);
    const fs = shader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return false;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    u = {};
    for (const name of ["R", "T", "W", "B", "F", "U", "D", "G"]) {
      u[name] = gl.getUniformLocation(program, name);
    }
    return true;
  }
  if (!init()) return;

  const scene = document.body.dataset.scene;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const HOLD = 12;
  const FADE = 6;
  const SEGMENT = HOLD + FADE;
  const FOCUS = 0.13;
  const fps = 24;
  // Articles hold one still frame: no GPU loop while someone reads.
  const toggle = document.querySelector("[data-motion-toggle]");
  const PAUSE_KEY = "programmed-dream:paused";
  let paused = false;
  try {
    paused = window.localStorage.getItem(PAUSE_KEY) === "1";
  } catch {}
  const still = () => reduce.matches || frozen || scene === "article" || paused;
  const start = Math.random() * SEGMENT * 3;
  // `?frame=<seconds>` freezes one moment, for captures and comparisons.
  const pinned = Number.parseFloat(new URLSearchParams(window.location.search).get("frame"));
  const frozen = Number.isFinite(pinned);
  const stillTime = frozen ? pinned : Math.floor(Math.random() * 3) * SEGMENT + HOLD * 0.5;

  let width = 0;
  let height = 0;
  let cssWidth = 0;
  let cssHeight = 0;
  let ratio = 1;
  let lost = false;
  let composition = { x: 0, y: 0, unit: 1, exposure: 1 };

  // The canvas is 100lvh, so its own height (not innerHeight) keeps the
  // subject still while a phone's URL bar collapses.
  function compose(w, h) {
    const wide = w >= 1025;
    const stage = document.querySelector("[data-creative-coding-area]");
    const rect = stage && stage.offsetWidth > 0 ? stage.getBoundingClientRect() : null;
    if (scene === "article") {
      return {
        x: wide ? w * 0.92 : w * 0.7,
        y: h * (wide ? 0.55 : 0.78),
        unit: Math.min(w, h) * (wide ? 0.34 : 0.5),
        exposure: 0.14,
      };
    }
    if (rect) {
      return {
        x: rect.left + rect.width * 0.5,
        y: h * 0.52,
        unit: Math.min(rect.width * 0.5, h * 0.4),
        exposure: 1,
      };
    }
    if (wide) {
      return { x: w * 0.74, y: h * 0.52, unit: Math.min(w * 0.22, h * 0.4), exposure: 1 };
    }
    // Phones and tablets: text spans the width and scrolls over the fixed
    // frame, so the subject sinks into the bottom quarter, low and right,
    // and develops brighter as the reader reaches the end of the page.
    return { x: w * 0.78, y: h * 0.9, unit: Math.min(w * 0.44, h * 0.25), exposure: 0.22, develops: true };
  }

  function resize() {
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (cssW === cssWidth && cssH === cssHeight) return false;
    cssWidth = cssW;
    cssHeight = cssH;
    // Render near 1.5 CSS px per sample: the defocus hides the resolution,
    // the grain gains film-like body, and the GPU cost stays small.
    ratio = Math.min(0.7, Math.sqrt(720000 / Math.max(cssW * cssH, 1)));
    width = Math.max(1, Math.round(cssW * ratio));
    height = Math.max(1, Math.round(cssH * ratio));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    composition = compose(cssW, cssH);
    return true;
  }

  function draw(t, frame) {
    const position = ((t % (SEGMENT * 3)) + SEGMENT * 3) % (SEGMENT * 3);
    const index = Math.floor(position / SEGMENT);
    const local = position - index * SEGMENT;
    let mixAmount = local < HOLD ? 0 : (local - HOLD) / FADE;
    mixAmount = mixAmount * mixAmount * (3 - 2 * mixAmount);
    const weights = [0, 0, 0];
    weights[index] = 1 - mixAmount;
    weights[(index + 1) % 3] += mixAmount;

    gl.uniform2f(u.R, width, height);
    gl.uniform1f(u.T, t);
    gl.uniform3f(u.W, weights[0], weights[1], weights[2]);
    gl.uniform1f(u.B, FOCUS + 0.17 * Math.sin(Math.PI * mixAmount));
    gl.uniform2f(u.F, composition.x * ratio, height - composition.y * ratio);
    gl.uniform1f(u.U, composition.unit * ratio);
    gl.uniform1f(u.D, composition.exposure + (composition.develops ? 0.18 * progress : 0));
    gl.uniform1f(u.G, frame % 997);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let frame = 0;
  let last = 0;
  let lastTime = stillTime;
  let progress = 0;
  let raf = 0;
  let developed = false;

  function develop() {
    if (developed) return;
    developed = true;
    canvas.classList.add("is-developed");
  }

  function tick(now) {
    raf = window.requestAnimationFrame(tick);
    if (now - last < 1000 / fps - 2) return;
    last = now;
    frame += 1;
    lastTime = start + now / 1000;
    draw(lastTime, frame);
    develop();
  }

  function run() {
    window.cancelAnimationFrame(raf);
    if (lost) return;
    if (still()) {
      draw(paused ? lastTime : stillTime, 1);
      develop();
      return;
    }
    if (!document.hidden) raf = window.requestAnimationFrame(tick);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // Resizing clears the buffer; repaint at once instead of waiting a tick.
      if (!lost && resize()) draw(still() ? (paused ? lastTime : stillTime) : lastTime, frame);
    }, 120);
  });
  document.addEventListener("visibilitychange", run);
  reduce.addEventListener("change", run);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    window.cancelAnimationFrame(raf);
    syncToggle();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false;
    if (!init()) return;
    cssWidth = 0;
    resize();
    syncToggle();
    run();
  });

  function measureProgress() {
    const room = document.documentElement.scrollHeight - window.innerHeight;
    progress = room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 1;
  }
  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!composition.develops || scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(() => {
        scrollQueued = false;
        measureProgress();
        if (still() && !lost) draw(paused ? lastTime : stillTime, 1);
      });
    },
    { passive: true },
  );

  function syncToggle() {
    if (!toggle) return;
    toggle.hidden = reduce.matches || frozen || lost;
    toggle.textContent = paused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel;
  }
  if (toggle) {
    toggle.addEventListener("click", () => {
      paused = !paused;
      try {
        window.localStorage.setItem(PAUSE_KEY, paused ? "1" : "0");
      } catch {}
      syncToggle();
      run();
    });
    reduce.addEventListener("change", syncToggle);
  }

  resize();
  measureProgress();
  syncToggle();
  run();
})();
