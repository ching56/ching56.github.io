---
name: Character Proof
description: A pottery diary typed out on white paper in one monospace cell, with black and red ribbon ink, plain photographs, and the real bottle photo as the hero, turning as the page scrolls.
colors:
  paper: "#ffffff"
  ink: "#141414"
  ink-muted: "#5f5f5f"
  ribbon: "#c4161c"
typography:
  display:
    fontFamily: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace'
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  date:
    fontFamily: '{typography.type-cell.fontFamily}'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.9
  type-cell:
    fontFamily: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  metadata:
    fontFamily: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace'
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0.1em"
  signature:
    fontFamily: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace'
    fontSize: "0.9375rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded: {}
spacing:
  control-height: "2.75rem"
  diary-gap: "4rem"
components:
  bracket-control:
    textColor: "{colors.ink}"
    typography: "{typography.type-cell}"
    height: "2.75rem"
    padding: "0"
  bracket-control-hover:
    textColor: "{colors.ribbon}"
  language-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    height: "2.75rem"
  diary-date:
    textColor: "{colors.ink}"
    typography: "{typography.date}"
  diary-text:
    textColor: "{colors.ink}"
    typography: "{typography.type-cell}"
  post-body:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  lightbox:
    backgroundColor: "{colors.paper}"
  bottle:
    textColor: "{colors.ink}"
  bottle-hover:
    textColor: "{colors.ribbon}"
  post-list-item:
    textColor: "{colors.ink}"
    typography: "{typography.type-cell}"
    height: "2.75rem"
---

# Design System: Character Proof

## Overview

**Creative North Star: "Character Proof"**

The pottery diary is typed out like a proof pulled on a typewriter onto white paper, black ink, one red ribbon, and a single monospace cell that everything sits on. Photographs are shown plainly; the type does the shaping. The page never decorates; it types.

Hierarchy comes from the cell grid, not from size. Controls and dates are struck as `[ label ]` brackets whose brackets carry the red. The world refuses the soft-paper journal and the photo-grid portfolio (direction contract).

**Key Characteristics:**

