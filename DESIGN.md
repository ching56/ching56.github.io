---
name: Programmed Dream
description: A minimal editorial journal in warm ivory type over a nocturnal photograph that is painted live in code.
colors:
  night: "#11181c"
  ivory: "#f3e9d4"
  ivory-soft: "#d9cdb6"
  ivory-muted: "#c2b8a5"
  # Shader palette (public/night.js), sRGB approximations of the GLSL vec3 constants.
  blue: "#2b4a7d"
  cyan: "#68adc5"
  lavender: "#a5a1b2"
  rose: "#ab7496"
  vermilion: "#b23f2e"
  amber: "#c99046"
  shader-cream: "#fadead"
typography:
  signature:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    letterSpacing: "0.08em"
  greeting:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.5
  greeting-narrow:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.5
  article-title:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.5rem"
    lineHeight: 1.4
    letterSpacing: normal
  article-h2:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.375rem"
    lineHeight: 1.4
  article-h3:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.1875rem"
    lineHeight: 1.4
  list-title:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1.0625rem"
    lineHeight: 1.9
  bio:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "1rem"
    lineHeight: 1.7
  action:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1
  now-note:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.9375rem"
    lineHeight: 1.75
  metadata:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.875rem"
    lineHeight: 1.4
  utility:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1
  section-label:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif'
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0.1em"
components:
  author-signature:
    typography: "{typography.signature}"
    textColor: "{colors.ivory}"
  utility-link:
    typography: "{typography.utility}"
    textColor: "{colors.ivory-muted}"
    height: "2.75rem"
  utility-link-hover:
    textColor: "{colors.ivory}"
  post-list-item:
    typography: "{typography.list-title}"
    textColor: "{colors.ivory-soft}"
    padding: "0.5rem 0"
    height: "2.75rem"
  post-list-item-hover:
    textColor: "{colors.ivory}"
  response-cta:
    typography: "{typography.action}"
    textColor: "{colors.ivory-soft}"
    height: "2.75rem"
    padding: "0"
  response-cta-hover:
    textColor: "{colors.ivory}"
  reading-body:
    typography: "{typography.body}"
    textColor: "{colors.ivory-soft}"
  skip-link:
    textColor: "{colors.night}"
    backgroundColor: "{colors.ivory}"
    padding: "0.75rem 1rem"
---

# Design System: Programmed Dream

Programmed Dream replaced Story Journal on 2026-11-03.

## Overview

**Creative North Star: "Programmed Dream"**

A personal journal set over an evening photograph that is painted live in code, lit like magic hour. Deep ink and dusk purple are the negative space; the photograph supplies every colour, and the type is warm ivory, crisp and quiet. The site refuses the white-paper blog and the photo-hero-plus-cards template: there are no cards, borders, fills, or ornaments, so the only things on the page are text and the exposure behind it.

The photograph is a fragment shader (`public/night.js`) drawing a defocused, grain-heavy exposure with broad halation, one subject at a time, dissolving between three scenes. The home scene is lit and sits in the right half of the desktop viewport (lower right on phones, under-exposed, developing as the reader nears the end of the page). Article pages hold one dimmed still frame so nothing animates while someone reads. The shared confirmed identity is the author mark `李至青`; the page composition itself belongs to `.impeccable/surfaces/route-zh-tw.md`, not to this system.

**Key Characteristics:**

- Ink-blue dusk ground, warm ivory text in three tones, and nothing else on the page but the live scene.
- Serif for voice (greeting, titles, reading), system sans for quiet controls and dates.
- Flat and frameless: spacing and tone carry all hierarchy; text-shadow keeps ivory crisp where the exposure blooms.
- The scene is sparing with motion: 24fps, still under reduced motion, still on articles, pausable by the reader.

## Colors

Evening magic hour in the user's seven-colour palette (chosen 2026-11-03), at about 5:30 pm, with warm ivory text. The sun sits on the horizon just right of the subject and its light runs flat across the frame: a horizontal beam, faces toward it amber and vermilion with hot rims, faces turned away purple, long shadows thrown left. The text side is the dark side, deep purple falling to ink. Saturation is pushed hard (×3 after tone mapping) and the subjects are defocused until barely recognizable. Nothing goes black or flat grey. Palette colour lives only in the scene, never in interface fills.

### Neutral

