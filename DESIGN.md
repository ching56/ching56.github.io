---
name: Accession Tabs
description: A calm, quietly joyful reading system built from cool stock, precise spacing, and translucent notebook-glass navigation.
colors:
  stock: "#f6f7f5"
  stock-bright: "#fcfdfb"
  ink: "#202322"
  ink-muted: "#555c59"
  rule: "#b9bfbb"
  rule-strong: "#777f7b"
  cobalt: "#4f73d9"
  cobalt-deep: "#294daf"
  cobalt-ink: "#14204a"
  citron: "#d8e54a"
  citron-deep: "#b9c528"
  citron-ink: "#202300"
typography:
  display:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 710
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.5rem"
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)"
    fontWeight: 560
    lineHeight: 1.35
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.0625rem"
    lineHeight: 1.9
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
    fontWeight: 650
    lineHeight: 1.3
  navigation:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 610
    lineHeight: 1
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 650
    letterSpacing: "0.12em"
  signature:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 630
    letterSpacing: "0.04em"
rounded:
  tab-top: "0.75rem 0.75rem 0 0"
components:
  glass-tab:
    typography: "{typography.navigation}"
    rounded: "{rounded.tab-top}"
    padding: "0.85rem 1.25rem 0.75rem"
  glass-tab-cobalt:
    backgroundColor: "rgb(79 115 217 / 42%)"
    textColor: "#14204a"
  glass-tab-cobalt-active:
    backgroundColor: "rgb(41 77 175 / 90%)"
    textColor: "#fff"
  glass-tab-citron:
    backgroundColor: "rgb(216 229 74 / 58%)"
    textColor: "#252800"
  glass-tab-citron-active:
    backgroundColor: "rgb(197 211 39 / 92%)"
    textColor: "#202300"
  glass-tab-clear:
    backgroundColor: "rgb(255 255 255 / 62%)"
    textColor: "{colors.ink}"
  homepage-introduction:
    typography: "{typography.body}"
  register-header:
    typography: "{typography.display}"
    padding: "0 0 1.25rem"
  register-row:
    typography: "{typography.title}"
    padding: "1rem 0"
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
    typography: "{typography.navigation}"
    padding: "1.5rem 0"
  site-footer:
    textColor: "{colors.ink-muted}"
    typography: "{typography.utility}"
    padding: "1.5rem 0 2rem"
---

# Design System: Accession Tabs

## Overview

**Creative North Star: "Accession Tabs"**

Accession Tabs is a calm, interesting, wondering, modern, and quietly joyful system. It borrows the memory of notebook tabs and index stock, then translates them into modern web materials: cool paper, precise alignment, restrained registration marks, and fictional translucent cobalt/citron glass.

The system avoids depressing or boring minimalism and avoids literal archival bureaucracy. The confirmed site title and author identity are both `李至青`, so shared chrome renders that restrained signature once. Accession Tabs governs the durable material, type, and interaction language; the Compact Register arrangement is the composition for the current reading routes and remains specified in `.impeccable/surfaces/route-zh-tw.md`, not as a universal page template.

**Key Characteristics:**

- Cool index-stock surfaces with near-black ink and crisp spatial structure.
- Translucent cobalt and citron glass reserved for familiar, functional navigation.
- System-sans typography that stays clear across Traditional Chinese and English.
- Restrained signatures, accession labels, and numeric marks instead of oversized branding.
- Flat reading surfaces with selective, technically precise depth at interactive glass edges.

## Colors

The palette starts with paper, ink, and restrained registration accents; cobalt and citron provide the quietly joyful interactive voice.

### Primary

- **Cobalt Glass** (`#4f73d9`): The clear blue identity of the primary navigation family and translucent resting states.
- **Deep Cobalt** (`#294daf`): The denser active-state anchor beneath cobalt glass.
- **Cobalt Ink** (`#14204a`): Hue-aligned text on resting cobalt glass.

### Secondary

- **Citron Glass** (`#d8e54a`): The bright, curious counterpoint used by the secondary navigation family.
- **Deep Citron** (`#b9c528`): The grounded citron endpoint for state depth.
- **Citron Ink** (`#202300`): Hue-aligned text on active citron glass.