- White paper (#ffffff) with near-black ink (#141414); red ribbon (#c4161c) is the only chromatic ink. A notebook ruling exists but is switched off.
- One monospace stack for every typed cell, dates included; no webfonts.
- All text starts flush on the column's left edge; only control brackets hang one cell into the margin.
- Photographs appear as they are; the only image treatment is the bottle hero turning on its turntable as the page scrolls.
- Flat everywhere: no shadows, no radii, no fills; depth is only the lightbox veil.

## Colors

Five inks on white paper. The ribbon red is rare by design and always appears as a mark, never as a surface.

### Primary
- **Ribbon Red** (`#c4161c`): Control brackets, hover state of controls and titles, text selection background, the underline of body links, the focus outline of photo thumbnails, pressed-like-state likes count.

### Neutral
- **Paper** (`#ffffff`): Page, buttons-as-paper, the back-to-top backing, lightbox (veiled at 97%).
- **Grid Rule** (off): the notebook ruling (`.site-shell::before`: horizontal rules through, verticals stopping short of each crossing, right-margin marks every second rule and a dot every tenth) is switched off by the user (`--grid-cell` and `--grid-edge` none, `--grid-line` transparent); `--grid` stays 10px and still rounds the shell. The dev panel's 格線 tab brings it back.
- **Typewriter Black** (`#141414`): Body text, the bottle silhouette, dashed focus outline.
- **Carbon Grey** (`#5f5f5f`): Dates, language link, muted prompts, performer lines, blockquotes, disabled control.

### Named Rules
**The Single Ribbon Rule.** Red is struck only as a mark: brackets, hover, selection, link underline. It never fills a block or sets paragraph text.

**The Paper Rule.** The page is plain white paper. The shell is a whole number of `--grid` cells wide (`round(down, …, var(--grid))`), so a ruling, when switched on, starts and ends on the text column's edges. Every veil and backing uses the same paper value.

## Typography

**Display, Body and Label Font:** one monospace stack, `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono"`, then CJK fallbacks `"PingFang TC", "Noto Sans TC", "Microsoft JhengHei"`, then `monospace` (`--font-type`).
**Date Font:** the same monospace stack; dates are typed, not handwritten (Nanum Pen Script was used briefly and retired).

**Character:** A typewriter's single face for everything, dates included. Weight is 400 everywhere; hierarchy is scale, muted ink, and position on the grid.

### Hierarchy
- **Display** (400, `1.5rem`, 1.3): Article title (`h1`). This is also the type ceiling.
- **Date** (400, `0.9375rem`, 1): The diary entry date, in the feed and in the article header, struck as `[ 2026/11/12 ]` with ribbon brackets, its `[` on the text's left edge.
- **Body** (400, `1rem`, 1.9): Long-form article prose in a 64ch column.
- **Type Cell** (400, `0.9375rem` as `--type-size`, 1.75): Feed text, intro and now note, controls, response prompts.
- **Metadata** (`0.875rem`): Generic `time`, performer line, music provider links.
- **Label** (`0.8125rem`): Language link, intro sub-headings (0.1em tracking, muted), English list dates.
- **Signature** (`0.9375rem`, 0.08em tracking): The author name beside the article-header logo.

### Named Rules
**The One Cell Rule.** Everything typed uses the single monospace stack; text widths are measured in `ch` (measures 64ch and 70ch).

**The Type Ceiling Rule.** Nothing exceeds `1.5rem`.

**The No Webfont Rule.** System faces only; no `@font-face`. A test enforces it.

### Open and known gaps
- **Known gap:** Chinese is not on the cell grid. CJK falls back to the platform sans, so a Chinese glyph is not an integer number of cells wide and `ch` alignment drifts. Aligning would need a Song/Ming face tuned with `size-adjust`; that is an open user decision, not a rule.

## Layout

One centered shell, `min(100% - clamp(2rem, 5vw, 5rem), 82rem)`, with main padding `clamp(3rem, 7vw, 6.75rem)`. At 48rem and below the shell narrows to `min(100% - 2rem, 42rem)` and main padding to `2rem 3.5rem`. All typed text starts flush on the column edge; there is no index gutter.

The zh-TW home opens on a one-row hero (the bottle on the left, the greeting beside it at max 30ch), then the now note and the diary feed (entries 4rem apart). Above `64.0625rem` it becomes two columns, a 44rem content column and a reserved empty creative-coding region at least 18rem wide. Articles are 64ch, with the date above the title. Photos for a feed entry sit in a row below the text, `12rem` tall, wrapping by default, swiping with scroll-snap on touch, and a no-wrap row with typed `[<]` `[>]` scroll buttons where `::scroll-button` is supported with a fine pointer.

Minimum control height is `2.75rem`. English register is a plain list (see Components).

## Elevation & Depth

Flat. There are no box-shadows. The only layers are the back-to-top control's paper backing and the lightbox's paper backdrop at 97%.

**The Flat Paper Rule.** No shadows, glass, blur, or gradients. Depth is paper over text, nothing more.

## Shapes

Rectilinear and unframed. Brackets are the only container device: `[` and `]` characters in ribbon red. Borders are absent; the one outline vocabulary is a 1px dashed ink focus ring (offset 4px) and a 1px solid ribbon outline (offset 3px) on photo thumbnails in hover and focus. Icons are square-capped, miter-joined strokes at 0.875rem.

## Components

### Bracket Controls
Every control is struck as `[ label ]`: a 2.75rem-high inline flex, 0.5ch gap, regular-weight ink label at the type-cell size, with the brackets in ribbon red. Hover turns the label ribbon red over 120ms ease-out. Press sinks the control by 1px (`translate: 0 1px`). Applies to the response CTA (mail and Threads), the language link (muted ink, 0.8125rem), the likes button, and music provider links. Controls hang one cell into the margin (`-1ch`) so the label lands on cell zero.

### Diary Entry
A single column: the bracketed date, then typed text clamped to 10 lines. Photos are removed from the text and shown in the photo row below.

### Bottle Mark
The real bottle photo, because the hero shows the potter's work: 21-frame turntable sprites sized for the small resting bottle (`src/assets/home/bottle-spin.webp`, 264×653 frames, about 460 KB, for wide screens; `bottle-spin-small.webp`, 158×392 frames, about 180 KB, for 48rem and below; CSS picks one through `--sprite`, so each screen fetches only its own) and a still of the first frame (`bottle-still.webp`, srcset 160/264/400w, sizes from the bottle's rendered width, fetched first), both rebuilt from the untracked `photo/cutout/` by `scripts/build-bottle-assets.mjs`. On the home page it stands in one row with the greeting: a smaller bottle at the shell's left edge (36dvh tall at 12dvh from the top; at 48rem and below 16dvh at 3dvh, 5% in, leaning -21deg via `--bottle-rotate`, 76px gap, greeting aligned to the bottle's foot via `--greeting-align: end`), the greeting padded to start just past it and centred on its height; all tuned with the dev-only `BottlePositionPanel`. It no longer docks into a header logo (the user removed that for now): the bottle stays in the hero and turns once on its turntable as the reader scrolls it away, the frame scrubbed by `scroll(root)` from the top of the page to the bottle's bottom edge (`steps(21, jump-none)`); the still gives way to the sprite at the first step. The sprite is referenced only after an inline loader sets `html[data-spin="ready"]`; without it, and under reduced motion, the still simply stays. The article header's logo is the bottle's silhouette, masked by a 2 KB last-frame outline (`bottle-mark.webp`), turning ribbon red on hover. Header height is `6rem` (5rem narrow).

