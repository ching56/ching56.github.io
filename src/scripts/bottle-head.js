// Runs in the zh-TW home's <head>, before the first frame, so the bottle's
// state is known when the page is first drawn and when a cross-page
// transition captures it (CSS gives the bottle its transition name only in
// the hero). It seeds the place machine and the motion machine together:
// coming back to a home left docked, the bottle starts docked and still, so
// the scroll the browser restores never replays the move; any other arrival
// starts in the hero and live, so the very first scroll plays it. The place
// is kept on the history entry itself (history.state.bottle, written by
// bottle-home.js), not guessed from the navigation type: Safari reports the
// same return as "reload" one time and "navigate" another, but the entry
// always carries its state, and a fresh visit through a link has none.
// bottle-home.js takes over from these seeds after the hero.
(() => {
  const root = document.documentElement;
  let place = "hero";
  try {
    if (history.state?.bottle === "docked") place = "docked";
  } catch {}
  root.dataset.bottle = place;
  root.dataset.bottleMotion = place === "docked" ? "still" : "live";
})();
