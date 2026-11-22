// Runs in the zh-TW home's <head>, before the first frame, so the bottle's
// state is known when the page is first drawn and when a cross-page
// transition captures it (CSS gives the bottle its transition name only in
// the hero). It seeds the place machine (docked when coming back through
// history to a home left docked; otherwise hero) and the motion machine
// (still). bottle-home.js takes over from these seeds after the hero.
(() => {
  const root = document.documentElement;
  let place = "hero";
  try {
    const arrival = performance.getEntriesByType("navigation")[0]?.type;
    if (arrival === "back_forward" && sessionStorage.getItem("bottle-place") === "docked") place = "docked";
  } catch {}
  root.dataset.bottle = place;
  root.dataset.bottleMotion = "still";
})();