### Logo Variables
`--logo-width` (22px; height follows the 396:980 frame) and `--logo-rotate` (-3deg) on `:root` size and lean the article-header logo. `--logo-top`/`--logo-left` are left from the removed home dock.

### Back to Top
A typed `[ ↑ ]` (bracket control, localised `aria-label`, `href="#top"`) fixed bottom-right on a sliver of paper, aligned to the shell's right edge. A scroll-driven animation fades it in over 80–100dvh of scroll, so it appears only a screen down and never on short pages; the page glides up unless the reader prefers reduced motion.

### Lightbox
A native popover, full viewport, on a 97% paper veil. A tap, Escape, or outside click closes it; the photo is contained to the viewport minus 1rem each side. The cursor is zoom-out. Opens in 200ms from scale 0.95 with a fade on `cubic-bezier(0.23, 1, 0.32, 1)` (`@starting-style`, `display`/`overlay` allow-discrete), closes faster in 150ms; reduced motion keeps only the fade.

### English Plain List
A grid list of 2.75rem rows: a type-cell title link, a `0.8125rem` date to the right (stacked under the title on narrow screens), the whole row the link target. Hover turns the title ribbon red. A title-less Threads post previews its text on one line with an ellipsis.

### Response Ending
One closing invitation for the bio and every article: an optional muted prompt above one bracket control. Mail uses the stroke envelope icon; external links end with the top-right arrow, which slides 2px up-right on hover.

### Motion
Every scroll-driven animation is written as longhands (`animation-name`, `animation-timing-function`, `animation-fill-mode`, `animation-timeline`, `animation-range`). The minifier folds `animation-timeline` into the `animation` shorthand and browsers reject that; a test enforces longhands. Animations are scoped to `@supports (animation-timeline: ...)` and `prefers-reduced-motion: no-preference`. With reduced motion or no support, photos show plainly (glyph art stays hidden) and the bottle shows a static first frame in its slot.

## Do's and Don'ts

### Do:
- **Do** gate every `:hover` style behind `@media (hover: hover) and (pointer: fine)`, so taps never leave sticky hover colours.
- **Do** set everything in the one monospace stack at weight 400, with hierarchy from scale, ink tone, and grid position.
- **Do** start all text flush on the column edge; entries carry no index.
- **Do** strike controls as `[ label ]` with ribbon-red brackets and a 1px press sink.
- **Do** write scroll-driven animations as longhands and gate them on `@supports` and `prefers-reduced-motion: no-preference`.
- **Do** keep runtime JS off content pages, with two exceptions: posts load the likes script, and the zh-TW home has a sub-2 KB inline loader that fetches the bottle's turntable sprite after the still and enables the turn (`html[data-spin="ready"]`) only once it has loaded; on Save-Data, 2G, after 8s or without JS the bottle stays still.
- **Do** keep type at or below `1.5rem`.

### Don't:
- **Don't** add `@font-face` or any webfont; Chinese webfonts are megabytes.
- **Don't** add shadows, border radii, glass, blur, fills, or card frames.
- **Don't** fill with ribbon red or set paragraph text in it.
- **Don't** draw a ruling outside the shell or change `--grid` without the shell rounding to match.
- **Don't** write `animation:` shorthand with a timeline.
- **Don't** treat Chinese as grid-aligned; that is open (see Typography).
