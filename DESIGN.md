---
name: Story Journal
description: A calm, continuous storytelling journal built from cool stock, compact typography, and uninterrupted editorial flow.
colors:
  stock: "#f6f7f5"
  stock-bright: "#fcfdfb"
  ink: "#202322"
  ink-soft: "#292c2b"
  ink-muted: "#555c59"
  rule: "#b9bfbb"
  cobalt: "#4f73d9"
typography:
  display:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.5rem"
    lineHeight: 1.16
    letterSpacing: normal
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.0625rem"
    lineHeight: 1.9
  compact-body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.9375rem"
    lineHeight: 1.65
  compact-title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.2
  register-label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.02em"
  subheading:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.5rem"
    lineHeight: 1.35
  metadata:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.875rem"
    lineHeight: 1.4
  utility:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.3
  response:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.12em"
  signature:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    letterSpacing: "0.08em"
components:
  language-utility:
    typography: "{typography.utility}"
    textColor: "{colors.ink-muted}"
    fontWeight: 400
    letterSpacing: normal
    minHeight: "2.75rem"
  homepage-introduction:
    typography: "{typography.compact-body}"
  homepage-contact:
    typography: "{typography.compact-body}"
    textColor: "{colors.ink}"
    fontWeight: 400
    textDecoration: "none"
  register-header:
    typography: "{typography.register-label}"
    padding: "0 0 0.625rem"
  register-row:
    typography: "{typography.compact-title}"
    textColor: "{colors.ink-soft}"
    padding: "0.25rem 0"
  article-header:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "clamp(1.5rem, 4vw, 2.75rem) 0"
  reading-blockquote:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    padding: "1rem 1.25rem"
  reader-response:
    textColor: "{colors.ink-muted}"
    typography: "{typography.response}"
    padding: "1.5rem 0"
---

# Design System: Story Journal

## Overview

**Creative North Star: "Story Journal"**

Story Journal is a calm, interesting, wondering, modern, and quietly joyful system. It treats the homepage as one uninterrupted personal narrative: cool paper, precise alignment, restrained registration marks, and editorial whitespace carry readers from the author introduction into the chronology without app-like section controls.

The system avoids depressing or boring minimalism and avoids literal archival bureaucracy. The confirmed site title and author identity are both `李至青`, so shared chrome renders that restrained signature once. Story Journal governs the durable material, type, and uninterrupted reading rhythm; the current homepage arrangement remains specified in `.impeccable/surfaces/route-zh-tw.md`, not as a universal page template.

**Key Characteristics:**

- Cool index-stock surfaces with near-black ink and crisp spatial structure.
- One continuous homepage narrative with no Posts/About section navigation.
- System-sans typography that stays clear across Traditional Chinese and English.
- Restrained signatures, accession labels, and numeric marks instead of oversized branding.
- Flat, frameless reading surfaces whose rhythm comes from spacing rather than boxes or borders.

## Colors

The palette starts with paper, ink, and restrained registration accents. A low-opacity cobalt wash is reserved for quiet hover feedback in the chronological register.

### Accent

- **Cobalt Wash** (`#4f73d9` at 8%): A quiet focus-within or hover field for register rows; never a navigation surface or decorative block.

### Neutral

- **Cool Index Stock** (`#f6f7f5`): The default page field.
- **Bright Stock** (`#fcfdfb`): The lifted paper tone behind the ambient page wash.
- **Near-black Ink** (`#202322`): Primary copy, outlines, and focus visibility.
- **Soft Near-black Ink** (`#292c2b`): A barely lifted black reserved for homepage article-list titles.
- **Muted Graphite** (`#555c59`): Dates, stamps, secondary titles, and restrained metadata.
- **Pencil Rule** (`#b9bfbb`): The conditional identity separator in shared chrome.

### Named Rules

**The Paper, Ink, Space Rule.** Establish hierarchy with stock, ink, alignment, and whitespace before introducing an accent. Borders never separate content sections or list items.

**The Quiet Cobalt Rule.** Cobalt appears only as a low-opacity interaction wash; it never becomes a section marker, tab, or decorative confetti.

## Typography

**Display Font:** System sans (with platform-native fallbacks)
**Body Font:** System sans (with platform-native fallbacks)
**Label Font:** System sans (with platform-native fallbacks)

**Character:** One system-sans voice handles Traditional Chinese, English, titles, and metadata. Outside authored article content, hierarchy comes from optical scale, spacing, tone, tracking, and tabular numerals while every role stays at regular weight 400. Article titles, headings, and semantic `strong` text retain their native emphasis. Sustained Chinese and Chinese headlines use solid/default character spacing; short identity and metadata labels may use intentional positive tracking.

