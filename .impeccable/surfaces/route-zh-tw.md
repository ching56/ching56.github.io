---
version: 1
slug: "route-zh-tw"
primary_target: "route:/zh-TW"
related_targets: ["route:/en","route:/zh-TW/blog/[slug]","route:/en/blog/[slug]"]
---

# Story Journal reading surfaces

- Scope: `/zh-TW/`, `/en/`, and locale articles; visitor mode is Read. The zh-TW homepage owns the About narrative and legacy About routes redirect to its `#about` anchor.
- Audience/job: zh-TW readers first, with an empty English edition ready to grow; meet the author and purpose of the writing, respond directly, then scan the chronology and read comfortably on fast or slow connections.
- Direction: approved A · Compact Register, extended into one author-first storytelling journal with a frameless content rhythm. A compact identity and plain language utility open directly into the title-free introduction and its CTA, which then flows into the chronological list. Three short paragraphs carry identity, subject, purpose, and audience; whitespace—not section navigation, dividers, row rules, or mini-headings—separates the passages. The confirmed site title and author signature are both `李至青`, rendered once at restrained utility scale.
- Memorable moment: the author introduction and chronological register read as one uninterrupted personal journal, while the empty desktop creative-coding field leaves room for a future authored counterpoint.
- Constraints: system fonts only, no type larger than `1.5rem`, regular weight for every non-article role, semantic bold permitted only inside authored article content, no Posts/About header links, no tab or glass treatment, no content-section divider borders, semantic HTML/CSS, zero runtime JavaScript on content pages, real content only, accessible contrast, reduced-motion support, and a responsive plain-text language utility.

## Implementation-fidelity inventory

| Visible ingredient | Medium | Commitment |
| --- | --- | --- |
| Compact identity | Semantic HTML/CSS | Render the shared `李至青` site title/author signature once at regular weight with slightly open tracking; never duplicate adjacent labels or make the name bold. |
| Shared header | Semantic links/CSS | Render `李至青` once beside a plain-text language switch; never restore Posts/About tabs, filled controls, rounded tab geometry, decorative blur, or glass depth. |
| Homepage introduction | Content entry/semantic section/CSS | Three title-free, regular-weight paragraphs carry who/what/why/audience within 70ch, close with the shared Response Ending (prompt-free outline CTA: envelope icon + `jcli@pm.me`), and use no section-divider borders; the opening sentence is not bold. |
| Register header | Semantic heading/CSS | The `文章` heading is visually hidden (no visible section headings); rows are ordered by and show their last-updated date, and no aggregate post count is shown. |
| Chronological rows | Ordered list/links/time | Dense full-width frameless rows use regular-weight titles in barely lifted near-black `#292c2b` and muted dates with no numeric accession index; compact leading and padding accelerate scanning while the full row remains the link target. |
| Article reading | Article/header/content CSS | Single 65–75ch reading column; spacing, stamps, and stock surface carry through without section rules. |
| Music citation | Semantic aside/list/external links/CSS | When present, place one quiet text-only citation between article metadata and body: show work and performer, then verified Apple Music → Spotify → YouTube links with missing providers omitted, new-tab external-link cues, and no artwork, player, scripts, or provider brand color. |
| Reader response | `ResponseEnding` footer/link CSS | A left-aligned muted prompt above a square thin-outline CTA (hover: ink border + 8% cobalt wash). Mail CTAs lead with the envelope; the Threads CTA ends with the top-right arrow and opens a new tab. |
| Paper and registration details | CSS geometry | Cool index-card field, ambient stock wash, and sparse accession marks; no raster background or decorative component depth. |
| Footer | Response Ending | The same component closes the homepage bio and every article; there is no separate global footer. |
| Responsive behavior | CSS media queries | Identity and the plain language utility remain on one compact line; list dates stack cleanly on narrow screens. |
