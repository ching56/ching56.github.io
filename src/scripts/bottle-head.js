// Runs in the zh-TW home's <head>, before the first frame, so the bottle's
// state is known when the page is first drawn and when a cross-page
// transition captures it (CSS gives the bottle its transition name only in
// the hero). It seeds the place machine and the motion machine together:
// coming back to a home left docked (through history or a reload, both of
// which restore the scroll), the bottle starts docked and still, so the
// restore never replays the move; any other arrival starts in the hero and
// live, so the very first scroll plays it, whatever does the scrolling.
// bottle-home.js takes over from these seeds after the hero.
(() => {
  const root = document.documentElement;
  let place = "hero";
  try {
    const arrival = performance.getEntriesByType("navigation")[0]?.type;
    const restores = arrival === "back_forward" || arrival === "reload";
    if (restores && sessionStorage.getItem("bottle-place") === "docked") place = "docked";
  } catch {}
  root.dataset.bottle = place;
  root.dataset.bottleMotion = place === "docked" ? "still" : "live";
})();
