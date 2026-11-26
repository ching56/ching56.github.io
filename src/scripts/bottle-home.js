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

  const threshold = () => parseFloat(getComputedStyle(root).getPropertyValue("--dock-threshold"));
  const track = () => place.send(scrollY >= threshold() ? "past" : "back");
  render();
  track();
  addEventListener("scroll", track, { passive: true });
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
    addEventListener(type, () => {
      motion.send("hand");
      if (place.send("hand")) track();
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