### Neutral

- **Cool Index Stock** (`#f6f7f5`): The default page field.
- **Bright Stock** (`#fcfdfb`): The lifted paper tone behind the ambient page wash and translucent navigation.
- **Near-black Ink** (`#202322`): Primary copy, outlines, and focus visibility.
- **Muted Graphite** (`#555c59`): Dates, stamps, secondary titles, and restrained metadata.
- **Pencil Rule** (`#b9bfbb`): The conditional identity separator in shared chrome.
- **Registration Rule** (`#777f7b`): The stronger bottom edge of bordered glass controls.

### Named Rules

**The Paper, Ink, Space Rule.** Establish hierarchy with stock, ink, alignment, and whitespace before introducing an accent. Borders are reserved for controls, not for separating content sections or list items.

**The Two Glass Accents Rule.** Cobalt and citron belong to meaningful navigation and state, never to scattered decorative confetti.

## Typography

**Display Font:** System sans (with platform-native fallbacks)
**Body Font:** System sans (with platform-native fallbacks)
**Label Font:** System sans (with platform-native fallbacks)

**Character:** One system-sans voice handles Traditional Chinese, English, titles, and metadata. Hierarchy comes from weight, optical scale, spacing, and tabular numerals rather than downloaded or theatrical type.

### Hierarchy

- **Display** (weight 710, `1.5rem`, line-height 1): Primary register and section headings.
- **Headline** (`1.5rem`, line-height 1.16): Balanced article titles with tight negative tracking.
- **Title** (weight 560, `clamp(1.0625rem, 1.5vw, 1.25rem)`, line-height 1.35): Scan-friendly post and item titles.
- **Body** (`1.0625rem`, line-height 1.9): Unhurried long-form reading within a maximum 70ch measure.
- **Subheading** (`1.5rem`, line-height 1.35): Secondary headings inside long-form prose.
- **Metadata** (`0.875rem`, line-height 1.4): Localized dates and restrained secondary identity text.
- **Utility** (weight 650, `0.8125rem`, line-height 1.3): Footer copy and compact structural metadata.
- **Navigation** (weight 610, `0.9375rem`, line-height 1): Familiar top-tab labels with compact authority.
- **Label** (weight 650, `0.75rem`, letter-spacing 0.12em): Uppercase accession stamps and tabular numeric metadata.
- **Signature** (weight 630, `1.0625rem`, letter-spacing 0.04em): The author's small identity mark in the shared header.

### Named Rules

**The System Voice Rule.** Use the platform system sans stack only; do not introduce webfonts or simulated display personalities.

**The Restrained Signature Rule.** Keep `李至青` at navigation scale and render the shared site-title/author identity once.

**The Compact Type Ceiling Rule.** No type exceeds `1.5rem`; use weight, spacing, and column relationships to establish hierarchy.

## Layout

The durable spatial grammar uses one centered shell (`min(100% - clamp(2rem, 5vw, 5rem), 82rem)`), generous fluid main padding (`clamp(3rem, 7vw, 6.75rem)`), and a long-form reading measure capped at 70ch. At the implemented 48rem breakpoint, the shell narrows to a 1rem side gutter, the identity and navigation stack, tabs share the available width, chronological dates move beneath titles, and article metadata becomes one column.

The zh-TW homepage opens with an unbordered, title-free author introduction in the reading measure, separated from the register through generous whitespace. Its short paragraphs carry identity, subject, purpose, and audience without mini-headings. It then yields to a frameless chronological list whose header says only `文章`; dates stay with their individual rows, and no aggregate count competes with the writing. Headers, footers, articles, response endings, and list items use space rather than divider borders. Preserve that author-first sequence through the route surface brief; new surfaces inherit the system's stock, type, and glass logic without automatically inheriting the register topology.

**The Reading Measure Rule.** Keep sustained prose at or below 70ch and preserve the implemented 1.9 body line-height.

## Elevation & Depth

