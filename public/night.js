/*
 * Programmed Dream — the nocturnal photograph behind every page.
 *
 * One fragment shader paints a heavily defocused 5:30 pm exposure (dense
 * multicolored grain, uneven exposure, broad halation, a low sun throwing
 * flat light across the frame) and dissolves between three subjects: a
 * cream dachshund, a playing radio, and a turning pottery wheel, each barely
 * recognizable. The lens breathes further out of focus at every dissolve.
 * Frames are paced at film rate. Reduced motion receives one still frame; no
 * WebGL leaves the ink page untouched.
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

// The user's magic-hour palette (2026-11-03), as 0-1 sRGB.
const vec3 INK = vec3(0.067, 0.094, 0.11);      // #11181C, the deepest tone; never black
const vec3 BLUE = vec3(0.169, 0.29, 0.49);      // #2B4A7D
const vec3 CYAN = vec3(0.408, 0.678, 0.773);    // #68ADC5
const vec3 LAV = vec3(0.647, 0.631, 0.698);     // #A5A1B2
const vec3 ROSE = vec3(0.671, 0.455, 0.588);    // #AB7496
const vec3 VERM = vec3(0.698, 0.247, 0.18);     // #B23F2E
const vec3 AMBER = vec3(0.788, 0.565, 0.275);   // #C99046
const vec3 CREAM = vec3(0.98, 0.87, 0.68);      // the dachshund's coat
// Rose and blue mixed, then pushed away from grey: the side turned away from the sun.
const vec3 PURP = vec3(0.45, 0.33, 0.66);

vec3 L; vec3 H1; vec3 H2; float O; float SH;

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
  O = max(O, m * min(luma(c) * 6.0, 1.0));
  L += bleed(c, m, P) * (0.7 + 0.6 * vn(P * 4.0 + 3.1));
}
// A solid form in flat evening light. The face toward the sun (side 1) is
// warm, the face turned away is purple, and a hot rim burns along the edge
// the light grazes (where the sample toward the sun, dSun, is already outside).
void sunlit(float d, float dSun, vec3 warm, float side, float b, float k) {
  float m = soft(d, b);
  float rim = m * (1.0 - soft(dSun, b * 0.7));
  vec3 c = mix(PURP * 0.4, warm, side) + mix(AMBER, CREAM, 0.3) * rim * 0.9;
  O = max(O, m * k);
  L += bleed(c * k, m, P) * (0.75 + 0.5 * vn(P * 4.0 + 3.1));
}
// The long shadow a subject throws to the left along the ground.
void longShadow(vec2 q, float base, float len, float b, float k) {
  SH = max(SH, soft(ell(q - vec2(0.1 - len * 0.5, base), vec2(len * 0.5 + 0.25, 0.05)), b * 1.5) * k);
}
// A window: a defocused pane crossed by darker mullions.
void pane(vec2 q, vec2 size, vec3 c, float b) {
  float d = box(q, size, 0.03);
  float bars = min(abs(q.x), abs(q.y + size.y * 0.15)) - 0.012;
  glow(d, c * (1.0 - 0.55 * soft(bars, b * 0.8)), b);
}

float dogD(vec2 q, float breath) {
  float d = cap(q, vec2(-0.18, 0.0), vec2(0.42, -0.01), 0.12 * breath);
  d = smin(d, length(q - vec2(-0.24, -0.01)) - 0.15 * breath, 0.08);
  d = smin(d, length(q - vec2(-0.42, 0.16)) - 0.105, 0.07);
  d = smin(d, cap(q, vec2(-0.48, 0.14), vec2(-0.65, 0.09), 0.048), 0.04);
  d = smin(d, cap(q, vec2(-0.26, -0.1), vec2(-0.31, -0.23), 0.04), 0.03);
  d = smin(d, cap(q, vec2(-0.13, -0.1), vec2(-0.15, -0.23), 0.04), 0.03);
  d = smin(d, cap(q, vec2(0.33, -0.1), vec2(0.29, -0.23), 0.042), 0.03);
  d = smin(d, cap(q, vec2(0.44, -0.08), vec2(0.46, -0.22), 0.04), 0.03);
  return smin(d, cap(q, vec2(0.52, 0.03), vec2(0.72, 0.14 + 0.035 * sin(T * 3.1)), 0.022), 0.03);
}

void dachshund(vec2 p, float b, float k) {
  float breath = 1.0 + 0.025 * sin(T * 1.4);
  vec2 q = p - vec2(0.0, -0.06);
  float side = smoothstep(-0.6, 0.45, q.x) * (0.65 + 0.35 * smoothstep(-0.22, 0.2, q.y));
  sunlit(dogD(q, breath), dogD(q + vec2(0.07, 0.012), breath), mix(CREAM, AMBER, 0.6) * 0.8, side, b, k);
  float ear = soft(ell(q - vec2(-0.37, 0.1), vec2(0.055, 0.1)), b) * k;
  L = mix(L, PURP * 0.22, ear * 0.6);
  longShadow(q, -0.24, 1.7, b, k);
  glow(length(p - vec2(-0.86, 0.62)) - 0.2, mix(AMBER, ROSE, 0.3) * 0.8 * k, b);
  pane(p - vec2(0.86, 0.52), vec2(0.22, 0.32), mix(AMBER, CREAM, 0.35) * 0.9 * k, b * 1.6);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 c = vec2(-1.1 + fi * 0.4, 0.86 + 0.07 * sin(fi * 1.7));
    glow(length(p - c) - 0.07, mix(ROSE, AMBER, fi * 0.25) * 0.5 * k, b * 0.6);
  }
}

void radio(vec2 p, float b, float k) {
  float beat = pow(0.5 + 0.5 * sin(T * 7.85), 6.0) * 0.6 + 0.4 * vn(vec2(T * 3.0, 1.0));
  vec2 q = p;
  sunlit(box(q, vec2(0.56, 0.33), 0.12), box(q + vec2(0.08, 0.015), vec2(0.56, 0.33), 0.12),
         mix(VERM, AMBER, 0.4) * 1.05, smoothstep(-0.6, 0.55, q.x), b, k);
  lit(length(q - vec2(-0.24, 0.0)) - 0.21, (PURP * 0.3 + ROSE * 0.2 * beat) * k, b);
  vec3 dial = mix(AMBER, CREAM, 0.2 + 0.4 * smoothstep(0.08, 0.45, q.x));
  glow(box(q - vec2(0.25, 0.09), vec2(0.2, 0.065), 0.03), dial * (1.0 + 0.35 * beat) * k, b * 0.8);
  float nx = 0.1 + 0.25 * (0.5 + 0.5 * sin(T * 0.21));
  glow(cap(q, vec2(nx, 0.04), vec2(nx, 0.14), 0.006), VERM * 1.2 * k, b * 0.7);
  glow(length(q - vec2(0.16, -0.17)) - 0.05, AMBER * 0.35 * k, b);
  glow(length(q - vec2(0.37, -0.17)) - 0.05, AMBER * 0.3 * k, b);
  glow(length(q - vec2(0.46, 0.22)) - 0.018, VERM * (1.0 + 2.0 * beat) * k, b * 0.5);
  lit(cap(q, vec2(0.38, 0.33), vec2(0.74, 0.85), 0.024), mix(AMBER, CREAM, 0.4) * 0.45 * k, b * 1.4);
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float ph = fract(T * 0.045 + fi * 0.143);
    vec2 c = vec2(-0.24 + 0.35 * sin(fi * 2.3 + ph * 3.0), 0.25 + ph * 0.8);
    float r = 0.04 + 0.05 * fract(fi * 0.61);
    glow(length(q - c) - r, mix(ROSE, AMBER, fract(fi * 0.5)) * sin(ph * 3.1416) * 0.6 * k, b * 0.7);
  }
  longShadow(q, -0.36, 1.9, b, k);
  pane(p - vec2(-0.98, 0.58), vec2(0.2, 0.28), PURP * 0.6 * k, b * 1.7);
}

void wheel(vec2 p, float b, float k) {
  float spin = T * 2.2;
  vec2 q = p - vec2(0.0, -0.05);
  float lean = smoothstep(-0.5, 0.5, q.x);
  lit(abs(ell(q - vec2(0.0, -0.26), vec2(0.66, 0.17))) - 0.015, mix(PURP * 0.45, AMBER * 0.7, lean) * k, b);
  lit(ell(q - vec2(0.0, -0.21), vec2(0.44, 0.1)), mix(PURP * 0.4, mix(AMBER, CREAM, 0.3) * 0.75, lean) * k, b);
  for (int i = 0; i < 6; i++) {
    float a = spin + float(i) * 1.047;
    vec2 c = vec2(cos(a) * 0.44, -0.21 + sin(a) * 0.1);
    float front = smoothstep(0.2, -0.6, sin(a));
    glow(length(q - c) - 0.022, mix(AMBER, CREAM, 0.5) * front * 1.1 * k, b * 0.5);
  }
  float y = q.y + 0.2;
  float w = 0.17 + 0.09 * sin(clamp(y, 0.0, 0.62) * 4.6) - 0.1 * smoothstep(0.42, 0.62, y);
  float vessel = max(abs(q.x) - w, max(-y, y - 0.64));
  float vesselSun = max(abs(q.x + 0.07) - w, max(-y, y - 0.64));
  sunlit(vessel, vesselSun, mix(VERM, AMBER, 0.35) * 1.1, smoothstep(-0.2, 0.22, q.x), b, k);
  float turn = spin + 1.3;
  glow(length(q - vec2(w * 0.8 * sin(turn), 0.1)) - 0.03, AMBER * 0.5 * max(cos(turn), 0.0) * k, b * 0.6);
  longShadow(q, -0.32, 1.9, b, k);
  glow(length(p - vec2(-0.82, 0.66)) - 0.24, mix(AMBER, ROSE, 0.3) * 0.85 * k, b);
  pane(p - vec2(0.96, 0.48), vec2(0.21, 0.32), mix(AMBER, CREAM, 0.35) * 0.8 * k, b * 1.7);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    glow(length(p - vec2(0.55 + 0.18 * fi, -0.75 + 0.1 * sin(fi * 2.0))) - 0.06,
         mix(AMBER, ROSE, fi / 3.0) * 0.45 * k, b * 0.6);
  }
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 p = (fc - F) / U + 0.03 * vec2(sin(T * 0.07), cos(T * 0.05));
  P = p;
  L = vec3(0.0); H1 = vec3(0.0); H2 = vec3(0.0); O = 0.0; SH = 0.0;
  if (W.x > 0.001) dachshund(p, B, W.x);
  if (W.y > 0.001) radio(p, B, W.y);
  if (W.z > 0.001) wheel(p, B, W.z);

  // 5:30 pm. The sun rests on the horizon just past the right of the
  // subject and its light runs flat across the frame: faces turned toward
  // it burn amber and vermilion, faces turned away fall into purple, and
  // each subject throws a long shadow to the left. Away from the sun the
  // whole evening turns purple, never black or grey.
  vec2 s = p - vec2(1.5, -0.22);
  float h = s.y;
  float toward = exp(-max(-s.x, 0.0) * 0.55);
  vec3 sky = mix(AMBER * 1.3, VERM * 1.1, smoothstep(0.03, 0.3, abs(h)));
  sky = mix(sky, ROSE, smoothstep(0.3, 0.8, h));
  sky = mix(sky, PURP * 0.7, smoothstep(0.7, 1.5, h));
  sky *= mix(1.0, 0.3, smoothstep(0.6, 1.4, h));
  vec3 ground = mix(VERM * 0.6, PURP * 0.3, smoothstep(0.0, 0.7, -h));
  ground = mix(ground, PURP * 0.22, 0.8 * SH);
  sky = mix(sky, ground, smoothstep(-0.01, -0.08, h));
  sky = mix(PURP * 0.4, sky * mix(0.4, 1.0, toward), toward);
  float halo = exp(-length(s * vec2(1.0, 1.7)) * 2.0);
  float beam = (exp(-abs(h) * 9.0) + 1.5 * exp(-abs(h) * 40.0)) * exp(-abs(s.x) * 0.95) * (1.0 - 0.8 * SH);
  L += (sky * 0.55 + (AMBER * 1.4 + VERM * 0.5) * halo + mix(VERM, AMBER, toward) * beam * 0.8)
     * (1.0 - 0.85 * O);

  float h1 = dot(H1, vec3(0.333));
  float h2 = dot(H2, vec3(0.333));
  vec3 col = max(L, 0.0)
    + mix(H1, mix(ROSE, AMBER, 0.5) * h1, 0.5) * 0.18
    + mix(AMBER, VERM, 0.5) * h2 * 0.16
    + (AMBER * 0.6 + VERM * 0.4) * exp(-length(s) * 0.9) * 0.22;

  // Uneven exposure: a slow, low-frequency field fixed to the frame, plus
  // a faint veil of flare that lifts the shadows around the brightest light.
  vec2 fs = fc / R.y;
  float field = fbm(fs * 1.1 + vec2(T * 0.013, -T * 0.009));
  col *= 0.45 + 1.15 * field * field;
  col += mix(ROSE, AMBER, field) * h2 * h2 * 0.075;
  // The lens falls off toward the top of the frame and into the dark side,
  // where the type sits.
  col *= mix(1.0, 0.35, smoothstep(0.75, 1.0, fc.y / R.y));
  col *= mix(0.55, 1.0, smoothstep(-2.0, -0.85, p.x));
  col *= D;
  // Dusk ambient: even the dimmest frame (phones, articles) stays purple.
  col += PURP * 0.06 * (1.0 - D);
  col = 1.0 - exp(-col * 1.5);
  col = INK + col * (1.0 - INK);
  // Bold, vivid evening colour: a strong lift away from grey.
  col = max(mix(vec3(luma(col)), col, 3.0), 0.0);

  // Dense multicolored grain, strongest in the midtones.
  vec2 g = floor(fc);
  vec3 n = vec3(h21(g + G * 1.7), h21(g + G * 2.3 + 19.0), h21(g + G * 3.1 + 41.0)) - 0.5;
  float m = h21(g * 1.31 + G * 5.0) - 0.5;
  float lum = dot(col, vec3(0.3, 0.59, 0.11));
  float amp = 0.065 + 0.6 * lum * (1.0 - lum);
  col += (n * 0.85 + m * 0.15) * amp;
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
  const FOCUS = 0.3;
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
        exposure: 0.12,
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
    return { x: w * 0.78, y: h * 1.03, unit: Math.min(w * 0.44, h * 0.23), exposure: 0.15, develops: true };
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
    gl.uniform1f(u.B, FOCUS + 0.2 * Math.sin(Math.PI * mixAmount));
    gl.uniform2f(u.F, composition.x * ratio, height - composition.y * ratio);
    gl.uniform1f(u.U, composition.unit * ratio);
    gl.uniform1f(u.D, composition.exposure + (composition.develops ? 0.07 * progress : 0));
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
