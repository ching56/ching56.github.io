---
target: primary zh-TW reading surfaces
total_score: 19
max_score: 28
na_heuristics: 5,9,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-06T11-24-33Z
slug: src-pages-zh-tw-index-astro
---
Method: dual-agent (A: /root/critique_design_a · B: /root/critique_evidence_b)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3 | Active tabs and `aria-current` show section state, but article location is represented only by the generic active Posts tab. |
| 2 | Match System / Real World | 3 | Chronology and localized dates are natural; `ZH-TW · 007` is catalogue language, and `2026` appears to classify a multi-year list. |
| 3 | User Control and Freedom | 3 | The author signature and Posts tab provide exits; articles offer no previous/next path for continued reading. |
| 4 | Consistency and Standards | 2 | About exists at both `/about/` and `/blog/about/`, producing conflicting active navigation; the displayed contact addresses also disagree. |
| 5 | Error Prevention | n/a | No mutable input or destructive action exists in this Read flow. |
| 6 | Recognition Rather Than Recall | 3 | Navigation is visible and text-labeled; subscription and response options are not surfaced until the footer. |
| 7 | Flexibility and Efficiency | 2 | The archive offers one scan path, no visible feed or visited-state aid, and no previous/next reading links. |
| 8 | Aesthetic and Minimalist Design | 3 | The system is restrained and purposeful, but placeholder content and opaque catalogue metadata dilute it. |
| 9 | Error Recovery | n/a | The reviewed flow contains no user-generated error state; 404 behavior was outside scope. |
| 10 | Help and Documentation | n/a | This small static reading surface has no task complex enough to require documentation. |
| **Total** |  | **19/28** | **Acceptable, close to Good; strong presentation with material IA defects.** |

## Design Specificity Verdict

**Specific and authored, but more archive-specific than author-specific.**

**LLM assessment:** The notebook-glass tabs, cool stock, ruled register, accession marks, restrained signature, and disciplined system-font execution form a coherent world. This is clearly more distinctive than a generic minimalist blog. The caveat is that the same system could frame a library catalogue, museum collection, or changelog almost unchanged. The product's real differentiator—personal writing intended to create human connection—has almost no designed moment. `ZH-TW · 007` and the large `2026` communicate the filing metaphor more strongly than personality, invitation, or reader relationship.

**Deterministic scan:** `detect.mjs --json src/pages/zh-TW/index.astro` returned exit code 0 and `[]`: zero findings, zero rule names, and no false positives. That clean result supports the implementation's disciplined markup, but the narrow source scan does not detect cross-route content-model duplication, conflicting email addresses, misleading information hierarchy, or provisional brand copy. Those are the important findings here.

**Visual overlays:** No reliable user-visible overlay is available. The Browser connection timed out before either assessment obtained a controllable fresh tab; the in-app fallback was unavailable. Mutable injection could not be preflighted, so `detect.js` was not injected and browser visibility was not changed. Fallback evidence was the freshly generated production HTML for the index and representative article plus the responsive, reduced-motion, and forced-colors CSS.

## Overall Impression

The site has a real visual thesis and unusually good reading fundamentals for a zero-JS, system-font blog. The biggest opportunity is not more decoration. It is aligning the archive metaphor with truthful structure and designing a warm, trustworthy end-of-reading response moment so the interface serves connection rather than merely cataloguing posts.

## What's Working

1. **A recognizable world with almost no performance cost.** Tabs, rules, stock, and accession details create specificity through semantic HTML and CSS—not webfonts, image assets, or runtime JavaScript.
2. **Excellent long-form fundamentals.** The restrained title scale, localized dates, responsive single-column article, 70ch measure, and generous leading support Traditional Chinese reading.
3. **A strong accessibility baseline.** The source includes a skip link, landmarks, semantic lists and times, text-labeled navigation, visible focus, `aria-current`, reduced-motion handling, forced-colors support, responsive images, and safe code overflow.

## Priority Issues

### [P1] The public register exposes content-model residue

**Why it matters:** The list includes a chronological `關於` post while navigation links to a separate `/zh-TW/about/` route rendering the same content. The two URLs establish different current-location states. `Hello world!` reads as scaffold content and makes the site feel unfinished.

**Fix:** Separate permanent pages from posts. Exclude `about` from the chronological collection, canonicalize or redirect the duplicate blog URL, and add an explicit draft/published field so tracer content cannot reach production.

**Suggested command:** `$impeccable harden`

