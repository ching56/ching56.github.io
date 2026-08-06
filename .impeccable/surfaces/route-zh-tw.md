---
version: 1
slug: "route-zh-tw"
primary_target: "route:/zh-TW"
related_targets: ["route:/en","route:/zh-TW/blog/[slug]","route:/en/blog/[slug]"]
---

# Accession Tabs reading surfaces

- Scope: `/zh-TW/`, `/en/`, and locale articles; visitor mode is Read. The zh-TW homepage owns the About narrative and legacy About routes redirect to its `#about` anchor.
- Audience/job: zh-TW readers first, with an empty English edition ready to grow; meet the author and purpose of the writing, respond directly, then scan the chronology and read comfortably on fast or slow connections.
- Direction: approved A · Compact Register, extended with an author-first homepage passage and a frameless content rhythm. A compact familiar top bar opens into a title-free introduction and its CTA before yielding to the spacious chronological list. Three short paragraphs carry identity, subject, purpose, and audience; whitespace—not section dividers, row rules, or mini-headings—separates the passages. The confirmed site title and author signature are both `李至青`, rendered once at restrained navigation scale.
- Memorable moment: notebook tabs become restrained fictional colored glass—translucent cobalt/citron fields with layered light and subtle refraction—while staying conventional links with strong active/focus states.
- Constraints: system fonts only, no type larger than `1.5rem`, no content-section divider borders, semantic HTML/CSS, zero runtime JavaScript on content pages, real content only, accessible contrast, reduced-motion support, responsive navigation without overflow.

## Implementation-fidelity inventory

| Visible ingredient | Medium | Commitment |
| --- | --- | --- |
| Compact identity | Semantic HTML/CSS | Render the shared `李至青` site title/author signature once at navigation scale; never duplicate adjacent labels. |
| Posts/About/language tabs | Semantic links/CSS | Top-edge notebook geometry; About points to the homepage introduction, while cobalt/citron glass preserves restrained depth and clear current/focus states. |
| Homepage introduction | Content entry/semantic section/CSS | Three title-free paragraphs carry who/what/why/audience within 70ch, close with one mail CTA, and use no section-divider borders. |
| Register header | Semantic heading/CSS | The frameless header says only `文章`; dates remain with individual rows and no aggregate post count is shown. |
| Chronological rows | Ordered list/links/time | Full-width frameless rows use real titles and dates; spacing and alignment carry the scan rhythm. |
| Article reading | Article/header/content CSS | Single 65–75ch reading column; spacing, stamps, and stock surface carry through without section rules. |
| Reader response | Semantic footer/link CSS | An unbordered invitation closes each reading surface with the canonical `jcli@pm.me` mail action. |
| Paper and registration details | CSS geometry | Cool index-card field, 1px rules, sparse punches/stamps; no raster background. |
| Footer | Semantic mail link/CSS | One restrained, unbordered close showing the canonical email address from shared metadata. |
| Responsive behavior | CSS media queries | Top tabs remain obvious and horizontally safe; list dates stack cleanly on narrow screens. |
