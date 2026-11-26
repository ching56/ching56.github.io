# Testing motion and device bugs

The bottle's dock, the cross-page morph and the other transitions take a few hundred
milliseconds. A screenshot taken after a gesture shows only where they end. These
tools record every frame as the motion runs.

## The rule

1. **Reproduce on the platform the user saw it on.** Do this before changing any code.
   If they were on an iPhone, use the iOS Simulator; desktop Chrome cannot show
   iOS-only behaviour.
2. **Record motion frame by frame on that platform.** A fix is verified only once the
   recording shows the motion is right there.
3. **If it doesn't reproduce there, say so.** Don't fix a neighbouring bug found
   elsewhere and report the original as fixed.

The lesson behind the rule (2026-11-26): the user reported that the dock stopped
animating. It was verified only in desktop headless Chrome, which keeps the viewport
height fixed. The real bug was iOS-only: Safari shrinks its toolbar while you scroll,
so `dvh` changes every frame. The bottle was sized in `dvh`, so the dock's
translate/scale target moved every frame and the transition kept restarting. The fix
was to use `svh`.

## The probe: `scripts/motion-probe.js`

A small browser-side recorder. It runs only when the page URL has `?probe`.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `probe=<selector>` | `.home-bottle` | Element to watch. |
| `props=a,b` | `--dock-t,translate,scale` | Computed properties to read. |
| `after=<ms>` | `2500` | How long to keep recording after the first scroll. |

On every animation frame it reads `scrollY`, the root's `data-*` attributes and the
props, and keeps a row whenever something changed. When it is done:

- it shows the rows as a white overlay over the page; tap the overlay to dismiss it;
- it leaves the rows on `window.__probe`.

`astro dev` injects the probe into every page (`src/lib/dev-motion-probe.mjs`).
Production builds never contain it; `tests/built-site.test.mjs` checks this.

## On an iPhone: the iOS Simulator

Mobile Safari in the Simulator reaches the dev server at `localhost`.

1. Run `yarn dev`.
2. Open `http://localhost:4321/zh-TW/?probe` in the Simulator. With the agent tool,
   that is `open_url`.
3. Scroll the way the user did, for example a swipe. The overlay appears about 2.5 s
   after the first scroll.
4. Take a screenshot and read the rows.

The Simulator has no CJK font, so Chinese text shows as `?` boxes. That doesn't matter
for motion.

## On desktop: `yarn motion:record`

Headless Chrome injects the same probe into any URL, production included, scrolls the
page and prints JSON:

```sh
yarn -s motion:record http://localhost:4321/zh-TW/ --scroll script
```

```sh
yarn -s motion:record https://jhihcing.li/zh-TW/ --width 390 --height 844
```

`--scroll` takes `wheel` (the default), `key`, `script` or `none`. Run it with
`--help` for the other options and the exit codes.

A phone width in desktop Chrome is still desktop Chrome: there is no toolbar resizing
the viewport, and no iOS compositing. Use it for logic and timing, and the Simulator
for anything iOS.

## Reading a recording

Each row is `ms scrollY props... data` (`data` is the root's `data-*` attributes, last because it is long). Healthy dock: `data` flips to
`bottle=docked`, then every prop moves together over about 450 ms, frame by frame,
and settles. Signs of trouble:

- **A prop jumps straight to its end value.** The transition never ran: check
  `bottleMotion=still`, or a transition switched on in the same frame as the change.
- **One prop lags behind the others or stalls while the finger moves.** Its target is
  moving every frame, so the transition keeps restarting. Look for viewport units that
  change while scrolling (`dvh`) or anything else scroll-dependent in its value.
- **The values come back to a previous state mid-move.** Something changed the state
  machine's state back; read the `data` column frame by frame.
