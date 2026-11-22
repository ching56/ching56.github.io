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
    root.dataset.bottle = place.state;
    root.dataset.bottleMotion = motion.state;
    if (sprites[size()].state === "ready") root.dataset.spin = "ready";
    else delete root.dataset.spin;
  };

  // The head script (bottle-head.js) has seeded the place before the first
  // frame; the machine starts from that seed.
  const key = "bottle-place";
  const seed = root.dataset.bottle === "docked" ? "docked" : "hero";
  const place = machine({ hero: { past: "docked" }, docked: { back: "hero" } }, seed, render);
  const motion = machine({ still: { hand: "live" }, live: {} }, "still", render);
  const spriteTable = {
    idle: { request: "loading" },
    loading: { loaded: "ready", failed: "failed" },
    ready: {},
    failed: {},
  };
  const sprites = { small: machine(spriteTable, "idle", render), large: machine(spriteTable, "idle", render) };
  const narrow = matchMedia("(max-width: 48rem)");
  const size = () => (narrow.matches ? "small" : "large");

  const threshold = () => parseFloat(getComputedStyle(root).getPropertyValue("--dock-threshold"));
  const track = () => place.send(scrollY >= threshold() ? "past" : "back");
  render();
  track();
  addEventListener("scroll", track, { passive: true });
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
    addEventListener(type, () => motion.send("hand"), { passive: true });
  }

  addEventListener("pagehide", () => {
    try {
      sessionStorage.setItem(key, place.state);
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
