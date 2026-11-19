---
version: 1
slug: "route-zh-tw"
primary_target: "route:/zh-TW"
related_targets: ["route:/en","route:/zh-TW/blog/[slug]","route:/en/blog/[slug]"]
---

# Character Proof reading surfaces

- Scope: `/zh-TW/`, `/en/`, and locale articles. Visitor mode is Experience on the zh-TW homepage (the diary itself leads) and Read on articles.
- Audience/job: zh-TW friends and pottery-curious readers, mostly on phones. They meet the potter in one greeting, follow the making of each piece, look at the work, and respond on Threads or by mail.
- Direction: typewriter character art on white paper, fused with the user-pinned "grid alignment, numbered steps, the diary as the process of making the pot". Contract seed `9062ef67`. Later trimmed by the user: no carriage scale, no step numbers, and the hero bottle is the real photo.
- Memorable moment: the bottle photo turns, leans and is struck into a glyph silhouette as the home mark as you scroll. Each photo row arrives as typed glyphs and develops into the photograph.
- Must survive any later refinement: the bottle hero→logo, and the diary-feed form (handwritten dates, 10-line clamp, swipe/arrow/wrap photo row, popover lightbox).
- Constraints:
  - system fonts only, with no @font-face; type ≤ 1.5rem; weight 400 outside authored content
  - zero runtime JS on content pages
  - diary pictures are rendered to glyphs at build time; the bottle hero stays the real photo (it shows the work)
  - every scroll-driven animation is written as longhands, because the minifier folds timelines into the shorthand
  - reduced-motion and no-support fallbacks show the photos
- Unresolved:
  - Chinese text is not on the mono cell grid; a Song/Ming face with size-adjust is offered and awaits the user
  - the handwritten date face is pending
  - the desktop right column is still empty
