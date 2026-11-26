// The homepage bottle's inline script. BottleMark.astro minifies it with
// esbuild and inlines it after the hero (budget: 3 KB). The state machines it
// runs are described in BottleMark.astro's frontmatter.
(() => {
  const root = document.documentElement;
  const bottle = document.querySelector(".home-bottle");
  const still = bottle && bottle.querySelector(".bottle-still");
  if (!still) return;
  const machine = (table, state, changed) => ({
    get state() {
      return state;
    },
    send(event) {
      const next = table[state][event];
      if (!next) return false;
      state = next;
      changed();
      return true;
    },
  });
  const render = () => {
    root.dataset.bottle = place.state === "hero" ? "hero" : "docked";
    root.dataset.bottleMotion = motion.state;
    if (sprites[size()].state === "ready") root.dataset.spin = "ready";
    else delete root.dataset.spin;
  };

  // The head script (bottle-head.js) has seeded both machines before the
  // first frame. A docked seed means a return (history or reload) to a home
  // left scrolled down: the bottle is "returning", shown docked while the browser
  // restores the scroll, which passes through small scrollY values on the
  // way; only reaching the threshold or a hand scroll settles it.
  const key = "bottle-place";
  const place = machine(
    {
      returning: { past: "docked", hand: "docked" },
      hero: { past: "docked" },
      docked: { back: "hero" },
    },
    root.dataset.bottle === "docked" ? "returning" : "hero",
    render,
  );
  const motion = machine({ still: { hand: "live" }, live: {} }, root.dataset.bottleMotion === "still" ? "still" : "live", render);
  const spriteTable = {
    idle: { request: "loading" },
    loading: { loaded: "ready", failed: "failed" },
    ready: {},
    failed: {},
  };
  const sprites = { small: machine(spriteTable, "idle", render), large: machine(spriteTable, "idle", render) };
  const narrow = matchMedia("(max-width: 48rem)");
  const size = () => (narrow.matches ? "small" : "large");

  // The dock moves on a spring, not a CSS transition: every frame it writes
  // --docked (0 hero, 1 docked; CSS derives the whole move from it) on the
  // bottle and its paper strip. A new target keeps the current position and
  // velocity, so reversing mid-move turns smoothly. Each step advances at
  // most 1/30 s, so frames the browser holds back slow the move rather than
  // skip it. Critically damped (react-spring's default tension and
  // friction): no overshoot. While motion is still, or under reduced motion
  // (CSS fades instead), it jumps.
  //   spring  rest --aim--> moving --settle--> rest
  const movers = [bottle, document.querySelector(".home-band")].filter(Boolean);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const target = () => (place.state === "hero" ? 0 : 1);
  let x = target();
  let v = 0;
  let last = 0;
  const spring = machine({ rest: { aim: "moving" }, moving: { settle: "rest" } }, "rest", () => {});
  const write = () => {
    for (const mover of movers) {
      if (reduced.matches) mover.style.removeProperty("--docked");
      else mover.style.setProperty("--docked", Math.min(1, Math.max(0, x)).toFixed(4));
    }
  };
  const step = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    v += (170 * (target() - x) - 26 * v) * dt;
    x += v * dt;
    if (Math.abs(target() - x) < 0.001 && Math.abs(v) < 0.01) {
      x = target();
      v = 0;
      spring.send("settle");
    } else requestAnimationFrame(step);
    write();
  };
  const aim = () => {
    if (motion.state === "still" || reduced.matches) {
      x = target();
      v = 0;
      write();
    } else if (x !== target() && spring.send("aim")) {
      last = performance.now();
      requestAnimationFrame(step);
    }
  };

  const threshold = () => parseFloat(getComputedStyle(root).getPropertyValue("--dock-threshold"));
  const track = () => {
    place.send(scrollY >= threshold() ? "past" : "back");
    aim();
  };
  render();
  track();
  write();
  reduced.addEventListener("change", write);
  addEventListener("scroll", track, { passive: true });
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
    addEventListener(type, () => {
      motion.send("hand");
      if (place.send("hand")) track();
      else aim();
    }, { passive: true });
  }

  addEventListener("pagehide", () => {
    try {
      sessionStorage.setItem(key, root.dataset.bottle);
    } catch {}
  });

  const connection = navigator.connection;
  if (connection && (connection.saveData || /2g$/.test(connection.effectiveType))) return;
  const load = () => {
    const current = size();
    render();
    if (!sprites[current].send("request")) return;
    const sprite = new Image();
    const fail = () => sprites[current].send("failed");
    const timeout = setTimeout(() => {
      sprite.removeAttribute("src");
      fail();
    }, 8000);
    sprite.onload = () => {
      clearTimeout(timeout);
      sprites[current].send("loaded");
    };
    sprite.onerror = () => {
      clearTimeout(timeout);
      fail();
    };
    sprite.src = current === "small" ? bottle.dataset.spriteSmall : bottle.dataset.spriteLarge;
  };
  if (still.complete && still.naturalWidth) load();
  else still.addEventListener("load", load, { once: true });
  narrow.addEventListener("change", load);
})();
