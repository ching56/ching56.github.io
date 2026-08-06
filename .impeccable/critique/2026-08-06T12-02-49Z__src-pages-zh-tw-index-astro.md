---
target: primary zh-TW reading surfaces
total_score: 26
max_score: 28
na_heuristics: 5,9,10
p0_count: 0
p1_count: 0
timestamp: 2026-08-06T12-02-49Z
slug: src-pages-zh-tw-index-astro
---
# Post-fix Impeccable Critique — primary zh-TW reading surfaces

## Method

Independent Assessment A reviewed source and the four final desktop/mobile captures without detector access or the prior critique. Independent Assessment B ran the deterministic detector once against `src/pages/zh-TW/index.astro` and checked the final captures plus fresh production HTML/CSS without making subjective design judgments. The assessments remained isolated until this synthesis.

## Nielsen heuristic scores

| # | Heuristic | Score | Evidence / remaining gap |
|---|---|---:|---|
| 1 | Visibility of system status | 4 | The current section has a strong visual state and `aria-current`; static navigation responds immediately. |
| 2 | Match between system and the real world | 4 | Natural zh-TW labels, chronological ordering, and familiar date/link behavior. |
| 3 | User control and freedom | 3 | Signature, section tabs, and browser Back provide exits; an untranslated language tab does not fully disclose that it leads to the edition home. |
| 4 | Consistency and standards | 4 | Rules, type, tab materials, metadata, and interactions are coherent across list and article. |
| 5 | Error prevention | n/a | These reading surfaces have no editable or destructive workflow. |
| 6 | Recognition rather than recall | 4 | Destinations are visibly labeled; there is no icon-only or hidden navigation. |
| 7 | Flexibility and efficiency | 3 | Large row targets, semantic links, keyboard navigation, and deep links fit the simple reading task. |
| 8 | Aesthetic and minimalist design | 4 | Each visible element serves structure, navigation, or the desired emotional tone. |
| 9 | Error recognition and recovery | n/a | No in-surface error-producing workflow exists. |
| 10 | Help and documentation | n/a | The find/read/respond path is self-explanatory. |
| **Total** |  | **26/28** | **Excellent — 92.9%** |

## Design-specificity verdict

Strongly authored and product-specific. The restrained author signature, ruled chronological register, accession numbers, registration punch, and cobalt/citron tabs form a coherent world for this personal archive. The article body becomes intentionally quieter, while its ruled header, locale stamp, glass navigation, and response ending preserve continuity.

## Holistic assessment

- **Hierarchy and IA:** `文章` now leads, `最近更新` supports it, and the count remains tertiary. About is no longer misrepresented as a chronological post.
- **Composition and responsiveness:** The broad desktop register and narrow 70ch article serve different tasks, and both preserve hierarchy at a true 375px viewport without visible overflow.
- **Typography and color:** The system stack feels intentional through weight, tabular numerals, rhythm, and measure. Cobalt and citron remain scarce and functional.
- **Accessibility and states:** Semantic headings/list/time/nav, a skip link, visible focus, large targets, long-title protection, reduced-motion handling, forced-colors fallback, empty-state handling, and responsive reflow are present.
- **Copy and emotional journey:** Arrival feels personal, the register feels calm and scannable, reading recedes into content, and `讀完有想說的嗎？／寫信給我` turns reflection into private human contact without engagement machinery.
- **Cognitive load:** Low. The index exposes five article choices in one group, technically exceeding a four-choice checklist threshold, but their short, ordered, uniform presentation remains effortless at the current archive size.

## Strengths

1. The visual concept and IA reinforce each other: accession marks, dates, rules, and the register improve chronological browsing rather than merely decorating it.
2. The 375px layouts retain the tab silhouette, hierarchy, touch targets, and reading comfort instead of collapsing into a generic mobile stack.
3. The response ending directly serves the site's human-connection goal and uses the canonical address consistently.
4. Publication gating now keeps permanent pages and drafts out of routes, lists, translations, and feeds.

## Remaining issue

### [P2] An untranslated article's language tab overpromises continuity

On `/zh-TW/blog/2025/`, `English` resembles a same-article translation switch, but when no translation exists it leads to `/en/`. A first-time or interrupted reader can interpret the edition-home transition as lost context.

**Recommended fix:** On untranslated posts, label the destination explicitly—for example `English 首頁`—while retaining `English` when the link points to the same article in English. Mirror the rule in the opposite direction and make the accessible name equally explicit.

No P0 or P1 issues remain.

## Persona walkthroughs

- **Jordan, first-time reader:** Identifies the author and active `文章` section, scans five dated titles, opens an article, and reads without instruction. The untranslated language destination is the only misleading label.
- **Sam, keyboard/screen-reader/low-vision reader:** Can skip to main, traverse semantic navigation and the ordered list, hear meaningful title links and dates, and use visible focus. Responsive reflow supports zoom; forced-colors and reduced-motion fallbacks are present.
- **Casey, distracted mobile reader:** Gets three roomy tabs, whole-row article targets, a comfortable reading measure, and the response action near the end. The untranslated language jump is most likely to break context here.

## Minor observations

- `ZH-TW · 2026-01-01` repeats the adjacent localized date, but it contributes to the Accession Tabs identity.
- A subordinate `回到文章` link could aid continued browsing, though it should remain quieter than `寫信給我`.
- Add year grouping or another archive aid only after growth makes the current list materially harder to scan.

## Evidence result

The deterministic detector returned `[]`. Fresh production artifacts contain one rendered `李至青` identity, a semantic `文章` heading with `最近更新`, five published posts, consistent `jcli@pm.me` links, no content-page runtime script, no webfont, responsive rules at 48rem and 30rem, 44px response/footer targets, a skip link, focus-visible treatment, reduced-motion handling, and forced-colors treatment. Browser-control-dependent console and overlay checks were unavailable; four final CDP captures and fresh built HTML/CSS were used as the explicit fallback.