- **Ink** (`#11181c`): The page ground, the theme colour, the selection text colour, and the text-shadow tint (65%). It is the shader's deepest tone; the scene never goes below it, so nothing is black.
- **Warm Ivory** (`#f3e9d4`): Primary text, hovered or focused links, the 3px focus outline, and the selection fill.
- **Soft Ivory** (`#d9cdb6`): Reading body, list titles, the bio, and call-to-action labels at rest; dates on narrow viewports and article headers.
- **Muted Ivory** (`#c2b8a5`): Locale and motion links, dates on wide viewports, performer credits, section labels, quotes, and code.

### Magic-Hour Palette (the scene in `public/night.js`)

- **Blue** (`#2b4a7d`), **Cyan** (`#68adc5`), **Lavender** (`#a5a1b2`), **Rose** (`#ab7496`), **Vermilion** (`#b23f2e`), **Amber** (`#c99046`), and the dachshund's **Cream** (`#fadead`): the scene only, written as exact 0–1 constants in `night.js`. **Purple** (`PURP`, rose and blue mixed then pushed from grey) is the shadow side. The sky runs amber at the horizon → vermilion → rose → purple overhead; away from the sun everything turns purple. A ×3 saturation lift after tone mapping keeps it vivid; dim frames (phones, articles) get a small purple ambient so they never settle on navy. They are never used for UI fills, links, borders, or text.

### Named Rules

**The Photograph Owns Colour Rule.** The interface has no accent colour. Hue comes from the scene; the interface answers with ivory in three tones.

**The Three Ivories Rule.** Hierarchy in tone is one of three: ivory (active), soft (reading and rest), muted (metadata). Hover moves a link one step up, never sideways to another hue.

## Typography

**Voice Font:** Serif stack `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Songti TC", "Noto Serif CJK TC", "Source Han Serif TC", "PMingLiU", serif`
**Interface Font:** Sans stack `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`

**Character:** A system serif carries the author's voice, the titles, and long-form reading, with Traditional Chinese falling to platform Song faces. System sans handles the small controls, dates, and the Now note. Outside authored article content every role is weight 400; hierarchy comes from scale, tone, tracking, and space. Article title, subheadings, and semantic `strong` keep their native weight.

### Hierarchy

- **Greeting** (serif, 400, `1.5rem`, 1.5; `1.375rem` at 48rem and below): The bio's first line, ivory.
- **Article Title** (serif, `1.5rem`, 1.4): The post `h1`, native weight.
- **Article H2 / H3** (serif, `1.375rem` / `1.1875rem`, 1.4): Authored subheadings, native weight, ivory.
- **List Title** (serif, 400, `1.125rem`, 1.35): Post titles and music work titles.
- **Body** (serif, `1.0625rem`, 1.9): Long-form reading in a 68ch column.
- **Bio** (serif, `1rem`, 1.7): Remaining bio paragraphs, soft ivory.
- **Signature** (serif, 400, `1.0625rem`, tracking 0.08em): The `李至青` mark in the header.
- **Action** (sans, 400, `0.9375rem`): Response CTA, like button, and the Now note (1.75 leading).
- **Metadata** (sans, `0.875rem`, tabular numerals): Dates, site title, performer, music provider links.
- **Utility** (sans, 400, `0.8125rem`): Locale link, motion toggle, list dates, Now date.
- **Section Label** (serif, 400, `0.8125rem`, tracking 0.1em): Bio sub-headings in muted ivory.

### Named Rules

**The System Voice Rule.** System font stacks only; no webfonts.

**The Compact Type Ceiling Rule.** Nothing exceeds `1.5rem`.

**The Regular Chrome Rule.** Every role outside authored article content (article title, subheadings, `strong`) is weight 400.

**The Unadorned Link Rule.** Links never use underlines in any state. Interactivity is a one-step tone shift toward ivory, and keyboard focus is the global 3px ivory outline with a 4px offset.

**The Chinese Reading Rhythm Rule.** Sustained zh-TW text keeps 1.5 to 1.9 line-height, normal tracking, and strict line breaking; positive tracking is only for the signature and section labels.

## Layout

One centered shell, `min(100% - clamp(2rem, 6vw, 6rem), 84rem)`, with a 5.5rem header (4.5rem on narrow) and generous fluid main padding. The home flow is bio, then the optional Now note, then the post list, separated by `clamp(4.5rem, 10vw, 8.5rem)` of space (4rem on narrow). Above `64.0625rem` the home becomes a two-column stage: a `34rem` text column left and an empty creative-coding region right at least `18rem` wide, where the scene's subject sits. At 64rem and below the text spans the width and scrolls over the fixed scene, so dates step up to soft ivory for contrast. At 48rem and below the shell gutter is 1rem, list rows stack the date under the title (3rem minimum), and the greeting drops to `1.375rem`. Articles centre a `68ch` column. Every tap target is at least `2.75rem` high.