### [P1] The response path is weak and internally contradictory

**Why it matters:** Connection is the product's stated purpose, yet the only site-level response affordance is the one-word footer link `寄信` pointing to `jhihcing.li@gmail.com`; About publishes `jcli@pm.me`. Two addresses create hesitation precisely when trust should peak.

**Fix:** Choose one address and derive every visible mail link from the same source. Add a restrained article-end invitation such as “讀完有想說的嗎？寫信給我” in the ruled visual language. When likes ship, place the anonymous like beside this response moment.

**Suggested command:** `$impeccable clarify`

### [P2] The archive's strongest hierarchy communicates the wrong structure

**Why it matters:** `2026` dominates the index but heads posts spanning 2026 through 2022. Readers first interpret it as a year group, then must revise that understanding. `ZH-TW · 007` adds decoding without aiding orientation.

**Fix:** Group posts under truthful year headings, or make `文章` primary and label `2026` explicitly as `最近更新`. Keep the stamp only if it communicates something useful; otherwise use plain copy such as `7 篇文章`.

**Suggested command:** `$impeccable layout`

### [P2] An unapproved site title occupies persistent brand space

**Why it matters:** `The Return` appears in the shared header and document titles even though the product context marks the name unresolved. Repetition turns a placeholder into perceived commitment and competes with the otherwise well-judged author signature.

**Fix:** Settle the name before launch. Until then, use a deliberately neutral descriptor such as `李至青的部落格`, while preserving the single metadata source.

**Suggested command:** `$impeccable clarify`

## Cognitive Load and Emotional Journey

**Cognitive load: moderate, with 2 of 8 checklist failures.** Single focus, grouping, hierarchy, sequential flow, working-memory demand, and progressive disclosure are good. Chunking and minimal choices fail because seven equally weighted post links appear in one undifferentiated decision group. Top navigation presents three choices and stays within the four-item threshold. Grouping the archive by year would fix both failures and make the large year treatment truthful.

The emotional entry is calm, precise, and quietly optimistic; cobalt/citron tabs create the strongest designed moment. The journey cools when the year label stops matching the list, then dips at duplicate About content and `Hello world!`. Article reading itself is unhurried and appropriately quiet. The ending is the weakest point: prose stops, then the footer offers a terse `寄信` with no emotional bridge, while About presents a different address.

## Persona Red Flags

**Jordan, first-time reader:** Jordan reasonably reads `2026` as the group heading, then meets older dates. `關於` appears both in navigation and the register but produces different active states. `Hello world!` suggests an unfinished template. After reading, `寄信` gives no reason or reassurance to respond, and the conflicting address creates doubt.

**Sam, keyboard and screen-reader reader:** The structural baseline is strong: skip link, landmarks, semantic ordered list and `time`, labeled tabs, keyboard links, 3px focus, and no hover-only action. The register heading is announced as `文章, 2026`, repeating the misleading scope. Duplicate About routes announce different section states for identical content. Actual zoom, focus rendering, and computed contrast remain unverified because Browser control failed.

**Casey, distracted mobile reader:** Zero runtime JavaScript, system fonts, and no image dependency are ideal for a slow connection. The mobile CSS gives tabs at least 52px height and stacks metadata cleanly. Seven roughly 5.5rem rows create a long unchunked scan. At the 320px minimum, the two-column register header has a plausible compression risk that still needs a real viewport check. There is no obvious continue-reading or response panel at article end.

## Minor Observations

- The Atom feed is machine-discoverable but not reader-discoverable; a small footer subscription link would help returning readers.
- Post links have no intentional visited state, so repeat visitors cannot distinguish previously read entries.
- The article stamp duplicates the visible date in a colder format without adding reader value.
- Negative letter-spacing on large Traditional Chinese headings deserves real-device inspection; Latin headline assumptions may not transfer.
- The English tab can lead from an untranslated article to an empty edition. A clearer “English edition” or unavailable-translation cue would set expectations.
- Long titles, images, code, empty collections, reduced motion, and forced colors are handled thoughtfully in source.

## Questions to Consider

- If connection is the product's purpose, why is the invitation to respond the smallest and least expressive element?
- Is the accession system helping readers orient themselves, or asking them to admire an aesthetic fiction?
- Should `關於` be a permanent page or a chronological post? What reader need is served by making it both?
- What would remain of the site's personality if the coloured tabs disappeared—and how could more of 李至青's voice live in the reading journey itself?
