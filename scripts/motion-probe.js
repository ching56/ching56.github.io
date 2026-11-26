// Frame recorder for motion bugs (see docs/testing-motion.md). It does
// nothing unless the page URL has ?probe. `astro dev` injects it into every
// page's <head> (src/lib/dev-motion-probe.mjs); scripts/record-motion.mjs
// injects it into any page, production included. Builds never ship it.
//
//   ?probe=<selector>   element to watch (default .home-bottle)
//   &props=a,b          computed properties to read (default --dock-t,translate,scale)
//   &after=<ms>         how long to keep recording after the first scroll (default 2500)
//
// Every animation frame it reads scrollY, the props and the root's data-*
// attributes (last, as they are long), and keeps a row whenever anything but the time changed. Once
// done it shows the rows over the page (readable in an iOS Simulator
// screenshot) and leaves them on window.__probe = { columns, rows, done }.
(() => {
  const params = new URLSearchParams(location.search);
  if (!params.has("probe") || window.__probe) return;
  const selector = params.get("probe") || ".home-bottle";
  const props = (params.get("props") || "--dock-t,translate,scale").split(",");
  const after = Number(params.get("after") || 2500);
  const round = (value) => value.replace(/-?\d+\.\d+/g, (n) => String(+(+n).toFixed(2)));
  const columns = ["ms", "scrollY", ...props, "data"];
  const rows = [];
  const probe = (window.__probe = { columns, rows, done: false });
  const t0 = performance.now();
  let started = 0;
  let last = "";

  const show = () => {
    probe.done = true;
    const pre = document.createElement("pre");
    pre.style.cssText =
      "position:fixed;z-index:2147483647;inset:60px 0 0;overflow:auto;margin:0;padding:8px;" +
      "background:#fff;color:#000;font:10px/1.3 ui-monospace,monospace;white-space:pre";
    const shown = rows.slice(0, 80).map((row) => row.join(" "));
    if (rows.length > shown.length) shown.push(`... ${rows.length - shown.length} more in window.__probe`);
    pre.textContent = [columns.join(" "), ...shown].join("\n");
    pre.addEventListener("click", () => pre.remove());
    document.body.append(pre);
  };

  const tick = () => {
    const element = document.querySelector(selector);
    if (element) {
      const style = getComputedStyle(element);
      // Read here: injected before the document exists, there is no root yet.
      const data = Object.entries(document.documentElement.dataset).map(([key, value]) => `${key}=${value}`).join(",") || "-";
      const values = props.map((prop) => round(style.getPropertyValue(prop).trim()) || "-");
      const row = [Math.round(performance.now() - t0), Math.round(scrollY), ...values, data];
      const key = JSON.stringify(row.slice(1));
      if (key !== last) {
        rows.push(row);
        last = key;
      }
      if (!started && scrollY > 0) started = performance.now();
    }
    if (started && performance.now() - started > after) show();
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