### Hierarchy

- **Display** (weight 400, `1.5rem`, line-height 1): Primary register and section headings.
- **Headline** (`1.5rem`, line-height 1.16): Balanced article titles with solid/default character spacing.
- **Title** (weight 400, `clamp(1.0625rem, 1.5vw, 1.25rem)`, line-height 1.35): Scan-friendly post and item titles.
- **Body** (`1.0625rem`, line-height 1.9): Unhurried long-form reading within a maximum 70ch measure.
- **Compact Body** (`0.9375rem`, line-height 1.65): Dense homepage introduction and its plain-text contact line.
- **Compact Title** (weight 400, `1rem`, line-height 1.2): Regular-weight homepage article links inside the dense register.
- **Register Label** (weight 400, `0.9375rem`, line-height 1.3, letter-spacing 0.02em): Reserved; the homepage register heading `文章` is now visually hidden (screen readers only).
- **Subheading** (`1.5rem`, line-height 1.35): Secondary headings inside long-form prose.
- **Metadata** (`0.875rem`, line-height 1.4): Localized dates and restrained secondary identity text.
- **Utility** (weight 400, `0.8125rem`, line-height 1.3): Compact structural metadata and other small utility copy.
- **Response** (weight 400, `0.9375rem`, line-height 1): Quiet reader-response copy and its direct mail link.
- **Label** (weight 400, `0.75rem`, letter-spacing 0.12em): Uppercase accession stamps and tabular numeric metadata.
- **Signature** (weight 400, `1.0625rem`, letter-spacing 0.08em): The author's small, regular-weight identity mark in the shared header.

### Named Rules

**The System Voice Rule.** Use the platform system sans stack only; do not introduce webfonts or simulated display personalities.

**The Restrained Signature Rule.** Keep `李至青` at utility scale, regular weight, and slightly open tracking; render the shared site-title/author identity once.

**The Compact Type Ceiling Rule.** No type exceeds `1.5rem`; use scale, spacing, tone, tracking, and column relationships to establish hierarchy outside article content.

**The Unadorned Link Rule.** Links never use underlines, including hover and focus states. Communicate interactivity through context, quiet ink shifts or row washes, and retain the global 3px keyboard-focus outline.

**The Chinese Reading Rhythm Rule.** Keep sustained zh-TW text within a 1.5–2 line-height range, use normal inter-character spacing for prose and headlines, and apply strict language-aware line breaking. Reserve positive tracking for short signatures and metadata—not reading text.

**The Regular Journal Chrome Rule.** Every role outside authored article content uses weight 400. Preserve native bold only for the article title, article subheadings, and semantic `strong` emphasis supplied by the author.

## Layout

The durable spatial grammar uses one centered shell (`min(100% - clamp(2rem, 5vw, 5rem), 82rem)`), generous fluid main padding (`clamp(3rem, 7vw, 6.75rem)`), and a long-form reading measure capped at 70ch. Above `64.0625rem`, the zh-TW homepage becomes a two-column stage: a left content column capped at 44rem and a right creative-coding region at least 18rem wide, separated only by a fluid `clamp(3rem, 7vw, 7rem)` gap. The creative region stays full-height, title-free, empty until authored, and has no divider border. At the implemented 48rem breakpoint, the shell narrows to a 1rem side gutter, the compact identity and language utility remain on one line, the creative region is absent, chronological dates move beneath titles, and article metadata becomes one column.

The zh-TW homepage opens with an unbordered, title-free author introduction aligned to the left edge of the content column. Its short paragraphs use the compact body role, carry identity, subject, purpose, and audience without mini-headings, and identify the author only as `李至青` in zh-TW. It is the garden entrance (decision 16): **bio → now → cards**, with no visible section headings. An optional `now` note (author-written `now.md`) follows the bio, and then a frameless compact list where every post is a card, ordered by its last-updated date (`updated` frontmatter, falling back to `date`) and showing that date; no growth-stage labels and no aggregate count compete with the writing. There are no top-level Posts/About links: the two passages belong to one storytelling journal. Headers, articles, response endings, and list items use space rather than divider borders. Preserve that author-first sequence and the reserved creative-coding column through the route surface brief; new surfaces inherit the system's stock, type, and continuous editorial logic without automatically inheriting the homepage topology.

**The Reading Measure Rule.** Keep sustained article prose at or below 70ch with the 1.9 long-form body line-height; the homepage introduction intentionally uses the denser compact-body rhythm.

## Elevation & Depth

Paper fields remain flat. The bright-stock radial wash provides the only ambient depth; shared chrome, the introduction, register, articles, and response endings use no component shadows or backdrop blur.

**The Flat Journal Rule.** Depth belongs to the page atmosphere, never to section containers or navigation controls.