Depth is selective. Paper fields remain flat and gain atmosphere from the bright-stock radial wash and translucent tonal layering; only the fictional glass navigation receives shadows. The result should feel like optical refraction, not generic glossy UI.

### Shadow Vocabulary

- **Glass Rest** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 64%), inset 0 -1px 0 rgb(32 35 34 / 12%), 0 0.45rem 1.2rem rgb(32 35 34 / 10%)`): Gives navigation tabs their inset glass edges and restrained ambient separation.
- **Glass Hover** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 72%), inset 0 -1px 0 rgb(32 35 34 / 14%), 0 0.7rem 1.4rem rgb(32 35 34 / 14%)`): Adds a small lift and clearer refraction on pointer hover.

### Named Rules

**The Selective Glass Rule.** Reserve layered shadow and backdrop blur for functional glass navigation; reading surfaces stay flat, tonal, and frameless.

## Shapes

The form language is open rectilinear paper interrupted by top-edge tab silhouettes. Glass navigation uses softly rounded top corners (`0.75rem 0.75rem 0 0`), while the introduction, register, articles, response endings, and footer remain frameless. Clipped diagonal highlights stay inside glass controls as sparse refraction details; they never become illustration.

**The Top-edge Tab Rule.** Round the exposed top of a navigation tab while keeping its bottom edge visually flush with the header.

## Components

### Homepage Introduction

A title-free, 70ch introduction uses three short paragraphs to answer who the author is, what and why they write, and who they write for; a direct mail action closes the passage without a divider. The navigation's `關於` tab points to this section, and legacy About URLs redirect to the same anchor.

### Glass Navigation Tabs

The signature control is a conventional link made memorable through translucent cobalt, citron, or clear material. Each tab uses a 1px ink-derived border, top-only rounding, inset highlights, a clipped refraction mark, 14px backdrop blur with 135% saturation, and a 180ms lift. Active tabs deepen their family color; focus uses a 3px near-black outline, reduced-motion collapses transitions, and forced-colors replaces the material with system colors.

### Register Header

The implemented reading-route header says only `文章`. Update dates remain attached to their individual rows, and no aggregate article count is shown. The header and list remain frameless.

### Register Row

Rows are semantic list items, not cards. A tabular accession number, medium-weight linked title, and muted date align without divider rules; hover or focus-within introduces only an 8% cobalt wash. On narrow screens the date stacks under the title while the accession number remains aligned.

### Article Header and Reading Body

Article titles sit with the published date and an uppercase accession stamp, separated from prose by spacing rather than rules. The content column remains flat, centered, and no wider than 70ch. Blockquotes use indentation and muted ink rather than a card, quotation mark graphic, fill, or divider border.

### Reader Response

A quiet question and direct mail link close each article after generous whitespace. The response stays inside the 70ch reading flow, derives its address from shared metadata, and never becomes a card, divider, or glass control. The global footer shows the canonical address itself so short pages do not repeat the same call-to-action label.

## Do's and Don'ts

### Do:

- **Do** use cool stock, ink, alignment, and whitespace before reaching for accent color.
- **Do** keep the shared `李至青` site title/author identity at restrained signature scale and render it once.
- **Do** reserve the translucent cobalt/citron treatment for clear interactive state, with strong focus and forced-colors fallbacks.
- **Do** keep reading text in the system sans stack at a maximum 70ch measure and honor reduced motion.
- **Do** keep every type role at or below the confirmed `1.5rem` ceiling.

### Don't:

- **Don't** turn the Compact Register's page topology into a mandatory layout for unrelated surfaces; its composition belongs to the route brief.
- **Don't** introduce webfonts, handwritten imitation, or display-serif personality.
- **Don't** enlarge `李至青` into a hero or duplicate it as adjacent title and author labels.
- **Don't** restore oversized display headings; hierarchy must survive within the compact type ceiling.
- **Don't** flatten the world into depressing or boring minimalism, and don't literalize it as archival bureaucracy.
- **Don't** scatter cobalt and citron as decorative specks or apply glass depth to reading content.
- **Don't** use borders to separate content sections, article rows, response endings, or the global footer.
