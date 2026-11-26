#!/usr/bin/env node
// Records a page's motion frame by frame in headless Chrome and prints JSON.
// It injects scripts/motion-probe.js (the same recorder `astro dev` serves
// under ?probe), so it works on any URL, production included. Desktop
// Chrome only: it cannot show iOS-only behaviour such as the toolbar
// resizing the viewport mid-scroll; use the iOS Simulator for that
// (docs/testing-motion.md).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

const HELP = `Usage: yarn motion:record <url> [options]

Opens <url> in headless Chrome, scrolls it, and prints every frame in which
the watched element changed, as JSON on stdout.

Options:
  --scroll <how>     wheel (default) | key (PageDown) | script (scrollTo) | none
  --delta <px>       wheel delta or scrollTo target (default 300)
  --selector <css>   element to watch (default .home-bottle)
  --props <a,b>      computed properties to read (default --dock-t,translate,scale)
  --after <ms>       keep recording this long after the first scroll (default 1500)
  --settle <ms>      wait after load before scrolling (default 3000)
  --width <px>       viewport width (default 1280; use 390 for a phone width)
  --height <px>      viewport height (default 900)
  --chrome <path>    Chrome binary (default: macOS Google Chrome)
  --help             show this help

Output: {"url","navigation","columns","frames":[[ms,scrollY,...props,data]],"done"}
Exit codes: 0 ok, 1 bad arguments, 2 Chrome failed, 3 nothing recorded.

Example: yarn motion:record http://localhost:4321/zh-TW/ --scroll script`;

const fail = (code, message) => {
  process.stderr.write(`${JSON.stringify({ error: message })}\n`);
  process.exit(code);
};

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      scroll: { type: "string", default: "wheel" },
      delta: { type: "string", default: "300" },
      selector: { type: "string", default: ".home-bottle" },
      props: { type: "string", default: "--dock-t,translate,scale" },
      after: { type: "string", default: "1500" },
      settle: { type: "string", default: "3000" },
      width: { type: "string", default: "1280" },
      height: { type: "string", default: "900" },
      chrome: { type: "string", default: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" },
      help: { type: "boolean", default: false },
    },
  });
} catch (error) {
  fail(1, `${error.message}. Run with --help for the options.`);
}
const { values: options, positionals } = parsed;
if (options.help) {
  console.log(HELP);
  process.exit(0);
}
if (positionals.length !== 1) fail(1, "Pass exactly one URL, e.g. http://localhost:4321/zh-TW/ (run with --help).");
if (!["wheel", "key", "script", "none"].includes(options.scroll)) fail(1, `--scroll must be wheel, key, script or none, not "${options.scroll}".`);
if (!existsSync(options.chrome)) fail(1, `No Chrome at ${options.chrome}. Pass its binary with --chrome.`);

const target = new URL(positionals[0]);
target.searchParams.set("probe", options.selector);
target.searchParams.set("props", options.props);
target.searchParams.set("after", options.after);
const delta = Number(options.delta);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const probe = readFileSync(new URL("./motion-probe.js", import.meta.url), "utf8");

const profile = mkdtempSync(join(tmpdir(), "record-motion-"));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(
  options.chrome,
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${options.width},${options.height}`, "--no-first-run", "about:blank"],
  { stdio: "ignore" },
);
const cleanup = async () => {
  chrome.kill();
  // Chrome keeps writing its profile for a moment after the kill.
  await new Promise((resolve) => (chrome.exitCode !== null ? resolve() : chrome.once("exit", resolve)));
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch {}
};

try {
  let page;
  for (let attempt = 0; attempt < 50 && !page; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      page = targets.find((candidate) => candidate.type === "page");
    } catch {}
    if (!page) await sleep(200);
  }
  if (!page) throw Object.assign(new Error("Chrome did not open a debugging port within 10s. Check --chrome, or close other headless Chrome runs."), { code: 2 });

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = () => reject(Object.assign(new Error("Could not connect to Chrome's debugging socket."), { code: 2 }));
  });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++nextId;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) =>
    (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;

  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: probe });
  await send("Page.navigate", { url: target.href });
  await sleep(Number(options.settle));

  if (options.scroll === "wheel") {
    await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 200, y: 300, deltaX: 0, deltaY: delta });
  } else if (options.scroll === "key") {
    const key = { key: "PageDown", code: "PageDown", windowsVirtualKeyCode: 34 };
    await send("Input.dispatchKeyEvent", { type: "keyDown", ...key });
    await send("Input.dispatchKeyEvent", { type: "keyUp", ...key });
  } else if (options.scroll === "script") {
    await evaluate(`scrollTo(0, ${delta})`);
  }
  await sleep(Number(options.after) + 500);

  const state = await evaluate(
    `({ href: location.href, readyState: document.readyState, probe: typeof window.__probe, rows: window.__probe?.rows.length ?? 0, element: !!document.querySelector(${JSON.stringify(options.selector)}) })`,
  );
  const result = await evaluate(
    "window.__probe && { navigation: performance.getEntriesByType('navigation')[0]?.type, columns: __probe.columns, rows: __probe.rows, done: __probe.done }",
  );
  socket.close();
  const seen = ` Page state: ${JSON.stringify(state)}.`;
  if (!result) throw Object.assign(new Error(`The probe did not run: is the URL an HTML page that finished loading? Try a longer --settle.${seen}`), { code: 3 });
  if (!result.rows.length) throw Object.assign(new Error(`No element matched ${options.selector}. Pass the element to watch with --selector.${seen}`), { code: 3 });
  console.log(JSON.stringify({ url: positionals[0], navigation: result.navigation, columns: result.columns, frames: result.rows, done: result.done }, null, 1));
} catch (error) {
  await cleanup();
  fail(error.code ?? 2, error.message);
}
await cleanup();
