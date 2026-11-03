---
version: 1
slug: "route-zh-tw"
primary_target: "route:/zh-TW"
related_targets: ["route:/en","route:/zh-TW/blog/[slug]","route:/en/blog/[slug]"]
---

# Programmed Dream reading surfaces

- Scope: `/zh-TW/`, `/en/`, and locale articles; visitor mode is Read. The zh-TW homepage owns the About narrative (bio → now → cards, no visible headings); legacy About routes redirect to its `#about` anchor.
- Audience/job: zh-TW readers first, often on phones; meet the author in one line, glimpse what their life is made of, pick a piece, and read comfortably; respond by mail or on Threads.
- Direction: user-pinned brief (2026-11-03), named **Programmed Dream** by the user. A minimal editorial site over a nocturnal photograph that is painted live in code (`public/night.js`, one WebGL fragment shader): extreme defocus, dense multicolored grain, uneven exposure, broad halation; cyan bleeds through dusty rose and lavender into amber and vermilion, dissolving into deep navy. The scene dissolves between three barely recognizable subjects: a cream dachshund, a playing radio, a turning pottery wheel. Crisp warm ivory type over it: system serif for the masthead, bio, titles, and headings; quiet system sans for the language link, dates, endings, and article body.
- Memorable moment: the photograph develops in on load, and every dissolve breathes the lens out of focus before the next subject surfaces.
- Motion control: homepages show a quiet sans 「暫停」/「播放」 (Pause/Play) toggle beside the language link; it freezes the current frame and persists in localStorage. Hidden under reduced motion, on articles (already still), and without WebGL.
- Composition: desktop homepage puts the subject in the reserved right column (`data-creative-coding-area`) and keeps the text column over dark negative space; phones and tablets sink the subject into the bottom quarter at exposure 0.22, developing to 0.40 as the reader scrolls to the end; articles dim the scene to a faint haze far right.
- Constraints: system fonts only, no type above `1.5rem`, weight 400 outside authored article content, underline-free links with the 3px focus outline, no cards, borders, fills, decorative graphics, CSS gradients, or explanatory copy (endings are an icon plus a label, no prompt line). Runtime JS is limited to `night.js` (every page) and `likes.js` (articles). Reduced motion gets one still frame; no WebGL leaves the deep navy ground. `?frame=<seconds>` freezes the scene for captures.
- Unresolved: none.
