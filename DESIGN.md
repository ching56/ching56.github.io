---
name: Character Proof
description: A pottery diary typed out on white paper in one monospace cell, with black and red ribbon ink, where diary pictures are first struck as glyphs and develop into the photograph, and the bottle hero is the real photo.
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
    fontFamily: '"Bradley Hand", "Noteworthy", "Segoe Print", "Ink Free", casual, cursive'
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.2
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
  glyph-photo:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
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

The pottery diary is typed out like a proof pulled on a typewriter: pure white paper, black ink, one red ribbon, and a single monospace cell that everything sits on. Pictures are not placed, they are struck first as characters and then develop into the photograph as they scroll into view. The page never decorates; it types.

Hierarchy comes from the cell grid, not from size. Controls are struck as `[ label ]` brackets whose brackets carry the red. The dates are the only handwriting on the page. The world refuses the soft-paper journal and the photo-grid portfolio (direction contract).

**Key Characteristics:**

- Pure white paper (#ffffff) with near-black ink (#141414); red ribbon (#c4161c) is the only chromatic ink.
- One monospace stack for every typed cell; no webfonts, no `@font-face`.
- All text starts flush on the column's left edge; only control brackets hang one cell into the margin.
- Pictures exist twice: as glyph art struck from the photo, and as the photo itself, cross-developed on scroll.
- Flat everywhere: no shadows, no radii, no fills; depth is only the platen band and the lightbox veil.

## Colors

Five inks on white paper. The ribbon red is rare by design and always appears as a mark, never as a surface.

### Primary
- **Ribbon Red** (`#c4161c`): Control brackets, hover state of controls and titles, text selection background, the underline of body links, the focus outline of photo thumbnails, pressed-like-state likes count.

### Neutral
- **Struck White Paper** (`#ffffff`): Page, platen band, glyph-art backing, buttons-as-paper, lightbox (veiled at 97%).
- **Typewriter Black** (`#141414`): Body text, glyph art, bottle at rest, dashed focus outline.
- **Carbon Grey** (`#5f5f5f`): Dates, language link, muted prompts, performer lines, blockquotes, disabled control.

### Named Rules
**The Single Ribbon Rule.** Red is struck only as a mark: brackets, hover, selection, link underline. It never fills a block or sets paragraph text.

**The White Paper Rule.** The paper is pure white; do not tint it. Every veil, backing, and band uses the same paper value.

## Typography

**Display, Body and Label Font:** one monospace stack, `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono"`, then CJK fallbacks `"PingFang TC", "Noto Sans TC", "Microsoft JhengHei"`, then `monospace` (`--font-type`).
**Date Font:** the handwriting stack `"Bradley Hand", "Noteworthy", "Segoe Print", "Ink Free", casual, cursive` through `--diary-date-font`.

**Character:** A typewriter's single face, with handwriting allowed only where a person wrote the date. Weight is 400 everywhere; hierarchy is scale, muted ink, and position on the grid.

### Hierarchy
- **Display** (400, `1.5rem`, 1.3): Article title (`h1`). This is also the type ceiling.
- **Date** (handwriting, 400, `1.5rem`, 1.2, 0.02em): The diary entry date, in the feed and in the article header. The only handwriting.
- **Body** (400, `1rem`, 1.9): Long-form article prose in a 64ch column.
- **Type Cell** (400, `0.9375rem` as `--type-size`, 1.75): Feed text, intro and now note, controls, response prompts.
- **Metadata** (`0.875rem`): Generic `time`, performer line, music provider links.
- **Label** (`0.8125rem`): Language link, intro sub-headings (0.1em tracking, muted), English list dates.
- **Signature** (`0.9375rem`, 0.08em tracking): The author name beside the docked bottle.

### Named Rules
**The One Cell Rule.** Everything typed uses the single monospace stack; text widths are measured in `ch` (measures 64ch and 70ch).

**The Handwritten Date Rule.** Only dates take `--diary-date-font`. No other element may borrow it.

**The Type Ceiling Rule.** Nothing exceeds `1.5rem`.

**The No Webfont Rule.** System faces only; no `@font-face`. A test enforces this.

### Open and known gaps
- **Open decision:** the handwriting face for dates is not chosen. `--diary-date-system-font` is the placeholder stack; the user is choosing in a dev-only panel. Do not invent a face.
- **Known gap:** Chinese is not on the cell grid. CJK falls back to the platform sans, so a Chinese glyph is not an integer number of cells wide and `ch` alignment drifts. Aligning would need a Song/Ming face tuned with `size-adjust`; that is an open user decision, not a rule.

## Layout

One centered shell, `min(100% - clamp(2rem, 5vw, 5rem), 82rem)`, with main padding `clamp(3rem, 7vw, 6.75rem)`. At 48rem and below the shell narrows to `min(100% - 2rem, 42rem)` and main padding to `2rem 3.5rem`. All typed text starts flush on the column edge; there is no index gutter.

The zh-TW home is a column of the bottle hero (40dvh slot), introduction (max 70ch), now note, and the diary feed (entries 4rem apart). Above `64.0625rem` it becomes two columns, a 44rem content column and a reserved empty creative-coding region at least 18rem wide. Articles are 64ch, with the date above the title. Photos for a feed entry sit in a row below the text, `12rem` tall, wrapping by default, swiping with scroll-snap on touch, and a no-wrap row with typed `[<]` `[>]` scroll buttons where `::scroll-button` is supported with a fine pointer.

Minimum control height is `2.75rem`. English register is a plain list (see Components).

## Elevation & Depth

Flat. There are no box-shadows and no radii anywhere. The only layers are a paper-white platen band that fades in across the top 5.5rem once the home bottle has docked (so text scrolls under paper, never under the mark), and the lightbox's `rgb(255 255 255 / 97%)` backdrop.

**The Flat Paper Rule.** No shadows, glass, blur, or gradients. Depth is paper over text, nothing more.

## Shapes

Rectilinear and unframed. Brackets are the only container device: `[` and `]` characters in ribbon red. Borders are absent; the one outline vocabulary is a 1px dashed ink focus ring (offset 4px) and a 1px solid ribbon outline (offset 3px) on photo thumbnails in hover and focus. Icons are square-capped, miter-joined strokes at 0.875rem.

## Components

### Bracket Controls
Every control is struck as `[ label ]`: a 2.75rem-high inline flex, 0.5ch gap, regular-weight ink label at the type-cell size, with the brackets in ribbon red. Hover turns the label ribbon red over 120ms ease-out. Press sinks the control by 1px (`translate: 0 1px`). Applies to the response CTA (mail and Threads), the language link (muted ink, 0.8125rem), the likes button, and music provider links. Controls hang one cell into the margin (`-1ch`) so the label lands on cell zero.

### Diary Entry
A single column: the handwritten date at `1.5rem`, then typed text clamped to 10 lines. Photos are removed from the text and shown in the photo row below.

### Bottle Mark
The real bottle photo, a 21-frame turntable sprite (`src/assets/home/bottle-spin.webp`, fingerprinted by Astro), because the hero shows the potter's work. On the home page it sits pinned over a 40dvh slot; across the first 40dvh of scrolling it steps through frames, leans to -45deg, shrinks into the top-left corner, and crossfades from the photo to a solid glyph silhouette struck in `█`. That docked form is the logo on every other page. The silhouette turns ribbon red on hover. Header height is `6rem` (5rem narrow).

### Paper Platen Band
A fixed paper-white strip, 5.5rem tall, fading in over the last 10dvh of the dock (30dvh to 40dvh).

### Glyph Photo Develop
Every photo carries a build-time glyph rendering (ramp ` .:-=+*#%@`, cell aspect 0.6, 40 rows for article photos, scaled to the column by container units). As a photo row scrolls into view (view-timeline, `entry 0% cover 55%`), the glyphs fade out while the photo changes from `grayscale(1) contrast(1.3)` to its true colors.

### Lightbox
A native popover, full viewport, on a 97% white veil. A tap, Escape, or outside click closes it; the photo is contained to the viewport minus 1rem each side. The cursor is zoom-out.

### English Plain List
A grid list of 2.75rem rows: a type-cell title link, a `0.8125rem` date to the right (stacked under the title on narrow screens), the whole row the link target. Hover turns the title ribbon red. A title-less Threads post previews its text on one line with an ellipsis.

### Response Ending
One closing invitation for the bio and every article: an optional muted prompt above one bracket control. Mail uses the stroke envelope icon; external links end with the top-right arrow, which slides 2px up-right on hover.

### Motion
Every scroll-driven animation is written as longhands (`animation-name`, `animation-timing-function`, `animation-fill-mode`, `animation-timeline`, `animation-range`). The minifier folds `animation-timeline` into the `animation` shorthand and browsers reject that; a test enforces longhands. Animations are scoped to `@supports (animation-timeline: ...)` and `prefers-reduced-motion: no-preference`. With reduced motion or no support, photos show plainly (glyph art stays hidden) and the bottle shows a static first frame in its slot.

## Do's and Don'ts

### Do:
- **Do** set everything in the one monospace stack at weight 400, with hierarchy from scale, ink tone, and grid position.
- **Do** start all text flush on the column edge; entries carry no index.
- **Do** strike controls as `[ label ]` with ribbon-red brackets and a 1px press sink.
- **Do** write scroll-driven animations as longhands and gate them on `@supports` and `prefers-reduced-motion: no-preference`.
- **Do** render every article photo with a glyph twin and let the photo develop from it on scroll.
- **Do** keep zero runtime JS on content pages; only posts load the likes script.
- **Do** keep type at or below `1.5rem`.

### Don't:
- **Don't** use `--diary-date-font` for anything but dates.
- **Don't** add `@font-face` or any webfont.
- **Don't** add shadows, border radii, glass, blur, fills, or card frames.
- **Don't** fill with ribbon red or set paragraph text in it.
- **Don't** tint the paper away from pure white.
- **Don't** write `animation:` shorthand with a timeline.
- **Don't** treat the handwriting face as chosen, or Chinese as grid-aligned; both are open (see Typography).