## Shapes

The form language is open rectilinear paper. The identity, language utility, introduction, register, articles, response endings, and reserved creative-coding region remain frameless; whitespace and alignment make their relationships visible.

**The Uninterrupted Page Rule.** Do not turn passages into rounded containers, tabs, or parallel destinations when they belong to the same reading sequence.

## Components

### Homepage Introduction

A title-free, left-aligned introduction (the bio) uses a few short, author-written lines saying who the author is and what they make; since 2026-10-18 it is two lines, the greeting naming 至青 and where they live. Its body is `0.9375rem` at 1.65 line-height with `0.6em` paragraph spacing; the regular-weight opening line is `1rem` at 1.68. In zh-TW the opening names only `李至青`, without English romanization. The passage closes with a single mail link: a small stroke envelope icon (same 16-unit stroke grammar as the external-link icon, `aria-hidden`) followed by `jcli@pm.me` at ordinary content weight and with no underline; there is no prompt sentence. No header link isolates this passage from the chronology; legacy About URLs still redirect to its anchor.

### Language Utility

The shared header contains only the regular-weight `李至青` signature, set with `0.08em` tracking, and one plain-text locale switch. The utility link is `0.8125rem`, weight 400 with normal tracking, muted graphite, at least `2.75rem` high, unbordered, unfilled, and unrounded; hover strengthens it to near-black and keyboard focus retains the global 3px outline. There are no Posts/About header links.

### Register Header

The register keeps a semantic `<h1>文章</h1>` for assistive technology, but it is visually hidden. Each row shows the post's last-updated date, rows are ordered by that date, and no aggregate article count is shown. The list remains frameless.

### Register Row

Rows are semantic list items, not cards. A `1rem` regular-weight linked title at 1.2 line-height uses soft near-black `#292c2b`, a barely perceptible lift from primary ink; the `0.8125rem` muted date aligns beside it without divider rules or numeric accession indices in a 2.75rem minimum row with `0.25rem` vertical padding. Hover or focus-within introduces only an 8% cobalt wash, and the full row remains the link target. On narrow screens the row stays dense at a 3rem minimum with the same padding; the date stacks directly under the title.

### Article Header and Reading Body

Article titles sit with the published date and a regular-weight uppercase accession stamp, separated from prose by spacing rather than rules. The title, article subheadings, and semantic `strong` text are the only roles allowed to retain bold emphasis. The content column remains flat, centered, and no wider than 70ch. Blockquotes use indentation and muted ink rather than a card, quotation mark graphic, fill, or divider border.

### Reader Response

A quiet regular-weight question and direct mail link close each article after generous whitespace. The response stays inside the 70ch reading flow, derives its address from shared metadata, and never becomes a card, divider, or special control. There is no global footer contact; homepage contact appears only in the introduction, and article contact appears only in the response ending.

## Do's and Don'ts

### Do:

- **Do** use cool stock, ink, alignment, and whitespace before reaching for accent color.
- **Do** keep the shared `李至青` site title/author identity at restrained signature scale and render it once.
- **Do** let the homepage introduction and chronology read as one continuous story.
- **Do** keep the locale switch as a quiet plain-text utility with a strong keyboard focus state.
- **Do** keep links underline-free while preserving clear keyboard focus and contextual affordance.
- **Do** keep reading text in the system sans stack at a maximum 70ch measure and honor reduced motion.
- **Do** keep every type role at or below the confirmed `1.5rem` ceiling.
- **Do** keep every non-article role at regular weight 400 and let scale, tone, tracking, and space carry hierarchy.
- **Do** leave the desktop creative-coding region empty, full-height, title-free, and frameless until real work is added there.

### Don't:

- **Don't** turn the Compact Register's page topology into a mandatory layout for unrelated surfaces; its composition belongs to the route brief.
- **Don't** introduce webfonts, handwritten imitation, or display-serif personality.
- **Don't** enlarge `李至青` into a hero or duplicate it as adjacent title and author labels.
- **Don't** restore oversized display headings; hierarchy must survive within the compact type ceiling.
- **Don't** flatten the world into depressing or boring minimalism, and don't literalize it as archival bureaucracy.
- **Don't** restore Posts/About tabs, rounded navigation controls, decorative glass, or backdrop blur.
- **Don't** expand the locale utility into a second navigation system.
- **Don't** use borders to separate content sections, article rows, response endings, or the creative-coding region.
- **Don't** restore underlines on links in any interaction state.
- **Don't** introduce bold interface, metadata, navigation, register, card, CTA, or response text; reserve bold for authored article content.
- **Don't** restore a global footer email; contact belongs to the homepage introduction and article response endings.