**The Reading Measure Rule.** Article prose stays at or below 68ch at 1.9 line-height.

**The Scene Sits Behind Rule.** The canvas is fixed at `100lvh`, `z-index: -1`, aria-hidden, and non-interactive. It fades in over 2800ms once its first frame is drawn; text never moves to make room for it.

## Elevation & Depth

Flat. There are no component shadows, fills, or blur. Depth is the photograph behind the text. The only shadow is a `0 1px 2px` ink text-shadow at 65% on the body, which keeps ivory crisp over bright halation (removed on selection and on the skip link).

**The Flat Page Rule.** Depth belongs to the scene, never to containers or controls.

## Shapes

Open and rectilinear. Nothing is boxed, rounded, filled, or bordered: list rows, bio, header, articles, and endings are frameless, and relationships come from alignment and space. Blockquote and code are set apart only by a `1.5rem` indent (1rem on narrow) and muted ivory. Icons are 14px square-capped, mitered, 1.4 stroke outlines.

**The No Border Rule.** Borders and fills never separate sections, rows, or endings.

## Components

### Header

A serif `李至青` signature at left, an optional muted site title, and at right a plain-text motion toggle (home only, hidden until the scene can animate) and locale link. Both are `0.8125rem` muted ivory, 2.75rem high, unframed, brightening to ivory on hover with a 240ms ease.

### Motion Toggle

A text button labelled pause or play that freezes the scene where it stands and remembers the choice in local storage. The scene also holds still under reduced motion and on articles. Capture hook: `?frame=<seconds>` freezes one moment. The scene renders at 24fps and recovers from WebGL context loss.

### Post List

Frameless rows: a serif `1.125rem` soft ivory title and a `0.8125rem` date, baseline-aligned, 2.75rem minimum. The whole row is the link target. Hover or focus-within lifts the title to ivory and the date to soft ivory.

### Bio and Now Note

The bio is a 34rem serif column: a `1.5rem` ivory greeting, `1rem` soft ivory paragraphs, muted `0.8125rem` sub-headings, then a Response Ending. The Now note is a sans `0.9375rem` soft ivory block and is hidden when empty.

### Reading Article

A 68ch column: serif title, ivory date, optional music link card (serif work title, muted performer, provider links with the external arrow), and soft ivory serif body. Strong text and body links are ivory. Media stays within the column, and video within 85svh. The like button is a text-and-count action with no frame, and it dims to 55% while sending.

### Response Ending

One component (`ResponseEnding.astro`) closes the bio and every article, with no prompt and no frame: an ivory-toned label, 2.75rem high, with its icon. Mail endings lead with a stroke envelope that nudges 2px left on hover. External endings end with the arrow icon, which slides 2px up-right on hover.

**The External Arrow Rule.** Every link that leaves the site ends with the same top-right arrow icon (`M4.5 11.5 11.5 4.5M5.5 4.5h6v6`, 16-unit grid, 1.4 stroke), opens in a new tab, and carries a visually hidden new-tab note. Internal and mail links never use it.

## Do's and Don'ts

### Do:

- **Do** set text in the three ivories on the ink-blue ground and let the photograph supply all colour.
- **Do** use system font stacks only: the serif for voice and reading, the sans for quiet controls.
- **Do** keep every type role at or below `1.5rem`, and every role at weight 400 except authored article title, subheadings, and `strong`.
- **Do** keep links underline-free with a visible 3px ivory focus outline.
- **Do** keep sections frameless and separate them with space.
- **Do** keep the scene still on articles, under reduced motion, and when the reader has paused it.
- **Do** end the bio and every article with the prompt-free Response Ending.

### Don't:

- **Don't** use shader hues as interface colour (links, fills, borders, text).
- **Don't** add cards, borders, fills, rounded containers, or ornaments.
- **Don't** introduce webfonts or oversized display type.
- **Don't** underline links in any state.
- **Don't** add bold to interface, metadata, list, or CTA text.
- **Don't** place a prompt above the Response Ending.
- **Don't** let the scene carry text, controls, or meaning; it is aria-hidden atmosphere.
